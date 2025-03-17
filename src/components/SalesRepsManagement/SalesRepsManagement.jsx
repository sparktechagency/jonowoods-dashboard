import React, { useState } from "react";
import { Table, Button, Modal, Form, Input } from "antd";
import { useNavigate } from "react-router-dom";
import GradientButton from "../common/GradiantButton";

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
  ]);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form] = Form.useForm();
  const navigate=useNavigate()

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
    { title: "Status", dataIndex: "status", key: "status", align: "center" },
    {
      title: "Action",
      key: "action",
      align: "center",
      render: (_, record) => (
        <div className="flex gap-2 justify-center">
          <GradientButton
            onClick={() =>
              navigate(`/salesRepsManage/${record.id}`, { state: record })
            }
          >
            Details
          </GradientButton>
          
          <GradientButton
            onClick={() => showModal(record)}
          >
            Edit
          </GradientButton>
          <button
            // danger
            onClick={() =>
              setData(data.filter((item) => item.id !== record.id))
            }
            className="bg-red-500 text-white py-[5px] w-20 rounded-md hover:bg-red-400"
          >
            Delete
          </button>
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
              Set Target Sales Reps
            </Button>

            <Modal
              title="Assign Target to Sales Rep"
              open={isModalOpen}
              onOk={handleSubmit}
              onCancel={handleClose}
              okText="Submit"
              cancelText="Cancel"
            >
              <div className="mb-2">
                <label className="block text-sm font-medium mb-1">
                  Set Sales Reps
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
                <label className="block text-sm font-medium mb-1">
                  Target Amount
                </label>
                <input
                  type="number"
                  name="targetAmount"
                  value={formData.targetAmount}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                  placeholder="Enter target amount"
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
        okText={editingId ? "Save Changes" : "Add Sales Rep"} // Change button text
        okButtonProps={{
          style: {
            background: "linear-gradient(to right, #4E9DAB, #336C79)",
            border: "none",
            color: "white",
          },
        }}
        cancelButtonProps={{
          style: {
            background: "#D32F2F", // Custom red for cancel
            border: "none",
            color: "white",
          },
        }}
      >
        <Form form={form} layout="vertical" onFinish={handleSave}>
          <Form.Item
            label="Sales Rep Name"
            name="name"
            rules={[{ required: true, message: "Please enter name" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Email"
            name="email"
            rules={[{ required: true, message: "Please enter email" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Assigned Retailer"
            name="retailer"
            rules={[{ required: true, message: "Please enter retailer count" }]}
          >
            <Input type="number" />
          </Form.Item>
          <Form.Item
            label="Total Sales"
            name="sales"
            rules={[{ required: true, message: "Please enter total sales" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Commission"
            name="commission"
            rules={[{ required: true, message: "Please enter commission" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Status"
            name="status"
            rules={[{ required: true, message: "Please enter status" }]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default SalesRepsManagementTable;
