import React, { useState } from "react";
import {
  Table,
  Button,
  Input,
  Select,
  Space,
  message,
  Dropdown,
  Tooltip,
  Form,
  Checkbox,
  Card,
  Row,
  Col,
  Breadcrumb,
  Modal,
} from "antd";
import {
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
  DownOutlined,
  PlusOutlined,
  HomeOutlined,
  ArrowLeftOutlined,
  UploadOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import GradientButton from "../common/GradiantButton";

const { Option } = Select;
const { confirm } = Modal;

const ProductInfo = () => {
  const [data, setData] = useState([
    {
      key: "1",
      productName: "Product A",
      category: "Cigars",
      totalBoxes: 100,
      freeBoxes: 10,
      lowStockAlert: true,
      price: 20,
      quantity: 50,
      commission: 10,
      totalStockValue: 250,
      revenue: 2500,
      images: [
        "https://i.ibb.co.com/8gh3mqPR/Ellipse-48-1.jpg",
        "https://i.ibb.co.com/5WRNH1d3/fresh-healthy-fruits-straw-basket-generative-ai-188544-11999.jpg",
        "https://i.ibb.co.com/8gh3mqPR/Ellipse-48-1.jpg",
      ],
    },
    {
      key: "2",
      productName: "Product B",
      category: "Fashion",
      totalBoxes: 50,
      freeBoxes: 5,
      lowStockAlert: false,
      price: 15,
      quantity: 30,
      commission: 5,
      totalStockValue: 200,
      revenue: 1800,
      images: [
        "https://i.ibb.co.com/8gh3mqPR/Ellipse-48-1.jpg",
        "https://i.ibb.co.com/5WRNH1d3/fresh-healthy-fruits-straw-basket-generative-ai-188544-11999.jpg",
        "https://i.ibb.co.com/8gh3mqPR/Ellipse-48-1.jpg",
      ],
    },
    {
      key: "3",
      productName: "Product C",
      category: "Electronics",
      totalBoxes: 50,
      freeBoxes: 5,
      lowStockAlert: false,
      price: 35,
      quantity: 30,
      commission: 5,
      totalStockValue: 300,
      revenue: 3200,
      images: [
        "https://i.ibb.co.com/8gh3mqPR/Ellipse-48-1.jpg",
        "https://i.ibb.co.com/5WRNH1d3/fresh-healthy-fruits-straw-basket-generative-ai-188544-11999.jpg",
        "https://i.ibb.co.com/8gh3mqPR/Ellipse-48-1.jpg",
      ],
    },
  ]);

  // State variables
  const [searchText, setSearchText] = useState("");
  const [currentProduct, setCurrentProduct] = useState(null);
  const [images, setImages] = useState([]);
  const [form] = Form.useForm();

  // Modal states
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isViewModalVisible, setIsViewModalVisible] = useState(false);
  const [modalMode, setModalMode] = useState("add"); // "add" or "edit"

  // Stock update modal state
  const [isStockUpdateModalVisible, setIsStockUpdateModalVisible] =
    useState(false);
  const [stockUpdateForm] = Form.useForm();

  // Filter products by search text
  const filteredData = data.filter(
    (item) =>
      item.productName.toLowerCase().includes(searchText.toLowerCase()) ||
      item.category.toLowerCase().includes(searchText.toLowerCase())
  );

  // Modal handlers
  const showAddModal = () => {
    form.resetFields();
    setImages([]);
    setCurrentProduct(null);
    setModalMode("add");
    setIsModalVisible(true);
  };

  const showEditModal = (product) => {
    setCurrentProduct(product);
    form.setFieldsValue({
      productName: product.productName,
      category: product.category,
      totalBoxes: product.totalBoxes,
      price: product.price,
      lowStockAlert: product.lowStockAlert,
    });
    setImages(product.images || []);
    setModalMode("edit");
    setIsModalVisible(true);
  };

  const handleModalCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
  };

  // View modal handlers
  const showViewModal = (product) => {
    setCurrentProduct(product);
    setIsViewModalVisible(true);
  };

  const handleViewModalCancel = () => {
    setIsViewModalVisible(false);
    setCurrentProduct(null);
  };

  // Stock update modal handlers
  const showStockUpdateModal = (product) => {
    setCurrentProduct(product);
    stockUpdateForm.setFieldsValue({
      totalBoxes: product.totalBoxes,
    });
    setIsStockUpdateModalVisible(true);
  };

  const handleStockUpdateCancel = () => {
    setIsStockUpdateModalVisible(false);
    stockUpdateForm.resetFields();
  };

  const handleStockUpdate = (values) => {
    if (currentProduct) {
      // Calculate new total stock value based on updated stock
      const newTotalStockValue = values.totalBoxes * currentProduct.price;
      // Calculate new revenue (using same formula as in original code)
      const newRevenue = newTotalStockValue * 1.2;

      // Update the product data
      setData((prevData) =>
        prevData.map((item) =>
          item.key === currentProduct.key
            ? {
                ...item,
                totalBoxes: values.totalBoxes,
                quantity: values.totalBoxes, // Update quantity as well
                totalStockValue: newTotalStockValue,
                revenue: newRevenue,
              }
            : item
        )
      );
      message.success("Stock updated successfully!");
    }
    setIsStockUpdateModalVisible(false);
  };

  // Delete confirmation
  const showDeleteConfirm = (record) => {
    confirm({
      title: "Are you sure you want to delete this product?",
      icon: <ExclamationCircleOutlined />,
      content: `Product: ${record.productName}`,
      okText: "Yes",
      okType: "danger",
      cancelText: "No",
      centered: true,
      onOk() {
        handleDelete(record.key);
      },
    });
  };

  // Data handling
  const handleSaveProduct = (values) => {
    // Calculate additional fields
    const totalStockValue = values.price * (values.totalBoxes || 0);
    const revenue = totalStockValue * 1.2; // Just an example calculation

    const productData = {
      ...values,
      quantity: values.totalBoxes,
      totalStockValue,
      revenue,
      images: images.length > 0 ? images : [],
    };

    if (modalMode === "edit" && currentProduct) {
      // Update existing product
      setData((prevData) =>
        prevData.map((item) =>
          item.key === currentProduct.key
            ? { ...item, ...productData, key: item.key }
            : item
        )
      );
      message.success("Product updated successfully!");
    } else {
      // Add new product
      setData([...data, { key: String(data.length + 1), ...productData }]);
      message.success("Product added successfully!");
    }
    setIsModalVisible(false);
  };

  const handleDelete = (key) => {
    setData(data.filter((item) => item.key !== key));
    message.success("Product deleted successfully!");
  };

  // Image handling (simplified for demo)
  const handleUploadPicture = () => {
    // This is a placeholder for actual image upload functionality
    const demoImages = [
      "https://i.ibb.co.com/8gh3mqPR/Ellipse-48-1.jpg",
      "https://i.ibb.co.com/5WRNH1d3/fresh-healthy-fruits-straw-basket-generative-ai-188544-11999.jpg",
    ];

    // Add a random demo image
    const newImageUrl =
      demoImages[Math.floor(Math.random() * demoImages.length)];
    setImages([...images, newImageUrl]);
  };

  // Table columns configuration
  const columns = [
    {
      title: "Product Name",
      dataIndex: "productName",
      align: "center",
      render: (text) => <span className="font-medium">{text}</span>,
    },
    {
      title: "Category",
      dataIndex: "category",
      align: "center",
    },
    {
      title: "Quantity in Stock",
      dataIndex: "quantity",
      align: "center",
    },
    {
      title: "Cost per Unit",
      dataIndex: "price",
      align: "center",
      render: (price) => `$${price}`,
    },
    {
      title: "Total Inventory Value",
      dataIndex: "totalStockValue",
      align: "center",
      render: (value) => `$${value}`,
    },
    {
      title: "Low Stock Alert",
      dataIndex: "lowStockAlert",
      align: "center",
      render: (text) => (text ? "Yes" : "No"),
    },
    {
      title: "Action",
      key: "action",
      align: "center",
      render: (_, record) => (
        <Space size="small">
          <Tooltip title="View Product" >
            <Button
              type="text"
              className="text-gray-600 hover:text-blue-500"
              icon={<EyeOutlined />}
              onClick={() => showViewModal(record)}
            />
          </Tooltip>

          <Tooltip title="Edit" >
            <Button
              type="text"
              className="text-gray-600 hover:text-blue-500"
              icon={<EditOutlined />}
              onClick={() => showEditModal(record)}
            />
          </Tooltip>

          <Tooltip title="Delete" color="red">
            <Button
              type="text"
              className="text-gray-600 hover:text-red-500"
              icon={<DeleteOutlined />}
              onClick={() => showDeleteConfirm(record)}
            />
          </Tooltip>
          <GradientButton
            type="primary"
            className=" flex items-center"
            onClick={() => showStockUpdateModal(record)}
          >
            Update Stock <DownOutlined className="ml-1" />
          </GradientButton>
        </Space>
      ),
    },
  ];

  // Product Form Modal
  const renderProductFormModal = () => {
    return (
      <Modal
        centered
        title={modalMode === "add" ? "Add Product" : "Edit Product"}
        open={isModalVisible}
        onCancel={handleModalCancel}
        footer={null}
        width={800}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSaveProduct}
          initialValues={{
            lowStockAlert: false,
            ...(currentProduct || {}),
          }}
        >
          <Row gutter={24}>
            {/* Left Column - Image Upload */}
            <Col span={24} md={12}>
              <div className="border rounded-lg h-60 mb-4 flex items-center justify-center relative">
                {images.length > 0 ? (
                  <img
                    src={images[0]}
                    alt="Product"
                    className="w-full h-full object-contain rounded-lg"
                  />
                ) : (
                  <div className="text-center text-gray-400">
                    <PlusOutlined style={{ fontSize: 24 }} />
                    <div className="mt-2">Upload Main Image</div>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-3 gap-2 mb-4">
                {[0, 1, 2, 3, 4].map((index) => (
                  <div
                    key={index}
                    className="border rounded-lg h-20 flex items-center justify-center relative"
                  >
                    {images.length > index + 1 ? (
                      <img
                        src={images[index + 1]}
                        alt={`Thumbnail ${index}`}
                        className="w-full h-full object-cover rounded-lg"
                      />
                    ) : (
                      <div className="text-center text-gray-400">
                        <PlusOutlined />
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <Button
                type="primary"
                className="mb-6"
                onClick={handleUploadPicture}
                icon={<UploadOutlined />}
              >
                Upload Picture
              </Button>
            </Col>

            {/* Right Column - Form Fields */}
            <Col span={24} md={12}>
              <Form.Item
                name="productName"
                label="Product Name*"
                rules={[
                  {
                    required: true,
                    message: "Please enter product name",
                  },
                ]}
              >
                <Input placeholder="Enter Product Name" />
              </Form.Item>

              <Form.Item
                name="category"
                label="Category*"
                rules={[
                  { required: true, message: "Please select a category" },
                ]}
              >
                <Select placeholder="Select Category">
                  <Option value="Cigar/Accessories">Cigar/Accessories</Option>
                  <Option value="Electronics">Electronics</Option>
                  <Option value="Fashion">Fashion</Option>
                  <Option value="Groceries">Groceries</Option>
                </Select>
              </Form.Item>

              <Form.Item
                name="totalBoxes"
                label="Total Boxes In Stock*"
                rules={[
                  {
                    required: true,
                    message: "Please enter boxes in stock",
                  },
                ]}
              >
                <Input type="number" placeholder="Enter Boxes" />
              </Form.Item>

              <Form.Item
                name="price"
                label="Price*"
                rules={[{ required: true, message: "Please enter price" }]}
              >
                <Input type="number" placeholder="Enter Product Price" />
              </Form.Item>

              <Form.Item name="lowStockAlert" valuePropName="checked">
                <Checkbox>Low Stock Alert</Checkbox>
              </Form.Item>
            </Col>
          </Row>

          <div className="flex justify-end mt-6">
            <Button onClick={handleModalCancel} className="mr-2">
              Cancel
            </Button>
            <GradientButton type="primary" htmlType="submit">
              {modalMode === "edit" ? "Save Product" : "Add Product"}
            </GradientButton>
          </div>
        </Form>
      </Modal>
    );
  };

  // Product View Modal
  const renderViewModal = () => {
    return (
      <Modal
        centered
        title="Product Details"
        open={isViewModalVisible}
        onCancel={handleViewModalCancel}
        footer={[
          <Button key="back" onClick={handleViewModalCancel}>
            Close
          </Button>,
          <GradientButton
            key="edit"
            onClick={() => {
              handleViewModalCancel();
              showEditModal(currentProduct);
            }}
          >
            Edit Product
          </GradientButton>,
        ]}
        width={800}
      >
        {currentProduct && (
          <Row gutter={24}>
            <Col span={24} md={12}>
              {currentProduct.images && currentProduct.images.length > 0 && (
                <>
                  <div className="rounded-lg overflow-hidden h-60 mb-4">
                    <img
                      src={currentProduct.images[0]}
                      alt="Product"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2 mb-6">
                    {currentProduct.images.slice(1).map((img, index) => (
                      <div
                        key={index}
                        className="w-24 h-24 rounded-lg overflow-hidden"
                      >
                        <img
                          src={img}
                          alt={`Product ${index + 2}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ))}
                  </div>
                </>
              )}
            </Col>
            <Col span={24} md={12}>
              <div className="space-y-4">
                <div>
                  <h3 className="text-gray-500 mb-1">Product Name</h3>
                  <p className="text-lg font-semibold">
                    {currentProduct.productName}
                  </p>
                </div>
                <div>
                  <h3 className="text-gray-500 mb-1">Category</h3>
                  <p>{currentProduct.category}</p>
                </div>
                <div>
                  <h3 className="text-gray-500 mb-1">Total Boxes</h3>
                  <p>{currentProduct.totalBoxes}</p>
                </div>
                <div>
                  <h3 className="text-gray-500 mb-1">Price</h3>
                  <p>${currentProduct.price}</p>
                </div>
                <div>
                  <h3 className="text-gray-500 mb-1">Total Stock Value</h3>
                  <p>${currentProduct.totalStockValue}</p>
                </div>
                <div>
                  <h3 className="text-gray-500 mb-1">Revenue</h3>
                  <p>${currentProduct.revenue}</p>
                </div>
                <div>
                  <h3 className="text-gray-500 mb-1">Low Stock Alert</h3>
                  <p>{currentProduct.lowStockAlert ? "Yes" : "No"}</p>
                </div>
              </div>
            </Col>
          </Row>
        )}
      </Modal>
    );
  };

  // Stock Update Modal
  const renderStockUpdateModal = () => {
    return (
      <Modal
        centered
        title="Product Stock Update"
        open={isStockUpdateModalVisible}
        onCancel={handleStockUpdateCancel}
        footer={null}
        width={500}
        closeIcon={<span className="text-xl">×</span>}
      >
        <Form
          form={stockUpdateForm}
          layout="vertical"
          onFinish={handleStockUpdate}
        >
          <Form.Item
            name="totalBoxes"
            label="Total Boxes In Stock*"
            rules={[
              {
                required: true,
                message: "Please enter boxes in stock",
              },
            ]}
          >
            <Input type="number" placeholder="Enter Boxes" />
          </Form.Item>

          <div className="flex justify-end mt-6">
            <Button onClick={handleStockUpdateCancel} className="mr-2 px-4">
              Cancel
            </Button>
            <Button
              type="primary"
              htmlType="submit"
              className="bg-gradient-to-r from-cyan-500 to-blue-500 border-none px-6"
            >
              Save Changes
            </Button>
          </div>
        </Form>
      </Modal>
    );
  };

  return (
    <div className="container mx-auto py-6 px-4">
      <div className="flex justify-between mb-6">
        <h1 className="text-2xl font-bold">Inventory Management</h1>

        <div className="flex items-center gap-5">
          <Input
            placeholder="Search by Name or Category"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className="w-60 py-2"
          />
          <GradientButton onClick={showAddModal}>Add Product</GradientButton>
        </div>
      </div>

      <div className="rounded-xl shadow-sm bg-primary p-5">
        <Table
          dataSource={filteredData}
          columns={columns}
          pagination={{ pageSize: 10 }}
          bordered={false}
          rowClassName="bg-white hover:bg-gray-50 border-b border-gray-100"
          className="custom-table"
        />
      </div>

      {/* Render all modals */}
      {renderProductFormModal()}
      {renderViewModal()}
      {renderStockUpdateModal()}

      <style jsx>{`
        .custom-table .ant-table-thead > tr > th {
          background-color: transparent;
          color: #666;
          font-weight: 500;
          border-bottom: 1px solid #f0f0f0;
          padding: 16px 12px;
        }

        .custom-table .ant-table-tbody > tr > td {
          padding: 16px 12px;
        }
      `}</style>
    </div>
  );
};

export default ProductInfo;
