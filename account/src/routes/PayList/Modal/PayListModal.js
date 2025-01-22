import { useEffect, useState } from "react";
import MyCard from "./MyCard";
import MyCategory from "./MyCategory";
import MyFixedExpense from "./MyFixedExpense";
import "../../../App.modal.css";
import { useDispatch, useSelector } from "react-redux";
import {
  cardListActions,
  categoryListActions,
  fixedItemListActions,
} from "../../../store/features/myDetailList/myDetailListActions";
import {
  selectAllLists,
  selectAllSaveStatuses,
  selectAllStatuses,
} from "../../../store/features/myDetailList/myDetailListSelectors";

const PayListModal = ({ show, onClose, isLoggedIn }) => {
  const dispatch = useDispatch();
  const [activeTab, setActiveTab] = useState(1);
  const [fixedDataList, setFixedDataList] = useState([]);
  const [catDataList, setCatDataList] = useState([]);
  const [cardDataList, setCardDataList] = useState([]);

  const { fixedItemList, categoryList, cardList } = useSelector(selectAllLists);
  const { fixedItemListStatus, categoryListStatus, cardListStatus } =
    useSelector(selectAllStatuses);
  const {
    fixedItemListSaveStatus,
    categoryListSaveStatus,
    cardListSaveStatus,
  } = useSelector(selectAllSaveStatuses);

  useEffect(() => {
    if (isLoggedIn) {
      if (fixedItemListStatus === "idle") {
        dispatch(fixedItemListActions.fetchData());
      }
      if (categoryListStatus === "idle") {
        dispatch(categoryListActions.fetchData());
      }
      if (cardListStatus === "idle") {
        dispatch(cardListActions.fetchData());
      }
    }
  }, [
    isLoggedIn,
    fixedItemListStatus,
    categoryListStatus,
    cardListStatus,
    dispatch,
  ]);

  useEffect(() => {
    console.log("categoryList:::////", categoryList);
  }, [categoryList]);

  const handleSave = () => {
    const dataMap = {
      1: { action: fixedItemListActions.saveData, data: fixedDataList },
      2: { action: categoryListActions.saveData, data: catDataList },
      3: { action: cardListActions.saveData, data: cardDataList },
    };

    const { action, data } = dataMap[activeTab];

    console.log(`저장하기 버튼 클릭${activeTab}`, data);
    dispatch(action(data));
  };

  // useEffect(() => {
  //   const saveStatusMap = {
  //     1: useSelector((state) => state.myDetailList["fixedItemList"].saveStatus),
  //     2: useSelector((state) => state.myDetailList["categoryList"].saveStatus),
  //     3: useSelector((state) => state.myDetailList["cardList"].saveStatus),
  //   };

  //   const activeSaveStatus = saveStatusMap[activeTab];

  //   if (activeSaveStatus === "succeeded") {
  //     alert("저장되었습니다.");
  //   } else {
  //     alert("오류가 발생하였습니다.");
  //   }
  // }, [
  //   fixedItemListSaveStatus,
  //   categoryListSaveStatus,
  //   cardListSaveStatus,
  //   activeTab,
  // ]);

  if (!show) return null;

  return (
    <div
      className="modal-container"
      style={{ display: show ? "flex" : "none" }}
    >
      <div className="modal-overlay" onClick={onClose}></div>
      <div className="modal-content">
        <div className="modal-header">
          <div className="nav-tabs">
            <button
              className={`nav-link ${activeTab === 1 ? "active" : ""}`}
              onClick={() => setActiveTab(1)}
            >
              고정금액관리
            </button>
            <button
              className={`nav-link ${activeTab === 2 ? "active" : ""}`}
              onClick={() => setActiveTab(2)}
            >
              분류관리
            </button>
            <button
              className={`nav-link ${activeTab === 3 ? "active" : ""}`}
              onClick={() => setActiveTab(3)}
            >
              카드관리
            </button>
          </div>
          <button className="modal-close" onClick={onClose}>
            &times;
          </button>
        </div>
        <div className="modal-body">
          {activeTab === 1 &&
            (fixedItemListStatus === "succeeded" ? (
              <MyFixedExpense
                setFixedDataList={setFixedDataList}
                fixedItemList={fixedItemList}
                catList={categoryList}
                cardList={cardList}
              />
            ) : fixedItemListStatus === "failed" ? (
              <div>Error loading fixed expense list</div>
            ) : (
              <div>Loading...</div>
            ))}
          {activeTab === 2 &&
            (categoryListStatus === "succeeded" ? (
              <MyCategory
                setCatDataList={setCatDataList}
                catList={categoryList}
              />
            ) : categoryListStatus === "failed" ? (
              <div>Error loading fixed expense list</div>
            ) : (
              <div>Loading...</div>
            ))}
          {activeTab === 3 &&
            (cardListStatus === "succeeded" ? (
              <MyCard setCardDataList={setCardDataList} cardList={cardList} />
            ) : cardListStatus === "failed" ? (
              <div>Error loading fixed expense list</div>
            ) : (
              <div>Loading...</div>
            ))}
        </div>
        <div className="modal-footer">
          <div className="modal-summary-group">
            {activeTab === 1 && (
              <div className="modal-button-group-left">
                <button className="cursor_pointer">선택삭제</button>
              </div>
            )}
            <div className="modal-button-group-right">
              <button className="btn-save" onClick={handleSave}>
                저장하기
              </button>
              <button className="btn-close" onClick={onClose}>
                닫기
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PayListModal;
