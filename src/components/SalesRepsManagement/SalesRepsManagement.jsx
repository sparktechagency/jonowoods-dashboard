import React, { useState } from "react";
import { Table, Button, Modal, Form, Input, Tooltip } from "antd";
import { useNavigate } from "react-router-dom";
import { FaEdit, FaTrash } from "react-icons/fa";
import { IoEyeSharp } from "react-icons/io5";

const SalesRepsManagementTable = () => {
  const [data, setData] = useState([
    {
      id: 1,
      name: "Alice Johnson",
      image: "https://i.ibb.co.com/8gh3mqPR/Ellipse-48-1.jpg",
      email: "example@email.com",
      retailer: 5,
      sales: "$300",
      commission: "$200",
      status: "Active",
    },
    {
      id: 2,
      name: "John Doe",
      image: "https://i.ibb.co.com/8gh3mqPR/Ellipse-48-1.jpg",
      email: "john@email.com",
      retailer: 3,
      sales: "$500",
      commission: "$250",
      status: "Inactive",
    },
    // ... rest of your data
  ]);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form] = Form.useForm();
  const navigate = useNavigate();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    salesRep: "",
    targetAmount: "",
  });

  const handleOpen = () => setIsModalOpen(true);
  const handleClose = () => setIsModalOpen(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = () => {
    console.log("Selected Sales Rep:", formData.salesRep);
    console.log("Target Amount:", formData.targetAmount);
    handleClose();
  };

  const showModal = (record = null) => {
    setEditingId(record ? record.id : null);
    form.setFieldsValue(
      record || {
        name: "",
        email: "",
        retailer: "",
        sales: "",
        commission: "",
        status: "",
      }
    );
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
  };

  const handleSave = (values) => {
    if (editingId) {
      setData(
        data.map((item) =>
          item.id === editingId ? { ...item, ...values } : item
        )
      );
    } else {
      setData([...data, { id: data.length + 1, ...values }]);
    }
    handleCancel();
  };

  const columns = [
    { title: "SL", dataIndex: "id", key: "id", align: "center" },
    {
      title: "Sales Rep Name",
      dataIndex: "name",
      key: "name",
      align: "center",
    },
    { title: "Email", dataIndex: "email", key: "email", align: "center" },
    {
      title: "Assigned Retailer",
      dataIndex: "retailer",
      key: "retailer",
      align: "center",
    },
    { title: "Total Sales", dataIndex: "sales", key: "sales", align: "center" },
    {
      title: "Commission",
      dataIndex: "commission",
      key: "commission",
      align: "center",
    },

    {
      title: "Action",
      key: "action",
      align: "center",
      render: (_, record) => (
        <div className="flex gap-4 justify-center">
          <Tooltip title="View Details">
            <button
              onClick={() =>
                navigate(`/salesRepsManage/${record.id}`, { state: record })
              }
              className="text-blue-500 hover:text-blue-700 text-xl"
              title="Details"
            >
              <IoEyeSharp />
            </button>
          </Tooltip>

          {/* <button
            onClick={() => showModal(record)}
            className="text-green-500 hover:text-green-700 text-xl"
            title="Edit"
          >
            <FaEdit />
          </button> */}

          <Tooltip title="Delete">
            <button
              onClick={() =>
                setData(data.filter((item) => item.id !== record.id))
              }
              className="text-red-500 hover:text-red-700 text-md"
              title="Delete"
            >
              <FaTrash />
            </button>
          </Tooltip>
        </div>
      ),
    },
  ];

  return (
    <div>
      {/* tops of tables  */}
      <div className="flex justify-between items-center mb-6 ">
        <div>
          <h1 className="text-2xl font-bold">All Sales Reps</h1>
        </div>
        <div className="flex gap-5 items-center">
          <div>
            <Button
              type="primary"
              onClick={handleOpen}
              className="bg-gradient-to-r from-primary  to-secondary py-5 font-bold"
            >
              Accept Sales Rep. (01)
            </Button>

            <Modal
              title="Accept Sales Rep"
              open={isModalOpen}
              onOk={handleSubmit}
              onCancel={handleClose}
              okText="Accept"
              cancelText="Cancel"
            >
              <div className="mb-2">
                <label className="block text-sm font-medium mb-1">
                  Sales Rep Name
                </label>
                <select
                  name="salesRep"
                  value={formData.salesRep}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                >
                  <option value="">Select Sales Rep</option>
                  <option value="John Doe">John Doe</option>
                  <option value="Jane Smith">Jane Smith</option>
                  <option value="Mark Johnson">Mark Johnson</option>
                </select>
              </div>

              <div className="mb-2">
                <label className="block text-sm font-medium mb-1">Email</label>
                <input
                  type="email"
                  name="targetAmount"
                  value={formData.targetAmount}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                  placeholder="Enter Your Name"
                />
              </div>
            </Modal>
          </div>
          <Button
            type="primary"
            onClick={() => showModal()}
            className="bg-gradient-to-r from-primary  to-secondary py-5 font-bold"
          >
            Add Sales Rep
          </Button>
        </div>
      </div>

      {/* tables info  */}
      <div className="bg-gradient-to-r from-primary  to-secondary pt-6 px-6 rounded-xl">
        <Table
          dataSource={data}
          columns={columns}
          pagination={{ pageSize: 10 }}
          bordered={false}
          size="small"
          rowClassName="custom-row"
        />
      </div>

      {/* modals  */}
      <Modal
        title={editingId ? "Edit Sales Rep" : "Add Sales Rep"}
        visible={isModalVisible}
        onCancel={handleCancel}
        onOk={() => form.submit()}
        okText={editingId ? "Save Changes" : "Add Sales Rep"}
        okButtonProps={{
          style: {
            background: "linear-gradient(to right, #4E9DAB, #336C79)",
            border: "none",
            color: "white",
          },
        }}
        cancelButtonProps={{
          style: {
            background: "#D32F2F",
            border: "none",
            color: "white",
          },
        }}
      >
        <Form form={form} layout="vertical" onFinish={handleSave}>
          <Form.Item
          className="font-medium"
            label="Sales Rep Name"
            name="name"
            rules={[{ required: true, message: "Please enter name" }]}
          >
            <Input placeholder="Your Name" />
          </Form.Item>
          <Form.Item
          className="font-medium"
            label="Email"
            name="email"
            rules={[{ required: true, message: "Please enter email" }]}
          >
            <Input placeholder="Your email" />
          </Form.Item>

          <div className="mb-2">
            <label className="block text-sm font-medium mb-1">
              Sales Rep Name
            </label>
            <select
              name="salesRep"
              value={formData.salesRep}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            >
              <option value="">Select Sales Rep</option>
              <option value="John Doe">John Doe</option>
              <option value="Jane Smith">Jane Smith</option>
              <option value="Mark Johnson">Mark Johnson</option>
            </select>
          </div>
        </Form>
      </Modal>
    </div>
  );
};

export default SalesRepsManagementTable;
