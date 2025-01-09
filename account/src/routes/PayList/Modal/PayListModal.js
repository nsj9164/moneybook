import { useState } from "react";
import { Nav, Modal, Button } from "react-bootstrap";
import MyCard from "./MyCard";
import MyCategory from "./MyCategory";
import MyFixedExpense from "./MyFixedExpense";

const PayListModal = ({show, onClose}) => {
    const [activeTab, setActiveTab] = useState(1);
    return (
        <div
            className="modal show"
            style={{ display: 'block', position: 'initial' }}
        >
            <Modal show={show} onHide={onClose}>
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
                        {activeTab === 1 && <MyFixedExpense />}
                        {activeTab === 2 && <MyCategory />}
                        {activeTab === 3 && <MyCard />}
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={onClose}>
                        닫기
                    </Button>
                    <Button variant="primary" onClick={onClose}>
                        저장하기
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    )
}

export default PayListModal