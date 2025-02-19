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
import CardSelectOverlay from "../../components/payList/CardSelectOverlay";
import useFetchLists from "../../hooks/useFetchLists";

function PayList() {
  const navigate = useNavigate();
  const { isLoggedIn } = useAuth();
  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/login");
    }
  }, [isLoggedIn, navigate]);

  let dispatch = useDispatch();
  const inputRefs = useRef([]);
  const payList = useSelector((state) => state.payList.items);
  const payListStatus = useSelector((state) => state.payList.status);
  let [tempData, setTempData] = useState([]);
  const [checkedItems, setCheckedItems] = useState([]);
  const [checkedAll, setCheckedAll] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [price, setPrice] = useState("");
  const [expense, setExpense] = useState(0);
  const [realExpense, setRealExpense] = useState(0);
  const [focusedItemId, setFocusedItemId] = useState(null);
  const [tempId, setTempId] = useState(1);
  const [startDate, setStartDate] = useState(startOfMonth(new Date()));
  const [endDate, setEndDate] = useState(endOfMonth(new Date()));
  const [visibleOverlay, setVisibleOverlay] = useState(null);
  const [isButtonHovered, setIsButtonHovered] = useState(false);

  const {
    lists: { cardList, categoryList },
    statuses: { cardListStatus, categoryListStatus },
  } = useFetchLists(["cardList", "categoryList"]);

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

  // datepicker - 이전/다음
  const handleDate = (btn) => {
    if (btn === "prev") {
      setStartDate(startOfMonth(subMonths(startDate, 1)));
      setEndDate(endOfMonth(subMonths(endDate, 1)));
    } else if (btn === "next") {
      setStartDate(startOfMonth(addMonths(startDate, 1)));
      setEndDate(endOfMonth(addMonths(endDate, 1)));
    }
  };

  // datepicker - 재조회
  useEffect(() => {
    dispatch(
      fetchData({
        start: format(startDate, "yyyyMMdd"),
        end: format(endDate, "yyyyMMdd"),
      })
    );
  }, [startDate, endDate]);

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

  // selectText() 호출
  useEffect(() => {
    if (focusedItemId !== null) {
      const focusedElement = inputRefs.current[focusedItemId];
      if (focusedElement) {
        selectText({ target: focusedElement });
      }
    }
  }, [focusedItemId]);

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

  // 체크항목
  const handleCheck = (id) => {
    setCheckedItems((prev) =>
      prev.includes(id) ? prev.filter((itemId) => itemId !== id) : [...prev, id]
    );
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

  // 전체선택/해제
  useEffect(() => {
    checkedItems.length ===
      tempData.filter((item) => !item.isDisabled).length && tempData.length > 1
      ? setCheckedAll(true)
      : setCheckedAll(false);
  }, [checkedItems, tempData]);

  // 삭제
  const handleDelete = () => {
    const delCheckedIds = new Set(checkedItems);
    const payListIds = new Set(
      payList.filter((item) => delCheckedIds.has(item.id))
    );

    if (delCheckedIds.size > 0) {
      dispatch(deleteData([...delCheckedIds]));
    }

    setTempData((prevData) =>
      prevData.filter((item) => !delCheckedIds.has(item.id))
    );
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

  // modal control
  const handleModal = () => setIsModalOpen(!isModalOpen);

  // Enter - 입력
  const handleKeyDown = (e, i, col) => {
    if (e.key === "Enter") {
      // 엔터로 줄바꿈 방지
      e.preventDefault();
      if (inputRefs.current[i]) {
        inputRefs.current[i].focus();
      }
    }

    if (col.includes("price")) {
      setPrice(e.target.innerText);
      const blockedRegex = /^[a-zA-Z~!@#$%^&*()_\-+=\[\]{}|\\;:'",.<>?/가-힣]$/;
      if (
        (/\d/.test(e.key) && e.target.innerText.length > 12) ||
        blockedRegex.test(e.key)
      ) {
        e.preventDefault();
      }
    }
  };

  // 입력type
  const handleInput = (e, col) => {
    if (col.includes("price")) {
      const value = e.target.innerText;
      if (e.target.innerText !== "\n") {
        const cursor = nowCursor();
        const onlyNum = value.replace(/[^0-9]/g, "");
        const formattedValue = Number(onlyNum).toLocaleString("ko-KR");
        e.target.innerText = formattedValue;

        const diffLength = formattedValue.length - value.length;
        let adjustedStartOffset =
          price === formattedValue && !/[ㄱ-ㅎ가-힣]/.test(value)
            ? cursor.startOffset
            : cursor.startOffset + diffLength;

        restoreCursor(
          e.target,
          adjustedStartOffset >= 0 ? adjustedStartOffset : 0
        );
      }
    }
  };

  // 저장하기
  const handleSave = () => {
    const modifiedData = tempData.filter(
      (item) => item.isModified || item.isNew
    );

    if (modifiedData.length > 0) {
      dispatch(saveData(tempData));
      dispatch(
        fetchData({
          start: format(startDate, "yyyyMMdd"),
          end: format(endDate, "yyyyMMdd"),
        })
      );
    } else {
      if (visibleOverlay !== "save-overlay") {
        setVisibleOverlay("save-overlay");
      }
    }
  };

  useEffect(() => {
    if (!isButtonHovered && visibleOverlay === "save-overlay") {
      setVisibleOverlay(null);
    }
  }, [isButtonHovered]);

  const handleOverlay = (overlay) => {
    visibleOverlay === null
      ? setVisibleOverlay(overlay)
      : setVisibleOverlay(null);
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

  const columns = [
    "date",
    "cat_nm",
    "content",
    "price1",
    "price2",
    "payment",
    "remark",
  ];

  return (
    <div className="payList_contents">
      <div className="date_wrap">
        <button className="square_button" onClick={() => handleDate("prev")}>
          <span>&lt;</span>
        </button>

        <DatePicker
          selected={startDate}
          onChange={(date) => {
            setStartDate(date);
            if (endDate && date > endDate) setEndDate(addMonths(date, 1));
          }}
          dateFormat="yyyy.MM.dd"
          className="date_picker"
          disableTextInput
        />
        <span className="hyphen"></span>
        <DatePicker
          selected={endDate}
          onChange={(date) => setEndDate(date)}
          dateFormat="yyyy.MM.dd"
          minDate={startDate}
          className="date_picker"
          disableTextInput
        />
        <button className="square_button" onClick={() => handleDate("next")}>
          <span>&gt;</span>
        </button>
      </div>

      <table className="table table-hover">
        <colgroup>
          <col style={{ width: "5%" }} />
          <col style={{ width: "10%" }} />
          <col style={{ width: "10%" }} />
          <col />
          <col style={{ width: "12%" }} />
          <col style={{ width: "12%" }} />
          <col style={{ width: "15%" }} />
          <col style={{ width: "15%" }} />
        </colgroup>
        <thead>
          <tr>
            <th>
              <input
                type="checkbox"
                checked={checkedAll}
                onChange={handleCheckedAll}
              />
            </th>
            <th>날짜</th>
            <th>분류</th>
            <th>항목</th>
            <th>지출금액</th>
            <th>실지출금액</th>
            <th>결제수단</th>
            <th>비고</th>
          </tr>
        </thead>
        <tbody>
          {payListStatus === "loading" && (
            <tr>
              <td colSpan="8">Loading...</td>
            </tr>
          )}

          {payListStatus === "succeeded" &&
            tempData.map((item, i) => (
              <tr key={i}>
                <td>
                  <input
                    type="checkbox"
                    checked={checkedItems.includes(item.id)}
                    onChange={() => handleCheck(item.id)}
                    disabled={item.isDisabled}
                  />
                </td>
                {columns.map((col, idx) =>
                  col === "date" ? (
                    <td key={col}>
                      <DatePicker
                        selected={item[col] ? new Date(item[col]) : new Date()}
                        onKeyDown={(e) => e.preventDefault()}
                        onChange={(date) =>
                          handleUpdate(format(date, "yyyy-MM-dd"), item.id, col)
                        }
                        onFocus={(e) => setInitial(item, i * 7 + idx)}
                        dateFormat="yyyy-MM-dd"
                        className="input_date"
                      />
                    </td>
                  ) : col === "cat_nm" ? (
                    <CustomSelect
                      key={idx}
                      value={item[col]}
                      options={
                        categoryList &&
                        categoryList.map((list) => ({
                          value: list.cat_id,
                          label: list.category_nm,
                        }))
                      }
                      noSelectValue="미분류"
                      onChange={(value) => handleUpdate(value, item.id, col)}
                    />
                  ) : col === "payment" ? (
                    <CustomSelect
                      key={idx}
                      value={item[col]}
                      options={cardList.map((list) => ({
                        value: list.card_id,
                        label: list.card_name,
                      }))}
                      noSelectValue="선택없음"
                      onChange={(value) => handleUpdate(value, item.id, col)}
                    />
                  ) : (
                    <Input
                      key={col}
                      ref={(el) => (inputRefs.current[i * 7 + idx] = el)}
                      onBlur={(e) =>
                        handleUpdate(e.target.innerText, item.id, col)
                      }
                      onKeyDown={(e) =>
                        handleKeyDown(e, (i + 1) * 7 + idx, col)
                      }
                      onFocus={(e) => setInitial(item, i * 7 + idx)}
                      onInput={(e) => handleInput(e, col)}
                    >
                      {item[col]}
                    </Input>
                  )
                )}
              </tr>
            ))}

          {payListStatus === "failed" && (
            <tr>
              <td colSpan="8">Error</td>
            </tr>
          )}
        </tbody>
      </table>

      <div className="summary-group">
        <div className="button-group">
          <button disabled={checkedItems.length === 0} onClick={handleDelete}>
            선택삭제
          </button>
          <button disabled={checkedItems.length === 0} onClick={handleCopy}>
            선택복사
          </button>
          <div className="popover-wrapper">
            <button
              className="button-group-btns"
              disabled={checkedItems.length === 0}
              onClick={() => handleOverlay("card-overlay")}
            >
              카드선택
            </button>

            {visibleOverlay === "card-overlay" && (
              <CardSelectOverlay
                cardList={cardList}
                changeSelectedCards={changeSelectedCards}
              />
            )}
          </div>
          <button onClick={handleModal}>고정금액</button>
          <PayListModal show={isModalOpen} onClose={handleModal} />
        </div>
        <div className="summary-item item1">
          <div>지출합계</div>
          <div className="font-bold">{expense}</div>
        </div>
        <div className="summary-item item2">
          <div>실지출합계</div>
          <div className="font-bold">{realExpense}</div>
        </div>

        <div className="summary-item item3">
          <div className="popover-wrapper">
            <button
              onClick={handleSave}
              onMouseEnter={() => setIsButtonHovered(true)}
              onMouseLeave={() => setIsButtonHovered(false)}
            >
              저장하기
            </button>

            {visibleOverlay === "save-overlay" && (
              <Overlay
                overlayContent={"저장할 내용이 없습니다."}
                setVisibleOverlay={setVisibleOverlay}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default PayList;
