import { configureStore } from "@reduxjs/toolkit";
import payListReducer from "./paySlice";
import loginReducer from "./loginSlice";
import myDetailListReducer from "./myDetailSlice";


const store = configureStore ({
    reducer: {
        payList: payListReducer,
        login: loginReducer,
        myDetailList: myDetailListReducer
    }
});

export default store;