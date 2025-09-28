import React from "react";
import { Button, Tag, Space, Switch } from "antd";
import {
  EditOutlined,
  EyeOutlined,
  DeleteOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import { getVideoAndThumbnail } from "../common/imageUrl";
import moment from "moment/moment";

// Table columns configuration
export const getTableColumns = ({
  showFormModal,
  showDetailsModal,
  handleStatusChange,
  handleDeleteVideo,
}) => [
{
  title: "Serial",
  dataIndex: "serial",
  key: "serial",
  align: "center",
  render: (text, record, index) => {
    return `# ${index + 1}`;
  },
},
  {
    title: "Video Title",
    dataIndex: "title",
    key: "title",
    align: "center",
    width: 350
  },
  {
    title: "Thumbnail",
    dataIndex: "thumbnailUrl",
    key: "thumbnailUrl",
    align: "center",
    render: (_, record) => (
      <div style={{ display: "flex", justifyContent: "center" }}>
        <img
          src={getVideoAndThumbnail(record.thumbnailUrl)}
          alt="thumbnail"
          style={{
            width: 100,
            height: 50,
            objectFit: "cover",
          }}
          className="rounded-lg"
        />
      </div>
    ),
  },
  // {
  //   title: "Upload Date",
  //   dataIndex: "createdAt",
  //   key: "createdAt",
  //   align: "center",
  //   render: (text) => moment(text).format("L"),
  // },
  {
    title: "Duration",
    dataIndex: "duration",
    key: "duration",
    align: "center",
  },
  // {
  //   title: "Status",
  //   dataIndex: "status",
  //   key: "status",
  //   align: "center",
  //   render: (status) => (
  //     <Tag color={status === "active" ? "success" : "error"}>
  //       {status === "active" ? "Active" : "Inactive"}
  //     </Tag>
  //   ),
  // },
  {
    title: "Action",
    key: "action",
    align: "center",
    render: (_, record) => (
      <Space size="small">
        <Button
          type="text"
          icon={<EditOutlined style={{ color: "#f55" }} />}
          onClick={() => showFormModal(record)}
        />
        <Button
          type="text"
          icon={<EyeOutlined style={{ color: "#55f" }} />}
          onClick={() => showDetailsModal(record)}
        />
        {/* <Switch
          size="small"
          checked={record.status === "active"}
          onChange={(checked) => handleStatusChange(checked, record)}
          style={{
            backgroundColor: record.status === "active" ? "red" : "gray",
          }}
        /> */}
        <Button
          type="text"
          icon={<DeleteOutlined style={{ color: "#ff4d4f" }} />}
          onClick={() => handleDeleteVideo(record._id)}
        />
      </Space>
    ),
  },
];

// Schedule Modal Video Columns configuration
export const getScheduleVideoColumns = ({ handleAddToSchedule }) => [
  {
    title: "Video",
    dataIndex: "title",
    key: "video",
    render: (_, record) => (
      <div className="flex items-center">
        {record.thumbnailUrl && (
          <img
            src={getVideoAndThumbnail(record.thumbnailUrl)}
            alt={record.title || "Thumbnail"}
            style={{ width: 80, height: 45, objectFit: "cover" }}
            className="mr-3 rounded"
          />
        )}
        <div>
          <p className="font-medium">{record.title || "Untitled Video"}</p>
          {record.duration && (
            <p className="text-xs text-gray-500">Duration: {record.duration}</p>
          )}
          {record.category && (
            <p className="text-xs text-gray-500">Category: {record.category}</p>
          )}
        </div>
      </div>
    ),
  },
  {
    title: "Actions",
    key: "actions",
    render: (_, record) => (
      <Button
        type="primary"
        size="small"
        icon={<PlusOutlined />}
        onClick={() => handleAddToSchedule(record)}
        className="bg-primary text-white h-10"
      >
        Add Video
      </Button>
    ),
  },
];

export default {
  getTableColumns,
  getScheduleVideoColumns,
};