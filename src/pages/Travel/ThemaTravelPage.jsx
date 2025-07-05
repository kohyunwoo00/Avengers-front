import { useEffect, useState } from "react";
import CategoryFilter from "./common/CategoryFilter";
import DestinationGrid from "./common/DestinationGrid";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function ThemaTravelPage() {
  const navigate = useNavigate();
  const API_URL = window.ENV.API_URL;

  const [selectedThema, setSelectedThema] = useState("전체");
  const [themas, setThemas] = useState([]);
  const [travelList, setTravelList] = useState([]);

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(12);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchThemas();
  }, []);

  useEffect(() => {
    fetchTravelList();
  }, [selectedThema, currentPage]);

  const fetchThemas = () => {
    axios
      .get(`${API_URL}/api/travels/thema`)
      .then((res) => {
        const themaList = res.data.data.map((t) => ({
          id: t.themaNo,
          name: t.themaName,
        }));
        setThemas([{ id: 0, name: "전체" }, ...themaList]);
      })
      .catch((err) => console.error("테마 목록 조회 실패:", err));
  };

  const fetchTravelList = () => {
    axios
      .get(`${API_URL}/api/travels/user/search`, {
        params: {
          page: currentPage,
          size: itemsPerPage,
          thema: selectedThema !== "전체" ? selectedThema : "",
        },
      })
      .then((res) => {
        console.log(res);
        const { content, totalPages } = res.data.data;
        setTravelList(content);
        setTotalPages(totalPages);
      })
      .catch((err) => console.error("테마 여행지 목록 조회 실패:", err));
  };

  const resetFilters = () => {
    setSelectedThema("전체");
    setCurrentPage(1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-white to-teal-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-blue-500 via-cyan-500 to-teal-500">
        <div className="absolute inset-0 bg-black/20" />
        <div className="absolute inset-0 bg-[url('/placeholder.svg?height=400&width=1200')] bg-cover bg-center opacity-10" />

        <div className="relative max-w-7xl mx-auto px-4 py-16">
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-4">
              <span className="inline-block w-2 h-2 bg-cyan-300 rounded-full animate-pulse"></span>
              <span className="text-cyan-100 font-medium">
                Premium Travel Experience
              </span>
              <span className="inline-block w-2 h-2 bg-cyan-300 rounded-full animate-pulse"></span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6">
              테마 여행지 검색
            </h1>

            <p className="text-xl text-cyan-100 mb-8 max-w-2xl mx-auto">
              당신만의 특별한 여행을 위한 완벽한 목적지를 찾아보세요
            </p>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-white/10 rounded-full blur-xl"></div>
        <div className="absolute bottom-20 right-10 w-32 h-32 bg-teal-300/20 rounded-full blur-2xl"></div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <section>
          {/* Theme Filter Section */}
          <div className="mb-12">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-3">
                테마별 여행지 탐색
              </h2>
              <p className="text-gray-600 text-lg">
                관심있는 테마를 선택하여 맞춤형 여행지를 찾아보세요
              </p>
            </div>

            <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-cyan-100/50">
              <div className="flex flex-wrap justify-center gap-3">
                {themas.map((thema) => (
                  <button
                    key={thema.id}
                    onClick={() => setSelectedThema(thema.name)}
                    className={`
                      relative px-6 py-3 rounded-full font-medium text-sm transition-all duration-300 transform hover:scale-105 hover:-translate-y-1
                      ${
                        selectedThema === thema.name
                          ? "bg-gradient-to-r from-cyan-500 to-teal-500 text-white shadow-lg shadow-cyan-500/25"
                          : "bg-gray-50 text-gray-700 hover:bg-white hover:shadow-md border border-gray-200"
                      }
                    `}
                  >
                    {selectedThema === thema.name && (
                      <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-teal-400 rounded-full blur opacity-75 -z-10"></div>
                    )}
                    <span className="relative z-10">{thema.name}</span>
                    {selectedThema === thema.name && (
                      <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full animate-pulse"></div>
                    )}
                  </button>
                ))}
              </div>

              {/* Filter Stats */}
              <div className="mt-6 pt-6 border-t border-gray-100">
                <div className="flex items-center justify-center gap-6 text-sm text-gray-500">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-cyan-400 rounded-full"></div>
                    <span>선택된 테마: {selectedThema}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-teal-400 rounded-full"></div>
                    <span>총 {themas.length}개 테마</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Results Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-r from-cyan-500 to-teal-500 rounded-lg flex items-center justify-center">
                <svg
                  className="w-5 h-5 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900">
                  추천 여행지
                </h3>
                <p className="text-gray-600">
                  총 {travelList.length}개의 여행지
                </p>
              </div>
            </div>
            <div className="hidden sm:flex items-center gap-2 text-sm text-gray-500">
              <span className="inline-block w-2 h-2 bg-teal-400 rounded-full animate-pulse"></span>
              실시간 업데이트
            </div>
          </div>

          {/* Destination Grid */}
          <div className="mb-12">
            <DestinationGrid
              destinations={travelList}
              resetFilters={resetFilters}
            />
          </div>

          {/* Call to Action */}
          {travelList.length > 0 && (
            <div className="text-center">
              <div className="bg-gradient-to-r from-cyan-500 to-teal-500 rounded-2xl p-8 text-white shadow-2xl">
                <div className="max-w-2xl mx-auto">
                  <h3 className="text-2xl font-bold mb-4">
                    더 많은 여행지를 찾고 계신가요?
                  </h3>
                  <p className="text-cyan-100 mb-6">
                    상세 검색 기능을 통해 위치, 가격, 평점 등 다양한 조건으로
                    완벽한 여행지를 찾아보세요.
                  </p>
                  <button
                    onClick={() => navigate(`/travels/search`)}
                    className="bg-white text-cyan-600 hover:bg-gray-50 font-semibold px-8 py-3 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg"
                  >
                    상세 검색하기
                  </button>
                </div>
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

export default ThemaTravelPage;
