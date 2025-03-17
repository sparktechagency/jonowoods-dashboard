import React, { useState } from "react";
import { Table, Input } from "antd";
import { SearchOutlined } from "@ant-design/icons";

// Sample Data with Unique Keys
const dataSource = [
  {
    key: "1",
    orderId: "#123456",
    retailerName: "Alice Johnson",
    salesName: "Alice Johnson",
    amount: "$2500",
    status: "Pending",
  },
  {
    key: "2",
    orderId: "#123457",
    retailerName: "Alice Johnson",
    salesName: "Alice Johnson",
    amount: "$2500",
    status: "Pending",
  },
  {
    key: "3",
    orderId: "#123458",
    retailerName: "Alice Johnson",
    salesName: "Alice Johnson",
    amount: "$2500",
    status: "Completed",
  },
  {
    key: "4",
    orderId: "#123459",
    retailerName: "Alice Jowel",
    salesName: "Alice Johnson",
    amount: "$2500",
    status: "Completed",
  },
  {
    key: "5",
    orderId: "#123460",
    retailerName: "John Doe",
    salesName: "Alice Johnson",
    amount: "$3200",
    status: "Pending",
  },
  {
    key: "6",
    orderId: "#123461",
    retailerName: "Emma Watson",
    salesName: "Alice Johnson",
    amount: "$4100",
    status: "Completed",
  },
  {
    key: "7",
    orderId: "#123462",
    retailerName: "Robert Brown",
    salesName: "Alice Johnson",
    amount: "$1800",
    status: "Pending",
  },
  {
    key: "8",
    orderId: "#123463",
    retailerName: "Sophia Lee",
    salesName: "Alice Johnson",
    amount: "$2250",
    status: "Completed",
  },
  {
    key: "9",
    orderId: "#123464",
    retailerName: "Michael Clark",
    salesName: "Alice Johnson",
    amount: "$2750",
    status: "Pending",
  },
  {
    key: "10",
    orderId: "#123465",
    retailerName: "David Miller",
    salesName: "Alice Johnson",
    amount: "$3900",
    status: "Completed",
  },
];

const columns = [
  { title: "Order ID", dataIndex: "orderId", key: "orderId" },
  { title: "Retailer Name", dataIndex: "retailerName", key: "retailerName" },
  { title: "Sales Name", dataIndex: "salesName", key: "salesName" },
  { title: "Amount", dataIndex: "amount", key: "amount" },
  { title: "Status", dataIndex: "status", key: "status" },
];

const OrderTable = () => {
  const [searchText, setSearchText] = useState("");

  // Search handler
  const handleSearch = (value) => setSearchText(value);

  // Filtering the data based on the search text
  const filteredData = dataSource.filter(
    (item) =>
      item.orderId.toLowerCase().includes(searchText.toLowerCase()) ||
      item.retailerName.toLowerCase().includes(searchText.toLowerCase()) ||
      item.salesName.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <div>
      <div className="flex justify-between mb-4 items-center">
        <h1 className="text-2xl font-bold text-gray-800">Order Management</h1>
        <Input
          placeholder="Search Order, Retailer, Sales"
          value={searchText}
          onChange={(e) => handleSearch(e.target.value)}
          prefix={<SearchOutlined />}
          className="w-1/3 py-2"
        />
      </div>
      {/* Table Container with Gradient Background */}
      <div className="px-6 pt-6 rounded-lg bg-gradient-to-r from-primary to-secondary">
        <Table
          dataSource={filteredData}
          columns={columns}
          pagination={{ pageSize: 7 }}
          bordered={false}
          size="small"
          rowClassName="custom-table" 
        />
      </div>
    </div>
  );
};

export default OrderTable;
