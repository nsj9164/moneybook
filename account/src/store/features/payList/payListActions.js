import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// 비동기 thunk : MySQL에서 데이터 가져오기
export const fetchData = createAsyncThunk("payList/fetchData", async (data) => {
  const response = await axios.post("http://localhost:8009/payList", data, {
    withCredentials: true,
  });
  return response.data;
});

// 비동기 thunk : MySQL에서 데이터 저장하기
export const saveData = createAsyncThunk("payList/saveData", async (data) => {
  const response = await axios.post(
    "http://localhost:8009/payList/insert",
    data
  );
  return response.data;
});

// 비동기 thunk : MySQL에서 데이터 삭제하기
export const deleteData = createAsyncThunk(
  "payList/deleteData",
  async (data) => {
    const response = await axios.post(
      "http://localhost:8009/payList/delete",
      data
    );
    return response.data;
  }
);
