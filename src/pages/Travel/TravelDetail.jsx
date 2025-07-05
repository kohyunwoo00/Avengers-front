import { useEffect, useState } from "react";
import {
  ArrowLeft,
  Heart,
  Share2,
  MapPin,
  Phone,
  Clock,
  Globe,
  Star,
  Info,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import GoogleMap from "./common/GoogleMap";

function TravelDetailPage() {
  const { id } = useParams();
  const [travelDetail, setTravelDetail] = useState(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const apiUrl = window.ENV?.API_URL || "http://localhost:8000";
  const [operatingHoursList, setOperatingHoursList] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (!id) return;
    axios
      .get(`${apiUrl}/api/travels/${id}`)
      .then((res) => {
        const data = res.data.data;
        console.log(data);

        setTravelDetail({
          title: data.title,
          category: data.categoryName,
          location: data.address,
          district: data.guName,
          phone: data.tel || "정보 없음",
          website: data.website || "#",
          operatingStatus: data.status === "Y" ? "운영중" : "운영종료",
          rating: 4.5,
          reviews: 0,
          price: "-",
          description: data.description,
          images: data.imageList.map((img) => img.imageUrl),
          tags:
            data.tagListForView?.map((t) => t.tagName.replace("#", "")) || [],
          facilities: data.optionListForView?.map((o) => o.optionName) || [],
          mapX: data.mapX,
          mapY: data.mapY,
          viewCount: data.viewCount,
        });

        setOperatingHoursList(
          data.timeList?.map((t) => ({
            day: t.dayOfWeek,
            time: `${t.startTime} ~ ${t.endTime}`,
          })) || []
        );
      })
      .catch((err) => {
        console.error("여행지 상세 조회 실패", err);
      });
  }, [id]);

  if (!travelDetail) return <div className="text-center p-10">로딩 중...</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* 뒤로가기 버튼 */}
        <div className="mb-6">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors px-4 py-2 rounded-md hover:bg-gray-100"
          >
            <ArrowLeft className="h-4 w-4" />
            뒤로 가기
          </button>
        </div>

        {/* 페이지 제목 */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">여행지 상세 조회</h1>
        </div>

        {/* 메인 콘텐츠 */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-8">
          <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* 왼쪽: 이미지 영역 */}
              <div className="space-y-4">
                {/* 메인 이미지 */}
                <div className="aspect-[4/3] bg-gray-200 rounded-lg overflow-hidden">
                  <img
                    src={
                      travelDetail.images[selectedImageIndex] ||
                      "/placeholder.svg"
                    }
                    alt={`${travelDetail.title} 이미지 ${
                      selectedImageIndex + 1
                    }`}
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
                    <span className="inline-block bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full font-medium">
                      {travelDetail.category}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <span className="inline-block bg-blue-50 text-blue-600 border border-blue-200 text-sm px-3 py-1 rounded-full font-medium">
                      조회수 : {travelDetail.viewCount}
                    </span>
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
                    리뷰 {travelDetail.reviews.toLocaleString()}개
                  </span>
                </div>

                {/* 태그 */}
                <div className="flex flex-wrap gap-2">
                  {travelDetail.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="bg-gray-100 text-gray-700 text-sm px-3 py-1 rounded-full font-medium"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>

                {/* 편의시설 */}
                <div>
                  <h3 className="font-semibold text-gray-800 mb-3">편의시설</h3>
                  <div className="flex flex-wrap gap-2">
                    {travelDetail.facilities.map((facility, index) => (
                      <span
                        key={index}
                        className="bg-blue-50 text-blue-600 border border-blue-200 text-sm px-3 py-1 rounded-lg font-medium"
                      >
                        {facility}
                      </span>
                    ))}
                  </div>
                </div>

                {/* 상세 설명 */}
                <div>
                  <h3 className="font-semibold text-gray-800 mb-3">
                    여행지 상세 정보
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {travelDetail.description}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 지도 영역 */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-8">
          <div className="p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              위치 정보
            </h3>

            {isNaN(travelDetail.mapX) || isNaN(travelDetail.mapY) ? (
              <div className="aspect-[16/9] bg-gray-100 rounded-lg flex items-center justify-center">
                <div className="text-center text-gray-500">
                  <MapPin className="h-12 w-12 mx-auto mb-2" />
                  <p className="font-medium">위치 정보 없음</p>
                </div>
              </div>
            ) : (
              <div className="rounded-lg overflow-hidden">
                <GoogleMap
                  lat={parseFloat(travelDetail.mapY)}
                  lng={parseFloat(travelDetail.mapX)}
                  title={travelDetail.title}
                />
              </div>
            )}
          </div>
        </div>

        {/* 개선된 상세 정보 */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-8">
          <div className="p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-6 flex items-center gap-2">
              <Info className="h-5 w-5" />
              상세 정보
            </h3>

            <div className="space-y-6">
              {/* 기본 정보 그리드 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
                {/* 왼쪽 (주소, 전화번호) */}
                <div className="flex flex-col gap-4 h-full">
                  <div className="flex-1 flex items-start gap-3 p-4 bg-gray-50 rounded-lg border border-gray-100">
                    <MapPin className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900 mb-1">주소</h4>
                      <p className="text-gray-600 text-sm leading-relaxed">
                        {travelDetail.location}
                      </p>
                      <span className="inline-block mt-2 bg-white border border-gray-200 text-gray-700 text-xs px-2 py-1 rounded-md">
                        {travelDetail.district}
                      </span>
                    </div>
                  </div>

                  <div className="flex-1 flex items-start gap-3 p-4 bg-gray-50 rounded-lg border border-gray-100">
                    <Phone className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900 mb-1">
                        전화번호
                      </h4>
                      <a
                        href={`tel:${travelDetail.phone}`}
                        className="text-blue-600 hover:text-blue-800 font-medium transition-colors hover:underline"
                      >
                        {travelDetail.phone}
                      </a>
                    </div>
                  </div>
                </div>

                {/* 오른쪽 (웹사이트, 운영상태) */}
                <div className="flex flex-col gap-4 h-full">
                  <div className="flex-1 flex items-start gap-3 p-4 bg-gray-50 rounded-lg border border-gray-100">
                    <Globe className="h-5 w-5 text-purple-600 mt-0.5 flex-shrink-0" />
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900 mb-1">
                        웹사이트
                      </h4>
                      {travelDetail.website && travelDetail.website !== "#" ? (
                        <a
                          href={travelDetail.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 font-medium transition-colors hover:underline"
                        >
                          공식 홈페이지 방문
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      ) : (
                        <span className="text-gray-500 text-sm">
                          웹사이트 정보 없음
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex-1 flex items-start gap-3 p-4 bg-gray-50 rounded-lg border border-gray-100">
                    <div className="mt-0.5 flex-shrink-0">
                      {travelDetail.operatingStatus === "운영중" ? (
                        <CheckCircle className="h-5 w-5 text-green-600" />
                      ) : (
                        <XCircle className="h-5 w-5 text-red-600" />
                      )}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900 mb-1">
                        운영 상태
                      </h4>
                      <span
                        className={`inline-block text-sm px-3 py-1 rounded-full font-medium ${
                          travelDetail.operatingStatus === "운영중"
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {travelDetail.operatingStatus}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* 구분선 */}
              <hr className="border-gray-200" />

              {/* 영업시간 */}
              <div>
                <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Clock className="h-5 w-5 text-orange-600" />
                  영업시간
                </h4>
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 border border-blue-100">
                  <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
                    {operatingHoursList.map((item, index) => (
                      <div key={index} className="text-center">
                        <div className="bg-white rounded-lg p-3 shadow-sm border border-gray-100">
                          <div className="font-medium text-gray-900 mb-1 text-sm">
                            {item.day}
                          </div>
                          <div className="text-xs text-gray-600 leading-tight">
                            {item.time}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* 구분선 */}
              <hr className="border-gray-200" />

              {/* 태그 정보 */}
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">태그</h4>
                <div className="flex flex-wrap gap-2">
                  {travelDetail.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="bg-gradient-to-r from-blue-100 to-purple-100 text-gray-700 text-sm px-3 py-1 rounded-full font-medium"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* 구분선 */}
              <hr className="border-gray-200" />

              {/* 편의시설 정보 */}
              <div>
                <h4 className="font-semibold text-gray-900 mb-4">편의시설</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {travelDetail.facilities.map((facility, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-3 p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-100"
                    >
                      <div className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0"></div>
                      <span className="text-green-800 text-sm font-medium">
                        {facility}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 목록으로 버튼 */}
        <div className="text-center">
          <button
            onClick={() => navigate("/travels")}
            className="px-8 py-3 rounded-md text-white font-medium transition-all duration-200 cursor-pointer hover:opacity-90 active:scale-95
    bg-[linear-gradient(100deg,_rgba(115,179,223,0.95)_-49.53%,_rgba(97,160,212,0.95)_24.57%,_rgba(118,217,228,0.95)_129.21%)]"
          >
            목록으로
          </button>
        </div>
      </div>
    </div>
  );
}
export default TravelDetailPage;
