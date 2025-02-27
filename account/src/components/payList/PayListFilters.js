import { addMonths } from "date-fns";

function PayListFilters() {
  const [endDate, setEndDate] = useState(endOfMonth(new Date()));

  // datepicker - 이전/다음
  const handleDate = (btn) => {
    if (btn === "prev") {
      setStartDate(startOfMonth(subMonths(startDate, 1)));
      setEndDate(endOfMonth(subMonths(endDate, 1)));
    } else if (btn === "next") {
      setStartDate(startOfMonth(addMonths(startDate, 1)));
      setEndDate(endOfMonth(addMonths(endDate, 1)));
    }
  };

  // datepicker - 재조회
  useEffect(() => {
    dispatch(
      fetchData({
        start: format(startDate, "yyyyMMdd"),
        end: format(endDate, "yyyyMMdd"),
      })
    );
  }, [startDate, endDate]);

  return (
    <div className="date_wrap">
      <button className="square_button" onClick={() => handleDate("prev")}>
        <span>&lt;</span>
      </button>

      <DatePicker
        selected={startDate}
        onChange={(date) => {
          setStartDate(date);
          if (endDate && date > endDate) setEndDate(addMonths(date, 1));
        }}
        dateFormat="yyyy.MM.dd"
        className="date_picker"
        disableTextInput
      />
      <span className="hyphen"></span>
      <DatePicker
        selected={endDate}
        onChange={(date) => setEndDate(date)}
        dateFormat="yyyy.MM.dd"
        minDate={startDate}
        className="date_picker"
        disableTextInput
      />
      <button className="square_button" onClick={() => handleDate("next")}>
        <span>&gt;</span>
      </button>
    </div>
  );
}

export default PayListFilters;
