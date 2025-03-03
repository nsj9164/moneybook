import { useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import TableEmptyRow from "../../../components/Table/TableEmptyRow";
import { useAuth } from "../../../hooks/useAuth";
import useFetchLists from "../../../hooks/useFetchLists";
import { cardListActions } from "../../../store/features/myDetailList/myDetailListActions";
import { getCardBillingPeriod } from "../../../util/payDateUtils";
import { date, selectText } from "../../../util/util";
import MyCardTable from "./MyCardTable";

function MyCard({ setCardDataList }) {
  const dispatch = useDispatch();
  const {
    lists: { cardList },
    statuses: { cardListStatus },
  } = useFetchLists(["cardList"]);
  const { isLoggedIn } = useAuth();
  const [cardData, setCardData] = useState([]);
  const [cardId, setCardId] = useState(1);
  const [focusedItemId, setFocusedItemId] = useState(null);
  const [visibleOverlay, setVisibleOverlay] = useState(null);
  const [isButtonHovered, setIsButtonHovered] = useState(false);

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
      cardData.every((item) => item.card_name && item.card_name !== undefined)
    ) {
      setCardData((prevCardData) => [
        ...prevCardData,
        {
          card_id: `card-${cardId}`,
          card_type: "1",
          payment_due_date: "01",
          usage_period_start: "17",
          usage_period_end: "16",
          active_status: 1,
          isDisabled: true,
          isNew: true,
        },
      ]);
      setCardId((id) => id + 1);
    }
  }, [cardData, cardId]);

  const modifiedData = useMemo(() => {
    return cardData.filter((item) => {
      const hasValidFields =
        Boolean(item.card_company) || Boolean(item.card_name);
      return (item.isModified || item.isNew) && hasValidFields;
    });
  }, [cardData]);

  useEffect(() => {
    setCardDataList(modifiedData);
  }, [modifiedData]);

  const handleUpdate = (newItem, id, col) => {
    setCardData((prevData) =>
      prevData.map((item) =>
        item.card_id === id
          ? { ...item, [col]: newItem, isDisabled: false, isModified: true }
          : item
      )
    );
    setCardId((id) => id + 1);
  };

  useEffect(() => {
    if (focusedItemId !== null) {
      const focusedElement = inputRefs.current[focusedItemId];
      if (focusedElement) {
        selectText({ target: focusedElement });
      }
    }
  }, [focusedItemId]);

  useEffect(() => {
    if (!isButtonHovered && visibleOverlay) {
      setVisibleOverlay(null);
    }
  }, [isButtonHovered]);

  const handlePaymentPeriod = (value, id) => {
    const period = getCardBillingPeriod(Number(value));
    setCardData((prevData) =>
      prevData.map((item) =>
        item.card_id === id
          ? {
              ...item,
              payment_due_date: value,
              usage_period_start: `${period.start}`,
              usage_period_end: `${period.end}`,
            }
          : item
      )
    );
  };

  // 삭제
  const handleDelete = (id, isDisabled) => {
    if (isDisabled) {
      setVisibleOverlay(true);
    } else {
      if (cardList.some((item) => item.card_id === id)) {
        dispatch(cardListActions.deleteData([id]));
      }
      setCardData((prevData) => prevData.filter((item) => item.card_id !== id));
    }
  };

  return (
    <div className="modal-body">
      <h2 className="modal-title">카드 관리하기</h2>
      <div className="table-container">
        <table className="table table-hover table-sm no-margin" bordered hover>
          <colgroup>
            <col width="12%" />
            <col />
            <col width="13%" />
            <col width="10%" />
            <col width="25%" />
            <col width="10%" />
            <col width="10%" />
          </colgroup>
          <thead className="scrollable-thead">
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
              cardData.map((item, i) =>
                item ? (
                  <tr key={item.card_id}>
                    <MyCardTable
                      fields={fields}
                      item={item}
                      handleUpdate={handleUpdate}
                      handlePaymentPeriod={handlePaymentPeriod}
                      visibleOverlay={visibleOverlay}
                      setVisibleOverlay={setVisibleOverlay}
                      handleDelete={handleDelete}
                      setIsButtonHovered={setIsButtonHovered}
                    />
                  </tr>
                ) : null
              )
            ) : (
              <TableEmptyRow colSpan={7} message="No data available" />
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default MyCard;
