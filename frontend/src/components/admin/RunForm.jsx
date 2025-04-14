import React, { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import InputField from '../common/InputField';
import Button from '../common/Button';
import Select from 'react-select';
import employeeAPI from '../../api/employeeAPI';

const RunForm = ({ onSubmit, initialData, loading }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    setValue,
    getValues
  } = useForm({
    defaultValues: initialData || {
      runNumber: '',
      description: '',
      startDate: new Date().toISOString().split('T')[0],
      expectedEndDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      hatchery: '',
      financials: { budget: 0 },
      assignedEmployees: []
    }
  });

  const [employeeOptions, setEmployeeOptions] = useState([]);
  const [fetchingEmployees, setFetchingEmployees] = useState(false);

  useEffect(() => {
    const fetchEmployees = async () => {
      setFetchingEmployees(true);
      try {
        const response = await employeeAPI.getEmployees();
        const employeesData = response.data || response;
        const hatcheryEmployees = employeesData.filter(
          emp => emp.hatchery === (initialData?.hatchery || 'Bhavani Hatchery')
        );
        setEmployeeOptions(
          hatcheryEmployees.map(emp => ({
            value: emp._id,
            label: `${emp.employeeId} - ${emp.firstName} ${emp.lastName} (${emp.position})`
          }))
        );
      } catch (error) {
        console.error('Error fetching employees:', error);
      } finally {
        setFetchingEmployees(false);
      }
    };

    fetchEmployees();
  }, [initialData?.hatchery]);

  const handleEmployeeChange = (selectedOptions) => {
    const updatedAssignments = selectedOptions.map(option => {
      const existing = (initialData?.assignedEmployees || []).find(
        assignment => assignment.employee === option.value
      );
      return {
        employee: option.value,
        role: existing?.role || '',
        shift: existing?.shift || ''
      };
    });
    setValue('assignedEmployees', updatedAssignments, { shouldValidate: true });
  };

  return (
    <form
      onSubmit={handleSubmit(data => {
        onSubmit({
          ...data,
          budget: parseFloat(data.financials.budget),
          assignedEmployees: data.assignedEmployees.filter(
            assignment => assignment.employee && assignment.role && assignment.shift
          )
        });
      })}
      className="space-y-4"
    >
      <InputField
        label="Run Number"
        id="runNumber"
        type="text"
        {...register('runNumber', { required: 'Run number is required' })}
        error={errors.runNumber?.message}
      />

      <InputField
        label="Description"
        id="description"
        type="text"
        {...register('description')}
        multiline
        rows={2}
      />

      <InputField
        label="Hatchery"
        id="hatchery"
        type="text"
        {...register('hatchery', { required: 'Hatchery is required' })}
        error={errors.hatchery?.message}
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <InputField
          label="Start Date"
          id="startDate"
          type="date"
          {...register('startDate', {
            required: 'Start date is required',
            validate: value => {
              const endDate = getValues('expectedEndDate');
              return new Date(value) <= new Date(endDate) || 'Start date must be before end date';
            }
          })}
          error={errors.startDate?.message}
        />

        <InputField
          label="Expected End Date"
          id="expectedEndDate"
          type="date"
          {...register('expectedEndDate', {
            required: 'End date is required',
            validate: value => {
              const startDate = getValues('startDate');
              return new Date(value) >= new Date(startDate) || 'End date must be after start date';
            }
          })}
          error={errors.expectedEndDate?.message}
        />
      </div>

      <InputField
        label="Budget (₹)"
        id="budget"
        type="number"
        step="0.01"
        {...register('financials.budget', {
          required: 'Budget is required',
          min: { value: 0, message: 'Budget must be positive' }
        })}
        error={errors.financials?.budget?.message}
      />

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Assign Employees
        </label>
        <Controller
          name="assignedEmployees"
          control={control}
          rules={{
            validate: value => value.length > 0 || 'At least one employee is required'
          }}
          render={({ field }) => (
            <Select
              isMulti
              options={employeeOptions}
              isLoading={fetchingEmployees}
              onChange={selected => handleEmployeeChange(selected || [])}
              value={employeeOptions.filter(option =>
                field.value?.some(assignment => assignment.employee === option.value)
              )}
              placeholder="Select employees..."
              classNamePrefix="react-select"
              styles={{
                control: (base) => ({
                  ...base,
                  borderColor: errors.assignedEmployees ? '#dc2626' : base.borderColor,
                  '&:hover': {
                    borderColor: errors.assignedEmployees ? '#dc2626' : base['&:hover']?.borderColor
                  }
                })
              }}
            />
          )}
        />
        {errors.assignedEmployees && (
          <p className="mt-2 text-sm text-red-600">{errors.assignedEmployees.message}</p>
        )}

        {getValues('assignedEmployees')?.map((assignment, index) => (
          <div key={assignment.employee} className="mt-2 p-4 border rounded-lg">
            <p className="font-medium">
              {employeeOptions.find(opt => opt.value === assignment.employee)?.label || 'Unknown Employee'}
            </p>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 mt-2">
              <InputField
                label="Role"
                id={`assignedEmployees.${index}.role`}
                type="text"
                {...register(`assignedEmployees.${index}.role`, {
                  required: 'Role is required'
                })}
                error={errors.assignedEmployees?.[index]?.role?.message}
              />
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Shift
                </label>
                <select
                  {...register(`assignedEmployees.${index}.shift`, {
                    required: 'Shift is required'
                  })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  defaultValue={assignment.shift || ''}
                >
                  <option value="">Select shift</option>
                  <option value="morning">Morning</option>
                  <option value="afternoon">Afternoon</option>
                  <option value="night">Night</option>
                </select>
                {errors.assignedEmployees?.[index]?.shift && (
                  <p className="mt-2 text-sm text-red-600">
                    {errors.assignedEmployees[index].shift.message}
                  </p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="pt-4 flex justify-end">
        <Button
          type="submit"
          loading={loading}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white"
        >
          {initialData ? 'Update Run' : 'Create Run'}
        </Button>
      </div>
    </form>
  );
};

export default RunForm;
