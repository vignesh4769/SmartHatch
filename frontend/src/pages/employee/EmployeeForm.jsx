import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/axiosConfig';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';

const EmployeeForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { register, handleSubmit, formState: { errors }, reset } = useForm();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (id && id !== 'new') {
      const fetchEmployee = async () => {
        try {
          const response = await api.get(`/api/employees/${id}`);
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
          setError(err.response?.data?.error || 'Failed to fetch employee');
        }
      };
      fetchEmployee();
    }
  }, [id, reset]);

  const onSubmit = async (data) => {
    setLoading(true);
    setError(null);

    try {
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
        emergencyContact: {
          name: data.emergencyContactName,
          relation: data.emergencyContactRelation,
          phone: data.emergencyContactPhone
        },
        hatchery: user.hatcheryName
      };

      if (id && id !== 'new') {
        await api.put(`/api/employees/${id}`, employeeData);
        toast.success('Employee updated successfully');
      } else {
        await api.post('/api/employees', employeeData);
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
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">
        {id && id !== 'new' ? 'Edit Employee' : 'Add New Employee'}
      </h1>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="bg-white shadow rounded-lg p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h2 className="text-lg font-medium mb-4">Basic Information</h2>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2" htmlFor="firstName">
                First Name *
              </label>
              <input
                type="text"
                id="firstName"
                {...register("firstName", { required: "First name is required" })}
                className="w-full px-3 py-2 border border-gray-300 rounded"
              />
              {errors.firstName && <p className="text-red-500 text-sm mt-1">{errors.firstName.message}</p>}
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2" htmlFor="lastName">
                Last Name *
              </label>
              <input
                type="text"
                id="lastName"
                {...register("lastName", { required: "Last name is required" })}
                className="w-full px-3 py-2 border border-gray-300 rounded"
              />
              {errors.lastName && <p className="text-red-500 text-sm mt-1">{errors.lastName.message}</p>}
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2" htmlFor="email">
                Email *
              </label>
              <input
                type="email"
                id="email"
                {...register("email", { 
                  required: "Email is required",
                  pattern: {
                    value: /^\S+@\S+$/i,
                    message: "Invalid email address"
                  }
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded"
              />
              {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2" htmlFor="phone">
                Phone *
              </label>
              <input
                type="tel"
                id="phone"
                {...register("phone", { required: "Phone is required" })}
                className="w-full px-3 py-2 border border-gray-300 rounded"
              />
              {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>}
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2" htmlFor="address">
                Address *
              </label>
              <textarea
                id="address"
                {...register("address", { required: "Address is required" })}
                className="w-full px-3 py-2 border border-gray-300 rounded"
              />
              {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address.message}</p>}
            </div>
          </div>

          <div>
            <h2 className="text-lg font-medium mb-4">Employment Details</h2>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2" htmlFor="position">
                Position *
              </label>
              <input
                type="text"
                id="position"
                {...register("position", { required: "Position is required" })}
                className="w-full px-3 py-2 border border-gray-300 rounded"
              />
              {errors.position && <p className="text-red-500 text-sm mt-1">{errors.position.message}</p>}
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2" htmlFor="department">
                Department *
              </label>
              <input
                type="text"
                id="department"
                {...register("department", { required: "Department is required" })}
                className="w-full px-3 py-2 border border-gray-300 rounded"
              />
              {errors.department && <p className="text-red-500 text-sm mt-1">{errors.department.message}</p>}
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2" htmlFor="joiningDate">
                Joining Date *
              </label>
              <input
                type="date"
                id="joiningDate"
                {...register("joiningDate", { required: "Joining date is required" })}
                className="w-full px-3 py-2 border border-gray-300 rounded"
              />
              {errors.joiningDate && <p className="text-red-500 text-sm mt-1">{errors.joiningDate.message}</p>}
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2" htmlFor="salary">
                Salary *
              </label>
              <input
                type="number"
                id="salary"
                {...register("salary", { 
                  required: "Salary is required",
                  min: {
                    value: 0,
                    message: "Salary must be positive"
                  }
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded"
              />
              {errors.salary && <p className="text-red-500 text-sm mt-1">{errors.salary.message}</p>}
            </div>
          </div>

          <div>
            <h2 className="text-lg font-medium mb-4">Emergency Contact</h2>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2" htmlFor="emergencyContact.name">
                Name *
              </label>
              <input
                type="text"
                id="emergencyContact.name"
                {...register("emergencyContact.name", { required: "Emergency contact name is required" })}
                className="w-full px-3 py-2 border border-gray-300 rounded"
              />
              {errors.emergencyContact?.name && <p className="text-red-500 text-sm mt-1">{errors.emergencyContact.name.message}</p>}
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2" htmlFor="emergencyContact.relation">
                Relation *
              </label>
              <input
                type="text"
                id="emergencyContact.relation"
                {...register("emergencyContact.relation", { required: "Emergency contact relation is required" })}
                className="w-full px-3 py-2 border border-gray-300 rounded"
              />
              {errors.emergencyContact?.relation && <p className="text-red-500 text-sm mt-1">{errors.emergencyContact.relation.message}</p>}
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2" htmlFor="emergencyContact.phone">
                Phone *
              </label>
              <input
                type="tel"
                id="emergencyContact.phone"
                {...register("emergencyContact.phone", { required: "Emergency contact phone is required" })}
                className="w-full px-3 py-2 border border-gray-300 rounded"
              />
              {errors.emergencyContact?.phone && <p className="text-red-500 text-sm mt-1">{errors.emergencyContact.phone.message}</p>}
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            type="button"
            onClick={() => navigate('/admin/employees')}
            className="mr-4 px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-blue-300"
          >
            {loading ? 'Saving...' : 'Save Employee'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EmployeeForm;