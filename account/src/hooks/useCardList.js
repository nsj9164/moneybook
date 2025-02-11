const { useSelector } = require("react-redux");
const {
  selectAllLists,
} = require("../store/features/myDetailList/myDetailListSelectors");

const useCardList = () => {
  return useSelector(selectAllLists).cardList;
};

export default useCardList;
