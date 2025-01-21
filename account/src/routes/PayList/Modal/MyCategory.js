import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { categoryListActions } from "../../../store/myDetailSlice";
import { fetchData } from "../../../store/paySlice";
import { selectText } from "../../../util/util";
import { Input } from "../PayList";

function MyCategory({ isLoggedIn, setCatDataList, saveStatus }) {
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
      catData.every(
        (item) => item.category_nm && item.category_nm !== undefined
      )
    ) {
      setCatData((prevCatData) => [
        ...prevCatData,
        { cat_id: `cat-${catId}`, isDisabled: true, isNew: true },
      ]);
      setCatId((id) => id + 1);
      console.log("catData:::", catData);
    }

    // 저장할 data
    const modifiedData = catData.filter(
      (item) =>
        (item.isModified || item.isNew) &&
        fields.some((field) => item[field] !== "" && item[field] !== undefined)
    );
    setCatDataList(modifiedData);
  }, [catData, catId]);

  const handleUpdate = (e, id) => {
    const newItem = e.target.innerText;
    setCatData((prevData) =>
      prevData.map((item) =>
        item.cat_id === id
          ? { ...item, category_nm: newItem, isModified: true }
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

  useEffect(() => {
    if (saveStatus === "succeeded") {
      dispatch(categoryListActions.fetchData());
    }
  }, [saveStatus]);

  const fields = ["category_nm"];

  return (
    <div className="modal-body">
      <h2 className="modal-title">분류 관리하기</h2>
      <table className="table table-hover">
        <colgroup>
          <col />
          <col width={"15%"} />
          <col width={"15%"} />
        </colgroup>
        <thead>
          <tr>
            <th>분류명</th>
            <th>순서</th>
            <th>삭제</th>
          </tr>
        </thead>
        <tbody>
          {catListStatus === "succeeded" &&
            catData.map((item, i) => (
              <tr key={i}>
                <Input
                  ref={(el) => (inputRefs.current[i] = el)}
                  onBlur={(e) => handleUpdate(e, item.cat_id)}
                >
                  {item.category_nm}
                </Input>
                <td>≡</td>
                <td>X</td>
              </tr>
            ))}
          {catListStatus === "failed" && (
            <tr>
              <td colSpan="2">Error</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default MyCategory;
