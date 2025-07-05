import React, { useContext, useState } from "react";
import WeGoJapanLogo from "../../assets/icons/WeGoJapan_Logo.png";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../Context/AuthContext";
import { Menu, X } from "lucide-react";

const Header = () => {
  const navi = useNavigate();
  const { auth, logout } = useContext(AuthContext);
  const [menuOpen, setMenuOpen] = useState(false);

  const goTo = (path) => {
    navi(path);
    setMenuOpen(false);
  };

  return (
    <div className="w-full fixed top-0 z-50 bg-white shadow-md">
      <div className="flex justify-between items-center px-4 md:px-8 py-4">
        <div className="flex items-center">
          <img
            src={WeGoJapanLogo}
            className="h-14 object-contain cursor-pointer"
            onClick={() => goTo("/")}
          />
        </div>

        {/* PC용 로그인/회원가입 영역 */}
        <div className="hidden md:flex gap-4">
          {auth.isAuthenticated ? (
            <>
              {auth.loginInfo?.authorities?.some(
                (a) => a.authority === "ROLE_ADMIN"
              ) ? (
                <button
                  onClick={() => goTo("/adminPage")}
                  className="text-blue-600 font-semibold text-sm hover:text-sky-600"
                >
                  관리자 페이지
                </button>
              ) : (
                <button
                  onClick={() => goTo("/myPage")}
                  className="text-gray-700 text-sm hover:text-sky-600"
                >
                  나의 정보
                </button>
              )}
              <button
                onClick={logout}
                className="text-gray-700 text-sm hover:text-sky-600"
              >
                로그아웃
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => goTo("/login")}
                className="text-gray-700 text-sm hover:text-sky-600"
              >
                로그인
              </button>
              <button
                onClick={() => goTo("/signup")}
                className="text-gray-700 text-sm hover:text-sky-600"
              >
                회원가입
              </button>
            </>
          )}
        </div>

        {/* 모바일 햄버거 아이콘 */}
        <div className="md:hidden">
          <button onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {/* 네비게이션 메뉴 (PC 전용) */}
      <div
        className="hidden md:flex"
        style={{
          background:
            "linear-gradient(90deg, #87CEEB 0%, #4682B4 25%, #5F9EA0 50%, #20B2AA 75%, #48D1CC 100%)",
        }}
      >
        {["/", "/festivals", "/travels", "/myplan"].map((path, i) => (
          <button
            key={path}
            onClick={() => goTo(path)}
            className="flex-1 text-white text-center py-3 text-sm hover:text-opacity-80"
          >
            {["HOME", "축제", "여행지", "나의 플랜 세우기"][i]}
          </button>
        ))}
      </div>

      {/* 모바일 메뉴 열렸을 때 */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t">
          {["HOME", "축제", "여행지", "나의 플랜 세우기"].map((label, i) => (
            <button
              key={label}
              onClick={() =>
                goTo(["/", "/festivals", "/travels", "/myplan"][i])
              }
              className="block w-full text-left px-4 py-3 text-gray-700 hover:bg-gray-100"
            >
              {label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default Header;
