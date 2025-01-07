const Table = () => {
    return (
        <Table bordered hover>
            <colgroup>
                <col width={"5%"} />
                <col width={"10%"} />
                <col width={"10%"} />
                <col />
                <col width={"12%"} />
                <col width={"12%"} />
                <col width={"15%"} />
                <col width={"15%"} />
            </colgroup>
            <thead>
                <tr>
                    <th><input type="checkbox" checked={checkedAll} onChange={handleCheckedAll} /></th>
                    <th>날짜</th>
                    <th>분류</th>
                    <th>항목</th>
                    <th>지출금액</th>
                    <th>실지출금액</th>
                    <th>결제수단</th>
                    <th>비고</th>
                </tr>
            </thead>
            <tbody>
                {payListStatus === 'loading' && <div>Loading...</div>}
                
                {payListStatus === 'succeeded' && (
                    tempData.map((item, i) => (
                            <tr key={i}>
                                <td><input type="checkbox" checked={checkedItems.includes(item.id)} onChange={() => handleCheck(item.id)} disabled={item.isDisabled} /></td>
                                {columns.map((col, idx) => (
                                    col === "date" ? (
                                        <td>
                                            <DatePicker
                                                key={col}
                                                selected={item[col] ? new Date(item[col]) : new Date()}
                                                onKeyDown={(e) => {e.preventDefault();}}
                                                onChange={(date) => handleUpdate(item.id, col, date)}
                                                onFocus={(e) => setInitial(item, i * 7 + idx)}
                                                dateFormat="yyyy-MM-dd"
                                                className="input_date" />
                                        </td>
                                    ) : (
                                        <Input
                                            key={col}
                                            ref={el => inputRefs.current[i * 7 + idx] = el}
                                            onBlur={(e) => handleUpdate(e, item.id, col)}
                                            onKeyDown={(e) => handleKeyDown(e, (i + 1) * 7 + idx, col)}
                                            onFocus={(e) => setInitial(item, i * 7 + idx)}
                                            onInput={(e) => handleInput(e, col)}>
                                                {item[col]}
                                        </Input>
                                    )
                                ))}
                            </tr>
                        ))
                )}
                
                {payListStatus === 'failed' && (
                    <tr>
                        <td colspan="8">Error</td>
                    </tr>
                )}
            </tbody>
        </Table>
    )
}

export default Table;