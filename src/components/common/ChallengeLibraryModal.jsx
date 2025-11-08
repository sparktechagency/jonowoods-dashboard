import React from "react";
import { Modal, Button, Table, Space } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { getImageUrl, getVideoAndThumbnail } from "./imageUrl";

const ChallengeLibraryModal = ({
  visible,
  onCancel,
  onSelectChallenge,
  availableChallenges = [],
  loading = false,
  pagination = { current: 1, pageSize: 10, total: 0 },
  onPaginationChange,
  title = "Challenge Library",
  selectButtonText = "Select Challenge",
}) => {
  // Handle pagination change
  const handlePaginationChange = (page, size) => {
    if (onPaginationChange) {
      onPaginationChange(page, size);
    }
  };

  // Handle challenge selection
  const handleSelectChallenge = (challenge) => {
    if (onSelectChallenge) {
      onSelectChallenge(challenge);
    }
  };

  // Challenge table columns
  const challengeColumns = [
    {
      title: "Image",
      dataIndex: "image",
      key: "image",
      width: "15%",
      align: "center",
      render: (image, record) => (
        <div className="flex justify-center">
          {image && (
            <img
              src={getImageUrl(image)}
              alt={record.name || "Challenge"}
              style={{ width: 60, height: 60, objectFit: "cover" }}
              className="rounded-lg"
            />
          )}
        </div>
      ),
    },
    {
      title: "Challenge Name",
      dataIndex: "name",
      key: "name",
      width: "30%",
      render: (name, record) => (
        <div>
          <p className="font-medium text-base">{name || "Untitled Challenge"}</p>
          {record.description && (
            <p className="text-xs text-gray-500 mt-1">
              {record.description.length > 100
                ? `${record.description.substring(0, 100)}...`
                : record.description}
            </p>
          )}
        </div>
      ),
    },
    // {
    //   title: "Videos",
    //   dataIndex: "videos",
    //   key: "videos",
    //   width: "15%",
    //   align: "center",
    //   render: (videos) => (
    //     <span className="text-sm font-medium">
    //       {Array.isArray(videos) ? videos.length : 0} Videos
    //     </span>
    //   ),
    // },
    // {
    //   title: "Status",
    //   dataIndex: "status",
    //   key: "status",
    //   width: "15%",
    //   align: "center",
    //   render: (status) => (
    //     <span
    //       className={`px-3 py-1 rounded-full text-xs font-medium ${
    //         status === "active"
    //           ? "bg-green-100 text-green-800"
    //           : "bg-gray-100 text-gray-800"
    //       }`}
    //     >
    //       {status === "active" ? "Active" : "Inactive"}
    //     </span>
    //   ),
    // },
    {
      title: "Actions",
      key: "actions",
      width: "25%",
      align: "center",
      render: (_, record) => (
        <Button
          type="primary"
          size="small"
          icon={<PlusOutlined />}
          onClick={() => handleSelectChallenge(record)}
          className="bg-primary text-white h-9"
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
      width={700}
    >
      <div style={{ width: "100%" }}>
        <Table
          columns={challengeColumns}
          dataSource={availableChallenges}
          rowKey="_id"
          loading={loading}
          pagination={{
            current: pagination.current,
            pageSize: pagination.pageSize,
            total: pagination.total,
            onChange: handlePaginationChange,
            onShowSizeChange: handlePaginationChange,
          }}
          locale={{ emptyText: "No challenges available" }}
          scroll={{ x: "max-content" }}
          style={{ width: "100%" }}
          tableLayout="auto"
        />
      </div>
    </Modal>
  );
};

export default ChallengeLibraryModal;