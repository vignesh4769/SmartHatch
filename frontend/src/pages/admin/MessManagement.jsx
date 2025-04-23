import React, { useState, useEffect } from "react";
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  TimePicker,
  Select,
  DatePicker,
  Space,
  message,
} from "antd";
import { FiPlus, FiEdit2, FiTrash2, FiMinusCircle } from "react-icons/fi";
import messApi from "../../api/messApi";
import dayjs from "dayjs";

const { Option } = Select;
const { TextArea } = Input;

const MessManagement = () => {
  const [schedules, setSchedules] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentSchedule, setCurrentSchedule] = useState(null);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchSchedules();
  }, []);

  const fetchSchedules = async () => {
    try {
      setLoading(true);
      const { data } = await messApi.getSchedules();
      setSchedules(data);
    } catch (error) {
      console.error("Error fetching schedules:", error);
      message.error("Failed to fetch mess schedules");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      const formattedValues = {
        ...values,
        date: values.date.format("YYYY-MM-DD"),
        startTime: values.startTime.format("HH:mm"),
        endTime: values.endTime.format("HH:mm"),
        menu: values.menu || [],
        status: values.status || "scheduled",
        capacity: values.capacity || 30,
      };

      if (currentSchedule) {
        await messApi.updateSchedule(currentSchedule._id, formattedValues);
        message.success("Schedule updated successfully");
      } else {
        await messApi.createSchedule(formattedValues);
        message.success("Schedule created successfully");
      }

      setIsModalVisible(false);
      fetchSchedules();
    } catch (error) {
      console.error("Error saving schedule:", error);
      message.error("Error saving schedule");
    }
  };

  const handleEdit = (schedule) => {
    setCurrentSchedule(schedule);
    form.setFieldsValue({
      ...schedule,
      date: dayjs(schedule.date),
      startTime: dayjs(schedule.startTime, "HH:mm"),
      endTime: dayjs(schedule.endTime, "HH:mm"),
    });
    setIsModalVisible(true);
  };

  const handleDelete = async (id) => {
    try {
      await messApi.deleteSchedule(id);
      message.success("Schedule deleted");
      fetchSchedules();
    } catch (error) {
      console.error("Error deleting schedule:", error);
      message.error("Error deleting schedule");
    }
  };

  const columns = [
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
      render: (date) => dayjs(date).format("MMM D, YYYY"),
    },
    {
      title: "Meal",
      dataIndex: "mealType",
      key: "mealType",
    },
    {
      title: "Time",
      key: "time",
      render: (_, record) => `${record.startTime} - ${record.endTime}`,
    },
    {
      title: "Menu Items",
      dataIndex: "menu",
      key: "menu",
      render: (menu) => (
        <div className="max-w-xs">
          {menu.length > 0 ? (
            <ul className="list-disc list-inside">
              {menu.slice(0, 3).map((item, index) => (
                <li key={index} className="truncate">
                  {item.name}
                  {item.category === "special" && (
                    <span className="ml-2 text-blue-500 text-xs">
                      (Special)
                    </span>
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
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <span
          className={`px-2 py-1 rounded ${
            status === "scheduled"
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </span>
      ),
    },
    {
      title: "Capacity",
      dataIndex: "capacity",
      key: "capacity",
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space>
          <Button onClick={() => handleEdit(record)} icon={<FiEdit2 />}>
            Edit
          </Button>
          <Button
            danger
            onClick={() => handleDelete(record._id)}
            icon={<FiTrash2 />}
          >
            Delete
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div className="flex-1 ml-64 p-8 bg-gray-100 min-h-screen">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              Mess Management
            </h1>
            <p className="text-gray-600 mt-1">
              Manage mess schedules and menu items
            </p>
          </div>
          <Button
            type="primary"
            icon={<FiPlus />}
            onClick={() => {
              setCurrentSchedule(null);
              form.resetFields();
              setIsModalVisible(true);
            }}
            size="large"
            className="flex items-center"
          >
            Add Schedule
          </Button>
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

        <Modal
          title={currentSchedule ? "Edit Schedule" : "Add Schedule"}
          open={isModalVisible}
          onOk={handleSubmit}
          onCancel={() => setIsModalVisible(false)}
          width={800}
          okText={currentSchedule ? "Update" : "Create"}
          className="custom-modal"
        >
          <Form form={form} layout="vertical" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Form.Item name="date" label="Date" rules={[{ required: true }]}>
                <DatePicker style={{ width: "100%" }} />
              </Form.Item>

              <Form.Item
                name="mealType"
                label="Meal Type"
                rules={[{ required: true }]}
              >
                <Select>
                  <Option value="breakfast">Breakfast</Option>
                  <Option value="lunch">Lunch</Option>
                  <Option value="dinner">Dinner</Option>
                </Select>
              </Form.Item>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Form.Item
                name="startTime"
                label="Start Time"
                rules={[{ required: true }]}
              >
                <TimePicker format="HH:mm" style={{ width: "100%" }} />
              </Form.Item>

              <Form.Item
                name="endTime"
                label="End Time"
                rules={[{ required: true }]}
              >
                <TimePicker format="HH:mm" style={{ width: "100%" }} />
              </Form.Item>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Form.Item
                name="status"
                label="Status"
                rules={[{ required: true }]}
              >
                <Select>
                  <Option value="scheduled">Scheduled</Option>
                  <Option value="cancelled">Cancelled</Option>
                </Select>
              </Form.Item>

              <Form.Item
                name="capacity"
                label="Capacity"
                rules={[{ required: true }]}
              >
                <Input type="number" min={1} placeholder="Enter capacity" />
              </Form.Item>
            </div>

            <Form.List name="menu">
              {(fields, { add, remove }) => (
                <div className="space-y-4">
                  {fields.map(({ key, name, ...restField }) => (
                    <div key={key} className="flex items-start space-x-4">
                      <Form.Item
                        {...restField}
                        name={[name, "name"]}
                        className="flex-1"
                        rules={[
                          { required: true, message: "Missing item name" },
                        ]}
                      >
                        <Input placeholder="Item name" />
                      </Form.Item>
                      <Form.Item
                        {...restField}
                        name={[name, "category"]}
                        className="flex-1"
                        rules={[
                          { required: true, message: "Missing category" },
                        ]}
                      >
                        <Input placeholder="Category" />
                      </Form.Item>
                      <Form.Item
                        {...restField}
                        name={[name, "cost"]}
                        className="flex-1"
                        rules={[{ required: true, message: "Missing cost" }]}
                      >
                        <Input type="number" placeholder="Cost" />
                      </Form.Item>
                      <Button
                        icon={<FiMinusCircle />}
                        onClick={() => remove(name)}
                        danger
                        className="mt-1"
                      />
                    </div>
                  ))}
                  <Button
                    type="dashed"
                    onClick={() => add()}
                    block
                    icon={<FiPlus />}
                    className="mt-2"
                  >
                    Add Menu Item
                  </Button>
                </div>
              )}
            </Form.List>

            <Form.Item name="specialNotes" label="Special Notes">
              <TextArea rows={2} />
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </div>
  );
};

export default MessManagement;
