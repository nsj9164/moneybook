import { useEffect, useState } from "react";
import { unformatNumber } from "@/util/util";

export const useExpenseSummary = (tempData, setTempData) => {
  const [expense, setExpense] = useState(0);
  const [realExpense, setRealExpense] = useState(0);

  useEffect(() => {
    // tempData에 빈 줄이 없으면 추가해주기
    if (tempData.length > 0) {
      const empty = tempData.filter((item) => !item.isDisabled);
      if (empty.length === tempData.length) {
        setTempData([...tempData, { isDisabled: true, isModified: false }]);
      }
    }

    // 합계 count
    const sum = (key) =>
      tempData
        .filter((item) => item[key])
        .reduce(
          (total, item) => total + parseInt(unformatNumber(item[key])),
          0
        );

    setExpense(sum("price1").toLocaleString("ko-KR"));
    setRealExpense(sum("price2").toLocaleString("ko-KR"));
  }, [tempData]);

  return { expense, realExpense };
};
