import React, { useState } from "react";
import { Table, Button, Modal, Input, Form, message, Select } from "antd";
import SubscriptionCard from "./SubscriptionCard";
import GradientButton from "../common/GradiantButton";

const SubscriptionTable = () => {
  const [isDetailsModalVisible, setIsDetailsModalVisible] = useState(false);
  const [isStatusModalVisible, setIsStatusModalVisible] = useState(false);
  const [currentSubscriber, setCurrentSubscriber] = useState(null);
  const [searchName, setSearchName] = useState("");
  const [searchCategory, setSearchCategory] = useState("");

  const data = [
    {
      key: "1",
      name: "John Doe",
      profileCategory: "Retailer",
      email: "john@email.com",
      tier: "Gold",
      billingDate: "March 20, 2025",
      status: "Active",
    },
    {
      key: "2",
      name: "Jane Smith",
      profileCategory: "Wholesaler",
      email: "jane@email.com",
      tier: "Silver",
      billingDate: "March 22, 2025",
      status: "Inactive",
    },
    // More subscriber data...
  ];

  const filteredData = data.filter(
    (subscriber) =>
      subscriber.name.toLowerCase().includes(searchName.toLowerCase()) &&
      subscriber.profileCategory
        .toLowerCase()
        .includes(searchCategory.toLowerCase())
  );

 const columns = [
   {
     title: "SL",
     dataIndex: "key",
     key: "key",
     align: "center",
   },
   {
     title: "Name",
     dataIndex: "name",
     key: "name",
     align: "center",
   },
   {
     title: "Profile Category",
     dataIndex: "profileCategory",
     key: "profileCategory",
     align: "center",
   },
   {
     title: "Email",
     dataIndex: "email",
     key: "email",
     align: "center",
   },
   {
     title: "Tier",
     dataIndex: "tier",
     key: "tier",
     align: "center",
   },
   {
     title: "Billing Date",
     dataIndex: "billingDate",
     key: "billingDate",
     align: "center",
   },
   {
     title: "Status",
     dataIndex: "status",
     key: "status",
     align: "center",
   },
   {
     title: "Action",
     key: "action",
     render: (text, record) => (
       <>
         <GradientButton type="link" onClick={() => showDetailsModal(record)}>
           View Details
         </GradientButton>
         <GradientButton type="link" onClick={() => showStatusModal(record)}>
           Update Status
         </GradientButton>
       </>
     ),
     align: "center",
   },
 ];


  const showDetailsModal = (subscriber) => {
    setCurrentSubscriber(subscriber);
    setIsDetailsModalVisible(true);
  };

  const showStatusModal = (subscriber) => {
    setCurrentSubscriber(subscriber);
    setIsStatusModalVisible(true);
  };

  const handleStatusChange = (values) => {
    // Here you can update the status in your state or send it to your backend
    message.success(`Status updated to: ${values.status}`);
    setIsStatusModalVisible(false);
  };

  return (
    <div>
      <SubscriptionCard />

      <div className="mb-6 flex justify-between">
        <h2 className="text-3xl font-bold">All Subscribers</h2>
        <div className="search-box flex gap-5">
          <Input
            placeholder="Search by Name"
            value={searchName}
            onChange={(e) => setSearchName(e.target.value)}
            style={{ marginRight: 8 }}
            className="py-2"
          />
          <Input
            placeholder="Search by Profile Category"
            value={searchCategory}
            onChange={(e) => setSearchCategory(e.target.value)}
          />
        </div>
      </div>
      <div className="bg-gradient-to-r from-primary to-secondary px-6 pt-6 rounded-xl">
        <Table
          dataSource={filteredData}
          columns={columns}
          pagination={{ pageSize: 10 }}
          bordered={false}
          size="middle"
          rowClassName="custom-row"
        />
      </div>

      {/* View Details Modal */}
      <Modal
        title="Subscriber Details"
        visible={isDetailsModalVisible}
        onCancel={() => setIsDetailsModalVisible(false)}
        footer={null}
      >
        <div>
          <p>
            <strong>Name:</strong> {currentSubscriber?.name}
          </p>
          <p>
            <strong>Email:</strong> {currentSubscriber?.email}
          </p>
          <p>
            <strong>Profile Category:</strong>{" "}
            {currentSubscriber?.profileCategory}
          </p>
          <p>
            <strong>Tier:</strong> {currentSubscriber?.tier}
          </p>
          <p>
            <strong>Billing Date:</strong> {currentSubscriber?.billingDate}
          </p>
          <p>
            <strong>Status:</strong> {currentSubscriber?.status}
          </p>
        </div>
      </Modal>

      {/* Update Status Modal */}
      <Modal
        title="Update Subscriber Status"
        visible={isStatusModalVisible}
        onCancel={() => setIsStatusModalVisible(false)}
        footer={null}
      >
        <Form
          initialValues={{ status: currentSubscriber?.status }}
          onFinish={handleStatusChange}
        >
          <Form.Item
            name="status"
            label="Status"
            rules={[{ required: true, message: "Please select the status" }]}
          >
            <Select>
              <Select.Option value="Active">Active</Select.Option>
              <Select.Option value="Inactive">Inactive</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item>
            <GradientButton type="primary" htmlType="submit">
              Update Status
            </GradientButton>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default SubscriptionTable;
