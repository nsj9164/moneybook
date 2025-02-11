import Select from "react-select";

const monthOptions = [
  { value: "1", label: "전전월" },
  { value: "2", label: "전월" },
];

const dayOptions = [
  Array.from({ length: 28 }, (_, j) => ({
    value: String(j + 1),
    label: String(j + 1),
  })),
];

const CardPeriodSelect = ({ periodStart, periodEnd }) => {
  return (
    <td>
      <Select options={monthOptions} />
      <Select options={dayOptions} />

      {periodStart && periodEnd && (
        <p>
          전전월 {periodStart}일 ~ 전월 {periodEnd}일
        </p>
      )}
    </td>
  );
};

export default CardPeriodSelect;
