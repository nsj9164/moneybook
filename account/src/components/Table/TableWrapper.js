import PayListRow from "../../routes/PayList/PayListRow";

function TableWrapper({
  columns,
  colWidths,
  data,
  status,
  handleUpdate,
  setInitial,
  checkedItems,
  checkedAll,
  handleCheckedAll,
  handleCheck,
  setFocusedItemId,
}) {
  return (
    <table className="table table-hover">
      <colgroup>
        {colWidths.map((width, index) => (
          <col key={index} style={{ width }} />
        ))}
      </colgroup>
      <thead>
        <tr>
          {Object.values(columns).map((title, index) =>
            title === "checkbox" ? (
              <th key={index}>
                <input
                  type="checkbox"
                  checked={checkedAll}
                  onChange={handleCheckedAll}
                />
              </th>
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
              checkedItems={checkedItems}
              handleUpdate={handleUpdate}
              setInitial={setInitial}
              handleCheck={handleCheck}
              setFocusedItemId={setFocusedItemId}
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
