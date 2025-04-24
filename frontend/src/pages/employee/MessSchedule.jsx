import React, { useState, useEffect } from "react";
import dayjs from "dayjs";
import {
  Table,
  message,
} from 'antd';
import messApi from '../../api/messApi';

const MessSchedule = () => {
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchSchedules();
  }, []);

  const fetchSchedules = async () => {
    try {
      setLoading(true);
      const data = await messApi.getEmployeeMess();
      setSchedules(data);
    } catch (error) {
      console.error('Error fetching schedules:', error);
      message.error('Failed to fetch mess schedules');
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
      render: (date) => dayjs(date).format('MMM D, YYYY'),
    },
    {
      title: 'Meal',
      dataIndex: 'mealType',
      key: 'mealType',
      render: (type) => type.charAt(0).toUpperCase() + type.slice(1),
    },
    {
      title: 'Time',
      key: 'time',
      render: (_, record) => `${record.startTime} - ${record.endTime}`,
    },
    {
      title: 'Menu Items',
      dataIndex: 'menu',
      key: 'menu',
      render: (menu) => (
        <div className="max-w-xs">
          {menu?.length > 0 ? (
            <ul className="list-disc list-inside">
              {menu.slice(0, 3).map((item, index) => (
                <li key={index} className="truncate">
                  {item.name}
                  {item.category === 'special' && (
                    <span className="ml-2 text-blue-500 text-xs">(Special)</span>
                  )}
                </li>
              ))}
              {menu.length > 3 && (
                <li className="text-gray-500 text-sm">
                  +{menu.length - 3} more items
                </li>
              )}
            </ul>
          ) : (
            <span className="text-gray-400">No items</span>
          )}
        </div>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <span className={`px-2 py-1 rounded ${status === 'scheduled' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </span>
      ),
    }
  ];

  return (
    <div className="flex-1 ml-64 p-8 bg-gray-100 min-h-screen">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Mess Schedule</h1>
            <p className="text-gray-600 mt-1">View today's mess menu and schedule</p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <Table
            columns={columns}
            dataSource={schedules}
            rowKey="_id"
            loading={loading}
            pagination={{ pageSize: 10 }}
            className="ant-table-striped"
          />
        </div>
      </div>
    </div>
  );
};

export default MessSchedule;
