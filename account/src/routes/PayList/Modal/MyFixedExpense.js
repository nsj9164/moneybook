import { useEffect, useState } from "react";
import { Table, Button, OverlayTrigger, Popover } from "react-bootstrap"
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchData } from "../../../store/myDetailSlice";

function MyFixedExpense() {
    // login data
    const navigate = useNavigate();
    const isLoggedIn = useSelector(state => state.login.isLoggedIn);
    useEffect(() => {
        if(!isLoggedIn) {
            navigate('/login');
        }
    }, [isLoggedIn, navigate])

    const dispatch = useDispatch();
    const fixedExpenseList = useSelector(state => state.myDetailList.items);
    const fixedExpenseListStatus = useSelector(state => state.myDetailList.status);

    // fiexed_expense
    useEffect(() => {
        if(isLoggedIn && fixedExpenseListStatus === 'idle') {
            dispatch(fetchData())
        }
        console.log(fixedExpenseList)
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
        <div>
            <h2>고정항목 관리하기</h2>
            <Table bordered hover>
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
                        <div>success</div>
                    )}
                    
                    {fixedExpenseListStatus === 'failed' && (
                        <tr>
                            <td colspan="8">Error</td>
                        </tr>
                    )}
                </tbody>
            </Table>

            
        </div>
    )
}

export default MyFixedExpense;