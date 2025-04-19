import React, { useState, useEffect } from "react";
import {
  Form,
  Input,
  Button,
  Switch,
  Select,
  notification,
  Upload,
  Avatar,
  message,
} from "antd";
import GradientButton from "../../../components/common/GradiantButton";
import { UploadOutlined } from "@ant-design/icons";

const { Option } = Select;

const UserProfile = () => {
  const [form] = Form.useForm();
  const [imageUrl, setImageUrl] = useState(null);
  const [fileList, setFileList] = useState([]); // State to handle file list

  // Dummy data (to be used as the default data)
  const dummyData = {
    username: "Md Jowel Ahmed",
    email: "mdjowelahmed924@gmail.com",
    address: "1234 Main St, Springfield, USA",
    language: "english",
    profileImage: "https://i.ibb.co.com/Qjf2hxsf/images-2.jpg",
  };

  useEffect(() => {
    // Set initial values and the profile image if it exists
    form.setFieldsValue(dummyData);

    // Set the image URL and file list if a profile image exists
    if (dummyData.profileImage) {
      setImageUrl(dummyData.profileImage);
      setFileList([
        {
          uid: "-1",
          name: "profile.jpg",
          status: "done",
          url: dummyData.profileImage,
        },
      ]);
    }
  }, [form]);

  // Clean up blob URLs when component unmounts to prevent memory leaks
  useEffect(() => {
    return () => {
      if (imageUrl && imageUrl.startsWith("blob:")) {
        URL.revokeObjectURL(imageUrl);
      }
    };
  }, [imageUrl]);

  const onFinish = (values) => {
    // Get the file object itself, not just the URL
    const imageFile = fileList.length > 0 ? fileList[0].originFileObj : null;

    console.log("Form Values on Submit:", values);
    console.log("Image File:", imageFile); // Log the actual file object

    // Create a FormData object for server submission with file
    const formData = new FormData();
    Object.keys(values).forEach((key) => {
      formData.append(key, values[key]);
    });

    if (imageFile) {
      formData.append("profileImage", imageFile);
    } else if (imageUrl) {
      // If using existing image (not a new upload)
      formData.append("profileImageUrl", imageUrl);
    }

    console.log("FormData created successfully");

    // For displaying in console what would be sent to server
    for (let pair of formData.entries()) {
      console.log(pair[0] + ": " + pair[1]);
    }

    // Here you would normally send the formData to your API
    // axios.post('/api/updateProfile', formData)

    message.success("Profile Updated Successfully!");
  };

  const handleImageChange = ({ fileList: newFileList }) => {
    // Only keep the most recent file in the list
    const limitedFileList = newFileList.slice(-1);
    setFileList(limitedFileList);

    if (limitedFileList.length > 0 && limitedFileList[0].originFileObj) {
      // Create blob URL for preview
      const newImageUrl = URL.createObjectURL(limitedFileList[0].originFileObj);

      // Clean up previous blob URL if exists
      if (imageUrl && imageUrl.startsWith("blob:")) {
        URL.revokeObjectURL(imageUrl);
      }

      setImageUrl(newImageUrl);
    } else {
      setImageUrl(null);
    }
  };

  const beforeUpload = (file) => {
    const isImage = file.type.startsWith("image/");
    if (!isImage) {
      notification.error({
        message: "Invalid File Type",
        description: "Please upload an image file.",
      });
    }

    // Check file size (optional)
    const isLessThan2MB = file.size / 1024 / 1024 < 2;
    if (!isLessThan2MB) {
      notification.error({
        message: "File too large",
        description: "Image must be smaller than 2MB.",
      });
    }

    return isImage && isLessThan2MB;
  };

  const handleFormSubmit = () => {
    form.submit(); // This will trigger the onFinish function
  };

  return (
    <div className="flex justify-center items-center shadow-xl rounded-lg">
      <Form
        form={form}
        layout="vertical"
        style={{ width: "80%" }}
        onFinish={onFinish}
        encType="multipart/form-data"
      >
        <div className="grid lg:grid-cols-2 grid-cols-1 lg:gap-x-16 w-full gap-y-7">
          {/* Profile Image */}
          <div className="col-span-2 flex justify-center">
            <Form.Item label="Profile Image" style={{ marginBottom: 0 }}>
              <Upload
                name="avatar"
                showUploadList={false}
                action="/upload" // This will be overridden by the manual form submission
                onChange={handleImageChange}
                beforeUpload={beforeUpload}
                fileList={fileList}
                listType="picture-card"
                maxCount={1}
              >
                {imageUrl ? (
                  <Avatar size={100} src={imageUrl} />
                ) : (
                  <Avatar size={100} icon={<UploadOutlined />} />
                )}
              </Upload>
            </Form.Item>
          </div>

          {/* Username */}
          <Form.Item
            name="username"
            label="Username"
            style={{ marginBottom: 0 }}
            rules={[{ required: true, message: "Please enter your username" }]}
          >
            <Input
              placeholder="Enter your Username"
              style={{
                height: "45px",
                backgroundColor: "#f7f7f7",
                borderRadius: "8px",
                outline: "none",
              }}
            />
          </Form.Item>

          {/* Email (Disabled) */}
          <Form.Item
            name="email"
            label="Email"
            style={{ marginBottom: 0 }}
            rules={[
              { required: true, message: "Please enter your email" },
              { type: "email", message: "Please enter a valid email" },
            ]}
          >
            <Input
              placeholder="Enter your Email"
              style={{
                height: "45px",
                backgroundColor: "#f7f7f7",
                borderRadius: "8px",
                border: "1px solid #E0E4EC",
                outline: "none",
              }}
              disabled // Disable the email field
            />
          </Form.Item>

          {/* Address */}
          <Form.Item
            name="address"
            label="Address"
            style={{ marginBottom: 0 }}
            rules={[{ required: true, message: "Please enter your address" }]}
          >
            <Input
              placeholder="Enter your Address"
              style={{
                height: "45px",
                backgroundColor: "#f7f7f7",
                borderRadius: "8px",
                outline: "none",
              }}
            />
          </Form.Item>

          {/* Language */}
          <Form.Item
            name="language"
            label="Language"
            style={{ marginBottom: 0 }}
            rules={[{ required: true, message: "Please select your language" }]}
          >
            <Select
              placeholder="Select your Language"
              style={{
                height: "45px",
                backgroundColor: "#f7f7f7",
                borderRadius: "8px",
                border: "1px solid #E0E4EC", // Custom border for language
              }}
            >
              <Option value="english">English</Option>
              <Option value="french">French</Option>
              <Option value="spanish">Spanish</Option>
            </Select>
          </Form.Item>

          {/* Update Profile Button */}
          <div className="col-span-2 text-end mt-6">
            <Form.Item>
              {/* Option 1: Use standard Ant Design Button */}
              <Button
                type="primary"
                htmlType="submit"
                block
                style={{ height: 40 }}
              >
                Update Profile
              </Button>

              {/* Option 2: Use GradientButton with onClick handler */}
              {/* 
              <GradientButton onClick={handleFormSubmit} block>
                Update Profile
              </GradientButton>
              */}
            </Form.Item>
          </div>
        </div>
      </Form>
    </div>
  );
};

export default UserProfile;
