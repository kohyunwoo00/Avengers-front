import React from "react";
import { Routes, Route } from "react-router-dom";
import Header from "./components/Header/Header";
import Footer from "./components/Footer/Footer";
import PrivacyPolicy from "./components/Footer/PrivacyPolicy";
import EmailCollectionPolicy from "./components/Footer/EmailCollectionPolicy";
import TermsOfService from "./components/Footer/TermsOfService";
import CustomerCenter from "./components/Footer/CustomerCenter";
import StepIndicator from "./components/common/MyPlan/Step";
import SignUp from "./components/Auth/SignUp";
import Login from "./components/Auth/Login";
import TravelRegister from "./pages/Travel/TravelRegister";
import FestivalRegister from "./pages/Travel/FestivalRegister";
import TravelOptionsManagement from "./pages/Travel/TravelOptionManagement";
import TravelPage from "./pages/Travel/TravelPage";
import TravelDetailSearchPage from "./pages/Travel/TravelDetailSearch";
import FestivalPage from "./pages/Travel/FestivalPage";
import TravelDetailPage from "./pages/Travel/TravelDetail";
import TravelAdminManagement from "./pages/Travel/TravelAdminManagement";
import MyTravelPlanDetail from "./pages/MyPlan/MyTravelPlanDetail";
import FindId from "./components/Auth/FindId";
import { AuthProvider } from "./components/Context/AuthContext";
import FindIdResult from "./components/Auth/FindIdResult";
import FindPassword from "./components/Auth/FindPassword";
import NewPassword from "./components/Auth/NewPassword";
import MyPage from "./components/MyPage/MyPage";
import ChangePassword from "./components/MyPage/ChangePassword";
import DeleteMember from "./components/MyPage/DeleteMember";
import AdminPage from "./admin/AdminPage";
import MemberList from "./admin/MemberList";
import MyTravelPlanList from "./pages/MyPlan/MyTravelPlanList";

function App() {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-gray-50">
        <Header />

        <main className="max-w-[1440px] mx-auto px-6 py-8">
          <Routes>
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route
              path="/email-collection-policy"
              element={<EmailCollectionPolicy />}
            />
            <Route path="/terms-of-service" element={<TermsOfService />} />
            <Route path="/customer-service" element={<CustomerCenter />} />
            <Route path="/myplan" element={<StepIndicator />} />

            {/* 로그인 유저 */}
            <Route path="/signUp" element={<SignUp />} />
            <Route path="/login" element={<Login />} />
            <Route path="/findId" element={<FindId />} />
            <Route path="/findIdResult" element={<FindIdResult />} />
            <Route path="/findPassword" element={<FindPassword />} />
            <Route path="/newPassword" element={<NewPassword />} />
            <Route path="/myPage" element={<MyPage />} />
            <Route path="/myPage/changePassword" element={<ChangePassword />} />
            <Route path="/myPage/deleteMember" element={<DeleteMember />} />

            {/* 관리자 전용 */}
            <Route path="/adminPage" element={<AdminPage />} />
            <Route path="/adminPage/memberList" element={<MemberList />} />

            {/* 사용자 여행지 */}
            <Route path="/travels" element={<TravelPage />} />
            <Route
              path="/travels/search"
              element={<TravelDetailSearchPage />}
            />
            <Route path="/travels/detail" element={<TravelDetailPage />} />
            <Route path="/festivals" element={<FestivalPage />} />
            {/* 여행지 관련 관리자 기능 */}
            <Route path="/admin/travels" element={<TravelRegister />} />
            <Route path="/admin/festivals" element={<FestivalRegister />} />
            <Route
              path="/admin/travels/management"
              element={<TravelAdminManagement />}
            />
            <Route
              path="/admin/travels/options/management"
              element={<TravelOptionsManagement />}
            />

            {/* 나의 여행 플랜 */}
            <Route path="/myplan" element={<StepIndicator />} />
            <Route path="/myplan/list" element={<MyTravelPlanList />} />
            <Route path="/myplan/detail" element={<MyTravelPlanDetail />} />
          </Routes>
        </main>

        <Footer />
      </div>
    </AuthProvider>
  );
}

export default App;
