import React, { useState, useEffect } from "react";
import {
  Modal,
  Form,
  Input,
  Select,
  Tag,
  Button,
  message,
  Spin,
  Upload,
} from "antd";
import { LoadingOutlined, UploadOutlined } from "@ant-design/icons";

import {
  useAddVideoMutation,
  useUpdateVideoMutation,
} from "../../redux/apiSlices/videoApi";
import { useGetSingleSubCategoryQuery } from "../../redux/apiSlices/subCategoryApi";
import Spinner from "../common/Spinner";
import { getVideoAndThumbnail } from "../common/imageUrl";

const { Option } = Select;
const { TextArea } = Input;

const VideoFormModal = ({
  visible,
  onCancel,
  onSuccess,
  currentVideo,
  categories,
  selectedCategoryId,
  onCategoryChange,
  equipmentTags,
  setEquipmentTags,
}) => {
  const [form] = Form.useForm();
  const [thumbnailPath, setThumbnailPath] = useState("");
  const [videoPath, setVideoPath] = useState("");
  const [thumbnailPreview, setThumbnailPreview] = useState("");
  const [videoPreview, setVideoPreview] = useState("");
  const [videoDuration, setVideoDuration] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [videoFile, setVideoFile] = useState(null);
  const [localCategoryId, setLocalCategoryId] = useState(selectedCategoryId);

  // API hooks
  const [addVideo, { isLoading: isAdding }] = useAddVideoMutation();
  const [updateVideo, { isLoading: isUpdating }] = useUpdateVideoMutation();

  // Fetch subcategories based on selected category ID
  const { data: subCategoryData, isLoading: isLoadingSubCategories } =
    useGetSingleSubCategoryQuery(localCategoryId, {
      skip: !localCategoryId, // Skip the query if no category is selected
    });

  const subCategories = subCategoryData?.data || [];

  const isProcessing = isAdding || isUpdating || submitting;
  const isEditMode = !!currentVideo?._id; // Using _id instead of id

  // Initialize form when modal opens or currentVideo changes
  useEffect(() => {
    if (visible) {
      if (currentVideo) {
        console.log("Current video for editing:", currentVideo);

        // Find the category ID based on the category name
        const categoryObj = categories.find(
          (cat) => cat.name === currentVideo.category
        );

        const categoryId = categoryObj?._id;
        console.log(categoryId);

        // Set local category ID for fetching subcategories
        setLocalCategoryId(categoryId);

        // Properly notify parent component of category change
        if (categoryId) {
          onCategoryChange(categoryId);
        }

        // Find the subCategoryId based on the subCategory name
        const subCategoryObj = subCategories.find(
          (subCat) => subCat.name === currentVideo.subCategory
        );
        const subCategoryId = subCategoryObj?._id || ""; // Default to empty if not found

        // Set form values for edit mode
        form.setFieldsValue({
          title: currentVideo.title,
          category: categoryId, // Use category ID for the select
          subCategory: subCategoryId, // Set the subCategoryId here
          duration: currentVideo.duration || "",
          description: currentVideo.description || "",
        });

        // Set preview URLs for existing media
        setThumbnailPreview(currentVideo.thumbnailUrl || "");
        setVideoPreview(currentVideo.videoUrl || "");
        setVideoDuration(currentVideo.duration || "");
        setThumbnailPath(currentVideo.thumbnailUrl || "");
        setVideoPath(""); // Don't show video filename in edit mode
      } else {
        // Reset form for new video
        form.resetFields();
        setThumbnailPreview("");
        setVideoPreview("");
        setVideoDuration("");
        setThumbnailPath("");
        setVideoPath("");
        setThumbnailFile(null);
        setVideoFile(null);
        setLocalCategoryId(null);
      }
    }
  }, [
    visible,
    currentVideo,
    form,
    categories,
    subCategories,
    onCategoryChange,
  ]);

  // Update subCategory field when subCategories data is loaded
  useEffect(() => {
    if (isEditMode && currentVideo && subCategories.length > 0) {
      // If we're in edit mode and subcategories are loaded, set the subcategory value
      form.setFieldsValue({
        subCategory: currentVideo.subCategoryId,
      });
    }
  }, [subCategories, isEditMode, currentVideo, form]);

  // Clean up blob URLs when component unmounts to prevent memory leaks
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

  // Handle adding equipment tags
  const handleAddTag = (tag) => {
    if (tag && !equipmentTags.includes(tag)) {
      setEquipmentTags([...equipmentTags, tag]);
    }
  };

  // Handle thumbnail selection
  const handleThumbnailChange = (info) => {
    if (info.file) {
      // Store the file for form submission
      setThumbnailFile(info.file);

      // Clean up previous blob URL if exists
      if (thumbnailPreview && thumbnailPreview.startsWith("blob:")) {
        URL.revokeObjectURL(thumbnailPreview);
      }

      // Create a preview URL for the image
      const previewURL = URL.createObjectURL(info.file);
      setThumbnailPreview(previewURL);
      setThumbnailPath(info.file.name); // Just store filename for display
    }
  };

  // Handle video selection
  const handleVideoChange = (info) => {
    if (info.file) {
      // Store the file for form submission
      setVideoFile(info.file);

      // Clean up previous blob URL if exists
      if (videoPreview && videoPreview.startsWith("blob:")) {
        URL.revokeObjectURL(videoPreview);
      }

      // Create a preview URL for the video
      const previewURL = URL.createObjectURL(info.file);
      setVideoPreview(previewURL);
      setVideoPath(info.file.name); // Just store filename for display

      // Try to get video duration
      const video = document.createElement("video");
      video.preload = "metadata";
      video.onloadedmetadata = () => {
        const duration = Math.floor(video.duration);
        const minutes = Math.floor(duration / 60);
        const seconds = duration % 60;
        const formattedDuration = `${minutes}:${
          seconds < 10 ? "0" + seconds : seconds
        }`;
        setVideoDuration(formattedDuration);
        form.setFieldsValue({ duration: formattedDuration });
      };
      video.src = previewURL;
    }
  };

  // Handle category change to fetch subcategories
  const handleCategorySelectChange = (value) => {
    // Reset subCategory field when category changes
    form.setFieldsValue({ subCategory: undefined });

    // Update local category ID for fetching subcategories
    setLocalCategoryId(value);

    // Update selected category ID in parent component
    onCategoryChange(value);
  };

  // Handle form submission
const handleFormSubmit = async (values) => {
  try {
    setSubmitting(true);

    // Validate required files for new video
    if (!thumbnailFile && !isEditMode && !thumbnailPath) {
      message.error("Please select a thumbnail");
      setSubmitting(false);
      return;
    }

    if (!videoFile && !isEditMode && !videoPath) {
      message.error("Please select a video");
      setSubmitting(false);
      return;
    }

    // Format duration properly (ensure it has " Min" suffix if needed)
    const formattedDuration = values.duration.includes(" Min")
      ? values.duration
      : `${values.duration} Min`;

    // Find the category and subcategory names based on their IDs
    const selectedCategory = categories.find(
      (cat) => cat._id === values.category
    );
    const selectedSubCategory = subCategories.find(
      (subCat) => subCat._id === values.subCategory
    );

    console.log(selectedSubCategory);

    // Create video data object
    const videoData = {
      title: values.title,
      categoryId: values.category,
      category: selectedCategory?.name, // Send both ID and name for convenience
      subCategoryId: values.subCategory,
      subCategory: selectedSubCategory?.name, // Send both ID and name
      duration: formattedDuration,
      description: values.description || "",
      equipment: equipmentTags,
      uploadDate: currentVideo?.uploadDate || new Date().toLocaleDateString(),
    };

    // In edit mode, add ID to data object - use _id consistently
    if (isEditMode && currentVideo?._id) {
      videoData.id = currentVideo._id; // Ensure the ID is set
    }

    // Create a new FormData object
    const formDataToSend = new FormData();

    // Append video data as JSON string
    formDataToSend.append("data", JSON.stringify(videoData));

    // Append files if they exist
    if (thumbnailFile) {
      formDataToSend.append("thumbnail", thumbnailFile);
    }

    if (videoFile) {
      formDataToSend.append("video", videoFile);
    }

    // For debugging - log what's being sent
    console.log("Video data being sent:", videoData);

    // Send request to API
    const response = isEditMode
      ? await updateVideo({
          id: currentVideo._id, // Pass the ID as part of the request
          videoData: formDataToSend, // Pass the video data
        }).unwrap()
      : await addVideo(formDataToSend).unwrap();

    console.log("Server response:", response);
    message.success(`Video ${isEditMode ? "updated" : "added"} successfully`);

    // Close modal and refresh video list
    onSuccess();
    onCancel();
  } catch (error) {
    console.error("Error submitting video:", error);
    message.error(
      `Failed to ${isEditMode ? "update" : "add"} video: ${
        error.data?.message || error.message || "Unknown error"
      }`
    );
  } finally {
    setSubmitting(false);
  }
};



  // Upload props configuration
  const thumbnailUploadProps = {
    beforeUpload: (file) => {
      // Check if file is an image
      const isImage = file.type.startsWith("image/");
      if (!isImage) {
        message.error("You can only upload image files!");
        return Upload.LIST_IGNORE;
      }

      // Check file size (optional)
      const isLessThan2MB = file.size / 1024 / 1024 < 2;
      if (!isLessThan2MB) {
        message.error("Image must be smaller than 2MB.");
        return Upload.LIST_IGNORE;
      }

      handleThumbnailChange({ file });
      return false; // Prevent automatic upload
    },
    showUploadList: false,
  };

  const videoUploadProps = {
    beforeUpload: (file) => {
      // Check if file is a video
      const isVideo = file.type.startsWith("video/");
      if (!isVideo) {
        message.error("You can only upload video files!");
        return Upload.LIST_IGNORE;
      }

      // Check file size (optional)
      const isLessThan100MB = file.size / 1024 / 1024 < 100;
      if (!isLessThan100MB) {
        message.error("Video must be smaller than 100MB.");
        return Upload.LIST_IGNORE;
      }

      handleVideoChange({ file });
      return false; // Prevent automatic upload
    },
    showUploadList: false,
  };

  if (isLoadingSubCategories) return <Spinner />;

  return (
    <Modal
      title={isEditMode ? "Edit Video" : "Add New Video"}
      visible={visible}
      onCancel={onCancel}
      footer={null}
      width={1000}
      destroyOnClose
      closable={!isProcessing}
      maskClosable={!isProcessing}
    >
      <Spin
        spinning={isProcessing}
        indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />}
        tip={isEditMode ? "Updating video..." : "Adding new video..."}
      >
        <Form form={form} layout="vertical" onFinish={handleFormSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="col-span-1">
              <Form.Item
                label="Title"
                name="title"
                rules={[
                  { required: true, message: "Please enter video title" },
                ]}
              >
                <Input placeholder="Enter Video Title" className="py-3" />
              </Form.Item>
            </div>

            <div className="col-span-1">
              <Form.Item
                label="Category"
                name="category"
                rules={[{ required: true, message: "Please select category" }]}
              >
                <Select
                  placeholder="Select Category"
                  onChange={handleCategorySelectChange}
                  loading={!categories}
                >
                  {categories?.map((cat) => (
                    <Option key={cat._id} value={cat._id}>
                      {cat.name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </div>

            <div className="col-span-1">
              <Form.Item
                label="Sub Category"
                name="subCategory"
                rules={[
                  { required: true, message: "Please select sub category" },
                ]}
              >
                <Select
                  placeholder="Select Sub Category"
                  loading={isLoadingSubCategories}
                  disabled={!localCategoryId || isLoadingSubCategories}
                >
                  {subCategories?.map((subCat) => (
                    <Option key={subCat._id} value={subCat._id}>
                      {subCat.name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="col-span-1">
              <Form.Item
                label="Duration"
                name="duration"
                rules={[{ required: true, message: "Please enter duration" }]}
              >
                <Input placeholder="Video Duration (MM:SS)" className="py-3" />
              </Form.Item>
            </div>

            <div className="col-span-2">
              <Form.Item label="Equipment" name="equipment">
                <div className="border border-gray-300 rounded-md p-2 min-h-[40px]">
                  {equipmentTags.map((tag) => (
                    <Tag
                      key={tag}
                      color="error"
                      closable
                      className="mb-1 mr-1"
                      onClose={() => {
                        setEquipmentTags(
                          equipmentTags.filter((t) => t !== tag)
                        );
                      }}
                    >
                      {tag}
                    </Tag>
                  ))}
                  <Input
                    className="border-none outline-none p-0 w-24"
                    placeholder="Add tag"
                    onPressEnter={(e) => {
                      e.preventDefault();
                      handleAddTag(e.target.value);
                      e.target.value = "";
                    }}
                    onBlur={(e) => {
                      if (e.target.value) {
                        handleAddTag(e.target.value);
                        e.target.value = "";
                      }
                    }}
                  />
                </div>
              </Form.Item>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
            <div>
              <div className="mb-2 font-medium">Select Thumbnail</div>
              <div className="flex flex-col items-center border-2 border-dashed border-gray-300 rounded-lg p-4">
                {thumbnailPreview ? (
                  <div className="mb-3">
                    <img
                      src={getVideoAndThumbnail(thumbnailPreview)}
                      alt="Thumbnail preview"
                      style={{
                        width: "100%",
                        maxHeight: "150px",
                        objectFit: "contain",
                      }}
                    />
                  </div>
                ) : null}

                <Upload {...thumbnailUploadProps}>
                  <Button icon={<UploadOutlined />} disabled={isProcessing}>
                    {thumbnailPreview ? "Change Thumbnail" : "Select Thumbnail"}
                  </Button>
                </Upload>
                {thumbnailPath && !isEditMode && (
                  <div className="mt-2 text-xs text-gray-500">
                    Selected: {thumbnailPath}
                  </div>
                )}
              </div>
            </div>

            <div>
              <div className="mb-2 font-medium">Select Video</div>
              <div className="flex flex-col items-center border-2 border-dashed border-gray-300 rounded-lg p-4">
                {videoPreview ? (
                  <div className="mb-3">
                    <video
                      src={videoPreview}
                      controls
                      style={{ width: "100%", maxHeight: "180px" }}
                    />
                  </div>
                ) : null}

                <Upload {...videoUploadProps}>
                  <Button icon={<UploadOutlined />} disabled={isProcessing}>
                    {videoPreview ? "Change Video" : "Select Video"}
                  </Button>
                </Upload>
                {videoPath && !isEditMode && (
                  <div className="mt-2 text-xs text-gray-500">
                    Selected: {videoPath}
                  </div>
                )}
              </div>
            </div>
          </div>

          <Form.Item
            label="Video Description"
            name="description"
            className="mt-4"
          >
            <TextArea rows={4} placeholder="Enter video description here" />
          </Form.Item>

          <Form.Item className="flex justify-end mt-4">
            <Button onClick={onCancel} disabled={isProcessing} className="mr-2">
              Cancel
            </Button>
            <Button
              type="primary"
              danger
              htmlType="submit"
              loading={isProcessing}
              disabled={isProcessing}
            >
              {isEditMode ? "Update Video" : "Add Video"}
            </Button>
          </Form.Item>
        </Form>
      </Spin>
    </Modal>
  );
};

export default VideoFormModal;
