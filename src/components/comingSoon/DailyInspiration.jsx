import React, { useState, useEffect } from "react";
import {
  useDeleteDailyInspirationMutation,
  useGetScheduledDailyInspirationQuery,
  useUpdateDailyInspirationOrderMutation,
  useUpdateVideoInDailyInspirationMutation,
  useScheduleDailyInspirationMutation,
} from "../../redux/apiSlices/dailyInspiraton";
import {
  useGetAllVideosQuery,
} from "../../redux/apiSlices/videoApi";
import {
  Button,
  Modal,
  Space,
  Table,
  message,
  Tag,
  Switch,
} from "antd";
import {
  CalendarOutlined,
  DeleteOutlined,
  EyeOutlined,
  EditOutlined,
} from "@ant-design/icons";
import GradientButton from "../common/GradiantButton";
import DragDropList from "../common/DragDropList";
import { getVideoAndThumbnail } from "../common/imageUrl";
import moment from "moment";
import VideoDetailsModal from "../retailerManagement/VideoDetailsModal";
import EditVideoModal from "../SalesRepsManagement/EditVideoModal";
import VideoLibraryModal from "../common/VideoLibraryModal"; // Import the new reusable component

const DailyInspirationPage = () => {
  const [deleteDailyInspiration] = useDeleteDailyInspirationMutation();
  const [updateDailyInspirationOrder] = useUpdateDailyInspirationOrderMutation();
  const [scheduleDailyInspiration] = useScheduleDailyInspirationMutation();
  const [updateVideoInDailyInspiration, { isLoading: updateLoading }] =
    useUpdateVideoInDailyInspirationMutation();

  // State for scheduling modal
  const [schedulingModalVisible, setSchedulingModalVisible] = useState(false);
  const [isFormModalVisible, setIsFormModalVisible] = useState(false);

  // State for sorted videos and drag & drop
  const [localScheduledVideos, setLocalScheduledVideos] = useState([]);
  const [hasOrderChanges, setHasOrderChanges] = useState(false);
  const [viewMode, setViewMode] = useState("table"); // "table" or "drag"

  // State for pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [modalCurrentPage, setModalCurrentPage] = useState(1);
  const [modalPageSize, setModalPageSize] = useState(10);

  // State for modals and editing
  const [editingVideo, setEditingVideo] = useState(null);
  const [detailsModalVisible, setDetailsModalVisible] = useState(false);
  const [selectedVideoDetails, setSelectedVideoDetails] = useState(null);
    useEffect(() => {
    if (viewMode === "drag") {
      setPageSize(100); // Drag mode e 100 items per page
      setCurrentPage(1); // Reset to first page
    } else {
      setPageSize(10); // Table mode e 10 items per page
      setCurrentPage(1); // Reset to first page
    }
  }, [viewMode]);

  const queryParams = [
    { name: "limit", value: pageSize },
    { name: "page", value: currentPage },
  ];

  // Get all videos and scheduled videos
  const {
    data: allVideosData,
    isLoading: allVideosLoading,
    refetch: refetchAllVideos,
  } = useGetAllVideosQuery([
    { name: "limit", value: modalPageSize },
    { name: "page", value: modalCurrentPage },
  ]);

  const {
    data: scheduledData,
    isLoading: scheduledLoading,
    refetch: refetchScheduled,
  } = useGetScheduledDailyInspirationQuery(queryParams);

  const allVideos = allVideosData?.data || [];
  const allVideosPagination = allVideosData?.pagination || {
    total: 0,
    current: 1,
    pageSize: 10,
  };
  const scheduledVideos = scheduledData?.data || [];

  // Filter available videos (not yet scheduled)
  const availableVideos = allVideos.filter(
    (video) =>
      !scheduledVideos.some((scheduled) => scheduled.videoId === video._id)
  );

  useEffect(() => {
    if (scheduledVideos.length > 0) {
      const sorted = [...scheduledVideos].sort(
        (a, b) => (a.serial || 0) - (b.serial || 0)
      );
      setLocalScheduledVideos(sorted);
      setHasOrderChanges(false);
    }
  }, [scheduledVideos]);

  const showFormModal = (record = null) => {
    if (record) {
      setEditingVideo(record);
    } else {
      setEditingVideo(null);
    }
    setIsFormModalVisible(true);
  };

  const closeFormModal = () => {
    setIsFormModalVisible(false);
    setEditingVideo(null);
  };

  const handleFormSubmit = async () => {
    closeFormModal();
    await refetchAllVideos();
    await refetchScheduled();
  };

  // Handle modal table pagination change
  const handleModalPaginationChange = (page, size) => {
    setModalCurrentPage(page);
    setModalPageSize(size);
  };

  // VideoCard component for drag and drop view
  const VideoCard = ({
    video,
    onEdit,
    onView,
    onDelete,
    onStatusChange,
    isDragging,
    serialNumber,
  }) => (
    <div
      className={`bg-white rounded-lg shadow-md p-4 mb-4 border transition-all duration-200 ${
        isDragging ? "opacity-50 transform rotate-2" : "hover:shadow-lg"
      }`}
      style={{
        cursor: "grab",
        border: isDragging ? "2px dashed #1890ff" : "1px solid #e8e8e8",
      }}
    >
      <div className="flex items-center space-x-4">
        {/* Serial Number */}
        <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-sm font-semibold text-blue-600">
          {serialNumber || "#"}
        </div>

        {/* Thumbnail */}
        <div className="flex-shrink-0">
          <img
            src={getVideoAndThumbnail(video.thumbnailUrl)}
            alt={video.title}
            className="w-20 h-12 object-cover rounded"
          />
        </div>

        {/* Video Info */}
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-medium text-gray-900 truncate">
            {video.title}
          </h3>
          <p className="text-sm text-gray-500 truncate">Daily Inspiration</p>
          <div className="flex items-center space-x-4 text-sm text-gray-500">
            <span>Duration: {video.duration}</span>
            <span>Publish: {moment(video.publishAt).format("L")}</span>
          </div>
        </div>

        {/* Equipment */}
        <div className="flex-shrink-0">
          <div className="flex flex-wrap gap-1">
            {video.equipment &&
              video.equipment.slice(0, 2).map((item, index) => (
                <Tag key={index} color="blue" size="small">
                  {item}
                </Tag>
              ))}
            {video.equipment && video.equipment.length > 2 && (
              <Tag color="default" size="small">
                +{video.equipment.length - 2}
              </Tag>
            )}
          </div>
        </div>

        {/* Status */}
        <div className="flex-shrink-0">
          <Switch
            size="small"
            checked={video.status === "active"}
            onChange={(checked) => onStatusChange(checked, video)}
          />
        </div>

        {/* Actions */}
        <div className="flex-shrink-0">
          <Space size="small">
            <Button
              type="text"
              icon={<EditOutlined style={{ color: "#f55" }} />}
              onClick={() => onEdit(video._id)}
              title="Edit Video"
            />
            <Button
              type="text"
              icon={<EyeOutlined style={{ color: "#55f" }} />}
              onClick={() => onView(video)}
              title="View Video Details"
            />
            <Button
              type="text"
              icon={<DeleteOutlined style={{ color: "#ff4d4f" }} />}
              onClick={() => onDelete(video._id)}
              title="Delete Video"
            />
          </Space>
        </div>
      </div>
    </div>
  );

  // Handle video reordering (local state only)
  const handleReorder = (reorderedVideos) => {
    setLocalScheduledVideos(reorderedVideos);
    setHasOrderChanges(true);
  };

  // Handle actual order update to server
  const handleUpdateOrder = async (orderData) => {
    try {
      const dataToSend =
        orderData ||
        localScheduledVideos.map((video, index) => ({
          _id: video._id,
          serial: index + 1,
        }));

      await updateDailyInspirationOrder(dataToSend).unwrap();

      message.success("Video order updated successfully!");
      setHasOrderChanges(false);
      await refetchScheduled();
    } catch (error) {
      message.error("Failed to update video order");
      console.error("Update order error:", error);
    }
  };

  // Handle functions for video management
  const handleEdit = (videoId) => {
    const video = scheduledVideos.find((v) => v._id === videoId);
    setEditingVideo(video);
  };

  const showDetailsModal = (video) => {
    setSelectedVideoDetails(video);
    setDetailsModalVisible(true);
  };

  const handleStatusChange = async (checked, record) => {
    const newStatus = checked ? "active" : "inactive";

    Modal.confirm({
      title: `Are you sure you want to change the Daily Inspiration status to "${newStatus}"?`,
      okText: "Yes",
      cancelText: "No",
      okButtonProps: {
        style: {
          backgroundColor: "#CA3939",
          color: "#fff",
        },
      },
      cancelButtonProps: {
        style: {
          borderColor: "#000",
          color: "#000",
        },
      },
      onOk: async () => {
        try {
          await updateDailyInspirationStatus({
            id: record._id,
            status: newStatus,
          });
          message.success(`Daily Inspiration status updated to ${newStatus}`);
          await refetchScheduled();
        } catch (error) {
          message.error("Failed to update Daily Inspiration status");
        }
      },
      onCancel() {
        message.info("Status update canceled");
      },
    });
  };

  const handleDeleteItem = async (videoId) => {
    Modal.confirm({
      title: "Are you sure you want to delete this video?",
      content: "This action cannot be undone.",
      okText: "Yes",
      okType: "danger",
      cancelText: "No",
      onOk: async () => {
        try {
          await deleteDailyInspiration(videoId);
          message.success("Video deleted successfully");
          await refetchScheduled();
        } catch (error) {
          message.error("Failed to delete video");
        }
      },
    });
  };

  // Handle single video scheduling
  const handleAddSingleVideo = async (video, schedulingDate) => {
    try {
      if (!video) {
        message.error("Video is required");
        return;
      }

      const scheduleData = {
        videoIds: [video._id],
        ...(schedulingDate && { publishAt: schedulingDate.toISOString() }),
      };

      await scheduleDailyInspiration(scheduleData);
      message.success("Daily Inspiration video scheduled successfully!");

      await refetchScheduled();
      await refetchAllVideos();
    } catch (error) {
      console.error("Failed to schedule Daily Inspiration:", error);
      message.error("Failed to schedule Daily Inspiration video");
    }
  };

  // Handle multiple videos scheduling
  const handleAddMultipleVideos = async (selectedVideos, schedulingDate) => {
    try {
      const scheduleData = {
        videoIds: selectedVideos.map((video) => video._id),
        publishAt: schedulingDate ? schedulingDate.toISOString() : undefined,
      };

      await scheduleDailyInspiration(scheduleData);
      message.success(
        `${selectedVideos.length} videos scheduled successfully!`
      );

      setSchedulingModalVisible(false);
      await refetchScheduled();
      await refetchAllVideos();
    } catch (error) {
      console.error("Failed to schedule videos:", error);
      message.error("Failed to schedule videos");
    }
  };

  // Scheduled Videos Table Columns
  const scheduledVideoColumns = React.useMemo(
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
        title: "Video",
        dataIndex: "title",
        key: "video",
        align: "center",
        render: (_, record) => (
          <div className="flex justify-center">
            {record.thumbnailUrl && (
              <img
                src={getVideoAndThumbnail(record.thumbnailUrl)}
                alt={record.title || "Thumbnail"}
                style={{ width: 80, height: 45, objectFit: "cover" }}
                className="mr-3 rounded"
              />
            )}
          </div>
        ),
      },
      {
        title: "Title",
        dataIndex: "title",
        key: "title",
        align: "center",
      },
      {
        title: "Duration",
        dataIndex: "duration",
        key: "duration",
        align: "center",
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
            <Button
              type="text"
              icon={<DeleteOutlined style={{ color: "#ff4d4f" }} />}
              onClick={() => handleDeleteItem(record._id)}
            />
          </Space>
        ),
      },
    ],
    [currentPage, pageSize]
  );

  return (
    <div className="w-full">
      <style jsx>{`
        .drag-item {
          transition: all 0.2s ease;
          cursor: grab;
        }
        .drag-item:active {
          cursor: grabbing;
        }
        .drag-over {
          border: 2px dashed #1890ff !important;
          background-color: #f0f8ff;
        }
        .drag-item:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }
      `}</style>

      {/* Header */}
      {/* <div className="mb-6">
        <h1 className="text-2xl font-bold mb-4">Daily Inspiration</h1>
      </div> */}

      {/* Action buttons */}
      <div className="mb-6 flex justify-end">
        <div>
          <button
            onClick={() => setViewMode(viewMode === "table" ? "drag" : "table")}
            className="py-2 rounded-md px-4 border-none mr-2 bg-primary text-white hover:bg-secondary"
          >
            {viewMode === "table" ? "Do Shuffle" : "Table Mode"}
          </button>
        </div>

        <GradientButton
          onClick={() => setSchedulingModalVisible(true)}
          icon={<CalendarOutlined />}
          className="ml-2"
        >
          Video Library
        </GradientButton>
      </div>

      {/* Scheduled Videos - either in table or drag-and-drop mode */}
      {viewMode === "table" ? (
      <div className="border-2 rounded-lg">
          <Table
          columns={scheduledVideoColumns}
          dataSource={localScheduledVideos}
          rowKey="_id"
          loading={scheduledLoading}
          pagination={{
            current: currentPage,
            pageSize: pageSize,
            total: scheduledData?.pagination?.total || 0,
            onChange: (page, size) => {
              setCurrentPage(page);
              setPageSize(size);
            },
          }}
          scroll={{ x: "max-content" }}
          className="custom-table"
          size="middle"
        />
      </div>
      ) : (
        <DragDropList
          items={localScheduledVideos}
          onReorder={handleReorder}
          onUpdateOrder={handleUpdateOrder}
          hasChanges={hasOrderChanges}
          renderItem={(video, index, draggedItem) => (
            <VideoCard
              video={video}
              onEdit={handleEdit}
              onView={showDetailsModal}
              onDelete={handleDeleteItem}
              onStatusChange={handleStatusChange}
              isDragging={draggedItem?._id === video._id}
              serialNumber={video.serial || index + 1}
            />
          )}
        />
      )}

      {/* Reusable Video Library Modal */}
      <VideoLibraryModal
        visible={schedulingModalVisible}
        onCancel={() => {
          setSchedulingModalVisible(false);
          setModalCurrentPage(1);
        }}
        onSelectVideo={handleAddSingleVideo}
        availableVideos={availableVideos}
        loading={allVideosLoading}
        pagination={{
          current: modalCurrentPage,
          pageSize: modalPageSize,
          total: allVideosPagination.total,
        }}
        onPaginationChange={handleModalPaginationChange}
        title="Video Library Daily Inspiration"
        selectButtonText="Add Video"
      />

      <VideoDetailsModal
        visible={detailsModalVisible}
        onCancel={() => {
          setDetailsModalVisible(false);
          setSelectedVideoDetails(null);
        }}
        currentVideo={selectedVideoDetails}
      />

      <EditVideoModal
        visible={isFormModalVisible}
        onCancel={closeFormModal}
        onSuccess={handleFormSubmit}
        currentVideo={editingVideo}
        onUpdateVideo={updateVideoInDailyInspiration}
        isLoading={updateLoading}
      />
    </div>
  );
};

export default DailyInspirationPage;