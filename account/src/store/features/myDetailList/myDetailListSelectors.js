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

const selectStatus = (state) => state.myDetailList;

export const selectAllStatuses = createSelector(selectStatus, (status) => ({
  fixedItemListStatus: status["fixedItemList"].status,
  categoryListStatus: status["categoryList"].status,
  cardListStatus: status["cardList"].status,
  cardCompanyListStatus: status["cardCompanyList"].status,
}));

export const selectAllSaveStatuses = createSelector(
  selectStatus,
  (saveStatus) => ({
    fixedItemListSaveStatus: saveStatus["fixedItemList"].saveStatus,
    categoryListSaveStatus: saveStatus["categoryList"].saveStatus,
    cardListSaveStatus: saveStatus["cardList"].saveStatus,
  })
);
