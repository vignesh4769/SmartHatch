import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/config';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';

const EmployeeForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { register, handleSubmit, formState: { errors }, reset } = useForm();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const isEditMode = id && id !== 'new';

  useEffect(() => {
    if (isEditMode) {
      const fetchEmployee = async () => {
        try {
          setLoading(true);
          const response = await api.get(`/api/admin/employees/${id}`, {
            params: { hatchery: user.hatcheryName }
          });
          const employee = response.data;

          reset({
            firstName: employee.firstName,
            lastName: employee.lastName,
            email: employee.email,
            phone: employee.phone,
            address: employee.address,
            position: employee.position,
            department: employee.department,
            joiningDate: new Date(employee.joiningDate).toISOString().split('T')[0],
            salary: employee.salary,
            emergencyContact: employee.emergencyContact || {
              name: '',
              relation: '',
              phone: ''
            }
          });
        } catch (err) {
          if (err.response?.status === 404) {
            setError('Employee not found or does not belong to your hatchery');
            toast.error('Employee not found or does not belong to your hatchery');
          } else {
            setError(err.response?.data?.message || 'Failed to fetch employee');
            toast.error(err.response?.data?.message || 'Failed to fetch employee');
          }
        } finally {
          setLoading(false);
        }
      };
      fetchEmployee();
    } else {
      reset({
        emergencyContact: {
          name: '',
          relation: '',
          phone: ''
        }
      });
    }
  }, [id, reset, isEditMode]);

  const onSubmit = async (data) => {
    setLoading(true);
    setError(null);

    const employeeData = {
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      phone: data.phone,
      address: data.address,
      position: data.position,
      department: data.department,
      joiningDate: data.joiningDate,
      salary: data.salary,
      emergencyContact: data.emergencyContact,
      hatchery: user.hatcheryName
    };

    try {
      if (isEditMode) {
        await api.put(`/api/admin/employees/${id}`, employeeData);
        toast.success('Employee updated successfully');
      } else {
        await api.post('/api/admin/employees', employeeData);
        toast.success('Employee created successfully');
      }
      navigate('/admin/employees');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save employee');
      toast.error(err.response?.data?.message || 'Failed to save employee');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 ml-56">
      <h1 className="text-2xl font-bold mb-6">
        {isEditMode ? 'Edit' : 'Add'} Employee Details
      </h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="bg-white shadow rounded-lg p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Basic Information */}
          <div>
            <h2 className="text-lg font-medium mb-4">Basic Information</h2>
            {[
              { id: 'firstName', label: 'First Name', type: 'text', validation: 'First name is required' },
              { id: 'lastName', label: 'Last Name', type: 'text', validation: 'Last name is required' },
              {
                id: 'email', label: 'Email', type: 'email', validation: {
                  required: 'Email is required',
                  pattern: { value: /^\S+@\S+$/, message: 'Invalid email address' }
                }
              },
              { id: 'phone', label: 'Phone', type: 'tel', validation: 'Phone is required' },
              { id: 'address', label: 'Address', type: 'textarea', validation: 'Address is required' },
            ].map(({ id, label, type, validation }) => (
              <div key={id} className="mb-4">
                <label htmlFor={id} className="block text-gray-700 mb-2">{label} *</label>
                {type === 'textarea' ? (
                  <textarea
                    id={id}
                    {...register(id, { required: validation })}
                    className="w-full px-3 py-2 border border-gray-300 rounded"
                    disabled={loading}
                  />
                ) : (
                  <input
                    type={type}
                    id={id}
                    {...register(id, typeof validation === 'string' ? { required: validation } : validation)}
                    className="w-full px-3 py-2 border border-gray-300 rounded"
                    disabled={loading}
                  />
                )}
                {errors[id] && <p className="text-red-500 text-sm mt-1">{errors[id].message}</p>}
              </div>
            ))}
          </div>

          {/* Employment Details */}
          <div>
            <h2 className="text-lg font-medium mb-4">Employment Details</h2>
            {[
              { id: 'position', label: 'Position', type: 'text', validation: 'Position is required' },
              { id: 'department', label: 'Department', type: 'text', validation: 'Department is required' },
              { id: 'joiningDate', label: 'Joining Date', type: 'date', validation: 'Joining date is required' },
              {
                id: 'salary', label: 'Salary', type: 'number', validation: {
                  required: 'Salary is required',
                  min: { value: 0, message: 'Salary must be positive' }
                }
              },
            ].map(({ id, label, type, validation }) => (
              <div key={id} className="mb-4">
                <label htmlFor={id} className="block text-gray-700 mb-2">{label} *</label>
                <input
                  type={type}
                  id={id}
                  {...register(id, typeof validation === 'string' ? { required: validation } : validation)}
                  className="w-full px-3 py-2 border border-gray-300 rounded"
                  disabled={loading}
                />
                {errors[id] && <p className="text-red-500 text-sm mt-1">{errors[id].message}</p>}
              </div>
            ))}
          </div>

          {/* Emergency Contact */}
          <div>
            <h2 className="text-lg font-medium mb-4">Emergency Contact</h2>
            {[
              { id: 'name', label: 'Name', path: 'emergencyContact.name', validation: 'Emergency contact name is required' },
              { id: 'relation', label: 'Relation', path: 'emergencyContact.relation', validation: 'Emergency contact relation is required' },
              { id: 'phone', label: 'Phone', path: 'emergencyContact.phone', validation: 'Emergency contact phone is required' },
            ].map(({ id, label, path, validation }) => (
              <div key={id} className="mb-4">
                <label htmlFor={id} className="block text-gray-700 mb-2">{label} *</label>
                <input
                  type="text"
                  id={id}
                  {...register(path, { required: validation })}
                  className="w-full px-3 py-2 border border-gray-300 rounded"
                  disabled={loading}
                />
                {errors.emergencyContact?.[id] && <p className="text-red-500 text-sm mt-1">{errors.emergencyContact[id].message}</p>}
              </div>
            ))}
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            type="button"
            onClick={() => navigate('/admin/employees')}
            className="mr-4 px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-50"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-blue-300"
          >
            {loading ? 'Saving...' : isEditMode ? 'Update Employee' : 'Add Employee'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EmployeeForm;
