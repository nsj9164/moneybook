import { useState } from "react";
import OptionButton from "../../../components/Button/OptionButton";
import CardSelectOverlay from "../CardSelectOverlay";
import PayListModal from "../Modal/PayListModal";

function ButtonGroup({
  checkedItems,
  handleDelete,
  handleCopy,
  changeSelectedCards,
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [visibleOverlay, setVisibleOverlay] = useState(false);

  // modal control
  const handleModal = () => setIsModalOpen(!isModalOpen);

  const optionButtons = () => {
    const isDisabled = checkedItems.length === 0;
    return [
      { label: "선택삭제", disabled: isDisabled, onClick: handleDelete },
      { label: "선택복사", disabled: isDisabled, onClick: handleCopy },
      {
        label: "카드선택",
        disabled: isDisabled,
        onClick: () => setVisibleOverlay(true),
        hasOverlay: true,
      },
      { label: "고정금액", onClick: handleModal },
    ];
  };

  return (
    <div className="button-group">
      {optionButtons().map((btn, index) =>
        btn.hasOverlay ? (
          <div key={index} className="popover-wrapper">
            <OptionButton disabled={btn.disabled} onClick={btn.onClick}>
              {btn.label}
            </OptionButton>
            {btn.hasOverlay && visibleOverlay && (
              <CardSelectOverlay
                cardList={cardList}
                changeSelectedCards={changeSelectedCards}
              />
            )}
          </div>
        ) : (
          <OptionButton
            key={index}
            disabled={btn.disabled}
            onClick={btn.onClick}
          >
            {btn.label}
          </OptionButton>
        )
      )}
      <PayListModal show={isModalOpen} onClose={handleModal} />
    </div>
  );
}

export default ButtonGroup;
