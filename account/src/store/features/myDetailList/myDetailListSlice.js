import { createSlice } from "@reduxjs/toolkit";
import {
  fixedItemListActions,
  categoryListActions,
  cardListActions,
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
  },
  extraReducers: (builder) => {
    createAsyncReducers(builder, fixedItemListActions, "fixedItemList");
    createAsyncReducers(builder, categoryListActions, "categoryList");
    createAsyncReducers(builder, cardListActions, "cardList");
  },
});

export default myDetailList.reducer;
