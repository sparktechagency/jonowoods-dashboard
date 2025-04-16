import React from "react";
import { Table, Button, Space, Switch, Tag } from "antd";
import { EditOutlined, EyeOutlined } from "@ant-design/icons";

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
      dataIndex: "id",
      key: "id",
      width: 60,
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
            src={thumbnail}
            alt="thumbnail"
            style={{ width: 100, height: 40 }}
          />
        </div>
      ),
    },
    {
      title: "Sub Category",
      dataIndex: "subCategoryCount",
      key: "subCategoryCount",
    },
    {
      title: "Videos",
      dataIndex: "videoCount",
      key: "videoCount",
    },
    {
      title: "Created Date",
      dataIndex: "createdDate",
      key: "createdDate",
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
      // render: (status, record) => (
      //   <Switch
      //     checked={status === "Active"}
      //     onChange={(checked) => onStatusChange(checked, record)}
      //     size="small"
      //   />
      // ),
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
            checked={record.status === "Active"}
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
      rowKey="id"
      pagination={{ pageSize: 10 }}
      bordered
    />
  );
};

export default CategoryTable;
