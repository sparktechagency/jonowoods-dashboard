import React, { useState, useRef } from "react";
import JoditEditor from "jodit-react";
import { Button, Input, Form, message } from "antd";
import "./PushNotification.css";

const PushNotification = () => {
  const editor = useRef(null);
  const [form] = Form.useForm();

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

  const handleSubmit = (values) => {
    console.log("Form values:", values);

    // No need to manually add body since it's now properly connected to the form
    const notificationData = {
      ...values,
    };
    console.log("Sending notification:", notificationData);

    // Simulating an API call for sending notification
    setTimeout(() => {
      // Success message
      message.success("Notification sent successfully!");

      // Clear form and text editor after successful submission
      form.resetFields();
    }, 1000);
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

        <Form.Item
          label="Type"
          name="type"
          rules={[
            { required: true, message: "Please select a notification type" },
          ]}
        >
          <Input placeholder="Write Notification Type" />
        </Form.Item>

        <Form.Item
          label="Body"
          name="body"
          rules={[
            { required: true, message: "Please add notification content" },
          ]}
          // This is the key fix - we need to provide getValueFromEvent to connect
          // the Jodit editor with the form
          getValueFromEvent={(_, editor) => editor?.value}
        >
          <JoditEditor
            ref={editor}
            config={config}
            onChange={(newContent) => {
              // This will trigger form validation and update
              form.setFieldsValue({ body: newContent });
            }}
          />
        </Form.Item>

        <div className="button-group mt-20">
         
          <Button type="primary" htmlType="submit" className="send-button h-10 px-16">
            Send
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default PushNotification;
