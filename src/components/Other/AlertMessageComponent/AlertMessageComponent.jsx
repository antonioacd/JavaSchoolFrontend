import React, { useState } from 'react';

const AlertMessageComponent = ({ text, type, onClose }) => {
  // Clase CSS basada en el tipo (bueno o malo)
  const alertClass = type === 'success' ? 'alert-success' : 'alert-error';

  // Estado para controlar la visibilidad del componente
  const [isVisible, setIsVisible] = useState(true);

  const handleClose = () => {
    setIsVisible(false);
    onClose(); // Llama a la función onClose para manejar el cierre en el componente padre
  };

  return isVisible ? (
    <div className={`alert-box ${alertClass}`}>
      {type === 'success' ? (
        <span className="alert-icon">&#10004;</span>
      ) : (
        <span className="alert-icon">&#10008;</span>
      )}
      <p className="alert-text">{text}</p>
      <button onClick={handleClose} className="alert-button">
        OK
      </button>
    </div>
  ) : null;
};

export default AlertMessageComponent;
