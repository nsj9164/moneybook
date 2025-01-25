import { StyledSelect } from "./CustomSelect.styles";

const CustomSelect = ({ options, getValue, defaultValue }) => {
  return (
    <StyledSelect onChange={(e) => getValue && getValue(e.target.value)}>
      {defaultValue && <option value="">{defaultValue}</option>}
      {options.map((option, idx) => (
        <option key={idx} value={option.value}>
          {option.label}
        </option>
      ))}
    </StyledSelect>
  );
};

export default CustomSelect;
