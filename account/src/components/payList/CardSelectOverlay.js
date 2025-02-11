import styled from "styled-components";
const { Overlay } = require("../common/Overlay");

const List = styled.ul`
  padding: 8px;
  margin: 0;
  list-style: none;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(5px);
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(0, 0, 0, 0.1);
`;

const ListItem = styled.li`
  padding: 12px;
  cursor: pointer;
  border-radius: 8px;
  transition: background 0.2s ease-in-out, transform 0.1s ease-in-out;
  text-align: center;
  font-size: 14px;

  &:hover {
    background: #f0f0f5;
    transform: scale(1.02);
  }
`;

const NoSelection = styled(ListItem)`
  color: gray;
  font-weight: 500;
  &:hover {
    background: #e0e0e5;
  }
`;

const CardSelectOverlay = ({ setVisibleOverlay, cardList }) => {
  return (
    <Overlay overlayHeader="카드분류선택" setVisibleOverlay={setVisibleOverlay}>
      <List>
        {cardList.map((item) => (
          <ListItem
            key={item.card_id}
            value={item.card_id}
            onClick={() => setVisibleOverlay(null)}
          >
            {item.card_name}
          </ListItem>
        ))}
        <NoSelection value="none" onClick={() => setVisibleOverlay(null)}>
          선택없음
        </NoSelection>
      </List>
    </Overlay>
  );
};

export default CardSelectOverlay;
