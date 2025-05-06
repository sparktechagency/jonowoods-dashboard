import React, { useState } from "react";
import { message } from "antd";
import {
  useAddVideoMutation,
  useUpdateVideoMutation,
} from "../../redux/apiSlices/videoApi";
import VideoFormModal from "./VideoFormModal";

const VideoFormLogic = ({
  visible,
  onCancel,
  onSuccess,
  currentVideo,
  categories,
  initialCategoryId = "",
}) => {
  // State for equipment tags
  const [equipmentTags, setEquipmentTags] = useState(
    currentVideo?.equipment || []
  );

  // State for selected category ID
  const [selectedCategoryId, setSelectedCategoryId] =
    useState(initialCategoryId);

  // API hooks
  const [addVideo, { isLoading: isAdding }] = useAddVideoMutation();
  const [updateVideo, { isLoading: isUpdating }] = useUpdateVideoMutation();

  // Handle category change
  const handleCategoryChange = (categoryId) => {
    setSelectedCategoryId(categoryId);
  };

  // Handle form submission
  const handleFormSubmit = async (values) => {
    try {
      const submitting = true;

      // Validate required files for new video
      if (!values.thumbnailFile && !isEditMode && !values.thumbnailPath) {
        message.error("Please select a thumbnail");
        return;
      }

      if (!values.videoFile && !isEditMode && !values.videoPath) {
        message.error("Please select a video");
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
      const selectedSubCategory = values.subCategories.find(
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
        uploadDate: currentVideo?.uploadDate || new Date().toLocaleDateString(),
      };

      // In edit mode, add ID to data object
      const isEditMode = !!currentVideo?.id;
      if (isEditMode && currentVideo?.id) {
        videoData.id = currentVideo.id;
      }

      // Create a new FormData object
      const formDataToSend = new FormData();

      // Append video data as JSON string
      formDataToSend.append("data", JSON.stringify(videoData));

      // Append files if they exist
      if (values.thumbnailFile) {
        formDataToSend.append("thumbnail", values.thumbnailFile);
      }

      if (values.videoFile) {
        formDataToSend.append("video", values.videoFile);
      }

      // For debugging - log what's being sent
      console.log("Video data being sent:", videoData);

      // Send request to API
      const response = isEditMode
        ? await updateVideo(formDataToSend).unwrap()
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
    }
  };

  return (
    <VideoFormModal
      visible={visible}
      onCancel={onCancel}
      onSuccess={onSuccess}
      currentVideo={currentVideo}
      categories={categories}
      selectedCategoryId={selectedCategoryId}
      onCategoryChange={handleCategoryChange}
      equipmentTags={equipmentTags}
      setEquipmentTags={setEquipmentTags}
      handleFormSubmit={handleFormSubmit}
      isAdding={isAdding}
      isUpdating={isUpdating}
    />
  );
};

export default VideoFormLogic;
