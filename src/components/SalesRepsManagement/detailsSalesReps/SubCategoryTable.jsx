import React from "react";
import { Table, Button, Space, Switch, Tag } from "antd";
import { EditOutlined } from "@ant-design/icons";

const SubCategoryTable = ({
  subCategories,
  onEdit,
  onStatusChange,
  onDelete,
}) => {


  const columns = [
    {
      title: "SL",
      dataIndex: "id",
      key: "id",
      width: 60,
      align: "center",
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
            src={thumbnail}
            alt="thumbnail"
            style={{ width: 100, height: 40 }}
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
        <Tag color={type === "Free" ? "green" : "blue"}>{type}</Tag>
      ),
      align: "center",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      align: "center",
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
            checked={record.status === "Active"}
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
      rowKey="id"
      pagination={{ pageSize: 10 }}
      bordered
      size="small"
    />
  );
};

export default SubCategoryTable;
