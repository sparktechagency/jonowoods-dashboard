import React from "react";
import { Table, Button, Space, Switch, Tag } from "antd";
import { EditOutlined, EyeOutlined } from "@ant-design/icons";
import moment from "moment/moment";
import { getImageUrl } from "../common/imageUrl";

const CategoryTable = ({
  categories,
  onEdit,
  onView,
  onStatusChange,
  onDelete,
}) => {
  const columns = [
    {
      title: "SL",
      key: "id",
      width: 60,
      render: (_, __, index) => index + 1,
    },
    {
      title: "Category Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Thumbnail",
      dataIndex: "thumbnail",
      key: "thumbnail",
      render: (thumbnail) => (
        <div style={{ display: "flex", justifyContent: "center" }}>
          <img
            src={getImageUrl(thumbnail)}
            alt="thumbnail"
            className="object-cover rounded-xl"
            style={{ width: 100, height: 60 }}
          />
        </div>
      ),
    },
    {
      title: "Sub Category",
      dataIndex: "subCategory",
      key: "subCategory",
      render: (subCategory) => {
        return Array.isArray(subCategory) ? subCategory.length : 0;
      },
    },
    {
      title: "Videos",
      dataIndex: "videoCount",
      key: "videoCount",
      render: (videoCount) => videoCount || 0,
    },
    {
      title: "Created Date",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (createdAt) => moment(createdAt).format("L"),
    },
    {
      title: "Category Type",
      dataIndex: "categoryType",
      key: "categoryType",
      render: (type) => (
        <Tag color={type === "Free" ? "green" : "blue"}>{type}</Tag>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <Tag color={status.toLowerCase() === "active" ? "green" : "red"}>
          {status}
        </Tag>
      ),
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Space>
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => onEdit(record)}
            className="text-blue-500"
          />
          <Button
            type="text"
            icon={<EyeOutlined />}
            onClick={() => onView(record)}
            className="text-green-500"
          />
          <Switch
            checked={record.status.toLowerCase() === "active"}
            size="small"
            onChange={(checked) => onStatusChange(checked, record)}
          />
        </Space>
      ),
    },
  ];

  return (
    <Table
      columns={columns}
      dataSource={categories}
      rowKey="_id"
      pagination={{ pageSize: 10 }}
      bordered
      size="small"
    />
  );
};

export default CategoryTable;
