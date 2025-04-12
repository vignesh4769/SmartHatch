import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { format } from 'date-fns';
import messApi from '../../api/messApi';
import { toast } from 'react-toastify';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const MessManagement = () => {
  const queryClient = useQueryClient();
  const [selectedDate, setSelectedDate] = useState(format(new Date(), 'yyyy-MM-dd'));

  // Fetch mess schedules
  const { data: schedules, isLoading } = useQuery({
    queryKey: ['messSchedules', selectedDate],
    queryFn: () => messApi.getMessSchedules(selectedDate, selectedDate),
  });

  // Fetch mess statistics
  const { data: stats } = useQuery({
    queryKey: ['messStats'],
    queryFn: messApi.getMessStats,
  });

  const { register, handleSubmit, reset } = useForm();

  // Create schedule mutation
  const createScheduleMutation = useMutation({
    mutationFn: messApi.createMessSchedule,
    onSuccess: () => {
      queryClient.invalidateQueries(['messSchedules']);
      toast.success('Meal schedule created successfully');
      reset();
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to create meal schedule');
    },
  });

  // Update schedule mutation
  const updateScheduleMutation = useMutation({
    mutationFn: ({ id, data }) => messApi.updateMessSchedule(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['messSchedules']);
      toast.success('Meal schedule updated successfully');
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to update meal schedule');
    },
  });

  // Delete schedule mutation
  const deleteScheduleMutation = useMutation({
    mutationFn: messApi.deleteMessSchedule,
    onSuccess: () => {
      queryClient.invalidateQueries(['messSchedules']);
      toast.success('Meal schedule deleted successfully');
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to delete meal schedule');
    },
  });

  const onSubmit = (data) => {
    createScheduleMutation.mutate({
      date: selectedDate,
      ...data,
    });
  };

  return (
    <div className="container mx-auto p-6 ml-48">
      <h2 className="text-3xl font-bold text-center mb-6">Mess Management</h2>
      <p className="text-center text-gray-600 mb-4">Manage daily food schedules for employees.</p>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="stat bg-base-100 shadow rounded-lg">
          <div className="stat-title">Total Meals Served</div>
          <div className="stat-value">{stats?.totalMeals || 0}</div>
        </div>
        <div className="stat bg-base-100 shadow rounded-lg">
          <div className="stat-title">Today's Attendance</div>
          <div className="stat-value">{stats?.todayAttendance || 0}</div>
        </div>
        <div className="stat bg-base-100 shadow rounded-lg">
          <div className="stat-title">Special Requests</div>
          <div className="stat-value">{stats?.specialRequests || 0}</div>
        </div>
      </div>

      {/* Date Selection */}
      <div className="card bg-base-100 shadow-lg p-4 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold">Mess Schedule</h3>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="input input-bordered"
          />
        </div>

        {isLoading ? (
          <div className="flex justify-center p-4">
            <span className="loading loading-spinner loading-lg"></span>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="table w-full">
              <thead>
                <tr>
                  <th>Meal Type</th>
                  <th>Menu</th>
                  <th>Time</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {schedules?.map((schedule) => (
                  <tr key={schedule._id}>
                    <td>{schedule.mealType}</td>
                    <td>{schedule.menu}</td>
                    <td>{schedule.time}</td>
                    <td className="flex gap-2">
                      <button
                        className="btn btn-sm btn-warning"
                        onClick={() => updateScheduleMutation.mutate({
                          id: schedule._id,
                          data: { ...schedule, status: 'modified' }
                        })}
                      >
                        Edit
                      </button>
                      <button
                        className="btn btn-sm btn-error"
                        onClick={() => deleteScheduleMutation.mutate(schedule._id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add New Schedule Form */}
      <div className="card bg-base-100 shadow-lg p-4">
        <h3 className="text-xl font-semibold mb-4">Add New Schedule</h3>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="form-control">
            <label className="label">
              <span className="label-text">Meal Type</span>
            </label>
            <select {...register('mealType')} className="select select-bordered w-full">
              <option value="breakfast">Breakfast</option>
              <option value="lunch">Lunch</option>
              <option value="snacks">Snacks</option>
              <option value="dinner">Dinner</option>
            </select>
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text">Menu</span>
            </label>
            <textarea
              {...register('menu')}
              className="textarea textarea-bordered h-24"
              placeholder="Enter menu items..."
            />
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text">Time</span>
            </label>
            <input
              type="time"
              {...register('time')}
              className="input input-bordered"
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary w-full"
            disabled={createScheduleMutation.isLoading}
          >
            {createScheduleMutation.isLoading ? (
              <span className="loading loading-spinner"></span>
            ) : (
              '🍽 Add Schedule'
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default MessManagement;