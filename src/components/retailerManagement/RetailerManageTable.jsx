import React, { useState } from "react";
import {
  Table,
  Button,
  Input,
  Space,
  Modal,
  Form,
  Select,
  InputNumber,
} from "antd";
import Swal from "sweetalert2";
import GradientButton from "../common/GradiantButton";

const retailersData = Array.from({ length: 25 }, (_, i) => ({
  id: i + 1,
  name: `Retailer ${i + 1}`,
  email: `retailer${i + 1}@gmail.com`,
  phone: `+23191633389${i + 1}`,
  totalOrder: Math.floor(Math.random() * 100),
  totalSales: `$${(Math.random() * 1000).toFixed(2)}`,
  accountStatus: i % 2 === 0 ? "Active" : "Inactive",
  image: `https://img.freepik.com/free-photo/portrait-handsome-young-man-with-arms-crossed-holding-white-headphone-around-his-neck_23-2148096439.jpg?semt=ais_hybrid/50?text=R${
    i + 1
  }`,
}));

const RetailerManageTable = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [retailers, setRetailers] = useState(retailersData);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [form] = Form.useForm();

  const columns = [
    {
      title: "#",
      dataIndex: "id",
      key: "id",
      align: "center",
      render: (text, record, index) => index + 1,
    },
    {
      title: "Retailer Name",
      dataIndex: "name",
      key: "name",
      align: "center",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      align: "center",
    },
    {
      title: "Assigned Sales Rep",
      dataIndex: "phone",
      key: "phone",
      align: "center",
    },
    {
      title: "Total Order",
      dataIndex: "totalOrder",
      key: "totalOrder",
      align: "center",
    },
    {
      title: "Total Sales",
      dataIndex: "totalSales",
      key: "totalSales",
      align: "center",
    },
    {
      title: "Account Status",
      dataIndex: "accountStatus",
      key: "accountStatus",
      align: "center",
    },
    {
      title: "Action",
      key: "action",
      align: "center",
      render: (_, record) => (
        <Space>
          <GradientButton onClick={() => handleEdit(record)}>
            Edit
          </GradientButton>
          <GradientButton onClick={() => handleViewDetails(record)}>
            View
          </GradientButton>
          <GradientButton onClick={() => handleDelete(record.id)}>
            Delete
          </GradientButton>
        </Space>
      ),
    },
  ];

  const handleEdit = (user) => {
    setSelectedUser(user);
    form.setFieldsValue({
      name: user.name,
      email: user.email,
      phone: user.phone,
      totalOrder: user.totalOrder,
      totalSales: user.totalSales,
      accountStatus: user.accountStatus,
    });
    setIsModalOpen(true);
  };

  const handleViewDetails = (user) => {
    Swal.fire({
      title: "Retailer Details",
      text: `
        Name: ${user.name}
        Email: ${user.email}
        Phone: ${user.phone}
        Total Order: ${user.totalOrder}
        Total Sales: ${user.totalSales}
        Account Status: ${user.accountStatus}
      `,
      icon: "info",
    });
  };

  const handleDelete = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        setRetailers(retailers.filter((retailer) => retailer.id !== id));
        Swal.fire("Deleted!", "Retailer has been deleted.", "success");
      }
    });
  };

  const handleSave = (values) => {
    if (selectedUser) {
      // Update existing retailer
      setRetailers(
        retailers.map((retailer) =>
          retailer.id === selectedUser.id
            ? { ...selectedUser, ...values }
            : retailer
        )
      );
    } else {
      // Add new retailer
      const newRetailer = {
        ...values,
        id: retailers.length + 1,
        image:
          "https://img.freepik.com/free-photo/portrait-handsome-young-man-with-arms-crossed-holding-white-headphone-around-his-neck_23-2148096439.jpg",
      };
      setRetailers([...retailers, newRetailer]);
    }
    setIsModalOpen(false);
    setSelectedUser(null);
    form.resetFields();
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-10">
        <h2 className="text-2xl font-bold">
          Retailer List{" "}
          <span className="text-secondary">{retailers.length}</span>{" "}
        </h2>
        <div className="flex gap-5 items-center">
          <Input
            placeholder="Search Retailers Name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ width: 300 }}
            className="py-2.5"
          />
          <GradientButton onClick={() => setIsModalOpen(true)}>
            Add Retailer
          </GradientButton>
        </div>
      </div>

      <Table
        dataSource={retailers.filter(
          (retailer) =>
            retailer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            retailer.email.toLowerCase().includes(searchTerm.toLowerCase())
        )}
        columns={columns}
        pagination={{ pageSize: 10 }}
        bordered={false}
        size="small"
        rowClassName="custom-row"
      />

      {/* Modal for Add/Edit Retailer */}
      <Modal
        title={selectedUser ? "Edit Retailer" : "Add Retailer"}
        visible={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={[
          <Button key="cancel" onClick={() => setIsModalOpen(false)}>
            Cancel
          </Button>,
          <Button key="submit" type="primary" onClick={() => form.submit()}>
            Save Changes
          </Button>,
        ]}
      >
        <Form
          form={form}
          onFinish={handleSave}
          layout="vertical"
          initialValues={{
            name: "",
            email: "",
            phone: "",
            totalOrder: "",
            totalSales: "",
            accountStatus: "Active",
          }}
        >
          <Form.Item
            label="Retailer Name"
            name="name"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
          <Form.Item label="Email" name="email" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item label="Assigned Sales Rep" name="phone">
            <Input />
          </Form.Item>
          <Form.Item label="Total Order" name="totalOrder">
            <InputNumber style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item label="Total Sales" name="totalSales">
            <Input />
          </Form.Item>
          <Form.Item label="Account Status" name="accountStatus">
            <Select>
              <Select.Option value="Active">Active</Select.Option>
              <Select.Option value="Inactive">Inactive</Select.Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default RetailerManageTable;
