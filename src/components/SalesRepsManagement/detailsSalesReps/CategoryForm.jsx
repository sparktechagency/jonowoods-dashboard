import React, { useState, useEffect } from "react";
import { Modal, Form, Input, Select, Button, Upload } from "antd";
import { UploadOutlined, ReloadOutlined, PictureOutlined } from "@ant-design/icons";
import { getImageUrl } from "../../common/imageUrl";
import { useParams } from "react-router-dom";

const CategoryForm = ({ visible, onCancel, onSubmit, initialValues }) => {
  const [form] = Form.useForm();
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    if (visible) {
      if (initialValues) {
        form.setFieldsValue({
          name: initialValues.name,
          categoryType: initialValues.categoryType,
        });
        // Set preview URL from existing thumbnail
        if (initialValues.thumbnail) {
          setPreviewUrl(getImageUrl(initialValues.thumbnail));
          setImageLoaded(false);
          setImageError(false);
        } else {
          setPreviewUrl(null);
          setImageLoaded(false);
          setImageError(false);
        }
        setThumbnailFile(null);
      } else {
        form.resetFields();
        setPreviewUrl(null);
        setThumbnailFile(null);
        setImageLoaded(false);
        setImageError(false);
      }
    }
  }, [visible, initialValues, form]);

  const handleThumbnailChange = (info) => {
    if (info.file) {
      const file = info.file.originFileObj || info.file;
      setThumbnailFile(file);

      // Create a preview URL
      const reader = new FileReader();
      reader.onload = () => {
        setPreviewUrl(reader.result);
        setImageLoaded(true);
        setImageError(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageLoad = () => {
    setImageLoaded(true);
    setImageError(false);
  };

  const handleImageError = () => {
    setImageLoaded(false);
    setImageError(true);
  };

  const resetImage = () => {
    setPreviewUrl(null);
    setThumbnailFile(null);
    setImageLoaded(false);
    setImageError(false);
  };

  const handleFormSubmit = () => {
    form
      .validateFields()
      .then((values) => {
        onSubmit(values, thumbnailFile);
      })
      .catch((info) => {
        console.log("Validate Failed:", info);
      });
  };

  // Render image preview section
  const renderImagePreview = () => {
    if (!previewUrl) {
      // No image selected - show placeholder
      return (
        <div className="w-full h-48 bg-gray-200 rounded mb-2 flex items-center justify-center">
          <div className="text-center text-gray-500">
            <PictureOutlined style={{ fontSize: '48px', marginBottom: '8px' }} />
            <div>No image selected</div>
          </div>
        </div>
      );
    }

    if (imageError) {
      // Image failed to load - show error placeholder
      return (
        <div className="w-full h-48 bg-red-100 rounded mb-2 flex items-center justify-center">
          <div className="text-center text-red-500">
            <PictureOutlined style={{ fontSize: '48px', marginBottom: '8px' }} />
            <div>Failed to load image</div>
          </div>
        </div>
      );
    }

    // Show actual image
    return (
      <img
        src={previewUrl}
        alt="Thumbnail preview"
        className="w-full rounded-3xl mb-2"
        style={{ maxHeight: "200px", objectFit: "contain" }}
        onLoad={handleImageLoad}
        onError={handleImageError}
      />
    );
  };

  return (
    <Modal
      title={initialValues ? "Edit Category" : "Add New Category"}
      open={visible}
      onCancel={onCancel}
      footer={[
        <Button key="cancel" onClick={onCancel}>
          Cancel
        </Button>,
        <Button
          key="submit"
          type="primary"
          onClick={handleFormSubmit}
          className="bg-red-500"
        >
          Save
        </Button>,
      ]}
    >
      <Form form={form} layout="vertical">
        <Form.Item
          name="name"
          label="Category Name"
          rules={[{ required: true, message: "Please input category name!" }]}
        >
          <Input placeholder="Write Category Title" />
        </Form.Item>
        {/* <Form.Item
          name="categoryType"
          label="Category Type"
          rules={[{ required: true, message: "Please select category type!" }]}
        >
          <Select placeholder="Class/Course">
            <Select.Option value="class">Class</Select.Option>
            <Select.Option value="course">Course</Select.Option>
          </Select>
        </Form.Item> */}
        <Form.Item name="thumbnail" label="Thumbnail">
          <div className="bg-gray-100 p-1 rounded">
            {renderImagePreview()}
            <div className="flex justify-between">
              <Upload
                beforeUpload={() => false}
                onChange={handleThumbnailChange}
                maxCount={1}
                showUploadList={false}
                accept="image/*"
              >
                <Button icon={<UploadOutlined />}>Select Thumbnail</Button>
              </Upload>
              <Button
                icon={<ReloadOutlined />}
                size="small"
                shape="circle"
                onClick={resetImage}
                title="Reset image"
              />
            </div>
          </div>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CategoryForm;