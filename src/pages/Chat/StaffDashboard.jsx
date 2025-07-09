import React, { useState, useEffect, useRef } from "react";
import {
  MessageSquare,
  Users,
  Clock,
  CheckCircle,
  Send,
  X,
  User,
  Bell,
  ArrowRightCircle,
} from "lucide-react";
import axios from "axios";

const StaffDashboard = () => {
  const [staffInfo, setStaffInfo] = useState({
    id: "staff_" + Date.now(),
    name: "",
  });

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [waitingRooms, setWaitingRooms] = useState([]);
  const [activeRooms, setActiveRooms] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [notifications, setNotifications] = useState([]);

  const stompClient = useRef(null);
  const subscription = useRef(null);
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
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const connectWebSocket = () => {
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
          console.log("직원 WebSocket 연결 성공: " + frame);
          setIsConnected(true);

          stompClient.current.subscribe(
            "/topic/staff/new-request",
            (message) => {
              const newRoom = JSON.parse(message.body);
              setNotifications((prev) => [
                {
                  id: Date.now(),
                  message: `새로운 상담 요청: ${newRoom.customerName}`,
                  timestamp: new Date(),
                  roomId: newRoom.roomId,
                  type: "new-request",
                  data: newRoom,
                },
                ...prev,
              ]);
              loadWaitingRooms();
            }
          );

          stompClient.current.subscribe(
            "/topic/staff/notification",
            (message) => {
              const notification = message.body;
              setNotifications((prev) => [
                {
                  id: Date.now(),
                  message: notification,
                  timestamp: new Date(),
                  type: "general",
                },
                ...prev,
              ]);
              loadWaitingRooms();
            }
          );

          stompClient.current.subscribe(
            "/topic/staff/consultation-started",
            (message) => {
              const notification = message.body;
              setNotifications((prev) => [
                {
                  id: Date.now(),
                  message: notification,
                  timestamp: new Date(),
                  type: "consultation-started",
                },
                ...prev,
              ]);
              loadWaitingRooms();
              loadActiveRooms();
            }
          );
        },
        (error) => {
          console.error("직원 WebSocket 연결 실패: ", error);
          setIsConnected(false);
          setTimeout(connectWebSocket, 5000);
        }
      );
    } catch (error) {
      console.error("WebSocket 연결 중 오류: ", error);
    }
  };

  const staffLogin = () => {
    if (!staffInfo.name.trim()) {
      alert("직원 이름을 입력해주세요.");
      return;
    }
    setIsLoggedIn(true);
    connectWebSocket();
    loadWaitingRooms();
    loadActiveRooms();
  };

  const loadWaitingRooms = () => {
    axios
      .get("/api/chat/staff/waiting-rooms")
      .then((response) => {
        if (response.data && Array.isArray(response.data.rooms)) {
          setWaitingRooms(response.data.rooms);
        } else {
          console.error(
            "대기중인 채팅방 목록을 가져오지 못했습니다. 서버 응답:",
            response.data
          );
          setWaitingRooms([]);
        }
      })
      .catch((error) => {
        console.error(
          "대기중인 채팅방 로드 실패 (네트워크 또는 서버 오류):",
          error
        );
        setWaitingRooms([]);
      });
  };

  const loadActiveRooms = () => {
    if (!staffInfo.id) return;

    axios
      .get(`/api/chat/staff/${staffInfo.id}/active-rooms`)
      .then((response) => {
        if (response.data && Array.isArray(response.data.rooms)) {
          setActiveRooms(response.data.rooms);
        } else {
          console.error(
            "담당중인 채팅방 목록을 가져오지 못했습니다. 서버 응답:",
            response.data
          );
          setActiveRooms([]);
        }
      })
      .catch((error) => {
        console.error(
          "담당중인 채팅방 로드 실패 (네트워크 또는 서버 오류):",
          error
        );
        setActiveRooms([]);
      });
  };

  const startConsultation = (room) => {
    if (!stompClient.current || !isConnected) {
      alert("WebSocket 연결이 필요합니다.");
      return;
    }

    const consultationData = {
      roomId: room.roomId,
      senderId: staffInfo.id,
      senderName: staffInfo.name,
    };
    stompClient.current.send(
      "/app/chat/startConsultation",
      {},
      JSON.stringify(consultationData)
    );

    setWaitingRooms((prev) => prev.filter((r) => r.roomId !== room.roomId));
    setActiveRooms((prev) => [{ ...room, staffName: staffInfo.name }, ...prev]);
    selectRoom({ ...room, staffName: staffInfo.name });
  };

  const selectRoom = (room) => {
    if (selectedRoom?.roomId === room.roomId) return;

    setSelectedRoom(room);
    setMessages([]);

    if (subscription.current) {
      subscription.current.unsubscribe();
    }

    axios
      .get(`/api/chat/room/${room.roomId}/messages`)
      .then((response) => {
        setMessages(response.data);
      })
      .catch((error) => {
        console.error("메시지 로드 실패: ", error);
      })
      .finally(() => {
        if (stompClient.current && isConnected) {
          subscription.current = stompClient.current.subscribe(
            `/topic/chat/${room.roomId}`,
            (message) => {
              const receivedMessage = JSON.parse(message.body);
              setMessages((prev) => [...prev, receivedMessage]);
            }
          );
        }
      });
  };

  const sendMessage = () => {
    if (
      !newMessage.trim() ||
      !stompClient.current ||
      !isConnected ||
      !selectedRoom
    ) {
      return;
    }

    const message = {
      roomId: selectedRoom.roomId,
      senderId: staffInfo.id,
      senderName: staffInfo.name,
      content: newMessage.trim(),
      type: "CHAT",
      isStaff: true,
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

  const endConsultation = () => {
    if (!selectedRoom || !window.confirm("정말로 상담을 종료하시겠습니까?"))
      return;

    if (stompClient.current && isConnected) {
      const endMessage = {
        roomId: selectedRoom.roomId,
        senderId: staffInfo.id,
        senderName: staffInfo.name,
        content: "상담이 종료되었습니다. 이용해 주셔서 감사합니다.",
        type: "SYSTEM",
        isStaff: true,
      };

      console.log("상담 종료 메시지 전송:", endMessage);

      stompClient.current.send(
        "/app/chat/sendMessage",
        {},
        JSON.stringify(endMessage)
      );

      const leaveMessage = {
        roomId: selectedRoom.roomId,
        senderId: staffInfo.id,
        senderName: staffInfo.name,
        content: `${staffInfo.name} 상담사가 상담을 종료했습니다.`,
        type: "LEAVE",
        isStaff: true,
      };

      stompClient.current.send(
        "/app/chat/sendMessage",
        {},
        JSON.stringify(leaveMessage)
      );

      console.log("상담사 퇴장 메시지 전송:", leaveMessage);
    }

    axios
      .put(`/api/chat/room/${selectedRoom.roomId}/close`)
      .then((response) => {
        if (response.data && response.data.success) {
          alert("상담이 종료되었습니다.");
          setActiveRooms((prev) =>
            prev.filter((r) => r.roomId !== selectedRoom.roomId)
          );
          setSelectedRoom(null);
          setMessages([]);

          if (subscription.current) {
            subscription.current.unsubscribe();
            subscription.current = null;
          }
        } else {
          alert(
            "상담 종료에 실패했습니다: " +
              (response.data?.message || "알 수 없는 오류")
          );
        }
      })
      .catch((error) => {
        console.error("상담 종료 실패: ", error);
        alert("상담 종료 중 오류가 발생했습니다.");
      });
  };

  const handleNotificationClick = (notification) => {
    if (notification.type === "new-request" && notification.data) {
      startConsultation(notification.data);
      removeNotification(notification.id);
    }
  };

  const removeNotification = (id) => {
    setNotifications((prev) =>
      prev.filter((notification) => notification.id !== id)
    );
  };

  const formatTime = (timestamp) => {
    if (!timestamp) return "";
    return new Date(timestamp).toLocaleTimeString("ko-KR", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const isMyMessage = (message) => {
    if (message.senderId === staffInfo.id) {
      return true;
    }

    if (message.isStaff === true && message.senderName === staffInfo.name) {
      return true;
    }

    if (message.senderName === staffInfo.name) {
      return true;
    }

    return false;
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md w-96">
          <div className="text-center mb-6">
            <User size={48} className="mx-auto text-blue-600 mb-4" />
            <h2 className="text-2xl font-bold text-gray-800">직원 로그인</h2>
            <p className="text-gray-600 mt-2">WeGoJapan 상담 시스템</p>
          </div>

          <input
            type="text"
            placeholder="직원 이름을 입력하세요"
            value={staffInfo.name}
            onChange={(e) =>
              setStaffInfo((prev) => ({ ...prev, name: e.target.value }))
            }
            className="w-full p-3 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
            onKeyPress={(e) => e.key === "Enter" && staffLogin()}
          />

          <button
            onClick={staffLogin}
            disabled={!staffInfo.name.trim()}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white py-3 px-4 rounded-lg transition-colors"
          >
            로그인
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <MessageSquare className="text-blue-600" size={32} />
              <div>
                <h1 className="text-xl font-bold text-gray-900">
                  상담 관리 대시보드
                </h1>
                <p className="text-sm text-gray-600">{staffInfo.name} 직원</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div
                className={`flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                  isConnected
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                <span
                  className={`w-2 h-2 mr-2 rounded-full ${
                    isConnected ? "bg-green-500" : "bg-red-500"
                  }`}
                ></span>
                {isConnected ? "연결됨" : "연결 안됨"}
              </div>

              {notifications.length > 0 && (
                <div className="relative">
                  <Bell className="text-orange-500 animate-pulse" size={24} />
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {notifications.length}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 space-y-6">
            {notifications.length > 0 && (
              <div className="bg-white rounded-lg shadow p-4">
                <h3 className="text-lg font-medium text-gray-900 mb-3 flex items-center">
                  <Bell size={20} className="mr-2 text-orange-500" /> 알림
                </h3>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`bg-orange-50 border border-orange-200 rounded p-3 flex justify-between items-start ${
                        notification.type === "new-request"
                          ? "cursor-pointer hover:bg-orange-100"
                          : ""
                      }`}
                      onClick={() => handleNotificationClick(notification)}
                    >
                      <div className="flex-1">
                        <p className="text-sm text-orange-800">
                          {notification.message}
                          {notification.type === "new-request" && (
                            <span className="block text-xs text-orange-600 mt-1">
                              클릭하여 상담 시작
                            </span>
                          )}
                        </p>
                        <p className="text-xs text-orange-600 mt-1">
                          {formatTime(notification.timestamp)}
                        </p>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          removeNotification(notification.id);
                        }}
                        className="text-orange-400 hover:text-orange-600"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="bg-white rounded-lg shadow p-4">
              <h3 className="text-lg font-medium text-gray-900 mb-3 flex items-center">
                <Clock size={20} className="mr-2 text-yellow-500" /> 대기중인
                상담 ({waitingRooms.length})
              </h3>
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {waitingRooms.length === 0 ? (
                  <p className="text-gray-500 text-sm p-3 text-center">
                    대기중인 상담이 없습니다.
                  </p>
                ) : (
                  waitingRooms.map((room) => (
                    <div
                      key={room.roomId}
                      className="border border-gray-200 rounded-lg p-3 hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h4 className="font-medium text-gray-900">
                            {room.customerName}
                          </h4>
                          <p className="text-sm text-gray-500">
                            요청 시간: {formatTime(room.createdAt)}
                          </p>
                        </div>
                        <button
                          onClick={() => startConsultation(room)}
                          className="bg-green-500 text-white px-3 py-1 rounded-md text-sm hover:bg-green-600 flex items-center space-x-1"
                        >
                          <ArrowRightCircle size={16} />
                          <span>상담 시작</span>
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-4">
              <h3 className="text-lg font-medium text-gray-900 mb-3 flex items-center">
                <Users size={20} className="mr-2 text-blue-500" /> 담당중인 상담
                ({activeRooms.length})
              </h3>
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {activeRooms.length === 0 ? (
                  <p className="text-gray-500 text-sm p-3 text-center">
                    담당중인 상담이 없습니다.
                  </p>
                ) : (
                  activeRooms.map((room) => (
                    <div
                      key={room.roomId}
                      onClick={() => selectRoom(room)}
                      className={`p-3 rounded-lg cursor-pointer transition-colors ${
                        selectedRoom?.roomId === room.roomId
                          ? "bg-blue-100 border-blue-500"
                          : "bg-white border-gray-200 hover:bg-blue-50"
                      } border`}
                    >
                      <div className="flex justify-between items-center">
                        <h4 className="font-medium text-gray-900">
                          {room.customerName}
                        </h4>
                        {selectedRoom?.roomId === room.roomId && (
                          <span className="text-xs font-bold text-blue-600">
                            진행중
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600">
                        담당자: {room.staffName}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow h-[calc(100vh-12rem)] flex flex-col">
              {selectedRoom ? (
                <>
                  <div className="p-4 border-b flex justify-between items-center">
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">
                        {selectedRoom.customerName}
                      </h3>
                      <p className="text-sm text-gray-500">
                        상담이 진행중입니다.
                      </p>
                    </div>
                    <button
                      onClick={endConsultation}
                      className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded transition-colors flex items-center space-x-2"
                    >
                      <X size={16} />
                      <span>상담 종료</span>
                    </button>
                  </div>

                  <div className="flex-1 p-4 overflow-y-auto bg-gray-50">
                    <div className="space-y-4">
                      {messages.map((msg, index) => {
                        const isMyMsg = isMyMessage(msg);

                        return (
                          <div
                            key={index}
                            className={`flex ${
                              isMyMsg ? "justify-end" : "justify-start"
                            }`}
                          >
                            <div
                              className={`max-w-xs md:max-w-md lg:max-w-lg p-3 rounded-lg ${
                                isMyMsg
                                  ? "bg-blue-500 text-white"
                                  : "bg-gray-200 text-gray-800"
                              }`}
                            >
                              {!isMyMsg && (
                                <p className="text-xs font-bold text-gray-600 mb-1">
                                  {msg.senderName || "고객"}
                                </p>
                              )}
                              <p className="text-sm whitespace-pre-wrap">
                                {msg.content}
                              </p>
                              <p
                                className={`text-xs mt-1 ${
                                  isMyMsg ? "text-blue-200" : "text-gray-500"
                                } text-right`}
                              >
                                {formatTime(msg.timestamp)}
                              </p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                    <div ref={messagesEndRef} />
                  </div>

                  <div className="p-4 border-t bg-white">
                    <div className="flex items-center space-x-3">
                      <textarea
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="메시지를 입력하세요..."
                        className="flex-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                        rows="2"
                      />
                      <button
                        onClick={sendMessage}
                        disabled={!newMessage.trim()}
                        className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white p-3 rounded-lg transition-colors"
                      >
                        <Send size={20} />
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-center text-gray-500">
                  <MessageSquare size={64} className="mb-4 text-gray-300" />
                  <h3 className="text-xl font-medium">상담을 시작해주세요.</h3>
                  <p className="mt-2">
                    왼쪽 목록에서 '대기중인 상담'을 시작하거나
                    <br />
                    '담당중인 상담'을 선택하여 채팅을 시작할 수 있습니다.
                    <br />
                    <span className="text-orange-600 font-medium">
                      알림을 클릭하여 바로 상담을 시작할 수도 있습니다.
                    </span>
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StaffDashboard;
