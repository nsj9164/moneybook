import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  selectAllLists,
  selectAllStatuses,
} from "../store/features/myDetailList/myDetailListSelectors";
import { fetchLists } from "../store/features/myDetailList/myDetailListSlice";

const useFetchLists = (
  listTypes = ["fixedItemList", "cardList", "categoryList"]
) => {
  const dispatch = useDispatch();
  const lists = useSelector(selectAllLists);
  const statuses = useSelector(selectAllStatuses);

  useEffect(() => {
    if (statuses !== "loading" && statuses !== "succeeded") {
      dispatch(fetchLists(listTypes))
        .then((res) => console.log("fetchLists 결과:", res))
        .catch((err) => console.log("fetchLists 에러:", err));
    }
  }, [dispatch, JSON.stringify(listTypes)]);

  return { lists, statuses };
};

export default useFetchLists;
