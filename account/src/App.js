import { Container, Navbar } from "react-bootstrap";
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
      <Navbar expand="lg" className="navBar">
        <Container>
          <Navbar.Brand href="#home" className="logo_area">
            <div className="logo_img" />
            <span className="logo_title">My MoneyBook</span>
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav" className="log_out_nav">
            {location.pathname !== "/login" && (
              <p className="log_out" onClick={() => dispatch(logout())}>
                로그아웃
              </p>
            )}
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<PayList />} />
      </Routes>
    </div>
  );
}

export default App;
