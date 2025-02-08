import { useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import MyCardTable from "../../../components/Modal/MyCardTable";
import { useAuth } from "../../../hooks/useAuth";
import {
  cardCompanyListActions,
  cardListActions,
} from "../../../store/features/myDetailList/myDetailListActions";
import {
  selectAllLists,
  selectAllStatuses,
} from "../../../store/features/myDetailList/myDetailListSelectors";
import { getCardBillingPeriod } from "../../../util/payDateUtils";
import { date, selectText } from "../../../util/util";

function MyCard({ setCardDataList, cardList }) {
  const dispatch = useDispatch();
  const { isLoggedIn } = useAuth();
  const [cardData, setCardData] = useState([]);
  const [cardId, setCardId] = useState(1);
  const [focusedItemId, setFocusedItemId] = useState(null);
  const { cardCompanyList } = useSelector(selectAllLists);
  const { cardCompanyListStatus } = useSelector(selectAllStatuses);
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
      console.log("cardData::::::", cardData);
      setCardData((prevCardData) => [
        ...prevCardData,
        {
          card_id: `card-${cardId}`,
          card_type: "1",
          payment_due_date: "01",
          usage_period_start: "17",
          usage_period_end: "16",
          isDisabled: true,
          isNew: true,
        },
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

  const handleUpdate = (newItem, id, col) => {
    console.log("newItem:::", newItem);
    setCardData((prevData) =>
      prevData.map((item) =>
        item.card_id === id
          ? { ...item, card_name: newItem, isDisabled: false, isModified: true }
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
    console.log("isButtonHovered:::", isButtonHovered);
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
      <table className="table table-hover table-sm" bordered hover>
        <colgroup>
          <col width={"12%"} />
          <col />
          <col width={"13%"} />
          <col width={"10%"} />
          <col width={"25%"} />
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
            cardData.map((item, i) => {
              return item ? (
                <tr key={item.card_id}>
                  <MyCardTable
                    fields={fields}
                    item={item}
                    handleUpdate={handleUpdate}
                    handlePaymentPeriod={handlePaymentPeriod}
                    cardCompanyList={cardCompanyList}
                    visibleOverlay={visibleOverlay}
                    setVisibleOverlay={setVisibleOverlay}
                    handleDelete={handleDelete}
                    setIsButtonHovered={setIsButtonHovered}
                  />
                </tr>
              ) : null;
            })
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
