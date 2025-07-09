import React, { useState } from "react";
import { 
  useCreateDailyInspirationMutation, 
  useDeleteDailyInspirationMutation, 
  useGetAllDailyInspirationQuery, 
  useGetDailyInspirationByIdQuery, 
  useUpdateDailyInspirationMutation, 
  useUpdateDailyInspirationStatusMutation,
  useScheduleDailyInspirationMutation,
  useGetScheduledDailyInspirationQuery
} from "../../redux/apiSlices/dailyInspiraton";
import VideoUploadSystem from "../common/VideoUploade";
import { 
  useGetAllVideosQuery,
  useScheduleVideoMutation
} from "../../redux/apiSlices/videoApi";
import { Button, Modal, Form, Input, Select, DatePicker, Space, Table, message, Tag, Card, Popover } from "antd";
import { PlusOutlined, CalendarOutlined, UploadOutlined, DeleteOutlined } from "@ant-design/icons";
import GradientButton from "../common/GradiantButton";
import { getVideoAndThumbnail } from "../common/imageUrl";
import moment from "moment";

const { Option } = Select;

const DailyInspirationPage = () => {
  const [createDailyInspiration] = useCreateDailyInspirationMutation();
  const [updateDailyInspiration] = useUpdateDailyInspirationMutation();
  const [deleteDailyInspiration] = useDeleteDailyInspirationMutation();
  const [updateDailyInspirationStatus] = useUpdateDailyInspirationStatusMutation();

  // Schedule API hooks
  const [scheduleDailyInspiration] = useScheduleDailyInspirationMutation();
  
  // State for scheduling
  const [schedulingModalVisible, setSchedulingModalVisible] = useState(false);
  const [schedulingVideo, setSchedulingVideo] = useState(null);
  const [schedulingDate, setSchedulingDate] = useState(null);
  
  // Get all videos and scheduled videos - using the all videos API
  const { data: allVideosData, isLoading: allVideosLoading } = useGetAllVideosQuery();
  const { data: scheduledData, isLoading: scheduledLoading, refetch: refetchScheduled } = useGetScheduledDailyInspirationQuery();
  
  const allVideos = allVideosData?.data || [];
  const scheduledVideos = scheduledData?.data || [];

  const categories = ["Daily Inspiration"];

  const apiHooks = {
    useGetAllQuery: useGetAllDailyInspirationQuery,
    useGetByIdQuery: useGetDailyInspirationByIdQuery,
    deleteItem: deleteDailyInspiration,
    updateItemStatus: updateDailyInspirationStatus,
    createItem: createDailyInspiration,
    updateItem: updateDailyInspiration,
    categories,
    // Add scheduling capability to the VideoUploadSystem component
    scheduleVideo: scheduleDailyInspiration,
    refetchScheduled: refetchScheduled
  };

  // Handle scheduling Daily Inspiration videos
  const handleScheduleVideo = async (videoId, scheduleDate) => {
    try {
      if (!videoId || !scheduleDate) {
        message.error("Please select a video and schedule date");
        return;
      }

      const scheduleData = {
        videoId: videoId,
        scheduleDate: scheduleDate.format("YYYY-MM-DD"),
        scheduleTime: scheduleDate.format("HH:mm:ss"),
        isRandom: false,
        category: "Daily Inspiration"
      };

      // Call API to schedule video using the endpoint
      await scheduleDailyInspiration(scheduleData);
      message.success("Daily Inspiration video scheduled successfully!");
      setSchedulingVideo(null);
      setSchedulingDate(null);
      refetchScheduled();
    } catch (error) {
      console.error("Failed to schedule Daily Inspiration:", error);
      message.error("Failed to schedule Daily Inspiration video");
    }
  };

  // Library videos filtered to only show non-scheduled videos
  const availableVideos = allVideos.filter(video => 
    !scheduledVideos.some(scheduled => scheduled.videoId === video._id)
  );
  
  // Videos Table Columns for the modal
  const videoColumns = [
    {
      title: "Video",
      dataIndex: "title",
      key: "video",
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
          </div>
        </div>
      )
    },
    {
      title: "Schedule Status",
      key: "scheduleStatus",
      render: (_, record) => {
        const scheduleInfo = scheduledVideos.find(sv => sv.videoId === record._id);
        if (!scheduleInfo) {
          return <Tag color="red">Not Scheduled</Tag>;
        }
        
        const scheduleDate = new Date(`${scheduleInfo.scheduleDate} ${scheduleInfo.scheduleTime}`);
        const isScheduled = scheduleDate > new Date();
        
        return (
          <div>
            <Tag color={isScheduled ? "orange" : "green"}>
              {isScheduled ? "Scheduled" : "Published"}
            </Tag>
            <p className="text-xs mt-1">
              {moment(scheduleInfo.scheduleDate).format("MMM DD, YYYY")} at {scheduleInfo.scheduleTime}
            </p>
          </div>
        );
      }
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => {
        const isScheduled = scheduledVideos.some(sv => sv.videoId === record._id);
        
        if (isScheduled) {
          return (
            <Button 
              type="default"
              size="small"
              disabled
            >
              Scheduled
            </Button>
          );
        }
        
        return (
          <div className="flex items-center space-x-2">
            <DatePicker 
              showTime 
              size="small"
              onChange={(date) => {
                setSchedulingVideo(record._id);
                setSchedulingDate(date);
              }}
              className="mr-2"
            />
            <Button 
              type="primary"
              size="small"
              icon={<CalendarOutlined />}
              onClick={() => handleScheduleVideo(record._id, schedulingDate)}
              disabled={!schedulingDate || schedulingVideo !== record._id}
            >
              Schedule
            </Button>
          </div>
        );
      }
    }
  ];

  return (
    <div>
      {/* Add New Content button with Schedule Video button next to it */}
      <VideoUploadSystem 
        pageType="daily-inspiration" 
        apiHooks={apiHooks}
        additionalButtons={
          <GradientButton 
            onClick={() => setSchedulingModalVisible(true)}
            icon={<CalendarOutlined />}
            className="ml-2"
          >
            Schedule Video
          </GradientButton>
        }
      />
      
      {/* Schedule Videos Modal */}
      <Modal
        title="Schedule Daily Inspiration Videos"
        open={schedulingModalVisible}
        onCancel={() => {
          setSchedulingModalVisible(false);
          setSchedulingVideo(null);
          setSchedulingDate(null);
        }}
        footer={null}
        width={900}
      >
        <Table 
          columns={videoColumns}
          dataSource={allVideos}
          rowKey="_id"
          loading={allVideosLoading || scheduledLoading}
          pagination={{ pageSize: 8 }}
          locale={{ emptyText: "No videos found" }}
        />
      </Modal>
    </div>
  );
};

export default DailyInspirationPage;
