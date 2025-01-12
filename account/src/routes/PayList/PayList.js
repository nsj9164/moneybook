import styled from "styled-components";
import { useEffect, useRef, useState } from "react";
import { Table, Button, OverlayTrigger, Popover } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { fetchData, saveData, deleteData } from "../../store/paySlice";
import {
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

export const Input = styled.td.attrs({
  contentEditable: true,
  suppressContentEditableWarning: true,
})``;

function PayList() {
  const navigate = useNavigate();
  const isLoggedIn = useSelector((state) => state.login.isLoggedIn);

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

  const today = new Date();
  const date = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(
    2,
    "0"
  )}-${String(today.getDate()).padStart(2, "0")}`;

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

    console.log("tempData:::", tempData);
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
  const handleUpdate = (e, id, key) => {
    const newItem = key === "date" ? e : e.target.innerText;
    console.log("handleUpdate:::", id, key, newItem);
    setTempData((prevData) =>
      prevData.map((item) => {
        console.log(item.id);
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
          console.log("tempId:::", date, tempId);
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
      console.log("newData:::", newData);
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
    console.log("checkedItems:::", checkedItems);
  }, [checkedItems, tempData]);

  // 삭제
  const handleDelete = () => {
    const delCheckedList = checkedItems.filter((id) =>
      tempData.some((item) => item.id === id)
    );
    console.log("delCheckedList::::", delCheckedList);
    dispatch(deleteData(delCheckedList));

    setTempData((prevData) =>
      prevData.map((item) => {
        return delCheckedList.includes(item.id)
          ? { ...item, isDeleted: true }
          : item;
      })
    );
    setCheckedItems([]);
  };

  // 데이터 복사
  const handleCopy = () => {
    const copyCheckedList = tempData
      .filter((item) => checkedItems.includes(item.id))
      .map((item) => ({ ...item }));
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
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

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
      console.log("innerText:::", e.target.innerText, e.key === "Process");
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
    }
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
        <Button
          variant="outline-dark"
          className="btn_month_prev"
          onClick={() => handleDate("prev")}
        >
          &lt;
        </Button>

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
        <Button
          variant="outline-dark"
          className="btn_month_next"
          onClick={() => handleDate("next")}
        >
          &gt;
        </Button>
      </div>

      <Table bordered hover>
        <colgroup>
          <col width={"5%"} />
          <col width={"10%"} />
          <col width={"10%"} />
          <col />
          <col width={"12%"} />
          <col width={"12%"} />
          <col width={"15%"} />
          <col width={"15%"} />
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
          {payListStatus === "loading" && <div>Loading...</div>}

          {payListStatus === "succeeded" &&
            tempData.map((item, i) =>
              !item.isDeleted ? (
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
                      <td>
                        <DatePicker
                          key={col}
                          selected={
                            item[col] ? new Date(item[col]) : new Date()
                          }
                          onKeyDown={(e) => {
                            e.preventDefault();
                          }}
                          onChange={(date) => handleUpdate(date, item.id, col)}
                          onFocus={(e) => setInitial(item, i * 7 + idx)}
                          dateFormat="yyyy-MM-dd"
                          className="input_date"
                        />
                      </td>
                    ) : (
                      <Input
                        key={col}
                        ref={(el) => (inputRefs.current[i * 7 + idx] = el)}
                        onBlur={(e) => handleUpdate(e, item.id, col)}
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
              ) : null
            )}

          {payListStatus === "failed" && (
            <tr>
              <td colspan="8">Error</td>
            </tr>
          )}
        </tbody>
      </Table>

      <div className="summary-group">
        <div className="button-group">
          <Button
            variant="outline-dark"
            size="sm"
            disabled={checkedItems.length === 0}
            onClick={handleDelete}
            className="cursor_pointer"
          >
            선택삭제
          </Button>
          <Button
            variant="outline-dark"
            size="sm"
            disabled={checkedItems.length === 0}
            onClick={handleCopy}
            className="cursor_pointer"
          >
            선택복사
          </Button>
          <OverlayTrigger
            trigger="click"
            key="top"
            placement="top"
            overlay={
              <Popover id={`popover-positioned-top`}>
                <Popover.Header as="h3">카드분류선택</Popover.Header>
                <Popover.Body>
                  <strong>Holy guacamole!</strong> Check this info.
                </Popover.Body>
              </Popover>
            }
          >
            <Button
              variant="outline-dark"
              size="sm"
              disabled={checkedItems.length === 0}
              className="cursor_pointer"
            >
              카드선택
            </Button>
          </OverlayTrigger>
          <Button
            variant="outline-dark"
            size="sm"
            onClick={handleModal}
            className="cursor_pointer"
          >
            고정금액
          </Button>
          <PayListModal
            show={isModalOpen}
            onClose={handleModal}
            isLoggedIn
            Input
          />
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
          <Button variant="primary" size="lg" onClick={handleSave}>
            저장하기
          </Button>
        </div>
      </div>
    </div>
  );
}

export default PayList;
