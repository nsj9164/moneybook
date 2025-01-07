import { Table } from "react-bootstrap";

const Table = ({columns, checkTr}) => {

  return (
    <Table bordered hover>
      <colgroup>
        {columns.map((col, index) => {
            <col key={index} width={col.width||'auto'} />
        })}
      </colgroup>
      <thead>
        <tr>
        {checkTr ? <th><input type="checkbox" checked={checkedAll} onChange={handleCheckedAll} /></th> : null}
        {columns.map((col, index) => {
            <th key={index}>{col.header}</th>
        })}
        </tr>
      </thead>
      <tbody>
        {payListStatus === "loading" && (
          <tr>
            <td colspan="8">Loading...</td>
          </tr>
        )}

        {payListStatus === "succeeded" &&
          tempData.map((item, i) => (
            <tr key={i}>
              <td>
                <input
                  type="checkbox"
                  checked={checkedItems.includes(item.id)}
                  onChange={() => handleCheck(item.id)}
                  disabled={item.isDisabled}
                />
              </td>
              {columns.map((col, idx) =>
                col === "date" ? (
                  <td>
                    <DatePicker
                      key={col}
                      selected={item[col] ? new Date(item[col]) : new Date()}
                      onKeyDown={(e) => {
                        e.preventDefault();
                      }}
                      onChange={(date) => handleUpdate(item.id, col, date)}
                      onFocus={(e) => setInitial(item, i * 7 + idx)}
                      dateFormat="yyyy-MM-dd"
                      className="input_date"
                    />
                  </td>
                ) : (
                  <Input
                    key={col}
                    ref={(el) => (inputRefs.current[i * 7 + idx] = el)}
                    onBlur={(e) => handleUpdate(e, item.id, col)}
                    onKeyDown={(e) => handleKeyDown(e, (i + 1) * 7 + idx, col)}
                    onFocus={(e) => setInitial(item, i * 7 + idx)}
                    onInput={(e) => handleInput(e, col)}
                  >
                    {item[col]}
                  </Input>
                )
              )}
            </tr>
          ))}

        {payListStatus === "failed" && (
          <tr>
            <td colspan="8">Error</td>
          </tr>
        )}
      </tbody>
    </Table>
  );
};

export default Table;
