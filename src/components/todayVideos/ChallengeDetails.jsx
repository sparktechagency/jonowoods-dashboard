import React, { useState, useEffect } from "react";
import { useParams, useLocation } from "react-router-dom";
import {
  useDeleteDailyChallegeMutation,
  useGetSingleDailyChallengeQuery,
  useUpdateDailyChallengeMutation,
  useScheduleVideoRotationMutation,
  useCreateChallengeWithVideosMutation,
  useGetDailyChallengeVideosQuery,
  useDeleteDailyChallengeVideoMutation,
  useUpdateDailyChallengeVideoMutation,
  useUpdateChallengeVideoOrderMutation,
  useUpdateVideoInChallengeMutation, // Add this mutation
} from "../../redux/apiSlices/dailyChallangeApi";
import VideoUploadSystem from "../common/VideoUploade";
import { 
  useGetAllVideosQuery,
  useGetLibraryVideosQuery
} from "../../redux/apiSlices/videoApi";
import { Button, Modal, Form, Input, DatePicker, Space, Table, message, Tag, Card, Popover, Tabs } from "antd";
import { PlusOutlined, EyeOutlined, DeleteOutlined, CalendarOutlined, EditOutlined, SaveOutlined } from "@ant-design/icons";
import GradientButton from "../common/GradiantButton";
import DragDropList from "../common/DragDropList";
import { getVideoAndThumbnail } from "../common/imageUrl";
import moment from "moment";
import VideoDetailsModal from "../retailerManagement/VideoDetailsModal";
import EditVideoModal from "../SalesRepsManagement/EditVideoModal";

const { TabPane } = Tabs;

