import React, { useState, useEffect } from "react";
import { Modal, Form, Input, Button, Upload } from "antd";
import { UploadOutlined, ReloadOutlined } from "@ant-design/icons";

const SubCategoryForm = ({ visible, onCancel, onSubmit, initialValues }) => {
  const [form] = Form.useForm();
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  useEffect(() => {
    if (visible) {
      if (initialValues) {
        form.setFieldsValue({
          name: initialValues.name,
        });
        setPreviewUrl(initialValues.thumbnail);
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
    form.validateFields().then((values) => {
      onSubmit(values, thumbnailFile);
      form.resetFields();
      setThumbnailFile(null);
    });
  };

  return (
    <Modal
      title={initialValues ? "Edit Sub Category" : "Add New Sub Category"}
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
          label="Sub Category Name"
          rules={[
            { required: true, message: "Please input sub category name!" },
          ]}
        >
          <Input placeholder="Write Sub Category Title" />
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

export default SubCategoryForm;
