import { useState } from "react";
import {
  ArrowLeft,
  Heart,
  Share2,
  MapPin,
  Phone,
  Clock,
  Globe,
  Star,
} from "lucide-react";
import { useParams } from "react-router-dom";

function TravelDetailPage() {
  const { id } = useParams();
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  // 여행지 상세 데이터
  const travelDetail = {
    id: 1,
    title: "경복궁",
    category: "관광지",
    location: "서울특별시 종로구 사직로 161",
    district: "종로구",
    phone: "02-3700-3900",
    website: "https://www.royalpalace.go.kr",
    operatingHours: "09:00 ~ 18:00",
    operatingStatus: "운영중",
    rating: 4.5,
    reviews: 1234,
    price: "성인 3,000원",
    description: `조선왕조의 법궁인 경복궁은 1395년 태조 이성계에 의해 창건되었습니다. 
    궁궐 건축의 백미로 꼽히는 경복궁은 정문인 광화문을 비롯해 근정전, 경회루, 향원정 등 
    아름다운 건축물들이 조화롭게 배치되어 있습니다. 특히 수문장 교대식과 궁중문화축전 등 
    다양한 문화행사가 열려 조선시대 궁중문화를 생생하게 체험할 수 있습니다.`,
    images: [
      "/placeholder.svg?height=400&width=600",
      "/placeholder.svg?height=400&width=600",
      "/placeholder.svg?height=400&width=600",
      "/placeholder.svg?height=400&width=600",
      "/placeholder.svg?height=400&width=600",
    ],
    tags: ["역사", "궁궐", "전통", "문화재", "관광명소"],
    facilities: ["주차가능", "장애인편의", "화장실", "매점"],
  };

  const toggleBookmark = () => {
    setIsBookmarked(!isBookmarked);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* 뒤로가기 버튼 */}
        <div className="mb-6">
          <button className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors">
            <ArrowLeft className="h-5 w-5" />
            <span>목록으로</span>
          </button>
        </div>

        {/* 페이지 제목 */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">여행지 상세 조회</h1>
        </div>

        {/* 메인 콘텐츠 */}
        <div className="bg-white rounded-lg shadow-sm border overflow-hidden mb-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-6">
            {/* 왼쪽: 이미지 영역 */}
            <div className="space-y-4">
              {/* 메인 이미지 */}
              <div className="aspect-[4/3] bg-gray-200 rounded-lg overflow-hidden">
                <img
                  src={
                    travelDetail.images[selectedImageIndex] ||
                    "/placeholder.svg"
                  }
                  alt={`${travelDetail.title} 이미지 ${selectedImageIndex + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* 썸네일 이미지들 */}
              <div className="grid grid-cols-4 gap-2">
                {travelDetail.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImageIndex(index)}
                    className={`aspect-square bg-gray-200 rounded-lg overflow-hidden border-2 transition-colors ${
                      selectedImageIndex === index
                        ? "border-blue-500"
                        : "border-transparent hover:border-gray-300"
                    }`}
                  >
                    <img
                      src={image || "/placeholder.svg"}
                      alt={`썸네일 ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* 오른쪽: 정보 영역 */}
            <div className="space-y-6">
              {/* 제목과 액션 버튼 */}
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-2xl font-bold text-gray-800 mb-2">
                    {travelDetail.title}
                  </h2>
                  <span className="inline-block bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full">
                    {travelDetail.category}
                  </span>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={toggleBookmark}
                    className={`p-2 rounded-full transition-colors ${
                      isBookmarked
                        ? "bg-red-500 text-white"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    <Heart className="h-5 w-5" />
                  </button>
                  <button className="p-2 bg-gray-100 text-gray-600 hover:bg-gray-200 rounded-full transition-colors">
                    <Share2 className="h-5 w-5" />
                  </button>
                </div>
              </div>

              {/* 평점과 리뷰 */}
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  <Star className="h-5 w-5 text-yellow-400 fill-current" />
                  <span className="text-lg font-semibold">
                    {travelDetail.rating}
                  </span>
                </div>
                <span className="text-gray-600">
                  리뷰 {travelDetail.reviews}개
                </span>
                <span className="text-lg font-semibold text-blue-600">
                  {travelDetail.price}
                </span>
              </div>

              {/* 태그 */}
              <div className="flex flex-wrap gap-2">
                {travelDetail.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="bg-gray-100 text-gray-700 text-sm px-3 py-1 rounded-full"
                  >
                    #{tag}
                  </span>
                ))}
              </div>

              {/* 편의시설 */}
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">편의시설</h3>
                <div className="flex flex-wrap gap-2">
                  {travelDetail.facilities.map((facility, index) => (
                    <span
                      key={index}
                      className="bg-blue-50 text-blue-600 text-sm px-3 py-1 rounded-lg"
                    >
                      {facility}
                    </span>
                  ))}
                </div>
              </div>

              {/* 상세 설명 */}
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">
                  여행지 상세 정보
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {travelDetail.description}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* 지도 영역 */}
        <div className="bg-white rounded-lg shadow-sm border mb-8">
          <div className="p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              위치 정보
            </h3>
            <div className="aspect-[16/9] bg-gray-200 rounded-lg flex items-center justify-center">
              <div className="text-center text-gray-500">
                <MapPin className="h-12 w-12 mx-auto mb-2" />
                <p>GoogleMap API</p>
                <p className="text-sm">지도가 여기에 표시됩니다</p>
              </div>
            </div>
          </div>
        </div>

        {/* 상세 정보 테이블 */}
        <div className="bg-white rounded-lg shadow-sm border mb-8">
          <div className="p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              상세 정보
            </h3>

            {/* 기본 정보 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <MapPin className="h-5 w-5 text-gray-400" />
                  <div>
                    <span className="text-sm text-gray-500">주소</span>
                    <p className="font-medium">{travelDetail.location}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="h-5 w-5 text-gray-400" />
                  <div>
                    <span className="text-sm text-gray-500">전화번호</span>
                    <p className="font-medium">{travelDetail.phone}</p>
                  </div>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Clock className="h-5 w-5 text-gray-400" />
                  <div>
                    <span className="text-sm text-gray-500">영업시간</span>
                    <p className="font-medium">{travelDetail.operatingHours}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Globe className="h-5 w-5 text-gray-400" />
                  <div>
                    <span className="text-sm text-gray-500">웹사이트</span>
                    <a
                      href={travelDetail.website}
                      className="font-medium text-blue-600 hover:underline"
                    >
                      공식 홈페이지
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* 운영 상태 */}
            <div className="mb-6 pb-6 border-b">
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500">운영 상태:</span>
                <span className="bg-green-100 text-green-800 text-sm px-2 py-1 rounded-full">
                  {travelDetail.operatingStatus}
                </span>
              </div>
            </div>

            {/* 태그 정보 */}
            <div className="mb-6 pb-6 border-b">
              <h4 className="font-semibold text-gray-800 mb-3">태그</h4>
              <div className="flex flex-wrap gap-2">
                {travelDetail.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="bg-gray-100 text-gray-700 text-sm px-3 py-1 rounded-full"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>

            {/* 편의시설 정보 */}
            <div>
              <h4 className="font-semibold text-gray-800 mb-3">편의시설</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {travelDetail.facilities.map((facility, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg"
                  >
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span className="text-blue-700 text-sm font-medium">
                      {facility}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* 목록으로 버튼 */}
        <div className="text-center">
          <button className="bg-blue-600 text-white px-8 py-3 rounded-md hover:bg-blue-700 transition-colors font-medium">
            목록으로
          </button>
        </div>
      </div>
    </div>
  );
}

export default TravelDetailPage;
