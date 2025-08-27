import React, { useState, useEffect } from "react";
import {
  Modal,
  Form,
  Input,
  Button,
  message,
} from "antd";
import {
  useUpdateVideoINCategoryAndSubcategoryMutation,
} from "../../../redux/apiSlices/videoApi";

const { TextArea } = Input;

const VideoEditModal = ({
  visible,
  onCancel,
  onSuccess,
  currentVideo,
}) => {
  const [form] = Form.useForm();
  const [updateVideo, { isLoading }] = useUpdateVideoINCategoryAndSubcategoryMutation();

  const isEditMode = !!currentVideo?._id;

  // Initialize form data on modal open or currentVideo change
  useEffect(() => {
    if (visible && currentVideo) {
      form.setFieldsValue({
        title: currentVideo.title,
        description: currentVideo.description || "",
      });
    } else if (visible) {
      form.resetFields();
    }
  }, [visible, currentVideo, form]);

  const handleSubmit = async (values) => {
    if (!isEditMode) {
      message.error("No video selected for editing");
      return;
    }

    try {
      const updateData = {
        title: values.title,
        description: values.description,
      };

      await updateVideo({
        id: currentVideo._id,
        updateData: updateData,
      }).unwrap();

      message.success("Video updated successfully");
      onSuccess();
      onCancel();
    } catch (error) {
      console.error("Error updating video:", error);
      
      if (error.data) {
        console.error("Server error response:", error.data);
        console.error("Server error message:", error.data.message);
      }

      const errorMessage =
        error.data?.message || error.message || "Unknown error";
      message.error(`Failed to update video: ${errorMessage}`);
    }
  };

  return (
    <Modal
      title="Edit Video"
      open={visible}
      onCancel={onCancel}
      footer={null}
      width={600}
      destroyOnClose
    >
      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        <Form.Item
          label="Title"
          name="title"
          rules={[{ required: true, message: "Please enter video title" }]}
        >
          <Input placeholder="Video Title" className="py-3" />
        </Form.Item>

        <Form.Item
          label="Description"
          name="description"
          rules={[{ required: true, message: "Please enter video description" }]}
        >
          <TextArea
            placeholder="Video Description"
            rows={4}
            className="py-2"
          />
        </Form.Item>

        <div className="flex justify-end space-x-2 mt-6">
          <Button onClick={onCancel} className="px-6">
            Cancel
          </Button>
          <Button
            type="primary"
            htmlType="submit"
            loading={isLoading}
            className="bg-red-500 hover:bg-red-600 px-6"
          >
            Update Video
          </Button>
        </div>
      </Form>
    </Modal>
  );
};

export default VideoEditModal;