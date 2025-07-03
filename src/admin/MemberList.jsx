import React, { useEffect, useState, useContext } from "react";
import StepButton from "../components/common/MyPlan/StepButton";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../components/Context/AuthContext";

const MemberList = () => {
  const [memberList, setMemberList] = useState([]);
  const [roles, setRoles] = useState({});

  const navigate = useNavigate();
  const apiUrl = window.ENV?.API_URL || "http://localhost:8000";
  const { auth } = useContext(AuthContext);

  useEffect(() => {
    if (!auth.tokens.accessToken) return; //새로고침 할 때 로딩하는데 토큰 불러오는 시간이 있어서 tokens.accesstoken을 붙여줘야함

    axios
      .get(`${apiUrl}/api/admin/members`, {
        params: {
          page: 1,
          status: "Y",
          role: "",
        },
        headers: {
          Authorization: `Bearer ${auth.tokens.accessToken}`,
        },
      })
      .then((response) => {
        setMemberList(response.data.data);
      })
      .catch((error) => {
        console.error("회원 조회 실패:", error);
      });
  }, [auth]);

  const handleSave = (memberNo) => {
    const selectedRole = roles[memberNo];
    axios
      .put(`${apiUrl}/api/admin/${memberNo}/role`, null, {
        params: {
          role: selectedRole,
        },
        headers: {
          Authorization: `Bearer ${auth.tokens.accessToken}`,
        },
      })
      .then((response) => {
        console.log(response);
        alert("저장되었습니다.");
        navigate("/adminPage");
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const handleCancel = () => {
    navigate("/adminPage");
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-4">회원관리</h2>

      <table className="w-full border-t border-black text-center">
        <thead>
          <tr className="border-b border-black bg-gray-100">
            <th className="py-2">No</th>
            <th>아이디</th>
            <th>이름</th>
            <th>가입일</th>
            <th>역할</th>
            <th>상태</th>
            <th>액션</th>
          </tr>
        </thead>
        <tbody>
          {memberList.map((member) => (
            <tr key={member.memberNo} className="border-b">
              <td className="py-2">{member.memberNo}</td>
              <td>{member.memberId}</td>
              <td>{member.memberName}</td>
              <td>{member.enrollDate}</td>
              <td>
                <select
                  value={roles[member.memberNo] ?? member.memberRole}
                  onChange={(e) =>
                    setRoles((prev) => ({
                      ...prev,
                      [member.memberNo]: e.target.value,
                    }))
                  }
                  className="border rounded px-2 py-1"
                  disabled={member.isActive !== "Y"}
                >
                  <option value="ROLE_USER">사용자</option>
                  <option value="ROLE_ADMIN">관리자</option>
                </select>
              </td>
              <td>
                {member.isActive === "Y" ? (
                  <span className="text-green-500 font-semibold">정상</span>
                ) : (
                  <span className="text-red-500 font-semibold">탈퇴</span>
                )}
              </td>
              <td>
                {member.isActive === "Y" && (
                  <div className="flex justify-center">
                    <StepButton onClick={() => handleSave(member.memberNo)}>
                      저장
                    </StepButton>
                  </div>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* 저장 / 취소 버튼 */}
      <div className="flex gap-4 justify-center mt-6">
        <StepButton type="prev" onClick={handleCancel}>
          취소
        </StepButton>
      </div>
    </div>
  );
};

export default MemberList;
