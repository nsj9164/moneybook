import { useEffect, useMemo, useState } from "react";
import "@/styles/App.modal.css";
import { useDispatch, useSelector } from "react-redux";
import {
  cardListActions,
  categoryListActions,
  fixedItemListActions,
} from "@/store/features/myDetailList/myDetailListActions";
import { Overlay } from "@/components/Overlay";
import { useAuth } from "@/hooks/auth/useAuth";
import tabConfigs from "@/config/tabConfigs";
import TabContent from "./TabContent";
import AlertModal from "@/components/AlertModal";

const PayListModal = ({ show, onClose }) => {
  // Modal hide일때 렌더링 방지
  if (!show) return null;
  const dispatch = useDispatch();
  const { isLoggedIn } = useAuth();
  const [activeTab, setActiveTab] = useState(1);

  // 저장용 data
  const [fixedDataList, setFixedDataList] = useState([]);
  const [catDataList, setCatDataList] = useState([]);
  const [cardDataList, setCardDataList] = useState([]);

  const [visibleOverlay, setVisibleOverlay] = useState(false);
  const [isButtonHovered, setIsButtonHovered] = useState(false);
  const [showAlertModal, setShowAlertModal] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [checkedItems, setCheckedItems] = useState([]);

  // 현재 활성화된 탭의 설정 가져오기
  const currentTabConfigs = tabConfigs({
    setFixedDataList,
    setCatDataList,
    setCardDataList,
    catDataList,
    checkedItems,
    setCheckedItems,
  })[activeTab];

  // [저장 버튼 클릭 시] 데이터 저장
  const handleSave = async () => {
    try {
      const dataMap = {
        1: {
          action: fixedItemListActions.saveData,
          data: fixedDataList,
          setData: (updateItem) => setFixedDataList(updateItem),
        },
        2: {
          action: categoryListActions.saveData,
          data: catDataList,
          setData: (updateItem) => setCatDataList(updateItem),
        },
        3: {
          action: cardListActions.saveData,
          data: cardDataList,
          setData: (updateItem) => setCardDataList(updateItem),
        },
      };

      const { action, data, setData } = dataMap[activeTab];
      const idField = currentTabConfigs?.idField;

      console.log(`저장하기 버튼 클릭${activeTab}`, data);

      if (data.length === 0) {
        console.log("저장할 데이터 없음");
        setVisibleOverlay(true);
        return;
      }

      const resultAction = await dispatch(action(data));

      if (resultAction.meta.requestStatus === "fulfilled") {
        console.log("✅ 저장 성공:", resultAction.payload);
        setData(resultAction.payload);
        setShowAlertModal(true);
        setAlertMessage("저장되었습니다.");
        // dispatch(updateItem({ listType: activeTab, items: updatedData }));
      } else {
        throw new Error("서버 저장 실패");
      }
    } catch (error) {
      console.error("❌ 저장 실패:", error);
    }
  };

  const handleDelete = () => {
    if (checkedItems.length > 0) {
      dispatch(fixedItemListActions.deleteData(checkedItems))
        .then((resultAction) => {
          if (resultAction.meta.requestStatus === "fulfilled") {
            setShowAlertModal(true);
            setAlertMessage("삭제되었습니다.");

            setCheckedItems([]);
          }
        })
        .catch((error) => {
          console.log("삭제 실패:", error);
        });
    } else {
      console.log("삭제할 데이터 없음");
      setVisibleOverlay(true);
    }
  };

  // 버튼 hover 상태에 따른 Overlay hide 처리
  useEffect(() => {
    if (!isButtonHovered && visibleOverlay) {
      setVisibleOverlay(null);
    }
  }, [isButtonHovered]);

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
        <TabContent
          component={currentTabConfigs.component}
          setShowAlertModal={setShowAlertModal}
        />
        <div className="modal-footer">
          <div className="modal-summary-group">
            <div className="modal-button-group-left">
              {activeTab === 1 && (
                <button className="cursor_pointer" onClick={handleDelete}>
                  선택삭제
                </button>
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
          message={alertMessage}
          onClose={() => setShowAlertModal(false)}
        />
      )}
    </div>
  );
};

export default PayListModal;
