import React from "react";

const InputField = React.forwardRef(({ label, type = "text", id, value, onChange }, ref) => {
  return (
    <div className="form-group mb-4">
      <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <input
        ref={ref}
        type={type}
        id={id}
        name={id}
        value={value}
        onChange={onChange}
        className="input input-bordered w-full p-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
        required
      />
    </div>
  );
});

export default InputField;
