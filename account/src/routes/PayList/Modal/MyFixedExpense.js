import { useEffect, useState } from "react";
import { Table, Button, OverlayTrigger, Popover } from "react-bootstrap"

function MyFixedExpense() {
    const [checkedAll, setCheckedAll] = useState(false);
    const [checkedItems, setCheckedItems] = useState([]);

    // 체크항목
    const handleCheck = (id) => {
        setCheckedItems((prev) =>
            prev.includes(id) ? prev.filter((itemId) => itemId !== id) : [...prev, id]
        )
    }

    // 전체선택/해제
    const handleCheckedAll = () => {
        if(checkedAll) {
            setCheckedItems([]);
        } else {
            const allIds = tempData.filter(item => !item.isDisabled).map(item => item.id);
            setCheckedItems(allIds);
        }
        setCheckedAll(!checkedAll);
    }

    // 전체선택/해제
    useEffect(() => {
        (checkedItems.length === tempData.filter(item => !item.isDisabled).length && tempData.length > 1) ? setCheckedAll(true) : setCheckedAll(false)
        console.log("checkedItems:::", checkedItems)
    }, [checkedItems])

    return (
        <div>
            <h2>고정항목 관리하기</h2>
            <Table bordered hover>
                <colgroup>
                    <col width={"5%"} />
                    <col width={"10%"} />
                    <col width={"10%"} />
                    <col />
                    <col width={"12%"} />
                    <col width={"12%"} />
                    <col width={"15%"} />
                    <col width={"15%"} />
                </colgroup>
                <thead>
                    <tr>
                        <th><input type="checkbox" checked={checkedAll} onChange={handleCheckedAll} /></th>
                        <th>발생일</th>
                        <th>사용내역</th>
                        <th>현금</th>
                        <th>카드</th>
                        <th>출금통장</th>
                        <th>분류</th>
                        <th>태그</th>
                    </tr>
                </thead>
                <tbody>
                    
                    {payListStatus === 'succeeded' && (
                        tempData.map((item, i) => !item.isDeleted ? (
                                <tr key={i}>
                                    <td><input type="checkbox" checked={checkedItems.includes(item.id)} onChange={() => handleCheck(item.id)} disabled={item.isDisabled} /></td>
                                    {columns.map((col, idx) => (
                                        col === "date" ? (
                                            <td>
                                                <DatePicker
                                                    key={col}
                                                    selected={item[col] ? new Date(item[col]) : new Date()}
                                                    onKeyDown={(e) => {e.preventDefault();}}
                                                    onChange={(date) => handleUpdate(date, item.id, col)}
                                                    onFocus={(e) => setInitial(item, i * 7 + idx)}
                                                    dateFormat="yyyy-MM-dd"
                                                    className="input_date" />
                                            </td>
                                        ) : (
                                            <Input
                                                key={col}
                                                ref={el => inputRefs.current[i * 7 + idx] = el}
                                                onBlur={(e) => handleUpdate(e, item.id, col)}
                                                onKeyDown={(e) => handleKeyDown(e, (i + 1) * 7 + idx, col)}
                                                onFocus={(e) => setInitial(item, i * 7 + idx)}
                                                onInput={(e) => handleInput(e, col)}>
                                                    {item[col]}
                                            </Input>
                                        )
                                    ))}
                                </tr>
                            ) : null)
                    )}
                    
                    {payListStatus === 'failed' && (
                        <tr>
                            <td colspan="8">Error</td>
                        </tr>
                    )}
                </tbody>
            </Table>

            <div className="summary-group">
                <div className="button-group">
                    <Button variant="outline-dark" size="sm" disabled={checkedItems.length === 0} onClick={handleDelete} className="cursor_pointer">선택삭제</Button>
                    <Button variant="outline-dark" size="sm" disabled={checkedItems.length === 0} onClick={handleCopy} className="cursor_pointer">선택복사</Button>
                    <OverlayTrigger
                        trigger="click"
                        key="top"
                        placement="top"
                        overlay={
                            <Popover id={`popover-positioned-top`}>
                            <Popover.Header as="h3">카드분류선택</Popover.Header>
                            <Popover.Body>
                                <strong>Holy guacamole!</strong> Check this info.
                            </Popover.Body>
                            </Popover>
                        }
                        >
                        <Button variant="outline-dark" size="sm" disabled={checkedItems.length === 0} className="cursor_pointer">카드선택</Button>
                    </OverlayTrigger>
                    <Button variant="outline-dark" size="sm" onClick={handleModal} className="cursor_pointer">고정금액</Button>
                    <PayListModal show={isModalOpen} onClose={handleModal} />
                </div>
                <div className="summary-item item1">
                    <div>지출합계</div>
                    <div className="font-bold">{expense}</div>
                </div>
                <div className="summary-item item2">
                    <div>실지출합계</div>
                    <div className="font-bold">{realExpense}</div>
                </div>
                <div className="summary-item item3">
                    <Button variant="primary" size="lg" onClick={handleSave}>저장하기</Button>
                </div>
            </div>
        </div>
    )
}

export default MyFixedExpense;