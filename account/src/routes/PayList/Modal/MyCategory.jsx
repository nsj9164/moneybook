import { useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectText } from "../../../util/util";
import classNames from "classnames";
import useFetchLists from "../../../hooks/useFetchLists";
import TableEmptyRow from "../../../components/Table/TableEmptyRow";
import { saveData } from "../../../store/features/payList/payListActions";
import { Input } from "../../../components/Table/EditableCell";
import { Overlay } from "../../../components/Overlay";
import { categoryListActions } from "../../../store/features/myDetailList/myDetailListActions";

function MyCategory({ catDataList, setCatDataList }) {
  const dispatch = useDispatch();
  const {
    lists: { categoryList },
    statuses: { categoryListStatus },
  } = useFetchLists(["categoryList"]);
  const inputRefs = useRef([]);
  const [catData, setCatData] = useState([]);
  const [catId, setCatId] = useState(1);
  const [focusedItemId, setFocusedItemId] = useState(null);
  const [visibleOverlay, setVisibleOverlay] = useState(null);
  const [isButtonHovered, setIsButtonHovered] = useState(false);
  const [showAlertModal, setShowAlertModal] = useState(false);
  const fields = ["category_nm"];

  useEffect(() => {
    if (categoryList.length > 0) {
      setCatData(
        categoryList.map((item) => ({
          ...item,
          isDisabled: false,
          isModified: false,
        }))
      );
    }
  }, [categoryList]);

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
    }
  }, [categoryList, catData]);

  // 저장하기 후 update cat_id, isNew, isModified
  useEffect(() => {
    setCatData((prevData) => {
      const newData = prevData.map((item) => {
        const updatedItem = catDataList.find(
          (cat) => cat.tempId === item.cat_id
        );
        return updatedItem
          ? {
              ...item,
              cat_id: updatedItem.insertId,
              isNew: false,
              isModified: false,
            }
          : { ...item, isModified: false };
      });

      if (JSON.stringify(newData) !== JSON.stringify(prevData)) {
        return newData;
      }

      return prevData;
    });
  }, [catDataList]);

  // 저장할 data
  const modifiedData = useMemo(() => {
    return catData.filter(
      (item) =>
        (item.isModified || item.isNew) &&
        fields.some((field) => item[field] !== "" && item[field] !== undefined)
    );
  }, [catData]);

  useEffect(() => {
    if (modifiedData.length > 0) {
      setCatDataList(modifiedData);
    }
  }, [modifiedData]);

  const handleUpdate = (e, id) => {
    const newItem = e.target.innerText;
    setCatData((prevData) =>
      prevData.map((item) =>
        item.cat_id === id
          ? {
              ...item,
              category_nm: newItem,
              isDisabled: false,
              isModified: true,
            }
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

  // 삭제하기
  const handleDelete = (id, isDisabled) => {
    if (isDisabled) {
      setVisibleOverlay(true);
    } else {
      if (categoryList.some((item) => item.cat_id === id)) {
        dispatch(categoryListActions.deleteData([id])).then((resultAction) => {
          if (resultAction.meta.requestStatus === "fulfilled") {
            setShowAlertModal(true);
          }
        });
      }
      setCatData((prevData) => prevData.filter((item) => item.cat_id !== id));
    }
  };

  useEffect(() => {
    if (!isButtonHovered && visibleOverlay) {
      setVisibleOverlay(null);
    }
  }, [isButtonHovered]);

  // 분류명 placeholder 없애기
  const removePlaceholder = (e) => {
    e.target.dataset.placeholder = "";
  };

  return (
    <div className="modal-body">
      <h2 className="modal-title">분류 관리하기</h2>
      <div className="table-container">
        <table className="table table-hover table-sm no-margin" bordered hover>
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
                    data-placeholder="클릭해서 추가"
                    ref={(el) => (inputRefs.current[i] = el)}
                    onInput={removePlaceholder}
                    onBlur={(e) => handleUpdate(e, item.cat_id)}
                  >
                    {item.category_nm}
                  </Input>
                  <td>≡</td>

                  <td key={i}>
                    <div className="popover-wrapper w-100">
                      <button
                        className={classNames("btn-delete", {
                          "btn-disabled": item.isDisabled,
                        })}
                        onClick={() =>
                          handleDelete(item.cat_id, item.isDisabled)
                        }
                        onMouseEnter={
                          item.isDisabled
                            ? () => setIsButtonHovered(true)
                            : undefined
                        }
                        onMouseLeave={
                          item.isDisabled
                            ? () => setIsButtonHovered(false)
                            : undefined
                        }
                      >
                        X
                      </button>
                      {item.isDisabled && visibleOverlay && (
                        <Overlay
                          overlayContent={
                            "분류명을 입력하기 전에는\n삭제할 수 없습니다."
                          }
                          setVisibleOverlay={setVisibleOverlay}
                        />
                      )}
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <TableEmptyRow colSpan={3} message="No data available" />
            )}
          </tbody>
        </table>
      </div>
      {showAlertModal && (
        <AlertModal
          message="삭제되었습니다."
          onClose={() => setShowAlertModal(false)}
        />
      )}
    </div>
  );
}

export default MyCategory;
