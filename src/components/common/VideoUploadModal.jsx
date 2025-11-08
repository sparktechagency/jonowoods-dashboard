import React, { useState, useEffect } from "react";
import {
  Modal,
  Form,
  Input,
  Select,
  Upload,
  Button,
  message,
  Tag,
  Image,
} from "antd";
import { InboxOutlined, DeleteOutlined } from "@ant-design/icons";
import { getVideoAndThumbnail } from "./imageUrl";
import VideoLibraryModal from "./VideoLibraryModal";
import ChallengeLibraryModal from "./ChallengeLibraryModal";
import { useGetAllVideosQuery } from "../../redux/apiSlices/videoApi";
import { useGetDailyChallengeQuery } from "../../redux/apiSlices/dailyChallangeApi";
// import { useGetAllChallengesQuery } from "../../redux/apiSlices/challengeApi";

const { TextArea } = Input;
const { Option } = Select;
const { Dragger } = Upload;

const VideoFormModal = ({
  visible,
  onClose,
  onSubmit,
  editingItem,
  pageType,
  loading = false,
}) => {
  const [form] = Form.useForm();
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [equipments, setEquipments] = useState([]);
  const [equipmentInput, setEquipmentInput] = useState("");

  // Video Library Modal States
  const [libraryModalVisible, setLibraryModalVisible] = useState(false);
  const [selectedLibraryVideo, setSelectedLibraryVideo] = useState(null);
  const [libraryCurrentPage, setLibraryCurrentPage] = useState(1);
  const [libraryPageSize, setLibraryPageSize] = useState(10);

  // Challenge Library Modal States
  const [challengeModalVisible, setChallengeModalVisible] = useState(false);
  const [selectedChallenge, setSelectedChallenge] = useState(null);
  const [challengeCurrentPage, setChallengeCurrentPage] = useState(1);
  const [challengePageSize, setChallengePageSize] = useState(10);

  // Fetch videos for library
  const { data: libraryVideosData, isLoading: libraryLoading } =
    useGetAllVideosQuery([
      { name: "limit", value: libraryPageSize },
      { name: "page", value: libraryCurrentPage },
    ]);

  // Fetch challenges for library
  const { data: challengesData, isLoading: challengesLoading } =
    useGetDailyChallengeQuery([
      { name: "limit", value: challengePageSize },
      { name: "page", value: challengeCurrentPage },
    ]);

  const libraryVideos = libraryVideosData?.data || [];
  const libraryPagination = libraryVideosData?.pagination || {
    total: 0,
    current: 1,
    pageSize: 10,
  };

  const challenges = challengesData?.data || [];
  const challengePagination = challengesData?.pagination || {
    total: 0,
    current: 1,
    pageSize: 10,
  };

  const isEditMode = !!editingItem;

  // Handle video selection from library
  const handleSelectFromLibrary = (video) => {
    if (selectedChallenge) {
      message.warning(
        "You cannot select both library video and challenge. Please remove challenge first."
      );
      return;
    }

    setSelectedLibraryVideo(video);

    // Set form values from selected video
    form.setFieldsValue({
      title: video.title,
      description: video.description,
    });

    // Set equipments from selected video
    if (video.equipment || video.equipments) {
      const videoEquipments = video.equipment || video.equipments;
      setEquipments(
        Array.isArray(videoEquipments) ? videoEquipments : [videoEquipments]
      );
    }

    message.success(`Video "${video.title}" selected from library`);
    setLibraryModalVisible(false);
  };

  // Handle challenge selection
  const handleSelectFromChallenge = (challenge) => {
    if (selectedLibraryVideo) {
      message.warning(
        "You cannot select both challenge and library video. Please remove library video first."
      );
      return;
    }

    setSelectedChallenge(challenge);

    // Set form values from selected challenge
    form.setFieldsValue({
      title: challenge.name,
      description: challenge.description,
    });

    message.success(`Challenge "${challenge.name}" selected`);
    setChallengeModalVisible(false);
  };

  // Handle library modal pagination
  const handleLibraryPaginationChange = (page, size) => {
    setLibraryCurrentPage(page);
    setLibraryPageSize(size);
  };

  // Handle challenge modal pagination
  const handleChallengePaginationChange = (page, size) => {
    setChallengeCurrentPage(page);
    setChallengePageSize(size);
  };

  // Initialize form when editing or opening modal
  useEffect(() => {
    if (visible && editingItem) {
      form.setFieldsValue({
        title: editingItem.title,
        category: "comingSoon",
        description: editingItem.description,
        isReady: editingItem.isReady || "comingSoon",
        redirectUrl: editingItem.redirectUrl,
      });

      // Set equipments
      if (editingItem.equipments || editingItem.equipment) {
        const itemEquipments = editingItem.equipments || editingItem.equipment;
        setEquipments(
          Array.isArray(itemEquipments) ? itemEquipments : [itemEquipments]
        );
      }

      // Set selected library video if exists
      if (editingItem.videoOriginalId) {
        setSelectedLibraryVideo({ _id: editingItem.videoOriginalId });
      }

      // Set selected challenge if exists
      if (editingItem.challengeId) {
        setSelectedChallenge({ _id: editingItem.challengeId });
      }
    }
  }, [editingItem, visible, form]);

  // Reset form when modal closes
  useEffect(() => {
    if (!visible) {
      form.resetFields();
      setThumbnailFile(null);
      setEquipments([]);
      setEquipmentInput("");
      setSelectedLibraryVideo(null);
      setSelectedChallenge(null);
      setLibraryCurrentPage(1);
      setChallengeCurrentPage(1);
    }
  }, [visible, form]);

  // Equipment handlers
  const addEquipment = () => {
    if (equipmentInput.trim() && !equipments.includes(equipmentInput.trim())) {
      setEquipments([...equipments, equipmentInput.trim()]);
      setEquipmentInput("");
    }
  };

  const removeEquipment = (equipmentToRemove) => {
    setEquipments(equipments.filter((eq) => eq !== equipmentToRemove));
  };

  const handleEquipmentKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addEquipment();
    }
  };

  // File upload handlers
  const thumbnailProps = {
    beforeUpload: (file) => {
      const isImage = file.type.startsWith("image/");
      if (!isImage) {
        message.error("You can only upload image files!");
        return false;
      }
      const isLt20M = file.size / 1024 / 1024 < 20;
      if (!isLt20M) {
        message.error("Image must be smaller than 20MB!");
        return false;
      }
      setThumbnailFile(file);
      return false;
    },
    onRemove: () => {
      setThumbnailFile(null);
    },
    fileList: thumbnailFile ? [thumbnailFile] : [],
    showUploadList: false,
  };

  // Form submission handler
  const handleFormSubmit = async (values) => {
    try {
      const hasExistingThumbnail =
        editingItem?.thumbnailUrl || editingItem?.thumbnail;

      // Validate thumbnail
      if (!thumbnailFile && !isEditMode) {
        message.error("Please select a thumbnail");
        return;
      }

      if (isEditMode && !thumbnailFile && !hasExistingThumbnail) {
        message.error("Please select a thumbnail");
        return;
      }

      // Validate that either library video or challenge is selected (not both)
      if (selectedLibraryVideo && selectedChallenge) {
        message.error(
          "Please select either library video or challenge, not both"
        );
        return;
      }

      // Prepare data according to backend format
      const videoData = {
        title: values.title,
        category: "comingSoon",
        description: values.description || "",
        equipment: equipments,
        thumbnailUrl: editingItem?.thumbnailUrl || "",
        isReady: values.isReady,
      };

      // Add videoOriginalId if library video is selected
      if (selectedLibraryVideo) {
        videoData.videoOriginalId = selectedLibraryVideo._id;
      }

      // Add challengeId if challenge is selected
      if (selectedChallenge) {
        videoData.challengeId = selectedChallenge._id;
      }

      // Add redirectUrl if provided
      if (values.redirectUrl) {
        videoData.redirectUrl = values.redirectUrl;
      }

      // Create FormData
      const formDataToSend = new FormData();
      formDataToSend.append("data", JSON.stringify(videoData));

      // Append thumbnail if new file is selected
      if (thumbnailFile) {
        formDataToSend.append("thumbnail", thumbnailFile);
      }

      await onSubmit(formDataToSend);
    } catch (error) {
      console.error("Error submitting video:", error);
      message.error(
        `Failed to ${editingItem ? "update" : "add"} video: ${
          error?.message || "Unknown error"
        }`
      );
    }
  };

  return (
    <>
      <Modal
        title={isEditMode ? "Edit Coming Soon" : "Add New Coming Soon"}
        open={visible}
        onCancel={onClose}
        footer={null}
         getContainer={false}
        width={900}
        destroyOnClose
        className="video-form-modal"
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleFormSubmit}
          className="video-upload-form"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Title */}
            <Form.Item
              name="title"
              label="Title"
              rules={[{ required: true, message: "Please enter title" }]}
            >
              <Input placeholder="Enter Title" className="h-12" />
            </Form.Item>

            {/* Ready Status */}
            <Form.Item
              name="isReady"
              label="Status"
              rules={[{ required: true, message: "Please select a status" }]}
            >
              <Select placeholder="Select status" className="h-12">
                <Option value="comingSoon">Coming Soon</Option>
                <Option value="itsHere">It's Here</Option>
                <Option value="checkThisOut">Check This Out</Option>
              </Select>
            </Form.Item>

            {/* Redirect URL */}
            <Form.Item
              name="redirectUrl"
              label="Redirect URL"
              rules={[{ type: "url", message: "Please enter a valid URL" }]}
            >
              <Input
                placeholder="Enter redirect URL (optional)"
                className="h-12"
              />
            </Form.Item>

            {/* Equipment */}
            <Form.Item label="Equipment" className="md:col-span-1">
              <div className="space-y-2">
                <Input
                  placeholder="Add equipment and press Enter"
                  value={equipmentInput}
                  onChange={(e) => setEquipmentInput(e.target.value)}
                  onKeyPress={handleEquipmentKeyPress}
                  className="h-12"
                  suffix={
                    <Button
                      type="text"
                      onClick={addEquipment}
                      disabled={!equipmentInput.trim()}
                    >
                      Add
                    </Button>
                  }
                />
                {equipments.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {equipments.map((equipment, index) => (
                      <Tag
                        key={index}
                        closable
                        onClose={() => removeEquipment(equipment)}
                        color="red"
                      >
                        {equipment}
                      </Tag>
                    ))}
                  </div>
                )}
              </div>
            </Form.Item>

            {/* Category - Hidden but set to comingSoon */}
            <Form.Item
              name="category"
              label="Category"
              initialValue="comingSoon"
              hidden
            >
              <Input value="comingSoon" disabled />
            </Form.Item>
          </div>

          <div className="flex items-center justify-between gap-6">
            <div className="w-1/2">
              <Form.Item
                label="Thumbnail"
                required={!isEditMode}
                className="mt-4"
              >
                {/* Hide Dragger when thumbnailFile or editingItem.thumbnailUrl exists */}
                {!thumbnailFile && !editingItem?.thumbnailUrl && (
                  <Dragger {...thumbnailProps}>
                    <InboxOutlined className="text-2xl mb-2" />
                    <p>Click or drag image to upload</p>
                    {isEditMode && (
                      <p className="text-blue-500 text-xs">
                        Leave empty to keep existing thumbnail
                      </p>
                    )}
                  </Dragger>
                )}

                {/* Show preview only when image exists */}
                {(thumbnailFile || editingItem?.thumbnailUrl) && (
                  <div className="mt-2 text-center">
                    <div className="relative inline-block">
                      <Image
                        src={
                          thumbnailFile
                            ? URL.createObjectURL(thumbnailFile)
                            : getVideoAndThumbnail
                            ? getVideoAndThumbnail(editingItem.thumbnailUrl)
                            : editingItem.thumbnailUrl || editingItem.thumbnail
                        }
                        width={400}
                        height={200}
                        style={{ objectFit: "cover" }}
                        className="rounded border"
                      />
                      <Button
                        type="text"
                        size="small"
                        icon={<DeleteOutlined />}
                        onClick={() => setThumbnailFile(null)}
                        className="absolute top-2 right-2 bg-red-500 text-white hover:bg-red-600"
                        style={{ borderRadius: "50%", width: 24, height: 24 }}
                      />
                    </div>
                  </div>
                )}
              </Form.Item>
            </div>

            <div className="w-1/2">
              {/* Video/Challenge Selection */}
              <Form.Item label="Select Source" className="mt-4">
                <div className="space-y-3">
                  {/* Show selected library video info */}
                  {selectedLibraryVideo && (
                    <div className="p-3 bg-green-50 border border-green-200 rounded">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="text-sm font-medium text-green-800">
                            Selected from Library:{" "}
                            {selectedLibraryVideo.title || "Video"}
                          </p>
                        </div>
                        <Button
                          type="text"
                          size="small"
                          danger
                          onClick={() => setSelectedLibraryVideo(null)}
                        >
                          Remove
                        </Button>
                      </div>
                    </div>
                  )}

                  {/* Show selected challenge info */}
                  {selectedChallenge && (
                    <div className="p-3 bg-blue-50 border border-blue-200 rounded">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="text-sm font-medium text-blue-800">
                            Selected Challenge:{" "}
                            {selectedChallenge.name || "Challenge"}
                          </p>
                        </div>
                        <Button
                          type="text"
                          size="small"
                          danger
                          onClick={() => setSelectedChallenge(null)}
                        >
                          Remove
                        </Button>
                      </div>
                    </div>
                  )}

                  {/* Selection Buttons */}
                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      type="default"
                      className="h-12"
                      onClick={() => setLibraryModalVisible(true)}
                      disabled={!!selectedChallenge}
                    >
                      From Library
                    </Button>
                    <Button
                      type="default"
                      className="h-12"
                      onClick={() => setChallengeModalVisible(true)}
                      disabled={!!selectedLibraryVideo}
                    >
                      From Challenge
                    </Button>
                  </div>
                </div>
              </Form.Item>
            </div>
          </div>

          {/* Description */}
          <Form.Item name="description" label="Description">
            <TextArea rows={4} placeholder="Add description (optional)" />
          </Form.Item>

          {/* Submit & Cancel Buttons */}
          <Form.Item>
            <div className="flex justify-end space-x-4">
              <Button
                onClick={onClose}
                disabled={loading}
                className="py-6 px-10"
              >
                Cancel
              </Button>
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                className="bg-primary py-6 px-8"
              >
                {editingItem ? "Update" : "Add New"}
              </Button>
            </div>
          </Form.Item>
        </Form>
      </Modal>

      {/* Video Library Modal */}
      <VideoLibraryModal
        visible={libraryModalVisible}
        onCancel={() => setLibraryModalVisible(false)}
        onSelectVideo={handleSelectFromLibrary}
        availableVideos={libraryVideos}
        loading={libraryLoading}
        pagination={{
          current: libraryCurrentPage,
          pageSize: libraryPageSize,
          total: libraryPagination.total,
        }}
        onPaginationChange={handleLibraryPaginationChange}
        title="Select Video from Library"
        selectButtonText="Select Video"
      />

      {/* Challenge Library Modal */}
      <ChallengeLibraryModal
        visible={challengeModalVisible}
        onCancel={() => setChallengeModalVisible(false)}
        onSelectChallenge={handleSelectFromChallenge}
        availableChallenges={challenges}
        loading={challengesLoading}
        pagination={{
          current: challengeCurrentPage,
          pageSize: challengePageSize,
          total: challengePagination.total,
        }}
        onPaginationChange={handleChallengePaginationChange}
        title="Select Challenge"
        selectButtonText="Select Challenge"
      />
    </>
  );
};

export default VideoFormModal;
