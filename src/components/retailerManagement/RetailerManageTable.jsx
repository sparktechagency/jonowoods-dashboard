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
  Tag,
  Card,
  Row,
  Col,
} from "antd";
import {
  EditOutlined,
  EyeOutlined,
  DownOutlined,
  PlusOutlined,
  DeleteOutlined,
  DragOutlined,
  TableOutlined,
  AppstoreOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import VideoFormModal from "./VideoFormModal";
import VideoDetailsModal from "./VideoDetailsModal";
import GradientButton from "../common/GradiantButton";
import {
  useGetAllVideosQuery,
  useDeleteVideoMutation,
  useUpdateVideoStatusMutation,
  useGetVideoByIdQuery,
  useUpdateVideoOrderMutation,
} from "../../redux/apiSlices/videoApi";
import { getVideoAndThumbnail } from "../common/imageUrl";
import moment from "moment/moment";
import { Filtering } from "../common/Svg";
import Spinner from "../common/Spinner";
import { useGetCategoryQuery } from "../../redux/apiSlices/categoryApi";

const VideoCard = ({
  video,
  onEdit,
  onView,
  onDelete,
  onStatusChange,
  isDragging,
  dragHandleProps,
}) => {
  return (
    <Card
      className={`video-card ${isDragging ? "dragging" : ""}`}
      style={{
        marginBottom: 10,
        borderRadius: 12,
        overflow: "hidden",
        boxShadow: isDragging
          ? "0 8px 32px rgba(0,0,0,0.2)"
          : "0 2px 8px rgba(0,0,0,0.1)",
        transform: isDragging ? "rotate(2deg) scale(1.02)" : "none",
        transition: "all 0.3s ease",
        border: isDragging ? "2px solid #1890ff" : "1px solid #f0f0f0",
        opacity: isDragging ? 0.8 : 1,
      }}
      hoverable
    >
      <Row gutter={16} align="middle">
        <Col span={1}>
          <div
            {...dragHandleProps}
            className="drag-handle"
            style={{
              cursor: "grab",
              padding: "8px",
              color: "#666",
              fontSize: "16px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: "4px",
            }}
          >
            <DragOutlined />
          </div>
        </Col>

        <Col span={4}>
          <img
            src={getVideoAndThumbnail(video.thumbnailUrl)}
            alt={video.title}
            style={{
              width: "100%",
              height: 80,
              objectFit: "cover",
              borderRadius: 8,
            }}
          />
        </Col>

        <Col span={8}>
          <div>
            <h4 style={{ margin: 0, fontSize: "16px", fontWeight: "600" }}>
              {video.title}
            </h4>
            <p style={{ margin: "4px 0", color: "#666", fontSize: "14px" }}>
              {video.categoryId?.name || "No Category"} • {video.type}
            </p>
            <p style={{ margin: 0, color: "#999", fontSize: "12px" }}>
              Duration: {video.duration || "N/A"}
            </p>
          </div>
        </Col>

        <Col span={3}>
          <Tag color={video.status === "active" ? "success" : "error"}>
            {video.status === "active" ? "Active" : "Inactive"}
          </Tag>
        </Col>

        <Col span={3}>
          <div style={{ fontSize: "12px", color: "#999" }}>
            {moment(video.createdAt).format("L")}
          </div>
        </Col>

        <Col span={5}>
          <Space size="small">
            <Button
              type="text"
              icon={<EditOutlined />}
              onClick={() => onEdit(video)}
              style={{ color: "#1890ff" }}
              title="Edit Video"
            />
            <Button
              type="text"
              icon={<EyeOutlined />}
              onClick={() => onView(video)}
              style={{ color: "#52c41a" }}
              title="View Details"
            />
            <Switch
              size="small"
              checked={video.status === "active"}
              onChange={(checked) => onStatusChange(checked, video)}
            />
            <Button
              type="text"
              icon={<DeleteOutlined />}
              onClick={() => onDelete(video._id)}
              style={{ color: "#ff4d4f" }}
              danger
              title="Delete Video"
            />
          </Space>
        </Col>
      </Row>
    </Card>
  );
};

const DraggableVideoList = ({
  videos,
  onReorder,
  onEdit,
  onView,
  onDelete,
  onStatusChange,
}) => {
  const [draggedItem, setDraggedItem] = useState(null);
  const [dragOverItem, setDragOverItem] = useState(null);

  const handleDragStart = (e, video) => {
    setDraggedItem(video);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e, video) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    setDragOverItem(video);
  };

  const handleDragEnd = () => {
    setDraggedItem(null);
    setDragOverItem(null);
  };

  const handleDrop = (e, targetVideo) => {
    e.preventDefault();

    if (!draggedItem || draggedItem._id === targetVideo._id) {
      return;
    }

    const draggedIndex = videos.findIndex((v) => v._id === draggedItem._id);
    const targetIndex = videos.findIndex((v) => v._id === targetVideo._id);

    const newVideos = [...videos];
    const [removed] = newVideos.splice(draggedIndex, 1);
    newVideos.splice(targetIndex, 0, removed);

    // Update order numbers
    const reorderedVideos = newVideos.map((video, index) => ({
      ...video,
      order: index + 1,
    }));

    onReorder(reorderedVideos);

    message.success(`"${draggedItem.title}" has been successfully reordered!`);
  };

  return (
    <div className="draggable-video-list">
      {videos.map((video) => (
        <div
          key={video._id}
          draggable
          onDragStart={(e) => handleDragStart(e, video)}
          onDragOver={(e) => handleDragOver(e, video)}
          onDragEnd={handleDragEnd}
          onDrop={(e) => handleDrop(e, video)}
          className={`drag-item ${
            dragOverItem?._id === video._id ? "drag-over" : ""
          }`}
          style={{
            transition: "all 0.2s ease",
          }}
        >
          <VideoCard
            video={video}
            onEdit={onEdit}
            onView={onView}
            onDelete={onDelete}
            onStatusChange={onStatusChange}
            isDragging={draggedItem?._id === video._id}
            dragHandleProps={{
              onMouseDown: (e) => e.preventDefault(),
            }}
          />
        </div>
      ))}

      <style jsx>{`
        .drag-item {
          transition: transform 0.2s ease, opacity 0.2s ease;
        }

        .drag-over {
          border-top: 3px solid #1890ff;
          padding-top: 8px;
          margin-top: 8px;
        }

        .video-card:hover {
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
          transform: translateY(-2px);
        }

        .drag-handle:hover {
          color: #1890ff;
          background: rgba(24, 144, 255, 0.1);
          border-radius: 4px;
        }

        .drag-handle:active {
          cursor: grabbing;
        }

        .dragging {
          z-index: 1000;
          position: relative;
        }
      `}</style>
    </div>
  );
};

