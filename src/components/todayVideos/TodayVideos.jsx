import React, { useState, useEffect } from "react";
import {
  useCreateComingSoonMutation,
  useDeleteComingSoonMutation,
  useGetAllComingSoonQuery,
  useGetComingSoonByIdQuery,
  useUpdateComingSoonMutation,
} from "../../redux/apiSlices/comingSoonApi";
import {
  useDeleteDailyChallegeMutation,
  useGetDailyChallengeQuery,
  useGetSingleDailyChallengeQuery,
  useNewDailyChallengeMutation,
  useUpdateDailyChallengeMutation,
  useCreateChallengeWithVideosMutation,
  useGetChallengeVideosQuery,
  useScheduleVideoRotationMutation
} from "../../redux/apiSlices/dailyChallangeApi";
import VideoUploadSystem from "../common/VideoUploade";
import { 
  useGetAllVideosQuery,
  useGetLibraryVideosQuery
} from "../../redux/apiSlices/videoApi";
import { Button, Modal, Form, Input, Select, DatePicker, Space, Table, message, Tag, Card, Popover, Tabs } from "antd";
import { PlusOutlined, EyeOutlined, DeleteOutlined, CalendarOutlined } from "@ant-design/icons";
import GradientButton from "../common/GradiantButton";
import { getVideoAndThumbnail } from "../common/imageUrl";
import moment from "moment";

const { Option } = Select;
const { TabPane } = Tabs;

const TodayVideos = () => {
  // Initialize all the hooks at the component level
  const [createDailyChallenge] = useNewDailyChallengeMutation();
  const [updateDailyChallenge] = useUpdateDailyChallengeMutation();
  const [deleteDailyChallenge] = useDeleteDailyChallegeMutation();
  
  // New API hooks
  const [scheduleVideoRotation] = useScheduleVideoRotationMutation();
  
  // State for scheduling
  const [schedulingModalVisible, setSchedulingModalVisible] = useState(false);
  const [schedulingVideo, setSchedulingVideo] = useState(null);
  const [schedulingDate, setSchedulingDate] = useState(null);

  // Get all videos from library
  const { data: allVideosData, isLoading: allVideosLoading } = useGetAllVideosQuery();
  const allVideos = allVideosData?.data || [];
  
  // Get scheduled videos/challenges
  const { data: challengesData, isLoading: challengesLoading, refetch: refetchChallenges } = useGetDailyChallengeQuery();
  const challenges = challengesData?.data || [];
  
  // Sort videos by scheduled date (chronologically, earliest first)
  const sortedVideos = React.useMemo(() => {
    // Map all videos with their schedule info
    const videosWithScheduleInfo = allVideos.map(video => {
      // Check if this video is part of any challenge
      const challenge = challenges.find(ch => 
        ch.videos?.some(v => v._id === video._id || v === video._id)
      );
      
      return {
        ...video,
        isScheduled: challenge ? true : false,
        challenge: challenge || null,
        scheduledDate: challenge?.startDate || null
      };
    });

    // Sort videos by scheduled date (chronologically, earliest first)
    return videosWithScheduleInfo.sort((a, b) => {
      // If both have scheduled dates, compare them
      if (a.scheduledDate && b.scheduledDate) {
        const dateA = new Date(a.scheduledDate);
        const dateB = new Date(b.scheduledDate);
        return dateA - dateB; // ascending order (earliest first)
      }
      
      // If only one has a scheduled date, the one with date comes first
      if (a.scheduledDate && !b.scheduledDate) return -1;
      if (!a.scheduledDate && b.scheduledDate) return 1;
      
      // If neither has a scheduled date, keep original order
      return 0;
    });
  }, [allVideos, challenges]);
  
  // Define categories for today's videos
  const categories = [
    "Video/Picture",
    "Fitness",
    "Yoga",
    "Meditation",
    "Workout",
  ];

  // Pass the initialized mutation functions and query hooks
  const apiHooks = {
    useGetAllQuery: useGetDailyChallengeQuery,
    useGetByIdQuery: useGetSingleDailyChallengeQuery,
    deleteItem: deleteDailyChallenge, 
    updateItemStatus: updateDailyChallenge, 
    createItem: createDailyChallenge, 
    updateItem: updateDailyChallenge, 
    categories,
    // Add scheduling capability
    scheduleVideo: scheduleVideoRotation,
    refetchScheduled: refetchChallenges
  };

  // Handle video scheduling
  const handleScheduleVideo = async (videoId, scheduleDate) => {
    try {
      if (!videoId || !scheduleDate) {
        message.error("Please select a video and schedule date");
        return;
      }
  
      // Combine the selected date and time into the required format
      const scheduleDateTime = moment(scheduleDate).toISOString(); // This will give you the "publishAt" format
  
      const scheduleData = {
        videoId: videoId,
        publishAt: scheduleDate.toISOString()
      };
  
      // Call API to schedule video
      await scheduleVideoRotation(scheduleData);
      message.success("Video scheduled successfully!");
      setSchedulingVideo(null);
      setSchedulingDate(null);
      refetchChallenges();
    } catch (error) {
      console.error("Failed to schedule video:", error);
      message.error("Failed to schedule video");
    }
  };
  

  // Filter out already scheduled videos
  const availableVideos = allVideos.filter(video => {
    // Check if the video is not part of any challenge
    return !challenges.some(challenge => 
      challenge.videos?.some(v => v._id === video._id || v === video._id)
    );
  });

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
        if (!record.isScheduled) {
          return <Tag color="red">Not Scheduled</Tag>;
        }
        
        const scheduleDate = record.scheduledDate ? new Date(record.scheduledDate) : null;
        const isUpcoming = scheduleDate && scheduleDate > new Date();
        
        return (
          <div>
            <Tag color={isUpcoming ? "orange" : "green"}>
              {isUpcoming ? "Scheduled" : "Active"}
            </Tag>
            {scheduleDate && (
              <p className="text-xs mt-1">
                {moment(scheduleDate).format("MMM DD, YYYY")}
              </p>
            )}
          </div>
        );
      }
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => {
        // Check if video is already scheduled
        if (record.isScheduled) {
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
        pageType="daily-challenge" 
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
        title="Schedule Daily Challenge Videos"
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
          dataSource={sortedVideos}
          rowKey="_id"
          loading={allVideosLoading || challengesLoading}
          pagination={{ pageSize: 8 }}
          locale={{ emptyText: "No videos found" }}
        />
      </Modal>
    </div>
  );
};

export default TodayVideos;
