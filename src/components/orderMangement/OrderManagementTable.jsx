import React, { useState } from "react";
import {
  Table,
  Button,
  Space,
  Input,
  Select,
  Typography,
  Card,
  Modal,
  Divider,
  Row,
  Col,
  message,
} from "antd";
import { SearchOutlined, DownOutlined } from "@ant-design/icons";
import UserDetailsModal from "./UserDetailsModal";
import GradientButton from "../common/GradiantButton";

const { Option } = Select;

const UserManagementTable = () => {
  const [filteredInfo, setFilteredInfo] = useState({});
  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState(null);
  const [planFilter, setPlanFilter] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [userData, setUserData] = useState([
    {
      key: "1",
      sl: 1,
      userName: "John Sina",
      email: "example@email.com",
      phoneNumber: "9334-878901",
      joiningDate: "01-02-2025",
      subscription: "No",
      planRunning: "7day Free Trial",
      status: "Active",
      userDetails: {
        name: "John Sina",
        email: "example@email.com",
        phone: "+9334-878901",
        streak: "25days",
        sessions: "28sessions",
        totalTime: "5200 Min",
        subscriptionInfo: {
          subscription: "No",
          plan: "7day Free Trial",
          amount: "$0",
          date: "February 1, 2025",
          remaining: "3Days",
          transactionId: "N/A",
          paymentBy: "N/A",
        },
      },
    },
    {
      key: "2",
      sl: 2,
      userName: "Jono Woods",
      email: "example@email.com",
      phoneNumber: "9334-878901",
      joiningDate: "01-02-2025",
      subscription: "No",
      planRunning: "1 Month",
      status: "Active",
      userDetails: {
        name: "Jono Woods",
        email: "example@email.com",
        phone: "+9334-878901",
        streak: "15days",
        sessions: "22sessions",
        totalTime: "3400 Min",
        subscriptionInfo: {
          subscription: "No",
          plan: "1 Month",
          amount: "$20",
          date: "February 1, 2025",
          remaining: "29Days",
          transactionId: "123456780",
          paymentBy: "PayPal",
        },
      },
    },
    {
      key: "3",
      sl: 3,
      userName: "Sabbir Ahmed",
      email: "example@gmail.com",
      phoneNumber: "+12345657962",
      joiningDate: "01-03-2025",
      subscription: "Yes",
      planRunning: "1 Month",
      status: "Active",
      userDetails: {
        name: "Sabbir Ahmed",
        email: "example@gmail.com",
        phone: "+12345657962",
        streak: "30days",
        sessions: "30sessions",
        totalTime: "6000 Min",
        subscriptionInfo: {
          subscription: "Yes",
          plan: "1 Month",
          amount: "$60",
          date: "March 30, 2025",
          remaining: "20Days",
          transactionId: "1234567891",
          paymentBy: "Credit Card",
        },
      },
    },
    {
      key: "4",
      sl: 4,
      userName: "John Doe",
      email: "johndoe@email.com",
      phoneNumber: "9876-543210",
      joiningDate: "15-01-2025",
      subscription: "Yes",
      planRunning: "6 Month",
      status: "Block",
      userDetails: {
        name: "John Doe",
        email: "johndoe@email.com",
        phone: "+9876-543210",
        streak: "0days",
        sessions: "15sessions",
        totalTime: "2200 Min",
        subscriptionInfo: {
          subscription: "Yes",
          plan: "6 Month",
          amount: "$120",
          date: "January 15, 2025",
          remaining: "0Days",
          transactionId: "9876543210",
          paymentBy: "Debit Card",
        },
      },
    },
    {
      key: "5",
      sl: 5,
      userName: "Jane Smith",
      email: "janesmith@email.com",
      phoneNumber: "1234-567890",
      joiningDate: "10-02-2025",
      subscription: "No",
      planRunning: "7day Free Trial",
      status: "Block",
      userDetails: {
        name: "Jane Smith",
        email: "janesmith@email.com",
        phone: "+1234-567890",
        streak: "0days",
        sessions: "3sessions",
        totalTime: "450 Min",
        subscriptionInfo: {
          subscription: "No",
          plan: "7day Free Trial",
          amount: "$0",
          date: "February 10, 2025",
          remaining: "0Days",
          transactionId: "N/A",
          paymentBy: "N/A",
        },
      },
    },
  ]);

  const handleChange = (pagination, filters) => {
    setFilteredInfo(filters);
  };

  const handleSearch = (e) => {
    setSearchText(e.target.value);
  };

  const showUserDetails = (user) => {
    setSelectedUser(user);
    setIsModalVisible(true);
  };

  const handleModalClose = () => {
    setIsModalVisible(false);
  };

  // Function to toggle user status between Active and Block
  const toggleUserStatus = (key) => {
    const updatedData = userData.map((user) => {
      if (user.key === key) {
        const newStatus = user.status === "Active" ? "Block" : "Active";
        message.success(`User ${user.userName} status updated to ${newStatus}`);
        return {
          ...user,
          status: newStatus,
        };
      }
      return user;
    });

    setUserData(updatedData);
  };

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
      filteredValue: filteredInfo.userName || null,
      onFilter: (value, record) =>
        record.userName.toLowerCase().includes(value.toLowerCase()),
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
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <span
          style={{
            color: status === "Active" ? "#52c41a" : "#f5222d",
            fontWeight: "bold",
          }}
        >
          {status}
        </span>
      ),
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Space size="small">
          <GradientButton
            type="primary"
            danger
            onClick={() => showUserDetails(record)}
          >
            View Details
          </GradientButton>
          <button
            type="primary"
            onClick={() => toggleUserStatus(record.key)}
            style={{
              
              background: record.status === "Active" ? "#f5222d" : "#52c41a",
              borderColor: record.status === "Active" ? "#d9363e" : "#3f8600",
            }}
            className="h-10 px-4 py-2 rounded-md text-white"
          >
            {record.status === "Active" ? "Block" : "Active"}
          </button>
        </Space>
      ),
    },
  ];

  // Filter data based on search input and dropdown filters
  let filteredData = userData.filter((record) => {
    const matchesSearch =
      record.userName.toLowerCase().includes(searchText.toLowerCase()) ||
      record.email.toLowerCase().includes(searchText.toLowerCase());

    const matchesStatus = !statusFilter || record.status === statusFilter;
    const matchesPlan = !planFilter || record.planRunning === planFilter;

    return matchesSearch && matchesStatus && matchesPlan;
  });

  const handleStatusChange = (value) => {
    if (value === "all") {
      setStatusFilter(null);
      setFilteredInfo((prev) => ({ ...prev, status: null }));
    } else {
      setStatusFilter(value);
      setFilteredInfo((prev) => ({ ...prev, status: [value] }));
    }
  };

  const handlePlanChange = (value) => {
    if (value === "all") {
      setPlanFilter(null);
      setFilteredInfo((prev) => ({ ...prev, planRunning: null }));
    } else {
      setPlanFilter(value);
      setFilteredInfo((prev) => ({ ...prev, planRunning: [value] }));
    }
  };

  return (
    <Card style={{ width: "100%" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: 16,
          alignItems: "flex-end",
        }}
      >
        <Input
          placeholder="Search"
          prefix={<SearchOutlined />}
          style={{ width: 200 }}
          onChange={handleSearch}
        />

        <Space size="small">
          <Select
            defaultValue="all"
            style={{ width: 120 }}
            suffixIcon={<DownOutlined />}
            onChange={handleStatusChange}
          >
            <Option value="all">All Status</Option>
            <Option value="Active">Active</Option>
            <Option value="Block">Block</Option>
          </Select>

          <Select
            defaultValue="all"
            style={{ width: 120 }}
            suffixIcon={<DownOutlined />}
            onChange={handlePlanChange}
          >
            <Option value="all">All Plans</Option>
            <Option value="7day Free Trial">7day Free Trial</Option>
            <Option value="1 Month">1 Month</Option>
            <Option value="6 Month">6 Month</Option>
            <Option value="1 Year">1 Year</Option>
          </Select>
        </Space>
      </div>

      <Table
        columns={columns}
        dataSource={filteredData}
        onChange={handleChange}
        pagination={{ defaultPageSize: 10 }}
        size="middle"
        bordered
      />

      {selectedUser && (
        <UserDetailsModal
          visible={isModalVisible}
          onClose={handleModalClose}
          userDetails={selectedUser.userDetails}
        />
      )}
    </Card>
  );
};

export default UserManagementTable;
