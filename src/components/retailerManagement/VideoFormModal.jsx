import React, { useState, useEffect, useCallback } from "react";
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

  // State management
  const [thumbnailPath, setThumbnailPath] = useState("");
  const [videoPath, setVideoPath] = useState("");
  const [thumbnailPreview, setThumbnailPreview] = useState("");
  const [videoPreview, setVideoPreview] = useState("");
  const [videoDuration, setVideoDuration] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [videoFile, setVideoFile] = useState(null);
  const [localCategoryId, setLocalCategoryId] = useState(null);
  const [tagInputValue, setTagInputValue] = useState(""); // New state for tag input

  // API hooks
  const [addVideo, { isLoading: isAdding }] = useAddVideoMutation();
  const [updateVideo, { isLoading: isUpdating }] = useUpdateVideoMutation();

  // Fetch subcategories based on selected category ID
  const { data: subCategoryData, isLoading: isLoadingSubCategories } =
    useGetSingleSubCategoryQuery(localCategoryId, {
      skip: !localCategoryId,
    });

  const subCategories = subCategoryData?.data || [];
  const isProcessing = isAdding || isUpdating || submitting;
  const isEditMode = !!currentVideo?._id;

  // Initialize form when modal opens
  useEffect(() => {
    if (visible) {
      if (currentVideo) {
        const categoryObj = categories?.find(
          (cat) => cat.name === currentVideo.category
        );
        const categoryId = categoryObj?._id;
        setLocalCategoryId(categoryId);

        form.setFieldsValue({
          title: currentVideo.title,
          category: categoryId,
          duration: currentVideo.duration || "",
          description: currentVideo.description || "",
        });

        // Set preview URLs for existing media - Use getVideoAndThumbnail for server URLs
        setThumbnailPreview(currentVideo.thumbnailUrl || "");
        setVideoPreview(currentVideo.videoUrl || "");
        setVideoDuration(currentVideo.duration || "");
        setThumbnailPath(currentVideo.thumbnailUrl || "");
        setVideoPath("");
        setThumbnailFile(null);
        setVideoFile(null);

        if (categoryId && onCategoryChange) {
          onCategoryChange(categoryId);
        }
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
        setTagInputValue("");
      }
    }
  }, [visible, currentVideo, form, categories, onCategoryChange]);

  useEffect(() => {
    if (isEditMode && currentVideo && subCategories.length > 0) {
      const subCategoryObj = subCategories.find(
        (subCat) => subCat.name === currentVideo.subCategory
      );
      if (subCategoryObj) {
        form.setFieldsValue({
          subCategory: subCategoryObj._id,
        });
      }
    }
  }, [subCategories, isEditMode, currentVideo, form]);

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
  const handleAddTag = useCallback(
    (tag) => {
      const trimmedTag = tag.trim();
      if (trimmedTag && !equipmentTags.includes(trimmedTag)) {
        setEquipmentTags([...equipmentTags, trimmedTag]);
      }
      setTagInputValue(""); // Clear input after adding tag
    },
    [equipmentTags, setEquipmentTags]
  );

  // Handle tag input change
  const handleTagInputChange = useCallback((e) => {
    setTagInputValue(e.target.value);
  }, []);

  // Handle tag input - Prevent form submission on Enter
  const handleTagInputKeyDown = useCallback(
    (e) => {
      // Prevent form submission on Enter
      if (e.key === "Enter") {
        e.preventDefault();
        e.stopPropagation();
        const value = tagInputValue.trim();
        if (value) {
          handleAddTag(value);
        }
        return false; // Ensure no form submission
      }
    },
    [tagInputValue, handleAddTag]
  );

  const handleEquipmentKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addEquipment();
    }
  };

  // Handle tag input blur
  const handleTagInputBlur = useCallback(() => {
    const value = tagInputValue.trim();
    if (value) {
      handleAddTag(value);
    }
  }, [tagInputValue, handleAddTag]);

  // Handle thumbnail selection - FIXED VERSION
  const handleThumbnailChange = useCallback(
    (info) => {
      if (info.file) {
        setThumbnailFile(info.file);

        // Clean up previous blob URL if exists
        if (thumbnailPreview && thumbnailPreview.startsWith("blob:")) {
          URL.revokeObjectURL(thumbnailPreview);
        }

        // Create a preview URL for the image
        const previewURL = URL.createObjectURL(info.file);
        setThumbnailPreview(previewURL);
        setThumbnailPath(info.file.name);
      }
    },
    [thumbnailPreview]
  );

  // Handle video selection - FIXED VERSION
  const handleVideoChange = useCallback(
    (info) => {
      if (info.file) {
        setVideoFile(info.file);

        // Clean up previous blob URL if exists
        if (videoPreview && videoPreview.startsWith("blob:")) {
          URL.revokeObjectURL(videoPreview);
        }

        // Create a preview URL for the video
        const previewURL = URL.createObjectURL(info.file);
        setVideoPreview(previewURL);
        setVideoPath(info.file.name);

        // Try to get video duration
        const video = document.createElement("video");
        video.preload = "metadata";
        video.onloadedmetadata = () => {
          try {
            const duration = Math.floor(video.duration);
            const minutes = Math.floor(duration / 60);
            const seconds = duration % 60;
            const formattedDuration = `${minutes}:${
              seconds < 10 ? "0" + seconds : seconds
            }`;
            setVideoDuration(formattedDuration);
            form.setFieldsValue({ duration: formattedDuration });
          } catch (error) {
            console.warn("Could not extract video duration:", error);
          }
        };
        video.onerror = () => {
          console.warn("Could not load video metadata");
        };
        video.src = previewURL;
      }
    },
    [videoPreview, form]
  );

  // Handle category change - Fixed to prevent reload
  const handleCategorySelectChange = useCallback(
    (value) => {
      // Prevent unnecessary updates
      if (value !== localCategoryId) {
        // Clear subcategory selection when category changes
        form.setFieldsValue({ subCategory: undefined });
        setLocalCategoryId(value);

        // Call parent handler if provided
        if (onCategoryChange) {
          onCategoryChange(value);
        }
      }
    },
    [localCategoryId, form, onCategoryChange]
  );

  // Handle form submission
  const handleFormSubmit = useCallback(
    async (values) => {
      try {
        setSubmitting(true);

        // Validate required files for new video
        if (!thumbnailFile && !isEditMode && !thumbnailPath) {
          message.error("Please select a thumbnail");
          return;
        }

        if (!videoFile && !isEditMode && !videoPath) {
          message.error("Please select a video");
          return;
        }

        // Format duration properly
        const formattedDuration = values.duration.includes(" Min")
          ? values.duration
          : `${values.duration} Min`;

        // Find the category and subcategory names based on their IDs
        const selectedCategory = categories?.find(
          (cat) => cat._id === values.category
        );
        const selectedSubCategory = subCategories?.find(
          (subCat) => subCat._id === values.subCategory
        );

        // Create video data object
        const videoData = {
          title: values.title,
          categoryId: values.category,
          category: selectedCategory?.name,
          subCategoryId: values.subCategory,
          subCategory: selectedSubCategory?.name,
          duration: formattedDuration,
          description: values.description || "",
          equipment: equipmentTags,
          uploadDate:
            currentVideo?.uploadDate || new Date().toLocaleDateString(),
        };

        // In edit mode, add ID to data object
        if (isEditMode && currentVideo?._id) {
          videoData.id = currentVideo._id;
        }

        // Create FormData
        const formDataToSend = new FormData();
        formDataToSend.append("data", JSON.stringify(videoData));

        // Append files if they exist
        if (thumbnailFile) {
          formDataToSend.append("thumbnail", thumbnailFile);
        }

        if (videoFile) {
          formDataToSend.append("video", videoFile);
        }

        // Send request to API
        const response = isEditMode
          ? await updateVideo({
              id: currentVideo._id,
              videoData: formDataToSend,
            }).unwrap()
          : await addVideo(formDataToSend).unwrap();

        message.success(
          `Video ${isEditMode ? "updated" : "added"} successfully`
        );

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
    },
    [
      thumbnailFile,
      isEditMode,
      thumbnailPath,
      videoFile,
      videoPath,
      categories,
      subCategories,
      equipmentTags,
      currentVideo,
      updateVideo,
      addVideo,
      onSuccess,
      onCancel,
    ]
  );

  // Prevent form submission on Enter key
  const handleFormKeyDown = useCallback((e) => {
    if (e.key === "Enter") {
      // Allow Enter only for textarea elements
      if (e.target.tagName !== "TEXTAREA") {
        e.preventDefault();
        e.stopPropagation();
        return false;
      }
    }
  }, []);

  // Upload props configuration
  const thumbnailUploadProps = {
    beforeUpload: (file) => {
      const isImage = file.type.startsWith("image/");
      if (!isImage) {
        message.error("You can only upload image files!");
        return Upload.LIST_IGNORE;
      }

      const isLessThan20MB = file.size / 1024 / 1024 < 20;
      if (!isLessThan20MB) {
        message.error("Image must be smaller than 20MB.");
        return Upload.LIST_IGNORE;
      }

      handleThumbnailChange({ file });
      return false;
    },
    showUploadList: false,
  };

  const videoUploadProps = {
    beforeUpload: (file) => {
      const isVideo = file.type.startsWith("video/");
      if (!isVideo) {
        message.error("You can only upload video files!");
        return Upload.LIST_IGNORE;
      }

      const isLessThan2000MB = file.size / 1024 / 1024 < 2000;
      if (!isLessThan2000MB) {
        message.error("Video must be smaller than 2000MB.");
        return Upload.LIST_IGNORE;
      }

      handleVideoChange({ file });
      return false;
    },
    showUploadList: false,
  };

  // Helper function to get the correct preview URL
  const getPreviewUrl = (url, isBlob = false) => {
    if (!url) return "";

    // If it's a blob URL (newly selected file), return as is
    if (url.startsWith("blob:")) {
      return url;
    }

    // If it's a server URL (existing file), use getVideoAndThumbnail
    return getVideoAndThumbnail(url);
  };

  if (isLoadingSubCategories) return <Spinner />;

  return (
    <Modal
      title={isEditMode ? "Edit Video" : "Add New Video"}
      open={visible}
      onCancel={onCancel}
      footer={null}
      width={1000}
      destroyOnClose
      closable={!isProcessing}
      maskClosable={!isProcessing}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleFormSubmit}
        preserve={false}
        onKeyDown={handleFormKeyDown}
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="col-span-1">
            <Form.Item
              label="Title"
              name="title"
              rules={[{ required: true, message: "Please enter video title" }]}
            >
              <Input
                placeholder="Enter Video Title"
                className="py-3"
                onPressEnter={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                }}
              />
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
                value={localCategoryId}
                loading={!categories || categories.length === 0}
                notFoundContent={
                  !categories || categories.length === 0 ? (
                    <div className="text-center py-2">
                      <Spin size="small" />
                      <div className="mt-1">Loading categories...</div>
                    </div>
                  ) : (
                    "No categories found"
                  )
                }
                getPopupContainer={(trigger) => trigger.parentElement}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    e.stopPropagation();
                  }
                }}
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
                notFoundContent={
                  isLoadingSubCategories ? (
                    <div className="text-center py-2">
                      <Spin size="small" />
                      <div className="mt-1">Loading subcategories...</div>
                    </div>
                  ) : !localCategoryId ? (
                    "Please select a category first"
                  ) : (
                    "No subcategories found"
                  )
                }
                getPopupContainer={(trigger) => trigger.parentElement}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    e.stopPropagation();
                  }
                }}
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
              <Input
                placeholder="Video Duration (MM:SS)"
                className="py-3"
                onPressEnter={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                }}
              />
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
                      setEquipmentTags(equipmentTags.filter((t) => t !== tag));
                    }}
                  >
                    {tag}
                  </Tag>
                ))}
                <Input
                  className="border-none outline-none p-0 w-24"
                  placeholder="Add tag"
                  value={tagInputValue}
                  onChange={handleTagInputChange}
                  onKeyDown={handleTagInputKeyDown}
                  onBlur={handleTagInputBlur}
                  onPressEnter={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
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
                    src={getPreviewUrl(thumbnailPreview)}
                    alt="Thumbnail preview"
                    style={{
                      width: "100%",
                      maxHeight: "180px",
                      objectFit: "contain",
                    }}
                    onError={(e) => {
                      console.log("Thumbnail preview error:", e);
                      // Fallback: try direct URL without getVideoAndThumbnail
                      if (!e.target.src.startsWith("blob:")) {
                        e.target.src = thumbnailPreview;
                      }
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
                    src={getPreviewUrl(videoPreview)}
                    controls
                    style={{ width: "100%", maxHeight: "180px" }}
                    onError={(e) => {
                      console.log("Video preview error:", e);
                      // Fallback: try direct URL without getVideoAndThumbnail
                      if (!e.target.src.startsWith("blob:")) {
                        e.target.src = videoPreview;
                      }
                    }}
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
          <TextArea
            rows={4}
            placeholder="Enter video description here"
            onPressEnter={(e) => {
              // Allow Enter in textarea but prevent form submission
              e.stopPropagation();
            }}
          />
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
    </Modal>
  );
};

export default VideoFormModal;
