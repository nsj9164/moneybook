import { useEffect, useMemo, useState } from "react";
import MyCard from "./MyCard";
import MyCategory from "./MyCategory";
import MyFixedExpense from "./MyFixedExpense";
import "../../../styles/App.modal.css";
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
import { Overlay } from "../../../components/Overlay";
import { useAuth } from "../../../hooks/useAuth";
import tabConfigs from "../../../config/tabConfigs";
import TabContent from "../../../components/Modal/TabContent";
import AlertModal from "../../../components/AlertModal";

const PayListModal = ({ show, onClose }) => {
  // Modal hide일때 렌더링 방지
  if (!show) return null;

  const dispatch = useDispatch();
  const { isLoggedIn } = useAuth();

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

  const [visibleOverlay, setVisibleOverlay] = useState(false);
  const [isButtonHovered, setIsButtonHovered] = useState(false);
  const [showAlertModal, setShowAlertModal] = useState(false);

  // 데이터 초기 로드
  useEffect(() => {
    if (isLoggedIn) {
      fixedItemListStatus === "idle" &&
        dispatch(fixedItemListActions.fetchData());
      categoryListStatus === "idle" &&
        dispatch(categoryListActions.fetchData());
      cardListStatus === "idle" && dispatch(cardListActions.fetchData());
    }
  }, [isLoggedIn, dispatch]);

  // [저장 버튼 클릭 시] 데이터 저장
  const handleSave = () => {
    const dataMap = {
      1: { action: fixedItemListActions.saveData, data: fixedDataList },
      2: { action: categoryListActions.saveData, data: catDataList },
      3: { action: cardListActions.saveData, data: cardDataList },
    };

    const { action, data } = dataMap[activeTab];

    console.log(`저장하기 버튼 클릭${activeTab}`, data);
    if (data.length > 0) {
      // 저장 처리 후 AlertModal 띄우기
      dispatch(action(data)).then(() => {
        setShowAlertModal(true);
      });
    } else {
      setVisibleOverlay(true);
    }
  };

  // 버튼 hover 상태에 따른 Overlay hide 처리
  useEffect(() => {
    if (!isButtonHovered && visibleOverlay) {
      setVisibleOverlay(null);
    }
  }, [isButtonHovered]);

  // 현재 활성화된 탭의 설정 가져오기
  const currentTabConfigs = useMemo(() => {
    return tabConfigs({
      fixedItemListStatus,
      categoryListStatus,
      cardListStatus,
      fixedItemListSaveStatus,
      categoryListSaveStatus,
      cardListSaveStatus,
      fixedItemList,
      categoryList,
      cardList,
      setFixedDataList,
      setCatDataList,
      setCardDataList,
    });
  }, [fixedItemListStatus, categoryListStatus, cardListStatus]);

  const MemoizedComponent = useMemo(() => {
    return currentTabConfigs[activeTab]?.component || null;
  }, [currentTabConfigs, activeTab]);

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
          {MemoizedComponent ? (
            <TabContent
              {...currentTabConfigs[activeTab]}
              setShowAlertModal={setShowAlertModal}
            />
          ) : (
            <div>로딩중...</div>
          )}
        </div>
        <div className="modal-footer">
          <div className="modal-summary-group">
            <div className="modal-button-group-left">
              {activeTab === 1 && (
                <button className="cursor_pointer">선택삭제</button>
              )}
            </div>
            <div className="modal-button-group-right">
              <div className="popover-wrapper">
                <button
                  className="btn-save"
                  onClick={handleSave}
                  onMouseEnter={() => setIsButtonHovered(true)}
                  onMouseLeave={() => setIsButtonHovered(false)}
                >
                  저장하기
                </button>

                {visibleOverlay && (
                  <Overlay
                    overlayContent={"저장할 내용이 없습니다."}
                    setVisibleOverlay={setVisibleOverlay}
                  />
                )}
              </div>

              <button className="btn-close" onClick={onClose}>
                닫기
              </button>
            </div>
          </div>
        </div>
      </div>
      {showAlertModal && (
        <AlertModal
          message="저장에 성공했습니다!"
          onClose={() => setShowAlertModal(false)}
        />
      )}
    </div>
  );
};

export default PayListModal;
