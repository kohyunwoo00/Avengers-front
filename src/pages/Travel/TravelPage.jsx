import { useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  MapPin,
  Calendar,
  Users,
  Star,
  Heart,
  Share2,
  Search,
  Filter,
  X,
  ChevronDown,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

function TravelPage() {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [favorites, setFavorites] = useState(new Set());
  const [selectedCategory, setSelectedCategory] = useState("전체");
  const [selectedDistrict, setSelectedDistrict] = useState("전체");
  const [selectedTags, setSelectedTags] = useState([]);
  const [selectedFacilities, setSelectedFacilities] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  // 인기 축제 데이터
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
  ];

  // 여행지 리스트 데이터
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

  const categories = ["전체", "관광지", "맛집", "숙박", "액티비티", "쇼핑"];

  // 슬라이더 제어
  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % popularFestivals.length);
  };

  const prevSlide = () => {
    setCurrentSlide(
      (prev) => (prev - 1 + popularFestivals.length) % popularFestivals.length
    );
  };

  // 찜하기 토글
  const toggleFavorite = (id) => {
    setFavorites((prev) => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(id)) {
        newFavorites.delete(id);
      } else {
        newFavorites.add(id);
      }
      return newFavorites;
    });
  };

  // 필터 초기화
  const resetFilters = () => {
    setSelectedCategory("전체");
    setSelectedDistrict("전체");
    setSelectedTags([]);
    setSelectedFacilities([]);
    setSearchTerm("");
  };

  // 필터링된 여행지
  const filteredDestinations = travelDestinations.filter((destination) => {
    const matchesCategory =
      selectedCategory === "전체" || destination.category === selectedCategory;
    const matchesDistrict =
      selectedDistrict === "전체" || destination.district === selectedDistrict;
    const matchesSearch =
      destination.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      destination.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTags =
      selectedTags.length === 0 ||
      selectedTags.some((tag) => destination.tags.includes(tag));
    const matchesFacilities =
      selectedFacilities.length === 0 ||
      selectedFacilities.some((facility) =>
        destination.facilities.includes(facility)
      );

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
        {/* 인기 축제 슬라이더 */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">인기 여행지</h2>
          <div className="relative">
            <div className="overflow-hidden rounded-lg">
              <div
                className="flex transition-transform duration-300 ease-in-out"
                style={{ transform: `translateX(-${currentSlide * 100}%)` }}
              >
                {popularFestivals.map((festival) => (
                  <div key={festival.id} className="w-full flex-shrink-0">
                    <div className="bg-white rounded-lg shadow-md overflow-hidden mx-2">
                      <div className="md:flex">
                        <div className="md:w-1/2">
                          <img
                            src={festival.image || "/placeholder.svg"}
                            alt={festival.title}
                            className="w-full h-64 md:h-80 object-cover"
                          />
                        </div>
                        <div className="md:w-1/2 p-6 flex flex-col justify-center">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                              진행 예정
                            </span>
                            <div className="flex items-center gap-1">
                              <Star className="h-4 w-4 text-yellow-400 fill-current" />
                              <span className="text-sm text-gray-600">
                                {festival.rating}
                              </span>
                            </div>
                          </div>
                          <h3 className="text-2xl font-bold text-gray-800 mb-2">
                            {festival.title}
                          </h3>
                          <div className="flex items-center gap-2 text-gray-600 mb-2">
                            <MapPin className="h-4 w-4" />
                            <span className="text-sm">{festival.location}</span>
                          </div>
                          <div className="flex items-center gap-2 text-gray-600 mb-2">
                            <Calendar className="h-4 w-4" />
                            <span className="text-sm">{festival.period}</span>
                          </div>
                          <div className="flex items-center gap-2 text-gray-600 mb-4">
                            <Users className="h-4 w-4" />
                            <span className="text-sm">
                              예상 참여자: {festival.participants}
                            </span>
                          </div>
                          <div className="flex flex-wrap gap-1 mb-4">
                            {festival.tags.map((tag, index) => (
                              <span
                                key={index}
                                className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded"
                              >
                                #{tag}
                              </span>
                            ))}
                          </div>
                          <button className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors">
                            자세히 보기
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 슬라이더 컨트롤 */}
            <button
              onClick={prevSlide}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-80 hover:bg-opacity-100 rounded-full p-2 shadow-md transition-all"
            >
              <ChevronLeft className="h-6 w-6 text-gray-600" />
            </button>
            <button
              onClick={nextSlide}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-80 hover:bg-opacity-100 rounded-full p-2 shadow-md transition-all"
            >
              <ChevronRight className="h-6 w-6 text-gray-600" />
            </button>

            {/* 슬라이더 인디케이터 */}
            <div className="flex justify-center mt-4 gap-2">
              {popularFestivals.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`w-3 h-3 rounded-full transition-colors ${
                    index === currentSlide ? "bg-blue-600" : "bg-gray-300"
                  }`}
                />
              ))}
            </div>
          </div>
        </section>

        {/* 여행지 리스트 */}
        <section>
          {/* 헤더 영역 */}
          <div>
            <div className="flex flex-col items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-800">
                여행지 리스트
              </h2>
              <div className="flex items-center gap-6"></div>
              <div className="flex gap-2">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                      selectedCategory === category
                        ? "bg-blue-600 text-white"
                        : "bg-white text-gray-600 border border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* 여행지 카드 그리드 */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {filteredDestinations.map((destination) => (
              <div
                key={destination.id}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div className="relative">
                  <img
                    src={destination.image || "/placeholder.svg"}
                    alt={destination.title}
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute top-3 left-3">
                    <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded">
                      {destination.category}
                    </span>
                  </div>
                  <div className="absolute top-3 right-3 flex gap-1">
                    <button
                      onClick={() => toggleFavorite(destination.id)}
                      className={`p-1.5 rounded-full transition-colors ${
                        favorites.has(destination.id)
                          ? "bg-red-500 text-white"
                          : "bg-white bg-opacity-80 text-gray-600 hover:bg-opacity-100"
                      }`}
                    >
                      <Heart className="h-4 w-4" />
                    </button>
                    <button className="p-1.5 bg-white bg-opacity-80 hover:bg-opacity-100 rounded-full text-gray-600">
                      <Share2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                <div className="p-4">
                  <h3 className="font-bold text-gray-800 mb-2">
                    {destination.title}
                  </h3>
                  <div className="flex items-center gap-1 text-gray-600 mb-2">
                    <MapPin className="h-4 w-4" />
                    <span className="text-sm">{destination.location}</span>
                  </div>

                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 text-yellow-400 fill-current" />
                      <span className="text-sm font-medium">
                        {destination.rating}
                      </span>
                      <span className="text-xs text-gray-500">
                        ({destination.reviews})
                      </span>
                    </div>
                    <span className="text-sm font-medium text-blue-600">
                      {destination.price}
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-1 mb-3">
                    {destination.tags.slice(0, 3).map((tag, index) => (
                      <span
                        key={index}
                        className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>

                  {/* 편의시설 표시 */}
                  <div className="flex flex-wrap gap-1 mb-3">
                    {destination.facilities
                      .slice(0, 2)
                      .map((facility, index) => (
                        <span
                          key={index}
                          className="bg-blue-50 text-blue-600 text-xs px-2 py-1 rounded"
                        >
                          {facility}
                        </span>
                      ))}
                    {destination.facilities.length > 2 && (
                      <span className="text-xs text-gray-500">
                        +{destination.facilities.length - 2}
                      </span>
                    )}
                  </div>

                  <button
                    onClick={() =>
                      navigate(`/travels/detail/${destination.id}`)
                    }
                    className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition-colors text-sm font-medium"
                  >
                    상세보기
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* 검색 결과가 없을 때 */}
          {filteredDestinations.length === 0 && (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <Search className="h-16 w-16 mx-auto mb-4" />
              </div>
              <h3 className="text-lg font-medium text-gray-600 mb-2">
                검색 결과가 없습니다
              </h3>
              <p className="text-gray-500 mb-4">
                다른 검색어나 필터 조건을 시도해보세요
              </p>
              <button
                onClick={resetFilters}
                className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                전체 여행지 보기
              </button>
            </div>
          )}

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

export default TravelPage;
