import React, { useState, useEffect, useContext, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import StepButton from "./StepButton";
import StepIndicator from "./StepIndIcator";
import PlannerStep1 from "../../../pages/MyPlan/PlannerStep1";
import PlannerStep2 from "../../../pages/MyPlan/PlannerStep2";
import PlannerStep3 from "../../../pages/MyPlan/PlannerStep3";
import PlannerStep4 from "../../../pages/MyPlan/PlannerStep4";
import { AuthContext } from "../../Context/AuthContext";
import axios from "axios";

const API_BASE_URL = window.ENV?.API_URL + "/api";

const Step = () => {
  const navigate = useNavigate();
  const { auth, logout } = useContext(AuthContext);

  // "나의 플랜 세우기" 페이지의 고유 식별자
  const PAGE_KEY = "myPlanPage";

  const [planNo, setPlanNo] = useState(() => {
    const savedPlanNo = sessionStorage.getItem(`${PAGE_KEY}_planNo`);
    return savedPlanNo ? JSON.parse(savedPlanNo) : null;
  });

  // 몇번째 스텝인지 sessionStorage에서 불러오기(없으면 기본값 1로~)
  const [currentStep, setCurrentStep] = useState(() => {
    const savedStep = sessionStorage.getItem(`${PAGE_KEY}_currentStep`);
    return savedStep ? parseInt(savedStep, 10) : 1;
  });

  // 저장된 step1의 데이터 상태 불러오기(없으면 기본값으로)
  const [step1Data, setStep1Data] = useState(() => {
    const savedData = sessionStorage.getItem(`${PAGE_KEY}_step1Data`);
    return savedData
      ? JSON.parse(savedData)
      : { startDate: "", endDate: "", travelers: "" };
  });

  // step2 데이터의 상태 불러오기
  const [step2Data, setStep2Data] = useState(() => {
    const savedData = sessionStorage.getItem(`${PAGE_KEY}_step2Data`);
    return savedData ? JSON.parse(savedData) : { selectedRegion: "" };
  });

  // step3의 데이터 상태 불러오기
  const [step3Data, setStep3Data] = useState(() => {
    const savedData = sessionStorage.getItem(`${PAGE_KEY}_step3Data`);
    return savedData ? JSON.parse(savedData) : { selectedPlaces: [] };
  });

  // step4 데이터의 상태 불러오기
  const [step4Data, setStep4Data] = useState(() => {
    const savedData = sessionStorage.getItem(`${PAGE_KEY}_step4Data`);
    return savedData
      ? JSON.parse(savedData)
      : {
          planTitle: "",
          planDescription: "",
          minBudget: "",
          maxBudget: "",
          flightLink: "",
          hotelLink: "",
        };
  });

  // 각 단계별 유효성 검사 상태
  const [stepValid, setStepValid] = useState({
    1: false,
    2: false,
    3: false,
    4: false,
  });

  // 각 단계별 에러 메시지 표시 상태
  const [showErrors, setShowErrors] = useState({
    1: false,
    2: false,
    3: false,
    4: false,
  });

  // 인증 토큰 가져오기
  const getAuthToken = useCallback(() => {
    if (auth.isAuthenticated && auth.tokens) {
      return (
        auth.tokens.token ||
        auth.tokens.accessToken ||
        auth.tokens.authToken ||
        auth.tokens.jwt
      );
    }
    return null;
  }, [auth.isAuthenticated, auth.tokens]);

  // 로그인 상태 확인
  useEffect(() => {
    if (!auth.isLoading) {
      if (!auth.isAuthenticated) {
        alert("로그인이 필요한 서비스입니다.");
        navigate("/login");
      } else if (!getAuthToken()) {
        alert("인증정보가 유효하지 않습니다. 다시 로그인해주세요.");
        logout();
      }
    }
  }, [auth.isAuthenticated, auth.isLoading, navigate, getAuthToken, logout]);

  // planNo 변경 시 sessionStorage에 저장
  useEffect(() => {
    if (planNo) {
      sessionStorage.setItem(`${PAGE_KEY}_planNo`, JSON.stringify(planNo));
    } else {
      sessionStorage.removeItem(`${PAGE_KEY}_planNo`);
    }
  }, [planNo]);

  // 현재 단계 변경 => sessionStorage에 저장
  useEffect(() => {
    sessionStorage.setItem(`${PAGE_KEY}_currentStep`, currentStep.toString());
  }, [currentStep]);

  // 데이터 변경 => sessionStorage에 저장
  useEffect(() => {
    sessionStorage.setItem(`${PAGE_KEY}_step1Data`, JSON.stringify(step1Data));
  }, [step1Data]);

  // 데이터 변경 => sessionStorage에 저장
  useEffect(() => {
    sessionStorage.setItem(`${PAGE_KEY}_step2Data`, JSON.stringify(step2Data));
  }, [step2Data]);

  // 데이터 변경 => sessionStorage에 저장
  useEffect(() => {
    sessionStorage.setItem(`${PAGE_KEY}_step3Data`, JSON.stringify(step3Data));
  }, [step3Data]);

  // 데이터 변경 => sessionStorage에 저장
  useEffect(() => {
    sessionStorage.setItem(`${PAGE_KEY}_step4Data`, JSON.stringify(step4Data));
  }, [step4Data]);

  // 각 단계별 데이터 변경 처리
  const handleDataChange = (step, data) => {
    const setters = {
      1: setStep1Data,
      2: setStep2Data,
      3: setStep3Data,
      4: setStep4Data,
    };
    setters[step](data);

    // Step 2에서 지역 변경 시 Step 3 데이터 초기화
    if (step === 2) {
      setStep3Data({ selectedPlaces: [] });
      handleValidationChange(3, false);
    }

    setShowErrors((prev) => ({ ...prev, [step]: false }));
  };

  // 각 단계별 유효성 검사 상태 변경 처리
  const handleValidationChange = (step, isValid) => {
    setStepValid((prev) => ({ ...prev, [step]: isValid }));
  };

  // 다음 단계로 넘어가는 함수
  const goToNextStep = () => {
    // 인증 토큰 확인
    const token = getAuthToken();
    if (!token) {
      alert("인증 정보가 없습니다. 다시 로그인 해주세요.");
      logout();
      return;
    }

    // 현재 단계 유효성 검사
    if (!stepValid[currentStep]) {
      setShowErrors((prev) => ({ ...prev, [currentStep]: true }));
      return;
    }

    // Step 2 이상에서는 planNo 필요
    if (currentStep > 1 && !planNo) {
      alert("플랜 정보를 찾을 수 없습니다. 처음부터 다시 시작해주세요.");
      setCurrentStep(1);
      return;
    }

    const headers = {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    };

    if (currentStep === 1) {
      axios
        .post(`${API_BASE_URL}/travel-planner/step1`, step1Data, { headers })
        .then((response) => {
          console.log("Step 1 응답:", response.data);
          // 응답에서 planNo 추출하여 상태 업데이트
          const newPlanNo = response.data.data?.planNo || response.data.planNo;
          setPlanNo(newPlanNo);
          setCurrentStep(2);
        })
        .catch((err) => {
          console.error("Step 1 API 호출 실패:", err);
        });
    } else if (currentStep === 2) {
      const requestData = {
        planNo,
        selectedRegion: step2Data.selectedRegion,
      };

      axios
        .put(`${API_BASE_URL}/travel-planner/step2`, requestData, { headers })
        .then((response) => {
          console.log("Step 2 응답:", response.data);
          setCurrentStep(3);
        })
        .catch((err) => {
          console.error("Step 2 API 호출 실패:", err);
        });
    } else if (currentStep === 3) {
      if (!step3Data.selectedPlaces || step3Data.selectedPlaces.length === 0) {
        console.log("선택된 장소가 없습니다.");
        setShowErrors((prev) => ({ ...prev, [3]: true }));
        return;
      }

      // 프론트엔드 데이터를 백엔드 형식으로 변환
      const formattedPlaces = step3Data.selectedPlaces.map((place) => ({
        travelId: place.id,
        travelName: place.name,
        mapX: place.lng,
        mapY: place.lat,
        travelDescription: place.description || "",
      }));

      // Step 3 요청 데이터 구성
      const requestData = {
        planNo,
        selectedPlaces: formattedPlaces,
      };

      axios
        .put(`${API_BASE_URL}/travel-planner/step3`, requestData, { headers })
        .then((response) => {
          console.log("Step 3 응답 성공:", response.data);
          console.log("Step 3 응답 상태:", response.status);
          setCurrentStep(4);
        })
        .catch((err) => {
          console.error("Step 3 API 호출 실패:", err);
          console.error("에러 응답:", err.response);
          console.error("에러 메시지:", err.message);
          console.error("에러 상태 코드:", err.response?.status);
          console.error("에러 데이터:", err.response?.data);

          if (err.response?.status === 401) {
            alert("인증이 만료되었습니다. 다시 로그인해주세요.");
            logout();
          } else if (err.response?.status === 400) {
            alert("잘못된 요청입니다. 입력한 정보를 다시 확인해주세요.");
          } else {
            alert("서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.");
          }
        });
    }
  };

  // 이전 단계로 이동
  const goToPrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  // 모든 단계 완료 처리
  const handleComplete = () => {
    const token = getAuthToken();
    if (!token || !planNo) {
      alert("플랜 정보 또는 인증 정보가 유효하지 않습니다. 다시 시도해주세요.");
      !token && logout();
      !planNo && setCurrentStep(1);
      return;
    }

    // Step 4 유효성 검사
    if (!stepValid[4]) {
      setShowErrors((prev) => ({ ...prev, [4]: true }));
      return;
    }

    // Step 4 요청 데이터 구성
    const requestData = {
      planNo: planNo,
      planTitle: step4Data.planTitle,
      planDescription: step4Data.planDescription,
      minBudget: step4Data.minBudget ? parseInt(step4Data.minBudget, 10) : 0,
      maxBudget: step4Data.maxBudget ? parseInt(step4Data.maxBudget, 10) : 0,
      transportReservationLink: step4Data.flightLink || "",
      accommodationLink: step4Data.hotelLink || "",
    };

    console.log("Step 4 데이터 전송:", requestData);
    axios
      .put(`${API_BASE_URL}/travel-planner/step4`, requestData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        console.log("Step 4 응답:", response.data);
        alert("모든 단계가 완료되었습니다! 멋진 여행 계획이 완성되었어요.");
        // 세션 데이터 정리
        clearSessionStorageData();
        navigate("/myplan/list");
      })
      .catch((err) => {
        console.error("Step 4 API 호출 실패:", err);
      });
  };

  // 세션스토리지 및 상태 초기화
  const clearSessionStorageData = () => {
    Object.keys(sessionStorage).forEach((key) => {
      if (key.startsWith(PAGE_KEY)) {
        sessionStorage.removeItem(key);
      }
    });

    setPlanNo(null);
    setCurrentStep(1);
    setStep1Data({ startDate: "", endDate: "", travelers: "" });
    setStep2Data({ selectedRegion: "" });
    setStep3Data({ selectedPlaces: [] });
    setStep4Data({
      planTitle: "",
      planDescription: "",
      minBudget: "",
      maxBudget: "",
      flightLink: "",
      hotelLink: "",
    });
    setStepValid({ 1: false, 2: false, 3: false, 4: false });
    setShowErrors({ 1: false, 2: false, 3: false, 4: false });
  };

  if (auth.isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-lg">로딩 중...</div>
      </div>
    );
  }

  // 각 단계별 제목
  const stepTitles = {
    1: {
      title: "언제 오사카로 떠나시나요?",
      desc: "여행 날짜와 인원수를 선택해주세요.",
    },
    2: {
      title: "오사카의 어느 지역을 둘러보시겠어요?",
      desc: "관심 있는 지역을 선택해주세요.",
    },
    3: {
      title: "오사카에서 어디를 방문하시겠어요?",
      desc: "최대 5개까지 선택가능합니다.",
    },
    4: {
      title: "여행 계획을 완성해주세요.",
      desc: "플랜제목과 추가 정보를 입력해주세요.",
    },
  };

  const currentTitle = stepTitles[currentStep];

  return (
    <div className="flex justify-center items-start min-h-screen p-6 bg-gray-50">
      <div className="w-full max-w-[1294px] min-h-[834px] rounded-[20px] bg-white shadow-[0px_0px_15px_0px_rgba(0,0,0,0.10)] p-8 flex flex-col">
        {/* 메인 타이틀 영역 */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            오사카 여행 플래너
          </h1>
        </div>

        {/* 단계 표시기 영역 */}
        <div className="mb-8">
          <StepIndicator
            currentStep={currentStep}
            totalSteps={4}
            onStepClick={null}
          />
        </div>

        {/* 현재 단계 제목과 설명 영역 */}
        {currentTitle && (
          <div className="mb-4 text-center">
            <h2 className="text-xl font-bold text-gray-800 mb-1">
              {currentTitle.title}
            </h2>
            <p className="text-gray-600">{currentTitle.desc}</p>
          </div>
        )}

        {/* 메인 콘텐츠 영역 */}
        <div className="mb-8 flex-1">
          <div className="bg-white p-6 rounded-lg shadow-inner border border-gray-200 h-full">
            {/* 현재 단계에 맞는 컴포넌트 조건부 렌더링 */}
            {currentStep === 1 && (
              <PlannerStep1
                onDataChange={(data) => handleDataChange(1, data)}
                onValidationChange={(isValid) =>
                  handleValidationChange(1, isValid)
                }
                initialData={step1Data}
                showErrors={showErrors[1]}
              />
            )}
            {currentStep === 2 && (
              <PlannerStep2
                onDataChange={(data) => handleDataChange(2, data)}
                onValidationChange={(isValid) =>
                  handleValidationChange(2, isValid)
                }
                initialData={step2Data}
                showErrors={showErrors[2]}
              />
            )}
            {currentStep === 3 && (
              <PlannerStep3
                onDataChange={(data) => handleDataChange(3, data)}
                onValidationChange={(isValid) =>
                  handleValidationChange(3, isValid)
                }
                initialData={step3Data}
                selectedRegion={step2Data.selectedRegion}
                authToken={getAuthToken()} // 인증 토큰 전달
                showErrors={showErrors[3]}
              />
            )}
            {currentStep === 4 && (
              <PlannerStep4
                onDataChange={(data) => handleDataChange(4, data)}
                onValidationChange={(isValid) =>
                  handleValidationChange(4, isValid)
                }
                initialData={step4Data}
                step1Data={step1Data}
                step2Data={step2Data}
                step3Data={step3Data}
                showErrors={showErrors[4]}
              />
            )}
          </div>
        </div>

        {/* 하단 버튼 영역 */}
        <div className="flex justify-center space-x-4 pt-4 pb-2">
          {/* 이전 단계 버튼 (첫 번째 단계가 아닐 때만 표시) */}
          {currentStep > 1 && <StepButton type="prev" onClick={goToPrevStep} />}

          {/* 다음 단계 버튼 (마지막 단계가 아닐 때) */}
          {currentStep < 4 && <StepButton type="next" onClick={goToNextStep} />}

          {/* 완료 버튼 (마지막 단계일 때) */}
          {currentStep === 4 && (
            <StepButton type="next" onClick={handleComplete}>
              완료
            </StepButton>
          )}
        </div>
      </div>
    </div>
  );
};

export default Step;
