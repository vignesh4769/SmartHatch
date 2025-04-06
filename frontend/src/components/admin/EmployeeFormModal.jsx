import React from 'react';
import { useForm } from 'react-hook-form';

const EmployeeFormModal = ({
  isOpen,
  onClose,
  employee,
  onSuccess,
  isSubmitting
}) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm();

  React.useEffect(() => {
    reset({
      name: employee?.name || '',
      email: employee?.email || '',
      phone: employee?.phone || '',
      jobTitle: employee?.jobTitle || '',
      department: employee?.department || '',
      salary: employee?.salary || '',
      shift: employee?.shift || 'Morning',
      address: employee?.address || '',
      country: employee?.country || ''
    });
  }, [employee, reset]);

  const onSubmit = (data) => {
    onSuccess(data);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-auto p-4">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-lg">
        <h2 className="text-xl font-bold mb-4">
          {employee ? 'Edit Employee' : 'Add Employee'}
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-4">

          {/* Name */}
          <div>
            <label className="block mb-1 text-sm font-medium">Name *</label>
            <input
              {...register('name', { required: 'Name is required' })}
              className="w-full p-2 border rounded"
              disabled={isSubmitting}
            />
            {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
          </div>

          {/* Email */}
          <div>
            <label className="block mb-1 text-sm font-medium">Email *</label>
            <input
              type="email"
              {...register('email', {
                required: 'Email is required',
                pattern: {
                  value: /^\S+@\S+$/i,
                  message: 'Invalid email format'
                }
              })}
              className="w-full p-2 border rounded"
              disabled={isSubmitting || !!employee}
            />
            {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
          </div>

          {/* Phone */}
          <div>
            <label className="block mb-1 text-sm font-medium">Phone</label>
            <input
              {...register('phone')}
              className="w-full p-2 border rounded"
              disabled={isSubmitting}
            />
          </div>

          {/* Job Title */}
          <div>
            <label className="block mb-1 text-sm font-medium">Job Title</label>
            <input
              {...register('jobTitle')}
              className="w-full p-2 border rounded"
              disabled={isSubmitting}
            />
          </div>

          {/* Department */}
          <div>
            <label className="block mb-1 text-sm font-medium">Department</label>
            <input
              {...register('department')}
              className="w-full p-2 border rounded"
              disabled={isSubmitting}
            />
          </div>

          {/* Salary */}
          <div>
            <label className="block mb-1 text-sm font-medium">Salary</label>
            <input
              type="number"
              {...register('salary')}
              className="w-full p-2 border rounded"
              disabled={isSubmitting}
            />
          </div>

          {/* Shift */}
          <div>
            <label className="block mb-1 text-sm font-medium">Shift</label>
            <select
              {...register('shift')}
              className="w-full p-2 border rounded"
              disabled={isSubmitting}
            >
              <option value="Morning">Morning</option>
              <option value="Evening">Evening</option>
              <option value="Night">Night</option>
            </select>
          </div>

          {/* Address */}
          <div className="md:col-span-2">
            <label className="block mb-1 text-sm font-medium">Address</label>
            <textarea
              {...register('address')}
              className="w-full p-2 border rounded"
              disabled={isSubmitting}
            />
          </div>

          {/* Country */}
          <div className="md:col-span-2">
            <label className="block mb-1 text-sm font-medium">Country</label>
            <input
              {...register('country')}
              className="w-full p-2 border rounded"
              disabled={isSubmitting}
            />
          </div>

          {/* Buttons */}
          <div className="col-span-1 md:col-span-2 flex justify-end space-x-2 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border rounded"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-blue-300"
              disabled={isSubmitting}
            >
              {isSubmitting ? (employee ? 'Updating...' : 'Creating...') : (employee ? 'Update' : 'Create')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EmployeeFormModal;
