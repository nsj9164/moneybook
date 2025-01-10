import { useEffect, useState } from "react";
import { Table, Button, OverlayTrigger, Popover } from "react-bootstrap"
import { useDispatch, useSelector } from "react-redux";
import { fixedItemListActions } from "../../../store/myDetailSlice"

function MyFixedExpense({isLoggedIn}) {
    const dispatch = useDispatch();
    const fixedExpenseList = useSelector(state => state.myDetailList.items);
    const fixedExpenseListStatus = useSelector(state => state.myDetailList.status);

    // fiexed_expense
    useEffect(() => {
        if(isLoggedIn && fixedExpenseListStatus === 'idle') {
            dispatch(fixedItemListActions.fetchData())
        }
        console.log("fixedExpenseList:::",fixedExpenseList)
    }, [fixedExpenseListStatus, dispatch]);

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
            // const allIds = tempData.filter(item => !item.isDisabled).map(item => item.id);
            setCheckedItems(allIds);
        }
        setCheckedAll(!checkedAll);
    }

    // 전체선택/해제
    useEffect(() => {
        // (checkedItems.length === tempData.filter(item => !item.isDisabled).length && tempData.length > 1) ? setCheckedAll(true) : setCheckedAll(false)
        console.log("checkedItems:::", checkedItems)
    }, [checkedItems])

    return (
        <div class="modal-body">
            <h2 class="modal-title">고정항목 관리하기</h2>
            <Table class="custom-table" bordered hover>
                <colgroup>
                    <col width={"8%"} />
                    <col width={"12%"} />
                    <col />
                    <col width={"20%"} />
                    <col width={"20%"} />
                    <col width={"15%"} />
                </colgroup>
                <thead>
                    <tr>
                        <th><input type="checkbox" checked={checkedAll} onChange={handleCheckedAll} /></th>
                        <th>발생일</th>
                        <th>사용내역</th>
                        <th>결제금액</th>
                        <th>결제수단</th>
                        <th>분류</th>
                    </tr>
                </thead>
                <tbody>
                    
                    {fixedExpenseListStatus === 'succeeded' && (
                        <tr>
                            <td colspan="6">Success</td>
                        </tr>
                    )}
                    
                    {fixedExpenseListStatus === 'failed' && (
                        <tr>
                            <td colspan="6">Error</td>
                        </tr>
                    )}
                </tbody>
            </Table>

            
        </div>
    )
}

export default MyFixedExpense;