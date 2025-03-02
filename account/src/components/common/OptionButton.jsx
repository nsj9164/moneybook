import { Children } from "react";
import { styled } from "styled-components";

const Button = styled.button`
  margin-right: 10px;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  border: 1px solid #6c757d;
  background: #f1f3f5;
  color: #495057;
  transition: all 0.2s;

  &:hover {
    cursor: pointer;
    background: #e0e3e5;
  }
`;

function OptionButton({ children, disabled, onClick }) {
  return (
    <Button disabled={disabled} onClick={onClick}>
      {children}
    </Button>
  );
}

export default OptionButton;
