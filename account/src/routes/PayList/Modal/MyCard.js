import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { cardListActions } from "../../../store/myDetailSlice";
import { selectText } from "../../../util/util";
import { Table, Form } from "react-bootstrap";
import { Input } from "../PayList";

function MyCard({ isLoggedIn }) {
  const dispatch = useDispatch();
  const cardList = useSelector((state) => state.myDetailList.items);
  const cardListStatus = useSelector((state) => state.myDetailList.status);
  const inputRefs = useRef([]);
  const [cardData, setCardData] = useState([]);
  const [cardId, setCardId] = useState(1);
  const [checkedAll, setCheckedAll] = useState(false);
  const [checkedItems, setCheckedItems] = useState([]);
  const [focusedItemId, setFocusedItemId] = useState(null);

  useEffect(() => {
    if (isLoggedIn && cardListStatus === "idle") {
      dispatch(cardListActions.fetchData());
    }
    console.log("cardList1:::", cardList);
  }, [cardListStatus, dispatch]);

  useEffect(() => {
    if (cardListStatus === "succeeded" && cardList.length > 0) {
      setCardData(
        cardList.map((item) => ({
          ...item,
          isDisabled: false,
          isModified: false,
        }))
      );
    }
    console.log("Fixed cardList current state:", cardList);
  }, [cardListStatus, cardList]);

  useEffect(() => {
    if (cardData.length >= 0) {
      const empty = cardData.filter((item) => !item.isDisabled);
      if (empty.length === cardData.length) {
        setCardData((prevCardData) => [
          ...prevCardData,
          { card_id: `card-${cardId}`, isDisabled: true, isModified: true },
        ]);
        setCardId((id) => id + 1);
      }
    }
    console.log("cardData:::", cardData);
  }, [cardData, cardId]);

  const handleUpdate = (e, id, key) => {
    const newItem = e.target.innerText;
    setCardData((prevData) =>
      prevData.map((item) =>
        item.id === id ? { ...item, [key]: newItem, isModified: true } : item
      )
    );
  };

  const setInitial = (item, index) => {
    if (item.isDisabled) {
      setCardData(
        cardData.map((data) =>
          item.id === data.id
            ? {
                ...data,
                payment_due_date: 1,
                usage_period_start: 17,
                usage_period_end: 16,
                active_status: 1,
              }
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

  const handleCheckAll = () => {
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

  useEffect(() => {
    if (focusedItemId !== null) {
      const focusedElement = inputRefs.current[focusedItemId];
      if (focusedElement) {
        selectText({ target: focusedElement });
      }
    }
  }, [focusedItemId]);

  const fields = [
    "card_company",
    "card_name",
    "card_type",
    "payment_due_date",
    "usage_period",
    "active_status",
  ];

  return (
    <div className="modal-body">
      <h2 className="modal-title">카드 관리하기</h2>
      <Table className="custom-table" bordered hover>
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
          {cardListStatus === "succeeded" &&
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
                        <Form.Select aria-label="Default select example">
                          {col === "card_company" && (
                            <>
                              <option value="1">One</option>
                              <option value="2">Two</option>
                              <option value="3">Three</option>
                            </>
                          )}
                          {col === "card_type" && (
                            <>
                              <option value="1">신용카드</option>
                              <option value="2">체크카드</option>
                            </>
                          )}
                          {col === "payment_due_date" &&
                            Array.from({ length: 28 }, (_, j) => (
                              <option
                                key={j}
                                value={String(j + 1).padStart(2, "0") + "일"}
                              >
                                {String(j + 1).padStart(2, "0")}
                              </option>
                            ))}
                        </Form.Select>
                      </td>
                    );
                  } else if (col === "active_status") {
                    return (
                      <td key={idx}>
                        <input
                          type="checkbox"
                          checked={checkedAll}
                          onChange={handleCheckAll}
                        />
                      </td>
                    );
                  } else {
                    return (
                      <Input
                        ref={(el) => (inputRefs.current[i * 7 + idx] = el)}
                        onBlur={(e) => handleUpdate(e, item.id, col)}
                        onFocus={(e) => setInitial(item, i * 7 + idx)}
                      >
                        {item[col]}
                      </Input>
                    );
                  }
                })}
              </tr>
            ))}

          {cardListStatus === "failed" && (
            <tr>
              <td colspan="7">Error</td>
            </tr>
          )}
        </tbody>
      </Table>
    </div>
  );
}

export default MyCard;
