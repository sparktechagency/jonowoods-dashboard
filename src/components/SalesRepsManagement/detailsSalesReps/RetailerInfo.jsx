import React, { useState, useEffect } from "react";
import { Table, Modal, Button, Input, Form, Space } from "antd";
import GradientButton from "../../common/GradiantButton";

const RetailerInfo = ({ salesRep }) => {
  console.log(salesRep.name); // Check the value of salesRep.name
  const [data, setData] = useState([
    {
      key: "1",
      sl: "1",
      retailerName: "John Doe",
      email: "johndoe@example.com",
      totalBoxes: 100,
      freeBoxes: 10,
      status: "Active",
    },
    {
      key: "2",
      sl: "2",
      retailerName: "Jane Smith",
      email: "janesmith@example.com",
      totalBoxes: 200,
      freeBoxes: 20,
      status: "Inactive",
    },
    {
      key: "3",
      sl: "1",
      retailerName: "John Doe",
      email: "johndoe@example.com",
      totalBoxes: 100,
      freeBoxes: 10,
      status: "Active",
    },
    {
      key: "4",
      sl: "2",
      retailerName: "Jane Smith",
      email: "janesmith@example.com",
      totalBoxes: 200,
      freeBoxes: 20,
      status: "Inactive",
    },
  ]);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentRecord, setCurrentRecord] = useState(null);
  const [isTargetModalVisible, setIsTargetModalVisible] = useState(false);

  // Set the initial targetSalesRep state using the salesRep prop (if available)
  const [targetSalesRep, setTargetSalesRep] = useState({
    name: salesRep?.name || "", // Set initial value from props, fallback to empty string
    amount: "",
  });

  // Update targetSalesRep state when salesRep prop changes
  useEffect(() => {
    if (salesRep?.name) {
      setTargetSalesRep((prevState) => ({
        ...prevState,
        name: salesRep.name,
      }));
    }
  }, [salesRep]);

  const showModal = (record = null) => {
    setIsModalVisible(true);
    if (record) {
      setIsEditing(true);
      setCurrentRecord(record);
    } else {
      setIsEditing(false);
      setCurrentRecord(null);
    }
  };

  const showTargetModal = () => {
    setIsTargetModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setIsTargetModalVisible(false);
    setIsEditing(false);
    setCurrentRecord(null);
    setTargetSalesRep({ name: "", amount: "" });
  };

  const handleSave = (values) => {
    if (isEditing) {
      setData((prevData) =>
        prevData.map((item) =>
          item.key === currentRecord.key ? { ...item, ...values } : item
        )
      );
    } else {
      setData([...data, { key: String(data.length + 1), ...values }]);
    }
    handleCancel();
  };

  const handleTargetSave = () => {
    // Handle the saving logic for target sales reps
    console.log("Target Sales Rep Saved:", targetSalesRep);
    handleCancel();
  };

  const handleDelete = (key) => {
    setData(data.filter((item) => item.key !== key));
  };

  const columns = [
    { title: "SL", dataIndex: "sl", align: "center" },
    { title: "Retailer Name", dataIndex: "retailerName", align: "center" },
    { title: "Email", dataIndex: "email", align: "center" },
    { title: "Total Boxes Ordered", dataIndex: "totalBoxes", align: "center" },
    { title: "Free Boxes", dataIndex: "freeBoxes", align: "center" },
    { title: "Status", dataIndex: "status", align: "center" },
    {
      title: "Action",
      key: "action",
      align: "center",
      render: (_, record) => (
        <Space>
          <GradientButton
            onClick={() => showModal(record)}
          >
            Edit
          </GradientButton>
          <Button
            onClick={() => handleDelete(record.key)}
            type="danger"
            className="bg-red-500 text-white py-[18px]"
          >
            Delete
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div className="flex justify-between mb-10 mt-10">
        <h1 className="text-2xl font-bold">Sales Rep Details</h1>
        <div className="flex gap-4">
          <GradientButton
            onClick={showTargetModal} 
          >
            Set Target Sales Reps
          </GradientButton>
          <GradientButton
            onClick={() => showModal()} 
          >
            Add New Entry
          </GradientButton>
        </div>
      </div>

      <div className="px-6 pt-6 rounded-lg bg-gradient-to-r from-primary to-secondary">
        <Table
          dataSource={data}
          columns={columns}
          pagination={{ pageSize: 10 }}
          bordered
          size="small"
          rowClassName="custom-row"
        />
      </div>

      {/* Edit/Add Modal */}
      <Modal
        title={isEditing ? "Edit Entry" : "Add New Entry"}
        visible={isModalVisible}
        onCancel={handleCancel}
        footer={null}
      >
        <Form
          layout="vertical"
          initialValues={isEditing ? currentRecord : {}}
          onFinish={handleSave}
        >
          <Form.Item
            name="retailerName"
            label="Retailer Name"
            rules={[{ required: true, message: "Please input retailer name!" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="email"
            label="Email"
            rules={[{ required: true, message: "Please input email!" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="totalBoxes"
            label="Total Boxes Ordered"
            rules={[{ required: true, message: "Please input total boxes!" }]}
          >
            <Input type="number" />
          </Form.Item>

          <Form.Item
            name="freeBoxes"
            label="Free Boxes"
            rules={[{ required: true, message: "Please input free boxes!" }]}
          >
            <Input type="number" />
          </Form.Item>

          <Form.Item
            name="status"
            label="Status"
            rules={[{ required: true, message: "Please select a status!" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item>
            <GradientButton type="primary" htmlType="submit">
              {isEditing ? "Save Changes" : "Add Entry"}
            </GradientButton>
          </Form.Item>
        </Form>
      </Modal>

      {/* Set Target Modal */}
      <Modal
        title="Set Target Sales Reps"
        visible={isTargetModalVisible}
        onCancel={handleCancel}
        footer={null}
      >
        <Form layout="vertical" onFinish={handleTargetSave}>
          <Form.Item
            name="name"
            label="Sales Rep Name"
            rules={[{ required: true, message: "Please input the name!" }]}
          >
            <Input
              value={targetSalesRep.name}
              onChange={(e) =>
                setTargetSalesRep({ ...targetSalesRep, name: e.target.value })
              }
            />
          </Form.Item>

          <Form.Item
            name="amount"
            label="Target Amount"
            rules={[
              { required: true, message: "Please input the target amount!" },
            ]}
          >
            <Input
              type="number"
              value={targetSalesRep.amount}
              onChange={(e) =>
                setTargetSalesRep({ ...targetSalesRep, amount: e.target.value })
              }
            />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit">
              Set Target
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default RetailerInfo;
