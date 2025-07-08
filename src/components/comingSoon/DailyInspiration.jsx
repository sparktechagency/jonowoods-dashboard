import React, { useState } from "react";
import { 
  useCreateDailyInspirationMutation, 
  useDeleteDailyInspirationMutation, 
  useGetAllDailyInspirationQuery, 
  useGetDailyInspirationByIdQuery, 
  useUpdateDailyInspirationMutation, 
  useUpdateDailyInspirationStatusMutation,
  useScheduleDailyInspirationMutation,
  useGetDailyInspirationLibraryQuery,
  useGetScheduledDailyInspirationQuery
} from "../../redux/apiSlices/dailyInspiraton";
import VideoUploadSystem from "../common/VideoUploade";
import { 
  useGetLibraryVideosQuery,
  useScheduleVideoMutation,
  useGetScheduledVideosQuery
} from "../../redux/apiSlices/videoApi";
import { Button, Tabs, Modal, Form, Input, Select, DatePicker, Space, Table, message, Tag } from "antd";
import { PlusOutlined, CalendarOutlined, UploadOutlined } from "@ant-design/icons";
import GradientButton from "../common/GradiantButton";
import { getVideoAndThumbnail } from "../common/imageUrl";
import moment from "moment";

const { Option } = Select;
const { TabPane } = Tabs;

const DailyInspirationPage = () => {
  const [createDailyInspiration] = useCreateDailyInspirationMutation();
  const [updateDailyInspiration] = useUpdateDailyInspirationMutation();
  const [deleteDailyInspiration] = useDeleteDailyInspirationMutation();

  // New API hooks
  const [scheduleDailyInspiration] = useScheduleDailyInspirationMutation();
  
  // State for inspiration scheduling and video selection
  const [schedulingModalVisible, setSchedulingModalVisible] = useState(false);
  const [schedulingForm] = Form.useForm();
  const [selectedVideo, setSelectedVideo] = useState(null);
  
  // Get Daily Inspiration library and scheduled videos
  const { data: libraryData, isLoading: libraryLoading } = useGetDailyInspirationLibraryQuery({ category: "Daily Inspiration" });
  const { data: scheduledData, isLoading: scheduledLoading } = useGetScheduledDailyInspirationQuery();
  
  const allVideos = libraryData?.data || [];
  const scheduledVideos = scheduledData?.data || [];

  const categories = ["Daily Inspiration"];

  const apiHooks = {
    useGetAllQuery: useGetAllDailyInspirationQuery,
    useGetByIdQuery: useGetDailyInspirationByIdQuery,
    deleteItem: deleteDailyInspiration,
    updateItemStatus: updateDailyInspiration,
    createItem: createDailyInspiration,
    updateItem: useUpdateDailyInspirationStatusMutation,
    categories,
  };

  // Handle scheduling Daily Inspiration videos
  const handleScheduleVideo = async (values) => {
    try {
      const scheduleData = {
        videoId: values.videoId,
        scheduleDate: values.scheduleDate.format("YYYY-MM-DD"),
        scheduleTime: values.scheduleDate.format("HH:mm:ss"),
        isRandom: values.isRandom === "yes",
        category: "Daily Inspiration"
      };

      // Call API to schedule video using the new endpoint
      await scheduleDailyInspiration(scheduleData);
      message.success("Daily Inspiration video scheduled successfully!");
      schedulingForm.resetFields();
      setSchedulingModalVisible(false);
      setSelectedVideo(null);
    } catch (error) {
      console.error("Failed to schedule Daily Inspiration:", error);
      message.error("Failed to schedule Daily Inspiration video");
    }
  };

  // Library videos filtered to only show non-scheduled videos
  const availableVideos = allVideos.filter(video => 
    !scheduledVideos.some(scheduled => scheduled.videoId === video._id)
  );

  // Preview selected video
  const VideoPreview = () => {
    if (!selectedVideo) return null;
    
    return (
      <div className="mt-4 p-4 border rounded-lg">
        <h3 className="mb-2 font-bold">Selected Video Preview</h3>
        <div className="flex items-start">
          <img 
            src={getVideoAndThumbnail(selectedVideo.thumbnailUrl)} 
            alt={selectedVideo.title} 
            style={{ width: 120, height: 68, objectFit: "cover" }}
            className="mr-4 rounded"
          />
          <div>
            <p className="font-medium">{selectedVideo.title}</p>
            <p className="text-sm text-gray-600">Duration: {selectedVideo.duration}</p>
            <Tag color="blue">{selectedVideo.category}</Tag>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div>
      <div className="flex justify-end mb-4">
        <GradientButton 
          onClick={() => setSchedulingModalVisible(true)}
          icon={<CalendarOutlined />}
        >
          Schedule Inspiration Video
        </GradientButton>
      </div>
      
      <VideoUploadSystem pageType="daily-inspiration" apiHooks={apiHooks} />

      {/* Video Scheduling Modal */}
      <Modal
        title="Schedule Daily Inspiration"
        visible={schedulingModalVisible}
        onCancel={() => {
          setSchedulingModalVisible(false);
          setSelectedVideo(null);
          schedulingForm.resetFields();
        }}
        footer={null}
        width={700}
      >
        <Form
          form={schedulingForm}
          layout="vertical"
          onFinish={handleScheduleVideo}
        >
          <Form.Item
            name="videoId"
            label="Select Video"
            rules={[{ required: true, message: "Please select a Daily Inspiration video" }]}
          >
            <Select 
              placeholder="Select a video for Daily Inspiration" 
              onChange={(value) => {
                const video = availableVideos.find(v => v._id === value);
                setSelectedVideo(video);
              }}
              optionFilterProp="children"
              showSearch
              loading={libraryLoading}
            >
              {availableVideos.map(video => (
                <Option key={video._id} value={video._id}>
                  {video.title}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <VideoPreview />

          <Form.Item
            name="scheduleDate"
            label="Schedule Date & Time"
            rules={[{ required: true, message: "Please select schedule date and time" }]}
          >
            <DatePicker showTime style={{ width: "100%" }} />
          </Form.Item>

          <Form.Item
            name="isRandom"
            label="Rotation Mode"
            rules={[{ required: true, message: "Please select rotation mode" }]}
            help="Random rotation will shuffle through all videos before repeating"
          >
            <Select placeholder="Select rotation mode">
              <Option value="yes">Random Rotation</Option>
              <Option value="no">Sequential Rotation</Option>
            </Select>
          </Form.Item>

          <Form.Item className="text-right">
            <Space>
              <Button onClick={() => {
                setSchedulingModalVisible(false);
                setSelectedVideo(null);
                schedulingForm.resetFields();
              }}>
                Cancel
              </Button>
              <Button type="primary" htmlType="submit" loading={scheduledLoading}>
                Schedule Video
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default DailyInspirationPage;
