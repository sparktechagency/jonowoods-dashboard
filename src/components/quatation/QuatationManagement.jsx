import React, { useState, useEffect } from "react";
import {
  Table,
  Button,
  Dropdown,
  Space,
  Modal,
  Form,
  Input,
  DatePicker,
  Switch,
  message,
  Spin,
} from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  DownOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import GradientButton from "../common/GradiantButton";
import {
  useGetAllQuotationsQuery,
  useCreateQuotationMutation,
  useUpdateQuotationMutation,
  useDeleteQuotationMutation,
  useToggleQuotationStatusMutation,
} from "../../redux/apiSlices/quatationApi";

const FilteringIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    style={{ marginRight: "8px" }}
  >
    <path
      d="M0.75 4.2308H12.169C12.5131 5.79731 13.9121 6.97336 15.5805 6.97336C17.2488 6.97336 18.6478 5.79736 18.9919 4.2308H23.25C23.6642 4.2308 24 3.89498 24 3.4808C24 3.06661 23.6642 2.7308 23.25 2.7308H18.9915C18.6467 1.16508 17.2459 -0.0117188 15.5805 -0.0117188C13.9141 -0.0117188 12.5139 1.16489 12.1693 2.7308H0.75C0.335812 2.7308 0 3.06661 0 3.4808C0 3.89498 0.335812 4.2308 0.75 4.2308ZM13.588 3.48277L13.588 3.4747C13.5913 2.37937 14.4851 1.48833 15.5805 1.48833C16.6743 1.48833 17.5681 2.37816 17.5728 3.47297L17.573 3.48398C17.5712 4.58119 16.6781 5.47341 15.5805 5.47341C14.4833 5.47341 13.5904 4.58208 13.5879 3.48553L13.588 3.48277ZM23.25 19.769H18.9915C18.6467 18.2033 17.2459 17.0265 15.5805 17.0265C13.9141 17.0265 12.5139 18.2031 12.1693 19.769H23.25C23.6642 19.769 24 20.1047 24 20.519C24 20.9332 23.6642 21.269 23.25 21.269ZM15.5805 22.5115C14.4833 22.5115 13.5904 21.6202 13.5879 20.5237L13.588 20.5209L13.588 20.5129C13.5913 19.4175 14.4851 18.5265 15.5805 18.5265C16.6743 18.5265 17.5681 19.4163 17.5728 20.511L17.573 20.5221C17.5714 21.6194 16.6782 22.5115 15.5805 22.5115ZM23.25 11.2499H11.831C11.4869 9.68339 10.0879 8.50739 8.41955 8.50739C6.75117 8.50739 5.35223 9.68339 5.00808 11.2499H0.75C0.335812 11.2499 0 11.5857 0 11.9999C0 12.4141 0.335812 12.7499 0.75 12.7499H5.00845C5.35331 14.3156 6.75413 15.4924 8.41955 15.4924C10.0859 15.4924 11.4861 14.3158 11.8307 12.7499H23.25C23.6642 12.7499 24 12.4141 24 11.9999C24 11.5857 23.6642 11.2499 23.25 11.2499ZM10.412 11.9979L10.412 12.006C10.4087 13.1013 9.51492 13.9924 8.41955 13.9924C7.32572 13.9924 6.43191 13.1025 6.42717 12.0078L6.42703 11.9968C6.42867 10.8995 7.32188 10.0074 8.41955 10.0074C9.5167 10.0074 10.4096 10.8987 10.4121 11.9953L10.412 11.9979Z"
      fill="#000"
    />
  </svg>
);

