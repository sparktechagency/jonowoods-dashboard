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
          setPreviewUrl(
            "https://static.vecteezy.com/system/resources/thumbnails/006/408/741/small/meditate-yoga-person-sitting-in-lotus-position-line-icon-relaxation-tranquility-rest-keep-calm-illustration-free-vector.jpg"
          );
        }
      } else {
        form.resetFields();
        setPreviewUrl(
          "https://static.vecteezy.com/system/resources/thumbnails/006/408/741/small/meditate-yoga-person-sitting-in-lotus-position-line-icon-relaxation-tranquility-rest-keep-calm-illustration-free-vector.jpg"
        );
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
          <Select placeholder="Class/Course">
            <Select.Option value="class">Class</Select.Option>
            <Select.Option value="course">Course</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item name="thumbnail" label="Thumbnail">
          <div className="bg-gray-100 p-1 rounded">
            <img
              src={
                previewUrl
                  ? previewUrl
                  : "https://static.vecteezy.com/system/resources/thumbnails/001/892/283/small/woman-meditating-concept-for-yoga-meditation-relax-healthy-lifestyle-in-landscape-free-vector.jpg"
              }
              alt="Thumbnail preview"
              className="w-full rounded-3xl mb-2"
              style={{ maxHeight: "200px", objectFit: "contain" }}
            />

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
                  setPreviewUrl(
                    "https://static.vecteezy.com/system/resources/thumbnails/001/892/283/small/woman-meditating-concept-for-yoga-meditation-relax-healthy-lifestyle-in-landscape-free-vector.jpg"
                  );
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
