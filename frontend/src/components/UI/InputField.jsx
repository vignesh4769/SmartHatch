const InputField = ({ label, type, value, onChange }) => {
    return (
      <div className="mb-4">
        <label className="block text-sm font-medium">{label}</label>
        <input
          type={type}
          value={value}
          onChange={onChange}
          className="border rounded p-2 w-full"
        />
      </div>
    );
  };
  
  export default InputField;
  