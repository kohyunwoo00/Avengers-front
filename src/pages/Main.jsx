import React, { useEffect, useState } from "react";
import ImageSlider from "../components/Main/ImageSlider";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import SliderSection from "./Travel/common/SliderSection";
import {
  Briefcase,
  BatteryCharging,
  CreditCard,
  Map,
  Train,
  Home,
} from "lucide-react"; // 아이콘 추가

const Main = () => {
  const navigate = useNavigate();
  const API_URL = window.ENV.API_URL;

  const [currentSlide, setCurrentSlide] = useState(0);
  const [travelList, setTravelList] = useState([]);
  const [popularList, setPopularList] = useState([]);

  useEffect(() => {
    fetchTravelList();
  }, []);

  const fetchTravelList = () => {
    axios
      .get(`${API_URL}/api/travels`, {
        params: {
          page: 1,
          size: 5,
        },
      })
      .then((res) => {
        const { data } = res.data.data;
        setPopularList(data.slice(0, 5));
        setTravelList(data.slice(5));
      })
      .catch((err) => console.error("여행지 목록 조회 실패:", err));
  };

  return (
    <div>
      {/* 이미지 슬라이더 */}
      <ImageSlider />

      {/* ✅ 사이트 소개 섹션 */}
      <section className="relative h-[480px] sm:h-[520px] bg-gradient-to-br from-blue-100 via-white to-teal-100">
        <div className="absolute inset-0 bg-cover bg-center bg-[url('/images/japan-hero.jpg')] opacity-80" />
        <div className="absolute inset-0 bg-white/60 backdrop-blur-sm" />
        <div className="relative z-10 max-w-6xl mx-auto h-full flex flex-col justify-center items-center text-center px-4">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-blue-800 mb-4 drop-shadow-md">
            일본 오사카 여행, 지금 시작해보세요
          </h1>
          <p className="text-lg sm:text-xl text-gray-700 mb-6 max-w-xl">
            도쿄, 오사카, 교토부터 숨겨진 여행지까지
            <br />
            감성 가득한 여행 플랜을 만들어보세요.
          </p>
          <button
            onClick={() => navigate("/travels/search")}
            className="bg-gradient-to-r from-cyan-400 to-blue-500 text-white font-semibold px-6 py-3 rounded-full shadow-lg hover:brightness-110 transition"
          >
            테마 여행지 찾아보기
          </button>
        </div>
      </section>

      {/* ✅ 추천 여행지 섹션 */}
      <section className="mt-10 px-4">
        <h2 className="text-xl font-bold mb-4">추천 여행지</h2>
        <section className="mb-12">
          <SliderSection
            items={popularList || []}
            currentSlide={currentSlide}
            setCurrentSlide={setCurrentSlide}
          />
        </section>
      </section>

      {/* ✅ 일본 여행 준비물 체크리스트 */}
      <section className="px-4 mt-20 mb-16">
        <h2 className="text-2xl font-bold text-blue-900 mb-8 text-center">
          🧳️ 일본 여행 준비물 체크리스트
        </h2>
        <div className="flex justify-center overflow-x-auto gap-6">
          {[
            {
              icon: <Briefcase className="w-8 h-8 text-blue-600" />,
              label: "여권",
              desc: "입국 필수 신분증",
              bg: "from-blue-50 to-cyan-100",
            },
            {
              icon: <BatteryCharging className="w-8 h-8 text-green-600" />,
              label: "보조배터리",
              desc: "긴 여행엔 충전 필수",
              bg: "from-green-50 to-lime-100",
            },
            {
              icon: <CreditCard className="w-8 h-8 text-purple-600" />,
              label: "일본 엔화",
              desc: "현금 사용 비중 높음",
              bg: "from-purple-50 to-pink-100",
            },
            {
              icon: <Map className="w-8 h-8 text-orange-600" />,
              label: "여행 일정표",
              desc: "효율적 동선 계획",
              bg: "from-orange-50 to-yellow-100",
            },
            {
              icon: <Train className="w-8 h-8 text-red-600" />,
              label: "JR 패스",
              desc: "장거리 이동에 필수",
              bg: "from-red-50 to-pink-100",
            },
          ].map((item, idx) => (
            <div
              key={idx}
              className={`min-w-[160px] h-[160px] flex flex-col items-center justify-center rounded-xl shadow-sm hover:shadow-md transition bg-gradient-to-br ${item.bg}`}
            >
              {item.icon}
              <p className="mt-3 text-base font-semibold text-gray-800 text-center">
                {item.label}
              </p>
              <p className="text-xs text-gray-600 mt-1 text-center">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ✅ 여행 꿀팁 카드 섹션 */}
      <section className="px-4 mb-20">
        <h2 className="text-xl font-bold text-blue-900 mb-4 text-center">
          📌 여행 꿀팁
        </h2>

        {/* 플래너 추천 미니배너 */}
        <section
          onClick={() => navigate("/myplan")}
          className="relative mx-4 sm:mx-auto sm:max-w-6xl mb-16 cursor-pointer rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition duration-300"
        >
          <div className="absolute inset-0 bg-[linear-gradient(100deg,_rgba(115,179,223,0.95)_-49.53%,_rgba(97,160,212,0.95)_24.57%,_rgba(118,217,228,0.95)_129.21%)]" />
          <div className="absolute inset-0 bg-white/30 backdrop-blur-sm" />
          <div className="relative z-10 px-6 py-10 text-center">
            <h2 className="text-2xl sm:text-3xl font-bold text-white drop-shadow">
              나만의 플랜 여행지 만들기
            </h2>
            <p className="text-gray-100 mt-2">
              간편하게 일정을 짜고 저장해보세요!
            </p>
            <div className="mt-4 inline-block bg-white text-cyan-500 px-5 py-2 rounded-full font-medium shadow hover:scale-105 transition">
              내 여행 플래너로 이동 →
            </div>
          </div>
        </section>

        <section className="px-4 mb-24">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {[
              {
                title: "환전 팁",
                desc: "공항보다는 시내 환전소 이용이 유리해요!",
                bg: "from-blue-50 to-cyan-100",
              },
              {
                title: "교통카드 사용법",
                desc: "스이카(Suica) 카드로 지하철, 편의점까지 OK!",
                bg: "from-green-50 to-lime-100",
              },
              {
                title: "숙소 예약 팁",
                desc: "역 근처 숙소는 이동이 편하고 야경도 좋아요.",
                bg: "from-pink-50 to-red-100",
              },
            ].map((tip, i) => (
              <div
                key={i}
                className={`rounded-xl shadow-md hover:shadow-lg transition bg-gradient-to-br ${tip.bg} p-6 h-[180px] flex flex-col justify-center`}
              >
                <h3 className="text-lg font-bold text-blue-900 mb-2">
                  {tip.title}
                </h3>
                <p className="text-gray-700 text-sm leading-relaxed">
                  {tip.desc}
                </p>
              </div>
            ))}
          </div>
        </section>
      </section>
    </div>
  );
};

export default Main;
