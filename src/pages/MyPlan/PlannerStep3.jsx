import React, { useState, useEffect, useRef } from "react";

const PlannerStep3 = ({
  onDataChange,
  onValidationChange,
  initialData = {},
  selectedRegion = "",
  showErrors = false,
}) => {
  // 선택된 여행지들 상태 관리
  const [selectedPlaces, setSelectedPlaces] = useState(
    initialData.selectedPlaces || []
  );

  const mapRef = useRef(null); // 지도 참조하는 ref
  const mapInstanceRef = useRef(null); // 맵 인스턴스 저장
  const directionsServiceRef = useRef(null); // DirectionsService 인스턴스
  const directionsRendererRef = useRef(null); // DirectionsRenderer 인스턴스
  const markersRef = useRef([]); // 모든 마커들을 저장하는 배열

  const [errors, setErrors] = useState({
    selectedPlaces: "",
  });

  // 오사카 각 구별 여행지 데이터 (실제 여행지 정보 기반)
  const osakaPlacesByRegion = {
    키타구: [
      {
        id: 1,
        name: "오사카성",
        lat: 34.6873,
        lng: 135.5262,
        image: "/api/placeholder/150/100",
        description: "오사카의 대표적인 성으로 일본의 역사를 체험할 수 있는 곳",
      },
      {
        id: 2,
        name: "우메다 스카이 빌딩",
        lat: 34.7054,
        lng: 135.4903,
        image: "/api/placeholder/150/100",
        description: "173m 높이의 쌍둥이 빌딩으로 유명한 전망대",
      },
      {
        id: 3,
        name: "한큐 우메다 백화점",
        lat: 34.7024,
        lng: 135.4977,
        image: "/api/placeholder/150/100",
        description: "일본 최대 규모의 백화점 중 하나",
      },
      {
        id: 4,
        name: "우메다 지하상가",
        lat: 34.7017,
        lng: 135.4969,
        image: "/api/placeholder/150/100",
        description: "거대한 지하 쇼핑몰과 음식점가",
      },
      {
        id: 5,
        name: "HEP FIVE",
        lat: 34.7025,
        lng: 135.4985,
        image: "/api/placeholder/150/100",
        description: "빨간 관람차가 유명한 쇼핑몰",
      },
      {
        id: 6,
        name: "츠유노텐진사",
        lat: 34.7133,
        lng: 135.5103,
        image: "/api/placeholder/150/100",
        description: "학문의 신을 모시는 신사",
      },
    ],
    주오구: [
      {
        id: 7,
        name: "도톤보리",
        lat: 34.6688,
        lng: 135.5025,
        image: "/api/placeholder/150/100",
        description: "오사카의 대표적인 번화가이자 미식의 거리",
      },
      {
        id: 8,
        name: "신사이바시",
        lat: 34.6742,
        lng: 135.5018,
        image: "/api/placeholder/150/100",
        description: "쇼핑과 패션의 중심지",
      },
      {
        id: 9,
        name: "구로몬 시장",
        lat: 34.6684,
        lng: 135.5058,
        image: "/api/placeholder/150/100",
        description: "오사카의 부엌이라 불리는 전통 시장",
      },
      {
        id: 10,
        name: "호젠지",
        lat: 34.6693,
        lng: 135.5032,
        image: "/api/placeholder/150/100",
        description: "물을 뿌려 기원하는 독특한 절",
      },
      {
        id: 11,
        name: "난바 파크스",
        lat: 34.6654,
        lng: 135.5035,
        image: "/api/placeholder/150/100",
        description: "옥상 정원이 아름다운 복합 쇼핑몰",
      },
      {
        id: 12,
        name: "덴포잔 대관람차",
        lat: 34.6652,
        lng: 135.4285,
        image: "/api/placeholder/150/100",
        description: "오사카 베이를 한눈에 볼 수 있는 거대한 관람차",
      },
    ],
    텐노지구: [
      {
        id: 13,
        name: "시텐노지",
        lat: 34.6547,
        lng: 135.5162,
        image: "/api/placeholder/150/100",
        description: "593년에 세워진 일본에서 가장 오래된 불교 사원",
      },
      {
        id: 14,
        name: "텐노지 동물원",
        lat: 34.6515,
        lng: 135.5076,
        image: "/api/placeholder/150/100",
        description: "100년이 넘는 역사를 가진 동물원",
      },
      {
        id: 15,
        name: "아베노 하루카스",
        lat: 34.6462,
        lng: 135.5142,
        image: "/api/placeholder/150/100",
        description: "일본에서 가장 높은 빌딩",
      },
      {
        id: 16,
        name: "신세카이",
        lat: 34.6526,
        lng: 135.5062,
        image: "/api/placeholder/150/100",
        description: "레트로한 분위기의 오락가",
      },
      {
        id: 17,
        name: "츠텐카쿠",
        lat: 34.6523,
        lng: 135.5063,
        image: "/api/placeholder/150/100",
        description: "오사카의 상징적인 타워",
      },
    ],
    니시구: [
      {
        id: 18,
        name: "아메리카무라",
        lat: 34.6721,
        lng: 135.4968,
        image: "/api/placeholder/150/100",
        description: "젊은이들의 문화 중심지",
      },
      {
        id: 19,
        name: "혼간지",
        lat: 34.6737,
        lng: 135.4989,
        image: "/api/placeholder/150/100",
        description: "정토진종의 총본산",
      },
      {
        id: 20,
        name: "우츠보 공원",
        lat: 34.6824,
        lng: 135.4893,
        image: "/api/placeholder/150/100",
        description: "도심 속 오아시스 같은 공원",
      },
    ],
    미나토구: [
      {
        id: 21,
        name: "카이유칸 수족관",
        lat: 34.6551,
        lng: 135.4287,
        image: "/api/placeholder/150/100",
        description: "세계 최대급 수족관 중 하나",
      },
      {
        id: 22,
        name: "유니버설 스튜디오 재팬",
        lat: 34.6654,
        lng: 135.4322,
        image: "/api/placeholder/150/100",
        description: "헐리우드 영화 테마파크",
      },
      {
        id: 23,
        name: "템포잔 하버 빌리지",
        lat: 34.6561,
        lng: 135.4268,
        image: "/api/placeholder/150/100",
        description: "쇼핑과 오락이 어우러진 복합시설",
      },
    ],
  };

  // 현재 선택된 구의 여행ㅈ; 목록
  const currentPlaces = osakaPlacesByRegion[selectedRegion] || [];

  // 초기 데이터 변경 -> 상태 업데이트
  useEffect(() => {
    setSelectedPlaces(initialData.selectedPlaces || []);
  }, [initialData]);

  // 구글맵 초기화
  useEffect(() => {
    const apiKey = window.ENV.GOOGLE_MAPS_API_KEY;

    const initMap = () => {
      if (window.google && window.google.maps && mapRef.current) {
        const map = new window.google.maps.Map(mapRef.current, {
          center: { lat: 34.6937, lng: 135.5023 }, // 오사카 중심 좌표
          zoom: 13,

          // 지도 옵션 설정
          mapTypeControl: true,
          mapTypeControlOptions: {
            style: window.google.maps.MapTypeControlStyle.HORIZONTAL_BAR,
            position: window.google.maps.ControlPosition.TOP_CENTER,
          },

          streetViewControl: false,
          streetViewControlOptions: {
            position: window.google.maps.ControlPosition.RIGHT_BOTTOM,
          },

          zoomControl: true,
          zoomControlOptions: {
            position: window.google.maps.ControlPosition.RIGHT_CENTER,
          },

          fullscreenControl: true,
          fullscreenControlOptions: {
            position: window.google.maps.ControlPosition.RIGHT_TOP,
          },
        });

        mapInstanceRef.current = map;

        // DirectionsService와 DirectionsRenderer 초기화
        directionsServiceRef.current =
          new window.google.maps.DirectionsService();
        directionsRendererRef.current =
          new window.google.maps.DirectionsRenderer({
            suppressMarkers: true, // 기본 마커 숨김 => 커스텀 마커 사용
            polylineOptions: {
              strokeColor: "#2563eb", // 경로 선의 색상
              strokerWeight: 4, // 경로선 두께
              strokeOpacity: 0.8, // 경로선 투명도
            },
          });
        directionsRendererRef.current.setMap(map);
      }
    };

    if (window.google && window.google.maps) {
      initMap();
    } else {
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

  // 선택된 여행지 변경 => 지도 업데이트
  useEffect(() => {
    if (mapInstanceRef.current && selectedPlaces.length > 0) {
      updateMapWithRoute();
    } else if (mapInstanceRef.current) {
      // 선택된 장소 없음 => 마커와 경로 둘다 제거
      clearMapMarkers();
    }
  }, [selectedPlaces]);

  // 지도에서 마커제거
  const clearMapMarkers = () => {
    markersRef.current.forEach((marker) => marker.setMap(null));
    markersRef.current = []; // 기존 마커 제거

    if (directionsRendererRef.current) {
      directionsRendererRef.current.setDirections({ routes: [] }); // 기존 경로 제거
    }
  };

  // 선택된 여행지들 마커 표시 & 경로 그리기
  const updateMapWithRoute = () => {
    if (!mapInstanceRef.current || selectedPlaces.length === 0) return;

    clearMapMarkers();

    const waypoints = selectedPlaces.map((place) => ({
      ...place,
      position: { lat: place.lat, lng: place.lng },
    }));

    // 각각의 여행지에 순서별로 마커 표시
    waypoints.forEach((place, index) => {
      const marker = new window.google.maps.Marker({
        position: place.position,
        map: mapInstanceRef.current,
        title: `${index + 1}. ${place.name}`,
        icon: {
          // 순서를 표시하는 커스텀 마커
          url: `http://maps.google.com/mapfiles/kml/paddle/${index + 1}.png`,
          scaledSize: new window.google.maps.Size(32, 32),
        },
      });

      // 마커 클릭 시 정보창 표시
      const infoWindow = new window.google.maps.InfoWindow({
        content: `
          <div style="padding: 8px;">
            <h4 style="margin: 0 0 4px 0; font-weight: bold;">${index + 1}. ${
          place.name
        }</h4>
            <p style="margin: 0; font-size: 12px; color: #666;">${
              place.description
            }</p>
          </div>
            `,
      });

      marker.addListener("click", () => {
        infoWindow.open(mapInstanceRef.current, marker);
      });

      markersRef.current.push(marker);
    });

    // 2개 이상의 장소가 선택되었을 때만 경로 그리기
    if (waypoints.length >= 2) {
      const origin = waypoints[0].position; // 첫 번째 장소
      const destination = waypoints[waypoints.length - 1].position; // 마지막 장소
      const waypoints_for_route = waypoints.slice(1, -1).map((place) => ({
        location: place.position,
        stopover: true, // 경유지로 설정
      }));

      // 경로 요청
      directionsServiceRef.current.route(
        {
          origin: origin,
          destination: destination,
          waypoints: waypoints_for_route,
          optimizeWaypoints: false,
          travelMode: window.google.maps.TravelMode.WALKING, // 도보 경로
        },
        (result, status) => {
          if (status === "OK") {
            directionsRendererRef.current.setDirections(result);
            console.log("경로 표시 완료");
          } else {
            console.error("경로 생성 실패:", status);
          }
        }
      );
    }

    if (waypoints.length > 0) {
      const bounds = new window.google.maps.LatLngBounds();
      waypoints.forEach((place) => bounds.extend(place.position));
      mapInstanceRef.current.fitBounds(bounds);
    }
  };

  // 여행지 선택/해제 처리
  const handlePlaceToggle = (place) => {
    const isSelected = selectedPlaces.some((p) => p.id === place.id);

    if (isSelected) {
      // 이미 선택된 경우 제거
      const newSelectedPlaces = selectedPlaces.filter((p) => p.id !== place.id);
      setSelectedPlaces(newSelectedPlaces);
      updateData(newSelectedPlaces);
    } else {
      // 새로 선택하는 경우
      if (selectedPlaces.length >= 5) {
        // 최대 5개 제한
        alert("최대 5개까지만 선택할 수 있습니다.");
        return;
      }

      const newSelectedPlaces = [...selectedPlaces, place];
      setSelectedPlaces(newSelectedPlaces);
      updateData(newSelectedPlaces);
    }
  };

  // 선택된 여행지에서 특정 여행지 제거
  const handleRemovePlace = (placeId) => {
    const newSelectedPlaces = selectedPlaces.filter((p) => p.id !== placeId);
    setSelectedPlaces(newSelectedPlaces);
    updateData(newSelectedPlaces);
  };

  // 선택된 여행지 순서 변경 (위로 이동)
  const handleMoveUp = (index) => {
    if (index > 0) {
      const newSelectedPlaces = [...selectedPlaces];
      [newSelectedPlaces[index - 1], newSelectedPlaces[index]] = [
        newSelectedPlaces[index],
        newSelectedPlaces[index - 1],
      ];
      setSelectedPlaces(newSelectedPlaces);
      updateData(newSelectedPlaces);
    }
  };

  // 선택된 여행지 순서 변경 (아래로 이동)
  const handleMoveDown = (index) => {
    if (index < selectedPlaces.length - 1) {
      const newSelectedPlaces = [...selectedPlaces];
      [newSelectedPlaces[index], newSelectedPlaces[index + 1]] = [
        newSelectedPlaces[index + 1],
        newSelectedPlaces[index],
      ];
      setSelectedPlaces(newSelectedPlaces);
      updateData(newSelectedPlaces);
    }
  };

  // 유효성 검사 함수
  const validateData = (selectedPlacesArray) => {
    const newErrors = {
      selectedPlaces: "",
    };

    let isValid = true;

    // 최소 1개 이상의 여행지 선택 확인
    if (selectedPlacesArray.length === 0) {
      newErrors.selectedPlaces = "최소 1개 이상의 여행지를 선택해주세요.";
      isValid = false;
    }

    setErrors(newErrors);
    return { isValid, errors: newErrors };
  };

  // 데이터 업데이트 및 부모 컴포넌트에 알림
  const updateData = (selectedPlacesArray) => {
    const validationResult = validateData(selectedPlacesArray);

    // 부모 컴포넌트에 데이터 변경 알림
    onDataChange({
      selectedPlaces: selectedPlacesArray,
    });

    // 부모 컴포넌트에 유효성 검사 결과 알림
    onValidationChange(validationResult.isValid);
  };

  return (
    <div className="h-full flex gap-6">
      {/* 왼쪽: 여행지 목록 */}
      <div className="w-1/2 flex flex-col">
        {/* 선택된 구 정보 */}
        <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <h3 className="text-sm font-medium text-blue-800">
            선택된 지역: {selectedRegion}
          </h3>
          <p className="text-xs text-blue-600 mt-1">
            아래에서 방문하고 싶은 여행지를 최대 5개까지 선택해주세요.
          </p>
        </div>

        {/* 여행지 목록 */}
        <div className="flex-1 overflow-y-auto">
          {currentPlaces.length === 0 ? (
            <div className="text-center text-gray-500 py-8">
              <p>해당 지역의 여행지 정보가 없습니다.</p>
              <p className="text-sm mt-2">다른 지역을 선택해주세요.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-3">
              {currentPlaces.map((place) => {
                const isSelected = selectedPlaces.some(
                  (p) => p.id === place.id
                );
                const selectedIndex = selectedPlaces.findIndex(
                  (p) => p.id === place.id
                );

                return (
                  <div
                    key={place.id}
                    className={`relative border rounded-lg p-4 cursor-pointer transition-all duration-200 ${
                      isSelected
                        ? "border-blue-500 bg-blue-50 shadow-md"
                        : "border-gray-200 hover:border-gray-300 hover:shadow-sm"
                    }`}
                    onClick={() => handlePlaceToggle(place)}
                  >
                    {/* 선택 순서 표시 */}
                    {isSelected && (
                      <div className="absolute top-2 right-2 w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold">
                        {selectedIndex + 1}
                      </div>
                    )}

                    <div className="flex gap-3">
                      {/* 여행지 이미지 */}
                      <div className="w-20 h-16 bg-gray-200 rounded-md flex items-center justify-center text-xs text-gray-500 flex-shrink-0">
                        이미지
                      </div>

                      {/* 여행지 정보 */}
                      <div className="flex-1 min-w-0">
                        <h4
                          className={`font-medium text-sm mb-1 ${
                            isSelected ? "text-blue-800" : "text-gray-800"
                          }`}
                        >
                          {place.name}
                        </h4>
                        <p
                          className={`text-xs leading-relaxed ${
                            isSelected ? "text-blue-600" : "text-gray-600"
                          }`}
                        >
                          {place.description}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* 에러 메시지 표시 */}
        {showErrors && errors.selectedPlaces && (
          <div className="mt-4 bg-red-50 border border-red-200 rounded-lg p-3">
            <div className="flex items-center space-x-2">
              {/* 경고 아이콘 */}
              <div className="w-5 h-5 text-red-600">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16c-.77.833.192 2.5 1.732 2.5z"
                  />
                </svg>
              </div>
              <span className="text-red-800 text-sm">
                {errors.selectedPlaces}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* 오른쪽: 지도 및 선택된 여행지 목록 */}
      <div className="w-1/2 flex flex-col">
        {/* 지도 */}
        <div className="flex-1 mb-4">
          <div
            ref={mapRef}
            className="w-full h-full rounded-lg border border-gray-300 shadow-sm"
            style={{ minHeight: "300px" }}
          />
        </div>

        {/* 선택된 여행지 목록 */}
        {selectedPlaces.length > 0 && (
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="text-sm font-medium text-gray-700 mb-3">
              선택된 여행지 ({selectedPlaces.length}/5)
            </h4>
            <div className="space-y-2 max-h-32 overflow-y-auto">
              {selectedPlaces.map((place, index) => (
                <div
                  key={place.id}
                  className="flex items-center justify-between bg-white p-2 rounded border"
                >
                  <div className="flex items-center space-x-2 flex-1 min-w-0">
                    {/* 순서 번호 */}
                    <span className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">
                      {index + 1}
                    </span>
                    {/* 여행지 이름 */}
                    <span className="text-sm truncate">{place.name}</span>
                  </div>

                  {/* 순서 변경 및 제거 버튼 */}
                  <div className="flex items-center space-x-1">
                    {/* 위로 이동 */}
                    <button
                      onClick={() => handleMoveUp(index)}
                      disabled={index === 0}
                      className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-30"
                    >
                      <svg
                        className="w-3 h-3"
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

                    {/* 아래로 이동 */}
                    <button
                      onClick={() => handleMoveDown(index)}
                      disabled={index === selectedPlaces.length - 1}
                      className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-30"
                    >
                      <svg
                        className="w-3 h-3"
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

                    {/* 제거 */}
                    <button
                      onClick={() => handleRemovePlace(place.id)}
                      className="p-1 text-red-400 hover:text-red-600"
                    >
                      <svg
                        className="w-3 h-3"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
export default PlannerStep3;
