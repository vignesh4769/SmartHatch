import React from "react";

function InputField({ label, type, id, value, onChange }) {
  return (
    <div className="form-group">
      <label htmlFor={id}>{label}:</label>
      <input
        type={type}
        id={id}
        className="input-field"
        value={value}
        onChange={onChange}
        required
      />
    </div>
  );
}

export default InputField;
