import React, { useState, useContext, useEffect } from "react";
import axios from "axios";
import { AuthContext } from "../../../components/Context/AuthContext";
import { FaRegBookmark, FaBookmark } from "react-icons/fa";

const BookMark = ({ travelNo }) => {
  const { auth } = useContext(AuthContext);
  const apiUrl = window.ENV?.API_URL || "http://localhost:8000";
  const memberNo = auth?.loginInfo?.memberNo;
  const accessToken = auth?.tokens?.accessToken;
  const isDisabled = !auth?.isAuthenticated || !memberNo;

  const [bookmarked, setBookmarked] = useState(false);

  useEffect(() => {
    if (isDisabled || !travelNo) return;

    axios
      .get(`${apiUrl}/api/bookMark/check-book`, {
        params: {
          travelNo: travelNo,
          memberNo: memberNo,
        },
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
      .then((response) => {
        const check = response.data.data;
        setBookmarked(check === 1);
      })
      .catch((err) => {
        console.error("북마크 여부 확인 실패", err);
      });
  }, [travelNo, memberNo]);

  const handleBookmark = () => {
    if (isDisabled) {
      alert("로그인이 필요합니다.");
      return;
    }

    axios
      .post(
        `${apiUrl}/api/bookMark/bookmark`,
        { travelNo: travelNo, memberNo: memberNo },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      )
      .then((response) => {
        console.log(response);
        setBookmarked((prev) => !prev);
        alert(
          bookmarked
            ? "즐겨찾기에서 제거되었습니다."
            : "즐겨찾기에 추가되었습니다."
        );
      })
      .catch((error) => {
        console.error(error);
        alert("즐겨찾기 처리에 실패했습니다.");
      });
  };

  return (
    <button
      onClick={handleBookmark}
      disabled={isDisabled}
      className="text-2xl hover:scale-110 transition"
      title={bookmarked ? "즐겨찾기 취소" : "즐겨찾기 추가"}
    >
      {bookmarked ? (
        <FaBookmark className="text-red-500" />
      ) : (
        <FaRegBookmark className="text-gray-300" />
      )}
    </button>
  );
};

export default BookMark;
