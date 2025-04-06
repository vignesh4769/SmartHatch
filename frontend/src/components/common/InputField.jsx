import React from "react";

function InputField({ label, type, id, value, onChange }) {
  return (
    <div className="form-group">
      <label htmlFor={id} className="block text-sm font-medium text-gray-700">{label}</label>
      <input
        type={type}
        id={id}
        className="input input-bordered w-full mt-1 p-2"
        value={value}
        onChange={onChange}
        required
      />
    </div>
  );
}

export default InputField;