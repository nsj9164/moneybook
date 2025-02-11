const { useSelector } = require("react-redux");
const {
  selectAllLists,
} = require("../store/features/myDetailList/myDetailListSelectors");

const useCategoryList = () => {
  return useSelector(selectAllLists).categoryList;
};

export default useCategoryList;
