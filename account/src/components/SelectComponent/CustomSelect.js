import { useEffect, useState } from "react";
import { StyledSelect, StyledWrapper } from "./CustomSelect.styles";

const CustomSelect = ({
  key,
  value,
  onChange,
  options,
  maxHeight,
  defaultValue,
  noSelectValue,
}) => {
  const [selectedValue, setSelectedValue] = useState(value ?? "");

  useEffect(() => {
    setSelectedValue(value ?? "");
  }, [value]);

  const handleSelectClick = () => {
    if (!selectedValue) {
      let setValue = defaultValue ? defaultValue : "none";
      setSelectedValue(setValue);
      onChange(setValue);
    }
  };

  const handleSelectChange = (e) => {
    console.log("customSelect:::", e.target.value);
    setSelectedValue(e.target.value);
    onChange(e.target.value);
  };

  return (
    <td key={key}>
      <StyledWrapper>
        <StyledSelect
          value={selectedValue}
          onFocus={handleSelectClick}
          onChange={handleSelectChange}
        >
          <option value="" disabled hidden></option>
          {noSelectValue && <option value="none">{noSelectValue}</option>}
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </StyledSelect>
      </StyledWrapper>
    </td>
  );
};

export default CustomSelect;
