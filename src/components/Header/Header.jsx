import React, { useContext } from "react";
import WeGoJapanLogo from "../../assets/icons/WeGoJapan_Logo.png";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../Context/AuthContext";

const Header = () => {
  const navi = useNavigate();
  const { auth, logout } = useContext(AuthContext);

  // 로그인 상태 확인 함수
  const handleLogin = () => {
    navi("/login");
  };

  // 로그아웃 상태 확인 함수
  const handleLogout = () => {
    logout();
  };

  // 홈 페이지로 이동하는 함수
  const goToHome = () => {
    navi("/");
  };

  // 축제 페이지로 이동하는 함수
  const goToFestivals = () => {
    navi("/thema/travels");
  };

  // 여행지 페이지로 이동하는 함수
  const goToTravels = () => {
    navi("/travels");
  };

  // 나의 플랜 페이지로 이동하는 함수
  const goToMyPlan = () => {
    navi("/myplan");
  };

  // 내정보 페이지로 이동하는 함수
  const goToMyInfo = () => {
    navi("/myPage");
  };

  // 회원가입 페이지로 이동하는 함수
  const goToSignup = () => {
    navi("/signup");
  };

  return (
    <div className="w-full bg-white">
      <div className="flex justify-between items-center px-8 py-3">
        <div className="flex items-center">
          <img src={WeGoJapanLogo} className="h-12 object-contain" />
        </div>

        {/* 로그인 상태에 따라 다르게 표시 */}
        <div className="flex items-center space-x-6">
          {auth.isAuthenticated ? ( // 로그인된 상태라면
            <>
              {/*관리자 여부 판단 */}
              {auth.loginInfo?.authorities?.some(
                (auth) => auth.authority === "ROLE_ADMIN"
              ) ? (
                <button
                  onClick={() => navi("/adminPage")}
                  className="text-blue-600 font-semibold hover:text-sky-600 transition-colors duration-200 text-sm cursor-pointer"
                >
                  관리자 페이지
                </button>
              ) : (
                <button
                  onClick={goToMyInfo}
                  className="text-gray-700 hover:text-sky-600 transition-colors duration-200 text-sm cursor-pointer"
                >
                  나의 정보
                </button>
              )}

              {/* 로그아웃 */}
              <button
                onClick={handleLogout}
                className="text-gray-700 hover:text-sky-600 transition-colors duration-200 text-sm cursor-pointer"
              >
                로그아웃
              </button>
            </>
          ) : (
            // 로그인되지 않은 상태라면
            <>
              {/* 로그인 */}
              <button
                onClick={handleLogin}
                className="text-gray-700 hover:text-sky-600 transition-colors duration-200 text-sm cursor-pointer"
              >
                로그인
              </button>

              {/* 회원가입 */}
              <button
                onClick={goToSignup}
                className="text-gray-700 hover:text-sky-600 transition-colors duration-200 text-sm cursor-pointer"
              >
                회원가입
              </button>
            </>
          )}
        </div>
      </div>

      {/* 네비게이션 영역 */}
      <div
        className="w-full"
        style={{
          background:
            "linear-gradient(90deg, #87CEEB 0%, #4682B4 25%, #5F9EA0 50%, #20B2AA 75%, #48D1CC 100%)",
        }}
      >
        <div className="flex">
          <div className="flex-1 text-center py-3 px-4">
            <button
              onClick={goToHome}
              className="text-white font-medium hover:text-opacity-80 transition-colors duration-200 block w-full"
            >
              HOME
            </button>
          </div>

          <div className="flex-1 text-center py-3 px-4">
            <button
              onClick={goToFestivals}
              className="text-white font-medium hover:text-opacity-80 transition-colors duration-200 block w-full"
            >
              테마
            </button>
          </div>

          <div className="flex-1 text-center py-3 px-4">
            <button
              onClick={goToTravels}
              className="text-white font-medium hover:text-opacity-80 transition-colors duration-200 block w-full"
            >
              여행지
            </button>
          </div>

          <div className="flex-1 text-center py-3 px-4">
            <button
              onClick={goToMyPlan}
              className="text-white font-medium hover:text-opacity-80 transition-colors duration-200 block w-full"
            >
              나의 플랜 세우기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Header;
