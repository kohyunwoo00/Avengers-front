import { useEffect, useState } from "react";
import SliderSection from "./common/SliderSection";
import CategoryFilter from "./common/CategoryFilter";
import DestinationGrid from "./common/DestinationGrid";
import Pagination from "../../components/common/Page/Pagination";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function TravelPage() {
  const navigate = useNavigate();
  const API_URL = window.ENV.API_URL;

  const [currentSlide, setCurrentSlide] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState("전체");
  const [selectedDistrict, setSelectedDistrict] = useState("전체");
  const [selectedTags, setSelectedTags] = useState([]);
  const [selectedFacilities, setSelectedFacilities] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [categories, setCategories] = useState([]);
  const [travelList, setTravelList] = useState([]);
  const [popularList, setPopularList] = useState([]);

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(12);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchCategories();
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

  const fetchTravelList = () => {
    axios
      .get(`${API_URL}/api/travels`, {
        params: {
          page: 1,
          size: 17,
        },
      })
      .then((res) => {
        const { data, total } = res.data.data;
        setPopularList(data.slice(0, 5));
        setTravelList(data.slice(5));
        setTotalPages(Math.ceil(total / itemsPerPage));
      })
      .catch((err) => console.error("여행지 목록 조회 실패:", err));
  };

  const resetFilters = () => {
    setSelectedCategory("전체");
    setSelectedDistrict("전체");
    setSelectedTags([]);
    setSelectedFacilities([]);
    setSearchTerm("");
    setCurrentPage(1);
  };

  useEffect(() => {
    setCurrentPage(1); // 필터 변경 시 1페이지로 초기화
  }, [
    selectedCategory,
    selectedDistrict,
    selectedTags,
    selectedFacilities,
    searchTerm,
  ]);

  const filteredDestinations = travelList.filter((d) => {
    const matchesCategory =
      selectedCategory === "전체" || d.categoryName === selectedCategory;
    const matchesDistrict =
      selectedDistrict === "전체" || d.guName === selectedDistrict;
    const matchesSearch =
      d.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.address?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTags =
      selectedTags.length === 0 ||
      selectedTags.some((tag) =>
        d.tagListForView?.map((t) => t.tagName || t.themaName).includes(tag)
      );
    const matchesFacilities = selectedFacilities.length === 0;

    return (
      matchesCategory &&
      matchesDistrict &&
      matchesSearch &&
      matchesTags &&
      matchesFacilities
    );
  });

  const pagedDestinations = filteredDestinations.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <section className="mb-12">
          <SliderSection
            title="인기 여행지"
            items={popularList || []}
            currentSlide={currentSlide}
            setCurrentSlide={setCurrentSlide}
          />
        </section>

        <section>
          <div className="flex flex-col items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-800">여행지 리스트</h2>
            <CategoryFilter
              categories={categories}
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
            />
          </div>

          <DestinationGrid
            destinations={pagedDestinations}
            resetFilters={resetFilters}
          />

          {filteredDestinations.length > 0 && (
            <div className="text-center mt-4">
              <button
                onClick={() => navigate(`/travels/search`)}
                className="px-8 py-3 rounded-md text-white font-medium transition-all duration-200 cursor-pointer hover:opacity-90 active:scale-95
    bg-[linear-gradient(100deg,_rgba(115,179,223,0.95)_-49.53%,_rgba(97,160,212,0.95)_24.57%,_rgba(118,217,228,0.95)_129.21%)]"
              >
                상세 검색
              </button>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

export default TravelPage;
