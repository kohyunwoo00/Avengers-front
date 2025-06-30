import React, { useRef, useEffect, useState } from "react";
import StatusButton from "../../components/common/MyPlan/StatusButton";
import StepButton from "../../components/common/MyPlan/StepButton";

const MyTravelPlanDetail = () => {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef([]);

  // 수정 모드 상태
  const [isEditMode, setIsEditMode] = useState(false);

  // 수정 가능한 데이터 상태들
  const [editableData, setEditableData] = useState({
    title: "남친친구와 주오군 3박4일 여행",
    description: "오사카에서 즐기는 자유 여행",
    flightLink: "https://avengers.com/flight",
    hotelLink: "https://avengers.com/hotel",
  });

  // 수정 가능한 여행지 목록 상태
  const [editablePlaces, setEditablePlaces] = useState([
    {
      id: 7,
      name: "도톤보리",
      lat: 34.6688,
      lng: 135.5025,
      description: "오사카의 대표적인 번화가이자 미식의 거리",
      order: 1,
    },
    {
      id: 8,
      name: "신사이바시",
      lat: 34.6742,
      lng: 135.5018,
      description: "쇼핑과 패션의 중심지",
      order: 2,
    },
    {
      id: 9,
      name: "구로몬 시장",
      lat: 34.6684,
      lng: 135.5058,
      description: "오사카의 부엌이라 불리는 전통 시장",
      order: 3,
    },
    {
      id: 10,
      name: "호젠지",
      lat: 34.6693,
      lng: 135.5032,
      description: "물을 뿌려 기원하는 독특한 절",
      order: 4,
    },
    {
      id: 11,
      name: "난바 파크스",
      lat: 34.6654,
      lng: 135.5035,
      description: "옥상 정원이 아름다운 복합 쇼핑몰",
      order: 5,
    },
  ]);

  const [originalTravelPlan] = useState({
    id: 1,
    status: "예정",
    region: "오사카 중앙구",
    startDate: "2025년 7월 17일",
    endDate: "2025년 7월 21일",
    travelers: "2명",
    budget: "800,000원 ~ 1,200,000원",
    createdDate: "2025년 06월 19일",
    modifiedDate: "2025년 06월 21일",
  });

  // 구글맵 초기화 및 마커 표시
  useEffect(() => {
    const apiKey = window.ENV.GOOGLE_MAPS_API_KEY;

    const initMap = () => {
      if (window.google && window.google.maps && mapRef.current) {
        const map = new window.google.maps.Map(mapRef.current, {
          center: { lat: 34.6937, lng: 135.5023 },
          zoom: 14,
          mapTypeControl: true,
          streetViewControl: false,
          zoomControl: true,
          fullscreenControl: true,
        });

        mapInstanceRef.current = map;
      }
    };

    if (window.google && window.google.maps) {
      console.log("구글맵 API가 이미 로드되어 있음");
      initMap();
    } else {
      console.log("구글맵 API 스크립트 로드 중...");
      const script = document.createElement("script");
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
      script.async = true;
      script.defer = true;
      script.onload = initMap;
      document.head.appendChild(script);

      return () => {
        if (document.head.contains(script)) {
          document.head.removeChild(script);
        }
      };
    }
  }, []);

  // 여행지 목록 변경 시 지도 마커 업데이트
  useEffect(() => {
    if (mapInstanceRef.current && editablePlaces.length > 0) {
      updateMapMarkers();
    }
  }, [editablePlaces]);

  const updateMapMarkers = () => {
    markersRef.current.forEach((marker) => marker.setMap(null));
    markersRef.current = [];

    editablePlaces.forEach((place) => {
      const marker = new window.google.maps.Marker({
        position: { lat: place.lat, lng: place.lng },
        map: mapInstanceRef.current,
        title: `${place.order}. ${place.name}`,
        icon: {
          url: `http://maps.google.com/mapfiles/kml/paddle/${place.order}.png`,
          scaledSize: new window.google.maps.Size(32, 32),
        },
      });

      const infoWindow = new window.google.maps.InfoWindow({
        content: `
          <div style="padding: 8px;">
            <h4 style="margin: 0 0 4px 0; font-weight: bold;">${place.order}. ${place.name}</h4>
            <p style="margin: 0; font-size: 12px; color: #666;">${place.description}</p>
          </div>
        `,
      });

      marker.addListener("click", () => {
        infoWindow.open(mapInstanceRef.current, marker);
      });

      markersRef.current.push(marker);
    });

    if (editablePlaces.length > 0) {
      const bounds = new window.google.maps.LatLngBounds();
      editablePlaces.forEach((place) => {
        bounds.extend({ lat: place.lat, lng: place.lng });
      });
      mapInstanceRef.current.fitBounds(bounds);
    }
  };

  const handlePlaceMoveUp = (index) => {
    if (index > 0) {
      const newPlaces = [...editablePlaces];
      [newPlaces[index - 1], newPlaces[index]] = [
        newPlaces[index],
        newPlaces[index - 1],
      ];
      newPlaces.forEach((place, idx) => {
        place.order = idx + 1;
      });
      setEditablePlaces(newPlaces);
    }
  };

  const handlePlaceMoveDown = (index) => {
    if (index < editablePlaces.length - 1) {
      const newPlaces = [...editablePlaces];
      [newPlaces[index], newPlaces[index + 1]] = [
        newPlaces[index + 1],
        newPlaces[index],
      ];
      newPlaces.forEach((place, idx) => {
        place.order = idx + 1;
      });
      setEditablePlaces(newPlaces);
    }
  };

  const handleGoBack = () => {
    console.log("뒤로가기 클릭");
    // TODO: /myplan/list 페이지로 이동하도록 라우팅 처리
  };

  const handleEdit = () => {
    setIsEditMode(true);
  };

  const handleCancelEdit = () => {
    console.log("수정 취소 클릭");
    setEditableData({
      title: "남친친구와 주오군 3박4일 여행",
      description: "오사카에서 즐기는 자유 여행",
      flightLink: "https://example.com/flight",
      hotelLink: "https://example.com/hotel",
    });
    setEditablePlaces([
      {
        id: 7,
        name: "도톤보리",
        lat: 34.6688,
        lng: 135.5025,
        description: "오사카의 대표적인 번화가이자 미식의 거리",
        order: 1,
      },
      {
        id: 8,
        name: "신사이바시",
        lat: 34.6742,
        lng: 135.5018,
        description: "쇼핑과 패션의 중심지",
        order: 2,
      },
      {
        id: 9,
        name: "구로몬 시장",
        lat: 34.6684,
        lng: 135.5058,
        description: "오사카의 부엌이라 불리는 전통 시장",
        order: 3,
      },
      {
        id: 10,
        name: "호젠지",
        lat: 34.6693,
        lng: 135.5032,
        description: "물을 뿌려 기원하는 독특한 절",
        order: 4,
      },
      {
        id: 11,
        name: "난바 파크스",
        lat: 34.6654,
        lng: 135.5035,
        description: "옥상 정원이 아름다운 복합 쇼핑몰",
        order: 5,
      },
    ]);
    setIsEditMode(false);
  };

  const handleSaveEdit = () => {
    console.log("수정 저장 클릭", editableData, editablePlaces);

    if (!editableData.title.trim()) {
      alert("여행 제목을 입력해주세요.");
      return;
    }

    if (!editableData.description.trim()) {
      alert("여행 설명을 입력해주세요.");
      return;
    }

    if (
      editableData.flightLink &&
      !editableData.flightLink.startsWith("http")
    ) {
      alert("항공편 링크는 http:// 또는 https://로 시작해야 합니다.");
      return;
    }

    if (editableData.hotelLink && !editableData.hotelLink.startsWith("http")) {
      alert("숙소 링크는 http:// 또는 https://로 시작해야 합니다.");
      return;
    }

    alert("여행 플랜이 성공적으로 수정되었습니다!");
    setIsEditMode(false);
  };

  const handleInputChange = (field, value) => {
    setEditableData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <div className="flex justify-center items-start min-h-screen p-6 bg-gray-50">
      <div className="w-full max-w-[1000px] bg-white rounded-lg shadow-sm">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            {isEditMode ? (
              <input
                type="text"
                value={editableData.title}
                onChange={(e) => handleInputChange("title", e.target.value)}
                className="text-xl font-semibold text-gray-800 border border-gray-300 rounded px-3 py-1 flex-1 mr-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="여행 제목을 입력하세요"
              />
            ) : (
              <h1 className="text-xl font-semibold text-gray-800">
                {editableData.title}
              </h1>
            )}

            <button
              onClick={handleGoBack}
              className="flex items-center space-x-1 text-gray-600 hover:text-gray-800 transition-colors"
              disabled={isEditMode}
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              <span className="text-sm">목록으로</span>
            </button>
          </div>

          <div className="flex items-center space-x-3 mb-3">
            <StatusButton
              type={
                originalTravelPlan.status === "예정" ? "planned" : "completed"
              }
              isActive={true}
            >
              {originalTravelPlan.status}
            </StatusButton>
          </div>
        </div>

        <div className="p-6">
          <div className="bg-blue-50 rounded-lg p-6 mb-6">
            <h2 className="text-lg font-medium text-gray-800 mb-4">
              여행 정보
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center text-sm">
                <div className="w-4 h-4 mr-3 text-blue-600">
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                <span className="font-medium text-gray-700 mr-2">
                  선택된 지역:
                </span>
                <span className="text-gray-600">
                  {originalTravelPlan.region}
                </span>
              </div>

              <div className="flex items-center text-sm">
                <div className="w-4 h-4 mr-3 text-blue-600">
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <span className="font-medium text-gray-700 mr-2">
                  여행 기간:
                </span>
                <span className="text-gray-600">
                  {originalTravelPlan.startDate} ~ {originalTravelPlan.endDate}
                </span>
              </div>

              <div className="flex items-center text-sm">
                <div className="w-4 h-4 mr-3 text-blue-600">
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                </div>
                <span className="font-medium text-gray-700 mr-2">
                  여행 인원:
                </span>
                <span className="text-gray-600">
                  {originalTravelPlan.travelers}
                </span>
              </div>

              <div className="flex items-center text-sm">
                <div className="w-4 h-4 mr-3 text-blue-600">
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                    />
                  </svg>
                </div>
                <span className="font-medium text-gray-700 mr-2">
                  예상 예산:
                </span>
                <span className="text-gray-600">
                  {originalTravelPlan.budget}
                </span>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-blue-200">
              <span className="font-medium text-gray-700 text-sm">
                여행 설명:
              </span>
              {isEditMode ? (
                <textarea
                  value={editableData.description}
                  onChange={(e) =>
                    handleInputChange("description", e.target.value)
                  }
                  className="w-full mt-1 p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  rows="3"
                  placeholder="여행에 대한 설명을 입력하세요"
                />
              ) : (
                <p className="text-gray-600 text-sm mt-1">
                  {editableData.description}
                </p>
              )}
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-6 mb-6">
            <h2 className="text-lg font-medium text-gray-800 mb-4">
              예약 정보
            </h2>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">
                  ✈️ 항공편 링크:
                </span>
                {isEditMode ? (
                  <input
                    type="url"
                    value={editableData.flightLink}
                    onChange={(e) =>
                      handleInputChange("flightLink", e.target.value)
                    }
                    className="border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
                    placeholder="https://example.com/flight"
                  />
                ) : (
                  <a
                    href={editableData.flightLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 text-sm underline"
                  >
                    항공편 확인하기
                  </a>
                )}
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">
                  🏨 숙소 링크:
                </span>
                {isEditMode ? (
                  <input
                    type="url"
                    value={editableData.hotelLink}
                    onChange={(e) =>
                      handleInputChange("hotelLink", e.target.value)
                    }
                    className="border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
                    placeholder="https://example.com/hotel"
                  />
                ) : (
                  <a
                    href={editableData.hotelLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 text-sm underline"
                  >
                    숙소 확인하기
                  </a>
                )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <div>
              <h2 className="text-lg font-medium text-gray-800 mb-4">
                여행지 목록 ({editablePlaces.length}개)
                {isEditMode && (
                  <span className="text-sm text-gray-600 ml-2">
                    (순서 변경 가능)
                  </span>
                )}
              </h2>
              <div className="space-y-3">
                {editablePlaces.map((place, index) => (
                  <div
                    key={place.id}
                    className="bg-white border border-gray-200 rounded-lg p-4"
                  >
                    <div className="flex items-start space-x-3">
                      <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">
                        {place.order}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-gray-800 text-sm mb-1">
                          {place.name}
                        </h4>
                        <p className="text-gray-600 text-xs leading-relaxed">
                          {place.description}
                        </p>
                      </div>

                      {isEditMode && (
                        <div className="flex flex-col space-y-1">
                          <button
                            onClick={() => handlePlaceMoveUp(index)}
                            disabled={index === 0}
                            className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-30 disabled:cursor-not-allowed"
                            title="위로 이동"
                          >
                            <svg
                              className="w-4 h-4"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M5 15l7-7 7 7"
                              />
                            </svg>
                          </button>

                          <button
                            onClick={() => handlePlaceMoveDown(index)}
                            disabled={index === editablePlaces.length - 1}
                            className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-30 disabled:cursor-not-allowed"
                            title="아래로 이동"
                          >
                            <svg
                              className="w-4 h-4"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M19 9l-7 7-7-7"
                              />
                            </svg>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h2 className="text-lg font-medium text-gray-800 mb-4">
                여행지 위치 지도
              </h2>
              <div className="relative">
                <div
                  ref={mapRef}
                  className="w-full h-80 rounded-lg border border-gray-300 shadow-sm"
                  style={{ minHeight: "320px" }}
                />
                {!mapInstanceRef.current && (
                  <div className="absolute inset-0 flex items-center justify-center bg-gray-100 rounded-lg">
                    <div className="text-gray-500 text-sm">
                      지도를 불러오는 중...
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-800 mb-4">
              플랜 관리
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="text-sm">
                <span className="font-medium text-gray-700">생성일: </span>
                <span className="text-gray-600">
                  {originalTravelPlan.createdDate}
                </span>
              </div>
              <div className="text-sm">
                <span className="font-medium text-gray-700">수정일: </span>
                <span className="text-gray-600">
                  {originalTravelPlan.modifiedDate}
                </span>
              </div>
            </div>

            <div className="flex justify-end space-x-3">
              {isEditMode ? (
                <>
                  <StepButton type="prev" onClick={handleCancelEdit}>
                    취소
                  </StepButton>
                  <StepButton type="next" onClick={handleSaveEdit}>
                    저장
                  </StepButton>
                </>
              ) : (
                <StepButton type="next" onClick={handleEdit}>
                  수정하기
                </StepButton>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyTravelPlanDetail;
