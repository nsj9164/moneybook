import { styled } from "styled-components";

export const Input = styled.td.attrs({
  contentEditable: true,
  suppressContentEditableWarning: true,
})`
  &[data-placeholder]:empty::before {
    content: attr(data-placeholder);
    color: #7d7d7d;
    transform: translateY(-50%);
    pointer-events: none;
  }

  &:focus::before {
    content: "";
  }
`;
