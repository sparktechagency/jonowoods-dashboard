import React from "react";
import { Table, Button, Space, Switch, Tag } from "antd";
import { EditOutlined } from "@ant-design/icons";
import { getImageUrl } from "../../common/imageUrl";

const SubCategoryTable = ({
  subCategories,
  onEdit,
  onStatusChange,
  onDelete,
}) => {
  const columns = [
    {
      title: "SL",
      key: "id",
      width: 60,
      align: "center",
      render: (_, __, index) => index + 1,
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      align: "center",
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
            style={{ width: 100, height: 40, objectFit: "contain" }}
          />
        </div>
      ),
      align: "center",
    },
    {
      title: "Videos",
      dataIndex: "videoCount",
      key: "videoCount",
      align: "center",
      render: (videoCount) => videoCount || 0,
    },
    {
      title: "Created Date",
      dataIndex: "createdDate",
      key: "createdDate",
      align: "center",
    },
    {
      title: "Category Type",
      dataIndex: "categoryType",
      key: "categoryType",
      render: (type) => (
        <Tag color={type === "Free" ? "green" : "blue"}>{type || "Free"}</Tag>
      ),
      align: "center",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      align: "center",
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
          <Switch
            checked={record.status.toLowerCase() === "active"}
            size="small"
            onChange={(checked) => onStatusChange(checked, record)}
          />
        </Space>
      ),
      align: "center",
    },
  ];

  return (
    <Table
      columns={columns}
      dataSource={subCategories}
      rowKey="_id"
      pagination={{ pageSize: 10 }}
      bordered
      size="small"
    />
  );
};

export default SubCategoryTable;
