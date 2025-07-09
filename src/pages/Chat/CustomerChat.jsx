import React, { useState, useEffect, useRef } from "react";
import { MessageCircle, Send, X, Phone, User } from "lucide-react";
import axios from "axios";

const CustomerChat = () => {
  const [customerInfo, setCustomerInfo] = useState(() => {
    const newId =
      "customer_" + Date.now() + "_" + Math.floor(Math.random() * 1000);
    return { id: newId, name: "" };
  });

  const [isOpen, setIsOpen] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [roomInfo, setRoomInfo] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [staffConnected, setStaffConnected] = useState(false);
  const [chatEnded, setChatEnded] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState("WAITING");
  const [hasReceivedStaffMessage, setHasReceivedStaffMessage] = useState(false);

  const stompClient = useRef(null);
  const messagesEndRef = useRef(null);

  // 웹소켓 URL 환경별 설정
  const getWebSocketUrl = () => {
    const hostname = window.location.hostname;

    // 로컬 개발 환경
    if (hostname === "localhost" || hostname === "127.0.0.1") {
      return "/ws";
    }

    // 프로덕션 환경 - wegojapan.shop (HTTPS이므로 WSS 사용)
    if (hostname === "wegojapan.shop") {
      return "https://wegojapan.shop/ws";
    }

    // 기타 환경
    const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
    const host = window.location.host;
    return `${protocol}://${host}/ws`;
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const connectWebSocket = (roomId) => {
    console.log("웹소켓 연결 시도 - roomId:", roomId);

    if (typeof SockJS === "undefined" || typeof Stomp === "undefined") {
      console.error("SockJS 또는 STOMP 라이브러리가 로드되지 않았습니다.");
      alert("채팅 서버에 접속하는데 필요한 라이브러리를 로드하지 못했습니다.");
      return;
    }

    try {
      const wsUrl = getWebSocketUrl();
      console.log("WebSocket URL:", wsUrl);

      const socket = new SockJS(wsUrl);
      stompClient.current = Stomp.over(socket);
      stompClient.current.debug = null;

      stompClient.current.connect(
        {},
        (frame) => {
          console.log("고객 WebSocket 연결 성공: " + frame);
          setIsConnected(true);

          const subscriptionPath = `/topic/chat/${roomId}`;
          console.log("구독 경로:", subscriptionPath);

          stompClient.current.subscribe(subscriptionPath, (message) => {
            console.log("새 메시지 수신:", message.body);
            const receivedMessage = JSON.parse(message.body);

            console.log("메시지 전체 분석:", {
              content: receivedMessage.content,
              senderId: receivedMessage.senderId,
              senderName: receivedMessage.senderName,
              customerInfoId: customerInfo.id,
              isStaff: receivedMessage.isStaff,
              type: receivedMessage.type,
              전체메시지: receivedMessage,
            });

            const isStaffEndMessage =
              receivedMessage.type === "LEAVE" ||
              receivedMessage.type === "CHAT_ENDED" ||
              receivedMessage.type === "CONSULTATION_ENDED" ||
              (receivedMessage.type === "SYSTEM" &&
                receivedMessage.isStaff === true &&
                (receivedMessage.content.includes("상담이 종료되었습니다") ||
                  receivedMessage.content.includes("상담을 종료했습니다") ||
                  receivedMessage.content.includes("상담 종료") ||
                  receivedMessage.content.includes(
                    "이용해 주셔서 감사합니다"
                  ))) ||
              (receivedMessage.senderName &&
                receivedMessage.senderName !== customerInfo.name &&
                (receivedMessage.content.includes("상담이 종료되었습니다") ||
                  receivedMessage.content.includes("상담을 종료했습니다")));

            if (isStaffEndMessage) {
              console.log("🔴 상담사 종료 메시지 감지! - 즉시 채팅 종료 처리");
              setStaffConnected(false);
              setChatEnded(true);
              setConnectionStatus("COMPLETED");
              setMessages((prev) => [...prev, receivedMessage]);
              setNewMessage("");
              console.log("채팅 종료 상태 설정 완료");
              return;
            }

            if (!chatEnded && connectionStatus !== "COMPLETED") {
              const isStaffMessage =
                receivedMessage.isStaff === true ||
                (receivedMessage.senderId !== customerInfo.id &&
                  receivedMessage.type === "CHAT" &&
                  receivedMessage.senderId &&
                  receivedMessage.senderId.startsWith("staff"));

              if (isStaffMessage && receivedMessage.type === "CHAT") {
                console.log("✅ 상담사 메시지 감지 - 상태를 ASSIGNED로 변경");
                setStaffConnected(true);
                setConnectionStatus("ASSIGNED");
                setHasReceivedStaffMessage(true);
              }
            }

            if (receivedMessage.type === "SYSTEM") {
              if (
                receivedMessage.content.includes("상담 종료") ||
                receivedMessage.content.includes("연결 종료") ||
                receivedMessage.content.includes("상담이 완료") ||
                receivedMessage.content.includes("직원이 나갔습니다")
              ) {
                console.log("🔴 시스템 메시지로 상담 종료 감지");
                setStaffConnected(false);
                setChatEnded(true);
                setConnectionStatus("COMPLETED");
              }
            }

            if (!isStaffEndMessage) {
              setMessages((prev) => [...prev, receivedMessage]);
            }
          });

          stompClient.current.subscribe(
            `/topic/chat/${roomId}/status`,
            (statusMessage) => {
              try {
                const statusData = JSON.parse(statusMessage.body);
                console.log("상태 데이터 분석:", statusData);

                if (
                  statusData.status === "STAFF_DISCONNECTED" ||
                  statusData.status === "CHAT_ENDED" ||
                  statusData.status === "CONSULTATION_ENDED" ||
                  statusData.message?.includes("상담을 종료")
                ) {
                  console.log("🔴 상태 메시지로 채팅 종료 감지");
                  setStaffConnected(false);
                  setChatEnded(true);
                  setConnectionStatus("COMPLETED");

                  const systemMessage = {
                    content: statusData.message || "상담이 종료되었습니다.",
                    senderName: "시스템",
                    type: "SYSTEM",
                    timestamp: statusData.timestamp || new Date().toISOString(),
                    isStaff: false,
                  };
                  setMessages((prev) => [...prev, systemMessage]);
                } else if (statusData.status === "STAFF_CONNECTED") {
                  console.log("상담사 연결됨 (대기 상태 유지)");
                }
              } catch (error) {
                console.error("상태 메시지 파싱 오류:", error);
              }
            }
          );

          enterRoom(roomId);
        },
        (error) => {
          console.error("고객 WebSocket 연결 실패: ", error);
          setIsConnected(false);
          setConnectionStatus("WAITING");
          setTimeout(() => {
            console.log("웹소켓 재연결 시도...");
            connectWebSocket(roomId);
          }, 3000);
        }
      );
    } catch (error) {
      console.error("WebSocket 연결 중 오류: ", error);
      setIsConnected(false);
      setConnectionStatus("WAITING");
    }
  };

  const disconnectWebSocket = () => {
    if (stompClient.current && stompClient.current.connected) {
      stompClient.current.disconnect(() => {
        console.log("WebSocket 연결이 해제되었습니다.");
      });
    }
    setIsConnected(false);
    setStaffConnected(false);
    setChatEnded(false);
    setConnectionStatus("WAITING");
    setHasReceivedStaffMessage(false);
  };

  const createOrJoinRoom = () => {
    if (!customerInfo.name.trim()) {
      alert("이름을 입력해주세요.");
      return;
    }

    setIsLoading(true);
    setConnectionStatus("WAITING");

    let createdRoomData = null;

    axios
      .post("/api/chat/create", {
        userId: customerInfo.id,
        userName: customerInfo.name,
      })
      .then((response) => {
        createdRoomData = response.data;
        setRoomInfo(createdRoomData);
        return axios.get(`/api/chat/room/${createdRoomData.roomId}/messages`);
      })
      .then((messagesResponse) => {
        setMessages(messagesResponse.data);
        if (createdRoomData && createdRoomData.roomId) {
          connectWebSocket(createdRoomData.roomId);
        }
      })
      .catch((error) => {
        console.error("채팅방 생성/조회 실패: ", error);
        const errorMessage =
          error.response?.data?.message || error.message || "알 수 없는 오류";
        alert(`채팅방 연결에 실패했습니다: ${errorMessage}`);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const enterRoom = (roomId) => {
    console.log("채팅방 입장 메시지 전송 시도 - roomId:", roomId);

    if (stompClient.current && stompClient.current.connected) {
      const enterMessage = {
        roomId: roomId,
        senderId: customerInfo.id,
        senderName: customerInfo.name,
        content: `${customerInfo.name}님이 상담을 시작했습니다.`,
        type: "ENTER",
        isStaff: false,
      };

      console.log("입장 메시지 전송:", enterMessage);
      stompClient.current.send(
        "/app/chat/enterRoom",
        {},
        JSON.stringify(enterMessage)
      );
      console.log("입장 메시지 전송 완료");
    } else {
      console.error("STOMP 클라이언트가 연결되지 않았습니다.");
    }
  };

  const sendMessage = () => {
    if (chatEnded || connectionStatus === "COMPLETED") {
      alert("상담이 종료되어 메시지를 보낼 수 없습니다.");
      return;
    }

    if (
      !newMessage.trim() ||
      !stompClient.current ||
      !stompClient.current.connected ||
      !roomInfo
    ) {
      return;
    }

    const message = {
      roomId: roomInfo.roomId,
      senderId: customerInfo.id,
      senderName: customerInfo.name,
      content: newMessage.trim(),
      type: "CHAT",
      isStaff: false,
    };

    stompClient.current.send(
      "/app/chat/sendMessage",
      {},
      JSON.stringify(message)
    );

    setNewMessage("");
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const openChat = () => setIsOpen(true);

  const closeChat = () => {
    setIsOpen(false);
    disconnectWebSocket();
    setMessages([]);
    setRoomInfo(null);
    setStaffConnected(false);
    setChatEnded(false);
    setConnectionStatus("WAITING");
    setHasReceivedStaffMessage(false);

    const newId =
      "customer_" + Date.now() + "_" + Math.floor(Math.random() * 1000);
    setCustomerInfo({ id: newId, name: "" });
  };

  const formatTime = (timestamp) => {
    if (!timestamp) return "";
    const date = new Date(timestamp);
    return date.toLocaleTimeString("ko-KR", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const isMyMessage = (message) => {
    return message.senderId === customerInfo.id;
  };

  const getConnectionStatusInfo = () => {
    if (chatEnded) {
      return {
        message: "상담이 종료되었습니다",
        bgColor: "bg-red-100",
        textColor: "text-red-700",
      };
    } else if (staffConnected) {
      return {
        message: "상담사와 연결되었습니다",
        bgColor: "bg-green-100",
        textColor: "text-green-700",
      };
    } else if (isConnected) {
      return {
        message: "상담사 배정 대기중입니다",
        bgColor: "bg-yellow-100",
        textColor: "text-yellow-700",
      };
    } else {
      return {
        message: "연결 중입니다...",
        bgColor: "bg-gray-100",
        textColor: "text-gray-700",
      };
    }
  };

  return (
    <>
      {!isOpen && (
        <button
          onClick={openChat}
          className="fixed bottom-4 right-4 bg-blue-600 hover:bg-blue-700 text-white rounded-full p-4 shadow-lg transition-all duration-300 z-50 flex items-center space-x-2"
        >
          <MessageCircle size={24} />
          <span className="hidden md:block">상담하기</span>
        </button>
      )}

      {isOpen && (
        <div className="fixed bottom-4 right-4 w-80 h-96 bg-white rounded-lg shadow-xl border border-gray-200 flex flex-col z-50">
          <div className="bg-blue-600 text-white p-4 rounded-t-lg flex justify-between items-center flex-shrink-0">
            <div className="flex items-center space-x-2">
              <Phone size={18} />
              <span className="font-medium">WeGoJapan 상담</span>
            </div>
            <button
              onClick={closeChat}
              className="hover:bg-blue-700 p-1 rounded"
            >
              <X size={18} />
            </button>
          </div>

          <div className="flex-1 flex flex-col min-h-0">
            {!roomInfo ? (
              <div className="flex-1 flex flex-col justify-center items-center p-4">
                <User size={48} className="text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-800 mb-2">
                  상담 시작
                </h3>
                <p className="text-sm text-gray-600 mb-4 text-center">
                  WeGoJapan 에 대해 궁금한 것이 있으시면
                  <br />
                  언제든 문의해주세요!
                </p>

                <input
                  type="text"
                  placeholder="이름을 입력해주세요"
                  value={customerInfo.name}
                  onChange={(e) =>
                    setCustomerInfo((prev) => ({
                      ...prev,
                      name: e.target.value,
                    }))
                  }
                  className="w-full p-2 border border-gray-300 rounded-lg mb-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  onKeyPress={(e) => e.key === "Enter" && createOrJoinRoom()}
                />

                <button
                  onClick={createOrJoinRoom}
                  disabled={isLoading || !customerInfo.name.trim()}
                  className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white py-2 px-4 rounded-lg transition-colors"
                >
                  {isLoading ? "연결 중.." : "상담 시작"}
                </button>
              </div>
            ) : (
              <>
                {(() => {
                  const statusInfo = getConnectionStatusInfo();
                  return (
                    <div
                      className={`px-4 py-2 text-xs text-center flex-shrink-0 flex items-center justify-center space-x-2 ${statusInfo.bgColor} ${statusInfo.textColor}`}
                    >
                      <span>{statusInfo.icon}</span>
                      <span>{statusInfo.message}</span>
                    </div>
                  );
                })()}

                <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50 min-h-0">
                  {messages.length === 0 && (
                    <div className="text-center text-gray-500 text-sm">
                      안녕하세요! We Go Japan에 대해 궁금한 것이 있으시면 언제든
                      물어보세요.
                    </div>
                  )}

                  {messages.map((message, index) => {
                    const isMyMsg = message.senderId === customerInfo.id;

                    console.log("메시지 확인:", {
                      content: message.content,
                      senderId: message.senderId,
                      customerInfoId: customerInfo.id,
                      isMyMsg: isMyMsg,
                    });

                    return (
                      <div
                        key={index}
                        className={`flex ${
                          isMyMsg ? "justify-end" : "justify-start"
                        }`}
                      >
                        <div
                          className={`max-w-xs px-3 py-2 rounded-lg text-sm break-words ${
                            isMyMsg
                              ? "bg-blue-600 text-white"
                              : "bg-white text-gray-800 border border-gray-200"
                          }`}
                        >
                          {!isMyMsg && (
                            <div className="text-xs font-medium mb-1 text-gray-600">
                              {message.senderName || "직원"}
                            </div>
                          )}
                          <div className="whitespace-pre-wrap">
                            {message.content}
                          </div>
                          <div
                            className={`text-xs mt-1 text-right ${
                              isMyMsg ? "text-blue-200" : "text-gray-500"
                            }`}
                          >
                            {formatTime(message.timestamp)}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                  <div ref={messagesEndRef} />
                </div>

                <div className="border-t border-gray-200 p-4 flex-shrink-0 bg-white">
                  {(chatEnded || connectionStatus === "COMPLETED") && (
                    <div className="text-center text-red-600 text-sm mb-2 p-3 bg-red-50 rounded border border-red-200">
                      <span className="font-bold">채팅이 종료되었습니다</span>
                      <br />
                      <span className="text-xs">
                        더 이상 메시지를 보낼 수 없습니다.
                      </span>
                    </div>
                  )}

                  <div className="flex space-x-2">
                    <input
                      type="text"
                      placeholder={
                        chatEnded || connectionStatus === "COMPLETED"
                          ? "상담이 종료되었습니다"
                          : "메시지를 입력하세요."
                      }
                      value={
                        chatEnded || connectionStatus === "COMPLETED"
                          ? ""
                          : newMessage
                      }
                      onChange={(e) => {
                        if (chatEnded || connectionStatus === "COMPLETED") {
                          return;
                        }
                        setNewMessage(e.target.value);
                      }}
                      onKeyPress={handleKeyPress}
                      className="flex-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                      disabled={
                        !isConnected ||
                        chatEnded ||
                        connectionStatus === "COMPLETED"
                      }
                    />
                    <button
                      onClick={sendMessage}
                      disabled={
                        !newMessage.trim() ||
                        !isConnected ||
                        chatEnded ||
                        connectionStatus === "COMPLETED"
                      }
                      className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white p-2 rounded-lg transition-colors"
                    >
                      <Send size={18} />
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default CustomerChat;
