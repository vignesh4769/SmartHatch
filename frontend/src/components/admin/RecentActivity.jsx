import React from 'react';
import { format } from 'date-fns';

const RecentActivity = ({ activities }) => {
  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h2 className="text-lg font-medium text-gray-900 mb-4">Recent Activity</h2>
      <div className="space-y-4">
        {activities?.length > 0 ? (
          activities.map((activity) => (
            <div key={activity._id} className="border-b border-gray-200 pb-4 last:border-0">
              <div className="flex justify-between">
                <p className="text-sm font-medium">{activity.message}</p>
                <span className="text-xs text-gray-500">
                  {activity.createdAt ? format(new Date(activity.createdAt), 'MMM dd, h:mm a') : 'Invalid date'}
                </span>
              </div>
              {activity.details && (
                <p className="text-xs text-gray-500 mt-1">{activity.details}</p>
              )}
            </div>
          ))
        ) : (
          <p className="text-sm text-gray-500">No recent activity</p>
        )}
      </div>
    </div>
  );
};

export default RecentActivity; // Added default export