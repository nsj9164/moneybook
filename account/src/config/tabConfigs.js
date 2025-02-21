import MyCard from "../routes/PayList/Modal/MyCard";
import MyCategory from "../routes/PayList/Modal/MyCategory";
import MyFixedExpense from "../routes/PayList/Modal/MyFixedExpense";
import {
  cardListActions,
  categoryListActions,
  fixedItemListActions,
} from "../store/features/myDetailList/myDetailListActions";

const tabConfigs = ({
  setFixedDataList,
  setCatDataList,
  setCardDataList,
  catDataList,
  checkedItems,
  setCheckedItems,
}) => ({
  1: {
    component: (
      <MyFixedExpense
        setFixedDataList={setFixedDataList}
        checkedItems={checkedItems}
        setCheckedItems={setCheckedItems}
      />
    ),
    idField: "expense_id",
    listType: "fixedItemList",
  },
  2: {
    component: (
      <MyCategory catDataList={catDataList} setCatDataList={setCatDataList} />
    ),
    idField: "cat_id",
    listType: "categoryList",
  },
  3: {
    component: <MyCard setCardDataList={setCardDataList} />,
    updateAction: cardListActions.updateItem,
    idField: "card_id",
    listType: "cardList",
  },
});

export default tabConfigs;
