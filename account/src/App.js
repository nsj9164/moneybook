import { useDispatch } from "react-redux";
import { Route, Routes, useLocation } from "react-router-dom";
import "./styles/App.css";
import { Login } from "./routes/Login";
import PayList from "./routes/PayList/PayList";
import { logout } from "./store/features/login/loginActions";

function App() {
  const dispatch = useDispatch();
  const location = useLocation();

  return (
    <div className="App">
      <nav className="navBar">
        <div className="container">
          <a href="#home" className="logo_area">
            <div className="logo_img" />
            <span className="logo_title">My MoneyBook</span>
          </a>
          <div id="basic-navbar-nav" className="navbar_collapse log_out_nav">
            {location.pathname !== "/login" && (
              <p className="log_out" onClick={() => dispatch(logout())}>
                로그아웃
              </p>
            )}
          </div>
        </div>
      </nav>

      <div className="routes">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<PayList />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
