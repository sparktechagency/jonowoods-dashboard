import React, { useState, useEffect } from "react";
import {
  Table,
  Button,
  Space,
  Input,
  Menu,
  Dropdown,
  message,
  Modal,
} from "antd";
import { SearchOutlined, DownOutlined, PlusOutlined } from "@ant-design/icons";
import {
  useGetAllUsersQuery,
  useUpdateUserStatusMutation,
} from "../../redux/apiSlices/userSlice.js";
import UserDetailsModal from "./UserDetailsModal";
import GradientButton from "../common/GradiantButton";
import { Filtering, FilteringIcon } from "../common/Svg";
import moment from "moment";
import Spinner from "../common/Spinner.jsx";

const UserManagementTable = () => {
  const [searchText, setSearchText] = useState(""); 
  const [statusFilter, setStatusFilter] = useState("All");
  const [planFilter, setPlanFilter] = useState("All");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  // Use RTK Query hooks
  const [queryParams, setQueryParams] = useState([]);
  const { data, isLoading, refetch } = useGetAllUsersQuery(queryParams);
  const [updateUserStatus, { isLoading: isUpdating }] =
    useUpdateUserStatusMutation();


  useEffect(() => {
    const params = [];

    if (statusFilter !== "All") {
      params.push({ name: "status", value: statusFilter });
    }

    if (planFilter !== "All") {
      params.push({ name: "planRunning", value: planFilter });
    }

    if (searchText) {
      params.push({ name: "searchTerm", value: searchText }); 
    }

    setQueryParams(params);
  }, [statusFilter, planFilter, searchText]);

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

  // Function to toggle user status between Active and Block with confirmation
  const toggleUserStatus = async (userId, currentStatus) => {
    Modal.confirm({
      title: "Are you sure?",
      content: `Do you want to change the user status to ${
        currentStatus === "active" ? "block" : "active"
      }?`,
      okText: "Yes",
      cancelText: "No",
      onOk: async () => {
        try {
          await updateUserStatus({
            userId,
            status: currentStatus === "active" ? "block" : "active",
          }).unwrap();
          message.success(
            `User status updated successfully to ${
              currentStatus === "active" ? "block" : "active"
            }`
          );
          refetch();
        } catch (error) {
          message.error(`Failed to update status: ${error.message}`);
        }
      },
      onCancel() {},
    });
  };

  const columns = [
    {
      title: "SL",
      dataIndex: "sl",
      key: "sl",
      width: 60,
      align: "center",
      render: (_, __, index) => index + 1,
    },
    {
      title: "User Name",
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
      title: "Phone Number",
      dataIndex: "phone",
      key: "phone",
      align: "center",
      render: (text) => <span>{text || "N/A"}</span>,
    },
    {
      title: "Joining Date",
      dataIndex: "joinDate",
      key: "joinDate",
      render: (text) => <span>{moment(text).format("L")} </span>,
    },
    {
      title: "Subscription",
      dataIndex: "isSubscribed",
      key: "isSubscribed",
      align: "center",
      render: (text) => <span>{text ? "yes" : "No"} </span>,
    },
    {
      title: "Plan Running",
      dataIndex: "packagename",
      key: "packagename",
      align: "center",
      render: (text) => <span>{text || "N/A"}</span>,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      align: "center",
      render: (status) => (
        <span
          style={{
            color: status === "active" ? "#52c41a " : "#f5222d",
            fontWeight: status === "active" ? "bold" : "normal",
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
            onClick={() => toggleUserStatus(record._id, record.status)}
            style={{
              background: record.status === "active" ? "#52c41a" : "#f5222d",
              borderColor: record.status === "active" ? "#d9363e" : "#3f8600",
            }}
            className="h-10 px-4 py-2 rounded-md text-white"
            disabled={isUpdating} 
          >
            {isUpdating
              ? "Updating..."
              : record.status === "active"
              ? "block"
              : "active"}
          </button>
        </Space>
      ),
    },
  ];

  const statusMenu = (
    <Menu>
      <Menu.Item key="all" onClick={() => setStatusFilter("All")}>
        All Status
      </Menu.Item>
      <Menu.Item key="active" onClick={() => setStatusFilter("active")}>
        Active
      </Menu.Item>
      <Menu.Item key="block" onClick={() => setStatusFilter("block")}>
        Block
      </Menu.Item>
    </Menu>
  );

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


  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Spinner />
      </div>
    );
  }

  return (
    <div style={{ width: "100%" }}>
      <div className="flex justify-between mb-6 items-center">
        <Input
          placeholder="Search by user name or email"
          prefix={<SearchOutlined />}
          style={{ width: 300, height: 40 }}
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
                  <Filtering className="filtering-icon" />
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
                  <Filtering className="filtering-icon" />
                  <span className="filter-text">
                    {planFilter === "All" ? "All Plans" : planFilter}
                  </span>
                  <DownOutlined />
                </Space>
              </Button>
            </Dropdown>
          </Space>
        </div>
      </div>

      <div className="border-2 rounded-lg">
        <Table
          columns={columns}
          dataSource={data?.users || []}
          loading={isLoading}
          pagination={{
            defaultPageSize: 10,
            total: data?.pagination?.total,
            current: data?.pagination?.currentPage,
            onChange: (page) => {
              const paginationParams = [...queryParams];
              const pageParam = paginationParams.findIndex(
                (p) => p.name === "page"
              );
              if (pageParam !== -1) {
                paginationParams[pageParam].value = page;
              } else {
                paginationParams.push({ name: "page", value: page });
              }
              setQueryParams(paginationParams);
            },
          }}
          size="middle"
          rowKey="_id"
          className="custom-table"
        />
      </div>

      {selectedUser && (
        <UserDetailsModal
          visible={isModalVisible}
          onClose={handleModalClose}
          userDetails={selectedUser.userDetails || selectedUser}
        />
      )}
    </div>
  );
};

export default UserManagementTable;
