import { useEffect, useState } from "react";
import SliderSection from "./common/SliderSection";
import CategoryFilter from "./common/CategoryFilter";
import DestinationGrid from "./common/DestinationGrid";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function FestivalPage() {
  const navigate = useNavigate();

  useEffect(() => {
    fetchCategories();
  }, []);

  const API_URL = window.ENV.API_URL;
  // const token = localStorage.getItem("accessToken");
  const token =
    "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1c2VyMDEwMTExIiwiaWF0IjoxNzUxMDg2NDUzLCJleHAiOjE3NTEzNDU2NTN9.U0eev09LUpgnIPIgI8OfKUxFDxWoRl6-frDx0ilrU3g";

  const headers = {
    Authorization: `Bearer ${token}`,
  };

  const [currentSlide, setCurrentSlide] = useState(0);
  const [favorites, setFavorites] = useState(new Set());
  const [selectedCategory, setSelectedCategory] = useState("전체");
  const [selectedDistrict, setSelectedDistrict] = useState("전체");
  const [selectedTags, setSelectedTags] = useState([]);
  const [selectedFacilities, setSelectedFacilities] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const popularFestivals = [
    {
      id: 1,
      title: "벚꽃 축제",
      location: "여의도 한강공원",
      district: "영등포구",
      image: "/placeholder.svg?height=200&width=300",
      period: "4월 1일 ~ 4월 15일",
      rating: 4.8,
      participants: "50만명",
      tags: ["봄", "벚꽃", "가족"],
    },
    {
      id: 2,
      title: "벚꽃 축제",
      location: "여의도 한강공원",
      district: "영등포구",
      image: "/placeholder.svg?height=200&width=300",
      period: "4월 1일 ~ 4월 15일",
      rating: 4.8,
      participants: "50만명",
      tags: ["봄", "벚꽃", "가족"],
    },
  ];

  const travelDestinations = [
    {
      id: 1,
      title: "경복궁",
      category: "관광지",
      location: "종로구 사직로 161",
      district: "종로구",
      image: "/placeholder.svg?height=200&width=300",
      rating: 4.5,
      reviews: 1234,
      tags: ["역사", "궁궐", "전통"],
      facilities: ["주차가능", "장애인편의"],
      price: "무료",
    },
  ];

  const [categories, setCategories] = useState([]);

  const fetchCategories = () => {
    axios
      .get(`${API_URL}/api/travels/category`, { headers })
      .then((res) => {
        const categoryList = res.data.data.map((cat) => ({
          id: cat.categoryNo,
          name: cat.categoryName,
          status: cat.categoryStatus === "Y" ? "ACTIVE" : "INACTIVE",
          createdDate: cat.categoryCreatedDate,
          modifiedDate: cat.categoryModifiedDate,
        }));

        const fullList = [
          { id: 0, name: "전체" }, // 필터 기본값용
          ...categoryList,
        ];
        console.log("카테고리 목록 조회 성공:", res.data);
        setCategories(fullList);
      })
      .catch((err) => {
        console.error("카테고리 목록 조회 실패:", err);
      });
  };

  const toggleFavorite = (id) => {
    setFavorites((prev) => {
      const newSet = new Set(prev);
      newSet.has(id) ? newSet.delete(id) : newSet.add(id);
      return newSet;
    });
  };

  const resetFilters = () => {
    setSelectedCategory("전체");
    setSelectedDistrict("전체");
    setSelectedTags([]);
    setSelectedFacilities([]);
    setSearchTerm("");
  };

  const filteredDestinations = travelDestinations.filter((d) => {
    const matchesCategory =
      selectedCategory === "전체" || d.category === selectedCategory;
    const matchesDistrict =
      selectedDistrict === "전체" || d.district === selectedDistrict;
    const matchesSearch =
      d.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTags =
      selectedTags.length === 0 ||
      selectedTags.some((tag) => d.tags.includes(tag));
    const matchesFacilities =
      selectedFacilities.length === 0 ||
      selectedFacilities.some((f) => d.facilities.includes(f));
    return (
      matchesCategory &&
      matchesDistrict &&
      matchesSearch &&
      matchesTags &&
      matchesFacilities
    );
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <section className="mb-12">
          <SliderSection
            title="인기 축제"
            items={popularFestivals}
            currentSlide={currentSlide}
            setCurrentSlide={setCurrentSlide}
          />
        </section>

        <section>
          <div className="flex flex-col items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-800">축제 리스트</h2>
            <CategoryFilter
              categories={categories}
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
            />
          </div>

          <DestinationGrid
            destinations={filteredDestinations}
            favorites={favorites}
            toggleFavorite={toggleFavorite}
            resetFilters={resetFilters}
          />

          {/* 더보기 버튼 */}
          {filteredDestinations.length > 0 && (
            <div className="text-center">
              <button
                onClick={() => navigate(`/travels/search`)}
                className="bg-blue-600 text-white px-8 py-3 rounded-md hover:bg-blue-700 transition-colors font-medium"
              >
                더보기
              </button>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

export default FestivalPage;
