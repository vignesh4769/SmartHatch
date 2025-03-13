import EmployeeTable from "../components/Employees/EmployeeTable";

const EmployeeManagementPage = () => {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Employee Management</h1>
      <EmployeeTable />
    </div>
  );
};

export default EmployeeManagementPage;
