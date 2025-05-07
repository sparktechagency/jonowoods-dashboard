import React, { useState, useEffect } from "react";
import {
  Table,
  Button,
  Modal,
  Space,
  Switch,
  Dropdown,
  Menu,
  message,
  Spin,
  Tag,
} from "antd";
import {
  EditOutlined,
  EyeOutlined,
  DownOutlined,
  PlusOutlined,
  LoadingOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import VideoFormModal from "./VideoFormModal";
import VideoDetailsModal from "./VideoDetailsModal";
import GradientButton from "../common/GradiantButton";
import {
  useGetAllVideosQuery,
  useDeleteVideoMutation,
  useUpdateVideoMutation,
  useUpdateVideoStatusMutation,
} from "../../redux/apiSlices/videoApi";
import { getVideoAndThumbnail } from "../common/imageUrl";
import { useGetCategoryQuery } from "../../redux/apiSlices/categoryApi";
import moment from "moment/moment";
import { FilteringIcon } from "../common/Svg";

const VideoManagementSystem = () => {
  // State for modals and editing
  const [isFormModalVisible, setIsFormModalVisible] = useState(false);
  const [isDetailsModalVisible, setIsDetailsModalVisible] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [currentVideo, setCurrentVideo] = useState(null);
  const [equipmentTags, setEquipmentTags] = useState([]);

  // State for filtering and pagination
  const [statusFilter, setStatusFilter] = useState("All");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
  });
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);

  // API hooks
  const { data: categoryData } = useGetCategoryQuery();
  const categories = categoryData?.data || [];

  // Get all videos with filtering and pagination
  const {
    data: videosData,
    isLoading: isLoadingVideos,
    refetch,
  } = useGetAllVideosQuery({
    page: pagination.current,
    pageSize: pagination.pageSize,
    category: categoryFilter,
    status: statusFilter,
  });
  console.log(videosData)

  const videos = videosData?.data || [];
  const paginationData = videosData?.pagination || {
    total: 0,
    current: 1,
    pageSize: 10,
  };

  const [deleteVideo] = useDeleteVideoMutation();
  const [updateVideoStatus] = useUpdateVideoStatusMutation();

  // Reset pagination when filters change
  useEffect(() => {
    setPagination((prev) => ({
      ...prev,
      current: 1, // Reset to first page when filters change
    }));
  }, [statusFilter, categoryFilter]);

  // Show form modal for creating/editing
  const showFormModal = (record = null) => {
    if (record) {
      setEditingId(record._id);
      setCurrentVideo({
        ...record,
        id: record._id, // Ensure id is available for backward compatibility
      });

      // Set equipment tags
      setEquipmentTags(record.equipment || []);

      // Find category ID based on category name
      const categoryObj = categories.find(
        (cat) => cat.name === record.category
      );

      if (categoryObj) {
        setSelectedCategoryId(categoryObj._id);
      } else {
        console.warn("Category not found for:", record.category);
        setSelectedCategoryId(null);
      }
    } else {
      // Reset for new video
      setEditingId(null);
      setCurrentVideo(null);
      setEquipmentTags([]);
      setSelectedCategoryId(null);
    }
    setIsFormModalVisible(true);
  };

  // Show details modal
  const showDetailsModal = (record) => {
    setCurrentVideo(record);
    setIsDetailsModalVisible(true);
  };

  // Handle form submission
  const handleFormSubmit = async () => {
    // Form submission is handled by VideoFormModal
    setIsFormModalVisible(false);
    refetch();
  };

  // Handle video deletion
  const handleDeleteVideo = (id) => {
    Modal.confirm({
      title: "Are you sure you want to delete this video?",
      content: "This action cannot be undone.",
      okText: "Yes",
      okType: "danger",
      cancelText: "No",
      onOk: async () => {
        try {
          await deleteVideo(id).unwrap();
          message.success("Video deleted successfully");
          refetch();
        } catch (error) {
          message.error("Failed to delete video");
          console.error("Error deleting video:", error);
        }
      },
    });
  };

  // Handle status change
  const handleStatusChange = async (checked, record) => {
    try {
      const newStatus = checked ? "active" : "inactive";
      await updateVideoStatus({
        id: record._id,
        ...record,
        status: newStatus,
      }).unwrap();
      message.success(`Video status updated to ${newStatus}`);
      refetch();
    } catch (error) {
      message.error("Failed to update video status");
      console.error("Error updating video status:", error);
    }
  };

  // Handle category selection change
  const handleCategoryChange = (categoryId) => {
    setSelectedCategoryId(categoryId);
  };

  // Handle table pagination change
  const handleTableChange = (pagination) => {
    setPagination({
      current: pagination.current,
      pageSize: pagination.pageSize,
    });
  };

  // Filter menus
  const filterMenu = (
    <Menu>
      <Menu.Item key="all" onClick={() => setCategoryFilter("All")}>
        All Categories
      </Menu.Item>
      {categories?.map((cat) => (
        <Menu.Item key={cat._id} onClick={() => setCategoryFilter(cat.name)}>
          {cat.name}
        </Menu.Item>
      ))}
    </Menu>
  );

  const statusMenu = (
    <Menu>
      <Menu.Item key="all" onClick={() => setStatusFilter("All")}>
        All Status
      </Menu.Item>
      <Menu.Item key="active" onClick={() => setStatusFilter("Active")}>
        Active
      </Menu.Item>
      <Menu.Item key="inactive" onClick={() => setStatusFilter("Inactive")}>
        Inactive
      </Menu.Item>
    </Menu>
  );

  // Table columns
  const columns = [
    {
      title: "SL", // Serial Number
      key: "id",
      width: 70,
      align: "center",
      render: (text, record, index) => {
        // Calculate the actual index based on pagination
        const actualIndex =
          (pagination.current - 1) * pagination.pageSize + index + 1;
        return `# ${actualIndex}`;
      },
    },
    {
      title: "Video Title",
      dataIndex: "title",
      key: "title",
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
            {isLoadingVideos ? (
              <Spin size="small" /> // Show spinner while loading
            ) : (
              <img
                src={getVideoAndThumbnail(record.thumbnailUrl)}
                alt="thumbnail"
                style={{
                  width: 100,
                  height: 50,
                  objectFit: "cover",
                  visibility: isLoadingVideos ? "hidden" : "visible", // Hide image while loading
                }}
                className="rounded-lg"
              />
            )}
          </div>
        );
      },
    },
    {
      title: "Category",
      dataIndex: "category",
      key: "category",
      align: "center",
    },
    {
      title: "Sub Category",
      dataIndex: "subCategory",
      key: "subCategory",
      align: "center",
    },
    {
      title: "Upload Date",
      dataIndex: "createdAt",
      key: "createdAt",
      align: "center",
      render: (text) => {
        return moment(text).format("L");
      },
    },
    {
      title: "Duration",
      dataIndex: "duration",
      key: "duration",
      align: "center",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      align: "center",
      render: (status) => (
        <Tag color={status === "Active" ? "success" : "error"}>{status}</Tag>
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
          {/* Edit Button */}
          <Button
            type="text"
            icon={<EditOutlined style={{ color: "#f55" }} />}
            onClick={() => showFormModal(record)}
          />
          {/* View Button */}
          <Button
            type="text"
            icon={<EyeOutlined style={{ color: "#55f" }} />}
            onClick={() => showDetailsModal(record)}
          />
          {/* Status Switch */}
          <Switch
            size="small"
            checked={record.status === "active"}
            onChange={(checked) => handleStatusChange(checked, record)}
            style={{
              backgroundColor: record.status === "active" ? "red" : "gray",
            }}
          />
          {/* Delete Button */}
          <Button
            type="text"
            icon={<DeleteOutlined style={{ color: "#ff4d4f" }} />}
            onClick={() => handleDeleteVideo(record._id)} // Trigger delete on click
          />
        </Space>
      ),
    },
  ];

  // If loading, show spinner
  if (isLoadingVideos) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "400px",
        }}
      >
        <Spin
          indicator={<LoadingOutlined style={{ fontSize: 36 }} spin />}
          tip="Loading videos..."
        />
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-end gap-6 mb-6">
        <div className="">
          <Space size="small" className="flex gap-4">
            <Dropdown overlay={filterMenu}>
              <Button
                className="py-5 mr-2 text-white bg-red-600 hover:bg-red-800 hover:text-white hover:icon-black"
                style={{ border: "none" }}
              >
                <Space>
                  <FilteringIcon className="filtering-icon" />
                  <span className="filter-text">
                    {categoryFilter === "All"
                      ? "All Categories"
                      : categoryFilter}
                  </span>
                  <DownOutlined />
                </Space>
              </Button>
            </Dropdown>

            <Dropdown overlay={statusMenu}>
              <Button
                className="py-5 mr-2 text-white bg-red-600 hover:bg-red-800 hover:text-white hover:icon-black"
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
          </Space>
        </div>
        <GradientButton
          type="primary"
          onClick={() => showFormModal()}
          className="py-5"
          icon={<PlusOutlined />}
        >
          Upload New Video
        </GradientButton>
      </div>

      <Table
        columns={columns}
        dataSource={videos}
        pagination={{
          current: pagination.current,
          pageSize: pagination.pageSize,
          total: paginationData.total || 0,
        }}
        onChange={handleTableChange}
        rowKey="_id"
        bordered
        size="small"
        className="custom-table"
      />

      {/* Add/Edit Video Modal */}
      <VideoFormModal
        visible={isFormModalVisible}
        onCancel={() => setIsFormModalVisible(false)}
        onSuccess={handleFormSubmit}
        currentVideo={currentVideo}
        editingId={editingId}
        categories={categories}
        selectedCategoryId={selectedCategoryId}
        onCategoryChange={handleCategoryChange}
        equipmentTags={equipmentTags}
        setEquipmentTags={setEquipmentTags}
      />

      {/* Video Details Modal */}
      <VideoDetailsModal
        visible={isDetailsModalVisible}
        onCancel={() => setIsDetailsModalVisible(false)}
        currentVideo={currentVideo}
      />
    </div>
  );
};

export default VideoManagementSystem;
