import PropTypes from "prop-types";
import { createPortal } from "react-dom";
import "../../styles/AlertModal.css";
const AlertModal = ({ message, onClose }) => {
  return createPortal(
    <div className="alert-modal-overlay" onClick={onClose}>
      <div className="alert-modal-content" onClick={(e) => e.stopPropagation()}>
        <p className="alert-message">{message}</p>
        <div className="alert-modal-actions">
          <button className="alert-modal-btn" onClick={onClose}>
            확인
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};

AlertModal.propTypes = {
  message: PropTypes.string,
  onClose: PropTypes.func.isRequired,
};

export default AlertModal;
