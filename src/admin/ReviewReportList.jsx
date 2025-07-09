import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { AuthContext } from "../components/Context/AuthContext";
import Pagination from "../components/common/Page/Pagination";
import ReviewModal from "../pages/Review/ReviewModal";

const ReviewReportList = () => {
  const [reportList, setReportList] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedReview, setSelectedReview] = useState(null);
  const pageSize = 5;
  const apiUrl = window.ENV?.API_URL || "http://localhost:8000";
  const { auth } = useContext(AuthContext);

  const fetchReportList = () => {
    if (!auth || !auth.tokens?.accessToken) return;

    axios
      .get(`${apiUrl}/api/admin/reportList`, {
        params: { page: currentPage },
        headers: {
          Authorization: `Bearer ${auth.tokens.accessToken}`,
        },
      })
      .then((response) => {
        const data = response.data.data;
        setReportList(data.list || []);
        setTotalPages(Math.ceil((data.totalCount || 0) / pageSize));
      })
      .catch((error) => {
        console.error("신고 리스트 가져오기 실패:", error);
      });
  };

  useEffect(() => {
    fetchReportList();
  }, [auth, currentPage]);

  const handleStatusChange = (reportNo) => {
    axios
      .put(`${apiUrl}/api/admin/report/${reportNo}`, null, {
        headers: {
          Authorization: `Bearer ${auth.tokens.accessToken}`,
        },
      })
      .then((response) => {
        alert(response.data.message);
        fetchReportList();
      })
      .catch((error) => {
        console.error("신고 처리 실패:", error);
        alert("신고 처리 중 오류가 발생했습니다.");
      });
  };

  const openReviewModal = (reviewNo, travelNo) => {
    axios
      .get(`${apiUrl}/api/reviews/${travelNo}/${reviewNo}`, {
        headers: {
          Authorization: `Bearer ${auth.tokens.accessToken}`,
        },
      })
      .then((response) => {
        setSelectedReview(response.data.data);
      })
      .catch((error) => {
        console.log(error);
        alert("리뷰를 불러오는 데 실패했습니다.");
      });
  };

  const closeReviewModal = () => {
    setSelectedReview(null);
  };

  return (
    <div className="px-10 py-6">
      <h2 className="text-2xl font-semibold mb-5">리뷰 신고 조회</h2>

      <table className="w-full text-sm text-center border-t border-b">
        <thead className="bg-gray-100 font-medium text-gray-700 border-y">
          <tr>
            <th className="py-3">No</th>
            <th className="py-3">리뷰 내용</th>
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
              <td
                className="py-3 w-64 truncate text-blue-600 hover:underline cursor-pointer"
                style={{ maxWidth: "350px" }}
                onClick={() => openReviewModal(item.reviewNo, item.travelNo)}
              >
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
                {item.status === "대기중" && (
                  <button
                    onClick={() => handleStatusChange(item.reportNo)}
                    className="ml-2 px-2 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600"
                  >
                    확인
                  </button>
                )}
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

      {selectedReview && (
        <ReviewModal review={selectedReview} onClose={closeReviewModal} />
      )}
    </div>
  );
};

export default ReviewReportList;
