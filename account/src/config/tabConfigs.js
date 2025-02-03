import MyCard from "../routes/PayList/Modal/MyCard";
import MyCategory from "../routes/PayList/Modal/MyCategory";
import MyFixedExpense from "../routes/PayList/Modal/MyFixedExpense";

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
      />
    ),
    errorMessage: "Error loading fixed expense list",
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
  },
  3: {
    status: cardListStatus,
    saveStatus: cardListSaveStatus,
    data: cardList,
    setData: setCardDataList,
    component: <MyCard setCardDataList={setCardDataList} cardList={cardList} />,
    errorMessage: "Error loading card list",
  },
});

export default tabConfigs;
