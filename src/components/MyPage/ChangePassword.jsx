import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { pwRegex } from "../Auth/Regex";
import { AuthContext } from "../Context/AuthContext";
import StepButton from "../common/MyPlan/StepButton";
import axios from "axios";

const ChangePassword = () => {
  const { auth, logout } = useContext(AuthContext);
  const [currentPw, setCurrentPw] = useState("");
  const [newPw, setNewPw] = useState("");
  const [confirmPw, setConfirmPw] = useState("");
  const [error, setError] = useState("");
  const apiUrl = window.ENV?.API_URL || "http://localhost:8000";
  const username = auth?.loginInfo?.username;
  const navigate = useNavigate();

  const handleConfirm = () => {
    if (newPw !== confirmPw) {
      setError("비밀번호가 일치하지 않습니다.");
      return;
    }

    if (!pwRegex.test(newPw)) {
      setError("비밀번호는 영문, 숫자, 특수문자 포함 8~12자여야 합니다.");
      return;
    }

    setError("");

    axios
      .patch(
        `${apiUrl}/api/members/changePassword`,
        {
          memberId: username,
          currentPassword: currentPw,
          newPassword: newPw,
        },
        {
          headers: {
            Authorization: `Bearer ${auth.tokens.accessToken}`,
          },
        }
      )
      .then((response) => {
        if (response.status === 200) {
          setNewPw(newPw);
          alert("비밀번호가 성공적으로 변경되었습니다.");
          logout();
          navigate("/login");
        }
      })
      .catch((err) => {
        console.error("요청 실패:", err);
      });
  };

  const handleCancel = () => {
    navigate("/mypage");
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-6">비밀번호 변경</h2>

        <div className="space-y-4">
          <input
            type="password"
            placeholder="현재 비밀번호를 입력하세요"
            className="w-full border border-gray-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={currentPw}
            onChange={(e) => setCurrentPw(e.target.value)}
          />
          <input
            type="password"
            placeholder="새로 설정할 비밀번호를 입력하세요"
            className="w-full border border-gray-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={newPw}
            onChange={(e) => setNewPw(e.target.value)}
          />
          <input
            type="password"
            placeholder="새로 설정한 비밀번호를 다시 입력 해주세요"
            className="w-full border border-gray-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={confirmPw}
            onChange={(e) => setConfirmPw(e.target.value)}
          />

          {/* ✅ 실시간 비밀번호 일치 확인 메시지 */}
          {confirmPw.length > 0 && (
            <p
              className={`text-sm mt-1 ${
                confirmPw === newPw ? "text-blue-500" : "text-red-500"
              } text-center`}
            >
              {confirmPw === newPw
                ? "비밀번호가 일치합니다."
                : "비밀번호가 일치하지 않습니다."}
            </p>
          )}
        </div>

        {/* 버튼 누른 후 에러 메시지 */}
        {error && (
          <p className="text-red-500 text-sm mt-2 text-center">{error}</p>
        )}

        <div className="flex gap-4 justify-center">
          <StepButton type="next" onClick={handleConfirm} className="w-[48%]">
            확인
          </StepButton>
          <StepButton type="prev" onClick={handleCancel} className="w-[48%]">
            취소
          </StepButton>
        </div>
      </div>
    </div>
  );
};

export default ChangePassword;
