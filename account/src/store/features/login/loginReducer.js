import { createSlice } from "@reduxjs/toolkit";
import { loginData, logout } from "./loginActions";

const login = createSlice({
  name: "login",
  initialState: {
    loginStatus: "idle",
    loginMessage: "",
    isLoggedIn: document.cookie.includes("token="),
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginData.pending, (state) => {
        state.loginStatus = "loading";
      })
      .addCase(loginData.fulfilled, (state, action) => {
        state.loginStatus = "succeeded";
        state.loginMessage = action.payload.isLogin;
        if (action.payload.isLogin === "True") {
          state.isLoggedIn = true;
        } else {
          state.isLoggedIn = false;
        }
      })
      .addCase(loginData.rejected, (state, action) => {
        state.loginStatus = "failed";
        state.loginMessage = action.payload || "서버 오류 발생";
        state.isLoggedIn = false;
      })
      .addCase(logout.pending, (state) => {
        state.loginStatus = "loading";
      })
      .addCase(logout.fulfilled, (state) => {
        state.loginStatus = "succeeded";
        state.isLoggedIn = false;
      })
      .addCase(logout.rejected, (state) => {
        state.loginStatus = "failed";
      });
  },
});

export default login.reducer;
