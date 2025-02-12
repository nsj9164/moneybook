import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  selectAllLists,
  selectAllStatuses,
} from "../store/features/myDetailList/myDetailListSelectors";
import { fetchLists } from "../store/features/myDetailList/myDetailListSlice";

const useFetchLists = () => {
  const dispatch = useDispatch();
  const lists = useSelector(selectAllLists);
  const statuses = useSelector(selectAllStatuses);

  useEffect(() => {
    if (statuses !== "loading" && statuses !== "succeeded") {
      dispatch(fetchLists())
        .then((res) => console.log("fetchLists 결과:", res))
        .catch((err) => console.log("fetchLists 에러:", err));
    }
  }, [dispatch]);

  return { lists, statuses };
};

export default useFetchLists;
