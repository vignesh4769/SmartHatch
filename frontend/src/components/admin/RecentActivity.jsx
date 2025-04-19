import React from 'react';
import { formatDistanceToNow } from 'date-fns';

const RecentActivity = ({ activities = [] }) => {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Recent Activities</h2>
      <div className="space-y-4">
        {activities.map((activity) => (
          <div key={activity._id} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
            <div>
              <p className="font-medium text-gray-900">{activity.name}</p>
              <p className="text-sm text-gray-500">{activity.email}</p>
            </div>
            <div className="text-sm text-gray-500">
              {formatDistanceToNow(new Date(activity.createdAt), { addSuffix: true })}
            </div>
          </div>
        ))}
        {activities.length === 0 && (
          <p className="text-gray-500 text-center py-4">No recent activities</p>
        )}
      </div>
    </div>
  );
};

export default RecentActivity;