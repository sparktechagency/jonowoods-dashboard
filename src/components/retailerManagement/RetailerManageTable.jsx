import React, { useState, useEffect } from "react";
import {
  Table,
  Button,
  Modal,
  Space,
  Switch,
  Select,
  Dropdown,
  Menu,
} from "antd";
import { EditOutlined, EyeOutlined, DownOutlined, PlusOutlined } from "@ant-design/icons";
import VideoFormModal from "./VideoFormModal";
import VideoDetailsModal from "./VideoDetailsModal";
import GradientButton from "../common/GradiantButton";

const { Option } = Select;

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

const VideoManagementSystem = () => {
  const [videos, setVideos] = useState([]);
  const [filteredVideos, setFilteredVideos] = useState([]);
  const [isFormModalVisible, setIsFormModalVisible] = useState(false);
  const [isDetailsModalVisible, setIsDetailsModalVisible] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [currentVideo, setCurrentVideo] = useState(null);
  const [categories] = useState([
    "Basic",
    "Advanced",
    "Premium",
    "Class",
    "Workshop",
    "Tutorial",
  ]);
  const [subCategories] = useState(["Class", "Workshop", "Tutorial"]);
  const [statusFilter, setStatusFilter] = useState("All");
  const [categoryFilter, setCategoryFilter] = useState("All");

  // Load initial data
  useEffect(() => {
    const initialData = Array(9)
      .fill()
      .map((_, index) => ({
        id: index + 1,
        title: "Meditate & Breathe",
        thumbnail:
          "https://img.freepik.com/free-vector/geometric-simple-sport-youtube-thumbnail_23-2148922037.jpg?t=st=1744698420~exp=1744702020~hmac=87d2997ba082f1193d31f5141e6f9a8fe5b21fda5937356fde504b64e6838d80&w=1380",
        category: "Basic",
        video:
          "https://collection.cloudinary.com/dztlololv/a69f4ed90180e25967c533f816a435af?",
        subCategory: "Class",
        uploadDate: "March 02, 2025",
        duration: "25:30 Min",
        status: "Active",
        description:
          "A calming meditation session to help you relax and breathe.",
        equipment: ["Business"],
      }));

    setVideos(initialData);
    setFilteredVideos(initialData);
  }, []);

  useEffect(() => {
    handleFilterChange();
  }, [statusFilter, categoryFilter, videos]);

  const handleFilterChange = () => {
    const filtered = videos.filter(
      (video) =>
        (statusFilter === "All" || video.status === statusFilter) &&
        (categoryFilter === "All" || video.category === categoryFilter)
    );
    setFilteredVideos(filtered);
  };

  const showFormModal = (record = null) => {
    if (record) {
      setEditingId(record.id);
      setCurrentVideo(record);
    } else {
      setEditingId(null);
      setCurrentVideo(null);
    }
    setIsFormModalVisible(true);
  };

  const showDetailsModal = (record) => {
    setCurrentVideo(record);
    setIsDetailsModalVisible(true);
  };

  const handleFormSubmit = (values, thumbnailFile, videoFile) => {
    const now = new Date();
    const formattedDate = `${now.toLocaleString("default", {
      month: "long",
    })} ${String(now.getDate()).padStart(2, "0")}, ${now.getFullYear()}`;

    const thumbnailUrl = thumbnailFile
      ? URL.createObjectURL(thumbnailFile)
      : editingId
      ? currentVideo.thumbnail
      : "";
    const videoUrl = videoFile
      ? URL.createObjectURL(videoFile)
      : editingId
      ? currentVideo.video
      : "";

    if (editingId !== null) {
      const updatedVideos = videos.map((video) =>
        video.id === editingId
          ? {
              ...video,
              ...values,
              thumbnail: thumbnailUrl || video.thumbnail,
              video: videoUrl || video.video,
              uploadDate: formattedDate,
            }
          : video
      );
      setVideos(updatedVideos);
    } else {
      const newVideo = {
        id: videos.length + 1,
        ...values,
        thumbnail: thumbnailUrl,
        video: videoUrl,
        uploadDate: formattedDate,
        status: "Active",
      };
      setVideos([...videos, newVideo]);
    }
    setIsFormModalVisible(false);
  };

  const handleDeleteVideo = (id) => {
    Modal.confirm({
      title: "Are you sure you want to delete this video?",
      content: "This action cannot be undone.",
      okText: "Yes",
      okType: "danger",
      cancelText: "No",
      onOk: () => {
        const filteredVideos = videos.filter((video) => video.id !== id);
        setVideos(filteredVideos);
      },
    });
  };

  const handleStatusChange = (checked, record) => {
    const updatedVideos = videos.map((video) =>
      video.id === record.id
        ? { ...video, status: checked ? "Active" : "Inactive" }
        : video
    );
    setVideos(updatedVideos);
  };

  const filterMenu = (
    <Menu>
      <Menu.Item key="all" onClick={() => setCategoryFilter("All")}>
        All Categories
      </Menu.Item>
      <Menu.Item key="basic" onClick={() => setCategoryFilter("Basic")}>
        Basic
      </Menu.Item>
      <Menu.Item key="advanced" onClick={() => setCategoryFilter("Advanced")}>
        Advanced
      </Menu.Item>
      <Menu.Item key="premium" onClick={() => setCategoryFilter("Premium")}>
        Premium
      </Menu.Item>
      <Menu.Item key="tutorial" onClick={() => setCategoryFilter("Tutorial")}>
        Tutorial
      </Menu.Item>
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

  const columns = [
    {
      title: "SL",
      dataIndex: "id",
      key: "id",
      width: 70,
      align: "center",
    },
    {
      title: "Video Title",
      dataIndex: "title",
      key: "title",
      align: "center",
    },
    {
      title: "Thumbnail",
      dataIndex: "thumbnail",
      key: "thumbnail",
      align: "center",
      render: (_, record) => (
        <div style={{ display: "flex", justifyContent: "center" }}>
          <img
            src={record.thumbnail}
            alt="thumbnail"
            style={{ width: 100, height: 50 }}
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
      dataIndex: "uploadDate",
      key: "uploadDate",
      align: "center",
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
            onClick={() => showFormModal(record)}
          />
          <Button
            type="text"
            icon={<EyeOutlined style={{ color: "#55f" }} />}
            onClick={() => showDetailsModal(record)}
          />
          <Switch
            size="small"
            checked={record.status === "Active"}
            onChange={(checked) => handleStatusChange(checked, record)}
          />
        </Space>
      ),
    },
  ];


  return (
    <div >
      <div className="flex justify-end gap-6 mb-6">
        <div className="">
          <Space size="small" className="flex gap-4">
            <Dropdown overlay={filterMenu}>
              <Button
                className="py-5 mr-2 text-white bg-red-600 hover:text-black hover:icon-black"
                style={{ border: "none" }}
              >
                <Space>
                  <FilteringIcon className="filtering-icon" />{" "}
                  {/* Use the custom class */}
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
                className="py-5 mr-2 text-white bg-red-600 hover:text-black hover:icon-black"
                style={{ border: "none" }}
              >
                <Space>
                  <FilteringIcon className="filtering-icon" />{" "}
                  {/* Use the custom class */}
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
        onSubmit={handleFormSubmit}
        currentVideo={currentVideo}
        editingId={editingId}
        categories={categories}
        subCategories={subCategories}
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
