import { useEffect, useRef, useState } from "react";
import "../CustomOverlay.css";

export const Overlay = ({ overlayHeader, overlayContent }) => {
  const overlayRef = useRef(null);

  return (
    <div className="overlay-trigger">
      <div ref={overlayRef} className="popover">
        {overlayHeader && <h3 className="popover-header">{overlayHeader}</h3>}
        <p className="popover-body">{overlayContent}</p>
      </div>
    </div>
  );
};
