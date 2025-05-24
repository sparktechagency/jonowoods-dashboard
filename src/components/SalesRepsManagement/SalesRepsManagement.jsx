import React, { useState } from "react";
import { Button, Space, Modal, Dropdown, Menu, message } from "antd";
import { DownOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import CategoryTable from "./CategoryTable";
import CategoryForm from "./detailsSalesReps/CategoryForm";
import GradientButton from "../common/GradiantButton";
import {
  useGetCategoryQuery,
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
  useToggleCategoryStatusMutation,
} from "../../redux/apiSlices/categoryApi";
import { Filtering } from "../common/Svg";
import Spinner from "../common/Spinner";

const CategoryManagement = () => {
  const navigate = useNavigate();

  const [modalVisible, setModalVisible] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [filterType, setFilterType] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");

  // Fetch data using RTK Query
  const { data: categoryData, isLoading: categoryLoading } =
    useGetCategoryQuery();

  // API mutations
  const [createCategory] = useCreateCategoryMutation();
  const [updateCategory] = useUpdateCategoryMutation();
  const [deleteCategory] = useDeleteCategoryMutation();
  const [toggleCategoryStatus] = useToggleCategoryStatusMutation();

  // Extract the actual data from the API responses
  const categories = categoryData?.data || [];

  const formattedCategories = categories.map((category) => ({
    id: category._id,
    _id: category._id,
    name: category.name,
    description: category.description || "",
    thumbnail: category.thumbnail,
    categoryType: category.categoryType,
    subCategory: category.subCategory || [],
    videoCount: category.videoCount || 0,
    createdAt: category.createdAt,
    status: category.status,
  }));

  const showModal = (record = null) => {
    setEditingCategory(record);
    setModalVisible(true);
  };

  const handleCategoryFormSubmit = async (values, thumbnailFile) => {
    try {
      const formData = new FormData();
      const categoryData = {};
      Object.keys(values).forEach((key) => {
        if (key !== "thumbnail") {
          categoryData[key] = values[key];
        }
      });
      formData.append("data", JSON.stringify(categoryData));

      if (thumbnailFile) {
        formData.append("thumbnail", thumbnailFile);
      }

      if (editingCategory) {
        const res = await updateCategory({
          id: editingCategory._id,
          updatedData: formData,
        }).unwrap();
        message.success("Category updated successfully!");
      } else {
        // Pass formData directly here:
        const res = await createCategory(formData).unwrap();
        message.success("Category created successfully!");
      }

      setModalVisible(false);
      setEditingCategory(null);
    } catch (error) {
      console.error("Error saving category:", error);
      message.error("Failed to save category. Please try again.");
    }
  };

  const handleCancel = () => {
    setModalVisible(false);
    setEditingCategory(null);
  };

  const showCategoryDetails = (record) => {
    navigate(`/subcategory-management/${record._id}`);
  };

  const handleDelete = (id) => {
    Modal.confirm({
      title: "Are you sure you want to delete this category?",
      content: "This action cannot be undone",
      okText: "Yes",
      okType: "danger",
      cancelText: "No",
      onOk: async () => {
        try {
          await deleteCategory(id).unwrap();
          message.success("Category deleted successfully!");
        } catch (error) {
          console.error("Error deleting category:", error);
          message.error("Failed to delete category. Please try again.");
        }
      },
    });
  };



const handleStatusChange = (checked, record) => {
  Modal.confirm({
    title: `Are you sure you want to ${
      checked ? "activate" : "deactivate"
    } this category?`,
    okText: "Yes",
    okType: "danger", // this makes the OK button red
    cancelText: "No",
    onOk: async () => {
      try {
        await toggleCategoryStatus({
          id: record._id,
          status: checked ? "active" : "inactive",
        }).unwrap();
        message.success(
          `Category ${checked ? "activated" : "deactivated"} successfully!`
        );
      } catch (error) {
        console.error("Error updating category status:", error);
        message.error("Failed to update category status. Please try again.");
      }
    },
  });
};



  const getFilteredCategories = () => {
    return formattedCategories.filter((cat) => {
      const typeMatch = filterType === "all" || cat.categoryType === filterType;
      const statusMatch =
        filterStatus === "all" ||
        cat.status.toLowerCase() === filterStatus.toLowerCase();
      return typeMatch && statusMatch;
    });
  };

  const filterMenu = (
    <Menu>
      <Menu.Item key="all" onClick={() => setFilterType("all")}>
        All
      </Menu.Item>
      <Menu.Item key="free" onClick={() => setFilterType("Free")}>
        Free
      </Menu.Item>
      <Menu.Item key="paid" onClick={() => setFilterType("Paid")}>
        Paid
      </Menu.Item>
    </Menu>
  );

  const statusMenu = (
    <Menu>
      <Menu.Item key="all" onClick={() => setFilterStatus("all")}>
        All
      </Menu.Item>
      <Menu.Item key="active" onClick={() => setFilterStatus("active")}>
        Active
      </Menu.Item>
      <Menu.Item key="inactive" onClick={() => setFilterStatus("inactive")}>
        Inactive
      </Menu.Item>
    </Menu>
  );

  if (categoryLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="p-4">
      <div>
        <div className="flex justify-end mb-4 items-center">
          <div className="flex items-center">
            <Dropdown overlay={filterMenu} trigger={["click"]}>
              <Button
                className="mr-2 bg-red-600 text-white py-5"
                style={{ border: "none" }}
              >
                <Space>
                  <Filtering className="text-black no-hover-bg" />
                  {filterType === "all" ? "All Types" : filterType}
                  <DownOutlined />
                </Space>
              </Button>
            </Dropdown>

            <Dropdown overlay={statusMenu} trigger={["click"]}>
              <Button
                className="mr-2 bg-red-600 text-white py-5"
                style={{ border: "none" }}
              >
                <Space>
                  <Filtering className="no-hover-bg" />
                  {filterStatus === "all" ? "All Status" : filterStatus}
                  <DownOutlined />
                </Space>
              </Button>
            </Dropdown>
          </div>
          <div>
            <GradientButton type="primary" onClick={() => showModal()}>
              Add New Category
            </GradientButton>
          </div>
        </div>

        <CategoryTable
          categories={getFilteredCategories()}
          onEdit={showModal}
          onView={showCategoryDetails}
          onStatusChange={handleStatusChange}
          onDelete={handleDelete}
        />
      </div>

      {/* Add/Edit Category Modal */}
      <CategoryForm
        visible={modalVisible}
        onCancel={handleCancel}
        onSubmit={handleCategoryFormSubmit}
        initialValues={editingCategory}
      />
    </div>
  );
};

export default CategoryManagement;
