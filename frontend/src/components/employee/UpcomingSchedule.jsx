import React from 'react';

const UpcomingSchedule = ({ schedule }) => {
  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h2 className="text-lg font-medium text-gray-900 mb-4">Upcoming Schedule</h2>
      <div className="space-y-3">
        {schedule?.length > 0 ? (
          schedule.map((item) => (
            <div key={item._id} className="flex justify-between items-center border-b border-gray-100 pb-3">
              <div>
                <p className="font-medium">{item.title}</p>
                <p className="text-sm text-gray-500">{item.date}</p>
              </div>
              <span className={`px-2 py-1 text-xs rounded-full ${
                item.type === 'task' 
                  ? 'bg-blue-100 text-blue-800' 
                  : 'bg-green-100 text-green-800'
              }`}>
                {item.type}
              </span>
            </div>
          ))
        ) : (
          <p className="text-sm text-gray-500">No upcoming schedule</p>
        )}
      </div>
    </div>
  );
};

export default UpcomingSchedule; // Make sure to include default export