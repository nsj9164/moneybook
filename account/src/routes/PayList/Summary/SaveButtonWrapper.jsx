import { useState, useEffect } from "react";
import { Overlay } from "@/components/Overlay";
import SaveButton from "@/components/Button/SaveButton";
import AlertModal from "@/components/AlertModal";

function SaveButtonWrapper({ onSave }) {
  const [isButtonHovered, setIsButtonHovered] = useState(false);
  const [visibleOverlay, setVisibleOverlay] = useState(false);
  const [showAlertModal, setShowAlertModal] = useState(false);

  useEffect(() => {
    if (!isButtonHovered && visibleOverlay) {
      setVisibleOverlay(false);
    }
  }, [isButtonHovered, visibleOverlay, setVisibleOverlay]);

  const handleClick = async () => {
    const isDataSaved = await onSave();
    if (!isDataSaved) {
      setVisibleOverlay(true);
    } else {
      setShowAlertModal(true);
    }
  };

  return (
    <div className="summary-item item3">
      <div className="popover-wrapper">
        <SaveButton
          onClick={handleClick}
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

        {showAlertModal && (
          <AlertModal
            message={"저장되었습니다."}
            onClose={() => setShowAlertModal(false)}
          />
        )}
      </div>
    </div>
  );
}

export default SaveButtonWrapper;
