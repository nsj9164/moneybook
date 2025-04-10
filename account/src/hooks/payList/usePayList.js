import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchData } from "@/store/features/payList/payListActions";
import { useAuth } from "@/hooks/auth/useAuth";
import { useExpenseSummary } from "./useExpenseSummary";
import { usePayListActions } from "./usePayListActions";
import { useSelection } from "./useSelection";
import { endOfMonth, format, startOfMonth } from "date-fns";

export const usePayList = () => {
  const dispatch = useDispatch();
  const { isLoggedIn } = useAuth();
  const payList = useSelector((state) => state.payList.items);
  const payListStatus = useSelector((state) => state.payList.status);

  const [tempData, setTempData] = useState([]);
  const [startDate, setStartDate] = useState(startOfMonth(new Date()));
  const [endDate, setEndDate] = useState(endOfMonth(new Date()));

  // fetch
  useEffect(() => {
    if (isLoggedIn && payListStatus === "idle") {
      dispatch(
        fetchData({
          start: format(startDate, "yyyyMMdd"),
          end: format(endDate, "yyyyMMdd"),
        })
      );
    }
  }, [isLoggedIn, dispatch, startDate, endDate, payListStatus]);

  // tempData - payList 복제
  useEffect(() => {
    if (payListStatus === "succeeded" && payList.length > 0) {
      const mapped = payList.map((item) => ({
        ...item,
        isDisabled: false,
        isModified: false,
      }));
      setTempData(mapped);
    } else {
      setTempData([{ isDisabled: true }]);
    }
  }, [payListStatus, payList]);

  // datepicker - 재조회
  useEffect(() => {
    dispatch(
      fetchData({
        start: format(startDate, "yyyyMMdd"),
        end: format(endDate, "yyyyMMdd"),
      })
    );
  }, [startDate, endDate]);

  const selection = useSelection(tempData);
  const summary = useExpenseSummary(tempData, setTempData);
  const actions = usePayListActions(tempData, setTempData, selection);

  return {
    startDate,
    endDate,
    setStartDate,
    setEndDate,
    tempData,
    setTempData,
    payListStatus,
    ...selection,
    ...summary,
    ...actions,
  };
};
