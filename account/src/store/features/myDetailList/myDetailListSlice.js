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
      deleteStatus: "idle",
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
  reducers: {
    updateItem: (state, action) => {
      const { idField, ...updatedItem } = action.payload;
      const stateKey = updatedItem.listType; // 리스트 타입을 구분하는 키

      if (state[stateKey]) {
        const index = state[stateKey].items.findIndex(
          (item) => item[idField] === updatedItem[idField]
        );
        if (index !== -1) {
          state[stateKey].items[index] = updatedItem;
        }
      }
    },
  },
  extraReducers: (builder) => {
    createAsyncReducers(builder, fixedItemListActions, "fixedItemList");
    createAsyncReducers(builder, categoryListActions, "categoryList");
    createAsyncReducers(builder, cardListActions, "cardList");
    createAsyncReducers(builder, cardCompanyListActions, "cardCompanyList");
  },
});

export const { updateItem } = myDetailList.actions;
export default myDetailList.reducer;
