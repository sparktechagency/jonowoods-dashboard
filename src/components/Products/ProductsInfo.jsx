import React, { useState } from "react";
import {
  Table,
  Button,
  Dropdown,
  Space,
  Modal,
  Form,
  Input,
  DatePicker,
} from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  DownOutlined,
  UserOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import GradientButton from "../common/GradiantButton";
import { Filtering } from "../common/Svg";



const Quotationmanagement = () => {
  const [form] = Form.useForm();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [data, setData] = useState([
    {
      key: "1",
      quotation:
        "Yoga is the journey of the self, through the self, to the self",
      date: "01-02-2025",
      status: "Active",
    },
    {
      key: "2",
      quotation:
        "Yoga is the journey of the self, through the self, to the self",
      date: "01-02-2025",
      status: "Active",
    },
    {
      key: "3",
      quotation:
        "Yoga is the journey of the self, through the self, to the self",
      date: "01-02-2025",
      status: "Active",
    },
    {
      key: "4",
      quotation:
        "Yoga is the journey of the self, through the self, to the self",
      date: "01-02-2025",
      status: "Active",
    },
    {
      key: "5",
      quotation:
        "Yoga is the journey of the self, through the self, to the self",
      date: "01-02-2025",
      status: "Active",
    },
    {
      key: "6",
      quotation:
        "Yoga is the journey of the self, through the self, to the self",
      date: "01-02-2025",
      status: "Active",
    },
    {
      key: "7",
      quotation:
        "Yoga is the journey of the self, through the self, to the self",
      date: "01-02-2025",
      status: "Inactive",
    },
    {
      key: "8",
      quotation:
        "Yoga is the journey of the self, through the self, to the self",
      date: "01-02-2025",
      status: "Active",
    },
  ]);
  const [filteredData, setFilteredData] = useState(data);
  const [editRecord, setEditRecord] = useState(null); // Track the record being edited
  const [selectedStatus, setSelectedStatus] = useState("All"); // Track selected status in dropdown

  const showModal = () => {
    setIsModalVisible(true);
  };

  const updateSlNumbers = (newData) => {
    return newData.map((item, index) => ({
      ...item,
      sl: index + 1, // Set sl as index + 1 (starting from 1)
    }));
  };

  const handleOk = () => {
    form.validateFields().then((values) => {
      const newData = [...data];
      const newKey = (parseInt(data[data.length - 1].key) + 1).toString();

      if (editRecord) {
        // Update the edited record
        const index = newData.findIndex((item) => item.key === editRecord.key);
        newData[index] = {
          ...newData[index],
          quotation: values.quotation,
          date: values.date.format("DD-MM-YYYY"),
        };
      } else {
        // Add a new record
        newData.push({
          key: newKey,
          quotation: values.quotation,
          date: values.date.format("DD-MM-YYYY"),
          status: "Active",
        });
      }

      // Update serial numbers after add/edit
      const updatedData = updateSlNumbers(newData);
      setData(updatedData);
      setFilteredData(
        updatedData.filter(
          (item) => selectedStatus === "All" || item.status === selectedStatus
        )
      ); // Update filtered data
      setIsModalVisible(false);
      setEditRecord(null); // Reset the edit record
      form.resetFields();
    });
  };

  const handleDelete = (key) => {
    const newData = data.filter((item) => item.key !== key);
    const updatedData = updateSlNumbers(newData); // Recalculate serial numbers after delete
    setData(updatedData);
    setFilteredData(
      updatedData.filter(
        (item) => selectedStatus === "All" || item.status === selectedStatus
      )
    ); // Update filtered data
  };

  const handleEdit = (record) => {
    setEditRecord(record);
    showModal();
    form.setFieldsValue({
      quotation: record.quotation,
      date: dayjs(record.date, "DD-MM-YYYY"),
    });
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
    setEditRecord(null); // Reset the edit record
  };

  const handleStatusChange = (status) => {
    setSelectedStatus(status);
    setFilteredData(
      data.filter((item) => status === "All" || item.status === status)
    );
  };

  const items = [
    {
      key: "All",
      label: "All",
    },
    {
      key: "Active",
      label: "Active",
    },
    {
      key: "Inactive",
      label: "Inactive",
    },
  ];

  const columns = [
    {
      title: "SL",
      dataIndex: "key",
      key: "key",
      width: "5%",
      align: "center",
    },
    {
      title: "Quotation",
      dataIndex: "quotation",
      key: "quotation",
      width: "35%",
      align: "center",
    },
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
      width: "15%",
      align: "center",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      width: "15%",
      align: "center",
    },
    {
      title: "Action",
      key: "action",
      width: "15%",
      align: "center",
      render: (_, record) => (
        <Space size="middle">
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
            className="text-blue-500"
          />
          <Button
            type="text"
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record.key)}
            className="text-red-500"
          />
        </Space>
      ),
    },
  ];

  return (
    <div className="p-4">
      <div className="flex justify-between mb-4">
        <Dropdown
          menu={{
            items: items.map((item) => ({
              ...item,
              onClick: () => handleStatusChange(item.key),
            })),
          }}
          placement="bottomLeft"
        >
          <Button className="bg-red-500 text-white hover:bg-red-600 py-5">
            <Space>
              <Filtering className="filtering-icon" />
              {selectedStatus} <DownOutlined />
            </Space>
          </Button>
        </Dropdown>

        <GradientButton
          type="primary"
          onClick={showModal}
          className="bg-red-500 text-white hover:bg-red-600 py-5"
        >
          <PlusOutlined /> Add New Quotation
        </GradientButton>
      </div>

      <Table
        columns={columns}
        dataSource={filteredData}
        pagination={true} // Enable pagination
        className="border rounded"
        rowClassName="hover:bg-gray-50"
      />

      <Modal
        title={editRecord ? "Edit Quotation" : "Add New Quotation"}
        open={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        okButtonProps={{ className: "bg-red-500 hover:bg-red-600" }}
      >
        <Form form={form} layout="vertical" name="quotation_form">
          <Form.Item
            name="quotation"
            label="Quotation"
            rules={[
              { required: true, message: "Please input your quotation!" },
            ]}
          >
            <Input.TextArea rows={4} />
          </Form.Item>
          <Form.Item
            name="date"
            label="Date"
            rules={[{ required: true, message: "Please select a date!" }]}
          >
            <DatePicker style={{ width: "100%" }} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Quotationmanagement;
