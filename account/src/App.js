import { useDispatch } from "react-redux";
import { Route, Routes, useLocation } from "react-router-dom";
import "./App.css";
import { Login } from "./routes/Login";
import PayList from "./routes/PayList/PayList";
import { logout } from "./store/loginSlice";

function App() {
  const dispatch = useDispatch();
  const location = useLocation();

  // const handleLogout = async() => {
  //   await dispatch(logout());
  //   document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
  //   window.location.reload();
  // }

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
