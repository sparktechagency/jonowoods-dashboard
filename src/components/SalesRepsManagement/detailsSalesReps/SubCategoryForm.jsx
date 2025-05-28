import React, { useState, useEffect } from "react";
import { Modal, Form, Input, Button, Upload, Tag } from "antd";
import { UploadOutlined, ReloadOutlined } from "@ant-design/icons";
import { getImageUrl } from "../../common/imageUrl";

const { TextArea } = Input;

const SubCategoryForm = ({ visible, onCancel, onSubmit, initialValues }) => {
  const [form] = Form.useForm();
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("/api/placeholder/400/200");

  // Equipment state
  const [equipmentInput, setEquipmentInput] = useState("");
  const [equipments, setEquipments] = useState([]);

  useEffect(() => {
    if (visible) {
      if (initialValues) {
        // Set form fields including description
        form.setFieldsValue({
          name: initialValues.name || "",
          description: initialValues.description || "",
        });

        // Set equipments from initialValues (default empty array)
        setEquipments(initialValues.equipment || []);

        // Set thumbnail preview URL using getImageUrl helper if thumbnail exists
        if (initialValues.thumbnail) {
          setPreviewUrl(getImageUrl(initialValues.thumbnail));
        } else {
          setPreviewUrl("/api/placeholder/400/200");
        }

        // Clear thumbnail file because no new file selected yet
        setThumbnailFile(null);
      } else {
        form.resetFields();
        setPreviewUrl("/api/placeholder/400/200");
        setThumbnailFile(null);
        setEquipments([]);
      }
      setEquipmentInput("");
    }
  }, [visible, initialValues, form]);

  const handleThumbnailChange = (info) => {
    if (info.file) {
      const file = info.file.originFileObj || info.file;
      setThumbnailFile(file);

      const reader = new FileReader();
      reader.onload = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const addEquipment = () => {
    const trimmed = equipmentInput.trim();
    if (trimmed && !equipments.includes(trimmed)) {
      setEquipments([...equipments, trimmed]);
      setEquipmentInput("");
    }
  };

  const removeEquipment = (equipmentToRemove) => {
    setEquipments(equipments.filter((eq) => eq !== equipmentToRemove));
  };

  const handleEquipmentKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addEquipment();
    }
  };

  const handleFormSubmit = () => {
    form.validateFields().then((values) => {
      onSubmit({ ...values, equipments }, thumbnailFile);
      form.resetFields();
      setThumbnailFile(null);
      setEquipments([]);
      setEquipmentInput("");
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

        <Form.Item
          name="description"
          label="Description"
          rules={[
            {
              required: true,
              message: "Please input sub category description!",
            },
          ]}
        >
          <TextArea rows={4} placeholder="Write Sub Category Description" />
        </Form.Item>

        <Form.Item label="Equipment">
          <div className="space-y-2">
            <Input
              placeholder="Add equipment and press Enter"
              value={equipmentInput}
              onChange={(e) => setEquipmentInput(e.target.value)}
              onKeyPress={handleEquipmentKeyPress}
              className="h-12"
              suffix={
                <Button
                  type="text"
                  onClick={addEquipment}
                  disabled={!equipmentInput.trim()}
                >
                  Add
                </Button>
              }
            />
            {equipments.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {equipments.map((equipment, index) => (
                  <Tag
                    key={index}
                    closable
                    onClose={() => removeEquipment(equipment)}
                    color="red"
                  >
                    {equipment}
                  </Tag>
                ))}
              </div>
            )}
          </div>
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
