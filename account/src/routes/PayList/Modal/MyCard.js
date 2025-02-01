import { useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Input } from "../../../components/EditableCell";
import CustomSelect from "../../../components/SelectComponent/CustomSelect";
import { useAuth } from "../../../hooks/useAuth";
import { cardCompanyListActions } from "../../../store/features/myDetailList/myDetailListActions";
import {
  selectAllLists,
  selectAllStatuses,
} from "../../../store/features/myDetailList/myDetailListSelectors";
import { date, selectText } from "../../../util/util";

function MyCard({ setCardDataList, cardList }) {
  const dispatch = useDispatch();
  const inputRefs = useRef([]);
  const [cardData, setCardData] = useState([]);
  const [cardId, setCardId] = useState(1);
  const [checkedAll, setCheckedAll] = useState(false);
  const [checkedItems, setCheckedItems] = useState([]);
  const [focusedItemId, setFocusedItemId] = useState(null);
  const { cardCompanyList } = useSelector(selectAllLists);
  const { cardCompanyListStatus } = useSelector(selectAllStatuses);
  const { isLoggedIn } = useAuth();
  const fields = [
    "card_company",
    "card_name",
    "card_type",
    "payment_due_date",
    "usage_period_start",
    "usage_period_end",
    "active_status",
  ];

  useEffect(() => {
    if (cardList.length > 0) {
      setCardData(
        cardList.map((item) => ({
          ...item,
          isDisabled: false,
          isModified: false,
        }))
      );
    }
  }, [cardList]);

  useEffect(() => {
    if (
      cardData.length === 0 ||
      cardData.every(
        (item) => item.card_company && item.card_company !== undefined
      )
    ) {
      setCardData((prevCardData) => [
        ...prevCardData,
        { card_id: `card-${cardId}`, isDisabled: true, isNew: true },
      ]);
      setCardId((id) => id + 1);
    }
  }, [cardData, cardId]);

  const modifiedData = useMemo(() => {
    return cardData.filter((item) => item.isModified || item.isNew);
  }, [cardData]);

  useEffect(() => {
    setCardDataList(modifiedData);
  }, [modifiedData]);

  useEffect(() => {
    if (isLoggedIn) {
      if (cardCompanyListStatus === "idle") {
        dispatch(cardCompanyListActions.fetchData());
      }
    }
  }, [isLoggedIn, cardCompanyListStatus, dispatch]);

  useEffect(() => {
    console.log("cardCompanyList:::", cardCompanyList);
  }, [cardCompanyList]);
  const handleUpdate = (e, id) => {
    const newItem = e.target.innerText;
    setCardData((prevData) =>
      prevData.map((item) =>
        item.cat_id === id
          ? { ...item, card_name: newItem, isModified: true }
          : item
      )
    );
    setCardId((id) => id + 1);
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
      const allIds = cardData
        .filter((item) => !item.isDisabled)
        .map((item) => item.id);
      setCheckedItems(allIds);
    }
    setCheckedAll(!checkedAll);
  };

  // 전체선택/해제
  useEffect(() => {
    checkedItems.length ===
      cardData.filter((item) => !item.isDisabled).length && cardData.length > 1
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

  useEffect(() => {
    if (focusedItemId !== null) {
      const focusedElement = inputRefs.current[focusedItemId];
      if (focusedElement) {
        selectText({ target: focusedElement });
      }
    }
  }, [focusedItemId]);

  return (
    <div className="modal-body">
      <h2 className="modal-title">카드 관리하기</h2>
      <table className="table table-hover">
        <colgroup>
          <col width={"10%"} />
          <col width={"15%"} />
          <col width={"15%"} />
          <col width={"10%"} />
          <col />
          <col width={"10%"} />
          <col width={"10%"} />
        </colgroup>
        <thead>
          <tr>
            <th>카드사</th>
            <th>카드명</th>
            <th>카드종류</th>
            <th>결제일</th>
            <th>이용기간</th>
            <th>사용중</th>
            <th>삭제</th>
          </tr>
        </thead>
        <tbody>
          {cardData.length > 0 ? (
            cardData.map((item, i) => (
              <tr key={i}>
                {fields.map((col, idx) => {
                  if (
                    col === "card_company" ||
                    col === "card_type" ||
                    col === "payment_due_date"
                  ) {
                    return (
                      <td key={idx}>
                        <select aria-label="Default select example">
                          {
                            col === "card_company" &&
                              (cardCompanyListStatus === "succeeded" ? (
                                <CustomSelect
                                  key={idx}
                                  value={item[col] || "선택"}
                                  options={cardCompanyList.map((list) => ({
                                    value: list.value,
                                    label: list.name,
                                  }))}
                                  defaultValue="0"
                                  onChange={(value) =>
                                    handleUpdate(value, item.expense_id, col)
                                  }
                                />
                              ) : (
                                <CustomSelect
                                  key={idx}
                                  value={item[col]}
                                  options={cardCompanyList.map((list) => ({
                                    value: list.value,
                                    label: list.name,
                                  }))}
                                  defaultValue="0"
                                  noSelectValue="미분류"
                                />
                              ))

                            // <option value="1">One</option>
                            // <option value="2">Two</option>
                            // <option value="3">Three</option>
                          }
                          {col === "card_type" && (
                            <CustomSelect
                              key={idx}
                              value={item[col]}
                              options={[
                                { value: "1", label: "신용카드" },
                                { value: "2", label: "체크카드" },
                              ]}
                            />
                          )}
                          {col === "payment_due_date" && (
                            <CustomSelect
                              key={idx}
                              value={item[col]}
                              options={Array.from({ length: 28 }, (_, j) => ({
                                value: String(j + 1).padStart(2, "0"),
                                label: String(j + 1).padStart(2, "0"),
                              }))}
                              defaultValue={date.slice(-2)}
                            />
                          )}
                        </select>
                      </td>
                    );
                  } else if (col === "active_status") {
                    return (
                      <td key={idx}>
                        <input
                          type="checkbox"
                          checked={checkedAll}
                          onChange={handleCheckedAll}
                        />
                      </td>
                    );
                  } else {
                    return (
                      <Input
                        ref={(el) => (inputRefs.current[i * 7 + idx] = el)}
                        onBlur={(e) => handleUpdate(e, item.card_id)}
                      >
                        {item[col]}
                      </Input>
                    );
                  }
                })}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="7">No data available</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default MyCard;
