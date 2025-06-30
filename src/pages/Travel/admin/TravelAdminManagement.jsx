import { useState } from "react";
import {
  Settings,
  Search,
  Edit,
  Power,
  PowerOff,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

function TravelAdminManagement() {
  const [activeTab, setActiveTab] = useState("여행지");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 7;

  const [travelData, setTravelData] = useState([
    {
      no: 1,
      name: "오사카 성",
      registrationDate: "2023.07.24",
      modificationDate: "2023.07.25",
      status: "등록완료",
      isActive: true,
    },
    {
      no: 2,
      name: "도쿄타워",
      registrationDate: "2023.07.20",
      modificationDate: "2023.08.26",
      status: "비활성",
      isActive: false,
    },
    {
      no: 3,
      name: "후시미 이나리 대사 신사",
      registrationDate: "2023.04.08",
      modificationDate: "2023.04.08",
      status: "등록완료",
      isActive: true,
    },
    {
      no: 4,
      name: "우에노 공원의 벚꽃 축제와 박물관",
      registrationDate: "2023.04.08",
      modificationDate: "2023.04.08",
      status: "등록완료",
      isActive: true,
    },
    {
      no: 5,
      name: "도쿄역과 마루노우치",
      registrationDate: "2023.04.08",
      modificationDate: "2023.04.08",
      status: "등록완료",
      isActive: true,
    },
    {
      no: 6,
      name: "긴자거리",
      registrationDate: "2023.04.08",
      modificationDate: "2023.04.08",
      status: "등록완료",
      isActive: true,
    },
    {
      no: 7,
      name: "민스 타워",
      registrationDate: "2023.04.08",
      modificationDate: "2023.04.08",
      status: "등록완료",
      isActive: true,
    },
    {
      no: 8,
      name: "우에노 시장",
      registrationDate: "2023.04.08",
      modificationDate: "2023.04.08",
      status: "등록완료",
      isActive: true,
    },
    {
      no: 9,
      name: "미에노 명품거리",
      registrationDate: "2023.04.08",
      modificationDate: "2023.04.08",
      status: "등록완료",
      isActive: true,
    },
    {
      no: 10,
      name: "오사카 해변가",
      registrationDate: "2023.04.08",
      modificationDate: "2023.04.08",
      status: "등록완료",
      isActive: true,
    },
  ]);

  const tabs = ["축제", "여행지", "나의 등록 게시글"];

  const handleStatusToggle = (no) => {
    setTravelData((prevData) =>
      prevData.map((item) =>
        item.no === no
          ? {
              ...item,
              isActive: !item.isActive,
              status: !item.isActive ? "등록완료" : "비활성",
            }
          : item
      )
    );
  };

  const handleEdit = (no) => {
    console.log(`수정: ${no}`);
  };

  const handleSearch = () => {
    console.log("검색:", { startDate, endDate });
  };

  const getStatusColor = (status) => {
    return status === "등록완료"
      ? "bg-green-100 text-green-800"
      : "bg-red-100 text-red-800";
  };

  const getStatusText = (status) => {
    return status === "등록완료" ? "등록완료" : "비활성";
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* 페이지 제목 */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <Settings className="h-6 w-6" />
            관리자 여행지 관리
          </h1>
        </div>

        {/* 탭 메뉴 */}
        <div className="bg-white rounded-lg shadow-sm border mb-6">
          <div className="border-b bg-gray-50 rounded-t-lg">
            <div className="flex">
              {tabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-6 py-3 font-medium text-sm border-b-2 transition-colors ${
                    activeTab === tab
                      ? "border-blue-500 text-blue-600 bg-white"
                      : "border-transparent text-gray-500 hover:text-gray-700"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          {/* 검색 필터 영역 */}
          <div className="p-6 bg-gray-50">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              {/* 등록 기간 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  등록 기간
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <span className="text-gray-500">~</span>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* 상태 필터 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  상태
                </label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="">전체</option>
                  <option value="active">등록완료</option>
                  <option value="inactive">비활성</option>
                </select>
              </div>

              {/* 여행지명 검색 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  여행지명 검색
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="여행지명을 입력하세요"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    onClick={handleSearch}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                  >
                    <Search className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* 테이블 */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-blue-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    No
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    여행지명
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    등록일
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    수정일
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    관리
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    상태
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {travelData.map((item) => (
                  <tr key={item.no} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {item.no}
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900 max-w-xs truncate">
                      {item.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {item.registrationDate}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {item.modificationDate}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(item.no)}
                          className="flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition-colors text-xs"
                        >
                          <Edit className="h-3 w-3" />
                          수정하기
                        </button>
                        <button
                          onClick={() => handleStatusToggle(item.no)}
                          className={`flex items-center gap-1 px-3 py-1 rounded-md transition-colors text-xs ${
                            item.isActive
                              ? "bg-red-100 text-red-700 hover:bg-red-200"
                              : "bg-green-100 text-green-700 hover:bg-green-200"
                          }`}
                        >
                          {item.isActive ? (
                            <>
                              <PowerOff className="h-3 w-3" />
                              비활성화
                            </>
                          ) : (
                            <>
                              <Power className="h-3 w-3" />
                              활성화
                            </>
                          )}
                        </button>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                          item.status
                        )}`}
                      >
                        {getStatusText(item.status)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* 페이지네이션 */}
          <div className="px-6 py-4 bg-gray-50 border-t">
            <div className="flex items-center justify-center gap-2">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="p-2 rounded-full hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>

              {[...Array(totalPages)].map((_, index) => {
                const pageNum = index + 1;
                return (
                  <button
                    key={pageNum}
                    onClick={() => setCurrentPage(pageNum)}
                    className={`w-8 h-8 rounded-full text-sm font-medium transition-colors ${
                      currentPage === pageNum
                        ? "bg-blue-500 text-white"
                        : "text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}

              <button
                onClick={() =>
                  setCurrentPage(Math.min(totalPages, currentPage + 1))
                }
                disabled={currentPage === totalPages}
                className="p-2 rounded-full hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TravelAdminManagement;
