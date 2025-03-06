import styled from "styled-components";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteData,
  fetchData,
  saveData,
} from "../../store/features/payList/payListActions";
import { date, selectText, unformatNumber } from "../../util/util";
import { useNavigate } from "react-router-dom";
import "react-datepicker/dist/react-datepicker.css";
import { startOfMonth, endOfMonth, format } from "date-fns";
import { useAuth } from "../../hooks/useAuth";
import TableWrapper from "../../components/Table/TableWrapper";
import ButtonGroup from "./Summary/ButtonGroup";
import SummaryInfo from "./Summary/SummaryInfo";
import SaveButtonWrapper from "./Summary/SaveButtonWrapper";
import PayListFilters from "./PayListFilters";
import AlertModal from "../../components/AlertModal";

function PayList() {
  const navigate = useNavigate();
  const { isLoggedIn } = useAuth();
  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/login");
    }
  }, [isLoggedIn, navigate]);

  let dispatch = useDispatch();

  const payList = useSelector((state) => state.payList.items);
  const payListStatus = useSelector((state) => state.payList.status);
  const [tempData, setTempData] = useState([]);

  const [expense, setExpense] = useState(0);
  const [realExpense, setRealExpense] = useState(0);
  const [focusedItemId, setFocusedItemId] = useState(null);
  const [tempId, setTempId] = useState(1);
  const [startDate, setStartDate] = useState(startOfMonth(new Date()));
  const [endDate, setEndDate] = useState(endOfMonth(new Date()));

  const inputRefs = useRef([]);
  const [checkedItems, setCheckedItems] = useState([]);
  const [checkedAll, setCheckedAll] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [showAlertModal, setShowAlertModal] = useState(false);

  // payList 호출
  useEffect(() => {
    if (isLoggedIn && payListStatus === "idle") {
      const start = format(startDate, "yyyyMMdd");
      const end = format(endDate, "yyyyMMdd");
      dispatch(fetchData({ start, end }));
    }
  }, [payListStatus, dispatch]);

  // tempData - payList 복제
  useEffect(() => {
    if (payListStatus === "succeeded" && payList.length > 0) {
      setTempData((prevTempData) => {
        const payListIds = new Set(payList.map((item) => item.id));

        if (prevTempData.length === 0) {
          return payList.map((item) => ({
            ...item,
            isDisabled: false,
            isModified: false,
          }));
        }

        const filteredTempData = prevTempData.filter(
          (item) => payListIds.has(item.id) || isNaN(item.id)
        );

        return [
          ...filteredTempData.map((item) => {
            const updatedItem = payList.find((p) => p.id === item.id);
            return updatedItem ? { ...item, ...updatedItem } : item;
          }),
          ...payList.filter(
            (item) => !filteredTempData.some((t) => t.id === item.id)
          ),
        ];
      });
    } else {
      setTempData([{ isDisabled: true }]);
    }
  }, [payListStatus, payList]);

  useEffect(() => {
    // tempData에 빈 줄이 없으면 추가해주기
    if (tempData.length > 0) {
      const empty = tempData.filter((item) => !item.isDisabled);
      if (empty.length === tempData.length) {
        setTempData([...tempData, { isDisabled: true, isModified: false }]);
      }
    }

    // 합계 count
    let sumPrice1 = tempData
      .filter((item) => item.price1 && unformatNumber(item.price1) > 0)
      .reduce((sum, item) => sum + parseInt(unformatNumber(item.price1)), 0);
    setExpense(sumPrice1.toLocaleString("ko-KR"));

    let sumPrice2 = tempData
      .filter((item) => item.price2 && unformatNumber(item.price2) > 0)
      .reduce((sum, item) => sum + parseInt(unformatNumber(item.price2)), 0);
    setRealExpense(sumPrice2.toLocaleString("ko-KR"));
    console.log("###################", tempData);
  }, [tempData]);

  // datepicker - 재조회
  useEffect(() => {
    dispatch(
      fetchData({
        start: format(startDate, "yyyyMMdd"),
        end: format(endDate, "yyyyMMdd"),
      })
    );
  }, [startDate, endDate]);

  // 전체선택/해제
  useEffect(() => {
    checkedItems.length ===
      tempData.filter((item) => !item.isDisabled).length && tempData.length > 1
      ? setCheckedAll(true)
      : setCheckedAll(false);
  }, [checkedItems, tempData]);

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
      const newData = tempData.map((i) => {
        if (item.id === i.id) {
          setTempId((tempId) => tempId + 1);
          return {
            ...i,
            id: `${date}-${tempId}`,
            date,
            price1: "0",
            price2: "0",
            isDisabled: false,
            isNew: true,
          };
        } else {
          return i;
        }
      });
      setTempData(newData);
      // setTimeout(() => setFocusedItemId(index), 0);
    } else {
      // setFocusedItemId(index);
    }
    setFocusedItemId(index);
  };

  // 전체선택/해제
  const handleCheckedAll = () => {
    if (checkedAll) {
      setCheckedItems([]);
    } else {
      const allIds = tempData
        .filter((item) => !item.isDisabled)
        .map((item) => item.id);
      setCheckedItems(allIds);
    }
    setCheckedAll(!checkedAll);
  };

  // 체크항목
  const handleCheck = (id) => {
    setCheckedItems((prev) =>
      prev.includes(id) ? prev.filter((itemId) => itemId !== id) : [...prev, id]
    );
  };

  // 저장하기
  const handleSave = async () => {
    const modifiedData = tempData.filter((item) => {
      const hasValidFields =
        Boolean(item.cat_id) ||
        Boolean(item.content) ||
        Boolean(item.price1) ||
        Boolean(item.price2) ||
        Boolean(item.card_id) ||
        Boolean(item.remark);
      return (item.isModified || item.isNew) && hasValidFields;
    });

    if (modifiedData.length > 0) {
      const resultAction = await dispatch(saveData(modifiedData));
      if (resultAction.meta.requestStatus === "fulfilled") {
        const insertIds = resultAction.payload;
        setTempData((prevData) =>
          prevData.map((item) => {
            const updatedItem = insertIds.find(
              (insert) => insert.tempId === item.id
            );

            return updatedItem
              ? {
                  ...item,
                  id: updatedItem.insertId,
                  isNew: false,
                  isModified: false,
                }
              : { ...item, isModified: false };
          })
        );
      }
      return true;
    } else {
      return false;
    }
  };

  // 데이터 삭제
  const handleDelete = async () => {
    const delCheckedIds = new Set(checkedItems);
    const payListIds = payList
      .filter((item) => delCheckedIds.has(item.id))
      .map((item) => item.id);
    const tempDataIds = tempData
      .filter((item) => delCheckedIds.has(item.id))
      .map((item) => item.id);

    let message = "";

    try {
      if (payListIds.length > 0) {
        const deleteAction = await dispatch(deleteData(payListIds));
        const status = deleteAction.payload?.status;
        if (status === 200) {
          message = deleteAction.payload.message || "삭제되었습니다.";
        } else {
          message = "삭제 중 오류가 발생했습니다";
        }
      }

      if (tempDataIds.length > 0) {
        setTempData((prevData) =>
          prevData.filter((item) => !tempDataIds.includes(item.id))
        );
        if (!message) message = "삭제되었습니다.";
      }
    } catch (error) {
      console.error("Error details:", error);
      message = "삭제 중 오류가 발생했습니다.";
    }

    if (message) {
      setAlertMessage(message);
      setShowAlertModal(true);
    }

    setCheckedItems([]);
  };

  // 데이터 복사
  const handleCopy = () => {
    const copyCheckedList = tempData
      .filter((item) => checkedItems.includes(item.id))
      .map((item) => ({ ...item, isNew: true }));

    copyCheckedList.map((item) => {
      setTempId((prevTempId) => {
        item.id = `${date}-${prevTempId}`;
        return prevTempId + 1;
      });
    });

    setTempData([
      ...tempData.slice(0, tempData.length - 1),
      ...copyCheckedList,
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

  const columns = {
    "": "checkbox",
    date: "날짜",
    cat_id: "분류",
    content: "항목",
    price1: "지출금액",
    price2: "실지출금액",
    card_id: "결제수단",
    remark: "비고",
  };

  const colWidths = ["5%", "10%", "10%", "auto", "12%", "12%", "15%", "15%"];

  return (
    <div className="payList_contents">
      <PayListFilters
        startDate={startDate}
        setStartDate={setStartDate}
        endDate={endDate}
        setEndDate={setEndDate}
      />

      <TableWrapper
        columns={columns}
        colWidths={colWidths}
        data={tempData}
        status={payListStatus}
        checkedItems={checkedItems}
        checkedAll={checkedAll}
        handleUpdate={handleUpdate}
        setInitial={setInitial}
        handleCheckedAll={handleCheckedAll}
        handleCheck={handleCheck}
        setFocusedItemId={setFocusedItemId}
      />

      <div className="summary-group">
        <ButtonGroup
          checkedItems={checkedItems}
          handleDelete={handleDelete}
          handleCopy={handleCopy}
        />
        <SummaryInfo expense={expense} realExpense={realExpense} />
        <SaveButtonWrapper onSave={handleSave} />
      </div>

      {showAlertModal && (
        <AlertModal
          message={alertMessage}
          onClose={() => setShowAlertModal(false)}
        />
      )}
    </div>
  );
}

export default PayList;
