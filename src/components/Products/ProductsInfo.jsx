import React, { useState } from "react";
import {
  Table,
  Modal,
  Button,
  Form,
  Input,
  Select,
  Upload,
  Checkbox,
  Space,
  message,
} from "antd";
import { UploadOutlined } from "@ant-design/icons";
import GradientButton from "../common/GradiantButton";

const { Option } = Select;

const ProductInfo = () => {
  const [data, setData] = useState([
    {
      key: "1",
      productName: "Product A",
      category: "Electronics",
      totalBoxes: 100,
      freeBoxes: 10,
      lowStockAlert: true,
      price: 500,
      quantity: 50,
      commission: 10,
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
      price: 200,
      quantity: 30,
      commission: 5,
      images: [
        "https://i.ibb.co.com/8gh3mqPR/Ellipse-48-1.jpg",
        "https://i.ibb.co.com/5WRNH1d3/fresh-healthy-fruits-straw-basket-generative-ai-188544-11999.jpg",
        "https://i.ibb.co.com/8gh3mqPR/Ellipse-48-1.jpg",
      ],
    },
    {
      key: "3",
      productName: "Product c",
      category: "Fashion",
      totalBoxes: 50,
      freeBoxes: 5,
      lowStockAlert: false,
      price: 200,
      quantity: 30,
      commission: 5,
      images: [
        "https://i.ibb.co.com/8gh3mqPR/Ellipse-48-1.jpg",
        "https://i.ibb.co.com/5WRNH1d3/fresh-healthy-fruits-straw-basket-generative-ai-188544-11999.jpg",
        "https://i.ibb.co.com/8gh3mqPR/Ellipse-48-1.jpg",
      ],
    },
  ]);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isDetailModalVisible, setIsDetailModalVisible] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [isStockModalVisible, setIsStockModalVisible] = useState(false);
  const [stockForm] = Form.useForm();

  const [form] = Form.useForm();

  const filteredData = data.filter(
    (item) =>
      item.productName.toLowerCase().includes(searchText.toLowerCase()) ||
      item.category.toLowerCase().includes(searchText.toLowerCase())
  );

  const showModal = (record = null) => {
    setIsModalVisible(true);
    if (record) {
      setEditingId(record.key);
      form.setFieldsValue(record);
    } else {
      setEditingId(null);
      form.resetFields();
    }
  };


  

  const showStockModal = (record) => {
    setCurrentProduct(record);
    setIsStockModalVisible(true);
    stockForm.setFieldsValue({ quantity: record.quantity });
  };

  const handleStockUpdate = (values) => {
    setData((prevData) =>
      prevData.map((item) =>
        item.key === currentProduct.key
          ? { ...item, quantity: values.quantity }
          : item
      )
    );
    message.success("Quantity updated successfully!");
    setIsStockModalVisible(false);
  };

  const showDetailModal = (record) => {
    setCurrentProduct(record);
    setIsDetailModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setIsDetailModalVisible(false);
    setEditingId(null);
    setCurrentProduct(null);
    form.resetFields();
  };

  const handleSave = (values) => {
    if (editingId) {
      setData((prevData) =>
        prevData.map((item) =>
          item.key === editingId ? { ...item, ...values } : item
        )
      );
      message.success("Product updated successfully!");
    } else {
      setData([...data, { key: String(data.length + 1), ...values }]);
      message.success("Product added successfully!");
    }
    handleCancel();
  };

  const handleDelete = (key) => {
    setData(data.filter((item) => item.key !== key));
    message.error("Product deleted!");
  };

  const columns = [
    { title: "Product Name", dataIndex: "productName", align: "center", },
    { title: "Category", dataIndex: "category", align: "center" },
    { title: "Total Boxes", dataIndex: "totalBoxes", align: "center" },
    { title: "Free Boxes", dataIndex: "freeBoxes", align: "center" },
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
        <Space>
          <GradientButton
            onClick={() => showDetailModal(record)}
          >
            Details
          </GradientButton>
          <GradientButton
            onClick={() => showModal(record)}
          >
            Edit
          </GradientButton>
          {/* <Button
            onClick={() => showStockModal(record)}
            type="primary"
            className="bg-orange-500 text-white"
          >
            Stock Update
          </Button> */}
          <Button
            onClick={() => handleDelete(record.key)}
            type="danger"
            className="bg-red-500 text-white py-[18px]"
          >
            Delete
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div className="flex justify-between mb-6">
        <h1 className="text-2xl font-bold">Product List</h1>

        <div className="flex items-center gap-5">
          <Input
            placeholder="Search by Name or Category"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className="w-60 py-2"
          />
          <GradientButton
            onClick={() => showModal()}
          >
            Add Product
          </GradientButton>
        </div>
      </div>

      <div className="bg-gradient-to-r from-primary  to-secondary px-6 pt-6 rounded-xl">
        <Table
          dataSource={filteredData}
          columns={columns}
          pagination={{ pageSize: 10 }}
          bordered={false}
          size="small"
          rowClassName="custom-row"
        />
      </div>

      {/* Add/Edit Modal */}
      <Modal
        title={editingId ? "Edit Product" : "Add Product"}
        visible={isModalVisible}
        onCancel={handleCancel}
        footer={null}
      >
        <Form layout="vertical" form={form} onFinish={handleSave}>
          <Form.Item
            name="productName"
            label="Product Name"
            rules={[{ required: true, message: "Please enter product name!" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="category"
            label="Category"
            rules={[{ required: true, message: "Please select a category!" }]}
          >
            <Select>
              <Option value="Electronics">Electronics</Option>
              <Option value="Fashion">Fashion</Option>
              <Option value="Groceries">Groceries</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="totalBoxes"
            label="Total Boxes"
            rules={[{ required: true, message: "Please enter total boxes!" }]}
          >
            <Input type="number" />
          </Form.Item>

          <Form.Item name="freeBoxes" label="Free Boxes">
            <Input type="number" />
          </Form.Item>

          <Form.Item
            name="price"
            label="Price"
            rules={[{ required: true, message: "Please enter price!" }]}
          >
            <Input type="number" />
          </Form.Item>

          <Form.Item
            name="quantity"
            label="Quantity"
            rules={[{ required: true, message: "Please enter quantity!" }]}
          >
            <Input type="number" />
          </Form.Item>

          <Form.Item name="commission" label="Commission (%)">
            <Input type="number" />
          </Form.Item>

          <Form.Item name="images" label="Upload Images">
            <Upload listType="picture">
              <Button icon={<UploadOutlined />}>Upload</Button>
            </Upload>
          </Form.Item>

          <Form.Item name="lowStockAlert" valuePropName="checked">
            <Checkbox>Low Stock Alert</Checkbox>
          </Form.Item>

          <Form.Item>
            <GradientButton type="primary" htmlType="submit">
              {editingId ? "Update Product" : "Add Product"}
            </GradientButton>
          </Form.Item>
        </Form>
      </Modal>

      {/* Details Modal */}
      <Modal
        title="Product Details"
        visible={isDetailModalVisible}
        onCancel={handleCancel}
        footer={null}
      >
        {currentProduct && (
          <div>
            {/* Image Display Section */}
            <div className="flex flex-col  gap-2 my-4">
              {currentProduct.images && currentProduct.images.length > 0 && (
                <>
                  <img
                    src={currentProduct.images[1]}
                    alt="Product"
                    className="w-80 h-60 object-cover rounded-lg shadow-md mx-auto"
                  />
                  <div className="flex flex-wrap gap-2 mt-2">
                    {currentProduct.images.slice(1).map((img, index) => (
                      <img
                        key={index}
                        src={img}
                        alt={`Product ${index + 2}`}
                        className="w-24 h-24 object-cover rounded-md shadow-sm"
                      />
                    ))}
                  </div>
                </>
              )}
            </div>

            <p>
              <span className="mr-2">Name:</span>{" "}
              <p className="font-bold">{currentProduct.productName}</p>
            </p>
            <p>
              <span className="mr-2">Category:</span>{" "}
              <>{currentProduct.category}</>
            </p>
            <p>
              <span className="mr-2">Total Boxes:</span>{" "}
              <>{currentProduct.totalBoxes}</>
            </p>
            <p>
              <span className="mr-2">Free Boxes:</span>{" "}
              <>{currentProduct.freeBoxes}</>
            </p>
            <p>
              <span className="mr-2">Price:</span> <>${currentProduct.price}</>
            </p>

            <div className="flex justify-end">
              <GradientButton
                onClick={() => {
                  setIsDetailModalVisible(false);
                  showStockModal(currentProduct);
                }}
              >
                Stock Update
              </GradientButton>
            </div>
          </div>
        )}
      </Modal>

      {/* Stock Update Modal */}
      <Modal
        title="Update Stock Quantity"
        visible={isStockModalVisible}
        onCancel={() => setIsStockModalVisible(false)}
        footer={null}
      >
        <Form form={stockForm} onFinish={handleStockUpdate}>
          <Form.Item
            name="quantity"
            label="Quantity"
            rules={[{ required: true, message: "Please enter quantity!" }]}
          >
            <Input type="number" />
          </Form.Item>
          <Form.Item>
            <GradientButton type="primary" htmlType="submit">
              Update Quantity
            </GradientButton>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ProductInfo;
