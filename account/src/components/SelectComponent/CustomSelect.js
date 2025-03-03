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
  disabled,
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
    setSelectedValue(e.target.value);
    onChange(e.target.value);
  };

  return (
    <td key={key}>
      <StyledSelect
        value={selectedValue}
        onFocus={handleSelectClick}
        onChange={handleSelectChange}
        disabled={disabled}
      >
        <option value="" disabled hidden></option>
        {noSelectValue && <option value="0">{noSelectValue}</option>}
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </StyledSelect>
    </td>
  );
};

export default CustomSelect;
