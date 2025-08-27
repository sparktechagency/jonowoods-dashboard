import React, { useState, useEffect } from "react";
import {
  Modal,
  Form,
  Input,
  Button,
  message,
} from "antd";
import { useUpdateVideoINCategoryAndSubcategoryMutation } from "../../redux/apiSlices/videoApi";

const { TextArea } = Input;

const EditVideoModal = ({
  visible,
  onCancel,
  onSuccess,
  currentVideo,
}) => {
  const [form] = Form.useForm();
  const [updateVideoINCategoryAndSubcategory, { isLoading }] = useUpdateVideoINCategoryAndSubcategoryMutation();

  // Initialize form data when modal opens or currentVideo changes
  useEffect(() => {
    if (visible && currentVideo) {
      form.setFieldsValue({
        title: currentVideo.title || "",
        description: currentVideo.description || "",
      });
    } else if (visible) {
      form.resetFields();
    }
  }, [visible, currentVideo, form]);

  // Submit handler
  const handleSubmit = async (values) => {
    try {
      if (!currentVideo?._id) {
        message.error("Video ID is missing");
        return;
      }

      const updateData = {
        title: values.title,
        description: values.description,
      };

      await updateVideoINCategoryAndSubcategory({
        id: currentVideo._id,
        updateData,
      }).unwrap();

      message.success("Video updated successfully");
      onSuccess();
      onCancel();
    } catch (error) {
      console.error("Update error:", error);
      message.error("Failed to update video");
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
          rules={[{ required: true, message: "Please enter title" }]}
        >
          <Input placeholder="Video Title" className="py-3" />
        </Form.Item>

        <Form.Item
          label="Description"
          name="description"
          rules={[{ required: true, message: "Please enter description" }]}
        >
          <TextArea rows={4} placeholder="Video description" />
        </Form.Item>

        <div className="flex justify-end gap-4 mt-6">
          <Button
            onClick={onCancel}
            disabled={isLoading}
            className="py-2 px-6"
          >
            Cancel
          </Button>
          <Button
            type="primary"
            htmlType="submit"
            loading={isLoading}
            className="bg-primary py-2 px-6"
          >
            Update Video
          </Button>
        </div>
      </Form>
    </Modal>
  );
};

export default EditVideoModal;