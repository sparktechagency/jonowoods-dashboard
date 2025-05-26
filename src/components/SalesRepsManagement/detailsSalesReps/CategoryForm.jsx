import React, { useState, useEffect } from "react";
import { Modal, Form, Input, Select, Button, Upload } from "antd";
import { UploadOutlined, ReloadOutlined } from "@ant-design/icons";
import { getImageUrl } from "../../common/imageUrl";
import { useParams } from "react-router-dom";

const CategoryForm = ({ visible, onCancel, onSubmit, initialValues }) => {
  const [form] = Form.useForm();
  const [thumbnailFile, setThumbnailFile] = useState(null);
 
  const [previewUrl, setPreviewUrl] = useState("/api/placeholder/400/200");

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
        } else {
          setPreviewUrl("/api/placeholder/400/200");
        }
      } else {
        form.resetFields();
        setPreviewUrl("/api/placeholder/400/200");
        setThumbnailFile(null);
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
      };
      reader.readAsDataURL(file);
    }
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
        <Form.Item
          name="categoryType"
          label="Category Type"
          rules={[{ required: true, message: "Please select category type!" }]}
        >
          <Select placeholder="Free/Paid">
            <Select.Option value="class">Class</Select.Option>
            <Select.Option value="Course">Course</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item name="thumbnail" label="Thumbnail">
          <div className="bg-gray-100 p-1 rounded">
            {previewUrl && (
              <img
                src={previewUrl}
                alt="Thumbnail preview"
                className="w-full rounded mb-2"
                style={{ maxHeight: "200px", objectFit: "contain" }}
              />
            )}
            <div className="flex justify-between">
              <Upload
                beforeUpload={() => false}
                onChange={handleThumbnailChange}
                maxCount={1}
                showUploadList={false}
              >
                <Button icon={<UploadOutlined />}>Select Thumbnail</Button>
              </Upload>
              <Button
                icon={<ReloadOutlined />}
                size="small"
                shape="circle"
                onClick={() => {
                  setPreviewUrl("/api/placeholder/400/200");
                  setThumbnailFile(null);
                }}
              />
            </div>
          </div>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CategoryForm;
