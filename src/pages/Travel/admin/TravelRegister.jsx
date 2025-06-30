import { useState, useRef } from "react";
import {
  MapPin,
  Clock,
  Phone,
  Mail,
  Globe,
  Upload,
  X,
  Plus,
} from "lucide-react";
import StepButton from "../../../components/common/MyPlan/StepButton";

function TravelRegister() {
  const [operatingHours, setOperatingHours] = useState({
    월: { isOpen: false, startTime: "09:00", endTime: "18:00" },
    화: { isOpen: false, startTime: "09:00", endTime: "18:00" },
    수: { isOpen: false, startTime: "09:00", endTime: "18:00" },
    목: { isOpen: false, startTime: "09:00", endTime: "18:00" },
    금: { isOpen: false, startTime: "09:00", endTime: "18:00" },
    토: { isOpen: false, startTime: "09:00", endTime: "18:00" },
    일: { isOpen: false, startTime: "09:00", endTime: "18:00" },
  });

  const facilityItems = [
    { key: "limitedPeriod", label: "기간 한정 여부" },
    { key: "parkingAvailable", label: "주차 가능 여부" },
    { key: "reservationRequired", label: "예약 필요 여부" },
    { key: "disabledFriendly", label: "장애인 편의 여부" },
    { key: "restroomAvailable", label: "화장실 유무" },
  ];

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

  const days = ["월", "화", "수", "목", "금", "토", "일"];
  const dayNames = {
    월: "월요일",
    화: "화요일",
    수: "수요일",
    목: "목요일",
    금: "금요일",
    토: "토요일",
    일: "일요일",
  };

  const dayColors = {
    월: "#FF6B6B", // Red
    화: "#4ECDC4", // Teal
    수: "#45B7D1", // Blue
    목: "#96CEB4", // Green
    금: "#FFEAA7", // Yellow
    토: "#DDA0DD", // Plum
    일: "#FFB347", // Orange
  };

  const toggleDay = (day) => {
    setOperatingHours((prev) => ({
      ...prev,
      [day]: {
        ...prev[day],
        isOpen: !prev[day].isOpen,
      },
    }));
  };

  const toggleAllDays = () => {
    const allOpen = days.every((day) => operatingHours[day].isOpen);
    const newState = !allOpen;

    setOperatingHours((prev) => {
      const updated = { ...prev };
      days.forEach((day) => {
        updated[day] = { ...updated[day], isOpen: newState };
      });
      return updated;
    });
  };

  const updateTime = (day, timeType, value) => {
    setOperatingHours((prev) => ({
      ...prev,
      [day]: {
        ...prev[day],
        [timeType]: value,
      },
    }));
  };

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
    console.log("Form submitted", { operatingHours, uploadedImages, userTags });
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
              <MapPin className="h-6 w-6" />
              여행지 등록
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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="name"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      여행지명 *
                    </label>
                    <input
                      id="name"
                      type="text"
                      placeholder="여행지 이름을 입력하세요"
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="category"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      카테고리 *
                    </label>
                    <select
                      id="category"
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">카테고리를 선택하세요</option>
                    </select>
                  </div>
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
                    주소 *
                  </label>
                  <input
                    id="address"
                    type="text"
                    placeholder="상세 주소를 입력하세요"
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
                      htmlFor="email"
                      className="flex items-center gap-1 text-sm font-medium text-gray-700 mb-1"
                    >
                      <Mail className="h-4 w-4" />
                      이메일
                    </label>
                    <input
                      id="email"
                      type="email"
                      placeholder="example@email.com"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="website"
                      className="flex items-center gap-1 text-sm font-medium text-gray-700 mb-1"
                    >
                      <Globe className="h-4 w-4" />
                      웹사이트
                    </label>
                    <input
                      id="website"
                      type="url"
                      placeholder="https://example.com"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="description"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    상세 설명
                  </label>
                  <textarea
                    id="description"
                    placeholder="여행지에 대한 상세한 설명을 입력하세요"
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
                  이미지 업로드
                </h3>
              </div>
              <div className="p-6 space-y-4">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <Upload className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                  <p className="text-gray-600 mb-4">
                    이미지를 드래그하거나 클릭하여 업로드하세요
                  </p>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="px-4 py-2 border border-blue-300 text-blue-400 rounded-md hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                            alt={`Upload ${index + 1}`}
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

            {/* 운영 정보 */}
            <div className="bg-white rounded-lg shadow-sm">
              <div className="px-6 py-4">
                <h3 className="text-lg font-semibold text-blue-400 flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  운영 정보
                </h3>
              </div>
              <div className="p-6 space-y-6">
                <div>
                  <label className="block text-base font-medium text-gray-700 mb-3">
                    운영 요일
                  </label>
                  <div className="space-y-3">
                    <button
                      type="button"
                      onClick={toggleAllDays}
                      className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      style={{
                        backgroundColor: days.every(
                          (day) => operatingHours[day].isOpen
                        )
                          ? "#73B3DF"
                          : "white",
                        color: days.every((day) => operatingHours[day].isOpen)
                          ? "white"
                          : "#61A0D4",
                        borderColor: "#73B3DF",
                      }}
                    >
                      전체 운영 (
                      {days.every((day) => operatingHours[day].isOpen)
                        ? "해제"
                        : "설정"}
                      )
                    </button>

                    <div className="flex flex-wrap gap-2">
                      {days.map((day) => (
                        <button
                          key={day}
                          type="button"
                          onClick={() => toggleDay(day)}
                          className="min-w-[60px] px-3 py-2 rounded-md text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
                          style={{
                            backgroundColor: operatingHours[day].isOpen
                              ? dayColors[day]
                              : "white",
                            color: operatingHours[day].isOpen
                              ? "white"
                              : "#374151",
                            border: operatingHours[day].isOpen
                              ? `1px solid ${dayColors[day]}`
                              : "1px solid #d1d5db",
                          }}
                        >
                          {day}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="block text-base font-medium text-gray-700">
                    운영 시간
                  </label>
                  {days.map((day) => (
                    <div
                      key={day}
                      className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg"
                    >
                      <div
                        className="flex items-center justify-center w-8 h-8 rounded-full text-white text-sm font-medium"
                        style={{
                          backgroundColor: operatingHours[day].isOpen
                            ? dayColors[day]
                            : "#D1D5DB",
                        }}
                      >
                        {day}
                      </div>

                      <div className="w-16 text-sm font-medium text-gray-700">
                        {dayNames[day]}
                      </div>

                      {operatingHours[day].isOpen ? (
                        <div className="flex items-center gap-2 flex-1">
                          <input
                            type="time"
                            value={operatingHours[day].startTime}
                            onChange={(e) =>
                              updateTime(day, "startTime", e.target.value)
                            }
                            className="w-34px px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                          <span className="text-gray-500">~</span>
                          <input
                            type="time"
                            value={operatingHours[day].endTime}
                            onChange={(e) =>
                              updateTime(day, "endTime", e.target.value)
                            }
                            className="w-34 px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                          <span className="text-xs text-blue-500 ml-2">
                            운영시간({operatingHours[day].startTime} ~{" "}
                            {operatingHours[day].endTime})
                          </span>
                        </div>
                      ) : (
                        <div className="flex-1 text-gray-400 text-sm">
                          휴무일({day}요일은 운영하지 않습니다)
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* 사용자 태그 */}
            <div className="bg-white rounded-lg shadow-sm">
              <div className="px-6 py-4 rounded-lg">
                <h3 className="text-lg font-semibold text-blue-400">
                  사용자 태그
                </h3>
              </div>
              <div className="p-6 space-y-4">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    placeholder="태그를 입력하세요"
                    onKeyPress={(e) =>
                      e.key === "Enter" && (e.preventDefault(), addTag())
                    }
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  <button
                    type="button"
                    onClick={addTag}
                    className="px-3 py-2 bg-blue-400 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
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

export default TravelRegister;
