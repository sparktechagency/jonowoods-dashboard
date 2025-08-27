import React from "react";
import {
  Modal,
  Form,
  Tag,
  Card,
  Row,
  Col,
  Divider,
  Space,
  Typography,
} from "antd";
import {
  CloseCircleOutlined,
  PlayCircleOutlined,
  ClockCircleOutlined,
  FolderOutlined,
  ToolOutlined,
  CalendarOutlined,
  CheckCircleOutlined,
  StopOutlined,
  TrophyOutlined,
  HeartOutlined,
} from "@ant-design/icons";
import { getImageUrl, getVideoAndThumbnail } from "../common/imageUrl";
import moment from "moment";

const { Title, Text, Paragraph } = Typography;

const VideoDetailsModal = ({ visible, onCancel, currentVideo, type = "video" }) => {
  console.log(currentVideo);

  const [form] = Form.useForm();

  // Helper function to get status color and icon
  const getStatusInfo = (status) => {
    switch (status?.toLowerCase()) {
      case "active":
        return { color: "#52c41a", icon: <CheckCircleOutlined /> };
      case "inactive":
        return { color: "#faad14", icon: <StopOutlined /> };
      default:
        return { color: "#d9d9d9", icon: <ClockCircleOutlined /> };
    }
  };

  // Helper function to get modal title based on type
  const getModalTitle = () => {
    switch (type) {
      case "category":
        return "Category Details";
      case "subcategory":
        return "Subcategory Details";
      case "challenge":
        return "Challenge Details";
      case "inspiration":
        return "Daily Inspiration Details";
      default:
        return "Video Details";
    }
  };

  // Helper function to get appropriate icon based on type
  const getTitleIcon = () => {
    switch (type) {
      case "challenge":
        return <TrophyOutlined style={{ color: "#CA3939" }} />;
      case "inspiration":
        return <HeartOutlined style={{ color: "#CA3939" }} />;
      case "category":
      case "subcategory":
        return <FolderOutlined style={{ color: "#CA3939" }} />;
      default:
        return <PlayCircleOutlined style={{ color: "#CA3939" }} />;
    }
  };

  const InfoItem = ({ icon, label, children, span = 24, hidden = false }) => {
    if (hidden) return null;
    
    return (
      <Col span={span}>
        <Card
          size="small"
          bordered={false}
          style={{
            backgroundColor: "#fafafa",
            marginBottom: 12,
            borderRadius: 8,
          }}
        >
          <Space align="start" style={{ width: "100%" }}>
            <div style={{ color: "#CA3939", fontSize: 16, marginTop: 2 }}>
              {icon}
            </div>
            <div style={{ flex: 1 }}>
              <Text strong style={{ color: "#595959", fontSize: 12 }}>
                {label}
              </Text>
              <div style={{ marginTop: 4 }}>{children}</div>
            </div>
          </Space>
        </Card>
      </Col>
    );
  };

  const MediaSection = ({ title, children }) => (
    <Card
      title={title}
      size="small"
      style={{
        marginBottom: 16,
        borderRadius: 12,
        boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
      }}
      headStyle={{
        backgroundColor: "#f8f9fa",
        fontSize: 14,
        fontWeight: 600,
      }}
    >
      {children}
    </Card>
  );

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return moment(dateString).format("MMMM DD, YYYY - hh:mm A");
  };

  return (
    <Modal
      title={
        <Space>
          {getTitleIcon()}
          <Text strong style={{ fontSize: 18 }}>
            {getModalTitle()}
          </Text>
        </Space>
      }
      open={visible}
      onCancel={onCancel}
      footer={null}
      width={800}
      centered
      closeIcon={
        <CloseCircleOutlined style={{ color: "#ff4d4f", fontSize: 18 }} />
      }
      styles={{
        body: {
          padding: "24px",
          maxHeight: "70vh",
          overflowY: "auto",
        },
      }}
    >
      {currentVideo && (
        <div>
          {/* Title Section */}
          <Card
            style={{
              marginBottom: 20,
              background: "linear-gradient(135deg, #CA3939 0%, #DE5555 100%)",
              border: "none",
              borderRadius: 12,
            }}
          >
            <Title
              level={3}
              style={{
                color: "white",
                margin: 0,
                textAlign: "center",
              }}
            >
              {currentVideo?.title}
            </Title>
          </Card>

          {/* Basic Info Grid */}
          <Row gutter={[12, 0]} style={{ marginBottom: 20 }}>
            {/* Category */}
            <InfoItem 
              icon={<FolderOutlined />} 
              label="CATEGORY" 
              span={12}
              hidden={!currentVideo?.category && !currentVideo?.categoryId}
            >
              <Tag
                color="#CA3939"
                style={{
                  fontWeight: 500,
                  color: "white",
                  borderColor: "#CA3939",
                }}
              >
                {currentVideo?.category || "General"}
              </Tag>
            </InfoItem>

            {/* Sub Category / Challenge / Status */}
            <InfoItem
              icon={<FolderOutlined />}
              label={
                currentVideo?.subCategory ? "SUB CATEGORY" :
                currentVideo?.challengeName ? "CHALLENGE" :
                "STATUS"
              }
              span={12}
            >
              <Tag
                color={
                  currentVideo?.subCategory || currentVideo?.challengeName 
                    ? "#DE5555" 
                    : getStatusInfo(currentVideo?.status).color
                }
                style={{
                  fontWeight: 500,
                  color: "white",
                  borderColor: 
                    currentVideo?.subCategory || currentVideo?.challengeName 
                      ? "#DE5555" 
                      : getStatusInfo(currentVideo?.status).color,
                }}
                icon={
                  !currentVideo?.subCategory && !currentVideo?.challengeName 
                    ? getStatusInfo(currentVideo?.status).icon 
                    : null
                }
              >
                {currentVideo?.subCategory || 
                 currentVideo?.challengeName || 
                 currentVideo?.status?.toUpperCase() || 
                 "ACTIVE"}
              </Tag>
            </InfoItem>

            {/* Duration */}
            <InfoItem
              icon={<ClockCircleOutlined />}
              label="DURATION"
              span={12}
              hidden={!currentVideo?.duration}
            >
              <Text strong style={{ color: "#CA3939" }}>
                {currentVideo?.duration}
              </Text>
            </InfoItem>

            {/* Equipment */}
            <InfoItem 
              icon={<ToolOutlined />} 
              label="EQUIPMENT" 
              span={12}
              hidden={!currentVideo?.equipment || currentVideo?.equipment.length === 0}
            >
              <Space wrap>
                {currentVideo?.equipment?.map((eq, index) => (
                  <Tag
                    key={index}
                    style={{
                      borderRadius: 12,
                      fontWeight: 500,
                      backgroundColor: "#CA3939",
                      color: "white",
                      borderColor: "#CA3939",
                    }}
                  >
                    {eq}
                  </Tag>
                ))}
              </Space>
            </InfoItem>

            {/* Serial Number */}
            {/* <InfoItem
              icon={<>#</>}
              label="SERIAL"
              span={12}
              hidden={!currentVideo?.serial}
            >
              <Text strong style={{ color: "#CA3939" }}>
                #{currentVideo?.serial}
              </Text>
            </InfoItem> */}

            {/* Publish Date (for challenges and inspiration) */}
            <InfoItem
              icon={<CalendarOutlined />}
              label="PUBLISH DATE"
              span={12}
              hidden={!currentVideo?.publishAt}
            >
              <Text style={{ color: "#595959", fontSize: 12 }}>
                {formatDate(currentVideo?.publishAt)}
              </Text>
            </InfoItem>

            {/* Created Date */}
            <InfoItem
              icon={<CalendarOutlined />}
              label="CREATED"
              span={currentVideo?.publishAt ? 12 : 24}
              hidden={!currentVideo?.createdAt}
            >
              <Text style={{ color: "#595959", fontSize: 12 }}>
                {formatDate(currentVideo?.createdAt)}
              </Text>
            </InfoItem>

            {/* Type (for subcategory) */}
            <InfoItem
              icon={<FolderOutlined />}
              label="TYPE"
              span={12}
              hidden={!currentVideo?.type}
            >
              <Tag color="#52c41a" style={{ fontWeight: 500 }}>
                {currentVideo?.type?.toUpperCase()}
              </Tag>
            </InfoItem>
          </Row>

          {/* Media Grid */}
          <Row gutter={16}>
            {/* Thumbnail */}
            <Col xs={24} md={12}>
              <MediaSection title="📸 Thumbnail">
                <div
                  style={{
                    width: "100%",
                    height: 200,
                    backgroundColor: "#f5f5f5",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    overflow: "hidden",
                    borderRadius: 8,
                    border: "2px dashed #d9d9d9",
                  }}
                >
                  {currentVideo?.thumbnailUrl ? (
                    <img
                      src={getVideoAndThumbnail(currentVideo?.thumbnailUrl)}
                      alt="thumbnail"
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        borderRadius: 6,
                      }}
                      onError={(e) => {
                        e.target.style.display = "none";
                        e.target.nextSibling.style.display = "flex";
                      }}
                    />
                  ) : (
                    <Text type="secondary">No thumbnail available</Text>
                  )}
                  <div style={{ display: "none" }}>
                    <Text type="secondary">Failed to load thumbnail</Text>
                  </div>
                </div>
              </MediaSection>
            </Col>

            {/* Video */}
            <Col xs={24} md={12}>
              <MediaSection title="🎥 Video Preview">
                <div style={{ textAlign: "center" }}>
                  {currentVideo?.videoUrl ? (
                    <video
                      src={getVideoAndThumbnail(currentVideo.videoUrl)}
                      controls
                      preload="metadata"
                      style={{
                        width: "100%",
                        maxWidth: "350px",
                        height: "200px",
                        objectFit: "contain",
                        borderRadius: 8,
                        boxShadow: "0 4px 12px rgba(202, 57, 57, 0.2)",
                      }}
                      onError={(e) => {
                        e.target.style.display = "none";
                        e.target.nextSibling.style.display = "flex";
                      }}
                    />
                  ) : (
                    <div
                      style={{
                        height: 200,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        backgroundColor: "#f5f5f5",
                        borderRadius: 8,
                        border: "2px dashed #d9d9d9",
                      }}
                    >
                      <Text type="secondary">No video available</Text>
                    </div>
                  )}
                  <div 
                    style={{ 
                      height: 200,
                      display: "none",
                      alignItems: "center",
                      justifyContent: "center",
                      backgroundColor: "#f5f5f5",
                      borderRadius: 8,
                      border: "2px dashed #d9d9d9",
                    }}
                  >
                    <Text type="secondary">Failed to load video</Text>
                  </div>
                </div>
              </MediaSection>
            </Col>
          </Row>

          {/* Description */}
          {currentVideo?.description && (
            <Card
              title="📝 Description"
              size="small"
              style={{
                marginTop: 16,
                borderRadius: 12,
                boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
              }}
              headStyle={{
                backgroundColor: "#f8f9fa",
                fontSize: 14,
                fontWeight: 600,
              }}
            >
              <Paragraph
                style={{
                  margin: 0,
                  lineHeight: 1.6,
                  color: "#595959",
                }}
              >
                {currentVideo?.description}
              </Paragraph>
            </Card>
          )}

          {/* Comments Section (if available) */}
          {currentVideo?.comments && currentVideo.comments.length > 0 && (
            <Card
              title="💬 Comments"
              size="small"
              style={{
                marginTop: 16,
                borderRadius: 12,
                boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
              }}
              headStyle={{
                backgroundColor: "#f8f9fa",
                fontSize: 14,
                fontWeight: 600,
              }}
            >
              <Text style={{ color: "#595959" }}>
                {currentVideo.comments.length} comment(s) available
              </Text>
            </Card>
          )}
        </div>
      )}
    </Modal>
  );
};

export default VideoDetailsModal;