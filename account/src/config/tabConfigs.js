import MyCard from "../routes/PayList/Modal/MyCard";
import MyCategory from "../routes/PayList/Modal/MyCategory";
import MyFixedExpense from "../routes/PayList/Modal/MyFixedExpense";
import {
  cardListActions,
  categoryListActions,
  fixedItemListActions,
} from "../store/features/myDetailList/myDetailListActions";

const tabConfigs = ({
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
    data: fixedItemList,
    setData: setFixedDataList,
    component: (
      <MyFixedExpense
        setFixedDataList={setFixedDataList}
        checkedItems={checkedItems}
        setCheckedItems={setCheckedItems}
      />
    ),
    errorMessage: "Error loading fixed expense list",
    idField: "expense_id",
    listType: "fixedItemList",
  },
  2: {
    data: categoryList,
    setData: setCatDataList,
    component: <MyCategory setCatDataList={setCatDataList} />,
    errorMessage: "Error loading category list",
    idField: "cat_id",
    listType: "categoryList",
  },
  3: {
    data: cardList,
    setData: setCardDataList,
    component: <MyCard setCardDataList={setCardDataList} />,
    errorMessage: "Error loading card list",
    updateAction: cardListActions.updateItem,
    idField: "card_id",
    listType: "cardList",
  },
});

export default tabConfigs;
