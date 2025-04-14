import React, { useState } from "react";
import { FaUtensils, FaClock, FaStar, FaBell, FaCalendar } from "react-icons/fa";

const MessSchedule = () => {
  const weeklySchedule = [
    {
      _id: '1',
      date: new Date(),
      breakfast: 'Masala Dosa, Sambar, Coconut Chutney, Tea/Coffee',
      breakfastTime: '7:30 AM - 9:30 AM',
      lunch: 'Rice, Dal Tadka, Mixed Veg Curry, Roti, Curd, Salad',
      lunchTime: '12:30 PM - 2:30 PM',
      dinner: 'Chapati, Paneer Butter Masala, Jeera Rice, Dal Fry, Salad',
      dinnerTime: '7:30 PM - 9:30 PM',
      weeklySpecial: 'Chef Special: Hyderabadi Biryani & Gulab Jamun'
    },
    {
      _id: '2',
      date: new Date(Date.now() + 86400000),
      breakfast: 'Poha, Upma, Boiled Eggs, Bread Toast, Tea/Coffee',
      breakfastTime: '7:30 AM - 9:30 AM',
      lunch: 'Rice, Rajma, Aloo Gobi, Roti, Raita, Papad',
      lunchTime: '12:30 PM - 2:30 PM',
      dinner: 'Chapati, Mix Veg Curry, Veg Pulao, Dal Tadka, Salad',
      dinnerTime: '7:30 PM - 9:30 PM',
      weeklySpecial: 'Chef Special: Hyderabadi Biryani & Gulab Jamun'
    },
    {
      _id: '3',
      date: new Date(Date.now() + 172800000),
      breakfast: 'Idli, Vada, Sambar, Mint Chutney, Tea/Coffee',
      breakfastTime: '7:30 AM - 9:30 AM',
      lunch: 'Rice, Dal Fry, Bhindi Masala, Roti, Buttermilk, Salad',
      lunchTime: '12:30 PM - 2:30 PM',
      dinner: 'Chapati, Matar Paneer, Veg Biryani, Dal Makhani, Salad',
      dinnerTime: '7:30 PM - 9:30 PM',
      weeklySpecial: 'Chef Special: Hyderabadi Biryani & Gulab Jamun'
    },
    {
      _id: '4',
      date: new Date(Date.now() + 259200000),
      breakfast: 'Puri Bhaji, Boiled Eggs, Bread Toast, Tea/Coffee',
      breakfastTime: '7:30 AM - 9:30 AM',
      lunch: 'Rice, Sambar, Cabbage Poriyal, Roti, Curd Rice, Papad',
      lunchTime: '12:30 PM - 2:30 PM',
      dinner: 'Chapati, Palak Paneer, Jeera Rice, Dal Fry, Salad',
      dinnerTime: '7:30 PM - 9:30 PM',
      weeklySpecial: 'Chef Special: Hyderabadi Biryani & Gulab Jamun'
    }
  ];

  const [schedule] = useState(weeklySchedule);
  const [activeDay, setActiveDay] = useState(0);

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="flex">
      <div className="flex-1 ml-64 p-8 bg-gray-100 min-h-screen">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Mess Schedule</h1>
              <p className="text-gray-600 mt-1">Weekly meal schedule and timings</p>
            </div>
            <div className="flex items-center gap-2">
              <FaCalendar className="text-blue-600" />
              <span className="text-gray-600 font-medium">{formatDate(new Date())}</span>
            </div>
          </div>

          {/* Today's Special */}
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-6 text-white mb-8">
            <div className="flex items-center gap-3 mb-3">
              <FaStar className="text-yellow-300" />
              <h2 className="text-xl font-semibold">Today's Special</h2>
            </div>
            <p className="text-blue-100">{schedule[0]?.weeklySpecial}</p>
          </div>

          {/* Meal Schedule Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {/* Breakfast Card */}
            <div className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-800">Breakfast</h3>
                <div className="bg-yellow-100 p-2 rounded-full">
                  <FaClock className="text-yellow-600" />
                </div>
              </div>
              <p className="text-sm text-gray-600 mb-2">{schedule[activeDay]?.breakfastTime}</p>
              <p className="text-gray-800">{schedule[activeDay]?.breakfast}</p>
            </div>

            {/* Lunch Card */}
            <div className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-800">Lunch</h3>
                <div className="bg-green-100 p-2 rounded-full">
                  <FaClock className="text-green-600" />
                </div>
              </div>
              <p className="text-sm text-gray-600 mb-2">{schedule[activeDay]?.lunchTime}</p>
              <p className="text-gray-800">{schedule[activeDay]?.lunch}</p>
            </div>

            {/* Dinner Card */}
            <div className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-800">Dinner</h3>
                <div className="bg-purple-100 p-2 rounded-full">
                  <FaClock className="text-purple-600" />
                </div>
              </div>
              <p className="text-sm text-gray-600 mb-2">{schedule[activeDay]?.dinnerTime}</p>
              <p className="text-gray-800">{schedule[activeDay]?.dinner}</p>
            </div>
          </div>

          {/* Weekly Schedule */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-800">Weekly Schedule</h2>
              <FaUtensils className="text-2xl text-blue-600" />
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Breakfast</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Lunch</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Dinner</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {schedule.map((day, index) => (
                   <tr 
                   key={day._id}
                   className={`hover:bg-gray-50 cursor-pointer ${index === activeDay ? 'bg-blue-50' : ''}`}
                   onClick={() => setActiveDay(index)}
                 >
                 
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{formatDate(day.date)}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">{day.breakfast}</div>
                        <div className="text-xs text-gray-500">{day.breakfastTime}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">{day.lunch}</div>
                        <div className="text-xs text-gray-500">{day.lunchTime}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">{day.dinner}</div>
                        <div className="text-xs text-gray-500">{day.dinnerTime}</div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessSchedule;