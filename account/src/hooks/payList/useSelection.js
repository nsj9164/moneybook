import { useEffect, useState } from "react";

export const useSelection = (tempData) => {
  const [checkedItems, setCheckedItems] = useState([]);
  const [checkedAll, setCheckedAll] = useState(false);

  // 전체선택/해제
  useEffect(() => {
    checkedItems.length ===
      tempData.filter((item) => !item.isDisabled).length && tempData.length > 1
      ? setCheckedAll(true)
      : setCheckedAll(false);
  }, [checkedItems, tempData]);

  // 전체선택/해제
  const handleCheckedAll = () => {
    const selectable = tempData
      .filter((item) => !item.isDisabled)
      .map((i) => i.id);
    setCheckedAll(checkedAll ? [] : selectable);
  };

  // 체크항목
  const handleCheck = (id) => {
    setCheckedItems((prev) =>
      prev.includes(id) ? prev.filter((itemId) => itemId !== id) : [...prev, id]
    );
  };

  return {
    checkedItems,
    checkedAll,
    handleCheck,
    handleCheckedAll,
    setCheckedItems,
  };
};
