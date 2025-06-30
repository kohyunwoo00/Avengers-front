import React, { useState, useEffect, useRef } from "react";

const PlannerStep2 = ({
  onDataChange,
  onValidationChange,
  initialData = {},
  showErrors = false,
}) => {
  // 선택된 지역 상태
  const [selectedRegion, setSelectedRegion] = useState(
    initialData.selectedRegion || ""
  );

  const mapRef = useRef(null); // 지도 참조하는 ref
  const mapInstanceRef = useRef(null); // 맵 인스턴스 저장
  const selectedMarkerRef = useRef(null); // 선택된 마커 저장
  const markersRef = useRef([]); // 모든 마커들을 저장하는 배열

  const [errors, setErrors] = useState({
    selectedRegion: "",
  });

  // 오사카의 데이터
  const osakaRegions = [
    { id: 1, name: "미야코지마구", lat: 34.701279, lng: 135.52809 },
    { id: 2, name: "후쿠시마구", lat: 34.692337, lng: 135.472229 },
    { id: 3, name: "코노하나구", lat: 34.683049, lng: 135.452328 },
    { id: 4, name: "니시구", lat: 34.676231, lng: 135.486059 },
    { id: 5, name: "미나토구", lat: 34.663918, lng: 135.460681 },
    { id: 6, name: "다이쇼구", lat: 34.650403, lng: 135.4727 },
    { id: 7, name: "텐노지구", lat: 34.657917, lng: 135.519362 },
    { id: 8, name: "나니와구", lat: 34.659444, lng: 135.49963 },
    { id: 9, name: "니시요도가와구", lat: 34.711348, lng: 135.456202 },
    { id: 10, name: "히가시요도가와구", lat: 34.741214, lng: 135.529423 },
    { id: 11, name: "히가시나리구", lat: 34.670002, lng: 135.541268 },
    { id: 12, name: "이쿠노구", lat: 34.653751, lng: 135.534413 },
    { id: 13, name: "아사히구", lat: 34.721177, lng: 135.54422 },
    { id: 14, name: "조토구", lat: 34.70189, lng: 135.545973 },
    { id: 15, name: "아베노구", lat: 34.638969, lng: 135.518496 },
    { id: 16, name: "스미요시구", lat: 34.603673, lng: 135.500632 },
    { id: 17, name: "히가시스미요시구", lat: 34.622163, lng: 135.526601 },
    { id: 18, name: "니시나리구", lat: 34.634872, lng: 135.494373 },
    { id: 19, name: "요도가와구", lat: 34.721026, lng: 135.486711 },
    { id: 20, name: "츠루미구", lat: 34.704329, lng: 135.574198 },
    { id: 21, name: "스미노에구", lat: 34.609675, lng: 135.482742 },
    { id: 22, name: "히라노구", lat: 34.621199, lng: 135.546072 },
    { id: 23, name: "키타구", lat: 34.705362, lng: 135.510025 },
    { id: 24, name: "주오구", lat: 34.681261, lng: 135.509801 },
  ];

  // 초기 데이터가 변경 -> 상태 업데이트
  useEffect(() => {
    setSelectedRegion(initialData.selectedRegion || "");
  }, [initialData]);

  // 구글 맵 초기화
  useEffect(() => {
    const apiKey = window.ENV.GOOGLE_MAPS_API_KEY;
    console.log("Google Maps API Key:", apiKey ? "설정완료" : "설정실패");

    const initMap = () => {
      if (window.google && window.google.maps && mapRef.current) {
        const map = new window.google.maps.Map(mapRef.current, {
          // 오사카 중심 좌표로 지도 생성
          center: { lat: 34.6937, lng: 135.5023 }, // 오사카 중심 좌표
          zoom: 12,

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

        // 각 지역에 마커 추가
        osakaRegions.forEach((region) => {
          const marker = new window.google.maps.Marker({
            position: { lat: region.lat, lng: region.lng },
            map: map,
            title: region.name,
            icon: {
              url: "http://maps.google.com/mapfiles/ms/icons/red-dot.png",
              scaledSize: new window.google.maps.Size(32, 32),
            },
          });

          // 마커 클릭 이벤트 리스너
          marker.addListener("click", () => {
            handleRegionSelect(region.name, marker);
          });

          // 마커를 배열에 저장
          markersRef.current.push({ marker, regionName: region.name });
        });

        console.log(`${osakaRegions.length}개 마커 생성 완료`);

        // 초기 데이터에 선택된 지역이 있으면 해당 마커를 선택 상태로
        if (initialData.selectedRegion) {
          const initialMarker = markersRef.current.find(
            (item) => item.regionName === initialData.selectedRegion
          );
          if (initialMarker) {
            updateMarkerStyle(initialMarker.marker, true);
            selectedMarkerRef.current = initialMarker.marker;
          }
        }
      } else {
        console.error("구글 맵 API 로드 실패 또는 mapRef가 준비되지 않음");
      }
    };

    // 구글 맵 API가 로드되어 있는지 확인
    if (window.google && window.google.maps) {
      console.log("구글 맵 API가 이미 로드되어 있음");
      initMap();
    } else {
      console.log("구글 맵 API 스크립트 로드 중...");
      const script = document.createElement("script");
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
      script.async = true;
      script.defer = true;
      script.onload = () => {
        initMap();
      };
      document.head.appendChild(script);

      return () => {
        if (document.head.contains(script)) {
          document.head.removeChild(script);
        }
      };
    }
  }, [initialData.selectedRegion]);

  // 마커 스타일 업데이트
  const updateMarkerStyle = (marker, isSelected) => {
    if (isSelected) {
      // 선택된 마커는 파란색으로 변경
      marker.setIcon({
        url: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png",
        scaledSize: new window.google.maps.Size(40, 40),
      });
    } else {
      // 선택되지 않은 마커는 빨간색으로
      marker.setIcon({
        url: "http://maps.google.com/mapfiles/ms/icons/red-dot.png",
        scaledSize: new window.google.maps.Size(32, 32),
      });
    }
  };

  // 지역 선택 처리
  const handleRegionSelect = (regionName, marker) => {
    if (selectedMarkerRef.current) {
      updateMarkerStyle(selectedMarkerRef.current, false);
    }

    updateMarkerStyle(marker, true);
    selectedMarkerRef.current = marker;

    // 선택된 지역 상태 업데이트
    setSelectedRegion(regionName);

    // 부모 컴포넌트에 데이터 변경 알림
    updateData(regionName);

    // 선택된 지역으로 지도 중심 이동
    if (mapInstanceRef.current) {
      const selectedRegionData = osakaRegions.find(
        (region) => region.name === regionName
      );
      if (selectedRegionData) {
        mapInstanceRef.current.panTo({
          lat: selectedRegionData.lat,
          lng: selectedRegionData.lng,
        });
        mapInstanceRef.current.setZoom(14);
      }
    }
  };

  // 유효성 검사 함수
  const validateData = (selectedRegionName) => {
    const newErrors = {
      selectedRegion: "",
    };

    let isValid = true;

    // 선택된 지역이 없는 경우
    if (!selectedRegionName) {
      newErrors.selectedRegion = "방문할 지역을 선택해주세요.";
      isValid = false;
    }

    setErrors(newErrors);

    return { isValid, errors: newErrors };
  };

  // 데이터 업데이트와 부모 컴포넌트에 알림
  const updateData = (selectedRegionName) => {
    const validationResult = validateData(selectedRegionName);

    onDataChange({
      selectedRegion: selectedRegionName,
    });

    onValidationChange(validationResult.isValid);
  };

  return (
    /* 메인 컨테이너 */
    <div className="max-h-[600px] overflow-y-auto space-y-4">
      {/* 지도 컨테이너 - 높이를 더 크게 설정 */}
      <div className="relative">
        <div
          ref={mapRef}
          className="w-full h-96 rounded-lg border border-gray-300 shadow-sm"
          style={{ minHeight: "384px" }}
        />

        {/* 지도 로딩 중 표시 */}
        {!mapInstanceRef.current && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100 rounded-lg">
            <div className="text-gray-500">지도를 불러오는 중...</div>
          </div>
        )}
      </div>

      {/* 선택된 지역 표시 */}
      {selectedRegion && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <div className="flex items-center space-x-2">
            {/* 체크 아이콘 */}
            <div className="w-5 h-5 text-blue-600">
              <svg
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <span className="text-blue-800 font-medium text-sm">
              선택된 지역: {selectedRegion}
            </span>
          </div>
        </div>
      )}

      {/* 지역 리스트  */}
      <div className="bg-gray-50 rounded-lg p-3">
        <h3 className="text-sm font-medium text-gray-700 mb-2">
          오사카시 24개 구(區) 목록
        </h3>
        <div className="grid grid-cols-4 gap-1 text-xs">
          {osakaRegions.map((region) => (
            <div
              key={region.id}
              className={`p-1.5 rounded cursor-pointer transition-colors duration-200 text-center ${
                selectedRegion === region.name
                  ? "bg-blue-100 text-blue-800 font-medium"
                  : "bg-white text-gray-600 hover:bg-gray-100"
              }`}
              onClick={() => {
                // 리스트에서도 지역 선택 가능
                const markerData = markersRef.current.find(
                  (item) => item.regionName === region.name
                );
                if (markerData) {
                  handleRegionSelect(region.name, markerData.marker);
                }
              }}
            >
              {region.name}
            </div>
          ))}
        </div>
      </div>

      {/* 에러 메시지 표시 */}
      {showErrors && errors.selectedRegion && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3">
          <div className="flex items-center space-x-2">
            {/* 경고 아이콘 */}
            <div className="w-5 h-5 text-red-600">
              <svg
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16c-.77.833.192 2.5 1.732 2.5z"
                />
              </svg>
            </div>
            <span className="text-red-800 text-sm">
              {errors.selectedRegion}
            </span>
          </div>
        </div>
      )}

      {/* 사용 안내 */}
      <div className="text-xs text-gray-500 text-center pb-2">
        지도의 마커를 클릭하거나 아래 지역 목록에서 선택해주세요.
      </div>
    </div>
  );
};

export default PlannerStep2;
