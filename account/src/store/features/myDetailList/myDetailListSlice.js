import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  fixedItemListActions,
  categoryListActions,
  cardListActions,
  cardCompanyListActions,
} from "./myDetailListActions";
import { createAsyncReducers } from "./myDetailListReducer";

export const fetchLists = createAsyncThunk(
  "myDetailList/fetchLists",
  async () => {
    const [fixedItems, cards, categories] = await Promise.all([
      fetch("/fixedItemList").then((res) => res.json()),
      fetch("/cardList").then((res) => res.json()),
      fetch("/categoryList").then((res) => res.json()),
    ]);
    return {
      cardList: cards,
      categoryList: categories,
      fixedItemList: fixedItems,
    };
  }
);

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
    builder
      .addCase(fetchLists.pending, (state) => {
        Object.keys(state).forEach((key) => {
          state[key].status = "loading";
        });
      })
      .addCase(fetchLists.fulfilled, (state, action) => {
        Object.keys(action.payload).forEach((key) => {
          state[key].status = "succeeded";
          state[key].items = action.payload[key];
        });
      })
      .addCase(fetchLists.rejected, (state, action) => {
        Object.keys(state).forEach((key) => {
          state[key].status = "failed";
          state[key].error = action.error.message;
        });
      });

    createAsyncReducers(builder, fixedItemListActions, "fixedItemList");
    createAsyncReducers(builder, categoryListActions, "categoryList");
    createAsyncReducers(builder, cardListActions, "cardList");
    createAsyncReducers(builder, cardCompanyListActions, "cardCompanyList");
  },
});

export const { updateItem } = myDetailList.actions;
export default myDetailList.reducer;
