import React, { useState, useEffect } from "react";
import { Modal, Form, Input, Select, Upload, Tag, Button } from "antd";
import { CloudUploadOutlined } from "@ant-design/icons";

const { Option } = Select;
const { TextArea } = Input;

const VideoFormModal = ({
  visible,
  onCancel,
  onSubmit,
  currentVideo,
  editingId,
  categories,
  subCategories,
  equipmentTags,
  setEquipmentTags,
}) => {
  const [form] = Form.useForm();
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [videoFile, setVideoFile] = useState(null);
  const [thumbnailPreview, setThumbnailPreview] = useState("");
  const [videoPreview, setVideoPreview] = useState("");

  useEffect(() => {
    if (visible) {
      if (currentVideo) {
        form.setFieldsValue({
          title: currentVideo.title,
          category: currentVideo.category,
          subCategory: currentVideo.subCategory,
          duration: currentVideo.duration,
          equipment: currentVideo.equipment,
          description: currentVideo.description,
        });
        setThumbnailPreview(currentVideo.thumbnail);
        setVideoPreview(currentVideo.video);
      } else {
        form.resetFields();
        setThumbnailPreview("");
        setVideoPreview("");
        setThumbnailFile(null);
        setVideoFile(null);
      }
    }
  }, [visible, currentVideo, form]);

  const handleAddTag = (tag) => {
    if (tag && !equipmentTags.includes(tag)) {
      setEquipmentTags([...equipmentTags, tag]);
    }
  };

  const handleFormSubmit = (values) => {
    onSubmit(values, thumbnailFile, videoFile);
  };

  // Fixed thumbnail change handler
  const handleThumbnailChange = (info) => {
    if (info.file && info.file.originFileObj) {
      const file = info.file.originFileObj;
      setThumbnailFile(file);

      // Create a URL for the preview
      const previewURL = URL.createObjectURL(file);
      setThumbnailPreview(previewURL);
    }
  };

  // Fixed video change handler
  const handleVideoChange = (info) => {
    if (info.file && info.file.originFileObj) {
      const file = info.file.originFileObj;
      setVideoFile(file);

      // Create a URL for the preview
      const previewURL = URL.createObjectURL(file);
      setVideoPreview(previewURL);
    }
  };

  // Improved thumbnail upload button with better styling
  const thumbnailUploadButton = (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        position: "relative",
      }}
    >
      {thumbnailPreview ? (
        <img
          src={thumbnailPreview}
          alt="thumbnail"
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            borderRadius: "2px",
          }}
        />
      ) : (
        <div style={{ textAlign: "center" }}>
          <CloudUploadOutlined style={{ fontSize: 40 }} />
          <div style={{ marginTop: 8 }}>Upload Thumbnail</div>
        </div>
      )}
    </div>
  );

  // Improved video upload button with better styling
  const videoUploadButton = (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        position: "relative",
      }}
    >
      {videoPreview ? (
        <video
          src={videoPreview}
          controls
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            borderRadius: "2px",
          }}
        />
      ) : (
        <div style={{ textAlign: "center" }}>
          <CloudUploadOutlined style={{ fontSize: 40 }} />
          <div style={{ marginTop: 8 }}>Upload Video</div>
        </div>
      )}
    </div>
  );

  return (
    <Modal
      title={editingId !== null ? "Edit Video" : "Upload New Video"}
      visible={visible}
      onCancel={onCancel}
      footer={null}
      width={1000}
      destroyOnClose
    >
      <Form form={form} layout="vertical" onFinish={handleFormSubmit}>
        <div style={{ display: "flex", gap: "20px" }}>
          <div style={{ flex: 1 }}>
            <Form.Item
              label="Title"
              name="title"
              rules={[{ required: true, message: "Please enter video title" }]}
            >
              <Input placeholder="Enter Your Video Title" className="py-3" />
            </Form.Item>
          </div>

          <div style={{ flex: 1 }}>
            <Form.Item
              label="Select Category"
              name="category"
              rules={[{ required: true, message: "Please select category" }]}
            >
              <Select placeholder="Select Category" style={{ height: 48 }}>
                {categories.map((cat) => (
                  <Option key={cat} value={cat}>
                    {cat}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </div>

          <div style={{ flex: 1 }}>
            <Form.Item
              label="Select Sub Category"
              name="subCategory"
              rules={[
                { required: true, message: "Please select sub category" },
              ]}
            >
              <Select placeholder="Select Sub Category" style={{ height: 48 }}>
                {subCategories.map((subCat) => (
                  <Option key={subCat} value={subCat}>
                    {subCat}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </div>
        </div>

        <div style={{ display: "flex", gap: "20px" }}>
          <div style={{ flex: 1 }}>
            <Form.Item
              label="Time Duration"
              name="duration"
              rules={[{ required: true, message: "Please enter duration" }]}
            >
              <Input placeholder="Enter Video Time Duration" className="py-3" />
            </Form.Item>
          </div>

          <div style={{ flex: 2 }}>
            <Form.Item label="Equipment" name="equipment">
              <div
                style={{
                  border: "1px solid #d9d9d9",
                  borderRadius: "6px",
                  padding: "10px",
                  minHeight: "32px",
                }}
              >
                {equipmentTags?.map((tag) => (
                  <Tag
                    key={tag}
                    color="error"
                    closable
                    style={{ marginRight: 3, marginBottom: 3 }}
                    onClose={() =>
                      setEquipmentTags(equipmentTags.filter((t) => t !== tag))
                    }
                  >
                    {tag}
                  </Tag>
                ))}
                <Input
                  style={{
                    width: 78,
                    border: "none",
                    outline: "none",
                    padding: 0,
                  }}
                  placeholder="Add tag"
                  onPressEnter={(e) => {
                    e.preventDefault();
                    handleAddTag(e.target.value);
                    e.target.value = "";
                  }}
                />
              </div>
            </Form.Item>
          </div>
        </div>

        <div style={{ display: "flex", gap: "20px" }}>
          <div style={{ flex: 1 }}>
            <Form.Item label="Upload Thumbnail" name="thumbnail">
              <Upload
                listType="picture-card"
                showUploadList={false}
                beforeUpload={() => false}
                onChange={handleThumbnailChange}
                style={{ width: "100%", height: "200px" }}
              >
                {thumbnailUploadButton}
              </Upload>
              {thumbnailPreview && (
                <div style={{ marginTop: 8 }}>
                  <Button
                    size="small"
                    onClick={(e) => {
                      e.stopPropagation();
                      setThumbnailPreview("");
                      setThumbnailFile(null);
                    }}
                  >
                    Remove
                  </Button>
                </div>
              )}
            </Form.Item>
          </div>

          <div style={{ flex: 1 }}>
            <Form.Item label="Upload Video" name="video">
              <Upload
                listType="picture-card"
                showUploadList={false}
                beforeUpload={() => false}
                onChange={handleVideoChange}
                style={{ width: "100%", height: "200px" }}
              >
                {videoUploadButton}
              </Upload>
              {videoPreview && (
                <div style={{ marginTop: 8 }}>
                  <Button
                    size="small"
                    onClick={(e) => {
                      e.stopPropagation();
                      setVideoPreview("");
                      setVideoFile(null);
                    }}
                  >
                    Remove
                  </Button>
                </div>
              )}
            </Form.Item>
          </div>
        </div>

        <Form.Item label="Write Video Description" name="description">
          <TextArea rows={4} placeholder="Enter video description here" />
        </Form.Item>

        <Form.Item style={{ textAlign: "right" }}>
          <Button type="primary" danger htmlType="submit">
            {editingId !== null ? "Update Video" : "Upload New Video"}
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default VideoFormModal;
