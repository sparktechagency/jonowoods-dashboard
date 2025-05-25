import React, { useState, useEffect, useCallback } from "react";
import {
  Table,
  Button,
  Modal,
  Space,
  Switch,
  Dropdown,
  Menu,
  message,
  Tag,
  Spin,
} from "antd";
import {
  EditOutlined,
  EyeOutlined,
  DownOutlined,
  PlusOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import GradientButton from "../common/GradiantButton";
import { Filtering } from "../common/Svg";
import moment from "moment/moment";
import VideoFormModal from "./VideoUploadModal";
import Spinner from "./Spinner";
import { getVideoAndThumbnail } from "./imageUrl";

const VideoUploadSystem = ({ pageType , apiHooks }) => {
  // Destructure API hooks passed as props
  const {
    useGetAllQuery,
    deleteItem,
    updateItemStatus,
    createItem,
    updateItem,
    categories = [],
  } = apiHooks;

  // State management
  const [isFormModalVisible, setIsFormModalVisible] = useState(false);
  const [isDetailsModalVisible, setIsDetailsModalVisible] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [currentItem, setCurrentItem] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Filtering and pagination
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(2);
  const [searchText, setSearchText] = useState("");

  // Build query params
  const queryParams = React.useMemo(() => {
    const params = [];
    if (searchText) params.push({ name: "searchTerm", value: searchText });
    if (statusFilter !== "all")
      params.push({ name: "status", value: statusFilter });
    if (categoryFilter !== "all")
      params.push({ name: "category", value: categoryFilter });
    params.push({ name: "page", value: currentPage });
    params.push({ name: "limit", value: pageSize });
    return params;
  }, [searchText, statusFilter, categoryFilter, currentPage, pageSize]);

  const {
    data: itemsData,
    isLoading: isLoadingItems,
    refetch,
  } = useGetAllQuery(queryParams.length > 0 ? queryParams : []);

  console.log("Items Data:", itemsData);

  const items = itemsData?.data || [];
  const paginationData = itemsData?.pagination || {
    total: 0,
    current: 1,
    pageSize: 10,
  };

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [statusFilter, categoryFilter, searchText]);

  // Modal handlers
  const showFormModal = useCallback((record = null) => {
    if (record) {
      setEditingId(record._id);
      setCurrentItem({ ...record, id: record._id });
    } else {
      setEditingId(null);
      setCurrentItem(null);
    }
    setIsFormModalVisible(true);
  }, []);

  const showDetailsModal = useCallback((record) => {
    setCurrentItem(record);
    setIsDetailsModalVisible(true);
  }, []);

  // Updated form submit handler
  const handleFormSubmit = useCallback(
    async (formData) => {
      setIsSubmitting(true);
      try {
        if (editingId) {
          // Update existing item
          console.log("Updating item with ID:", editingId);
          console.log("FormData for update:", formData);

          const result = await updateItem({
            id: editingId,
            comingSoonData:formData,
          });
          console.log("Update result:", result);

          message.success(`${getPageTitle()} updated successfully`);
        } else {
          // Create new item
          console.log("Creating new item");
          console.log("FormData for create:", formData);

          const result = await createItem(formData);
          console.log("Create result:", result);

          message.success(`${getPageTitle()} created successfully`);
        }

        setIsFormModalVisible(false);
        setEditingId(null);
        setCurrentItem(null);

        // Refetch data to show updated results
        await refetch();
      } catch (error) {
        console.error("Error in form submit:", error);
        message.error(
          `Failed to ${editingId ? "update" : "create"} ${getPageTitle()}: ${
            error?.message || "Unknown error"
          }`
        );
      } finally {
        setIsSubmitting(false);
      }
    },
    [editingId, createItem, updateItem, refetch]
  );

  // Delete handler
  const handleDeleteItem = useCallback(
    (id) => {
      Modal.confirm({
        title: `Are you sure you want to delete this ${getPageTitle()} item?`,
        content: "This action cannot be undone.",
        okText: "Yes",
        okType: "danger",
        cancelText: "No",
        onOk: async () => {
          try {
            await deleteItem(id);
            message.success(`${getPageTitle()} item deleted successfully`);
            refetch();
          } catch (error) {
            message.error(`Failed to delete ${getPageTitle()} item`);
            console.error("Error deleting item:", error);
          }
        },
      });
    },
    [deleteItem, refetch]
  );

  // Status change handler
  const handleStatusChange = useCallback(
    (checked, record) => {
      const newStatus = checked ? "active" : "inactive";
      Modal.confirm({
        title: `Are you sure you want to set the status to "${newStatus}"?`,
        okText: "Yes",
        cancelText: "No",
        okButtonProps: {
          style: { backgroundColor: "red", borderColor: "red" },
        },
        onOk: async () => {
          try {
            if (updateItemStatus) {
              await updateItemStatus({
                id: record._id,
                status: newStatus,
              });
            } else {
              // Fallback to update mutation if no specific status update hook
              await updateItem({
                id: record._id,
                formData: { ...record, status: newStatus },
              });
            }
            message.success(`Status updated to ${newStatus}`);
            refetch();
          } catch (error) {
            message.error("Failed to update status");
            console.error("Error updating status:", error);
          }
        },
      });
    },
    [updateItemStatus, updateItem, refetch]
  );

  // Table change handler
  const handleTableChange = useCallback((paginationConfig) => {
    setCurrentPage(paginationConfig.current);
    setPageSize(paginationConfig.pageSize);
  }, []);

  // Modal close handlers
  const handleDetailsModalClose = useCallback(() => {
    setIsDetailsModalVisible(false);
    setCurrentItem(null);
  }, []);

  const handleFormModalClose = useCallback(() => {
    setIsFormModalVisible(false);
    setEditingId(null);
    setCurrentItem(null);
  }, []);

  const handleStatusFilterChange = useCallback((status) => {
    setStatusFilter(status.toLowerCase());
  }, []);

  const statusMenu = React.useMemo(
    () => (
      <Menu>
        <Menu.Item key="all" onClick={() => handleStatusFilterChange("all")}>
          All Status
        </Menu.Item>
        <Menu.Item
          key="active"
          onClick={() => handleStatusFilterChange("active")}
        >
          Active
        </Menu.Item>
        <Menu.Item
          key="inactive"
          onClick={() => handleStatusFilterChange("inactive")}
        >
          Inactive
        </Menu.Item>
      </Menu>
    ),
    [handleStatusFilterChange]
  );

  // Table columns
  const columns = React.useMemo(
    () => [
      {
        title: "SL",
        key: "id",
        width: 70,
        align: "center",
        render: (text, record, index) => {
          const actualIndex = (currentPage - 1) * pageSize + index + 1;
          return `# ${actualIndex}`;
        },
      },
      {
        title: "Title",
        dataIndex: "title",
        key: "title",
        align: "center",
      },
      {
        title: "Category",
        dataIndex: "category",
        key: "category",
        align: "center",
      },
      {
        title: "Duration",
        dataIndex: "duration",
        key: "duration",
        align: "center",
      },
      {
        title: "Thumbnail",
        dataIndex: "thumbnailUrl",
        key: "thumbnailUrl",
        align: "center",
        render: (_, record) => {
          return (
            <div style={{ display: "flex", justifyContent: "center" }}>
              <img
                src={getVideoAndThumbnail(record.thumbnailUrl)}
                alt="thumbnail"
                style={{
                  width: 100,
                  height: 50,
                  objectFit: "cover",
                }}
                className="rounded-lg"
              />
            </div>
          );
        },
      },
      {
        title: "Created Date",
        dataIndex: "createdAt",
        key: "createdAt",
        align: "center",
        render: (text) => moment(text).format("L"),
      },
      {
        title: "Status",
        dataIndex: "status",
        key: "status",
        align: "center",
        render: (status) => (
          <Tag color={status === "active" ? "success" : "error"}>
            {status === "active" ? "Active" : "Inactive"}
          </Tag>
        ),
      },
      {
        title: "Action",
        key: "action",
        align: "center",
        render: (_, record) => (
          <Space
            size="small"
            style={{ display: "flex", justifyContent: "center" }}
          >
            <Button
              type="text"
              icon={<EditOutlined style={{ color: "#f55" }} />}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                showFormModal(record);
              }}
            />
            <Button
              type="text"
              icon={<EyeOutlined style={{ color: "#55f" }} />}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                showDetailsModal(record);
              }}
            />
            <Switch
              size="small"
              checked={record.status === "active"}
              onChange={(checked, e) => {
                if (e) {
                  e.preventDefault();
                  e.stopPropagation();
                }
                handleStatusChange(checked, record);
              }}
              onClick={(checked, e) => {
                if (e) {
                  e.preventDefault();
                  e.stopPropagation();
                }
              }}
              style={{
                backgroundColor: record.status === "active" ? "red" : "gray",
              }}
            />
            <Button
              type="text"
              icon={<DeleteOutlined style={{ color: "#ff4d4f" }} />}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handleDeleteItem(record._id);
              }}
            />
          </Space>
        ),
      },
    ],
    [
      currentPage,
      pageSize,
      showFormModal,
      showDetailsModal,
      handleStatusChange,
      handleDeleteItem,
    ]
  );

  // Display text helpers
  const getCategoryDisplayText = () => {
    if (categoryFilter === "all") return "All Categories";
    const category = categories.find(
      (cat) => cat.toLowerCase() === categoryFilter
    );
    return category || "All Categories";
  };

  const getStatusDisplayText = () => {
    if (statusFilter === "all") return "All Status";
    return statusFilter.charAt(0).toUpperCase() + statusFilter.slice(1);
  };

  const getPageTitle = () => {
    switch (pageType) {
      case "coming-soon":
        return "Coming Soon";
      case "today-video":
        return "Today's Video";
      case "challenge-video":
        return "Challenge Video";
      default:
        return "Content";
    }
  };

  if (isLoadingItems) {
    return (
      <div>
        <Spinner />
      </div>
    );
  }

  return (
    <div>
      {/* Header with filters and add button */}
      <div className="flex justify-end gap-6 mb-6">
        <div>
          <Space size="small" className="flex gap-4">
            {/* Status Filter */}
            <Dropdown
              overlay={statusMenu}
              trigger={["click"]}
              placement="bottomLeft"
            >
              <Button
                className="py-5 mr-2 text-white bg-red-600 hover:bg-red-800 hover:text-white hover:icon-black"
                style={{ border: "none" }}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                }}
              >
                <Space>
                  <Filtering className="filtering-icon" />
                  <span className="filter-text">{getStatusDisplayText()}</span>
                  <DownOutlined />
                </Space>
              </Button>
            </Dropdown>
          </Space>
        </div>

        <GradientButton
          type="primary"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            showFormModal();
          }}
          className="py-5"
          icon={<PlusOutlined />}
        >
          Add New {getPageTitle()} Content
        </GradientButton>
      </div>

      {/* Table */}
      <Table
        columns={columns}
        dataSource={items}
        pagination={{
          current: currentPage,
          pageSize: pageSize,
          total: paginationData.total || 0,
        }}
        onChange={handleTableChange}
        rowKey="_id"
        bordered
        size="small"
        className="custom-table"
        scroll={{ x: "max-content" }}
        onRow={(record) => ({
          onClick: (e) => {
            e.stopPropagation();
          },
        })}
      />

      {/* Video Form Modal */}
      <VideoFormModal
        visible={isFormModalVisible}
        onClose={handleFormModalClose}
        onSubmit={handleFormSubmit}
        editingItem={currentItem}
        pageType={pageType}
        loading={isSubmitting}
      />

      {/* Video Details Modal */}
      {/* <VideoDetailsModal
        visible={isDetailsModalVisible}
        onClose={handleDetailsModalClose}
        item={currentItem}
        pageType={pageType}
      /> */}
    </div>
  );
};

export default VideoUploadSystem;
