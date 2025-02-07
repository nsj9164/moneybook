import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const createAsyncActions = (endpoint) => {
  return {
    // data = {} : data를 전달하지 않으면, 빈 객체 {}
    // withCredentials : 쿠키나 인증 정보를 포함시키기 위한 옵션
    fetchData: createAsyncThunk(`${endpoint}/fetchData`, async (data = {}) => {
      const response = await axios.get(`http://localhost:8009/${endpoint}`, {
        withCredentials: true,
      });
      return response.data;
    }),
    saveData: createAsyncThunk(`${endpoint}/saveData`, async (data) => {
      const response = await axios.post(
        `http://localhost:8009/${endpoint}/insert`,
        data
      );
      return response.data;
    }),
    deleteData: createAsyncThunk(`${endpoint}/deleteData`, async (data) => {
      const response = await axios.post(
        `http://localhost:8009/${endpoint}/delete`,
        data
      );
      return response.data;
    }),
  };
};

export const fixedItemListActions = createAsyncActions("fixedItemList");
export const categoryListActions = createAsyncActions("categoryList");
export const cardListActions = createAsyncActions("cardList");
export const cardCompanyListActions = createAsyncActions("cardCompanyList");
