import React, { useState, useEffect } from "react";
import { Card, Button, Modal, Form, Input, message } from "antd";
import { EditOutlined } from "@ant-design/icons";
import Spinner from "../../components/common/Spinner";
import GradientButton from "../../components/common/GradiantButton";
import {
  useGetGreetingMessageQuery,
  useGreetingMessageSendMutation,
} from "../../redux/apiSlices/greetingMessageApi";

const { TextArea } = Input;

const GreetingMessage = () => {
  const [form] = Form.useForm();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [greetingText, setGreetingText] = useState("");

  const { data, isLoading, isError, refetch } = useGetGreetingMessageQuery();
  const [greetingMessageSend, { isLoading: isUpdating }] =
    useGreetingMessageSendMutation();

  const greetingData = data?.data;

  useEffect(() => {
    if (greetingData?.greeting) {
      setGreetingText(greetingData.greeting);
    }
  }, [greetingData]);

  const showModal = () => {
    form.setFieldsValue({ greeting: greetingText });
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    form.resetFields();
    setIsModalOpen(false);
  };

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      const payload = { greeting: values.greeting };
      
      await greetingMessageSend(payload).unwrap();
      message.success("Greeting message updated successfully!");
      setIsModalOpen(false);
      refetch(); // Refresh the data
    } catch (error) {
      console.error("Error updating greeting message:", error);
      message.error("Failed to update greeting message. Please try again.");
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Spinner />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-red-500">Failed to load greeting message.</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold">Greeting Message</h2>
        <Button
          type="primary"
          icon={<EditOutlined />}
          onClick={showModal}
          className="bg-primary"
          size="large"
        >
          Edit
        </Button>
      </div>

      <Card className="shadow-md">
        <div className="p-6">
          <p className="text-lg text-gray-700 whitespace-pre-wrap">
            {greetingText || "No greeting message set."}
          </p>
        </div>
      </Card>

      <Modal
        title="Edit Greeting Message"
        open={isModalOpen}
        onCancel={handleCancel}
        width={600}
        footer={[
          <Button
            key="cancel"
            onClick={handleCancel}
            className="py-5 mr-2 text-white bg-red-500"
            disabled={isUpdating}
          >
            Cancel
          </Button>,
          <GradientButton
            key="submit"
            onClick={handleOk}
            className="text-white bg-secondary"
            disabled={isUpdating}
          >
            {isUpdating ? "Updating..." : "Update Greeting Message"}
          </GradientButton>,
        ]}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            label="Greeting Message"
            name="greeting"
            rules={[
              { required: true, message: "Please enter a greeting message" },
            ]}
          >
            <TextArea
              placeholder="Enter your greeting message here..."
              rows={6}
              showCount
              maxLength={500}
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default GreetingMessage;