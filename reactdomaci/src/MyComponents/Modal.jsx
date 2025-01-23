import React from "react";

const Modal = ({ show, title, message, onClose }) => {
  if (!show) return null;

  return (
    <div
      className="modal fade show d-flex"
      tabIndex="-1"
      style={{
        display: "flex", 
        backgroundColor: "rgba(0, 0, 0, 0.5)", 
        alignItems: "flex-start", 
        justifyContent: "center", 
        position: "fixed", 
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        zIndex: 1050, 
      }}
    >
      <div
        className="modal-dialog"
        style={{
          marginTop: "10%", 
          maxWidth: "500px", 
          width: "100%", 
        }}
      >
        <div className="modal-content" >
          <div className="modal-header" style={{
              borderBottom: "none", // Uklanja liniju ispod headera
            }}>
            <h5 className="modal-title">{title}</h5>
            {/* Izmena za "X" dugme */}
            <button
              type="button"
              className="btn-close"
              onClick={onClose}
              style={{
                background: "none", 
                border: "none", 
                fontSize: "20px", 
                fontWeight: "bold", 
                color: "#000", 
                cursor: "pointer",
              }}
            >
              &times;
            </button>
          </div>
          <div className="modal-body">
            <p style={{ margin: "0" }}>{message}</p>
          </div>
          <div className="modal-footer" style={{
              borderTop: "none", // Uklanja liniju iznad footer-a
            }}>
            <button type="submit" className="btn-submit" onClick={onClose}>
              Zatvori
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
