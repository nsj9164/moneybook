import { useState } from "react";
import MyCard from "./MyCard";
import MyCategory from "./MyCategory";
import MyFixedExpense from "./MyFixedExpense";
import "../../../App.modal.css";
import { useDispatch } from "react-redux";
import {
  cardListActions,
  categoryListActions,
  fixedItemListActions,
} from "../../../store/myDetailSlice";

const PayListModal = ({ show, onClose, isLoggedIn }) => {
  const dispatch = useDispatch();
  const [activeTab, setActiveTab] = useState(1);
  const [fixedDataList, setFixedDataList] = useState([]);
  const [catDataList, setCatDataList] = useState([]);
  const [cardDataList, setCardDataList] = useState([]);

  const saveStatus = useSelector((state) => state.myDetailList.saveStatus);

  const handleSave = () => {
    if (activeTab === 1) {
      console.log("저장하기 버튼 클릭1", fixedDataList);
      dispatch(fixedItemListActions.saveData(fixedDataList));
    } else if (activeTab === 2) {
      console.log("저장하기 버튼 클릭2", catDataList);
      dispatch(categoryListActions.saveData(catDataList));
      // 여기에 저장 처리 추가
    } else {
      console.log("저장하기 버튼 클릭3", cardDataList);
      dispatch(cardListActions.saveData(cardDataList));
      // 여기에 저장 처리 추가
    }

    if (saveStatus === "succeeded") {
      alert("저장되었습니다.");
    } else {
      alert("오류가 발생했습니다.");
    }
  };

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
          {activeTab === 1 && (
            <MyFixedExpense
              isLoggedIn
              setFixedDataList={setFixedDataList}
              saveStatus
            />
          )}
          {activeTab === 2 && (
            <MyCategory isLoggedIn setCatDataList={setCatDataList} saveStatus />
          )}
          {activeTab === 3 && (
            <MyCard isLoggedIn setCardDataList={setCardDataList} saveStatus />
          )}
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
