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
            <td colSpan="8">Loading...</td>
          </tr>
        )}

        {status === "succeeded" &&
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
                  <td key={col}>
                    <DatePicker
                      selected={item[col] ? new Date(item[col]) : new Date()}
                      onKeyDown={(e) => e.preventDefault()}
                      onChange={(date) =>
                        handleUpdate(format(date, "yyyy-MM-dd"), item.id, col)
                      }
                      onFocus={(e) => setInitial(item, i * 7 + idx)}
                      dateFormat="yyyy-MM-dd"
                      className="input_date"
                    />
                  </td>
                ) : col === "cat_nm" ? (
                  <CustomSelect
                    key={idx}
                    value={item[col]}
                    options={categoryList?.map((list) => ({
                      value: list.cat_id,
                      label: list.category_nm,
                    }))}
                    noSelectValue="미분류"
                    onFocus={(e) => setInitial(item, i * 7 + idx)}
                    onChange={(value) => handleUpdate(value, item.id, "cat_id")}
                  />
                ) : col === "payment" ? (
                  <CustomSelect
                    key={idx}
                    value={item[col]}
                    options={cardList?.map((list) => ({
                      value: list.card_id,
                      label: list.card_name,
                    }))}
                    noSelectValue="선택없음"
                    onFocus={(e) => setInitial(item, i * 7 + idx)}
                    onChange={(value) =>
                      handleUpdate(value, item.id, "card_id")
                    }
                  />
                ) : (
                  <Input
                    key={col}
                    ref={(el) => (inputRefs.current[i * 7 + idx] = el)}
                    onBlur={(e) =>
                      handleUpdate(e.target.innerText, item.id, col)
                    }
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

        {status === "failed" && (
          <tr>
            <td colSpan="8">
              오류가 발생하였습니다. 잠시 후 다시 시도해주세요.
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
}

export default TableWrapper;
