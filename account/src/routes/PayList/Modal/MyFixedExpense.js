import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fixedItemListActions } from "../../../store/myDetailSlice";
import { nowCursor, restoreCursor, selectText } from "../../../util/util";
import { Input } from "../PayList";

function MyFixedExpense({ isLoggedIn, setFixedDataList }) {
  const dispatch = useDispatch();
  const fixedExpenseList = useSelector(
    (state) => state.myDetailList["fixedItemList"].items
  );
  const fixedExpenseListStatus = useSelector(
    (state) => state.myDetailList["fixedItemList"].status
  );
  const inputRefs = useRef([]);
  const [fixedData, setFixedData] = useState([]);
  const [fixedId, setFixedId] = useState(1);
  const [checkedAll, setCheckedAll] = useState(false);
  const [checkedItems, setCheckedItems] = useState([]);
  const [focusedItemId, setFocusedItemId] = useState(null);
  const [price, setPrice] = useState("");

  useEffect(() => {
    console.log("status???", fixedExpenseListStatus);
    if (isLoggedIn && fixedExpenseListStatus === "idle") {
      dispatch(fixedItemListActions.fetchData());
    }
  }, [isLoggedIn, fixedExpenseListStatus, dispatch]);

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
    if (fixedData.every((item) => !item.isDisabled)) {
      setFixedData([
        ...fixedData,
        { expense_id: `expense_${fixedId}`, isDisabled: true, isNew: true },
      ]);
      setFixedId((prevId) => prevId + 1);
    }

    // 저장할 data
    const modifiedData = fixedData.filter(
      (item) =>
        (item.isModified || item.isNew) &&
        fields.some((field) => item[field] !== "" && item[field] !== undefined)
    );
    setFixedDataList(modifiedData);
  }, [fixedData, setFixedDataList]);

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

  const setInitial = (item, index) => {
    if (item.isDisabled) {
      setFixedData(
        fixedData.map((data) =>
          data.id === item.id
            ? { ...data, expense_amount: 0, isDisabled: false }
            : data
        )
      );
    } else {
      setFocusedItemId(index);
    }
  };

  const handleCheck = (id) => {
    setCheckedItems((prev) =>
      prev.includes(id) ? prev.filter((itemId) => itemId !== id) : [...prev, id]
    );
  };

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

  useEffect(() => {
    setCheckedAll(
      checkedItems.length ===
        fixedData.filter((item) => !item.isDisabled).length &&
        fixedData.length > 1
    );
  }, [checkedItems, fixedData]);

  useEffect(() => {
    if (focusedItemId !== null) {
      const focusedElement = inputRefs.current[focusedItemId];
      if (focusedElement) {
        selectText({ target: focusedElement });
      }
    }
  }, [focusedItemId]);

  const handleKeyDown = (e, i, col) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (inputRefs.current[i]) {
        inputRefs.current[i].focus();
      }
    }

    if (col === "expense_amount") {
      const blockedRegex = /^[a-zA-Z~!@#$%^&*()_\-+=\[\]{}|\\;:'",.<>?/가-힣]$/;
      setPrice(e.target.innerText);
      if (
        (/\d/.test(e.key) && e.target.innerText.length > 12) ||
        blockedRegex.test(e.key)
      ) {
        e.preventDefault();
      }
    }
  };

  const handleInput = (e, col) => {
    if (col === "expense_amount") {
      const value = e.target.innerText;
      if (value !== "\n") {
        const cursor = nowCursor();
        const onlyNum = value.replace(/[^0-9]/g, "");
        const formattedValue = Number(onlyNum).toLocaleString("ko-KR");
        e.target.innerText = formattedValue;

        const diffLength = formattedValue.length - value.length;
        const adjustedStartOffset =
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
    <div className="modal-body">
      <h2 className="modal-title">고정항목 관리하기</h2>
      <table className="table table-hover" bordered hover>
        <colgroup>
          <col width="5%" />
          <col width="15%" />
          <col />
          <col width="15%" />
          <col width="20%" />
          <col width="20%" />
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
              <tr key={item.expense_id}>
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
                      <select aria-label="Default select example">
                        {col === "expense_date" &&
                          Array.from({ length: 31 }, (_, j) => (
                            <option
                              key={j}
                              value={`${String(j + 1).padStart(2, "0")}일`}
                            >
                              {String(j + 1).padStart(2, "0")}
                            </option>
                          ))}
                      </select>
                    </td>
                  ) : (
                    <Input
                      key={idx}
                      ref={(el) =>
                        (inputRefs.current[i * fields.length + idx] = el)
                      }
                      onBlur={(e) => handleUpdate(e, item.expense_id, col)}
                      onKeyDown={(e) =>
                        handleKeyDown(e, i * fields.length + idx, col)
                      }
                      onFocus={() => setInitial(item, i * fields.length + idx)}
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
              <td colSpan="6">Error loading data</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default MyFixedExpense;
