import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  selectAllLists,
  selectAllStatuses,
} from "../store/features/myDetailList/myDetailListSelectors";
import { fetchLists } from "../store/features/myDetailList/myDetailListSlice";
import { fetchPayList } from "../store/features/payList/payListSlice";

const useFetchLists = (
  mode = "list",
  listTypes = ["fixedItemList", "cardList", "categoryList"]
) => {
  const dispatch = useDispatch();
  const lists = useSelector(selectAllLists);
  const statuses = useSelector(selectAllStatuses);

  const payList = useSelector((state) => state.payList.items);
  const payListStatus = useSelector((state) => state.payList.status);

  const memoizedListTypes = useMemo(
    () => JSON.stringify(listTypes),
    [listTypes]
  );

  useEffect(() => {
    if (mode === "list") {
      const shouldFetchLists = listTypes.some(
        (type) => statuses[type] !== "loading" && statuses[type] !== "succeeded"
      );

      if (shouldFetchLists) {
        dispatch(fetchLists(listTypes))
          .then((res) => console.log("fetchLists 결과:", res))
          .catch((err) => console.log("fetchLists 에러:", err));
      }
    }

    if (
      mode === "pay" &&
      payListStatus !== "loading" &&
      payListStatus !== "succeeded"
    ) {
      dispatch(fetchPayList())
        .then((res) => console.log("fetchPayList 결과:", res))
        .catch((err) => console.log("fetchPayList 에러:", err));
    }
  }, [dispatch, mode, memoizedListTypes, payListStatus]);

  return mode === "list" ? { lists, statuses } : { payList, payListStatus };
};

export default useFetchLists;
