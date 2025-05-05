import React from "react";
import { Modal, Form, Tag } from "antd";
import { CloseCircleOutlined } from "@ant-design/icons";
import { getImageUrl, getVideoAndThumbnail } from "../common/imageUrl";

const VideoDetailsModal = ({ visible, onCancel, currentVideo }) => {
  console.log(currentVideo)
  const [form] = Form.useForm();

  return (
    <Modal
      title="Video Details"
      visible={visible}
      onCancel={onCancel}
      footer={null}
      closeIcon={<CloseCircleOutlined style={{ color: "red" }} />}
    >
      {currentVideo && (
        <Form form={form} layout="vertical">
          <div
            style={{
              border: "1px solid #f0f0f0",
              borderRadius: "4px",
              padding: "16px",
            }}
          >
            <p>
              <strong>Video Details</strong>
            </p>
            <p>
              <strong>Title:</strong> {currentVideo.title}
            </p>
            <p>
              <strong>Category:</strong> {currentVideo.category}
            </p>
            <p>
              <strong>Sub Category:</strong> {currentVideo.subCategory}
            </p>
            <p>
              <strong>Time:</strong> {currentVideo.duration}
            </p>
            <p>
              <strong>Equipment:</strong>
              {currentVideo.equipment?.map((eq) => (
                <Tag key={eq} color="error" style={{ marginLeft: 8 }}>
                  {eq}
                </Tag>
              ))}
            </p>

            <div style={{ marginTop: 16 }}>
              <p>
                <strong>Thumbnail</strong>
              </p>
              <div
                style={{
                  width: "100%",
                  height: 250,
                  backgroundColor: "#f5f5f5",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  overflow: "hidden",
                }}
              >
                {currentVideo.thumbnailUrl ? (
                  <img
                    src={getVideoAndThumbnail(currentVideo.thumbnailUrl)}
                    alt="thumbnail"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "contain",
                    }}
                  />
                ) : (
                  <p>No thumbnail available</p>
                )}
              </div>
            </div>

            <div style={{ marginTop: 16 }}>
              <p>
                <strong>Video</strong>
              </p>
              <div
                style={{
                  width: "100%",
                  height: 250,
                  backgroundColor: "#f5f5f5",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  overflow: "hidden",
                }}
              >
                {currentVideo.video ? (
                  <video
                    src={currentVideo.video}
                    controls
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "contain",
                    }}
                  />
                ) : (
                  <p>No video available</p>
                )}
              </div>
            </div>

            {currentVideo.description && (
              <div style={{ marginTop: 16 }}>
                <p>
                  <strong>Description</strong>
                </p>
                <p>{currentVideo.description}</p>
              </div>
            )}
          </div>
        </Form>
      )}
    </Modal>
  );
};

export default VideoDetailsModal;
