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
  useGetLibraryVideosQuery, 
  useScheduleVideoMutation,
  useCreateChallengeMutation, 
  useGetScheduledVideosQuery
} from "../../redux/apiSlices/videoApi";
import { Button, Tabs, Modal, Form, Input, Select, DatePicker, Space, Table, message, Tag } from "antd";
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
  const [updateComingSoon] = useUpdateComingSoonMutation();
  
  // New API hooks
  const [createChallengeWithVideos] = useCreateChallengeWithVideosMutation();
  const [scheduleVideoRotation] = useScheduleVideoRotationMutation();
  
  // State for challenge creation and video selection
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [challengeForm] = Form.useForm();
  const [selectedVideos, setSelectedVideos] = useState([]);
  const [activeTab, setActiveTab] = useState("1");
  const [schedulingModalVisible, setSchedulingModalVisible] = useState(false);
  const [schedulingForm] = Form.useForm();

  // Get all videos from library with filter for type
  const { data: videosData, isLoading: videosLoading } = useGetLibraryVideosQuery({ type: "all" });
  const allVideos = videosData?.data || [];
  
  // Get scheduled videos
  const { data: challengesData, isLoading: challengesLoading } = useGetDailyChallengeQuery();
  const challenges = challengesData?.data || [];
  
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
    updateItem: updateComingSoon, 
    categories,
  };

  // Handle challenge creation
  const handleCreateChallenge = async (values) => {
    try {
      if (selectedVideos.length === 0) {
        message.error("Please select at least one video for the challenge");
        return;
      }

      const challengeData = {
        title: values.title,
        description: values.description,
        category: values.category,
        videos: selectedVideos.map(video => video._id),
        startDate: values.startDate ? values.startDate.format("YYYY-MM-DD") : null,
        endDate: values.endDate ? values.endDate.format("YYYY-MM-DD") : null,
        isRandom: values.isRandom === "yes",
      };

      // Use the new API endpoint for creating challenges with videos
      await createChallengeWithVideos(challengeData);
      message.success("Challenge created successfully!");
      setSelectedVideos([]);
      challengeForm.resetFields();
      setIsModalVisible(false);
    } catch (error) {
      console.error("Failed to create challenge:", error);
      message.error("Failed to create challenge");
    }
  };

  // Handle video selection for challenge
  const toggleVideoSelection = (video) => {
    const isSelected = selectedVideos.some(v => v._id === video._id);
    
    if (isSelected) {
      setSelectedVideos(selectedVideos.filter(v => v._id !== video._id));
    } else {
      setSelectedVideos([...selectedVideos, video]);
    }
  };

  // Handle video scheduling
  const handleScheduleVideo = async (values) => {
    try {
      const scheduleData = {
        videoId: values.videoId,
        scheduleDate: values.scheduleDate.format("YYYY-MM-DD"),
        scheduleTime: values.scheduleDate.format("HH:mm:ss"),
        isRandom: values.isRandom === "yes",
      };

      // Call API to schedule video
      await scheduleVideoRotation(scheduleData);
      message.success("Video scheduled successfully!");
      schedulingForm.resetFields();
      setSchedulingModalVisible(false);
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

  // Video library table columns
  const videoColumns = [
    {
      title: "Thumbnail",
      dataIndex: "thumbnailUrl",
      key: "thumbnailUrl",
      render: (text, record) => (
        <img
          src={getVideoAndThumbnail(record.thumbnailUrl)}
          alt={record.title}
          style={{ width: 80, height: 45, objectFit: "cover" }}
        />
      ),
    },
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
    },
    {
      title: "Category",
      dataIndex: "category",
      key: "category",
    },
    {
      title: "Duration",
      dataIndex: "duration",
      key: "duration",
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Button
          type={selectedVideos.some(v => v._id === record._id) ? "primary" : "default"}
          onClick={() => toggleVideoSelection(record)}
        >
          {selectedVideos.some(v => v._id === record._id) ? "Selected" : "Select"}
        </Button>
      ),
    },
  ];

  // Selected videos table columns
  const selectedVideosColumns = [
    {
      title: "Thumbnail",
      dataIndex: "thumbnailUrl",
      key: "thumbnailUrl",
      render: (text, record) => (
        <img
          src={getVideoAndThumbnail(record.thumbnailUrl)}
          alt={record.title}
          style={{ width: 80, height: 45, objectFit: "cover" }}
        />
      ),
    },
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
    },
    {
      title: "Category",
      dataIndex: "category",
      key: "category",
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Button
          danger
          onClick={() => toggleVideoSelection(record)}
        >
          Remove
        </Button>
      ),
    },
  ];

  return (
    <div>
      <Tabs activeKey={activeTab} onChange={setActiveTab}>
        <TabPane tab="Daily Challenge Videos" key="1">
          <div className="flex justify-end mb-4">
            <Space>
              <GradientButton onClick={() => setIsModalVisible(true)} icon={<PlusOutlined />}>
                Create New Challenge
              </GradientButton>
              <GradientButton onClick={() => setSchedulingModalVisible(true)} icon={<CalendarOutlined />}>
                Schedule Videos
              </GradientButton>
            </Space>
          </div>
          <VideoUploadSystem pageType="daily-challenge" apiHooks={apiHooks} />
        </TabPane>
      </Tabs>

      {/* Challenge Creation Modal */}
      <Modal
        title="Create New Challenge"
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        width={1000}
        footer={null}
      >
        <Tabs defaultActiveKey="1">
          <TabPane tab="Challenge Details" key="1">
            <Form
              form={challengeForm}
              layout="vertical"
              onFinish={handleCreateChallenge}
            >
              <Form.Item
                name="title"
                label="Challenge Title"
                rules={[{ required: true, message: "Please enter a title" }]}
              >
                <Input placeholder="Enter challenge title" />
              </Form.Item>
              
              <Form.Item
                name="description"
                label="Description"
                rules={[{ required: true, message: "Please enter a description" }]}
              >
                <Input.TextArea rows={4} placeholder="Enter challenge description" />
              </Form.Item>
              
              <Form.Item
                name="category"
                label="Category"
                rules={[{ required: true, message: "Please select a category" }]}
              >
                <Select placeholder="Select category">
                  {categories.map((category) => (
                    <Option key={category} value={category}>
                      {category}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
              
              <Form.Item
                name="startDate"
                label="Start Date"
              >
                <DatePicker style={{ width: "100%" }} />
              </Form.Item>
              
              <Form.Item
                name="endDate"
                label="End Date"
              >
                <DatePicker style={{ width: "100%" }} />
              </Form.Item>
              
              <Form.Item
                name="isRandom"
                label="Video Rotation"
                rules={[{ required: true, message: "Please select rotation type" }]}
              >
                <Select placeholder="Select rotation type">
                  <Option value="yes">Random Rotation</Option>
                  <Option value="no">Sequential Rotation</Option>
                </Select>
              </Form.Item>
              
              <Form.Item>
                <Button 
                  type="primary" 
                  htmlType="submit" 
                  disabled={selectedVideos.length === 0}
                  loading={challengesLoading}
                >
                  Create Challenge
                </Button>
              </Form.Item>
            </Form>
          </TabPane>
          
          <TabPane tab="Video Library" key="2">
            <Table
              columns={videoColumns}
              dataSource={availableVideos}
              rowKey="_id"
              pagination={{ pageSize: 5 }}
              loading={videosLoading}
            />
          </TabPane>
          
          <TabPane tab={`Selected Videos (${selectedVideos.length})`} key="3">
            <Table
              columns={selectedVideosColumns}
              dataSource={selectedVideos}
              rowKey="_id"
              pagination={{ pageSize: 5 }}
            />
          </TabPane>
        </Tabs>
      </Modal>

      {/* Video Scheduling Modal */}
      <Modal
        title="Schedule Videos"
        visible={schedulingModalVisible}
        onCancel={() => setSchedulingModalVisible(false)}
        footer={null}
      >
        <Form
          form={schedulingForm}
          layout="vertical"
          onFinish={handleScheduleVideo}
        >
          <Form.Item
            name="videoId"
            label="Select Video"
            rules={[{ required: true, message: "Please select a video" }]}
          >
            <Select placeholder="Select a video" loading={videosLoading}>
              {availableVideos.map(video => (
                <Option key={video._id} value={video._id}>
                  {video.title}
                </Option>
              ))}
            </Select>
          </Form.Item>

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
          >
            <Select placeholder="Select rotation mode">
              <Option value="yes">Random Rotation</Option>
              <Option value="no">Sequential Rotation</Option>
            </Select>
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" loading={challengesLoading}>
              Schedule Video
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default TodayVideos;
