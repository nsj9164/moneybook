import {
  configureStore,
  createAsyncThunk,
  createSlice,
} from "@reduxjs/toolkit";
import axios from "axios";

export const createAsyncActions = (endpoint) => {
  return {
    fetchData: createAsyncThunk(`${endpoint}/fetchData`, async () => {
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
    }),
  };
};

export const fixedItemListActions = createAsyncActions("fixedItemList");
export const cardListActions = createAsyncActions("cardList");
export const categoryListActions = createAsyncActions("categoryList");

// export const fetchData = createAsyncThunk(`${endpoint}/fetchData`, async () => {
//     const response = await axios.get(`http://localhost:8009/${endpoint}`, data, { withCredentials: true });
//     return response.data;
// });

// export const saveData = createAsyncThunk(`${endpoint}/saveData`, async (data) => {
//     const response = await axios.post(`http://localhost:8009/${endpoint}/insert`, data);
//     return response.data;
// })

// export const deleteData = createAsyncThunk(`${endpoint}/deleteData`, async (data) => {
//     const response = await axios.post(`http://localhost:8009/${endpoint}/delete`, data);
// })

let myDetailList = createSlice({
  name: "myDetailList",
  initialState: {
    items: [],
    status: "idle",
    error: null,
  },
  extraReducers: (builder) => {
    const actionGroups = [
      fixedItemListActions,
      cardListActions,
      categoryListActions,
    ];

    actionGroups.forEach((actions) => {
      builder
        .addCase(actions.fetchData.pending, (state) => {
          state.status = "loading";
        })
        .addCase(actions.fetchData.fulfilled, (state, action) => {
          state.status = "succeeded";
          state.items = action.payload;
        })
        .addCase(actions.fetchData.rejected, (state, action) => {
          state.status = "failed";
          state.error = action.error.message;
        })
        .addCase(actions.saveData.fulfilled, (state, action) => {
          state.items = action.payload;
        })
        .addCase(actions.saveData.rejected, (state, action) => {
          state.status = "failed";
          state.error = action.error.message;
          console.error("Save Data Error: ", action.error);
        })
        .addCase(actions.deleteData.fulfilled, (state, action) => {
          state.items = action.payload;
        });
    });
  },
});

export default myDetailList.reducer;
