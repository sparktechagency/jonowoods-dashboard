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
import { render } from "react-dom";
import moment from "moment/moment";

const FilteringIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    style={{ marginRight: "8px" }}
  >
    <path
      d="M0.75 4.2308H12.169C12.5131 5.79731 13.9121 6.97336 15.5805 6.97336C17.2488 6.97336 18.6478 5.79736 18.9919 4.2308H23.25C23.6642 4.2308 24 3.89498 24 3.4808C24 3.06661 23.6642 2.7308 23.25 2.7308H18.9915C18.6467 1.16508 17.2459 -0.0117188 15.5805 -0.0117188C13.9141 -0.0117188 12.5139 1.16489 12.1693 2.7308H0.75C0.335812 2.7308 0 3.06661 0 3.4808C0 3.89498 0.335812 4.2308 0.75 4.2308ZM13.588 3.48277L13.588 3.4747C13.5913 2.37937 14.4851 1.48833 15.5805 1.48833C16.6743 1.48833 17.5681 2.37816 17.5728 3.47297L17.573 3.48398C17.5712 4.58119 16.6781 5.47341 15.5805 5.47341C14.4833 5.47341 13.5904 4.58208 13.5879 3.48553L13.588 3.48277ZM23.25 19.769H18.9915C18.6467 18.2033 17.2459 17.0265 15.5805 17.0265C13.9141 17.0265 12.5139 18.2031 12.1693 19.769H23.25C23.6642 19.769 24 20.1047 24 20.519C24 20.9332 23.6642 21.269 23.25 21.269ZM15.5805 22.5115C14.4833 22.5115 13.5904 21.6202 13.5879 20.5237L13.588 20.5209L13.588 20.5129C13.5913 19.4175 14.4851 18.5265 15.5805 18.5265C16.6743 18.5265 17.5681 19.4163 17.5728 20.511L17.573 20.5221C17.5714 21.6194 16.6782 22.5115 15.5805 22.5115ZM23.25 11.2499H11.831C11.4869 9.68339 10.0879 8.50739 8.41955 8.50739C6.75117 8.50739 5.35223 9.68339 5.00808 11.2499H0.75C0.335812 11.2499 0 11.5857 0 11.9999C0 12.4141 0.335812 12.7499 0.75 12.7499H5.00845C5.35331 14.3156 6.75413 15.4924 8.41955 15.4924C10.0859 15.4924 11.4861 14.3158 11.8307 12.7499H23.25C23.6642 12.7499 24 12.4141 24 11.9999C24 11.5857 23.6642 11.2499 23.25 11.2499ZM10.412 11.9979L10.412 12.006C10.4087 13.1013 9.51492 13.9924 8.41955 13.9924C7.32572 13.9924 6.43191 13.1025 6.42717 12.0078L6.42703 11.9968C6.42867 10.8995 7.32188 10.0074 8.41955 10.0074C9.5167 10.0074 10.4096 10.8987 10.4121 11.9953L10.412 11.9979Z"
      fill="#000" // Set the color of the icon to black or any other color
    />
  </svg>
);

const VideoManagementSystem = () => {
  const [isFormModalVisible, setIsFormModalVisible] = useState(false);
  const [isDetailsModalVisible, setIsDetailsModalVisible] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [currentVideo, setCurrentVideo] = useState(null);
  const [equipmentTags, setEquipmentTags] = useState([]);
  const [statusFilter, setStatusFilter] = useState("All");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [filteredVideos, setFilteredVideos] = useState([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);

  // API hooks
  const { data: categoryData } = useGetCategoryQuery();
  const categories = categoryData?.data || [];

  // Get all videos
  const {
    data: videos,
    isLoading: isLoadingVideos,
    refetch,
  } = useGetAllVideosQuery();
  console.log(videos);
  const [deleteVideo] = useDeleteVideoMutation();
  const [updateVideo] = useUpdateVideoMutation();
  const [updateVideoStatus]=useUpdateVideoStatusMutation()

  // Filter videos when data changes
  useEffect(() => {
    if (videos) {
      handleFilterChange();
    }
  }, [statusFilter, categoryFilter, videos]);

  // Filter logic
  const handleFilterChange = () => {
    if (!videos) return;

    const filtered = videos.filter(
      (video) =>
        (statusFilter === "All" || video.status === statusFilter) &&
        (categoryFilter === "All" || video.category === categoryFilter)
    );
    setFilteredVideos(filtered);
  };

  // Show form modal for creating/editing
  const showFormModal = (record = null) => {
    if (record) {
      setEditingId(record.id);
      setCurrentVideo(record);
      setEquipmentTags(record.equipment || []);

      // Find category ID based on category name
      const categoryObj = categories.find(
        (cat) => cat.name === record.category
      );
      if (categoryObj) {
        setSelectedCategoryId(categoryObj._id);
      }
    } else {
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
        return `# ${index + 1}`; 
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
        dataSource={filteredVideos}
        pagination={true}
        rowKey="id"
        bordered
        size="small"
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
