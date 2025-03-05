import { useEffect, useRef, useState } from "react";
import DatePicker from "react-datepicker";
import CustomSelect from "../../components/SelectComponent/CustomSelect";
import { Input } from "../../components/Table/EditableCell";
import useFetchLists from "../../hooks/useFetchLists";
import { nowCursor, restoreCursor, selectText } from "../../util/util";

function PayListRow({
  item,
  columns,
  index,
  checkedItems,
  handleUpdate,
  setInitial,
  handleCheck,
}) {
  const inputRefs = useRef([]);
  const {
    lists: { cardList, categoryList },
    statuses: { cardListStatus, categoryListStatus },
  } = useFetchLists(["cardList", "categoryList"]);
  const [price, setPrice] = useState("");
  const [focusedItemId, setFocusedItemId] = useState(null);

  // selectText() 호출
  useEffect(() => {
    if (focusedItemId !== null) {
      const focusedElement = inputRefs.current[focusedItemId];
      if (focusedElement) {
        selectText({ target: focusedElement });
      }
    }
  }, [focusedItemId]);

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

  return (
    <tr>
      <td>
        <input
          type="checkbox"
          checked={checkedItems.includes(item.id)}
          onChange={() => handleCheck(item.id)}
          disabled={item.isDisabled}
        />
      </td>
      {Object.keys(columns)
        .filter((col) => col !== "")
        .map((col, idx) =>
          col === "date" ? (
            <td key={col}>
              <DatePicker
                selected={item[col] ? new Date(item[col]) : new Date()}
                onKeyDown={(e) => e.preventDefault()}
                onChange={(date) =>
                  handleUpdate(format(date, "yyyy-MM-dd"), item.id, col)
                }
                onFocus={(e) => setInitial(item, index * 7 + idx)}
                dateFormat="yyyy-MM-dd"
                className="input_date"
              />
            </td>
          ) : col === "cat_id" ? (
            <CustomSelect
              key={idx}
              value={item[col]}
              options={categoryList?.map((list) => ({
                value: list.cat_id,
                label: list.category_nm,
              }))}
              noSelectValue="미분류"
              onFocus={(e) => setInitial(item, index * 7 + idx)}
              onChange={(value) => handleUpdate(value, item.id, "cat_id")}
            />
          ) : col === "card_id" ? (
            <CustomSelect
              key={idx}
              value={item[col]}
              options={cardList?.map((list) => ({
                value: list.card_id,
                label: list.card_name,
              }))}
              noSelectValue="선택없음"
              onFocus={(e) => setInitial(item, index * 7 + idx)}
              onChange={(value) => handleUpdate(value, item.id, "card_id")}
            />
          ) : (
            <Input
              key={col}
              ref={(el) => (inputRefs.current[index * 7 + idx] = el)}
              onBlur={(e) => handleUpdate(e.target.innerText, item.id, col)}
              onKeyDown={(e) => handleKeyDown(e, (index + 1) * 7 + idx, col)}
              onFocus={(e) => setInitial(item, index * 7 + idx)}
              onInput={(e) => handleInput(e, col)}
            >
              {item[col]}
            </Input>
          )
        )}
    </tr>
  );
}
export default PayListRow;
