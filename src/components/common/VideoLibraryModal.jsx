import React from "react";
import { Modal, Button, Table, Space } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { getVideoAndThumbnail } from "./imageUrl";
import Thumbnail from "../videoManagement/Thumbnail";

const VideoLibraryModal = ({
  visible,
  onCancel,
  onSelectVideo,
  availableVideos = [],
  loading = false,
  pagination = { current: 1, pageSize: 10, total: 0 },
  onPaginationChange,
  title = "Video Library",
  selectButtonText = "Select Video",
}) => {
  // Handle pagination change
  const handlePaginationChange = (page, size) => {
    if (onPaginationChange) {
      onPaginationChange(page, size);
    }
  };

  // Handle video selection
  const handleSelectVideo = (video) => {
    if (onSelectVideo) {
      onSelectVideo(video);
    }
  };

  // Video table columns
  const videoColumns = [
    {
      title: "Video",
      dataIndex: "title",
      key: "video",
      width: "70%",
      render: (_, record) => (
        <div className="flex items-center">
          {record.thumbnailUrl && (
            <Thumbnail
              thumbnailUrl={getVideoAndThumbnail(record.thumbnailUrl)}
              alt={record.title || "Thumbnail"}
              style={{ width: 80, height: 45, objectFit: "cover" }}
              className="mr-3 rounded"
            />
          )}
          <div>
            <p className="font-medium max-w-[400px] overflow-hidden text-ellipsis whitespace-nowrap">{record.title || "Untitled Video"}</p>
            {record.duration && (
              <p className="text-xs text-gray-500">
                Duration: {record.duration}
              </p>
            )}
            {record.category && (
              <p className="text-xs text-gray-500">
                Category: {record.category}
              </p>
            )}
          </div>
        </div>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      width: "30%",
      align: "center",
      render: (_, record) => (
        <Button
          type="primary"
          size="small"
          icon={<PlusOutlined />}
          onClick={() => handleSelectVideo(record)}
          className="bg-primary text-white h-10"
        >
          {selectButtonText}
        </Button>
      ),
    },
  ];

  return (
    <Modal
      title={title}
      open={visible}
      onCancel={onCancel}
      footer={
        <div className="flex justify-end">
          <Button onClick={onCancel} className="text-black h-10">
            Cancel
          </Button>
        </div>
      }
      width={800}
    >
      <div style={{ width: "100%" }}>
        <Table
          columns={videoColumns}
          dataSource={availableVideos}
          rowKey="_id"
          loading={loading}
          pagination={{
            current: pagination.current,
            pageSize: pagination.pageSize,
            total: pagination.total,
            onChange: handlePaginationChange,
            onShowSizeChange: handlePaginationChange,
          }}
          locale={{ emptyText: "No videos available" }}
          scroll={{ x: "max-content" }}
          style={{ width: "100%" }}
          tableLayout="auto"
          size="middle"
          className="custom-table"
        />
      </div>
    </Modal>
  );
};

export default VideoLibraryModal;