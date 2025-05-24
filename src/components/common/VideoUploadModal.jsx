import React, { useState, useEffect, useCallback } from "react";
import {
  Modal,
  Form,
  Input,
  Select,
  Upload,
  Button,
  message,
  Tag,
  Space,
  Image,
} from "antd";
import {
  UploadOutlined,
  CloseOutlined,
  EyeOutlined,
  DeleteOutlined,
} from "@ant-design/icons";

const { TextArea } = Input;
const { Option } = Select;

const VideoFormModal = ({
  visible,
  onClose,
  onSubmit,
  editingItem,
  pageType,
  loading = false,
}) => {
  const [form] = Form.useForm();
  const [thumbnailFileList, setThumbnailFileList] = useState([]);
  const [videoFileList, setVideoFileList] = useState([]);
  const [equipments, setEquipments] = useState([]);
  const [equipmentInput, setEquipmentInput] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [thumbnailPreview, setThumbnailPreview] = useState(null);
  const [videoPreview, setVideoPreview] = useState(null);

  // Categories based on page type
  const getCategories = () => {
    switch (pageType) {
      case "coming-soon":
        return ["Video/Picture", "Fitness", "Yoga", "Meditation", "Workout"];
      case "today-video":
        return ["Morning", "Evening", "Workout", "Cardio", "Strength"];
      case "challenge-video":
        return ["30-Day", "Weekly", "Monthly", "Beginner", "Advanced"];
      default:
        return ["Video/Picture"];
    }
  };

  // Form title based on page type and editing state
  const getFormTitle = () => {
    const pageTitle =
      {
        "coming-soon": "Coming Soon",
        "today-video": "Today's Video",
        "challenge-video": "Challenge Video",
      }[pageType] || "Content";

    return editingItem ? `Edit ${pageTitle}` : `Add New ${pageTitle}`;
  };

  // Create preview URL for files
  const createPreviewUrl = (file) => {
    if (file.url) return file.url; // Existing file URL
    if (file.originFileObj) return URL.createObjectURL(file.originFileObj); // New file
    return null;
  };

  // Initialize form when editing
  useEffect(() => {
    if (editingItem && visible) {
      form.setFieldsValue({
        title: editingItem.title,
        category: editingItem.category,
        timeDuration: editingItem.timeDuration || editingItem.duration,
        description: editingItem.description,
      });

      // Set equipments if available
      if (editingItem.equipments || editingItem.equipment) {
        const itemEquipments = editingItem.equipments || editingItem.equipment;
        setEquipments(
          Array.isArray(itemEquipments) ? itemEquipments : [itemEquipments]
        );
      }

      // Handle existing files - create file objects for display
      if (editingItem.thumbnailUrl || editingItem.thumbnail) {
        const thumbnailUrl = editingItem.thumbnailUrl || editingItem.thumbnail;
        const thumbnailFile = {
          uid: "-1",
          name: "existing-thumbnail",
          status: "done",
          url: thumbnailUrl,
          isExisting: true,
        };
        setThumbnailFileList([thumbnailFile]);
        setThumbnailPreview(thumbnailUrl);
      }

      if (editingItem.videoUrl) {
        const videoFile = {
          uid: "-1",
          name: "existing-video",
          status: "done",
          url: editingItem.videoUrl,
          isExisting: true,
        };
        setVideoFileList([videoFile]);
        setVideoPreview(editingItem.videoUrl);
      }
    }
  }, [editingItem, visible, form]);

  // Reset form when modal closes
  useEffect(() => {
    if (!visible) {
      form.resetFields();
      setThumbnailFileList([]);
      setVideoFileList([]);
      setEquipments([]);
      setEquipmentInput("");
      // Clean up preview URLs
      if (thumbnailPreview && thumbnailPreview.startsWith("blob:")) {
        URL.revokeObjectURL(thumbnailPreview);
      }
      if (videoPreview && videoPreview.startsWith("blob:")) {
        URL.revokeObjectURL(videoPreview);
      }
      setThumbnailPreview(null);
      setVideoPreview(null);
    }
  }, [visible, form]);

  // Cleanup preview URLs on component unmount
  useEffect(() => {
    return () => {
      if (thumbnailPreview && thumbnailPreview.startsWith("blob:")) {
        URL.revokeObjectURL(thumbnailPreview);
      }
      if (videoPreview && videoPreview.startsWith("blob:")) {
        URL.revokeObjectURL(videoPreview);
      }
    };
  }, [thumbnailPreview, videoPreview]);

  // Handle equipment tags
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
  const thumbnailUploadProps = {
    fileList: thumbnailFileList,
    beforeUpload: (file) => {
      const isImage = file.type.startsWith("image/");
      if (!isImage) {
        message.error("You can only upload image files!");
        return false;
      }
      const isLt5M = file.size / 1024 / 1024 < 5;
      if (!isLt5M) {
        message.error("Image must be smaller than 5MB!");
        return false;
      }
      return false; // Prevent auto upload
    },
    onChange: (info) => {
      const fileList = info.fileList.slice(-1); // Keep only the latest file
      setThumbnailFileList(fileList);

      // Update preview
      if (fileList.length > 0) {
        const previewUrl = createPreviewUrl(fileList[0]);
        // Clean up previous preview URL if it was a blob
        if (thumbnailPreview && thumbnailPreview.startsWith("blob:")) {
          URL.revokeObjectURL(thumbnailPreview);
        }
        setThumbnailPreview(previewUrl);
      } else {
        // Clean up preview URL if removing file
        if (thumbnailPreview && thumbnailPreview.startsWith("blob:")) {
          URL.revokeObjectURL(thumbnailPreview);
        }
        setThumbnailPreview(null);
      }
    },
    onRemove: () => {
      setThumbnailFileList([]);
      // Clean up preview URL
      if (thumbnailPreview && thumbnailPreview.startsWith("blob:")) {
        URL.revokeObjectURL(thumbnailPreview);
      }
      setThumbnailPreview(null);
    },
    showUploadList: false, // We'll show custom preview
  };

  const videoUploadProps = {
    fileList: videoFileList,
    beforeUpload: (file) => {
      const isVideo = file.type.startsWith("video/");
      if (!isVideo) {
        message.error("You can only upload video files!");
        return false;
      }
      const isLt100M = file.size / 1024 / 1024 < 100;
      if (!isLt100M) {
        message.error("Video must be smaller than 100MB!");
        return false;
      }
      return false; // Prevent auto upload
    },
    onChange: (info) => {
      const fileList = info.fileList.slice(-1); // Keep only the latest file
      setVideoFileList(fileList);

      // Update preview
      if (fileList.length > 0) {
        const previewUrl = createPreviewUrl(fileList[0]);
        // Clean up previous preview URL if it was a blob
        if (videoPreview && videoPreview.startsWith("blob:")) {
          URL.revokeObjectURL(videoPreview);
        }
        setVideoPreview(previewUrl);
      } else {
        // Clean up preview URL if removing file
        if (videoPreview && videoPreview.startsWith("blob:")) {
          URL.revokeObjectURL(videoPreview);
        }
        setVideoPreview(null);
      }
    },
    onRemove: () => {
      setVideoFileList([]);
      // Clean up preview URL
      if (videoPreview && videoPreview.startsWith("blob:")) {
        URL.revokeObjectURL(videoPreview);
      }
      setVideoPreview(null);
    },
    showUploadList: false, // We'll show custom preview
  };

  // Handle form submission
  const handleFormSubmit = useCallback(
    async (values) => {
      try {
        setSubmitting(true);

        // Get files from fileList (only new files, not existing ones)
        const thumbnailFile =
          thumbnailFileList[0]?.originFileObj ||
          thumbnailFileList[0]?.originFile;
        const videoFile =
          videoFileList[0]?.originFileObj || videoFileList[0]?.originFile;

        // Check if we're in edit mode
        const isEditMode = !!editingItem;

        // For edit mode, files are optional (only required if no existing files)
        const hasExistingThumbnail =
          editingItem?.thumbnailUrl || editingItem?.thumbnail;
        const hasExistingVideo = editingItem?.videoUrl;

        // Validate required files
        if (!thumbnailFile && !isEditMode) {
          message.error("Please select a thumbnail");
          return;
        }
        if (!videoFile && !isEditMode) {
          message.error("Please select a video");
          return;
        }

        // For edit mode, check if we have either existing files or new files
        if (isEditMode) {
          if (!thumbnailFile && !hasExistingThumbnail) {
            message.error("Please select a thumbnail");
            return;
          }
          if (!videoFile && !hasExistingVideo) {
            message.error("Please select a video");
            return;
          }
        }

        // Format duration properly
        const formattedDuration = values.timeDuration.includes(" Min")
          ? values.timeDuration
          : `${values.timeDuration} Min`;

        // Create video data object
        const videoData = {
          title: values.title,
          category: values.category,
          duration: formattedDuration,
          timeDuration: formattedDuration,
          description: values.description || "",
          equipment: equipments,
          equipments: equipments,
          uploadDate:
            editingItem?.uploadDate || new Date().toLocaleDateString(),
        };

        // Create FormData
        const formDataToSend = new FormData();

        // Always append the data
        formDataToSend.append("data", JSON.stringify(videoData));

        // Append files only if they are new files (have originFileObj)
        if (thumbnailFile) {
          formDataToSend.append("thumbnail", thumbnailFile);
        }
        if (videoFile) {
          formDataToSend.append("video", videoFile);
        }

        console.log("Submitting form data:", {
          isEditMode,
          videoData,
          hasThumbnailFile: !!thumbnailFile,
          hasVideoFile: !!videoFile,
          editingItemId: editingItem?._id,
        });

        // Call the onSubmit prop with the form data
        if (onSubmit) {
          await onSubmit(formDataToSend);
        }

        // Don't show success message here - let the parent component handle it
        // Close modal
        onClose();
      } catch (error) {
        console.error("Error submitting video:", error);
        message.error(
          `Failed to ${editingItem ? "update" : "add"} video: ${
            error?.message || "Unknown error"
          }`
        );
      } finally {
        setSubmitting(false);
      }
    },
    [
      thumbnailFileList,
      videoFileList,
      editingItem,
      equipments,
      onSubmit,
      onClose,
    ]
  );

  // Custom thumbnail preview component
  const ThumbnailPreview = () => {
    if (!thumbnailPreview) return null;

    return (
      <div className="mt-2 p-2 border border-gray-200 rounded-lg bg-gray-50">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">
            Thumbnail Preview:
          </span>
          <Button
            type="text"
            size="small"
            icon={<DeleteOutlined />}
            onClick={() => {
              setThumbnailFileList([]);
              if (thumbnailPreview && thumbnailPreview.startsWith("blob:")) {
                URL.revokeObjectURL(thumbnailPreview);
              }
              setThumbnailPreview(null);
            }}
            className="text-red-500 hover:text-red-700"
          >
            Remove
          </Button>
        </div>
        <div className="flex justify-center">
          <Image
            src={thumbnailPreview}
            alt="Thumbnail preview"
            width={200}
            height={120}
            style={{ objectFit: "cover" }}
            className="rounded border"
            preview={{
              mask: (
                <div className="flex items-center justify-center">
                  <EyeOutlined className="text-white text-lg" />
                  <span className="ml-2 text-white">Preview</span>
                </div>
              ),
            }}
          />
        </div>
      </div>
    );
  };

  // Custom video preview component
  const VideoPreview = () => {
    if (!videoPreview) return null;

    return (
      <div className="mt-2 p-2 border border-gray-200 rounded-lg bg-gray-50">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">
            Video Preview:
          </span>
          <Button
            type="text"
            size="small"
            icon={<DeleteOutlined />}
            onClick={() => {
              setVideoFileList([]);
              if (videoPreview && videoPreview.startsWith("blob:")) {
                URL.revokeObjectURL(videoPreview);
              }
              setVideoPreview(null);
            }}
            className="text-red-500 hover:text-red-700"
          >
            Remove
          </Button>
        </div>
        <div className="flex justify-center">
          <video
            src={videoPreview}
            controls
            width={300}
            height={200}
            className="rounded border"
            style={{ maxWidth: "100%", maxHeight: "200px" }}
          >
            Your browser does not support the video tag.
          </video>
        </div>
      </div>
    );
  };

  return (
    <Modal
      title={getFormTitle()}
      open={visible}
      onCancel={onClose}
      footer={null}
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
            rules={[{ required: true, message: "Please enter video title" }]}
            className="md:col-span-1"
          >
            <Input placeholder="Enter Your Video Title" className="h-12" />
          </Form.Item>

          {/* Category */}
          <Form.Item
            name="category"
            label="Select Category"
            rules={[{ required: true, message: "Please select a category" }]}
            className="md:col-span-1"
          >
            <Select placeholder="Video/Picture" className="h-12">
              {getCategories().map((category) => (
                <Option key={category} value={category}>
                  {category}
                </Option>
              ))}
            </Select>
          </Form.Item>

          {/* Time Duration */}
          <Form.Item
            name="timeDuration"
            label="Time Duration"
            rules={[{ required: true, message: "Please enter time duration" }]}
            className="md:col-span-1"
          >
            <Input placeholder="Enter Video Time Duration" className="h-12" />
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
                      className="flex items-center"
                    >
                      {equipment}
                    </Tag>
                  ))}
                </div>
              )}
            </div>
          </Form.Item>
        </div>

        {/* File Uploads */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          {/* Thumbnail Upload */}
          <Form.Item
            label="Upload Thumbnail"
            rules={[
              {
                required: !editingItem,
                message: "Please upload a thumbnail",
              },
            ]}
          >
            <Upload.Dragger {...thumbnailUploadProps} className="h-32">
              <div className="flex flex-col items-center justify-center h-full">
                <UploadOutlined className="text-4xl mb-2" />
                <p>Click or drag image to upload</p>
                <p className="text-gray-500 text-sm">Max size: 5MB</p>
                {editingItem && (
                  <p className="text-blue-500 text-xs">
                    Leave empty to keep existing thumbnail
                  </p>
                )}
              </div>
            </Upload.Dragger>
            <ThumbnailPreview />
          </Form.Item>

          {/* Video Upload */}
          <Form.Item
            label="Upload Video"
            rules={[
              {
                required: !editingItem,
                message: "Please upload a video",
              },
            ]}
          >
            <Upload.Dragger {...videoUploadProps} className="h-32">
              <div className="flex flex-col items-center justify-center h-full">
                <UploadOutlined className="text-4xl mb-2" />
                <p>Click or drag video to upload</p>
                <p className="text-gray-500 text-sm">Max size: 100MB</p>
                {editingItem && (
                  <p className="text-blue-500 text-xs">
                    Leave empty to keep existing video
                  </p>
                )}
              </div>
            </Upload.Dragger>
            <VideoPreview />
          </Form.Item>
        </div>

        {/* Description */}
        <Form.Item
          name="description"
          label="Write Video Description"
          rules={[
            { required: true, message: "Please enter video description" },
          ]}
          className="mt-4"
        >
          <TextArea
            rows={4}
            placeholder="Write Video Description"
            className="resize-none"
          />
        </Form.Item>

        {/* Form Actions */}
        <div className="flex justify-end gap-3 mt-6">
          <Button onClick={onClose} className="px-6">
            Cancel
          </Button>
          <Button
            type="primary"
            htmlType="submit"
            loading={loading || submitting}
            className="px-6 bg-red-600 hover:bg-red-700 border-red-600"
          >
            {editingItem ? "Update" : "Upload"}
          </Button>
        </div>
      </Form>
    </Modal>
  );
};

export default VideoFormModal;
