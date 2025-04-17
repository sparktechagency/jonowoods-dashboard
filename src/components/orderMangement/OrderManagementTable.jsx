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
  Menu,
  Dropdown,
} from "antd";
import { SearchOutlined, DownOutlined, PlusOutlined } from "@ant-design/icons";
import UserDetailsModal from "./UserDetailsModal";
import GradientButton from "../common/GradiantButton";

const FilteringIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    style={{ marginRight: "8px" }} // Add some spacing between the icon and text
  >
    <path
      d="M0.75 4.2308H12.169C12.5131 5.79731 13.9121 6.97336 15.5805 6.97336C17.2488 6.97336 18.6478 5.79736 18.9919 4.2308H23.25C23.6642 4.2308 24 3.89498 24 3.4808C24 3.06661 23.6642 2.7308 23.25 2.7308H18.9915C18.6467 1.16508 17.2459 -0.0117188 15.5805 -0.0117188C13.9141 -0.0117188 12.5139 1.16489 12.1693 2.7308H0.75C0.335812 2.7308 0 3.06661 0 3.4808C0 3.89498 0.335812 4.2308 0.75 4.2308ZM13.588 3.48277L13.588 3.4747C13.5913 2.37937 14.4851 1.48833 15.5805 1.48833C16.6743 1.48833 17.5681 2.37816 17.5728 3.47297L17.573 3.48398C17.5712 4.58119 16.6781 5.47341 15.5805 5.47341C14.4833 5.47341 13.5904 4.58208 13.5879 3.48553L13.588 3.48277ZM23.25 19.769H18.9915C18.6467 18.2033 17.2459 17.0265 15.5805 17.0265C13.9141 17.0265 12.5139 18.2031 12.1693 19.769H23.25C23.6642 19.769 24 20.1047 24 20.519C24 20.9332 23.6642 21.269 23.25 21.269ZM15.5805 22.5115C14.4833 22.5115 13.5904 21.6202 13.5879 20.5237L13.588 20.5209L13.588 20.5129C13.5913 19.4175 14.4851 18.5265 15.5805 18.5265C16.6743 18.5265 17.5681 19.4163 17.5728 20.511L17.573 20.5221C17.5714 21.6194 16.6782 22.5115 15.5805 22.5115ZM23.25 11.2499H11.831C11.4869 9.68339 10.0879 8.50739 8.41955 8.50739C6.75117 8.50739 5.35223 9.68339 5.00808 11.2499H0.75C0.335812 11.2499 0 11.5857 0 11.9999C0 12.4141 0.335812 12.7499 0.75 12.7499H5.00845C5.35331 14.3156 6.75413 15.4924 8.41955 15.4924C10.0859 15.4924 11.4861 14.3158 11.8307 12.7499H23.25C23.6642 12.7499 24 12.4141 24 11.9999C24 11.5857 23.6642 11.2499 23.25 11.2499ZM10.412 11.9979L10.412 12.006C10.4087 13.1013 9.51492 13.9924 8.41955 13.9924C7.32572 13.9924 6.43191 13.1025 6.42717 12.0078L6.42703 11.9968C6.42867 10.8995 7.32188 10.0074 8.41955 10.0074C9.5167 10.0074 10.4096 10.8987 10.4121 11.9953L10.412 11.9979Z"
      fill="#000" // Set the color of the icon to black or any other color
    />
  </svg>
);

const { Option } = Select;

const UserManagementTable = () => {
  const [filteredInfo, setFilteredInfo] = useState({});
  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [planFilter, setPlanFilter] = useState("All");
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
      align: "center",
    },
    {
      title: "User Name",
      dataIndex: "userName",
      key: "userName",
      filteredValue: filteredInfo.userName || null,
      onFilter: (value, record) =>
        record.userName.toLowerCase().includes(value.toLowerCase()),
      align: "center",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      align: "center",
    },
    {
      title: "Phone Number",
      dataIndex: "phoneNumber",
      key: "phoneNumber",
      align: "center",
    },
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
      align: "center",
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

    const matchesStatus =
      statusFilter === "All" || record.status === statusFilter;
    const matchesPlan =
      planFilter === "All" || record.planRunning === planFilter;

    return matchesSearch && matchesStatus && matchesPlan;
  });

  // Status filter menu
  const statusMenu = (
    <Menu>
      <Menu.Item key="all" onClick={() => setStatusFilter("All")}>
        All Status
      </Menu.Item>
      <Menu.Item key="active" onClick={() => setStatusFilter("Active")}>
        Active
      </Menu.Item>
      <Menu.Item key="block" onClick={() => setStatusFilter("Block")}>
        Block
      </Menu.Item>
    </Menu>
  );

  // Plan filter menu
  const planMenu = (
    <Menu>
      <Menu.Item key="all" onClick={() => setPlanFilter("All")}>
        All Plans
      </Menu.Item>
      <Menu.Item key="7day" onClick={() => setPlanFilter("7day Free Trial")}>
        7day Free Trial
      </Menu.Item>
      <Menu.Item key="1month" onClick={() => setPlanFilter("1 Month")}>
        1 Month
      </Menu.Item>
      <Menu.Item key="6month" onClick={() => setPlanFilter("6 Month")}>
        6 Month
      </Menu.Item>
      <Menu.Item key="1year" onClick={() => setPlanFilter("1 Year")}>
        1 Year
      </Menu.Item>
    </Menu>
  );

  return (
    <div style={{ width: "100%" }}>
      <div className="flex justify-between mb-6 items-center">
        <Input
          placeholder="Search by user name"
          prefix={<SearchOutlined />}
          style={{ width: 300, height:40 }}
          onChange={handleSearch}
        />

        <div className="flex gap-4">
          <Space size="small" className="flex gap-4">
            <Dropdown overlay={statusMenu}>
              <Button
                className="mr-2 bg-red-600 py-5 text-white hover:text-black hover:icon-black"
                style={{ border: "none" }}
              >
                <Space>
                  <FilteringIcon className="filtering-icon" />
                  <span className="filter-text">
                    {statusFilter === "All" ? "All Status" : statusFilter}
                  </span>
                  <DownOutlined />
                </Space>
              </Button>
            </Dropdown>

            <Dropdown overlay={planMenu}>
              <Button
                className="mr-2 bg-red-600 py-5 text-white hover:text-black hover:icon-black"
                style={{ border: "none" }}
              >
                <Space>
                  <FilteringIcon className="filtering-icon" />
                  <span className="filter-text">
                    {planFilter === "All" ? "All Plans" : planFilter}
                  </span>
                  <DownOutlined />
                </Space>
              </Button>
            </Dropdown>
          </Space>

          {/* Optional: Add a button to create new user like in VideoManagementSystem */}
          <GradientButton
            type="primary"
            className="py-5"
            icon={<PlusOutlined />}
          >
            Add New User
          </GradientButton>
        </div>
      </div>

      <div className="border-2 rounded-lg">
        <Table
          columns={columns}
          dataSource={filteredData}
          onChange={handleChange}
          pagination={{ defaultPageSize: 10 }}
          size="middle"
          
          bordered
        />
      </div>

      {selectedUser && (
        <UserDetailsModal
          visible={isModalVisible}
          onClose={handleModalClose}
          userDetails={selectedUser.userDetails}
        />
      )}
    </div>
  );
};

export default UserManagementTable;
