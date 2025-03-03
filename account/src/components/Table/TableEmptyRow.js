const TableEmptyRow = ({ colSpan, message }) => {
  return (
    <tr>
      <td colSpan={colSpan}>{message}</td>
    </tr>
  );
};

export default TableEmptyRow;
