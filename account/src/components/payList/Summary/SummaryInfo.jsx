function SummaryInfo({ expense, realExpense }) {
  return (
    <>
      <div className="summary-item item1">
        <div>지출합계</div>
        <div className="font-bold">{expense}</div>
      </div>
      <div className="summary-item item2">
        <div>실지출합계</div>
        <div className="font-bold">{realExpense}</div>
      </div>
    </>
  );
}

export default SummaryInfo;
