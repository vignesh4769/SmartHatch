import { useState, useEffect } from "react";
import { FaEdit, FaTrash, FaPaperPlane } from "react-icons/fa";
import { useAuth } from "../../context/AuthContext";
import api from "../../api/config";
import { toast } from "react-toastify";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import financialApi from "../../api/financialApi";

function Financial() {
  const { user } = useAuth();
  const [records, setRecords] = useState([]);
  const [newRecord, setNewRecord] = useState({
    date: "",
    description: "",
    amount: "",
    type: "income",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);
  const [showSalaryReport, setShowSalaryReport] = useState(true);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [recordsLoading, setRecordsLoading] = useState(false);

  // Fetch employees from database
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        setLoading(true);
        const response = await api.get("/api/admin/employees");
        const activeEmployees = response.data.data.filter(
          (emp) => emp.deletedAt === null
        );
        
        const mappedEmployees = activeEmployees.map(emp => ({
          id: emp._id,
          name: `${emp.firstName} ${emp.lastName}`,
          email: emp.email,
          department: emp.department,
          baseSalary: emp.salary || 0,
          lastPayment: emp.lastPayment || null,
          initials: `${emp.firstName?.[0] || ''}${emp.lastName?.[0] || ''}`.toUpperCase()
        }));
        
        setEmployees(mappedEmployees);
      } catch (err) {
        toast.error("Failed to fetch employees");
        console.error("Error fetching employees:", err);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchEmployees();
    }
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewRecord((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newRecord.date || !newRecord.description || !newRecord.amount) {
      toast.error("Please fill all fields");
      return;
    }

    try {
      // Format data before sending
      const formattedRecord = {
        ...newRecord,
        date: new Date(newRecord.date).toISOString(),
        amount: parseFloat(newRecord.amount)
      };

      if (isEditing) {
        const updatedRecord = await financialApi.updateTransaction(editId, formattedRecord);
        setRecords(prev => 
          prev.map(record => 
            record._id === editId || record.id === editId ? updatedRecord : record
          )
        );
        toast.success("Transaction updated successfully");
      } else {
        const savedRecord = await financialApi.recordTransaction(formattedRecord);
        setRecords(prev => [...prev, savedRecord]);
        toast.success("Transaction added successfully");
      }

      // Reset form
      setNewRecord({
        date: "",
        description: "",
        amount: "",
        type: "income",
      });
      setIsEditing(false);
      setEditId(null);
    } catch (error) {
      toast.error(`Failed to ${isEditing ? 'update' : 'add'} transaction`);
      console.error("Transaction error:", error);
    }
  };

  const handleEdit = (record) => {
    setIsEditing(true);
    setEditId(record._id || record.id);
    // Convert ISO date to local date format for the input
    const localDate = record.date ? new Date(record.date).toISOString().split('T')[0] : "";
    setNewRecord({
      ...record,
      date: localDate
    });
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this record?")) {
      try {
        await financialApi.deleteTransaction(id);
        setRecords(prev => prev.filter(record => (record._id || record.id) !== id));
        toast.success("Transaction deleted successfully");
      } catch (error) {
        toast.error("Failed to delete transaction");
        console.error("Delete error:", error);
      }
    }
  };

  useEffect(() => {
    const fetchRecords = async () => {
      try {
        setRecordsLoading(true);
        const data = await financialApi.getTransactions();
        setRecords(data);
      } catch (err) {
        toast.error("Failed to load financial records");
        console.error("Error fetching transactions:", err);
      } finally {
        setRecordsLoading(false);
      }
    };
  
    fetchRecords();
  }, []);

  const handlePaySalary = async (employeeId) => {
    try {
      const employee = employees.find(emp => emp.id === employeeId);
      await api.post(`/api/admin/employees/${employeeId}/pay-salary`, {
        paymentDate: new Date().toISOString(),
        notification: {
          message: `Salary of ₹${employee.baseSalary.toFixed(2)} processed`, 
          type: 'salary'
        }
      });

      setEmployees(prev =>
        prev.map(emp =>
          emp.id === employeeId
            ? { ...emp, lastPayment: new Date().toISOString() }
            : emp
        )
      );
      toast.success("Salary paid successfully");
    } catch (err) {
      toast.error("Failed to pay salary");
      console.error("Error paying salary:", err);
    }
  };

  // Calculate totals
  const totalIncome = records
    .filter(record => record.type === "income")
    .reduce((sum, record) => sum + parseFloat(record.amount || 0), 0);

  const totalExpense = records
    .filter(record => record.type === "expense")
    .reduce((sum, record) => sum + parseFloat(record.amount || 0), 0);

  const totalSalaries = employees.reduce(
    (sum, emp) => sum + (emp.baseSalary || 0),
    0
  );

  if (loading) return <LoadingSpinner />;

  return (
    <div className="ml-64 p-8 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-gray-800">
          Financial Dashboard
        </h1>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500">
            <h3 className="text-lg text-gray-600 mb-2">Total Balance</h3>
            <p className="text-2xl font-bold">
              ₹{(totalIncome - totalExpense - totalSalaries).toFixed(2)}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-green-500">
            <h3 className="text-lg text-gray-600 mb-2">Total Income</h3>
            <p className="text-2xl font-bold text-green-600">
              ₹{totalIncome.toFixed(2)}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-red-500">
            <h3 className="text-lg text-gray-600 mb-2">Operating Expenses</h3>
            <p className="text-2xl font-bold text-red-600">
              ₹{totalExpense.toFixed(2)}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-purple-500">
            <h3 className="text-lg text-gray-600 mb-2">Salary Expenses</h3>
            <p className="text-2xl font-bold text-purple-600">
              ₹{totalSalaries.toFixed(2)}
            </p>
          </div>
        </div>

        {/* Financial Records Section */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">
            {isEditing ? "Edit Transaction" : "Add New Transaction"}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <input
                type="date"
                name="date"
                value={newRecord.date}
                onChange={handleInputChange}
                required
                className="border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="text"
                name="description"
                value={newRecord.description}
                onChange={handleInputChange}
                placeholder="Description"
                required
                className="border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <div className="relative">
                <span className="absolute left-3 top-2 text-gray-500">₹</span>
                <input
                  type="number"
                  name="amount"
                  value={newRecord.amount}
                  onChange={handleInputChange}
                  placeholder="Amount"
                  required
                  min="0"
                  step="0.01"
                  className="pl-7 border border-gray-300 rounded p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <select
                name="type"
                value={newRecord.type}
                onChange={handleInputChange}
                className="border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="income">Income</option>
                <option value="expense">Expense</option>
              </select>
            </div>
            <div className="flex gap-4">
              <button
                type="submit"
                className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition duration-200"
              >
                {isEditing ? "Update Transaction" : "Add Transaction"}
              </button>
              {isEditing && (
                <button
                  type="button"
                  onClick={() => {
                    setIsEditing(false);
                    setEditId(null);
                    setNewRecord({
                      date: "",
                      description: "",
                      amount: "",
                      type: "income",
                    });
                  }}
                  className="bg-gray-500 text-white px-6 py-2 rounded hover:bg-gray-600 transition duration-200"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Financial Records Table */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
          {recordsLoading ? (
            <div className="p-8 flex justify-center">
              <LoadingSpinner />
            </div>
          ) : (
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Description
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {records.map((record) => {
                  const recordId = record._id || record.id;
                  return (
                    <tr key={recordId} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-gray-700">
                        {record.date ? new Date(record.date).toLocaleDateString() : '-'}
                      </td>
                      <td className="px-6 py-4 text-gray-700">
                        {record.description}
                      </td>
                      <td className="px-6 py-4 text-gray-700">
                        ₹{parseFloat(record.amount || 0).toFixed(2)}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs ${
                            record.type === "income"
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {record.type}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => handleEdit(record)}
                          className="text-blue-600 hover:text-blue-800 mr-3"
                          title="Edit"
                        >
                          <FaEdit size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(recordId)}
                          className="text-red-600 hover:text-red-800"
                          title="Delete"
                        >
                          <FaTrash size={18} />
                        </button>
                      </td>
                    </tr>
                  );
                })}
                {records.length === 0 && (
                  <tr>
                    <td
                      colSpan="5"
                      className="px-6 py-4 text-center text-gray-500"
                    >
                      No financial records found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>

        {/* Salary Reports Section */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
          <div className="px-8 py-6 border-b border-gray-200 flex justify-between items-center bg-white">
            <h2 className="text-2xl font-semibold text-gray-800">
              Salary Management
            </h2>
            <button
              onClick={() => setShowSalaryReport(!showSalaryReport)}
              className="bg-blue-600 text-white px-6 py-2.5 rounded-md hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <span>{showSalaryReport ? "Hide" : "Show"} Salary Report</span>
            </button>
          </div>

          {showSalaryReport && (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-8 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Employee
                    </th>
                    <th className="px-8 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Department
                    </th>
                    <th className="px-8 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Base Salary
                    </th>
                    <th className="px-8 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Last Payment
                    </th>
                    <th className="px-8 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {employees.map((employee) => (
                    <tr key={employee.id} className="hover:bg-gray-50">
                      <td className="px-8 py-5">
                        <div className="flex items-center">
                          <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                            <span className="text-blue-600 font-medium">
                              {employee.initials}
                            </span>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {employee.name}
                            </div>
                            <div className="text-sm text-gray-500">
                              {employee.email}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-5 text-sm text-gray-500">
                        {employee.department}
                      </td>
                      <td className="px-8 py-5 text-sm text-gray-900">
                        ₹{employee.baseSalary.toFixed(2)}
                      </td>
                      <td className="px-8 py-5 text-sm text-gray-500">
                        {employee.lastPayment
                          ? new Date(employee.lastPayment).toLocaleDateString()
                          : "No payment yet"}
                      </td>
                      <td className="px-8 py-5">
                        <button
                          onClick={() => handlePaySalary(employee.id)}
                          className="text-blue-600 hover:text-blue-800 flex items-center gap-2"
                        >
                          <FaPaperPlane className="h-4 w-4" />
                          <span>Pay Salary</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Financial;