import React from "react";

function Button({ text, onClick, className = "btn btn-primary" }) {
  return (
    <button onClick={onClick} className={`px-4 py-2 rounded-lg ${className}`}>
      {text}
    </button>
  );
}

export default Button;