const ChallengeDetails = () => {
  const { id } = useParams();
  const location = useLocation();
  const challenge = location.state?.challenge;
  
  // Initialize all the hooks at the component level
  const [updateDailyChallenge] = useUpdateDailyChallengeMutation();
  const [updateDailyChallengeVideo] = useUpdateDailyChallengeVideoMutation();
  const [deleteDailyChallengeVideo] = useDeleteDailyChallengeVideoMutation();
  const [scheduleVideoRotation] = useScheduleVideoRotationMutation();
  const [updateChallengeVideoOrder] = useUpdateChallengeVideoOrderMutation(); // Add this
  
  // State for scheduling
  const [schedulingModalVisible, setSchedulingModalVisible] = useState(false);
  const [selectedVideos, setSelectedVideos] = useState([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [schedulingDate, setSchedulingDate] = useState(null);
   const [currentVideo, setCurrentVideo] = useState(null);
  
  // State for sorted videos
  const [sortedVideos, setSortedVideos] = useState([]);
  
  // Drag and drop states
  const [localChallengeVideos, setLocalChallengeVideos] = useState([]);
  const [hasOrderChanges, setHasOrderChanges] = useState(false);
  const [viewMode, setViewMode] = useState("table"); 
    const [isFormModalVisible, setIsFormModalVisible] = useState(false);
  
  // State for pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  
  // State for modals and editing
  const [editingVideo, setEditingVideo] = useState(null);
  const [detailsModalVisible, setDetailsModalVisible] = useState(false);
  const [selectedVideoDetails, setSelectedVideoDetails] = useState(null);

  // Get challenge details if not passed via location state
  const { data: challengeData, isLoading: challengeLoading } = useGetSingleDailyChallengeQuery(id, {
    skip: !!challenge
  });
  
  const challengeDetails = challenge || challengeData?.data;
  
  // Get all videos from library
  const { data: allVideosData, isLoading: allVideosLoading } = useGetAllVideosQuery();
  const allVideos = allVideosData?.data || [];
  const [createChallengeWithVideos] = useCreateChallengeWithVideosMutation();

  const {data:challengeVideos,isLoading:challengeVideosLoading, refetch: refetchChallengeVideos} = useGetDailyChallengeVideosQuery(id);
  const challengeVideo = challengeVideos?.data || [];
  const [updateVideoInChallenge,{isLoading:updateVideoInChallengeLoading}] = useUpdateVideoInChallengeMutation();



  // Update local challenge videos and sorted videos when challengeVideo changes
  useEffect(() => {
    if (challengeVideo.length > 0) {
      const sorted = [...challengeVideo].sort((a, b) => (a.serial || 0) - (b.serial || 0));
      setLocalChallengeVideos(sorted);
      setSortedVideos(sorted);
      setHasOrderChanges(false);
    }
  }, [challengeVideo]);

  // VideoCard component for drag and drop view
  const VideoCard = ({ video, onEdit, onView, onDelete, onStatusChange, isDragging, serialNumber }) => (
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
          <h3 className="text-lg font-medium text-gray-900 truncate">{video.title}</h3>
          <p className="text-sm text-gray-500 truncate">{video.challengeName}</p>
          <div className="flex items-center space-x-4 text-sm text-gray-500">
            <span>Duration: {video.duration}</span>
            <span>Publish: {moment(video.publishAt).format("L")}</span>
          </div>
        </div>
        
        {/* Equipment */}
        <div className="flex-shrink-0">
          <div className="flex flex-wrap gap-1">
            {video.equipment && video.equipment.slice(0, 2).map((item, index) => (
              <Tag key={index} color="blue" size="small">{item}</Tag>
            ))}
            {video.equipment && video.equipment.length > 2 && (
              <Tag color="default" size="small">+{video.equipment.length - 2}</Tag>
            )}
          </div>
        </div>
        
        {/* Status */}
        <div className="flex-shrink-0">
          <Tag color={video.status === "active" ? "success" : "error"}>
            {video.status === "active" ? "Active" : "Inactive"}
          </Tag>
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
    setLocalChallengeVideos(reorderedVideos);
    setHasOrderChanges(true);
  };

  // Handle actual order update to server
  const handleUpdateOrder = async (orderData) => {
    try {
      // Use provided orderData or create from localChallengeVideos
      const dataToSend = orderData || localChallengeVideos.map((video, index) => ({
        _id: video._id,
        serial: index + 1, // Update serial based on new order
      }));

      await updateChallengeVideoOrder(dataToSend).unwrap();

      message.success("Video order updated successfully!");
      setHasOrderChanges(false);
      await refetchChallengeVideos();
    } catch (error) {
      message.error("Failed to update video order");
      console.error("Update order error:", error);
    }
  };

   const closeFormModal = () => {
    setIsFormModalVisible(false);
 
  };

    const handleFormSubmit = async () => {
    closeFormModal();
    // await refetch();
  };
    const showFormModal = (record = null) => {
    if (record) {
      setEditingVideo(record);
      // currentVideo & equipmentTags will update automatically via useEffect above
    } else {
      setEditingVideo(null);

    }
    setIsFormModalVisible(true);
  };

  // Handle functions for video management
  const handleEdit = (videoId) => {
    const video = challengeVideo.find(v => v._id === videoId);
    setEditingVideo(video);
  };

  const showDetailsModal = (video) => {
    setSelectedVideoDetails(video);
    setDetailsModalVisible(true);
  };

  const handleStatusChange = async (checked, record) => {
    try {
      const status = checked ? 'active' : 'inactive';
      await updateDailyChallengeVideo({
        id: record._id,
        status: status
      });
      message.success(`Video status updated to ${status}`);
    } catch (error) {
      message.error('Failed to update video status');
    }
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
          await deleteDailyChallengeVideo(videoId);
          message.success('Video deleted successfully');
          await refetchChallengeVideos();
        } catch (error) {
          message.error('Failed to delete video');
        }
      },
    });
  };

  // Filter out already scheduled videos
  const availableVideos = allVideos.filter(video => {
    // Check if the video is not part of this challenge
    return !challengeDetails?.videos?.some(
      v => v._id === video._id || v === video._id
    );
  });

  const challengeVideoColumns = React.useMemo(
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
        title: "Challenge Name",
        dataIndex: "challengeName",
        key: "challengeName",
        align: "center",
      },
      {
        title: "Duration",
        dataIndex: "duration",
        key: "duration",
        align: "center",
      },
      {
        title: "Equipment",
        dataIndex: "equipment",
        key: "equipment",
        align: "center",
        render: (equipment) => (
          <div>
            {equipment && equipment.map((item, index) => (
              <Tag key={index} color="blue">{item}</Tag>
            ))}
          </div>
        ),
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
        title: "Publish Date",
        dataIndex: "publishAt",
        key: "publishAt",
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
    [
      currentPage,
      pageSize,
    ]
  );

  // Handle single video scheduling
  const handleScheduleSingleVideo = async (video) => {
    try {
      if (!video) {
        message.error("Video is required");
        return;
      }

      const challengeCategoryId = id; // Use the challenge ID from URL params
      
      if (!challengeCategoryId) {
        message.error("Challenge category not found. Please check challenge configuration.");
        return;
      }

      const scheduleData = {
        videoIds: [video._id],
        challengeCategoryId: challengeCategoryId,
        ...(schedulingDate && { publishAt: schedulingDate.toISOString() })
      };

      console.log("Single video scheduling data:", scheduleData);

      await scheduleVideoRotation(scheduleData);
      message.success("Video scheduled successfully!");
      
      // Reset states
      setSchedulingDate(null);
      await refetchChallengeVideos();
    } catch (error) {
      console.error("Failed to schedule video:", error);
      message.error("Failed to schedule video");
    }
  };

  // Handle multiple videos scheduling
  const handleScheduleSelectedVideos = async () => {
    if (selectedVideos.length === 0) {
      message.warning("Please select at least one video");
      return;
    }

    try {
      const challengeCategoryId = id; // Use the challenge ID from URL params
      
      if (!challengeCategoryId) {
        message.error("Challenge category not found. Please check challenge configuration.");
        return;
      }

      const videoIds = selectedVideos.map(video => video._id);
      const scheduleData = {
        videoIds: videoIds,
        challengeCategoryId: challengeCategoryId,
        ...(schedulingDate && { publishAt: schedulingDate.toISOString() })
      };
      
      console.log('Multiple videos scheduling data:', scheduleData);
      
      await scheduleVideoRotation(scheduleData);
      message.success(`${selectedVideos.length} videos scheduled successfully!`);
      
      // Reset states
      setSelectedVideos([]);
      setSelectedRowKeys([]);
      setSchedulingDate(null);
      setSchedulingModalVisible(false);
      await refetchChallengeVideos();
    } catch (error) {
      console.error("Failed to schedule videos:", error);
      message.error("Failed to schedule videos");
    }
  };

  // Row selection configuration
  const rowSelection = {
    selectedRowKeys,
    onChange: (selectedRowKeys, selectedRows) => {
      setSelectedRowKeys(selectedRowKeys);
      setSelectedVideos(selectedRows);
    },
    getCheckboxProps: (record) => ({
      disabled: false,
      name: record.title,
    }),
  };

  // Videos Table Columns for the modal
  const videoColumns = [
    {
      title: "Video",
      dataIndex: "title",
      key: "video",
      width: "40%",
      render: (_, record) => (
        <div className="flex items-center">
          {record.thumbnailUrl && (
            <img 
              src={getVideoAndThumbnail(record.thumbnailUrl)} 
              alt={record.title || "Thumbnail"} 
              style={{ width: 80, height: 45, objectFit: "cover" }}
              className="mr-3 rounded"
            />
          )}
          <div>
            <p className="font-medium">{record.title || "Untitled Video"}</p>
            {record.duration && <p className="text-xs text-gray-500">Duration: {record.duration}</p>}
            {record.category && <p className="text-xs text-gray-500">Category: {record.category}</p>}
          </div>
        </div>
      )
    },
    {
      title: "Status",
      key: "status",
      width: "20%",
      render: (_, record) => (
        <Tag color={record.status?.toLowerCase() === "active" ? "green" : "red"}>
          {record.status?.toUpperCase() || "INACTIVE"}
        </Tag>
      )
    },
    {
      title: "Actions",
      key: "actions",
      width: "25%",
      render: (_, record) => (
        <Button 
          type="primary"
          size="small"
          icon={<PlusOutlined />}
          onClick={() => handleScheduleSingleVideo(record)}
          className="bg-primary text-white h-10"
        >
          Schedule Video
        </Button>
      )
    }
  ];

  if (challengeLoading) {
    return <div>Loading challenge details...</div>;
  }

  if (!challengeDetails) {
    return <div>Challenge not found</div>;
  }

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

      {/* Challenge Details Header */}
      <div className="mb-6">
        <div className="flex items-center mb-4">
          {challengeDetails.imageUrl && (
            <img 
              src={challengeDetails.imageUrl} 
              alt={challengeDetails.name} 
              className="w-20 h-20 object-cover rounded-lg mr-4"
            />
          )}
          <div>
            <h1 className="text-2xl font-bold">{challengeDetails.name}</h1>
            <p className="text-gray-500">{challengeDetails.description}</p>
          </div>
        </div>
      </div>
      
      {/* Action buttons */}
      <div className="mb-6 flex justify-between">
        <div>
          <button
            onClick={() => setViewMode(viewMode === "table" ? "drag" : "table")}
            className="py-2 rounded-md px-4 border-none mr-2 bg-primary text-white hover:bg-secondary"
          >
            {viewMode === "table" ? "Do Shuffle" : "Table View"}
          </button>
        </div>
        
        <Button
          onClick={() => setSchedulingModalVisible(true)}
          icon={<CalendarOutlined />}
          className="h-10 bg-[#CA3939] text-white border-none"
        >
           Videos Library
        </Button>
      </div>

      {/* Challenge Videos - either in table or drag-and-drop mode */}
      {viewMode === "table" ? (
        <Table
          columns={challengeVideoColumns}
          dataSource={sortedVideos}
          rowKey="_id"
          loading={challengeVideosLoading}
          pagination={{
            current: currentPage,
            pageSize: pageSize,
            total: sortedVideos.length,
            onChange: (page, size) => {
              setCurrentPage(page);
              setPageSize(size);
            },
          }}
          scroll={{ x: 'max-content' }}
          className="custom-table"
        />
      ) : (
        <DragDropList
          items={localChallengeVideos}
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
      
      {/* Schedule Videos Modal */}
      <Modal
        title="select Videos for Challenge"
        open={schedulingModalVisible}
        onCancel={() => {
          setSchedulingModalVisible(false);
          setSelectedVideos([]);
          setSelectedRowKeys([]);
          setSchedulingDate(null);
        }}
        footer={
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              {/* Optional Date Picker */}
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">Schedule Date (Optional):</span>
                <DatePicker 
                  showTime 
                  value={schedulingDate}
                  onChange={setSchedulingDate}
                  placeholder="Select date & time"
                  className="w-48"
                />
              </div>
              {selectedVideos.length > 0 && (
                <span className="text-sm text-gray-600">
                  {selectedVideos.length} video(s) selected
                </span>
              )}
            </div>
            <Space>
              <Button 
                onClick={() => {
                  setSchedulingModalVisible(false);
                  setSelectedVideos([]);
                  setSelectedRowKeys([]);
                  setSchedulingDate(null);
                }} 
                className="text-black h-10"
              >
                Cancel
              </Button>
              <Button 
                type="primary" 
                onClick={handleScheduleSelectedVideos}
                disabled={selectedVideos.length === 0}
                icon={<PlusOutlined />}
                className="bg-primary text-white h-10"
              >
                Schedule Selected Videos ({selectedVideos.length})
              </Button>
            </Space>
          </div>
        }
        width={1200}
      >
        <div style={{ width: '100%' }}>
          <Table 
            columns={videoColumns}
            dataSource={availableVideos}
            rowKey="_id"
            loading={allVideosLoading}
            pagination={{ pageSize: 8 }}
            locale={{ emptyText: "No videos available" }}
            rowSelection={rowSelection}
            scroll={{ x: 'max-content' }}
            style={{ width: '100%' }}
            tableLayout="auto"
          />
        </div>
        </Modal>

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

          onUpdateVideo={updateVideoInChallenge}
          isLoading={updateVideoInChallengeLoading}
        />


        {/* Video Details Modal */}
        {/* <Modal
          title="Video Details"
          open={detailsModalVisible}
          onCancel={() => {
            setDetailsModalVisible(false);
            setSelectedVideoDetails(null);
          }}
          footer={[
            <Button key="close" onClick={() => {
              setDetailsModalVisible(false);
              setSelectedVideoDetails(null);
            }}>
              Close
            </Button>
          ]}
          width={800}
        >
          {selectedVideoDetails && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="font-semibold mb-2">Video Information</h3>
                  <p><strong>Title:</strong> {selectedVideoDetails.title}</p>
                  <p><strong>Challenge:</strong> {selectedVideoDetails.challengeName}</p>
                  <p><strong>Duration:</strong> {selectedVideoDetails.duration}</p>
                  <p><strong>Serial:</strong> {selectedVideoDetails.serial}</p>
                  <p><strong>Status:</strong> 
                    <Tag color={selectedVideoDetails.status === "active" ? "success" : "error"}>
                      {selectedVideoDetails.status === "active" ? "Active" : "Inactive"}
                    </Tag>
                  </p>
                  <p><strong>Publish Date:</strong> {moment(selectedVideoDetails.publishAt).format("LLLL")}</p>
                  <p><strong>Created:</strong> {moment(selectedVideoDetails.createdAt).format("LLLL")}</p>
                  <p><strong>Updated:</strong> {moment(selectedVideoDetails.updatedAt).format("LLLL")}</p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Equipment</h3>
                  <div className="mb-4">
                    {selectedVideoDetails.equipment && selectedVideoDetails.equipment.map((item, index) => (
                      <Tag key={index} color="blue" className="mb-1">{item}</Tag>
                    ))}
                  </div>
                  <h3 className="font-semibold mb-2">Thumbnail</h3>
                  <img
                    src={getVideoAndThumbnail(selectedVideoDetails.thumbnailUrl)}
                    alt="thumbnail"
                    style={{
                      width: "100%",
                      maxWidth: 300,
                      height: "auto",
                      objectFit: "cover",
                    }}
                    className="rounded-lg"
                  />
                </div>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Description</h3>
                <p className="text-gray-600">{selectedVideoDetails.description}</p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Video URL</h3>
                <p className="text-sm text-gray-500 break-all">{selectedVideoDetails.videoUrl}</p>
              </div>
            </div>
          )}
        </Modal> */}
      </div>
    );
  };

    export default ChallengeDetails;