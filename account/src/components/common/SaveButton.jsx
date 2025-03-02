import { styled } from "styled-components";

const Button = styled.button`
  font-size: 18px;
  font-weight: 700;
  padding: 0.7rem 1.5rem;
  letter-spacing: 0.5px;
  background: #03c75a;
  color: white;
  border: none;
  border-radius: 4px;
  transition: all 0.3s;
  &:hover {
    background: #43a047;
  }
`;

function SaveButton({ children, onClick, onMouseEnter, onMouseLeave }) {
  return (
    <Button
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {children}
    </Button>
  );
}

export default SaveButton;
