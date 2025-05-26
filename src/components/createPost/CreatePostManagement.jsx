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
} from "antd";
import {
  EditOutlined,
  EyeOutlined,
  DownOutlined,
  PlusOutlined,
  DeleteOutlined,
  FileTextOutlined,
  FileImageOutlined,
  VideoCameraOutlined,
} from "@ant-design/icons";
import GradientButton from "../common/GradiantButton";
import { Filtering } from "../common/Svg";
import moment from "moment/moment";
import PostFormModal from "./PostFormModal";
import { getVideoAndThumbnail } from "../common/imageUrl";
import { useCreatePostMutation, useDeletePostMutation, useGetAllPostsQuery, useGetPostByIdQuery, useUpdatePostMutation, useUpdatePostStatusMutation } from "../../redux/apiSlices/createPostApi";
import Spinner from "../common/Spinner";

const PostManagementSystem = () => {


  // State management
  const [isFormModalVisible, setIsFormModalVisible] = useState(false);
  const [isDetailsModalVisible, setIsDetailsModalVisible] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [selectedItemId, setSelectedItemId] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Filtering and pagination
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Build query params
  const queryParams = React.useMemo(() => {
    const params = [];
    if (statusFilter !== "all") {
      params.push({ name: "status", value: statusFilter });
    }
    if (typeFilter !== "all") {
      params.push({ name: "type", value: typeFilter });
    }
    params.push({ name: "page", value: currentPage });
    params.push({ name: "limit", value: pageSize });
    return params;
  }, [statusFilter, typeFilter, currentPage, pageSize]);

  // API calls
  const {
    data: postsData,
    isLoading: isLoadingPosts,
    refetch,
    } = useGetAllPostsQuery();
    
    console.log(postsData)

  const { data: postDetails, isLoading: isLoadingDetails } =
    useGetPostByIdQuery(selectedItemId, { skip: !selectedItemId });

  const [deletePost] = useDeletePostMutation();
  const [updatePostStatus] = useUpdatePostStatusMutation();
  const [createPost] = useCreatePostMutation();
  const [updatePost] = useUpdatePostMutation();

  // Handle edit button click
  const handleEdit = (id) => {
    setSelectedItemId(id);
    setEditingId(id);
    setIsFormModalVisible(true);
  };

  // Handle add new button click
  const showFormModal = () => {
    setSelectedItemId(null);
    setEditingId(null);
    setIsFormModalVisible(true);
  };

  // Show details modal
  const showDetailsModal = (record) => {
    setSelectedItemId(record._id);
    setIsDetailsModalVisible(true);
  };

  const posts = postsData?.data || [];
  const paginationData = postsData?.pagination || {
    total: 0,
    current: 1,
    pageSize: 10,
  };

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [statusFilter, typeFilter]);

  // Form submit handler
  const handleFormSubmit = useCallback(
    async (formData) => {
      setIsSubmitting(true);
      try {
        if (editingId) {
          await updatePost({
            id: editingId,
            postData: formData,
          });
          message.success("Post updated successfully");
        } else {
          await createPost(formData);
          message.success("Post created successfully");
        }

        setIsFormModalVisible(false);
        setEditingId(null);
        setSelectedItemId(null);
        await refetch();
      } catch (error) {
        console.error("Error in form submit:", error);
        message.error(
          `Failed to ${editingId ? "update" : "create"} post: ${
            error?.message || "Unknown error"
          }`
        );
      } finally {
        setIsSubmitting(false);
      }
    },
    [editingId, createPost, updatePost, refetch]
  );

  // Delete handler
  const handleDeletePost = useCallback(
    (id) => {
      Modal.confirm({
        title: "Are you sure you want to delete this post?",
        content: "This action cannot be undone.",
        okText: "Yes",
        okType: "danger",
        cancelText: "No",
        onOk: async () => {
          try {
            await deletePost(id);
            message.success("Post deleted successfully");
            refetch();
          } catch (error) {
            message.error("Failed to delete post");
            console.error("Error deleting post:", error);
          }
        },
      });
    },
    [deletePost, refetch]
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
            await updatePostStatus({
              id: record._id,
              status: newStatus,
            });
            message.success(`Status updated to ${newStatus}`);
            refetch();
          } catch (error) {
            message.error("Failed to update status");
            console.error("Error updating status:", error);
          }
        },
      });
    },
    [updatePostStatus, refetch]
  );

  // Table change handler
  const handleTableChange = useCallback((paginationConfig) => {
    setCurrentPage(paginationConfig.current);
    setPageSize(paginationConfig.pageSize);
  }, []);

  // Modal close handlers
  const handleFormModalClose = () => {
    setIsFormModalVisible(false);
    setEditingId(null);
    setSelectedItemId(null);
  };

  const handleDetailsModalClose = () => {
    setIsDetailsModalVisible(false);
    setSelectedItemId(null);
  };

  // Filter handlers
  const handleStatusFilterChange = useCallback((status) => {
    setStatusFilter(status.toLowerCase());
  }, []);

  const handleTypeFilterChange = useCallback((type) => {
    setTypeFilter(type.toLowerCase());
  }, []);

  // Dropdown menus
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

  const typeMenu = React.useMemo(
    () => (
      <Menu>
        <Menu.Item key="all" onClick={() => handleTypeFilterChange("all")}>
          All Types
        </Menu.Item>
        <Menu.Item key="text" onClick={() => handleTypeFilterChange("text")}>
          Text Posts
        </Menu.Item>
        <Menu.Item key="image" onClick={() => handleTypeFilterChange("image")}>
          Image Posts
        </Menu.Item>
        <Menu.Item key="video" onClick={() => handleTypeFilterChange("video")}>
          Video Posts
        </Menu.Item>
      </Menu>
    ),
    [handleTypeFilterChange]
  );

  // Get post type icon
  const getPostTypeIcon = (type) => {
    switch (type) {
      case "text":
        return <FileTextOutlined style={{ color: "#1890ff" }} />;
      case "image":
        return <FileImageOutlined style={{ color: "#52c41a" }} />;
      case "video":
        return <VideoCameraOutlined style={{ color: "#ff4d4f" }} />;
      default:
        return <FileTextOutlined />;
    }
  };

  // Get post type color
  const getPostTypeColor = (type) => {
    switch (type) {
      case "text":
        return "blue";
      case "image":
        return "green";
      case "video":
        return "red";
      default:
        return "default";
    }
  };

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
        ellipsis: true,
      },
      {
        title: "Type",
        dataIndex: "type",
        key: "type",
        align: "center",
        render: (type) => (
          <Tag icon={getPostTypeIcon(type)} color={getPostTypeColor(type)}>
            {type?.toUpperCase()}
          </Tag>
        ),
      },
      {
        title: "Preview",
        key: "preview",
        align: "center",
        render: (_, record) => {
          if (record.type === "text") {
            return (
              <div
                style={{
                  maxWidth: 200,
                  maxHeight: 50,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
                dangerouslySetInnerHTML={{
                  __html: record.content
                    ? record.content.substring(0, 50) + "..."
                    : "No content",
                }}
              />
            );
          } else if (record.type === "image" && record.imageUrl) {
            return (
              <img
                src={getVideoAndThumbnail(record.imageUrl)}
                alt="preview"
                style={{
                  width: 100,
                  height: 50,
                  objectFit: "cover",
                }}
                className="rounded-lg"
              />
            );
          } else if (record.type === "video" && record.thumbnailUrl) {
            return (
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
            );
          }
          return <span>No preview</span>;
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
          <Space size="small">
            <Button
              type="text"
              icon={<EditOutlined style={{ color: "#f55" }} />}
              onClick={() => handleEdit(record._id)}
            />
            <Button
              type="text"
              icon={<EyeOutlined style={{ color: "#55f" }} />}
              onClick={() => showDetailsModal(record)}
            />
            <Switch
              size="small"
              checked={record.status === "active"}
              onChange={(checked) => handleStatusChange(checked, record)}
              style={{
                backgroundColor: record.status === "active" ? "red" : "gray",
              }}
            />
            <Button
              type="text"
              icon={<DeleteOutlined style={{ color: "#ff4d4f" }} />}
              onClick={() => handleDeletePost(record._id)}
            />
          </Space>
        ),
      },
    ],
    [
      currentPage,
      pageSize,
      handleEdit,
      showDetailsModal,
      handleStatusChange,
      handleDeletePost,
    ]
  );

  const getStatusDisplayText = () => {
    if (statusFilter === "all") return "All Status";
    return statusFilter.charAt(0).toUpperCase() + statusFilter.slice(1);
  };

  const getTypeDisplayText = () => {
    if (typeFilter === "all") return "All Types";
    return typeFilter.charAt(0).toUpperCase() + typeFilter.slice(1);
  };

  if (isLoadingPosts) {
    return <Spinner />;
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
              >
                <Space>
                  <Filtering className="filtering-icon" />
                  <span className="filter-text">{getStatusDisplayText()}</span>
                  <DownOutlined />
                </Space>
              </Button>
            </Dropdown>

            {/* Type Filter */}
            <Dropdown
              overlay={typeMenu}
              trigger={["click"]}
              placement="bottomLeft"
            >
              <Button
                className="py-5 mr-2 text-white bg-red-600 hover:bg-red-800 hover:text-white hover:icon-black"
                style={{ border: "none" }}
              >
                <Space>
                  <Filtering className="filtering-icon" />
                  <span className="filter-text">{getTypeDisplayText()}</span>
                  <DownOutlined />
                </Space>
              </Button>
            </Dropdown>
          </Space>
        </div>

        <GradientButton
          type="primary"
          onClick={showFormModal}
          className="py-5"
          icon={<PlusOutlined />}
        >
          Add New Post
        </GradientButton>
      </div>

      {/* Table */}
      <Table
        columns={columns}
        dataSource={posts}
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
      />

      {/* Post Form Modal */}
      <PostFormModal
        visible={isFormModalVisible}
        onClose={handleFormModalClose}
        onSubmit={handleFormSubmit}
        editingItem={postDetails?.data}
        loading={isSubmitting}
      />

      {/* Post Details Modal */}
      {/* <PostDetailsModal
        visible={isDetailsModalVisible}
        onCancel={handleDetailsModalClose}
        currentPost={postDetails?.data}
        loading={isLoadingDetails}
      /> */}
    </div>
  );
};

export default PostManagementSystem;
