const EmployeeCard = ({ employee }) => {
  if (!employee) {
    return <p className="text-gray-500">Select an employee to view details.</p>;
  }

  return (
    <div className="p-4 border rounded-lg shadow-lg bg-white">
      <h2 className="text-lg font-bold">{employee.name}</h2>
      <p><strong>Role:</strong> {employee.jobTitle}</p>
      <p><strong>Shift:</strong> {employee.shift}</p>
      <p><strong>Phone:</strong> {employee.phone}</p>
      <p><strong>Address:</strong> {employee.address}</p>
    </div>
  );
};

export default EmployeeCard;
