import React from "react";
import { Form, Input, Button, Switch, Select, notification } from "antd";
import GradientButton from "../../../components/common/GradiantButton";

const { Option } = Select;

const UserProfile = () => {
  const [form] = Form.useForm();

  const handleUpdate = async (values) => {
    console.log("Updated Values: ", values);
    // Here, you can add the logic to update the user data to the server
    // If it's successful, show a success notification
    notification.success({
      message: "Profile Updated Successfully!",
      description: "Your profile information has been updated.",
    });
  };

  return (
    <div className="flex justify-center items-center">
      <Form
        form={form}
        layout="vertical"
        style={{ width: "80%" }}
        onFinish={handleUpdate}
      >
        <div className="grid lg:grid-cols-2 grid-cols-1 lg:gap-x-16 w-full gap-y-7">
          {/* Business Name */}
          <Form.Item
            name="businessName"
            label="Business Name"
            style={{ marginBottom: 0 }}
            rules={[
              { required: true, message: "Please enter your business name" },
            ]}
          >
            <Input placeholder="Enter your Business Name" />
          </Form.Item>

          {/* Username */}
          <Form.Item
            name="username"
            label="Username"
            style={{ marginBottom: 0 }}
            rules={[{ required: true, message: "Please enter your username" }]}
          >
            <Input placeholder="Enter your Username" />
          </Form.Item>

          {/* Email */}
          <Form.Item
            name="email"
            label="Email"
            style={{ marginBottom: 0 }}
            rules={[
              { required: true, message: "Please enter your email" },
              { type: "email", message: "Please enter a valid email" },
            ]}
          >
            <Input placeholder="Enter your Email" />
          </Form.Item>

          {/* Address */}
          <Form.Item
            name="address"
            label="Address"
            style={{ marginBottom: 0 }}
            rules={[{ required: true, message: "Please enter your address" }]}
          >
            <Input placeholder="Enter your Address" />
          </Form.Item>

          {/* Region */}
          <Form.Item
            name="region"
            label="Region"
            style={{ marginBottom: 0 }}
            rules={[{ required: true, message: "Please select your region" }]}
          >
            <Select placeholder="Select your Region">
              <Option value="north">North</Option>
              <Option value="south">South</Option>
              <Option value="east">East</Option>
              <Option value="west">West</Option>
            </Select>
          </Form.Item>

          {/* Language */}
          <Form.Item
            name="language"
            label="Language"
            style={{ marginBottom: 0 }}
            rules={[{ required: true, message: "Please select your language" }]}
          >
            <Select placeholder="Select your Language">
              <Option value="english">English</Option>
              <Option value="french">French</Option>
              <Option value="spanish">Spanish</Option>
            </Select>
          </Form.Item>

          {/* Notification Switch */}
          <Form.Item
            name="notifications"
            label="Enable Notifications"
            valuePropName="checked"
            style={{ marginBottom: 0,  }}
          >
            <Switch defaultChecked className="bg-primary" />
          </Form.Item>

          {/* Update Profile Button */}
          <div className="text-end mt-6">
            <Form.Item>
              <GradientButton htmlType="submit" block>
                Update Profile
              </GradientButton>
            </Form.Item>
          </div>
        </div>
      </Form>
    </div>
  );
};

export default UserProfile;
