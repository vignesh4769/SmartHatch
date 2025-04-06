import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import InputField from '../common/InputField';
import Button from '../common/Button';
import employeeAPI from '../../api/employeeAPI';
import MultiSelect from '../common/MultiSelect';

const RunForm = ({ onSubmit, initialData, loading }) => {
  const { register, handleSubmit, formState: { errors }, control } = useForm({
    defaultValues: initialData || {
      startDate: new Date().toISOString().split('T')[0],
      endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    }
  });

  const [employees, setEmployees] = useState([]);
  const [employeeOptions, setEmployeeOptions] = useState([]);
  const [fetchingEmployees, setFetchingEmployees] = useState(false);

  useEffect(() => {
    const fetchEmployees = async () => {
      setFetchingEmployees(true);
      try {
        const { data } = await employeeAPI.getEmployees();
        setEmployees(data.employees);
        setEmployeeOptions(
          data.employees.map(emp => ({
            value: emp._id,
            label: `${emp.employeeId} - ${emp.user.name} (${emp.designation})`
          }))
        );
      } catch (error) {
        console.error('Error fetching employees:', error);
      } finally {
        setFetchingEmployees(false);
      }
    };

    fetchEmployees();
  }, []);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <InputField
        label="Run Name"
        id="name"
        type="text"
        {...register('name', { required: 'Run name is required' })}
        error={errors.name}
      />

      <InputField
        label="Description"
        id="description"
        type="text"
        {...register('description')}
        multiline
        rows={2}
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <InputField
          label="Start Date"
          id="startDate"
          type="date"
          {...register('startDate', { required: 'Start date is required' })}
          error={errors.startDate}
        />

        <InputField
          label="End Date"
          id="endDate"
          type="date"
          {...register('endDate', { 
            required: 'End date is required',
            validate: value => {
              const startDate = new Date(control._formValues.startDate);
              const endDate = new Date(value);
              return endDate > startDate || 'End date must be after start date';
            }
          })}
          error={errors.endDate}
        />
      </div>

      <InputField
        label="Budget (₹)"
        id="budget"
        type="number"
        {...register('budget', { 
          required: 'Budget is required',
          min: {
            value: 0,
            message: 'Budget must be positive'
          }
        })}
        error={errors.budget}
      />

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Assign Employees
        </label>
        <MultiSelect
          options={employeeOptions}
          isLoading={fetchingEmployees}
          {...register('employeeIds', { required: 'At least one employee is required' })}
          error={errors.employeeIds}
        />
        {errors.employeeIds && (
          <p className="mt-2 text-sm text-red-600">{errors.employeeIds.message}</p>
        )}
      </div>

      <div className="pt-4">
        <Button type="submit" loading={loading}>
          {initialData ? 'Update Run' : 'Create Run'}
        </Button>
      </div>
    </form>
  );
};

export default RunForm;