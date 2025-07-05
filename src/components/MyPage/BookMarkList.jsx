import { useContext, useEffect, useState } from "react";
import axios from "axios";

import DestinationGrid from "../../pages/Travel/common/DestinationGrid";
import BookMark from "../../pages/Travel/common/BookMark";

import { AuthContext } from "../Context/AuthContext";

const BookMarkList = () => {
  const { auth } = useContext(AuthContext);
  const apiUrl = window.ENV?.API_URL || "http://localhost:8000";
  const memberNo = auth?.loginInfo?.memberNo;
  const [bookmarkedTravels, setBookmarkedTravels] = useState([]);

  useEffect(() => {
    if (auth?.isAuthenticated && memberNo) {
      axios
        .get(`${apiUrl}/api/mypage/bookmarks`, {
          params: {
            memberNo: memberNo,
          },
          headers: {
            Authorization: `Bearer ${auth.tokens.accessToken}`,
          },
        })
        .then((response) => {
          console.log(response);
          setBookmarkedTravels(response.data.data);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">내 즐겨찾기</h2>
      <DestinationGrid
        destinations={bookmarkedTravels}
        renderBookmark={(travelNo) => (
          <BookMark travelNo={travelNo.travelNo} isBookmarked={false} />
        )}
      />
    </div>
  );
};

export default BookMarkList;
