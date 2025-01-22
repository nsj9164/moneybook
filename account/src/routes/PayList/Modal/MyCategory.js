import { useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectText } from "../../../util/util";
import { Input } from "../PayList";

function MyCategory({ setCatDataList, catList }) {
  console.log("catList!!!!", catList);
  const dispatch = useDispatch();
  const catListSaveStatus = useSelector(
    (state) => state.myDetailList["categoryList"].saveStatus
  );
  const inputRefs = useRef([]);
  const [catData, setCatData] = useState([]);
  const [catId, setCatId] = useState(1);
  const [focusedItemId, setFocusedItemId] = useState(null);
  const fields = ["category_nm"];

  useEffect(() => {
    if (catList.length > 0) {
      setCatData(
        catList.map((item) => ({
          ...item,
          isDisabled: false,
          isModified: false,
        }))
      );
    }

    console.log("catList:::", catList);
  }, [catList]);

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
  }, [catList, catData]);

  // 저장할 data
  const modifiedData = useMemo(() => {
    return catData.filter(
      (item) =>
        (item.isModified || item.isNew) &&
        fields.some((field) => item[field] !== "" && item[field] !== undefined)
    );
  }, [catData]);

  useEffect(() => {
    setCatDataList(modifiedData);
  }, [modifiedData]);

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
    if (catListSaveStatus === "succeeded") {
      dispatch(categoryListActions.fetchData());
    }
  }, [catListSaveStatus]);

  // 삭제하기
  const handleDelete = (id) => {
    console.log(id);
    if (catList.some((item) => item.cat_id === id)) {
      dispatch(categoryListActions.deleteData([id]));
    }
    console.log("prevData:::", catData);
    setCatData((prevData) => prevData.filter((item) => item.cat_id !== id));
    console.log("nextData:::", catData);
  };

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
          {catData.length > 0 ? (
            catData.map((item, i) => (
              <tr key={i}>
                <Input
                  ref={(el) => (inputRefs.current[i] = el)}
                  onBlur={(e) => handleUpdate(e, item.cat_id)}
                >
                  {item.category_nm}
                </Input>
                <td>≡</td>
                <td
                  className="cursor_pointer"
                  onClick={() => handleDelete(item.cat_id)}
                >
                  X
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="3">No data available</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default MyCategory;
