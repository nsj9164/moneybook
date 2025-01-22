import { configureStore } from "@reduxjs/toolkit";
import loginReducer from "./features/login/loginReducer";
import payListReducer from "./features/payList/payListReducer";
import myDetailListReducer from "./features/myDetailList/myDetailListSlice";

const store = configureStore({
  reducer: {
    login: loginReducer,
    payList: payListReducer,
    myDetailList: myDetailListReducer,
  },
});

export default store;
