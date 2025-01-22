import { createSlice } from "@reduxjs/toolkit";
import {
  fixedItemListActions,
  categoryListActions,
  cardListActions,
} from "./myDetailListActions";
import { createAsyncReducers } from "./reducers/asyncReducers";

let myDetailList = createSlice({
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
    createAsyncReducers(builder, cardListActions, "cardList");
    createAsyncReducers(builder, categoryListActions, "categoryList");
  },
});

export default myDetailList.reducer;
