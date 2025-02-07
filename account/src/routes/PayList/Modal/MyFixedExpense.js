import { useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Input } from "../../../components/EditableCell";
import CustomSelect from "../../../components/SelectComponent/CustomSelect";
import { date, nowCursor, restoreCursor, selectText } from "../../../util/util";

function MyFixedExpense({
  setFixedDataList,
  fixedItemList,
  catList,
  cardList,
  checkedItems,
  setCheckedItems,
}) {
  const dispatch = useDispatch();
  const inputRefs = useRef([]);
  const [fixedData, setFixedData] = useState([]);
  const [fixedId, setFixedId] = useState(1);
  const [checkedAll, setCheckedAll] = useState(false);
  const [focusedItemId, setFocusedItemId] = useState(null);
  const [price, setPrice] = useState("");
  const fields = [
    "expense_date",
    "expense_desc",
    "expense_amount",
    "expense_payment",
    "expense_cat_nm",
  ];
  const deleteStatus = useSelector(
    (state) => state.myDetailList["fixedItemList"].deleteStatus
  );
  console.log("deleteStatus 변경됨:", deleteStatus);

  useEffect(() => {
    if (fixedItemList.length > 0) {
      setFixedData(
        fixedItemList.map((item) => ({
          ...item,
          isDisabled: false,
          isModified: false,
        }))
      );
    }
  }, [fixedItemList]);

  useEffect(() => {
    if (fixedData.length === 0 || fixedData.every((item) => !item.isDisabled)) {
      setFixedData((prevData) => [
        ...prevData,
        {
          expense_id: `expense_${fixedId}`,
          expense_date: `${date.slice(-2)}`,
          expense_amount: 0,
          isDisabled: true,
          isNew: true,
        },
      ]);
      setFixedId((prevId) => prevId + 1);
    }
    console.log("fixedData::::", fixedData);
  }, [fixedItemList, fixedData]);

  // 저장할 data
  const modifiedData = useMemo(() => {
    return fixedData.filter((item) => {
      const hasValidFields =
        Boolean(item.expense_amount) ||
        Boolean(item.expense_cat_nm) ||
        Boolean(item.expense_payment) ||
        Boolean(item.expense_desc);

      return (item.isModified || item.isNew) && hasValidFields;
    });
  }, [fixedData]);

  useEffect(() => {
    console.log("modifiedData::::", modifiedData);
    setFixedDataList(modifiedData);
  }, [modifiedData]);

  const handleUpdate = (newItem, id, key) => {
    console.log("newItem:::", newItem, id, key);
    setFixedData((prevData) =>
      prevData.map((item) =>
        item.expense_id === id
          ? { ...item, [key]: newItem, isModified: true, isDisabled: false }
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
      prev.includes(id)
        ? prev.filter((item_Id) => item_Id !== id)
        : [...prev, id]
    );
  };

  const handleCheckedAll = () => {
    if (checkedAll) {
      setCheckedItems([]);
    } else {
      const allIds = fixedData
        .filter((item) => !item.isDisabled)
        .map((item) => item.expense_id);
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
    console.log("체크된거???", checkedItems);
  }, [checkedItems, fixedData]);

  useEffect(() => {
    console.log("deleteStatus?????????????????", deleteStatus);
    if (deleteStatus === "succeeded") {
      console.log("여기 탓니?");
      setFixedData((prevData) =>
        prevData.filter((item) => !checkedItems.includes(item.expense_id))
      );
      setCheckedItems([]);
    }
    console.log("없어졌니?", fixedData);
  }, [deleteStatus]);

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

  return (
    <div className="modal-body">
      <h2 className="modal-title">고정항목 관리하기</h2>
      <table className="table table-hover table-sm" bordered hover>
        <colgroup>
          <col width="8%" />
          <col width="12%" />
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
          {fixedData.length > 0 ? (
            fixedData.map((item, i) => (
              <tr key={item.expense_id}>
                <td>
                  <input
                    type="checkbox"
                    checked={checkedItems.includes(item.expense_id)}
                    onChange={() => handleCheck(item.expense_id)}
                    disabled={item.isDisabled}
                  />
                </td>
                {fields.map((col, idx) =>
                  col === "expense_date" ? (
                    <CustomSelect
                      key={idx}
                      value={item[col]}
                      options={Array.from({ length: 31 }, (_, j) => ({
                        value: String(j + 1).padStart(2, "0"),
                        label: String(j + 1).padStart(2, "0"),
                      }))}
                      defaultValue={date.slice(-2)}
                      onChange={(value) =>
                        handleUpdate(value, item.expense_id, col)
                      }
                    />
                  ) : col === "expense_payment" ? (
                    <CustomSelect
                      key={idx}
                      value={item[col]}
                      options={cardList.map((list) => ({
                        value: list.card_id,
                        label: list.card_name,
                      }))}
                      noSelectValue="선택없음"
                      onChange={(value) =>
                        handleUpdate(value, item.expense_id, col)
                      }
                    />
                  ) : col === "expense_cat_nm" ? (
                    <CustomSelect
                      key={idx}
                      value={item[col]}
                      options={catList.map((list) => ({
                        value: list.cat_id,
                        label: list.category_nm,
                      }))}
                      noSelectValue="미분류"
                      onChange={(value) =>
                        handleUpdate(value, item.expense_id, col)
                      }
                    />
                  ) : (
                    <Input
                      key={idx}
                      ref={(el) =>
                        (inputRefs.current[i * fields.length + idx] = el)
                      }
                      onBlur={(e) =>
                        handleUpdate(e.target.innerText, item.expense_id, col)
                      }
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
            ))
          ) : (
            <tr>
              <td colSpan="6">No data available</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default MyFixedExpense;
