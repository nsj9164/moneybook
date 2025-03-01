import TableRow from "./TableRow";

function TableWrapper({
  columns,
  data,
  status,
  renderRow,
  colWidths,
  className,
}) {
  return (
    <table className="table table-hover">
      <colgroup>
        {colWidths.map((width, index) => {
          <col key={index} style={{ width: { width } }} />;
        })}
      </colgroup>
      <thead>
        <tr>
          {columns.map((col, index) => {
            <th key={index}>{col}</th>;
          })}
        </tr>
      </thead>
      <tbody>
        {status === "loading" && (
          <tr>
            <td colSpan={columns.length}>Loading...</td>
          </tr>
        )}

        {status === "succeeded" &&
          data.map((item) => (
            <TableRow key={item.id} item={item} updateItem={updateItem} />
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
