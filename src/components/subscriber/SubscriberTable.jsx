import React, { useState, useRef } from "react";
import JoditEditor from "jodit-react";
import { Button, Input, Form, message } from "antd";
import "./PushNotification.css";
import { usePushNotificationSendMutation } from "../../redux/apiSlices/pushNotification";

const PushNotification = () => {
  const editor = useRef(null);
  const [form] = Form.useForm();
  const [pushNotificationSend, { isLoading }] =
    usePushNotificationSendMutation();

  // Jodit editor configuration
  const config = {
    readonly: false,
    height: 300,
    buttons: [
      "source",
      "|",
      "bold",
      "italic",
      "underline",
      "|",
      "ul",
      "ol",
      "|",
      "font",
      "fontsize",
      "paragraph",
      "|",
      "image",
      "table",
      "link",
      "|",
      "left",
      "center",
      "right",
      "justify",
      "|",
      "undo",
      "redo",
      "|",
      "hr",
      "eraser",
      "fullsize",
    ],
    buttonsMD: [
      "bold",
      "italic",
      "underline",
      "|",
      "ul",
      "ol",
      "|",
      "image",
      "table",
      "link",
      "|",
      "left",
      "center",
      "right",
    ],
    buttonsSM: ["bold", "italic", "|", "ul", "ol", "|", "image", "link"],
    buttonsXS: ["bold", "image", "|", "ul", "ol"],
    uploader: {
      insertImageAsBase64URI: true,
    },
    toolbarAdaptive: true,
  };

  const handleSubmit = async (values) => {
    const notificationData = {
      title: values.title,
      message: values.message, 
      // receiver: values.receiver || "", 
    };


    try {
      const result = await pushNotificationSend(notificationData).unwrap();
      message.success("Notification sent successfully!");
      form.resetFields();
      if (editor.current) {
        editor.current.value = "";
      }
    } catch (error) {
      console.error("Error sending notification:", error);
      message.error("Failed to send notification. Please try again.");
    }
  };

  return (
    <div className="push-notification-container">
      <h1 className="font-bold mb-6">Send Push Notification</h1>

      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        <Form.Item
          label="Title"
          name="title"
          rules={[
            { required: true, message: "Please enter a notification title" },
          ]}
        >
          <Input placeholder="Write Your Title Here" />
        </Form.Item>

        {/* <Form.Item
          label="Receiver"
          name="receiver"
          rules={[
            { required: false }, 
          ]}
        >
          <Input placeholder="Enter receiver (optional)" />
        </Form.Item> */}

        <Form.Item
          label="Message"
          name="message"
          rules={[
            { required: true, message: "Please add notification content" },
          ]}
          getValueFromEvent={(_, editor) => editor?.value}
        >
          <JoditEditor
            ref={editor}
            config={config}
            onChange={(newContent) => {
              form.setFieldsValue({ message: newContent });
            }}
          />
        </Form.Item>

        <div className="button-group mt-20">
          <Button
            type="primary"
            htmlType="submit"
            className="send-button h-10 px-16"
            loading={isLoading}
          >
            Send
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default PushNotification;
