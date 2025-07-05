import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../Context/AuthContext";
import ChangeNameModal from "./ChangeNameModal"; // 모달 컴포넌트 import
import MyTravelPlanList from "../../pages/MyPlan/MyTravelPlanList";

const MyPage = () => {
  const { auth } = useContext(AuthContext);
  const { loginInfo, isLoading, isAuthenticated } = auth;
  const navigate = useNavigate();
  const [showChangeNameModal, setShowChangeNameModal] = useState(false); // 모달 상태

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      alert("로그인이 필요한 서비스입니다.");
      navigate("/login");
    }
  }, [isLoading, isAuthenticated, navigate]);

  const buttons = [
    {
      src: "/닉네임변경.png",
      text: "닉네임 변경",
      action: () => setShowChangeNameModal(true),
    },
    {
      src: "/비밀번호변경.png",
      text: "비밀번호 변경",
      path: "/mypage/changePassword",
    },
    {
      src: "/나의여행계획조회.png",
      text: "나의 여행 계획 조회",
      path: "/myplan/list",
    },
    {
      src: "/나의리뷰조회.png",
      text: "나의 리뷰 조회",
      path: "/mypage/reviews",
    },
    {
      src: "/즐겨찾기조회.png",
      text: "즐겨 찾기 조회",
      path: "/mypage/favorites",
    },
    {
      src: "/회원탈퇴.png",
      text: "회원 탈퇴",
      path: "/mypage/deleteMember",
    },
  ];

  return (
    <div className="relative p-6 max-w-4xl mx-auto">
      {" "}
      {/* relative 필수 */}
      <h2 className="text-gray-500 text-sm mb-2">마이페이지</h2>
      <div className="bg-white shadow p-6 rounded-lg">
        <h1 className="text-xl font-semibold mb-6">
          {loginInfo.memberName} 님 마이 페이지
        </h1>

        <div className="grid grid-cols-3 gap-4">
          {buttons.map((btn, index) => (
            <button
              key={index}
              className="flex flex-col items-center gap-2 border p-4 rounded-lg hover:bg-gray-100"
              onClick={() => (btn.action ? btn.action() : navigate(btn.path))}
            >
              <img src={btn.src} alt={btn.text} className="w-20 h-20" />
              <span className="text-sm">{btn.text}</span>
            </button>
          ))}
        </div>
      </div>
      {/* 닉네임 변경 모달 */}
      {showChangeNameModal && (
        <ChangeNameModal onClose={() => setShowChangeNameModal(false)} />
      )}
    </div>
  );
};

export default MyPage;
