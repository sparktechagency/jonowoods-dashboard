import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Table,
  Button,
  Space,
  Switch,
  Modal,
  message,
  Tag,
  Breadcrumb,
  Typography,
  Card,
} from "antd";
import {
  EditOutlined,
  EyeOutlined,
  DeleteOutlined,
  ArrowLeftOutlined,
} from "@ant-design/icons";
import VideoFormModal from "./VideoFormModal";
import VideoDetailsModal from "./VideoDetailsModal";
import {
  useGetVideosBySubCategoryQuery,
  useDeleteVideoMutation,
  useGetVideoByIdQuery,
  useGetSubCategoryByIdQuery,
  useUpdateVideoStatusMutation,

} from "../../redux/apiSlices/videoApi";
import { useGetCategoryQuery } from "../../redux/apiSlices/categoryApi";
import { getVideoAndThumbnail } from "../common/imageUrl";
import moment from "moment/moment";
import Spinner from "../common/Spinner";

const { Title } = Typography;

const CourseDetails = () => {
  const { subCategoryId } = useParams();
  const navigate = useNavigate();

  // Modal states
  const [isFormModalVisible, setIsFormModalVisible] = useState(false);
  const [isDetailsModalVisible, setIsDetailsModalVisible] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [currentVideo, setCurrentVideo] = useState(null);
  const [equipmentTags, setEquipmentTags] = useState([]);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // API calls
  const { data: categoryData } = useGetCategoryQuery();
  const categories = categoryData?.data || [];

  const { data: subCategoryData, isLoading: isLoadingSubCategory } =
        useGetSubCategoryByIdQuery(subCategoryId);
  

  const {
    data: videosData,
    isLoading: isLoadingVideos,
    refetch,
  } = useGetVideosBySubCategoryQuery({
    subCategoryId,
    page: currentPage,
    limit: pageSize,
  });

  const { data: videoDetails } = useGetVideoByIdQuery(editingId, {
    skip: !editingId,
  });

  const [deleteVideo] = useDeleteVideoMutation();
  const [updateVideoStatus] = useUpdateVideoStatusMutation();

  const videos = videosData?.data || [];
  const paginationData = videosData?.pagination || {
    total: 0,
    current: 1,
    pageSize: 10,
  };

  // Update current video when editing
  useEffect(() => {
    if (editingId) {
      if (videoDetails) {
        setCurrentVideo({
          ...videoDetails,
          id: videoDetails._id || videoDetails.id,
        });
        setEquipmentTags(videoDetails.equipment || []);
      }
    } else {
      setCurrentVideo(null);
      setEquipmentTags([]);
    }
  }, [editingId, videoDetails]);

  const showFormModal = (record = null) => {
    if (record) {
      setEditingId(record._id); // <-- set editingId to trigger single video fetch
    } else {
      setEditingId(null);
    }
    setIsFormModalVisible(true);
  };

  const showDetailsModal = (record) => {
    setEditingId(record._id);
    setIsDetailsModalVisible(true);
  };
  

  const closeFormModal = () => {
    setIsFormModalVisible(false);
    setEditingId(null);
    setCurrentVideo(null);
    setEquipmentTags([]);
  };

  const closeDetailsModal = () => {
    setIsDetailsModalVisible(false);
  };

  const handleFormSubmit = async () => {
    closeFormModal();
    await refetch();
  };

  // Delete video
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
        }
      },
    });
  };

  // Status change
  const handleStatusChange = (checked, record) => {
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
          await updateVideoStatus({
            id: record._id,
            ...record,
            status: newStatus,
          }).unwrap();
          message.success(`Video status updated to ${newStatus}`);
          refetch();
        } catch (error) {
          message.error("Failed to update video status");
        }
      },
    });
  };

  // Table pagination
  const handleTableChange = (paginationConfig) => {
    setCurrentPage(paginationConfig.current);
    setPageSize(paginationConfig.pageSize);
  };


  // Table columns
  const columns = [
    // {
    //   title: "SL",
    //   key: "id",
    //   width: 70,
    //   align: "center",
    // },
    {
      title: "Serial",
      dataIndex: "serial",
      key: "serial",
      align: "center",
      render: (text) => {
      
        return `# ${text}`;
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
            style={{
              width: 100,
              height: 50,
              objectFit: "cover",
            }}
            className="rounded-lg"
          />
        </div>
      ),
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

  if (isLoadingVideos || isLoadingSubCategory) {
    return <Spinner />;
  }

  return (
    <div>
      {/* Header Section */}
      <Card className="mb-6">
        <Title level={3} className="mb-2">
          {subCategoryData?.subCategoryId?.name || "Course"} Videos
        </Title>

        <div className="text-gray-600">
          Total Videos: {paginationData.total || 0}
        </div>
      </Card>

      {/* Videos Table */}
      <Table
        columns={columns}
        dataSource={subCategoryData}
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
        locale={{
          emptyText: "No videos found in this subcategory",
        }}
      />

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

export default CourseDetails;
