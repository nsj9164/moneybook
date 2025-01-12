import { useEffect, useState } from "react";
import { Table, Button, OverlayTrigger, Popover } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { fixedItemListActions } from "../../../store/myDetailSlice";
import { Input } from "../PayList";

function MyFixedExpense({ isLoggedIn }) {
  const dispatch = useDispatch();
  const fixedExpenseList = useSelector((state) => state.myDetailList.items);
  const fixedExpenseListStatus = useSelector(
    (state) => state.myDetailList.status
  );

  const [fixedData, setFixedData] = useState([]);
  const [fixedId, setFixedId] = useState(1);

  // fetchData 호출
  useEffect(() => {
    if (isLoggedIn && fixedExpenseListStatus === "idle") {
      dispatch(fixedItemListActions.fetchData());
    }
  }, [fixedExpenseListStatus, dispatch]);

  // setting fixedData
  useEffect(() => {
    if (fixedExpenseListStatus === "succeeded" && fixedExpenseList.length > 0) {
      setFixedData(fixedExpenseList);
    } else if (fixedData.length === 0) {
      setInitial();
    }
    console.log("Fixed data current state:", fixedData);
  }, [fixedExpenseListStatus, fixedExpenseList]);

  // 한 줄 추가
  const setInitial = () => {
    const newId = `expense-${fixedId}`;
    setFixedData([{ expense_id: newId }]);
    setFixedId((id) => id + 1);
  };
  const [checkedAll, setCheckedAll] = useState(false);
  const [checkedItems, setCheckedItems] = useState([]);

  useEffect(() => {
    console.log("fixedData:::", fixedData);
  }, [fixedData]);

  // 체크항목
  const handleCheck = (id) => {
    setCheckedItems((prev) =>
      prev.includes(id) ? prev.filter((itemId) => itemId !== id) : [...prev, id]
    );
  };

  // 전체선택/해제
  const handleCheckedAll = () => {
    if (checkedAll) {
      setCheckedItems([]);
    } else {
      // const allIds = tempData.filter(item => !item.isDisabled).map(item => item.id);
      setCheckedItems(allIds);
    }
    setCheckedAll(!checkedAll);
  };

  // 전체선택/해제
  useEffect(() => {
    // (checkedItems.length === tempData.filter(item => !item.isDisabled).length && tempData.length > 1) ? setCheckedAll(true) : setCheckedAll(false)
    // console.log("checkedItems:::", checkedItems);
  }, [checkedItems]);

  const fields = [
    "expense_date",
    "expense_desc",
    "expense_amount",
    "expense_payment",
    "expense_cat_nm",
  ];

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
            <th>
              <input
                type="checkbox"
                checked={checkedAll}
                onChange={handleCheckedAll}
              />
            </th>
            <th>발생일</th>
            <th>사용내역</th>
            <th>결제금액</th>
            <th>결제수단</th>
            <th>분류</th>
          </tr>
        </thead>
        <tbody>
          {fixedExpenseListStatus === "succeeded" &&
            fixedData.map((item, i) => (
              <tr key={i}>
                <td>
                  <input
                    type="checkbox"
                    checked={checkedItems.includes(item.id)}
                    onChange={() => handleCheck(item.id)}
                    disabled={item.isDisabled}
                  />
                </td>
                {fields.map((col, idx) => (
                  <Input key={idx}>{item[col]}</Input>
                ))}
              </tr>
            ))}

          {fixedExpenseListStatus === "failed" && (
            <tr>
              <td colspan="6">Error</td>
            </tr>
          )}
        </tbody>
      </Table>
    </div>
  );
}

export default MyFixedExpense;
