import { useEffect, useRef, useState } from "react";
import "../styles/CustomOverlay.css";

export const Overlay = ({
  overlayHeader,
  overlayContent,
  setVisibleOverlay,
}) => {
  const overlayRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        overlayRef.current &&
        !overlayRef.current.contains(event.target) &&
        !event.target.closest(".popover-wrapper")
      ) {
        console.log("바껴라!!!!!!");
        setVisibleOverlay(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.addEventListener("mousedown", handleClickOutside);
    };
  }, [setVisibleOverlay]);
  return (
    <div ref={overlayRef} className="popover">
      {overlayHeader && <h3 className="popover-header">{overlayHeader}</h3>}
      <p className="popover-body">{overlayContent}</p>
    </div>
  );
};
