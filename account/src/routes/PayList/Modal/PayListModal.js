import { useState } from "react";
import { Nav, Modal, Button } from "react-bootstrap";
import MyCard from "./MyCard";
import MyCategory from "./MyCategory";
import MyFixedExpense from "./MyFixedExpense";
import "../../../App.modal.css";

const PayListModal = ({ show, onClose, isLoggedIn }) => {
  const [activeTab, setActiveTab] = useState(1);
  return (
    <div
      className="modal show"
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
              <Nav.Link onClick={() => setActiveTab(1)}>고정금액관리</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link onClick={() => setActiveTab(2)}>분류관리</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link onClick={() => setActiveTab(3)}>카드관리</Nav.Link>
            </Nav.Item>
          </Nav>
        </Modal.Header>
        <Modal.Body>
          <div>
            {activeTab === 1 && <MyFixedExpense isLoggedIn />}
            {activeTab === 2 && <MyCategory isLoggedIn />}
            {activeTab === 3 && <MyCard isLoggedIn />}
          </div>
        </Modal.Body>
        <Modal.Footer>
          {activeTab === 1 && (
            <div className="modal-summary-group">
              <div className="modal-button-group">
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
              <Button variant="primary" onClick={onClose}>
                저장하기
              </Button>
              <Button variant="secondary" onClick={onClose}>
                닫기
              </Button>
            </div>
          )}
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default PayListModal;
