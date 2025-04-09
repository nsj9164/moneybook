import { deleteData, saveData } from "@/store/features/payList/payListActions";
import { useState } from "react";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";

export const usePayListActions = (
  tempData,
  setTempData,
  { checkedItems, setCheckedItems }
) => {
  const dispatch = useDispatch();
  const payList = useSelector((state) => state.payList.items);
  const [alert, setAlert] = useState({ message: "", visible: false });

  // 저장하기
  const handleSave = async () => {
    const modified = tempData.filter(
      (item) =>
        (item.isModified || item.isNew) &&
        (item.cat_id ||
          item.content ||
          item.price1 ||
          item.price2 ||
          item.card_id ||
          item.remark)
    );

    if (!modified.length) {
      setAlert({ message: "저장할 항목이 없습니다.", visible: true });
      return false;
    }

    try {
      const result = await dispatch(saveData(modified));

      if (result.meta.requestStatus === "fulfilled") {
        const insertIds = result.payload;

        setTempData((prev) =>
          prev.map((item) => {
            const match = insertIds.find((i) => i.tempId === item.id);
            return match
              ? { ...item, id: match.insertId, isNew: false, isModified: false }
              : { ...item, isModified: false };
          })
        );

        setAlert({ message: "저장되었습니다.", visible: true });
        return true;
      } else {
        throw new Error("저장 실패");
      }
    } catch (error) {
      console.error("저장 오류:", error);
      setAlert({ message: "저장 중 오류가 발생했습니다.", visible: true });
      return false;
    }
  };

  // 데이터 삭제
  const handleDelete = async () => {
    const targetIds = new Set(checkedItems);
    const serverIds = payList
      .filter((i) => targetIds.has(i.id))
      .map((i) => i.id);
    const tempIds = tempData
      .filter((i) => targetIds.has(i.id))
      .map((i) => i.id);

    let message = "";

    try {
      if (serverIds.length > 0) {
        const { payload } = await dispatch(deleteData(serverIds));
        const status = payload?.status;

        if (status === 200) {
          message = payload.message || "삭제되었습니다.";
        } else {
          throw new Error("삭제 실패");
        }
      }

      if (tempIds.length > 0) {
        setTempData((prev) => prev.filter((i) => !tempIds.includes(i.id)));
        if (!message) message = "삭제되었습니다.";
      }
    } catch (err) {
      console.error("Error during delete:", err);
      message = "삭제 중 오류가 발생했습니다.";
    } finally {
      setAlert({ message, visible: true });
      setCheckedItems([]);
    }
  };

  // 데이터 복사
  const copyItem = (item) => ({
    ...item,
    id: generateTempId("expense"),
    isNew: true,
    isModified: false,
  });

  const handleCopy = () => {
    const copied = tempData
      .filter((item) => checkedItems.includes(item.id))
      .map(copyItem);

    setTempData([
      ...tempData.slice(0, tempData.length - 1),
      ...copied,
      ...tempData.slice(-1),
    ]);

    setCheckedItems([]);
  };

  // 카드선택 버튼 클릭 시
  const changeSelectedCards = (cardId) => {
    setTempData((prevData) =>
      prevData.map((item) =>
        checkedItems.includes(item.id)
          ? { ...item, payment: cardId, isModified: true }
          : item
      )
    );
    setCheckedItems([]);
    setVisibleOverlay(null);
  };

  // 데이터 수정
  const handleUpdate = (newItem, id, key) => {
    setTempData((prevData) =>
      prevData.map((item) => {
        return item.id === id
          ? { ...item, [key]: newItem, isModified: true }
          : item;
      })
    );
  };

  // 추가 입력란 클릭시 초기값 세팅
  const setInitial = (item, index) => {
    if (item.isDisabled) {
      setTempData((prev) =>
        prev.map((i) =>
          i.id === item.id
            ? {
                ...i,
                id: generateTempId("expense"),
                date,
                price1: "0",
                price2: "0",
                isDisabled: false,
                isNew: true,
              }
            : i
        )
      );
    }
    setFocusedItemId(index);
  };

  return {
    handleSave,
    handleDelete,
    handleCopy,
    changeSelectedCards,
    handleUpdate,
    setInitial,
    alert,
    setAlert,
  };
};
