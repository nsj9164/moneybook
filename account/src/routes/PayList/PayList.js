import styled from "styled-components";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchData,
  deleteData,
  saveData,
} from "../../store/features/payList/payListActions";
import {
  date,
  nowCursor,
  restoreCursor,
  selectText,
  unformatNumber,
} from "../../util/util";
import { useNavigate } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {
  startOfMonth,
  endOfMonth,
  format,
  subMonths,
  addMonths,
} from "date-fns";
import PayListModal from "./Modal/PayListModal";
import { Overlay } from "../../components/common/Overlay";
import { Input } from "../../components/common/EditableCell";
import { useAuth } from "../../hooks/useAuth";
import CustomSelect from "../../components/SelectComponent/CustomSelect";
import { fixedItemListActions } from "../../store/features/myDetailList/myDetailListActions";
import { selectAllLists } from "../../store/features/myDetailList/myDetailListSelectors";
import CardSelectOverlay from "../../components/PayList/CardSelectOverlay";
import useFetchLists from "../../hooks/useFetchLists";
import PayListFilters from "../../components/PayList/PayListFilters";
import TableWrapper from "../../components/common/TableWrapper";
import SaveButtonWrapper from "../../components/PayList/Summary/SaveButtonWrapper";
import ButtonGroup from "../../components/PayList/Summary/ButtonGroup";
import SummaryInfo from "../../components/PayList/Summary/SummaryInfo";

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

  const [price, setPrice] = useState("");
  const [expense, setExpense] = useState(0);
  const [realExpense, setRealExpense] = useState(0);
  const [focusedItemId, setFocusedItemId] = useState(null);
  const [tempId, setTempId] = useState(1);
  const [startDate, setStartDate] = useState(startOfMonth(new Date()));
  const [endDate, setEndDate] = useState(endOfMonth(new Date()));

  const [visibleOverlay, setVisibleOverlay] = useState(null);

  const inputRefs = useRef([]);
  const [checkedItems, setCheckedItems] = useState([]);
  const [checkedAll, setCheckedAll] = useState(false);

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
      setTempData(
        payList.map((item) => ({
          ...item,
          isDisabled: false,
          isModified: false,
        }))
      );
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

  // selectText() 호출
  useEffect(() => {
    if (focusedItemId !== null) {
      const focusedElement = inputRefs.current[focusedItemId];
      if (focusedElement) {
        selectText({ target: focusedElement });
      }
    }
  }, [focusedItemId]);

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
            price1: 0,
            price2: 0,
            isDisabled: false,
            isNew: true,
          };
        } else {
          return i;
        }
      });
      setTempData(newData);
      setTimeout(() => setFocusedItemId(index), 0);
    } else {
      setFocusedItemId(index);
    }
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
        Boolean(item.cat_nm) ||
        Boolean(item.content) ||
        Boolean(item.price1) ||
        Boolean(item.price2) ||
        Boolean(item.payment) ||
        Boolean(item.remark);
      return (item.isModified || item.isNew) && hasValidFields;
    });

    if (modifiedData.length > 0) {
      const resultAction = await dispatch(saveData(modifiedData));
      if (resultAction.meta.requestStatus === "fulfilled") {
        const insertIds = resultAction.payload;
        setTempData((prevData) => {
          const newData = prevData.map((item) => {
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
          });

          return newData;
        });
      }
    } else {
      if (visibleOverlay !== "save-overlay") {
        setVisibleOverlay("save-overlay");
      }
    }
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
    checkbox: "",
    date: "날짜",
    cat_nm: "분류",
    content: "항목",
    price1: "지출금액",
    price2: "실지출금액",
    payment: "결제수단",
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
        handleUpdate={handleUpdate}
        setInitial={setInitial}
        handleCheckedAll={handleCheckedAll}
        handleCheck={handleCheck}
      />

      <div className="summary-group">
        <ButtonGroup />
        <SummaryInfo expense={expense} realExpense={realExpense} />
        <SaveButtonWrapper onClick={handleSave} />
      </div>
    </div>
  );
}

export default PayList;
