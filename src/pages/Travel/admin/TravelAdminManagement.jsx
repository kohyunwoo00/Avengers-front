import { useEffect, useState } from "react";
import {
  Settings,
  Search,
  Edit,
  Power,
  PowerOff,
  ChevronLeft,
  ChevronRight,
  Plus,
} from "lucide-react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function TravelAdminManagement() {
  // 필터 및 페이징 상태
  const [activeThema, setActiveThema] = useState("전체");
  const [periodFilter, setPeriodFilter] = useState("전체");
  const [statusFilter, setStatusFilter] = useState("");
  const [searchTerm, setSearchTerm] = useState(""); // 입력 중인 값
  const [appliedSearchTerm, setAppliedSearchTerm] = useState(""); // 실제 적용된 검색어
  const [isSearchMode, setIsSearchMode] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [showThemaModal, setShowThemaModal] = useState(false);
  const [selectedTravelId, setSelectedTravelId] = useState(null);
  const [travelData, setTravelData] = useState([]);

  // 테마 목록 상태
  const [themas, setThemas] = useState(["전체"]);
  const [totalPages, setTotalPages] = useState(1);

  // API 설정
  const API_URL = window.ENV.API_URL;
  const token = JSON.parse(localStorage.getItem("tokens"))?.accessToken;
  const headers = { Authorization: `Bearer ${token}` };

  const navigate = useNavigate();

  useEffect(() => {
    fetchThemas();
  }, []);

  useEffect(() => {
    if (!isSearchMode) {
      fetchTravelList(currentPage);
    } else {
      handleSearch(currentPage); // 현재 페이지 검색 재요청
    }
  }, [currentPage, isSearchMode]);

  // 테마 목록 조회
  const fetchThemas = () => {
    axios
      .get(`${API_URL}/api/admin/travels/thema`, { headers })
      .then((res) => {
        const list = res.data.data.map((t) => ({
          id: t.themaNo,
          name: t.themaName,
          status: t.themaStatus === "Y" ? "ACTIVE" : "INACTIVE",
          createdDate: t.themaCreatedDate,
          modifiedDate: t.themaModifiedDate,
        }));
        setThemas(["전체", ...list]);
      })
      .catch((err) => console.error("테마 목록 조회 실패:", err));
  };

  // 여행지 리스트 + 테마 병합해서 가져오는 함수
  const fetchTravelList = (page) => {
    axios
      .get(`${API_URL}/api/admin/travels/list`, {
        params: {
          page,
          size: 10,
        },
        headers,
      })
      .then((res) => {
        const { data, total } = res.data.data; // PageResponse 기준
        setTotalPages(Math.ceil(total / 10));

        return Promise.all(
          data.map((travel) =>
            axios
              .all([
                axios.get(`${API_URL}/api/admin/travels/${travel.travelNo}`, {
                  headers,
                }),
                axios.get(
                  `${API_URL}/api/admin/travels/${travel.travelNo}/themas`,
                  { headers }
                ),
              ])
              .then(([detailRes, themaRes]) => {
                const detail = detailRes.data.data;
                return {
                  no: detail.travelNo,
                  name: detail.title,
                  registrationDate: detail.createdDate
                    ?.replace("T", " ")
                    .substring(0, 16),
                  modificationDate: detail.modifiedDate
                    ?.replace("T", " ")
                    .substring(0, 16),

                  isActive: detail.status === "Y",
                  status: detail.status === "Y" ? "등록완료" : "비활성",
                  themes: themaRes.data.data.map((t) => t.themaName),
                };
              })
          )
        );
      })
      .then((merged) => {
        setTravelData(merged);
      })
      .catch((err) => console.error("여행지 목록 조회 실패", err));
  };

  const handleStatusToggle = (no, currentStatus) => {
    const newStatus = currentStatus === "Y" ? "N" : "Y";

    axios
      .delete(`${API_URL}/api/admin/travels/${no}`, {
        headers,
        data: { status: newStatus },
      })
      .then(() => {
        setTravelData((prev) =>
          prev.map((item) =>
            item.no === no
              ? {
                  ...item,
                  isActive: newStatus === "Y",
                  status: newStatus === "Y" ? "등록완료" : "비활성",
                }
              : item
          )
        );
      })
      .catch((err) => console.error("상태 변경 실패", err));
  };

  const handleEdit = (no) => {
    navigate(`/admin/travels/${no}`);
  };

  const handleSearch = (page = 1) => {
    setAppliedSearchTerm(searchTerm);
    setIsSearchMode(true);
    setCurrentPage(page);

    axios
      .get(`${API_URL}/api/admin/travels/filter/search`, {
        params: {
          page,
          size: 10,
          search: searchTerm,
          status: statusFilter,
          period: periodFilter,
          thema: activeThema !== "전체" ? activeThema : null,
        },
        headers,
      })
      .then((res) => {
        console.log(res);
        const { data, total } = res.data.data;

        const validData = data.filter(
          (travel) => travel !== null && travel.travelNo
        );

        if (validData.length === 0) {
          setTravelData([]);
          setTotalPages(1);
          return;
        }

        Promise.all(
          validData.map((travel) =>
            axios
              .all([
                axios.get(`${API_URL}/api/admin/travels/${travel.travelNo}`, {
                  headers,
                }),
                axios.get(
                  `${API_URL}/api/admin/travels/${travel.travelNo}/themas`,
                  { headers }
                ),
              ])
              .then(([detailRes, themaRes]) => {
                const detail = detailRes.data.data;
                return {
                  no: detail.travelNo,
                  name: detail.title,
                  registrationDate: detail.createdDate
                    ?.replace("T", " ")
                    .substring(0, 16),
                  modificationDate: detail.modifiedDate
                    ?.replace("T", " ")
                    .substring(0, 16),
                  isActive: detail.status === "Y",
                  status: detail.status === "Y" ? "등록완료" : "비활성",
                  themes: themaRes.data.data.map((t) => t.themaName),
                };
              })
          )
        ).then((merged) => {
          setTravelData(merged);
          setTotalPages(Math.ceil(total / 10));
        });
      })

      .catch((err) => console.error("검색 실패", err));
  };

  // 테마 추가 모달 열기
  const handleThemaRegistration = (travelId) => {
    setSelectedTravelId(travelId);
    setShowThemaModal(true);
  };

  // 여행지-테마 추가/삭제
  const handleThemaAdd = (travelId, themaName) => {
    const thema = themas.find((t) => t.name === themaName);
    if (!thema) return;

    axios
      .post(
        `${API_URL}/api/admin/travels/thema-bridge`,
        {
          travelNo: travelId,
          themaNo: thema.id,
        },
        { headers }
      )
      .then(() => {
        // UI 동기화
        setTravelData((prev) =>
          prev.map((item) =>
            item.no === travelId && !item.themes.includes(themaName)
              ? { ...item, themes: [...item.themes, themaName] }
              : item
          )
        );
        setShowThemaModal(false);
      })
      .catch((err) => console.error("테마 추가 실패", err));
    setShowThemaModal(false);
  };

  const handleThemaRemove = (travelId, themaName) => {
    const thema = themas.find((t) => t.name === themaName);
    if (!thema) return;

    axios
      .delete(`${API_URL}/api/admin/travels/thema-bridge`, {
        headers,
        data: {
          travelNo: travelId,
          themaNo: thema.id,
        },
      })
      .then(() => {
        // UI 동기화
        setTravelData((prev) =>
          prev.map((item) =>
            item.no === travelId
              ? { ...item, themes: item.themes.filter((t) => t !== themaName) }
              : item
          )
        );
        setShowThemaModal(false);
      })
      .catch((err) => console.error("테마 삭제 실패", err));
    setShowThemaModal(false);
  };

  // 스타일 헬퍼
  const getStatusColor = (status) =>
    status === "등록완료"
      ? "bg-green-100 text-green-800"
      : "bg-red-100 text-red-800";
  const getStatusText = (status) =>
    status === "등록완료" ? "등록완료" : "비활성";

  const getThemaColor = () => {
    return "bg-gray-100 text-gray-800";
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* 제목 */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <Settings className="h-6 w-6" /> 여행지 관리
          </h1>
        </div>

        {/* 필터 영역 */}
        <div className="bg-white rounded-lg shadow-sm border mb-6 p-6">
          {/* 테마별 조회 */}
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              테마별 조회
            </h2>
            <div className="flex flex-wrap gap-3">
              {themas.map((thema) => {
                const label = typeof thema === "string" ? thema : thema.name;
                return (
                  <button
                    key={typeof thema === "string" ? thema : thema.id}
                    onClick={() => setActiveThema(label)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                      activeThema === label
                        ? "bg-gradient-to-r from-[#73b3df] via-[#61a0d4] to-[#76d9e4] text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 검색 필터 */}
          <div className="border-t pt-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              검색 필터
            </h3>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              {/* 기간 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  등록 기간
                </label>
                <div className="flex flex-wrap gap-2">
                  {["전체", "오늘", "최근 7일", "최근 30일"].map((p) => (
                    <button
                      key={p}
                      onClick={() => setPeriodFilter(p)}
                      className={`px-3 py-2 text-sm rounded-md transition-colors ${
                        periodFilter === p
                          ? "bg-gradient-to-r from-[#73b3df] via-[#61a0d4] to-[#76d9e4] text-white"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>

              {/* 상태 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  상태
                </label>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">전체</option>
                  <option value="active">등록완료</option>
                  <option value="inactive">비활성</option>
                </select>
              </div>

              {/* 검색어 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  여행지명 검색
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="여행지명을 입력하세요"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    onClick={() => handleSearch()}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                  >
                    <Search className="h-4 w-4" />
                  </button>
                  {isSearchMode && (
                    <button
                      onClick={() => {
                        setIsSearchMode(false);
                        setSearchTerm("");
                        setAppliedSearchTerm("");
                        setCurrentPage(1);
                      }}
                      className="text-sm text-blue-600 underline ml-2"
                    >
                      검색 초기화
                    </button>
                  )}
                </div>
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
                  테마
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
                  <td className="px-6 py-4 text-sm font-medium text-gray-900 max-w-xs">
                    {item.name}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-1 max-w-xs">
                      {item.themes.map((t, idx) => (
                        <span
                          key={`${item.no}-${t}-${idx}`}
                          className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full ${getThemaColor(
                            t
                          )}`}
                        >
                          {t}
                          <button
                            onClick={() => handleThemaRemove(item.no, t)}
                            className="hover:bg-black hover:bg-opacity-10 rounded-full p-0.5"
                          >
                            ×
                          </button>
                        </span>
                      ))}
                      <button
                        onClick={() => handleThemaRegistration(item.no)}
                        className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium text-gray-600 border border-dashed border-gray-300 rounded-full hover:border-gray-400 hover:text-gray-700"
                      >
                        <Plus className="h-3 w-3" />
                        테마 추가
                      </button>
                    </div>
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
                        onClick={() =>
                          handleStatusToggle(item.no, item.isActive ? "Y" : "N")
                        }
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
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-700">
              총 {totalPages * 10}개의 여행지 중 {travelData.length}개 표시 중
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="p-2 rounded-full hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              {[...Array(totalPages)].map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentPage(idx + 1)}
                  className={`w-8 h-8 rounded-full text-sm font-medium transition-colors ${
                    currentPage === idx + 1
                      ? "bg-blue-500 text-white"
                      : "text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {idx + 1}
                </button>
              ))}
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

        {/* 테마 추가 모달 */}
        {showThemaModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-800">
                  테마 추가
                </h3>
                <button
                  onClick={() => setShowThemaModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ×
                </button>
              </div>
              <div className="space-y-2">
                {themas.slice(1).map((th) => (
                  <button
                    key={th.id}
                    onClick={() =>
                      !travelData
                        .find((it) => it.no === selectedTravelId)
                        .themes.includes(th.name) &&
                      handleThemaAdd(selectedTravelId, th.name)
                    }
                    disabled={travelData
                      .find((it) => it.no === selectedTravelId)
                      .themes.includes(th.name)}
                    className={`w-full text-left px-4 py-2 rounded-md transition-colors ${
                      travelData
                        .find((it) => it.no === selectedTravelId)
                        .themes.includes(th.name)
                        ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                        : "hover:bg-gray-100 text-gray-700"
                    }`}
                  >
                    {" "}
                    <div className="flex items-center justify-between">
                      <span>{th.name}</span>
                      {travelData
                        .find((it) => it.no === selectedTravelId)
                        .themes.includes(th.name) && (
                        <span className="text-xs text-gray-400">
                          이미 추가됨
                        </span>
                      )}
                    </div>
                  </button>
                ))}
              </div>
              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => setShowThemaModal(false)}
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
                >
                  닫기
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
