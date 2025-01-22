import { createSlice } from "@reduxjs/toolkit";
import { deleteData, fetchData, saveData } from "./payListActions";

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
        state.items = action.payload;
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
