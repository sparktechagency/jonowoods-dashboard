import React, { useState, useEffect, useRef } from "react";
import {
  Table,
  Button,
  Dropdown,
  Space,
  Modal,
  Form,
  DatePicker,
  Switch,
  message,
} from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  DownOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import JoditEditor from "jodit-react";
import GradientButton from "../common/GradiantButton";
import {
  useGetAllQuotationsQuery,
  useCreateQuotationMutation,
  useUpdateQuotationMutation,
  useDeleteQuotationMutation,
  useToggleQuotationStatusMutation,
} from "../../redux/apiSlices/quatationApi";
import { Filtering } from "../common/Svg";
import Spinner from "../common/Spinner";

const QuotationManagement = () => {
  const [form] = Form.useForm();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editRecord, setEditRecord] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [filteredData, setFilteredData] = useState([]);
  const [loadingStatusChange, setLoadingStatusChange] = useState(false);
  const [quotationContent, setQuotationContent] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const editor = useRef(null);

  // RTK Query hooks
  const { data: quotations, isLoading, refetch } = useGetAllQuotationsQuery();
  const [createQuotation] = useCreateQuotationMutation();
  const [updateQuotation] = useUpdateQuotationMutation();
  const [deleteQuotation] = useDeleteQuotationMutation();
  const [toggleStatus] = useToggleQuotationStatusMutation();

  const quotationsData = quotations?.data;
  const paginationInfo = quotations?.pagination;

  // Set filtered data when quotations data or filter changes
  useEffect(() => {
    if (quotationsData) {
      const formattedData = quotationsData.map((item, index) => ({
        key: item._id || index.toString(),
        quotation: item.quotation,
        date: dayjs(item.releaseAt), // <-- dayjs object here
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

  // Function to disable past dates
  const disablePastDates = (current) => {
    return current && current < dayjs().startOf('day');
  };

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = async () => {
    try {
      const values = await form.validateFields();

      // Remove HTML tags and trim to check actual content length
      const plainTextContent = quotationContent.replace(/<[^>]*>/g, '');
      const trimmedContent = plainTextContent.trim();
      
      // Validate minimum content length (10 characters) and not just spaces
      if (trimmedContent.length < 10) {
        message.error("Quotation must contain at least 10 characters!");
        return;
      }

      const quotationData = {
        quotation: quotationContent,
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
      setQuotationContent("");
      refetch();
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
          refetch();
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
    // record.date is already a dayjs object
    form.setFieldsValue({
      date: record.date,
    });
    setQuotationContent(record.quotation);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
    setEditRecord(null);
    setQuotationContent("");
  };

  const handleStatusChange = (status) => {
    setSelectedStatus(status);
    setCurrentPage(1);
  };

  const handleStatusToggle = async (checked, record) => {
    Modal.confirm({
      title: `Are you sure you want to change this quotation status to ${
        checked ? "Active" : "Inactive"
      }?`,
      okButtonProps: {
        className: "bg-primary hover:bg-primary/80 border-primary text-white",
      },
      cancelButtonProps: {
        style: {
          backgroundColor: "transparent",
          border: "1px solid #ff4d4f",
          color: "#ff4d4f",
        },
      },
      onOk: async () => {
        setLoadingStatusChange(true);
        try {
          const newStatus = checked ? "active" : "inactive";
          await toggleStatus({
            id: record._id,
            status: newStatus,
          });
          message.success(`Quotation ${newStatus} successfully`);
          refetch();
        } catch (error) {
          console.error("Status toggle error:", error);
          message.error("Failed to update status");
        } finally {
          setLoadingStatusChange(false);
        }
      },
    });
  };

  const handleTableChange = (pagination) => {
    setCurrentPage(pagination.current);
    setPageSize(pagination.pageSize);
  };

  const items = [
    { key: "All", label: "All" },
    { key: "active", label: "Active" },
    { key: "inactive", label: "Inactive" },
  ];

  const columns = [
    {
      title: <div className="text-center">SL</div>,
      key: "sl",
      width: "5%",
      render: (_, __, index) => (
        <div className="text-center">
          {(currentPage - 1) * pageSize + index + 1}
        </div>
      ),
    },
    {
      title: <div className="text-center">Quotation</div>,
      dataIndex: "quotation",
      key: "quotation",
      width: "35%",
      render: (text) => (
        <div
          className=" max-w-[300px] overflow-hidden text-center"
          dangerouslySetInnerHTML={{ __html: text }}
        />
      ),
    },
    {
      title: <div className="text-center">Date</div>,
      dataIndex: "date",
      key: "date",
      width: "15%",
      render: (date) => (
        <div className="text-center">
          {date ? date.format("DD-MM-YYYY") : ""}
        </div>
      ),
    },
    {
      title: <div className="text-center">Status</div>,
      dataIndex: "status",
      key: "status",
      width: "15%",
      render: (status, record) => (
        <div className="flex justify-center">
          <Switch
            checked={status === "active"}
            onChange={(checked) => handleStatusToggle(checked, record)}
            loading={loadingStatusChange}
            className="bg-primary"
            style={{ backgroundColor: status === "active" ? "" : "#d9d9d9" }}
          />
        </div>
      ),
    },
    {
      title: <div className="text-center">Action</div>,
      key: "action",
      width: "15%",
      render: (_, record) => (
        <Space size="middle" className="justify-center">
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
            className="text-blue-500 hover:text-blue-600"
          />
          <Button
            type="text"
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record._id)}
            className="text-red-500 hover:text-red-600"
          />
        </Space>
      ),
    },
  ];
  

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Spinner />
      </div>
    );
  }

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

      <div>
        <Table
          columns={columns}
          dataSource={filteredData}
          pagination={{
            current: currentPage,
            pageSize: pageSize,
            total: paginationInfo?.total || filteredData.length,
            onChange: (page, size) => {
              setCurrentPage(page);
              setPageSize(size);
            },
            onShowSizeChange: (current, size) => {
              setCurrentPage(1);
              setPageSize(size);
            },
          }}
          onChange={handleTableChange}
          loading={isLoading}
          className="border rounded border-red-500 custom-table"
          rowClassName="hover:bg-gray-50"
        />
      </div>

      <Modal
        title={editRecord ? "Edit Quotation" : "Add New Quotation"}
        open={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        okButtonProps={{
          className: "bg-primary hover:bg-primary/80 border-primary text-white",
        }}
        width={800}
        height={500}
      >
        <Form form={form} layout="vertical" name="quotation_form">
          <Form.Item label="Quotation">
            <JoditEditor
              ref={editor}
              value={quotationContent}
              tabIndex={1}
              onBlur={(newContent) => setQuotationContent(newContent)}
              onChange={(newContent) => setQuotationContent(newContent)}
            />
          </Form.Item>
          <Form.Item
            name="date"
            label="Date"
            rules={[{ required: true, message: "Please select a date!" }]}
          >
            <DatePicker 
              style={{ width: "100%" }} 
              className="h-12" 
              disabledDate={disablePastDates}
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default QuotationManagement;
