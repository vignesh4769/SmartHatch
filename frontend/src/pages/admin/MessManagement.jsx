import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { format } from 'date-fns';
import messApi from '../../api/messApi';
import { toast } from 'react-toastify';

const MessManagement = () => {
  const queryClient = useQueryClient();
  const [selectedDate, setSelectedDate] = useState(format(new Date(), 'yyyy-MM-dd'));

  // Add a test schedule on component mount
  useEffect(() => {
    const createTestSchedule = async () => {
      try {
        const testSchedule = {
          date: selectedDate,
          mealType: 'breakfast',
          menu: [
            { name: 'Idli', category: 'breakfast', cost: 0 },
            { name: 'Sambar', category: 'breakfast', cost: 0 },
            { name: 'Chutney', category: 'breakfast', cost: 0 }
          ],
          startTime: '08:00',
          endTime: '10:00'
        };
        await messApi.createMessSchedule(testSchedule);
        queryClient.invalidateQueries({ queryKey: ['messSchedules', selectedDate] });
      } catch (error) {
        console.error('Error creating test schedule:', error);
      }
    };

    createTestSchedule();
  }, []);

  const { data: schedules, isLoading } = useQuery({
    queryKey: ['messSchedules', selectedDate],
    queryFn: () => messApi.getMessSchedules(selectedDate, selectedDate),
  });

  const { data: stats } = useQuery({
    queryKey: ['messStats'],
    queryFn: messApi.getMessStats,
  });

  const { register, handleSubmit, reset } = useForm();

  const createScheduleMutation = useMutation({
    mutationFn: messApi.createMessSchedule,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['messSchedules', selectedDate] });
      toast.success('Meal schedule created successfully');
      reset();
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to create meal schedule');
    },
  });

  const deleteScheduleMutation = useMutation({
    mutationFn: messApi.deleteMessSchedule,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['messSchedules', selectedDate] });
      toast.success('Meal schedule deleted successfully');
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to delete meal schedule');
    },
  });

  const onSubmit = (data) => {
    const menuItems = data.menu.split('\n')
      .filter(item => item.trim())
      .map(item => ({
        name: item.trim(),
        category: data.mealType,
        cost: 0
      }));

    const payload = {
      date: selectedDate,
      mealType: data.mealType,
      menu: menuItems,
      startTime: data.startTime,
      endTime: data.endTime
    };
    createScheduleMutation.mutate(payload);
  };

  return (
    <div className="pt-20 pl-56 pr-6 pb-10 min-h-screen bg-gray-50">
      <h2 className="text-3xl font-bold mb-2 text-center text-gray-800">Mess Management</h2>
      <p className="text-center text-gray-600 mb-8">Manage daily food schedules for employees.</p>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="text-sm text-gray-500">Total Meals Served</div>
          <div className="text-2xl font-bold">{stats?.data?.totalMeals || 0}</div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="text-sm text-gray-500">Today's Attendance</div>
          <div className="text-2xl font-bold">{stats?.data?.todayAttendance || 0}</div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="text-sm text-gray-500">Special Requests</div>
          <div className="text-2xl font-bold">{stats?.data?.specialRequests || 0}</div>
        </div>
      </div>

      {/* Date Selection & Table */}
      <div className="bg-white shadow rounded-lg p-6 mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-4">
          <h3 className="text-xl font-semibold text-gray-800">Mess Schedule</h3>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="input input-bordered w-full md:w-60"
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
                {Array.isArray(schedules?.data) && schedules.data.map(schedule => (
                  <tr key={schedule._id}>
                    <td className="capitalize">{schedule.meal}</td>
                    <td>
                      <ul className="list-disc list-inside">
                        {schedule.menu.map((item, index) => (
                          <li key={index}>{item.name}</li>
                        ))}
                      </ul>
                    </td>
                    <td>{schedule.startTime} - {schedule.endTime}</td>
                    <td>
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
      <div className="bg-white shadow rounded-lg p-6">
        <h3 className="text-xl font-semibold mb-4 text-gray-800">Add New Schedule</h3>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Meal Type</label>
            <select {...register('mealType')} className="select select-bordered w-full">
              <option value="breakfast">Breakfast</option>
              <option value="lunch">Lunch</option>
              <option value="snacks">Snacks</option>
              <option value="dinner">Dinner</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Menu</label>
            <textarea
              {...register('menu', { required: 'Menu is required' })}
              className="textarea textarea-bordered w-full h-24"
              placeholder="Enter menu items (one per line)..."
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Start Time</label>
              <input
                type="time"
                {...register('startTime', { required: 'Start time is required' })}
                className="input input-bordered w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">End Time</label>
              <input
                type="time"
                {...register('endTime', { required: 'End time is required' })}
                className="input input-bordered w-full"
              />
            </div>
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
