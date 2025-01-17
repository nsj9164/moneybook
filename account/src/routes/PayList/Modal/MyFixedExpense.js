import { useEffect, useRef, useState } from "react";
import { Table, Form } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { fixedItemListActions } from "../../../store/myDetailSlice";
import { nowCursor, restoreCursor, selectText } from "../../../util/util";
import { Input } from "../PayList";

function MyFixedExpense({ isLoggedIn, setFixedDataList }) {
  const dispatch = useDispatch();
  const fixedExpenseList = useSelector((state) => state.myDetailList.items);
  const fixedExpenseListStatus = useSelector(
    (state) => state.myDetailList.status
  );
  const inputRefs = useRef([]);
  const [fixedData, setFixedData] = useState([]);
  const [fixedId, setFixedId] = useState(1);
  const [checkedAll, setCheckedAll] = useState(false);
  const [checkedItems, setCheckedItems] = useState([]);
  const [focusedItemId, setFocusedItemId] = useState(null);
  const [price, setPrice] = useState("");

  // fetchData 호출
  useEffect(() => {
    if (isLoggedIn && fixedExpenseListStatus === "idle") {
      dispatch(fixedItemListActions.fetchData());
    }
  }, [fixedExpenseListStatus, dispatch]);

  // setting fixedData
  useEffect(() => {
    if (fixedExpenseListStatus === "succeeded" && fixedExpenseList.length > 0) {
      setFixedData(
        fixedExpenseList.map((item) => ({
          ...item,
          isDisabled: false,
          isModified: false,
        }))
      );
    }
  }, [fixedExpenseListStatus, fixedExpenseList]);

  useEffect(() => {
    if (fixedData.length >= 0) {
      const empty = fixedData.filter((item) => !item.isDisabled);
      if (empty.length === fixedData.length) {
        setFixedData([
          ...fixedData,
          {
            expense_id: `expense_${fixedId}`,
            isDisabled: true,
            isNew: true,
          },
        ]);
        setFixedId((id) => id + 1);
      }
    }

    const modifiedData = fixedData.filter(
      (item) =>
        (item.isModified || item.isNew) &&
        fields.some((field) => item[field] !== "" && item[field] !== undefined)
    );
    setFixedDataList(modifiedData);
  }, [fixedData]);

  // 데이터 수정
  const handleUpdate = (e, id, key) => {
    const newItem = e.target.innerText;
    setFixedData((prevData) =>
      prevData.map((item) =>
        item.expense_id === id
          ? { ...item, [key]: newItem, isModified: true }
          : item
      )
    );
  };

  // 추가 입력란 클릭시 초기값 세팅
  const setInitial = (item, index) => {
    if (item.isDisabled) {
      setFixedData(
        fixedData.map((data) =>
          item.id === data.id
            ? { ...data, expense_amount: 0, isDisabled: false }
            : data
        )
      );
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
      const allIds = fixedData
        .filter((item) => !item.isDisabled)
        .map((item) => item.id);
      setCheckedItems(allIds);
    }
    setCheckedAll(!checkedAll);
  };

  // 전체선택/해제
  useEffect(() => {
    checkedItems.length ===
      fixedData.filter((item) => !item.isDisabled).length &&
    fixedData.length > 1
      ? setCheckedAll(true)
      : setCheckedAll(false);
  }, [checkedItems]);

  useEffect(() => {
    if (focusedItemId !== null) {
      const focusedElement = inputRefs.current[focusedItemId];
      if (focusedElement) {
        selectText({ target: focusedElement });
      }
    }
  }, [focusedItemId]);

  // Enter, 숫자 입력
  const handleKeyDown = (e, i, col) => {
    if (e.key === "Enter") {
      // 엔터로 줄바꿈 방지
      e.preventDefault();
      if (inputRefs.current[i]) {
        inputRefs.current[i].focus();
      }
    }

    if (col === "expense_amount") {
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

  // 숫자 입력 type(콤마, 커서 위치)
  const handleInput = (e, col) => {
    if (col === "expense_amount") {
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

  const fields = [
    "expense_date",
    "expense_desc",
    "expense_amount",
    "expense_payment",
    "expense_cat_nm",
  ];

  return (
    <div class="modal-body">
      <h2 class="modal-title">고정항목 관리하기</h2>
      <Table class="custom-table" bordered hover>
        <colgroup>
          <col width={"5%"} />
          <col width={"15%"} />
          <col />
          <col width={"15%"} />
          <col width={"20%"} />
          <col width={"20%"} />
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
            <th>발생일</th>
            <th>사용내역</th>
            <th>결제금액</th>
            <th>결제수단</th>
            <th>분류</th>
          </tr>
        </thead>
        <tbody>
          {fixedExpenseListStatus === "succeeded" &&
            fixedData.map((item, i) => (
              <tr key={i}>
                <td>
                  <input
                    type="checkbox"
                    checked={checkedItems.includes(item.id)}
                    onChange={() => handleCheck(item.id)}
                    disabled={item.isDisabled}
                  />
                </td>
                {fields.map((col, idx) =>
                  col === "expense_date" ||
                  col === "expense_payment" ||
                  col === "expense_cat_nm" ? (
                    <td key={idx}>
                      <Form.Select aria-label="Default select example">
                        {col === "expense_date" &&
                          Array.from({ length: 31 }, (_, j) => (
                            <option
                              key={j}
                              value={String(j + 1).padStart(2, "0") + "일"}
                            >
                              {String(j + 1).padStart(2, "0")}
                            </option>
                          ))}
                        {col === "expense_date" && (
                          <>
                            <option value="1">One{col}</option>
                            <option value="2">Two</option>
                            <option value="3">Three</option>
                          </>
                        )}
                        {col === "expense_date" && (
                          <>
                            <option value="1">One{col}</option>
                            <option value="2">Two</option>
                            <option value="3">Three</option>
                          </>
                        )}
                      </Form.Select>
                    </td>
                  ) : (
                    <Input
                      key={idx}
                      ref={(el) => (inputRefs.current[i * 2 + idx] = el)}
                      onBlur={(e) => handleUpdate(e, item.expense_id, col)}
                      onKeyDown={(e) =>
                        handleKeyDown(e, (i + 1) * 2 + idx, col)
                      }
                      onFocus={(e) => setInitial(item, i * 2 + idx)}
                      onInput={(e) => handleInput(e, col)}
                    >
                      {item[col]}
                    </Input>
                  )
                )}
              </tr>
            ))}

          {fixedExpenseListStatus === "failed" && (
            <tr>
              <td colspan="6">Error</td>
            </tr>
          )}
        </tbody>
      </Table>
    </div>
  );
}

export default MyFixedExpense;
