import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/axiosConfig';

const EmployeeDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteReason, setDeleteReason] = useState('');

  useEffect(() => {
    const fetchEmployee = async () => {
      try {
        const response = await api.get(`/api/employees/${id}`);
        setEmployee(response.data.data);
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to fetch employee');
        setLoading(false);
      }
    };

    fetchEmployee();
  }, [id]);

  const handleDelete = async () => {
    if (!deleteReason) {
      alert('Please provide a reason for deletion');
      return;
    }

    try {
      await api.delete(`/api/employees/${id}`, { data: { reason: deleteReason } });
      navigate('/employees');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to delete employee');
    } finally {
      setShowDeleteModal(false);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!employee) return <div>Employee not found</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">
          {employee.firstName} {employee.lastName}
        </h1>
        {user?.role === 'admin' && (
          <div className="flex space-x-2">
            <Link
              to={`/employees/${id}/edit`}
              className="bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded"
            >
              Edit
            </Link>
            <button
              onClick={() => setShowDeleteModal(true)}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
            >
              Delete
            </button>
          </div>
        )}
      </div>

      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-medium">Basic Information</h2>
        </div>
        <div className="px-6 py-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-500">First Name</p>
            <p className="mt-1">{employee.firstName}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Last Name</p>
            <p className="mt-1">{employee.lastName}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Email</p>
            <p className="mt-1">{employee.userId?.email}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Phone</p>
            <p className="mt-1">{employee.phone}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Address</p>
            <p className="mt-1">{employee.address}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Status</p>
            <p className="mt-1">
              <span
                className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                  employee.isActive
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800'
                }`}
              >
                {employee.isActive ? 'Active' : 'Inactive'}
              </span>
            </p>
          </div>
        </div>

        <div className="px-6 py-4 border-t border-gray-200">
          <h2 className="text-lg font-medium">Employment Details</h2>
        </div>
        <div className="px-6 py-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-500">Position</p>
            <p className="mt-1">{employee.position}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Department</p>
            <p className="mt-1">{employee.department}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Joining Date</p>
            <p className="mt-1">
              {new Date(employee.joiningDate).toLocaleDateString()}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Salary</p>
            <p className="mt-1">${employee.salary.toLocaleString()}</p>
          </div>
        </div>

        {employee.emergencyContact && (
          <>
            <div className="px-6 py-4 border-t border-gray-200">
              <h2 className="text-lg font-medium">Emergency Contact</h2>
            </div>
            <div className="px-6 py-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Name</p>
                <p className="mt-1">{employee.emergencyContact.name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Relation</p>
                <p className="mt-1">{employee.emergencyContact.relation}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Phone</p>
                <p className="mt-1">{employee.emergencyContact.phone}</p>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Delete Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-medium mb-4">Delete Employee</h3>
            <p className="mb-4">
              Are you sure you want to delete {employee.firstName} {employee.lastName}?
              This action cannot be undone.
            </p>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Reason for deletion</label>
              <textarea
                className="w-full px-3 py-2 border border-gray-300 rounded"
                value={deleteReason}
                onChange={(e) => setDeleteReason(e.target.value)}
                required
              />
            </div>
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployeeDetail;