import React from "react";
import { Row, Col, Tag, Space, Button, Switch } from "antd";
import {
  EditOutlined,
  EyeOutlined,
  DeleteOutlined,
  DragOutlined,
} from "@ant-design/icons";
import { getVideoAndThumbnail } from "../common/imageUrl";
import moment from "moment/moment";

const VideoCard = ({
  video,
  onEdit,
  onView,
  onDelete,
  onStatusChange,
  isDragging,
}) => {
  return (
    <div
      className={`video-card ${isDragging ? "dragging" : ""} py-2`}
      style={{
        marginBottom: 10,
        borderRadius: 12,
        overflow: "hidden",
        boxShadow: isDragging
          ? "0 8px 32px rgba(0,0,0,0.2)"
          : "0 2px 8px rgba(0,0,0,0.1)",
        transform: isDragging ? "rotate(2deg) scale(1.02)" : "none",
        transition: "all 0.3s ease",
        border: isDragging ? "2px solid #1890ff" : "1px solid #f0f0f0",
        opacity: isDragging ? 0.8 : 1,
      }}
      hoverable
    >
      <Row gutter={16} align="middle">
        <Col span={1}>
          <div
            className="drag-handle"
            style={{
              cursor: "grab",
              padding: "8px",
              color: "#666",
              fontSize: "16px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: "4px",
            }}
          >
            <DragOutlined />
          </div>
        </Col>

        <Col span={1}>
          <div
            style={{
              fontSize: "14px",
              fontWeight: "bold",
              color: "#1890ff",
              textAlign: "center",
            }}
          >
            #{video.serial}
          </div>
        </Col>

        <Col span={4}>
          <img
            src={getVideoAndThumbnail(video.thumbnailUrl)}
            alt={video.title}
            style={{
              width: "100%",
              height: 80,
              objectFit: "cover",
              borderRadius: 8,
            }}
          />
        </Col>

        <Col span={8}>
          <div>
            <h4 style={{ margin: 0, fontSize: "16px", fontWeight: "600" }}>
              {video.title}
            </h4>
            <p style={{ margin: "4px 0", color: "#666", fontSize: "14px" }}>
              Duration: {video.duration || "N/A"}
            </p>
            <p style={{ margin: 0, color: "#999", fontSize: "12px" }}>
              Created: {moment(video.createdAt).format("L")}
            </p>
          </div>
        </Col>

        <Col span={3}>
          <Tag color={video.status === "active" ? "success" : "error"}>
            {video.status === "active" ? "Active" : "Inactive"}
          </Tag>
        </Col>

        <Col span={6}>
          <Space size="small">
            <Button
              type="text"
              icon={<EditOutlined />}
              onClick={() => onEdit(video)}
              style={{ color: "#1890ff" }}
              title="Edit Video"
            />
            <Button
              type="text"
              icon={<EyeOutlined />}
              onClick={() => onView(video)}
              style={{ color: "#52c41a" }}
              title="View Details"
            />
            <Switch
              size="small"
              checked={video.status === "active"}
              onChange={(checked) => onStatusChange(checked, video)}
            />
            <Button
              type="text"
              icon={<DeleteOutlined />}
              onClick={() => onDelete(video._id)}
              style={{ color: "#ff4d4f" }}
              danger
              title="Delete Video"
            />
          </Space>
        </Col>
      </Row>

      <style jsx>{`
        .video-card:hover {
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
          transform: translateY(-2px);
        }

        .drag-handle:hover {
          color: #1890ff;
          background: rgba(24, 144, 255, 0.1);
          border-radius: 4px;
        }

        .drag-handle:active {
          cursor: grabbing;
        }

        .dragging {
          z-index: 1000;
          position: relative;
        }
      `}</style>
    </div>
  );
};

export default VideoCard;