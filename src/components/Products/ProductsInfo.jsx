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


const FilteringIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    style={{ marginRight: "8px" }} // Add some spacing between the icon and text
  >
    <path
      d="M0.75 4.2308H12.169C12.5131 5.79731 13.9121 6.97336 15.5805 6.97336C17.2488 6.97336 18.6478 5.79736 18.9919 4.2308H23.25C23.6642 4.2308 24 3.89498 24 3.4808C24 3.06661 23.6642 2.7308 23.25 2.7308H18.9915C18.6467 1.16508 17.2459 -0.0117188 15.5805 -0.0117188C13.9141 -0.0117188 12.5139 1.16489 12.1693 2.7308H0.75C0.335812 2.7308 0 3.06661 0 3.4808C0 3.89498 0.335812 4.2308 0.75 4.2308ZM13.588 3.48277L13.588 3.4747C13.5913 2.37937 14.4851 1.48833 15.5805 1.48833C16.6743 1.48833 17.5681 2.37816 17.5728 3.47297L17.573 3.48398C17.5712 4.58119 16.6781 5.47341 15.5805 5.47341C14.4833 5.47341 13.5904 4.58208 13.5879 3.48553L13.588 3.48277ZM23.25 19.769H18.9915C18.6467 18.2033 17.2459 17.0265 15.5805 17.0265C13.9141 17.0265 12.5139 18.2031 12.1693 19.769H23.25C23.6642 19.769 24 20.1047 24 20.519C24 20.9332 23.6642 21.269 23.25 21.269ZM15.5805 22.5115C14.4833 22.5115 13.5904 21.6202 13.5879 20.5237L13.588 20.5209L13.588 20.5129C13.5913 19.4175 14.4851 18.5265 15.5805 18.5265C16.6743 18.5265 17.5681 19.4163 17.5728 20.511L17.573 20.5221C17.5714 21.6194 16.6782 22.5115 15.5805 22.5115ZM23.25 11.2499H11.831C11.4869 9.68339 10.0879 8.50739 8.41955 8.50739C6.75117 8.50739 5.35223 9.68339 5.00808 11.2499H0.75C0.335812 11.2499 0 11.5857 0 11.9999C0 12.4141 0.335812 12.7499 0.75 12.7499H5.00845C5.35331 14.3156 6.75413 15.4924 8.41955 15.4924C10.0859 15.4924 11.4861 14.3158 11.8307 12.7499H23.25C23.6642 12.7499 24 12.4141 24 11.9999C24 11.5857 23.6642 11.2499 23.25 11.2499ZM10.412 11.9979L10.412 12.006C10.4087 13.1013 9.51492 13.9924 8.41955 13.9924C7.32572 13.9924 6.43191 13.1025 6.42717 12.0078L6.42703 11.9968C6.42867 10.8995 7.32188 10.0074 8.41955 10.0074C9.5167 10.0074 10.4096 10.8987 10.4121 11.9953L10.412 11.9979Z"
      fill="#000" // Set the color of the icon to black or any other color
    />
  </svg>
);

const QuotationManagement = () => {
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
  ]

  const columns = [
    {
      title: "SL",
      dataIndex: "key",
      key: "key",
      width: "5%",
    },
    {
      title: "Quotation",
      dataIndex: "quotation",
      key: "quotation",
      width: "40%",
    },
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
      width: "15%",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      width: "15%",
    },
    {
      title: "Action",
      key: "action",
      width: "15%",
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
              <FilteringIcon className="filtering-icon" />
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

export default QuotationManagement;
