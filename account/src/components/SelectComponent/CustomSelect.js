import { useEffect, useState } from "react";
import { StyledSelect, StyledWrapper } from "./CustomSelect.styles";

const CustomSelect = ({
  key,
  value,
  onChange,
  options,
  maxHeight,
  defaultValue,
}) => {
  const [selectedValue, setSelectedValue] = useState("");

  useEffect(() => {
    // value가 바뀌었을 때, select box도 강제로 리렌더링됩니다.
    console.log("Selected value changed:", value);
  }, [value]);

  const handleSelectClick = () => {
    console.log("너 때문이니???", value, defaultValue);
    // if (!value && defaultValue) {
    //   onChange("");
    // }
  };

  const handleSelectChange = (e) => {
    console.log("customSelect1:::", e.target.value);
    console.log("customSelect2:::", e.target);
    onChange(e.target.value);
  };

  return (
    <td key={key}>
      <StyledWrapper>
        <StyledSelect onChange={handleSelectChange}>
          <option value="" disabled hidden></option>
          {defaultValue && <option value="">{defaultValue}</option>}
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
