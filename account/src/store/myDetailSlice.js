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
        data,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }),
  };
};

export const fixedItemListActions = createAsyncActions("fixedItemList");
export const cardListActions = createAsyncActions("cardList");
export const categoryListActions = createAsyncActions("categoryList");

const createAsyncReducers = (builder, actions, stateKey) => {
  builder
    .addCase(actions.fetchData.pending, (state) => {
      state[stateKey].status = "loading";
    })
    .addCase(actions.fetchData.fulfilled, (state, action) => {
      state[stateKey].status = "succeeded";
      state[stateKey].items = action.payload;
    })
    .addCase(actions.fetchData.rejected, (state, action) => {
      state[stateKey].status = "failed";
      state[stateKey].error = action.error.message;
    })
    .addCase(actions.saveData.fulfilled, (state, action) => {
      state[stateKey].saveStatus = "succeeded";
      state[stateKey].items = action.payload;
    })
    .addCase(actions.saveData.rejected, (state, action) => {
      state[stateKey].saveStatus = "failed";
      state[stateKey].error = action.error.message;
      console.error("Save Data Error: ", action.error);
    })
    .addCase(actions.deleteData.fulfilled, (state, action) => {
      state[stateKey].items = action.payload;
    });
};

let myDetailList = createSlice({
  name: "myDetailList",
  initialState: {
    fixedItemList: {
      items: [],
      status: "idle",
      saveStatus: "idle",
      error: null,
    },
    cardList: {
      items: [],
      status: "idle",
      saveStatus: "idle",
      error: null,
    },
    categoryList: {
      items: [],
      status: "idle",
      saveStatus: "idle",
      error: null,
    },
  },
  extraReducers: (builder) => {
    createAsyncReducers(builder, fixedItemListActions, "fixedItemList");
    createAsyncReducers(builder, cardListActions, "cardList");
    createAsyncReducers(builder, categoryListActions, "categoryList");
  },
});

export default myDetailList.reducer;
