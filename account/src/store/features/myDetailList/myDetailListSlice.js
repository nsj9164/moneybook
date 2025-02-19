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
  async (listTypes = ["fixedItemList", "cardList", "categoryList"]) => {
    console.log("📢 fetchLists 실행됨! 요청 목록:", listTypes);

    const fetchMap = {
      fixedItemList: () => fetch("/fixedItemList").then((res) => res.json()),
      cardList: () => fetch("/cardList").then((res) => res.json()),
      categoryList: () =>
        fetch("/categoryList").then(async (res) => {
          const json = await res.json();
          return json;
        }),
    };

    const fetchPromises = listTypes.map((type) => fetchMap[type]());
    const results = await Promise.all(fetchPromises);

    console.log("📢 fetchLists 결과:", results);

    // 배열에서 꺼낸 데이터를 key로 매핑
    return listTypes.reduce((acc, type, index) => {
      acc[type] = results[index];
      return acc;
    }, {});
  }
);

const myDetailList = createSlice({
  name: "myDetailList",
  initialState: {
    fixedItemList: {
      items: [],
      idField: "expense_id",
      status: "idle",
      saveStatus: "idle",
      deleteStatus: "idle",
      error: null,
    },
    categoryList: {
      items: [],
      idField: "cat_id",
      status: "idle",
      saveStatus: "idle",
      error: null,
    },
    cardList: {
      items: [],
      idField: "card_id",
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
          console.log(
            "#####################################",
            key,
            state[key].items
          );
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
