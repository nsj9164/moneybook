import MyCard from "../routes/PayList/Modal/MyCard";
import MyCategory from "../routes/PayList/Modal/MyCategory";
import MyFixedExpense from "../routes/PayList/Modal/MyFixedExpense";
import {
  cardListActions,
  categoryListActions,
  fixedItemListActions,
} from "../store/features/myDetailList/myDetailListActions";

const tabConfigs = ({
  fixedItemListStatus,
  categoryListStatus,
  cardListStatus,
  fixedItemListSaveStatus,
  categoryListSaveStatus,
  cardListSaveStatus,
  fixedItemList,
  categoryList,
  cardList,
  setFixedDataList,
  setCatDataList,
  setCardDataList,
  checkedItems,
  setCheckedItems,
}) => ({
  1: {
    status: fixedItemListStatus,
    saveStatus: fixedItemListSaveStatus,
    data: fixedItemList,
    setData: setFixedDataList,
    component: (
      <MyFixedExpense
        setFixedDataList={setFixedDataList}
        fixedItemList={fixedItemList}
        catList={categoryList}
        cardList={cardList}
        checkedItems={checkedItems}
        setCheckedItems={setCheckedItems}
      />
    ),
    errorMessage: "Error loading fixed expense list",
    idField: "expense_id",
    listType: "fixedItemList",
  },
  2: {
    status: categoryListStatus,
    saveStatus: categoryListSaveStatus,
    data: categoryList,
    setData: setCatDataList,
    component: (
      <MyCategory setCatDataList={setCatDataList} catList={categoryList} />
    ),
    errorMessage: "Error loading category list",
    idField: "cat_id",
    listType: "categoryList",
  },
  3: {
    status: cardListStatus,
    saveStatus: cardListSaveStatus,
    data: cardList,
    setData: setCardDataList,
    component: <MyCard setCardDataList={setCardDataList} cardList={cardList} />,
    errorMessage: "Error loading card list",
    updateAction: cardListActions.updateItem,
    idField: "card_id",
    listType: "cardList",
  },
});

export default tabConfigs;