const QuotationManagement = () => {
  const [form] = Form.useForm();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editRecord, setEditRecord] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [filteredData, setFilteredData] = useState([]);
  const [loadingStatusChange, setLoadingStatusChange] = useState(false);

  // RTK Query hooks
  const { data: quotations, isLoading, refetch } = useGetAllQuotationsQuery();
  const [createQuotation] = useCreateQuotationMutation();
  const [updateQuotation] = useUpdateQuotationMutation();
  const [deleteQuotation] = useDeleteQuotationMutation();
  const [toggleStatus] = useToggleQuotationStatusMutation();

  const quotationsData = quotations?.users;

  // Set filtered data when quotations data changes or filter changes
  useEffect(() => {
    if (quotationsData) {
      const formattedData = quotationsData?.map((item, index) => ({
        key: item._id || index.toString(),
        quotation: item.quotation,
        date: dayjs(item.releaseAt).format("DD-MM-YYYY"),
        status: item.status || "Active",
        _id: item._id,
      }));

      if (selectedStatus === "All") {
        setFilteredData(formattedData);
      } else {
        setFilteredData(
          formattedData.filter((item) => item.status === selectedStatus)
        );
      }
    }
  }, [quotationsData, selectedStatus]);

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = async () => {
    try {
      const values = await form.validateFields();

      const quotationData = {
        quotation: values.quotation,
        releaseAt: values.date.toISOString(),
      };

      if (editRecord) {
        // Update existing quotation
        await updateQuotation({
          id: editRecord._id,
          ...quotationData,
        });
        message.success("Quotation updated successfully");
      } else {
        // Create new quotation
        await createQuotation(quotationData);
        message.success("Quotation created successfully");
      }

      setIsModalVisible(false);
      setEditRecord(null);
      form.resetFields();
      refetch(); // Refresh the data
    } catch (error) {
      console.error("Form validation or submission error:", error);
      message.error("Failed to save quotation");
    }
  };

  const handleDelete = (id) => {
    Modal.confirm({
      title: "Are you sure you want to delete this quotation?",
      content: "This action cannot be undone.",
      okText: "Yes, Delete",
      okType: "danger",
      cancelText: "Cancel",
      onOk: async () => {
        try {
          await deleteQuotation(id);
          message.success("Quotation deleted successfully");
          refetch(); // Refresh the data
        } catch (error) {
          console.error("Delete error:", error);
          message.error("Failed to delete quotation");
        }
      },
    });
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
    setEditRecord(null);
  };

  const handleStatusChange = (status) => {
    setSelectedStatus(status);
  };

  const handleStatusToggle = async (checked, record) => {
    // Show confirmation dialog before changing status
    Modal.confirm({
      title: `Are you sure you want to change this quotation status to ${
        checked ? "Active" : "Inactive"
      }?`,
      okButtonProps: {
        style: {
          backgroundColor: "transparent", // Remove background color
          border: "1px solid #1890ff", // Add a border to the OK button
          color: "#1890ff", // Optional: change the text color
        },
      },
      cancelButtonProps: {
        style: {
          backgroundColor: "transparent", // Remove background color for Cancel button
          border: "1px solid #ff4d4f", // Add a border to the Cancel button
          color: "#ff4d4f", // Optional: change the text color for Cancel
        },
      },
      onOk: async () => {
        setLoadingStatusChange(true); // Set loading state before making API request
        try {
          const newStatus = checked ? "active" : "inactive";
          await toggleStatus({
            id: record._id,
            status: newStatus,
          });
          message.success(`Quotation ${newStatus.toLowerCase()} successfully`);
          refetch(); // Refresh the data
        } catch (error) {
          console.error("Status toggle error:", error);
          message.error("Failed to update status");
        } finally {
          setLoadingStatusChange(false); // Reset loading state after API request
        }
      },
    });
  };

  const items = [
    { key: "All", label: "All" },
    { key: "active", label: "Active" },
    { key: "inactive", label: "Inactive" },
  ];

  const columns = [
    {
      title: "SL",
      key: "sl",
      width: "5%",
      align: "center",
      render: (_, __, index) => index + 1,
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
      render: (status, record) => (
        <Switch
          checked={status === "active"}
          onChange={(checked) => handleStatusToggle(checked, record)}
          loading={loadingStatusChange}
        />
      ),
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
            onClick={() => handleDelete(record._id)}
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
          <Button
            className="mr-2 bg-red-600 py-5 text-white hover:text-black hover:icon-black"
            style={{ border: "none" }}
          >
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
        pagination={true}
        loading={isLoading}
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
