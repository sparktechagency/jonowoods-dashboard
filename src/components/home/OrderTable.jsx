import React, { useState } from "react";
import { Table, Input } from "antd";
import { SearchOutlined } from "@ant-design/icons";

// Sample Data with Unique Keys
const dataSource = [
  {
    key: "1",
    userName: "Alice Johnson",
    email: "alice@example.com",
    phone: "+1 234 567 890",
    joiningDate: "2023-05-15",
    subscription: "Premium",
    planRunning: "7 days free tier",
    status: "Active",
  },
  {
    key: "2",
    userName: "Bob Smith",
    email: "bob@example.com",
    phone: "+1 234 567 891",
    joiningDate: "2022-08-20",
    subscription: "No",
    planRunning: " 7 days free tier",
    status: "Inactive",
  },
  // Add more data as needed
];

const columns = [
 
  {
    title: "User Name",
    dataIndex: "userName",
    key: "userName",
    align: "center",
  },
  { title: "Email", dataIndex: "email", key: "email", align: "center" },
  {
    title: "Joining Date",
    dataIndex: "joiningDate",
    key: "joiningDate",
    align: "center",
  },
  {
    title: "Subscription",
    dataIndex: "subscription",
    key: "subscription",
    align: "center",
  },
  {
    title: "Plan Running",
    dataIndex: "planRunning",
    key: "planRunning",
    align: "center",
  },
  {
    title: "Status",
    dataIndex: "status",
    key: "status",
    align: "center",
  },
];

const OrderTable = () => {
  const [searchText, setSearchText] = useState("");

  // Search handler
  const handleSearch = (value) => {
    setSearchText(value);
  };

  // Filtering the data based on the search text
  const filteredData = dataSource.filter(
    (item) =>
      item.userName.toLowerCase().includes(searchText.toLowerCase()) ||
      item.email.toLowerCase().includes(searchText.toLowerCase()) ||
      item.status.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <div>
      <div className="flex justify-between mb-4 items-center">
        <h1 className="text-2xl font-bold text-gray-800">Order Management</h1>
        <Input
          placeholder="Search Order, User Name, Email, Amount, Status"
          value={searchText}
          onChange={(e) => handleSearch(e.target.value)}
          prefix={<SearchOutlined />}
          className="w-1/3 py-2"
        />
      </div>

      {/* Table Container with Gradient Background */}
      <div className="pt-6 rounded-lg">
        <Table
          dataSource={filteredData}
          columns={columns}
          pagination={{ pageSize: 7 }}
          bordered={false}
          size="small"
          rowClassName="custom-table"
          className="custom-table"
        />
      </div>
    </div>
  );
};

export default OrderTable;
