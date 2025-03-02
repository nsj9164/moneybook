import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import useFetchLists from "../../hooks/useFetchLists";
import PayListRow from "../PayList/PayListRow";

function TableWrapper({
  columns,
  headerTitles,
  colWidths,
  data,
  status,
  handleUpdate,
  setInitial,
  handleCheckedAll,
  handleCheck,
}) {
  return (
    <table className="table table-hover">
      <colgroup>
        {colWidths.map((width, index) => (
          <col key={index} style={{ width: { width } }} />
        ))}
      </colgroup>
      <thead>
        <tr>
          {Object.values(columns).map((title, index) =>
            title === "checkbox" ? (
              <input
                type="checkbox"
                checked={checkedAll}
                onChange={handleCheckedAll}
              />
            ) : (
              <th key={index}>{title}</th>
            )
          )}
        </tr>
      </thead>
      <tbody>
        {status === "loading" && (
          <tr>
            <td colSpan={columns.length}>Loading...</td>
          </tr>
        )}

        {status === "succeeded" &&
          data.map((item, index) => (
            <PayListRow
              key={item.id}
              item={item}
              columns={columns}
              index={index}
              handleUpdate={handleUpdate}
              setInitial={setInitial}
              handleCheck={handleCheck}
            />
          ))}

        {status === "failed" && (
          <tr>
            <td colSpan={columns.length}>
              오류가 발생하였습니다. 잠시 후 다시 시도해주세요.
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
}

export default TableWrapper;
