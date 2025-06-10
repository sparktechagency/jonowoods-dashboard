import React, { useState, useRef } from "react";
import JoditEditor from "jodit-react";
import {
  Button,
  Input,
  Form,
  message,
  DatePicker,
  TimePicker,
  Switch,
  Space,
  Card,
} from "antd";
import { ClockCircleOutlined, SendOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import "./PushNotification.css";
import { usePushNotificationSendMutation } from "../../redux/apiSlices/pushNotification";

const PushNotification = () => {
  const editor = useRef(null);
  const [form] = Form.useForm();
  const [isScheduled, setIsScheduled] = useState(false);
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
    let scheduledDateTime = null;

    // If scheduling is enabled, combine date and time
    if (isScheduled && values.scheduleDate && values.scheduleTime) {
      const date = dayjs(values.scheduleDate);
      const time = dayjs(values.scheduleTime);

      scheduledDateTime = date
        .hour(time.hour())
        .minute(time.minute())
        .second(0)
        .millisecond(0);

      // Check if scheduled time is in the future
      if (scheduledDateTime.isBefore(dayjs())) {
        message.error("Scheduled time must be in the future!");
        return;
      }
    }

    const notificationData = {
      title: values.title,
      message: values.message,
      isScheduled: isScheduled,
      scheduledAt: scheduledDateTime ? scheduledDateTime.toISOString() : null,
      // receiver: values.receiver || "",
    };

    try {
      const result = await pushNotificationSend(notificationData).unwrap();

      if (isScheduled) {
        message.success(
          `Notification scheduled successfully for ${scheduledDateTime.format(
            "MMMM D, YYYY at h:mm A"
          )}!`
        );
      } else {
        message.success("Notification sent successfully!");
      }

      form.resetFields();
      setIsScheduled(false);
      if (editor.current) {
        editor.current.value = "";
      }
    } catch (error) {
      console.error("Error sending notification:", error);
      message.error(
        isScheduled
          ? "Failed to schedule notification. Please try again."
          : "Failed to send notification. Please try again."
      );
    }
  };

  const handleScheduleToggle = (checked) => {
    setIsScheduled(checked);
    if (!checked) {
      // Clear schedule fields when disabled
      form.setFieldsValue({
        scheduleDate: null,
        scheduleTime: null,
      });
    }
  };

  // Disable past dates
  const disabledDate = (current) => {
    return current && current < dayjs().startOf("day");
  };

  // Disable past times for today
  const disabledTime = (current) => {
    if (!current) return {};

    const now = dayjs();
    const selectedDate = dayjs(current);

    if (selectedDate.isSame(now, "day")) {
      return {
        disabledHours: () => {
          const hours = [];
          for (let i = 0; i < now.hour(); i++) {
            hours.push(i);
          }
          return hours;
        },
        disabledMinutes: (selectedHour) => {
          if (selectedHour === now.hour()) {
            const minutes = [];
            for (let i = 0; i <= now.minute(); i++) {
              minutes.push(i);
            }
            return minutes;
          }
          return [];
        },
      };
    }
    return {};
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

        {/* Scheduling Section */}
        <Card
          title={
            <Space>
              <ClockCircleOutlined />
              Schedule Notification
            </Space>
          }
          className="mb-4"
        >
          <Form.Item
            label="Enable Scheduling"
            name="enableSchedule"
            valuePropName="checked"
          >
            <Switch
              checked={isScheduled}
              onChange={handleScheduleToggle}
              checkedChildren="Scheduled"
              unCheckedChildren="Send Now"
            />
          </Form.Item>

          {isScheduled && (
            <Space size="middle" className="w-full" wrap>
              <Form.Item
                label="Schedule Date"
                name="scheduleDate"
                rules={[
                  { required: isScheduled, message: "Please select a date" },
                ]}
              >
                <DatePicker
                  placeholder="Select Date"
                  disabledDate={disabledDate}
                  format="MMMM D, YYYY"
                />
              </Form.Item>

              <Form.Item
                label="Schedule Time"
                name="scheduleTime"
                rules={[
                  { required: isScheduled, message: "Please select a time" },
                ]}
              >
                <TimePicker
                  placeholder="Select Time"
                  format="h:mm A"
                  use12Hours
                  disabledTime={() => {
                    const scheduleDate = form.getFieldValue("scheduleDate");
                    return disabledTime(scheduleDate);
                  }}
                />
              </Form.Item>
            </Space>
          )}

          {isScheduled && (
            <div className="mt-3 p-3 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-600 mb-0">
                <ClockCircleOutlined className="mr-2" />
                This notification will be scheduled for delivery at the
                specified time.
              </p>
            </div>
          )}
        </Card>

        <div className="button-group mt-20">
          <Button
            type="primary"
            htmlType="submit"
            className="send-button h-10 px-16"
            loading={isLoading}
            icon={isScheduled ? <ClockCircleOutlined /> : <SendOutlined />}
          >
            {isScheduled ? "Schedule Notification" : "Send Now"}
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default PushNotification;
