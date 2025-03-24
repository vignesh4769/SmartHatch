const EmployeeCard = ({ employee }) => {
    if (!employee) return <div className="w-1/3 p-4">Select an employee</div>;
  
    return (
      <div className="w-1/3 bg-white p-5 shadow-lg rounded-lg">
        <h2 className="text-xl font-bold">{employee.name}</h2>
        <p className="text-gray-600">{employee.position}</p>
        <p className="text-gray-600">{employee.email}</p>
        <p className="text-gray-600">{employee.phone}</p>
      </div>
    );
  };
  
  export default EmployeeCard;
  