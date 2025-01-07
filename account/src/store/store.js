import { configureStore } from "@reduxjs/toolkit";
import payListReducer from "./store/paySlice";

const store = configureStore ({
    reducer: {
        payList: payListReducer
    }
});

export default store;