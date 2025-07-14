import { useEffect, useState } from "react";
import { Search, X, ArrowLeft } from "lucide-react";
import DestinationGrid from "./common/DestinationGrid";
import Pagination from "../../components/common/Page/Pagination";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function TravelDetailSearchPage() {
  const API_URL = window.ENV?.API_URL || "http://localhost:8000";

  const usenavigate = useNavigate();
  const [favorites, setFavorites] = useState(new Set());
  const [selectedCategory, setSelectedCategory] = useState("전체");
  const [selectedDistrict, setSelectedDistrict] = useState("전체");
  const [selectedTags, setSelectedTags] = useState([]);
  const [selectedFacilities, setSelectedFacilities] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [categories, setCategories] = useState([{ id: 0, name: "전체" }]);
  const [districts, setDistricts] = useState(["전체"]);
  const [allTags, setAllTags] = useState([]);
  const [allFacilities, setAllFacilities] = useState([]);
  const [travelList, setTravelList] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(12);

  useEffect(() => {
    fetchCategories();
    fetchDistricts();
    fetchTags();
    fetchOptions();
    fetchTravelList();
  }, []);

  const fetchCategories = () => {
    axios
      .get(`${API_URL}/api/travels/category`)
      .then((res) => {
        const categoryList = res.data.data.map((cat) => ({
          id: cat.categoryNo,
          name: cat.categoryName,
        }));
        setCategories([{ id: 0, name: "전체" }, ...categoryList]);
      })
      .catch((err) => console.error("카테고리 목록 조회 실패:", err));
  };

  const fetchDistricts = () => {
    axios.get(`${API_URL}/api/travels/gu`).then((res) => {
      const names = res.data.data.map((d) => d.guName);
      setDistricts(["전체", ...names]);
    });
  };

  const fetchTags = () => {
    axios
      .get(`${API_URL}/api/travels/tags`)
      .then((res) => setAllTags(res.data.data.map((t) => t.tagName)))
      .catch((err) => console.error("태그 목록 조회 실패:", err));
  };

  const fetchOptions = () => {
    axios
      .get(`${API_URL}/api/travels/option`)
      .then((res) => setAllFacilities(res.data.data.map((o) => o.optionName)))
      .catch((err) => console.error("옵션 목록 조회 실패:", err));
  };

  const fetchTravelList = () => {
    axios
      .get(`${API_URL}/api/travels/user/search`, {
        params: {
          page: currentPage,
          size: itemsPerPage,
        },
      })
      .then((res) => {
        console.log(res);
        const content = res.data?.data?.content || [];
        const totalPages = res.data?.data?.totalPages || 1;

        setTravelList(content);
        setTotalPages(totalPages);
      })
      .catch((err) => console.error("여행지 목록 조회 실패:", err));
  };

  const toggleFavorite = (id) => {
    setFavorites((prev) => {
      const newSet = new Set(prev);
      newSet.has(id) ? newSet.delete(id) : newSet.add(id);
      return newSet;
    });
  };

  const toggleTag = (tag) => {
    const updated = selectedTags.includes(tag)
      ? selectedTags.filter((t) => t !== tag)
      : [...selectedTags, tag];

    setSelectedTags(updated); // 상태 먼저 반영
    setCurrentPage(1); // 페이지 리셋
  };

  const toggleFacility = (facility) => {
    setSelectedFacilities((prev) => {
      const updated = prev.includes(facility)
        ? prev.filter((f) => f !== facility)
        : [...prev, facility];

      setCurrentPage(1);
      return updated;
    });
  };

  const resetFilters = () => {
    setSelectedCategory("전체");
    setSelectedDistrict("전체");
    setSelectedTags([]);
    setSelectedFacilities([]);
    setSearchTerm("");
    setCurrentPage(1);
    fetchTravelList();
  };

  const activeFilterCount = [
    selectedCategory !== "전체",
    selectedDistrict !== "전체",
    selectedTags.length > 0,
    selectedFacilities.length > 0,
    searchTerm !== "",
  ].filter(Boolean).length;

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  useEffect(() => {
    const isDefaultFilter =
      selectedCategory === "전체" &&
      selectedDistrict === "전체" &&
      selectedTags.length === 0 &&
      selectedFacilities.length === 0 &&
      searchTerm.trim() === "";

    if (isDefaultFilter) {
      fetchTravelList();
      return;
    }

    const params = {
      page: currentPage,
      size: itemsPerPage,
    };

    if (searchTerm.trim()) params.search = searchTerm;
    if (selectedCategory !== "전체") params.category = selectedCategory;
    if (selectedDistrict !== "전체") params.district = selectedDistrict;
    if (selectedTags.length > 0) params.tags = selectedTags.join(",");
    if (selectedFacilities.length > 0)
      params.facilities = selectedFacilities.join(",");

    axios
      .get(`${API_URL}/api/travels/user/search`, { params })
      .then((res) => {
        const { content, totalPages } = res.data.data;
        setTravelList(content);
        setTotalPages(totalPages);
      })
      .catch((err) => {
        console.error("필터 검색 실패:", err);
        setTravelList([]);
        setTotalPages(1);
      });
  }, [
    currentPage,
    selectedCategory,
    selectedDistrict,
    selectedTags.join(","), // ✅ 배열 → 문자열
    selectedFacilities.join(","), // ✅ 배열 → 문자열
    searchTerm,
  ]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* 뒤로가기 버튼 */}
        <div className="mb-6">
          <button
            onClick={() => usenavigate(-1)}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
            <span>뒤로가기</span>
          </button>
        </div>

        {/* 페이지 제목 */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            여행지 상세 검색
          </h1>
          <p className="text-gray-600">
            원하는 조건으로 완벽한 여행지를 찾아보세요
          </p>
        </div>

        {/* 검색창 */}
        <div className="relative max-w-2xl mx-auto mb-6">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <input
            type="text"
            placeholder="여행지명, 위치로 검색하세요..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full pl-12 pr-4 py-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg"
          />
        </div>

        {/* 필터 UI */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-8 grid lg:grid-cols-2 gap-6">
          {/* 카테고리 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              카테고리
            </label>
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.name)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 transform hover:scale-105 ${
                    selectedCategory === category.name
                      ? "text-white shadow-md shadow-cyan-300/30 bg-[linear-gradient(100deg,_rgba(115,179,223,0.95)_-49.53%,_rgba(97,160,212,0.95)_24.57%,_rgba(118,217,228,0.95)_129.21%)]"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {category.name}
                </button>
              ))}
            </div>
          </div>

          {/* 지역구 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              지역구
            </label>
            <select
              value={selectedDistrict}
              onChange={(e) => setSelectedDistrict(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {districts.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>

          {/* 편의시설 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              편의시설
            </label>
            <div className="flex flex-wrap gap-2">
              {allFacilities.map((opt) => (
                <button
                  key={opt}
                  onClick={() => toggleFacility(opt)}
                  className={`px-3 py-2 text-sm rounded-lg transition-colors ${
                    selectedFacilities.includes(opt)
                      ? "bg-purple-100 text-purple-800 border border-purple-300"
                      : "bg-gray-100 text-gray-700 border border-gray-300 hover:bg-gray-200"
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>

          {/* 태그 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              태그
            </label>
            <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto">
              {allTags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => toggleTag(tag)}
                  className={`px-3 py-2 text-sm rounded-lg transition-colors ${
                    selectedTags.includes(tag)
                      ? "bg-green-100 text-green-800 border border-green-300"
                      : "bg-gray-100 text-gray-700 border border-gray-300 hover:bg-gray-200"
                  }`}
                >
                  #{tag}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 필터 초기화 */}
        {activeFilterCount > 0 && (
          <div className="text-center mb-6">
            <button
              onClick={resetFilters}
              className="px-6 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              전체 초기화 ({activeFilterCount}개 필터 적용중)
            </button>
          </div>
        )}

        {/* 활성 필터 표시 */}
        {activeFilterCount > 0 && (
          <div className="mb-6 flex flex-wrap gap-2 justify-center">
            {selectedCategory !== "전체" && (
              <span
                className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-white text-sm font-medium
    bg-[linear-gradient(100deg,_rgba(115,179,223,0.95)_-49.53%,_rgba(97,160,212,0.95)_24.57%,_rgba(118,217,228,0.95)_129.21%)]
    shadow-sm"
              >
                카테고리: {selectedCategory}
                <button
                  onClick={() => setSelectedCategory("전체")}
                  className="hover:bg-white/20 rounded-full p-0.5 transition"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            )}
            {selectedDistrict !== "전체" && (
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                지역: {selectedDistrict}
                <button
                  onClick={() => setSelectedDistrict("전체")}
                  className="hover:bg-blue-200 rounded-full p-0.5"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            )}
            {selectedFacilities.map((facility) => (
              <span
                key={facility}
                className="inline-flex items-center gap-1 px-3 py-1 bg-purple-100 text-purple-800 text-sm rounded-full"
              >
                편의시설: {facility}
                <button
                  onClick={() => toggleFacility(facility)}
                  className="hover:bg-purple-200 rounded-full p-0.5"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            ))}
            {selectedTags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full"
              >
                태그: #{tag}
                <button
                  onClick={() => toggleTag(tag)}
                  className="hover:bg-green-200 rounded-full p-0.5"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            ))}
            {searchTerm && (
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-yellow-100 text-yellow-800 text-sm rounded-full">
                검색어: {searchTerm}
                <button
                  onClick={() => setSearchTerm("")}
                  className="hover:bg-yellow-200 rounded-full p-0.5"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            )}
          </div>
        )}

        {/* 리스트 */}
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            여행지 리스트
          </h2>
          <p className="text-gray-600">
            총{" "}
            <span className="font-semibold text-blue-600">
              {travelList.length}
            </span>{" "}
            개의 여행지를 찾았습니다
          </p>
        </div>

        {/* 카드 */}
        <DestinationGrid
          destinations={travelList}
          favorites={favorites}
          toggleFavorite={toggleFavorite}
        />

        {/* 검색 결과 없음 */}
        {travelList.length === 0 && (
          <div className="text-center py-12">
            <Search className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-600 mb-2">
              검색 결과가 없습니다
            </h3>
            <p className="text-gray-500 mb-4">
              다른 검색어나 필터 조건을 시도해보세요
            </p>
            <button
              onClick={resetFilters}
              className="px-8 py-3 rounded-md text-white font-medium transition-all duration-200 cursor-pointer hover:opacity-90 active:scale-95
    bg-[linear-gradient(100deg,_rgba(115,179,223,0.95)_-49.53%,_rgba(97,160,212,0.95)_24.57%,_rgba(118,217,228,0.95)_129.21%)]"
            >
              전체 여행지 보기
            </button>
          </div>
        )}

        {/* 페이지네이션 */}
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      </div>
    </div>
  );
}
