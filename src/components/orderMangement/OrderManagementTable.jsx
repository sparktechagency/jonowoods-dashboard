import React, { useState } from "react";
import {
  Table,
  Button,
  Tag,
  Select,
  Input,
  Space,
  Typography,
  Card,
} from "antd";
import { SearchOutlined, DownOutlined } from "@ant-design/icons";

const { Option } = Select;
const { Title } = Typography;

const UserManagementTable = () => {
  const [filteredInfo, setFilteredInfo] = useState({});
  const [sortedInfo, setSortedInfo] = useState({});

  const handleChange = (pagination, filters, sorter) => {
    setFilteredInfo(filters);
    setSortedInfo(sorter);
  };

  const data = [
    {
      key: "1",
      sl: 1,
      userName: "John",
      email: "example@email.com",
      phoneNumber: "9334-878901",
      joiningDate: "01-02-2025",
      subscription: "No",
      planRunning: "7day Free Trial",
      status: "Active",
    },
    {
      key: "2",
      sl: 2,
      userName: "John",
      email: "example@email.com",
      phoneNumber: "9334-878901",
      joiningDate: "01-02-2025",
      subscription: "No",
      planRunning: "1 Month",
      status: "Active",
    },
    {
      key: "3",
      sl: 3,
      userName: "John",
      email: "example@email.com",
      phoneNumber: "9334-878901",
      joiningDate: "01-02-2025",
      subscription: "No",
      planRunning: "7day Free Trial",
      status: "Active",
    },
    {
      key: "4",
      sl: 4,
      userName: "John",
      email: "example@email.com",
      phoneNumber: "9334-878901",
      joiningDate: "01-02-2025",
      subscription: "No",
      planRunning: "6 Month",
      status: "Active",
    },
    {
      key: "5",
      sl: 5,
      userName: "John",
      email: "example@email.com",
      phoneNumber: "9334-878901",
      joiningDate: "01-02-2025",
      subscription: "No",
      planRunning: "7day Free Trial",
      status: "Active",
    },
    {
      key: "6",
      sl: 6,
      userName: "John",
      email: "example@email.com",
      phoneNumber: "9334-878901",
      joiningDate: "01-02-2025",
      subscription: "No",
      planRunning: "1 Year",
      status: "Active",
    },
    {
      key: "7",
      sl: 7,
      userName: "John",
      email: "example@email.com",
      phoneNumber: "9334-878901",
      joiningDate: "01-02-2025",
      subscription: "No",
      planRunning: "7day Free Trial",
      status: "Active",
    },
    {
      key: "8",
      sl: 8,
      userName: "John",
      email: "example@email.com",
      phoneNumber: "9334-878901",
      joiningDate: "01-02-2025",
      subscription: "No",
      planRunning: "1 Month",
      status: "Active",
    },
    {
      key: "9",
      sl: 9,
      userName: "John",
      email: "example@email.com",
      phoneNumber: "9334-878901",
      joiningDate: "01-02-2025",
      subscription: "No",
      planRunning: "7day Free Trial",
      status: "Active",
    },
  ];

  const columns = [
    {
      title: "SL",
      dataIndex: "sl",
      key: "sl",
      width: 60,
    },
    {
      title: "User Name",
      dataIndex: "userName",
      key: "userName",
      sorter: (a, b) => a.userName.localeCompare(b.userName),
      sortOrder: sortedInfo.columnKey === "userName" && sortedInfo.order,
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Phone Number",
      dataIndex: "phoneNumber",
      key: "phoneNumber",
    },
    {
      title: "Joining Date",
      dataIndex: "joiningDate",
      key: "joiningDate",
    },
    {
      title: "Subscription",
      dataIndex: "subscription",
      key: "subscription",
    },
    {
      title: "Plan Running",
      dataIndex: "planRunning",
      key: "planRunning",
      filters: [
        { text: "7day Free Trial", value: "7day Free Trial" },
        { text: "1 Month", value: "1 Month" },
        { text: "6 Month", value: "6 Month" },
        { text: "1 Year", value: "1 Year" },
      ],
      filteredValue: filteredInfo.planRunning || null,
      onFilter: (value, record) => record.planRunning.includes(value),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => <Tag color="success">{status}</Tag>,
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Space size="small">
          <Button type="primary" danger>
            View Details
          </Button>
          <Button type="primary">Active</Button>
        </Space>
      ),
    },
  ];

  return (
    <Card style={{ width: "100%" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: 16,
        }}
      >
        <Space size="small">
          <Select
            defaultValue="active"
            style={{ width: 120 }}
            suffixIcon={<DownOutlined />}
          >
            <Option value="active">Active</Option>
            <Option value="inactive">Inactive</Option>
          </Select>

          <Select
            defaultValue="6month"
            style={{ width: 120 }}
            suffixIcon={<DownOutlined />}
          >
            <Option value="7day">7day Free Trial</Option>
            <Option value="1month">1 Month</Option>
            <Option value="6month">6 Month</Option>
            <Option value="1year">1 Year</Option>
          </Select>
        </Space>

        <Input
          placeholder="Search"
          prefix={<SearchOutlined />}
          style={{ width: 200 }}
        />
      </div>

      <Table
        columns={columns}
        dataSource={data}
        onChange={handleChange}
        pagination={{ defaultPageSize: 10 }}
        size="middle"
        bordered
      />
    </Card>
  );
};

export default UserManagementTable;
