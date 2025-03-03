import { useState, useEffect } from "react";
import { Overlay } from "../../../components/Overlay";
import SaveButton from "../../../components/Button/SaveButton";

function SaveButtonWrapper({ onClick }) {
  const [isButtonHovered, setIsButtonHovered] = useState(false);
  const [visibleOverlay, setVisibleOverlay] = useState(false);
  useEffect(() => {
    if (!isButtonHovered && visibleOverlay) {
      setVisibleOverlay(false);
    }
  }, [isButtonHovered]);
  return (
    <div className="summary-item item3">
      <div className="popover-wrapper">
        <SaveButton
          onClick={onClick}
          onMouseEnter={() => setIsButtonHovered(true)}
          onMouseLeave={() => setIsButtonHovered(false)}
        >
          저장하기
        </SaveButton>

        {visibleOverlay && (
          <Overlay
            overlayContent={"저장할 내용이 없습니다."}
            setVisibleOverlay={setVisibleOverlay}
          />
        )}
      </div>
    </div>
  );
}

export default SaveButtonWrapper;