const VideoManagementSystem = () => {
  const navigate = useNavigate();

  // Modal and editing states
  const [isFormModalVisible, setIsFormModalVisible] = useState(false);
  const [isDetailsModalVisible, setIsDetailsModalVisible] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [currentVideo, setCurrentVideo] = useState(null);
  const [equipmentTags, setEquipmentTags] = useState([]);

  // View mode state
  const [viewMode, setViewMode] = useState("card");

  // Filters and pagination
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Build query params
  const queryParams = [];
  if (statusFilter !== "all")
    queryParams.push({ name: "status", value: statusFilter });
  if (typeFilter !== "all")
    queryParams.push({ name: "type", value: typeFilter });
  if (categoryFilter !== "all")
    queryParams.push({ name: "category", value: categoryFilter });
  queryParams.push({ name: "page", value: currentPage });
  queryParams.push({ name: "limit", value: pageSize });

  // API calls
  const { data: categoryData } = useGetCategoryQuery();
  const categories = categoryData?.data || [];

  const {
    data: videosData,
    isLoading: isLoadingVideos,
    refetch,
  } = useGetAllVideosQuery(queryParams);

  const videos = videosData?.data || [];
  const paginationData = videosData?.pagination || {
    total: 0,
    current: 1,
    pageSize: 10,
  };

  // Fetch single video data when editingId is set
  const { data: videoDetails } = useGetVideoByIdQuery(editingId, {
    skip: !editingId,
  });

  const [deleteVideo] = useDeleteVideoMutation();
  const [updateVideoStatus] = useUpdateVideoStatusMutation();
  const [updateVideoOrder] = useUpdateVideoOrderMutation();

  // Update currentVideo and equipmentTags whenever videoDetails or editingId changes
  useEffect(() => {
    if (editingId && videoDetails) {
      setCurrentVideo({
        ...videoDetails,
        id: videoDetails._id || videoDetails.id,
      });
      setEquipmentTags(videoDetails.equipment || []);
    } else if (!editingId) {
      setCurrentVideo(null);
      setEquipmentTags([]);
    }
  }, [editingId, videoDetails]);

  // Reset page on filter change
  useEffect(() => {
    setCurrentPage(1);
  }, [statusFilter, categoryFilter]);

  // Handle video reordering
  const handleReorder = async (reorderedVideos) => {
    try {
      // API call to update order in database
      const orderData = reorderedVideos.map((video, index) => ({
        id: video._id,
        order: index + 1,
      }));

      // Send this data to your API mutation
      await updateVideoOrder(orderData).unwrap();

      // Refetch to get updated data
      await refetch();
    } catch (error) {
      message.error("Failed to update video order");
      console.error("Reorder error:", error);
    }
  };

  // Show form modal for add or edit
  const showFormModal = (record = null) => {
    if (record) {
      setEditingId(record._id);
    } else {
      setEditingId(null);
    }
    setIsFormModalVisible(true);
  };

  // Show details modal and set editingId to fetch video details
  const showDetailsModal = (record) => {
    if (record.type === "class") {
      setEditingId(record._id);
      setIsDetailsModalVisible(true);
    } else if (record.type === "course") {
      const subCategoryId = record.subCategoryId?._id || record.subCategoryId;
      if (subCategoryId) {
        navigate(`/retailer/${subCategoryId}`);
      } else {
        message.error("Subcategory ID not found");
      }
    }
  };

  // Close form modal and reset states
  const closeFormModal = () => {
    setIsFormModalVisible(false);
    setEditingId(null);
    setCurrentVideo(null);
    setEquipmentTags([]);
  };

  // Close details modal and reset states
  const closeDetailsModal = () => {
    setIsDetailsModalVisible(false);
    setEditingId(null);
    setCurrentVideo(null);
    setEquipmentTags([]);
  };

  // After form submission, close modal and refresh list
  const handleFormSubmit = async () => {
    closeFormModal();
    await refetch();
  };

  // Delete video with confirmation
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
        } catch {
          message.error("Failed to delete video");
        }
      },
    });
  };

  // Change video status with confirmation
  const handleStatusChange = (checked, record) => {
    const newStatus = checked ? "active" : "inactive";
    Modal.confirm({
      title: `Do you want to change status to "${newStatus}"?`,
      okText: "Yes",
      cancelText: "No",
      okButtonProps: { style: { backgroundColor: "red", borderColor: "red" } },
      onOk: async () => {
        try {
          await updateVideoStatus({
            id: record._id,
            ...record,
            status: newStatus,
          }).unwrap();
          message.success(`Video status changed to ${newStatus}`);
          refetch();
        } catch {
          message.error("Failed to update video status");
        }
      },
    });
  };

  // Pagination handler
  const handleTableChange = (paginationConfig) => {
    setCurrentPage(paginationConfig.current);
    setPageSize(paginationConfig.pageSize);
  };

  // Filter handlers
  const handleCategoryFilter = (category) =>
    setCategoryFilter(category.toLowerCase());
  const handleStatusFilter = (status) => setStatusFilter(status.toLowerCase());
  const handleTypeFilter = (type) => setTypeFilter(type.toLowerCase());

  // Filter menus
  const categoryMenu = (
    <Menu>
      <Menu.Item key="all" onClick={() => handleCategoryFilter("all")}>
        All Categories
      </Menu.Item>
      {categories.map((cat) => (
        <Menu.Item key={cat._id} onClick={() => handleCategoryFilter(cat.name)}>
          {cat.name}
        </Menu.Item>
      ))}
    </Menu>
  );

  const statusMenu = (
    <Menu>
      <Menu.Item key="all" onClick={() => handleStatusFilter("all")}>
        All Status
      </Menu.Item>
      <Menu.Item key="active" onClick={() => handleStatusFilter("active")}>
        Active
      </Menu.Item>
      <Menu.Item key="inactive" onClick={() => handleStatusFilter("inactive")}>
        Inactive
      </Menu.Item>
    </Menu>
  );

  const typeMenu = (
    <Menu>
      <Menu.Item key="all" onClick={() => handleTypeFilter("all")}>
        All Types
      </Menu.Item>
      <Menu.Item key="class" onClick={() => handleTypeFilter("class")}>
        Class
      </Menu.Item>
      <Menu.Item key="course" onClick={() => handleTypeFilter("course")}>
        Course
      </Menu.Item>
    </Menu>
  );

  // Table columns
  const columns = [
    {
      title: "SL",
      key: "id",
      width: 70,
      align: "center",
      render: (_, __, index) => `# ${(currentPage - 1) * pageSize + index + 1}`,
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
      render: (_, record) => (
        <div style={{ display: "flex", justifyContent: "center" }}>
          <img
            src={getVideoAndThumbnail(record.thumbnailUrl)}
            alt="thumbnail"
            style={{ width: 100, height: 50, objectFit: "cover" }}
            className="rounded-lg"
          />
        </div>
      ),
    },
    {
      title: "Category",
      dataIndex: ["categoryId", "name"],
      key: "category",
      align: "center",
    },
    {
      title: "Type",
      dataIndex: "type",
      key: "type",
      align: "center",
    },
    {
      title: "Upload Date",
      dataIndex: "createdAt",
      key: "createdAt",
      align: "center",
      render: (text) => moment(text).format("L"),
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
            onClick={() => showFormModal(record)}
          />
          <Button
            type="text"
            icon={<EyeOutlined style={{ color: "#55f" }} />}
            onClick={() => showDetailsModal(record)}
            title={
              record.type === "class"
                ? "View Details"
                : "View Subcategory Videos"
            }
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
            onClick={() => handleDeleteVideo(record._id)}
          />
        </Space>
      ),
    },
  ];

  // Display text helpers
  const getCategoryDisplayText = () => {
    if (categoryFilter === "all") return "All Categories";
    const category = categories.find(
      (cat) => cat.name.toLowerCase() === categoryFilter
    );
    return category ? category.name : "All Categories";
  };

  const getTypeDisplayText = () => {
    if (typeFilter === "all") return "All Types";
    return typeFilter.charAt(0).toUpperCase() + typeFilter.slice(1);
  };

  const getStatusDisplayText = () => {
    if (statusFilter === "all") return "All Status";
    return statusFilter.charAt(0).toUpperCase() + statusFilter.slice(1);
  };

  if (isLoadingVideos) {
    return <Spinner />;
  }

  return (
    <div style={{ padding: 24, minHeight: "100vh" }}>
      {/* Controls */}
      <div
        className="flex justify-between items-center mb-6"
        style={{ marginBottom: 24 }}
      >
        <Space size="middle">
          <Dropdown
            overlay={categoryMenu}
            trigger={["click"]}
            placement="bottomLeft"
          >
            <Button
              className="py-5 mr-2 text-white bg-red-600 hover:bg-red-800 hover:text-white hover:icon-black"
              style={{
                border: "none",
                borderRadius: "8px",
                height: "40px",
              }}
            >
              <Space>
                <Filtering className="filtering-icon" />
                <span className="filter-text">{getCategoryDisplayText()}</span>
                <DownOutlined />
              </Space>
            </Button>
          </Dropdown>

          <Dropdown
            overlay={statusMenu}
            trigger={["click"]}
            placement="bottomLeft"
          >
            <Button
              className="py-5 mr-2 text-white bg-red-600 hover:bg-red-800 hover:text-white hover:icon-black"
              style={{
                border: "none",
                borderRadius: "8px",
                height: "40px",
              }}
            >
              <Space>
                <Filtering className="filtering-icon" />
                <span className="filter-text">{getStatusDisplayText()}</span>
                <DownOutlined />
              </Space>
            </Button>
          </Dropdown>

          <Dropdown
            overlay={typeMenu}
            trigger={["click"]}
            placement="bottomLeft"
          >
            <Button
              className="py-5 mr-2 text-white bg-red-600 hover:bg-red-800 hover:text-white hover:icon-black"
              style={{
                border: "none",
                borderRadius: "8px",
                height: "40px",
              }}
            >
              <Space>
                <Filtering className="filtering-icon" />
                <span className="filter-text">{getTypeDisplayText()}</span>
                <DownOutlined />
              </Space>
            </Button>
          </Dropdown>
        </Space>

        <Space size="middle">
          <Button.Group>
            <Button
              type="default"
              icon={<AppstoreOutlined />}
              onClick={() => setViewMode("card")}
              style={{
                borderRadius: "8px 0 0 8px",
                backgroundColor: viewMode === "card" ? "#CA3939" : undefined,
                color: viewMode === "card" ? "#fff" : undefined,
                padding: "10px 16px",
              }}
              className="h-10"
            >
              Card View
            </Button>
            <Button
              type="default"
              icon={<TableOutlined />}
              onClick={() => setViewMode("table")}
              style={{
                borderRadius: "0 8px 8px 0",
                backgroundColor: viewMode === "table" ? "#CA3939" : undefined,
                color: viewMode === "table" ? "#fff" : undefined,
                padding: "10px 16px",
              }}
              className="h-10"
            >
              Table View
            </Button>
          </Button.Group>

          <GradientButton
            type="primary"
            onClick={() => showFormModal()}
            className="py-5"
            icon={<PlusOutlined />}
          >
            Upload New Video
          </GradientButton>
        </Space>
      </div>

      {/* Content */}
      <div
        style={{
          background: "white",
          borderRadius: "16px",
          padding: "24px",
          boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
        }}
      >
        {viewMode === "card" ? (
          <DraggableVideoList
            videos={videos}
            onReorder={handleReorder}
            onEdit={showFormModal}
            onView={showDetailsModal}
            onDelete={handleDeleteVideo}
            onStatusChange={handleStatusChange}
          />
        ) : (
          <Table
            columns={columns}
            dataSource={videos}
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
          />
        )}
      </div>

      {videos.length === 0 && (
        <div
          style={{
            textAlign: "center",
            padding: "60px 20px",
            color: "#999",
          }}
        >
          <h3>No videos found</h3>
          <p>Adjust your filters or add new videos</p>
        </div>
      )}

      {/* Add/Edit Video Modal */}
      <VideoFormModal
        visible={isFormModalVisible}
        onCancel={closeFormModal}
        onSuccess={handleFormSubmit}
        currentVideo={currentVideo}
        editingId={editingId}
        categories={categories}
        equipmentTags={equipmentTags}
        setEquipmentTags={setEquipmentTags}
      />

      {/* Video Details Modal */}
      <VideoDetailsModal
        visible={isDetailsModalVisible}
        onCancel={closeDetailsModal}
        currentVideo={currentVideo}
      />
    </div>
  );
};

export default VideoManagementSystem;
