import "./../styles/App.css";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { loginData } from "../store/features/login/loginActions";
import { useAuth } from "../hooks/auth/useAuth";

export const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [userId, setUserId] = useState("");
  const [userPw, setUserPw] = useState("");

  const loginStatus = useSelector((state) => state.login.loginStatus);
  const loginMessage = useSelector((state) => state.login.loginMessage);
  const isLoggedIn = useAuth();

  // 로그인
  const handleLogin = () => {
    if (userId === "") {
      alert("아이디 안썼는디?");
      return false;
    }

    if (userPw === "") {
      alert("비밀번호 안썼는디?");
      return false;
    }

    dispatch(loginData({ userId, userPw }));
  };

  // loginData result에 따른 처리
  // 회원정보 O -> /dashboard(main화면)으로 이동
  // 회원정보 X -> loginMessage 출력
  const getCookie = (name) => {
    const cookieValue = document.cookie
      .split("; ")
      .find((row) => row.startsWith(`${name}=`))
      ?.split("=")[1];

    return cookieValue || null;
  };

  useEffect(() => {
    if (isLoggedIn) {
      const token = getCookie("token");

      if (token) {
        console.log("토큰이 발견되었습니다:", token);
        navigate("/dashboard");
      } else {
        console.error("토큰이 쿠키에 설정되지 않았습니다.");
      }
    }
  }, [isLoggedIn, navigate]);

  return (
    <div className="login_contents">
      <div className="login_box">
        <h2 className="loginTit">로그인</h2>
        <div className="input_item id">
          <input
            type="text"
            id="user_id"
            className="input_id"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
          />
          <label htmlFor="user_id" className="text_label">
            아이디
          </label>
        </div>
        <div className="input_item pw">
          <input
            type="password"
            id="user_pw"
            className="input_pw"
            value={userPw}
            onChange={(e) => setUserPw(e.target.value)}
          />
          <label htmlFor="user_pw" className="text_label">
            비밀번호
          </label>
        </div>
        <button className="loginBtn" onClick={handleLogin}>
          {loginStatus === "loading" ? "로그인 중..." : "로그인"}
        </button>
        <div className="save">
          <label className="saveId">
            <input type="checkbox" /> 아이디 저장
          </label>
        </div>
        <div className="link">
          <span className="find_login_info">아이디 찾기</span>
          <span className="gap">|</span>
          <span className="find_login_info">비밀번호 찾기</span>
        </div>

        <div className="register_box">
          <span>계정이 없으신가요?</span>
          <span className="registerBtn">회원가입</span>
        </div>
        {loginMessage && (
          <p style={{ color: loginStatus === "failed" ? "red" : "green" }}>
            {loginMessage}
          </p>
        )}
      </div>
    </div>
  );
};
