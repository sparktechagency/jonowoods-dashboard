import { useState, useEffect, useRef } from "react";
import {
  Modal,
  Form,
  Input,
  Tag,
  Button,
  message,
  Upload,
  Progress,
  Alert,
} from "antd";
import {
  CloudUploadOutlined,
  FileImageOutlined,
  VideoCameraOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
} from "@ant-design/icons";
import {
  useAddVideoMutation,
  useUpdateVideoMutation,
} from "../../redux/apiSlices/videoApi";

const { TextArea } = Input;
const { Dragger } = Upload;

// React Component or any JS/TS file

// --- Bunny.net Credentials ---
const STORAGE_API_KEY = import.meta.env.VITE_STORAGE_API_KEY;
const STORAGE_ZONE = import.meta.env.VITE_STORAGE_ZONE;
const STORAGE_PULL_ZONE = import.meta.env.VITE_STORAGE_PULL_ZONE;
const STREAM_API_KEY = import.meta.env.VITE_STREAM_API_KEY;
const STREAM_LIBRARY_ID = import.meta.env.VITE_STREAM_LIBRARY_ID;

const VideoUploadModal = ({
  visible,
  onCancel,
  onSuccess,
  currentVideo,
  equipmentTags,
  setEquipmentTags,
}) => {
  const [form] = Form.useForm();
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [videoFile, setVideoFile] = useState(null);
  const [tagInput, setTagInput] = useState("");
  const [uploading, setUploading] = useState(false);
  const [status, setStatus] = useState("");

  // Progress states
  const [storageProgress, setStorageProgress] = useState(0);
  const [streamProgress, setStreamProgress] = useState(0);

  const isEditMode = !!currentVideo?._id;
  const [addVideo, { isLoading: isAdding }] = useAddVideoMutation();
  const [updateVideo, { isLoading: isUpdating }] = useUpdateVideoMutation();

  useEffect(() => {
    if (visible && currentVideo) {
      form.setFieldsValue({
        title: currentVideo.title,
        duration: currentVideo.duration?.replace(" Min", "") || "",
        description: currentVideo.description || "",
      });
      setEquipmentTags(currentVideo.equipment || []);
    } else if (visible) {
      form.resetFields();
      setEquipmentTags([]);
      setThumbnailFile(null);
      setVideoFile(null);
    }
  }, [visible, currentVideo]);

  // --- Helper: Format File Size ---
  const formatFileSize = (bytes) => {
    if (!bytes) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  // --- 1. Upload Thumbnail to Bunny Storage ---
  const uploadThumbnail = async (file) => {
    const fileName = `thumbnails/${Date.now()}-${file.name.replace(/\s+/g, "_")}`;
    const url = `https://storage.bunnycdn.com/${STORAGE_ZONE}/${fileName}`;

    setStatus("Uploading thumbnail...");
    const response = await fetch(url, {
      method: "PUT",
      headers: {
        AccessKey: STORAGE_API_KEY,
        "Content-Type": file.type,
      },
      body: file,
    });

    if (!response.ok) throw new Error("Thumbnail upload failed");
    return `https://${STORAGE_PULL_ZONE}/${fileName}`;
  };

  // --- 2. Upload Video to Bunny Storage (Original File) ---
  const uploadVideoToStorage = async (file) => {
    const fileName = `videos/${Date.now()}-${file.name.replace(/\s+/g, "_")}`;
    const url = `https://storage.bunnycdn.com/${STORAGE_ZONE}/${fileName}`;

    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open("PUT", url);
      xhr.setRequestHeader("AccessKey", STORAGE_API_KEY);
      xhr.setRequestHeader("Content-Type", file.type);

      xhr.upload.onprogress = (e) => {
        if (e.lengthComputable) {
          setStorageProgress(Math.round((e.loaded / e.total) * 100));
        }
      };

      xhr.onload = () => {
        if (xhr.status === 201 || xhr.status === 200)
          resolve(`https://${STORAGE_PULL_ZONE}/${fileName}`);
        else reject(new Error("Storage upload failed"));
      };
      xhr.onerror = () => reject(new Error("Storage Network Error"));
      xhr.send(file);
    });
  };

  // --- 3. Upload Video to Bunny Stream (Player Library) ---
  const uploadToBunnyStream = async (file, title) => {
    // A. Create video entry
    const createRes = await fetch(
      `https://video.bunnycdn.com/library/${STREAM_LIBRARY_ID}/videos`,
      {
        method: "POST",
        headers: {
          AccessKey: STREAM_API_KEY,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title: title }),
      },
    );
    const videoData = await createRes.json();
    const videoId = videoData.guid;

    // B. Upload file chunks
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open(
        "PUT",
        `https://video.bunnycdn.com/library/${STREAM_LIBRARY_ID}/videos/${videoId}`,
      );
      xhr.setRequestHeader("AccessKey", STREAM_API_KEY);

      xhr.upload.onprogress = (e) => {
        if (e.lengthComputable) {
          setStreamProgress(Math.round((e.loaded / e.total) * 100));
        }
      };

      xhr.onload = () => {
        if (xhr.status === 200) resolve(videoId);
        else reject(new Error("Stream upload failed"));
      };
      xhr.onerror = () => reject(new Error("Stream Network Error"));
      xhr.send(file);
    });
  };

  const addTag = () => {
    if (tagInput.trim() && !equipmentTags.includes(tagInput.trim())) {
      setEquipmentTags([...equipmentTags, tagInput.trim()]);
      setTagInput("");
    }
  };

  const handleSubmit = async (values) => {
    if (!isEditMode && (!thumbnailFile || !videoFile)) {
      return message.error("Please select both thumbnail and video files");
    }
    if (equipmentTags.length === 0) {
      return message.error("Please add at least one equipment tag");
    }

    try {
      setUploading(true);
      setStorageProgress(0);
      setStreamProgress(0);

      let finalThumbnailUrl = currentVideo?.thumbnailUrl;
      let finalDownloadUrl = currentVideo?.downloadUrl;
      let finalVideoId = currentVideo?.videoId;

      // 1. Thumbnail Upload
      if (thumbnailFile) {
        finalThumbnailUrl = await uploadThumbnail(thumbnailFile);
      }

      // 2. Storage & Stream Upload (Parallel)
      if (videoFile) {
        setStatus("Uploading video to cloud...");
        const [storageUrl, streamId] = await Promise.all([
          uploadVideoToStorage(videoFile),
          uploadToBunnyStream(videoFile, values.title),
        ]);
        finalDownloadUrl = storageUrl;
        finalVideoId = streamId;
      }

      // 3. Final Metadata save to Backend
      setStatus("Saving metadata to server...");
      const payload = {
        title: values.title,
        duration: values.duration.includes("Min")
          ? values.duration
          : `${values.duration} Min`,
        description: values.description,
        equipment: equipmentTags,
        thumbnailUrl: finalThumbnailUrl,
        downloadUrl: finalDownloadUrl,
        videoId: finalVideoId,
        videoUrl: `https://iframe.mediadelivery.net/embed/${STREAM_LIBRARY_ID}/${finalVideoId}`,
      };

      if (isEditMode) {
        await updateVideo({
          id: currentVideo._id,
          videoData: payload,
        }).unwrap();
        message.success("Video updated successfully");
      } else {
        await addVideo(payload).unwrap();
        message.success("Video uploaded and added successfully");
      }

      onSuccess();
      onCancel();
    } catch (error) {
      console.error(error);
      message.error(error.message || "Something went wrong during upload");
    } finally {
      setUploading(false);
      setStatus("");
    }
  };

  return (
    <Modal
      title={isEditMode ? "Edit Video Info" : "Upload Video to Cloud"}
      open={visible}
      onCancel={uploading ? null : onCancel}
      footer={null}
      width={850}
      maskClosable={!uploading}
    >
      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        {uploading && (
          <Alert
            className="mb-6"
            message={<span className="font-bold">{status}</span>}
            description={
              <div className="space-y-4 py-2">
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span>Storage Backup</span>
                    <span>{storageProgress}%</span>
                  </div>
                  <Progress
                    percent={storageProgress}
                    size="small"
                    status="active"
                  />
                </div>
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span>Streaming Server</span>
                    <span>{streamProgress}%</span>
                  </div>
                  <Progress
                    percent={streamProgress}
                    size="small"
                    status="active"
                    strokeColor="#52c41a"
                  />
                </div>
                <p className="text-[10px] text-gray-400 italic">
                  Please do not close this window until finished.
                </p>
              </div>
            }
            type="info"
            showIcon
            icon={<CloudUploadOutlined />}
          />
        )}

        <Form.Item
          name="title"
          label="Video Title"
          rules={[{ required: true }]}
        >
          <Input
            size="large"
            disabled={uploading}
            placeholder="Enter video title"
          />
        </Form.Item>

        <div className="grid grid-cols-2 gap-4">
          <Form.Item
            name="duration"
            label="Duration (e.g. 10:30)"
            rules={[{ required: true }]}
          >
            <Input size="large" disabled={uploading} placeholder="MM:SS" />
          </Form.Item>

          <Form.Item label="Equipment Tags">
            <Input
              size="large"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onPressEnter={(e) => {
                e.preventDefault();
                addTag();
              }}
              disabled={uploading}
              placeholder="Type and press Enter"
              suffix={
                <Button type="text" onClick={addTag}>
                  Add
                </Button>
              }
            />
            <div className="mt-2 flex flex-wrap gap-1">
              {equipmentTags.map((tag) => (
                <Tag
                  key={tag}
                  closable
                  onClose={() =>
                    setEquipmentTags(equipmentTags.filter((t) => t !== tag))
                  }
                  color="volcano"
                >
                  {tag}
                </Tag>
              ))}
            </div>
          </Form.Item>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Form.Item label="Thumbnail Image (Storage)" required={!isEditMode}>
            <Dragger
              accept="image/*"
              beforeUpload={(file) => {
                setThumbnailFile(file);
                return false;
              }}
              showUploadList={false}
              disabled={uploading}
              className={thumbnailFile ? "border-green-400" : ""}
            >
              {thumbnailFile ? (
                <div className="py-2">
                  <CheckCircleOutlined className="text-green-500 text-2xl" />
                  <p className="text-xs mt-1">{thumbnailFile.name}</p>
                </div>
              ) : (
                <div className="py-2">
                  <FileImageOutlined className="text-2xl text-gray-300" />
                  <p className="ant-upload-text text-xs">Select Thumbnail</p>
                </div>
              )}
            </Dragger>
          </Form.Item>

          <Form.Item
            label="Video File (Storage & Stream)"
            required={!isEditMode}
          >
            <Dragger
              accept="video/*"
              beforeUpload={(file) => {
                setVideoFile(file);
                return false;
              }}
              showUploadList={false}
              disabled={uploading || isEditMode}
              className={videoFile ? "border-green-400" : ""}
            >
              {isEditMode ? (
                <div className="py-2">
                  <p className="text-gray-400 text-xs">
                    Video cannot be changed in edit mode
                  </p>
                </div>
              ) : videoFile ? (
                <div className="py-2">
                  <CheckCircleOutlined className="text-green-500 text-2xl" />
                  <p className="text-xs mt-1">
                    {videoFile.name} ({formatFileSize(videoFile.size)})
                  </p>
                </div>
              ) : (
                <div className="py-2">
                  <VideoCameraOutlined className="text-2xl text-gray-300" />
                  <p className="ant-upload-text text-xs">Select Video File</p>
                </div>
              )}
            </Dragger>
          </Form.Item>
        </div>

        <Form.Item
          name="description"
          label="Description"
          rules={[{ required: true }]}
        >
          <TextArea
            rows={4}
            disabled={uploading}
            placeholder="Describe the video..."
          />
        </Form.Item>

        <div className="flex justify-end gap-3 mt-6">
          <Button onClick={onCancel} disabled={uploading} size="large">
            Cancel
          </Button>
          <Button
            type="primary"
            htmlType="submit"
            loading={uploading}
            size="large"
            icon={<CloudUploadOutlined />}
            style={{ backgroundColor: "#CA3939", borderColor: "#CA3939" }}
          >
            {isEditMode ? "Save Changes" : "Start Cloud Upload"}
          </Button>
        </div>
      </Form>
    </Modal>
  );
};

export default VideoUploadModal;
