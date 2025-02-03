import PropTypes from "prop-types";
import "../styles/AlertModal.css";
const AlertModal = ({ message, onClose }) => {
  return (
    <div className="alert-modal-overlay" onClick={onClose}>
      <div className="alert-modal-content" onClick={(e) => e.stopPropagation()}>
        <p>{message}</p>
        <button onClick={onClose}>확인</button>
      </div>
    </div>
  );
};

AlertModal.propTypes = {
  message: PropTypes.string,
  onClose: PropTypes.func.isRequired,
};

export default AlertModal;
