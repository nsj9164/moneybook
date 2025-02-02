import { styled } from "styled-components";

export const StyledSelect = styled.select`
  width: 100%;
  height: 40px;
  border: none;
  border-radius: 4px;
  padding: 0 8px;
  font-size: 14px;
  outline: none;
  background-color: white;
  text-align: center;

  max-height: ${(props) => props.maxHeight || "auto"};
  overflow-y: auto;

  -webkit-appearance: none; /* 크롬, 사파리 */
  -moz-appearance: none; /* 파이어폭스 */
  appearance: none; /* 표준 브라우저 */

  &:focus {
    border-color: #0078ff;
    box-shadow: 0 0 3px rgba(0, 120, 255, 0.5);
  }
`;

export const StyledWrapper = styled.div`
  position: relative;
  width: 100%;
`;
