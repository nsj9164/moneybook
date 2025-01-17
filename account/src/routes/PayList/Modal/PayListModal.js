import { useState } from "react";
import { Nav, Modal, Button } from "react-bootstrap";
import MyCard from "./MyCard";
import MyCategory from "./MyCategory";
import MyFixedExpense from "./MyFixedExpense";
import "../../../App.modal.css";
import { useDispatch } from "react-redux";
import { fixedItemListActions, saveData } from "../../../store/myDetailSlice";

const PayListModal = ({ show, onClose, isLoggedIn }) => {
  const dispatch = useDispatch();
  const [activeTab, setActiveTab] = useState(1);
  const [fixedDataList, setFixedDataList] = useState([]);
  const [catDataList, setCatDataList] = useState([]);
  const [cardDataList, setCardDataList] = useState([]);

  const handleSave = () => {
    if (activeTab === 1) {
      console.log("저장하기 버튼 클릭1", fixedDataList);
      dispatch(fixedItemListActions.saveData(fixedDataList));
    } else if (activeTab === 2) {
      console.log("저장하기 버튼 클릭2", catDataList);
      dispatch(cardListActions.saveData(catDataList));
    } else {
      console.log("저장하기 버튼 클릭3", cardDataList);
      dispatch(categoryListActions.saveData(cardDataList));
    }
  };
  return (
    <div
      className="modal show modal-container"
      style={{ display: "block", position: "initial" }}
    >
      <Modal
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
        show={show}
        onHide={onClose}
      >
        <Modal.Header closeButton>
          {/* <Modal.Title>Setting</Modal.Title> */}
          <Nav
            activeKey="/home"
            onSelect={(selectedKey) => alert(`selected ${selectedKey}`)}
          >
            <Nav.Item>
              <Nav.Link onClick={() => setActiveTab(1)} className="nav-link">
                고정금액관리
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link onClick={() => setActiveTab(2)} className="nav-link">
                분류관리
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link onClick={() => setActiveTab(3)} className="nav-link">
                카드관리
              </Nav.Link>
            </Nav.Item>
          </Nav>
        </Modal.Header>
        <Modal.Body>
          <div>
            {activeTab === 1 && (
              <MyFixedExpense isLoggedIn setFixedDataList={setFixedDataList} />
            )}
            {activeTab === 2 && (
              <MyCategory isLoggedIn setCatDataList={setCatDataList} />
            )}
            {activeTab === 3 && (
              <MyCard isLoggedIn setCardDataList={setCardDataList} />
            )}
          </div>
        </Modal.Body>
        <Modal.Footer className="modal-footer-custom">
          <div className="modal-summary-group">
            {activeTab === 1 && (
              <>
                <div className="modal-button-group-left">
                  <Button
                    variant="outline-dark"
                    size="sm"
                    className="cursor_pointer"
                  >
                    선택삭제
                  </Button>
                </div>
                <div className="modal-summary-item item1">
                  <div>월 고정금액 합계</div>
                  <div className="font-bold">123</div>
                </div>
              </>
            )}
            <div className="modal-button-group-right">
              <Button variant="primary" onClick={handleSave}>
                저장하기
              </Button>
              <Button variant="secondary" onClick={onClose}>
                닫기
              </Button>
            </div>
          </div>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default PayListModal;
