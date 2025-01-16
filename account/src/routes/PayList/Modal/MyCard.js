import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { cardListActions } from "../../../store/myDetailSlice";
import { selectText } from "../../../util/util";
import { Table, Form } from "react-bootstrap";
import { Input } from "../PayList";

function MyCard({ isLoggedIn, setCardDataList }) {
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
  }, [cardListStatus, cardList]);

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

    const modifiedData = cardData.filter(
      (item) => item.isModified || item.isNew
    );
    setCardDataList(modifiedData);
  }, [cardData, cardId]);

  const handleUpdate = (e, id) => {
    const newItem = e.target.innerText;
    setCardData((prevData) =>
      prevData.map((item) =>
        item.id === id
          ? { ...item, card_name: newItem, isModified: true }
          : item
      )
    );
  };

  useEffect(() => {
    if (focusedItemId !== null) {
      const focusedElement = inputRefs.current[focusedItemId];
      if (focusedElement) {
        selectText({ target: focusedElement });
      }
    }
  }, [focusedItemId]);

  const fields = ["card_company", "card_name", "card_type", "payment_due_date"];

  return (
    <div className="modal-body">
      <h2 className="modal-title">카드 관리하기</h2>
      <Table className="custom-table" bordered hover>
        <colgroup>
          <col width={"10%"} />
          <col width={"15%"} />
        </colgroup>
        <thead>
          <tr>
            <th>카드사</th>
            <th>카드명</th>
          </tr>
        </thead>
        <tbody>
          {cardListStatus === "succeeded" &&
            cardData.map((item, i) => (
              <tr key={i}>
                <Input
                  ref={(el) => (inputRefs.current[i] = el)}
                  onBlur={(e) => handleUpdate(e, item.id)}
                >
                  {item.card_name}
                </Input>
                <td>X</td>
              </tr>
            ))}
          {cardListStatus === "failed" && (
            <tr>
              <td colSpan="2">Error</td>
            </tr>
          )}
        </tbody>
      </Table>
    </div>
  );
}

export default MyCard;
