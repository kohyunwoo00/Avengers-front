import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { AuthContext } from "../components/Context/AuthContext";
import Pagination from "../components/common/Page/Pagination";

const ReviewReportList = () => {
  const [reportList, setReportList] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const pageSize = 5; // 페이지당 항목 수
  const apiUrl = window.ENV?.API_URL || "http://localhost:8000";
  const { auth } = useContext(AuthContext);

  useEffect(() => {
    if (!auth) return;

    axios
      .get(`${apiUrl}/api/admin/reportList`, {
        params: {
          page: currentPage,
        },
        headers: {
          Authorization: `Bearer ${auth.tokens.accessToken}`,
        },
      })
      .then((response) => {
        const data = response.data.data;
        setReportList(data.list || []);

        // ✅ totalCount 기반으로 페이지 수 계산
        const calculatedTotalPages = Math.ceil(
          (data.totalCount || 0) / pageSize
        );
        setTotalPages(calculatedTotalPages);
      })
      .catch((error) => {
        console.error("신고 리스트 가져오기 실패:", error);
      });
  }, [auth, currentPage]);

  return (
    <div className="px-10 py-6">
      <h2 className="text-2xl font-semibold mb-5">리뷰 신고 조회</h2>

      <table className="w-full text-sm text-center border-t border-b">
        <thead className="bg-[#f8f8f8] text-sm font-medium text-gray-700 border-y">
          <tr>
            <th className="py-3">No</th>
            <th className="py-3">리뷰 제목</th>
            <th className="py-3">작성자</th>
            <th className="py-3">신고 사유</th>
            <th className="py-3">신고일자</th>
            <th className="py-3">처리 상태</th>
          </tr>
        </thead>
        <tbody>
          {reportList.map((item, index) => (
            <tr
              key={item.reportNo}
              className="border-t hover:bg-gray-50 transition-colors"
            >
              <td className="py-3">
                {(currentPage - 1) * pageSize + index + 1}
              </td>
              <td className="py-3 w-64 truncate" style={{ maxWidth: "350px" }}>
                {item.reviewContent}
              </td>
              <td className="py-3">{item.memberName}</td>
              <td className="py-3">{item.reportReason || "-"}</td>
              <td className="py-3">{item.createDate}</td>
              <td
                className={`py-3 font-semibold ${
                  item.status === "대기중"
                    ? "text-red-500"
                    : item.status === "반려"
                    ? "text-orange-500"
                    : "text-gray-400"
                }`}
              >
                {item.status}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
        className="mt-6"
      />
    </div>
  );
};

export default ReviewReportList;
