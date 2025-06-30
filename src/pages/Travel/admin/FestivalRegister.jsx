import { useState, useRef } from "react";
import { Calendar, Upload, X, Plus, Phone, Mail, Globe } from "lucide-react";
import StepButton from "../../../components/common/MyPlan/StepButton";

function FestivalRegister() {
  const [uploadedImages, setUploadedImages] = useState([]);
  const [userTags, setUserTags] = useState([]);
  const [newTag, setNewTag] = useState("");
  const fileInputRef = useRef(null);
  const [facilities, setFacilities] = useState({
    limitedPeriod: false,
    parkingAvailable: false,
    reservationRequired: false,
    disabledFriendly: false,
    restroomAvailable: false,
  });

  const facilityItems = [
    { key: "limitedPeriod", label: "기간 한정 여부" },
    { key: "parkingAvailable", label: "주차 가능 여부" },
    { key: "reservationRequired", label: "예약 필요 여부" },
    { key: "disabledFriendly", label: "장애인 편의 여부" },
    { key: "restroomAvailable", label: "화장실 유무" },
  ];

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files || []);
    setUploadedImages((prev) => [...prev, ...files]);
  };

  const removeImage = (index) => {
    setUploadedImages((prev) => prev.filter((_, i) => i !== index));
  };

  const toggleFacility = (facility) => {
    setFacilities((prev) => ({
      ...prev,
      [facility]: !prev[facility],
    }));
  };

  const addTag = () => {
    if (newTag.trim() && !userTags.includes(newTag.trim())) {
      setUserTags((prev) => [...prev, newTag.trim()]);
      setNewTag("");
    }
  };

  const removeTag = (tagToRemove) => {
    setUserTags((prev) => prev.filter((tag) => tag !== tagToRemove));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Festival form submitted", { uploadedImages, userTags });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-sm">
          <div
            className="text-white p-6 rounded-t-lg"
            style={{
              background:
                "linear-gradient(135deg, #61A0D4 0%, #73B3DF 50%, #76D9E4 100%)",
            }}
          >
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <Calendar className="h-6 w-6" />
              축제 등록
            </h1>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-8">
            {/* 기본 정보 */}
            <div className="bg-white rounded-lg shadow-sm">
              <div className="px-6 py-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-blue-400">
                    기본 정보
                  </h3>
                  <span className="text-sm text-red-500">
                    * 는 필수 입니다.
                  </span>
                </div>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <label
                    htmlFor="festivalTitle"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    축제 제목 *
                  </label>
                  <input
                    id="festivalTitle"
                    type="text"
                    placeholder="ex. 벚꽃 마축제"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label
                    htmlFor="festivalBasicInfo"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    축제 기본정보 *
                  </label>
                  <input
                    id="festivalBasicInfo"
                    type="text"
                    placeholder="ex. 봄의 전령 축제를 합니다. 수십 만명이 오는 장소"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label
                    htmlFor="district"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    지역구 *
                  </label>
                  <select
                    id="district"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">지역구를 선택하세요</option>
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="address"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    상세 주소 *
                  </label>
                  <input
                    id="address"
                    type="text"
                    placeholder="축제가 열리는 상세 주소를 입력하세요"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="latitude"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      위도 *
                    </label>
                    <input
                      id="latitude"
                      type="number"
                      step="any"
                      placeholder="37.5665"
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="longitude"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      경도 *
                    </label>
                    <input
                      id="longitude"
                      type="number"
                      step="any"
                      placeholder="126.9780"
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="startDate"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      축제 시작일 *
                    </label>
                    <input
                      id="startDate"
                      type="date"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="endDate"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      축제 종료일 *
                    </label>
                    <input
                      id="endDate"
                      type="date"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label
                      htmlFor="phone"
                      className="flex items-center gap-1 text-sm font-medium text-gray-700 mb-1"
                    >
                      <Phone className="h-4 w-4" />
                      연락처
                    </label>
                    <input
                      id="phone"
                      type="tel"
                      placeholder="010-0000-0000"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="homepage"
                      className="flex items-center gap-1 text-sm font-medium text-gray-700 mb-1"
                    >
                      <Globe className="h-4 w-4" />
                      홈페이지
                    </label>
                    <input
                      id="homepage"
                      type="url"
                      placeholder="https://example.com"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="sns"
                      className="flex items-center gap-1 text-sm font-medium text-gray-700 mb-1"
                    >
                      <Mail className="h-4 w-4" />
                      SNS 링크
                    </label>
                    <input
                      id="sns"
                      type="url"
                      placeholder="https://instagram.com/festival"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="festivalDetailInfo"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    축제 상세 정보
                  </label>
                  <textarea
                    id="festivalDetailInfo"
                    placeholder="축제에서 진행 되는 프로그램이나 축제에 대한 자세한 정보를 입력 해주세요..."
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* 이미지 업로드 */}
            <div className="bg-white rounded-lg shadow-sm">
              <div className="px-6 py-4">
                <h3 className="text-lg font-semibold text-blue-400">
                  축제 이미지 업로드
                </h3>
              </div>
              <div className="p-6 space-y-4">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <Upload className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                  <p className="text-gray-600 mb-4">
                    축제 이미지를 드래그하거나 클릭하여 업로드하세요
                  </p>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="px-4 py-2 border border-blue-300 text-blue-600 rounded-md hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    파일 선택
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </div>

                {uploadedImages.length > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {uploadedImages.map((file, index) => (
                      <div key={index} className="relative">
                        <div className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
                          <img
                            src={
                              URL.createObjectURL(file) || "/placeholder.svg"
                            }
                            alt={`Festival ${index + 1}`}
                            className="w-full h-full object-cover rounded-lg"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute -top-2 -right-2 h-6 w-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* 축제 태그 */}
            <div className="bg-white rounded-lg shadow-sm">
              <div className="px-6 py-4">
                <h3 className="text-lg font-semibold text-blue-400">
                  축제 태그
                </h3>
              </div>
              <div className="p-6 space-y-4">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    placeholder="축제 관련 태그를 입력하세요"
                    onKeyPress={(e) =>
                      e.key === "Enter" && (e.preventDefault(), addTag())
                    }
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  <button
                    type="button"
                    onClick={addTag}
                    className="px-3 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>

                {userTags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {userTags.map((tag, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center gap-1 px-3 py-1 bg-cyan-100 text-gray-800 rounded-full text-sm"
                      >
                        {tag}
                        <button
                          type="button"
                          onClick={() => removeTag(tag)}
                          className="ml-1 hover:bg-cyan-200 rounded-full p-0.5 focus:outline-none"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* 축제 편의시설 및 정보 */}
            <div className="bg-white rounded-lg shadow-sm">
              <div className="px-6 py-4">
                <h3 className="text-lg font-semibold text-blue-400">
                  축제 편의시설 및 정보
                </h3>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {facilityItems.map(({ key, label }) => (
                    <div
                      key={key}
                      className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg border border-gray-200 hover:shadow-md transition-all duration-200"
                    >
                      <span className="text-sm font-medium text-gray-700 flex-1">
                        {label}
                      </span>
                      <button
                        type="button"
                        onClick={() => toggleFacility(key)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                          facilities[key]
                            ? "bg-gradient-to-r from-blue-500 to-blue-600 shadow-lg"
                            : "bg-gray-300"
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-300 shadow-sm ${
                            facilities[key] ? "translate-x-6" : "translate-x-1"
                          }`}
                        />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* 버튼 */}
            <div className="flex justify-center gap-4 pt-6">
              <StepButton type="prev">취소</StepButton>
              <StepButton>등록</StepButton>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default FestivalRegister;
