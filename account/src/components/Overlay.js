import { useEffect, useRef, useState } from "react";
import "../CustomOverlay.css";

export const Overlay = ({
  triggerText,
  overlayHeader,
  overlayContent,
  disabled,
  onClick,
}) => {
  const overlayRef = useRef(null);

  // 외부 클릭 시 오버레이 닫기
  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (overlayRef.current && !overlayRef.current.contains(event.target)) {
        setIsVisible(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [onClick]);

  return (
    <div className="overlay-trigger">
      <div ref={overlayRef} className="popover">
        {overlayHeader && <h3 className="popover-header">{overlayHeader}</h3>}
        <p className="popover-body">{overlayContent}</p>
      </div>
    </div>
  );
};
