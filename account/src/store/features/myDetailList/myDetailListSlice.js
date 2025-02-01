import { createSlice } from "@reduxjs/toolkit";
import {
  fixedItemListActions,
  categoryListActions,
  cardListActions,
  cardCompanyListActions,
} from "./myDetailListActions";
import { createAsyncReducers } from "./myDetailListReducer";

const myDetailList = createSlice({
  name: "myDetailList",
  initialState: {
    fixedItemList: {
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
    cardList: {
      items: [],
      status: "idle",
      saveStatus: "idle",
      error: null,
    },
    cardCompanyList: {
      items: [],
      status: "idle",
      error: null,
    },
  },
  extraReducers: (builder) => {
    createAsyncReducers(builder, fixedItemListActions, "fixedItemList");
    createAsyncReducers(builder, categoryListActions, "categoryList");
    createAsyncReducers(builder, cardListActions, "cardList");
    createAsyncReducers(builder, cardCompanyListActions, "cardCompanyList");
  },
});

export default myDetailList.reducer;
