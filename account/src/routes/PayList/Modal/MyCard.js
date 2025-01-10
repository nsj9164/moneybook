import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { cardListActions } from "../../../store/myDetailSlice"
import { Table } from "react-bootstrap"

function MyCard({isLoggedIn}) {
    const dispatch = useDispatch();
    const cardList = useSelector(state => state.myDetailList.items);
    const cardListStatus = useSelector(state => state.myDetailList.status);

    useEffect(() => {
        if(isLoggedIn && cardListStatus === 'idle') {
            dispatch(cardListActions.fetchData());
        }
        console.log("cardList:::",cardList)
    }, [dispatch, cardList])
    return (
        <div>
            <h2>고정항목 관리하기</h2>
            <Table bordered hover>
                <colgroup>
                    <col width={"10%"} />
                    <col width={"15%"} />
                    <col width={"15%"} />
                    <col width={"10%"} />
                    <col />
                    <col width={"10%"} />
                    <col width={"10%"} />
                </colgroup>
                <thead>
                    <tr>
                        <th>카드사</th>
                        <th>카드명</th>
                        <th>카드종류</th>
                        <th>결제일</th>
                        <th>이용기간</th>
                        <th>사용중</th>
                        <th>삭제</th>
                    </tr>
                </thead>
                <tbody>
                    
                    {cardListStatus === 'succeeded' && (
                        <div>success</div>
                    )}
                    
                    {cardListStatus === 'failed' && (
                        <tr>
                            <td colspan="8">Error</td>
                        </tr>
                    )}
                </tbody>
            </Table>

            
        </div>
    )
}

export default MyCard;