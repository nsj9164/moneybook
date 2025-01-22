import { createSelector } from "reselect";

const selectFixedItemList = (state) =>
  state.myDetailList["fixedItemList"].items;
const selectCategoryList = (state) => state.myDetailList["categoryList"].items;
const selectCardList = (state) => state.myDetailList["cardList"].items;

export const selectAllLists = createSelector(
  selectFixedItemList,
  selectCategoryList,
  selectCardList,
  (fixedItemList, categoryList, cardList) => ({
    fixedItemList,
    categoryList,
    cardList,
  })
);

const selectSaveStatus = (state) => state.myDetailList;

export const selectAllStatuses = createSelector(
  selectSaveStatus,
  (saveStatus) => ({
    fixedItemListStatus: saveStatus["fixedItemList"].status,
    categoryListStatus: saveStatus["categoryList"].status,
    cardListStatus: saveStatus["cardList"].status,
  })
);

export const selectAllSaveStatuses = createSelector(
  selectSaveStatus,
  (saveStatus) => ({
    fixedItemListSaveStatus: saveStatus["fixedItemList"].saveStatus,
    categoryListSaveStatus: saveStatus["categoryList"].saveStatus,
    cardListSaveStatus: saveStatus["cardList"].saveStatus,
  })
);
