import React from 'react';
import { useForm } from 'react-hook-form';
import { useMutation, useQueryClient } from 'react-query';
import { applyLeave } from '../api/employeeApi';
import { toast } from 'react-toastify';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const LeaveRequestForm = ({ onSuccess }) => {
  const { register, handleSubmit, formState: { errors }, control, setValue, watch } = useForm();
  const queryClient = useQueryClient();
  
  const mutation = useMutation(applyLeave, {
    onSuccess: () => {
      queryClient.invalidateQueries('leaves');
      toast.success('Leave application submitted successfully');
      onSuccess?.();
    },
    onError: (error) => {
      toast.error(error.message);
    }
  });

  const onSubmit = (data) => {
    mutation.mutate(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium">Start Date</label>
          <DatePicker
            selected={watch('startDate')}
            onChange={(date) => setValue('startDate', date)}
            minDate={new Date()}
            className="mt-1 block w-full border rounded-md shadow-sm py-2 px-3"
          />
          {errors.startDate && <p className="text-red-500 text-sm">Start date is required</p>}
        </div>
        
        <div>
          <label className="block text-sm font-medium">End Date</label>
          <DatePicker
            selected={watch('endDate')}
            onChange={(date) => setValue('endDate', date)}
            minDate={watch('startDate') || new Date()}
            className="mt-1 block w-full border rounded-md shadow-sm py-2 px-3"
          />
          {errors.endDate && <p className="text-red-500 text-sm">End date is required</p>}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium">Reason</label>
        <textarea
          {...register('reason', { required: 'Reason is required' })}
          rows={3}
          className="mt-1 block w-full border rounded-md shadow-sm py-2 px-3"
        />
        {errors.reason && <p className="text-red-500 text-sm">{errors.reason.message}</p>}
      </div>

      <button
        type="submit"
        className="bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600"
        disabled={mutation.isLoading}
      >
        {mutation.isLoading ? 'Submitting...' : 'Submit Leave Request'}
      </button>
    </form>
  );
};

export default LeaveRequestForm;