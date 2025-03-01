import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchPayList } from "../store/features/payList/payListSlice";

const usePayList = () => {
  const dispatch = useDispatch();
  const payList = useSelector((state) => state.payList.items);
  const payListStatus = useSelector((state) => state.payList.status);

  useEffect(() => {
    if (payListStatus != "loading" && payListStatus != "succeeded") {
      dispatch(fetchPayList)
        .then((res) => console.log("fetchLists 결과:", res))
        .catch((err) => console.log("fetchLists 에러:", err));
    }
  });
};
