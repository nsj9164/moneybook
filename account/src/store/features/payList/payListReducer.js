import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { logout } from "@/store/features/login/loginActions.js";
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
    fetchStatus: "idle",
    saveStatus: "idle",
    deleteStatus: "idle",
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
      .addCase(deleteData.pending, (state) => {
        state.deleteStatus = "loading";
      })
      .addCase(deleteData.fulfilled, (state, action) => {
        const deletedIds = action.payload.deletedIds;
        state.items = state.items.filter(
          (item) => !deletedIds.includes(item.id)
        );
      })
      .addCase(deleteData.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(logout.fulfilled, (state) => {
        state.items = [];
        state.status = "idle";
      });
  },
});

export default payList.reducer;
