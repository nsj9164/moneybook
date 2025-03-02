import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { logout } from "../login/loginActions";
import { deleteData, fetchData, saveData } from "./payListActions";

export const fetchPayList = createAsyncThunk(
  "payList/fetchPayList",
  async () => {
    const response = await fetch("/payList");
    const data = await response.json();
    return { payList: data };
  }
);

const payList = createSlice({
  name: "payList",
  initialState: {
    items: [],
    status: "idle",
    error: null,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchData.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchData.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload;
      })
      .addCase(fetchData.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(saveData.fulfilled, (state, action) => {
        state.saveStatus = "succeeded";
      })
      .addCase(deleteData.fulfilled, (state, action) => {
        state.items = action.payload;
      })
      .addCase(logout.fulfilled, (state) => {
        state.items = [];
        state.status = "idle";
      });
  },
});

export default payList.reducer;
