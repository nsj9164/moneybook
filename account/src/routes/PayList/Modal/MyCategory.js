import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { categoryListActions } from "../../../store/myDetailSlice";
import { selectText } from "../../../util/util";
import { Table, Form } from "react-bootstrap";
import { Input } from "../PayList";

function MyCategory({ isLoggedIn }) {
  const dispatch = useDispatch();
  const catList = useSelector((state) => state.myDetailList.items);
  const catListStatus = useSelector((state) => state.myDetailList.status);
  const inputRefs = useRef([]);
  const [catData, setCatData] = useState([]);
  const [catId, setCatId] = useState(1);
  const [focusedItemId, setFocusedItemId] = useState(null);

  useEffect(() => {
    if (isLoggedIn && catListStatus === "idle") {
      dispatch(categoryListActions.fetchData());
    }
  }, [catListStatus, dispatch]);

  useEffect(() => {
    if (catListStatus === "succeeded" && catList.length > 0) {
      setCatData(
        catList.map((item) => ({
          ...item,
          isDisabled: false,
          isModified: false,
        }))
      );
    }
  }, [catListStatus, catList]);

  useEffect(() => {
    if (
      catData.length === 0 ||
      catData.every((item) => item.categoryNm && item.categoryNm !== undefined)
    ) {
      setCatData((prevCatData) => [
        ...prevCatData,
        { cat_id: `cat-${catId}`, isDisabled: true, isModified: true },
      ]);
      setCatId((id) => id + 1);
    }
  }, [catData, catId]);

  const handleUpdate = (e, id) => {
    const newItem = e.target.innerText;
    setCatData((prevData) =>
      prevData.map((item) =>
        item.id === id
          ? { ...item, categoryNm: newItem, isModified: true }
          : item
      )
    );
  };

  useEffect(() => {
    if (focusedItemId !== null) {
      const focusedElement = inputRefs.current[focusedItemId];
      if (focusedElement) {
        selectText({ target: focusedElement });
      }
    }
  }, [focusedItemId]);

  const fields = ["categoryNm"];

  return (
    <div className="modal-body">
      <h2 className="modal-title">분류 관리하기</h2>
      <Table className="custom-table" bordered hover>
        <colgroup>
          <col width={"10%"} />
          <col width={"15%"} />
        </colgroup>
        <thead>
          <tr>
            <th>분류명</th>
            <th>삭제</th>
          </tr>
        </thead>
        <tbody>
          {catListStatus === "succeeded" &&
            catData.map((item, i) => (
              <tr key={i}>
                <Input
                  ref={(el) => (inputRefs.current[i] = el)}
                  onBlur={(e) => handleUpdate(e, item.id)}
                >
                  {item.categoryNm}
                </Input>
                <td>X</td>
              </tr>
            ))}
          {catListStatus === "failed" && (
            <tr>
              <td colSpan="2">Error</td>
            </tr>
          )}
        </tbody>
      </Table>
    </div>
  );
}

export default MyCategory;
