import { styled } from "styled-components";

export const StyledSelect = styled.select`
  width: 100%;
  height: 40px;
  border: none;
  /* border: 1px solid #ddd; */
  border-radius: 4px;
  padding: 0 8px;
  font-size: 14px;
  outline: none;
  background-color: white;

  max-height: ${(props) =>
    props.maxHeight || "auto"}; /* 동적으로 계산된 max-height */
  overflow-y: auto;

  &:focus {
    border-color: #0078ff;
    box-shadow: 0 0 3px rgba(0, 120, 255, 0.5);
  }
`;

export const StyledWrapper = styled.div`
  position: relative;
  width: 100%;
`;
