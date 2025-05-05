import React, { useState, useEffect } from "react";
import { Button, Space, Modal, Dropdown, Menu, message } from "antd";
import { DownOutlined } from "@ant-design/icons";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import CategoryTable from "./CategoryTable";
import CategoryDetails from "./detailsSalesReps/CategoryDetails";
import CategoryForm from "./detailsSalesReps/CategoryForm";
import SubCategoryForm from "./detailsSalesReps/SubCategoryForm";
import GradientButton from "../common/GradiantButton";
import {
  useGetCategoryQuery,
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
  useGetSingleCategoryQuery,
  useToggleCategoryStatusMutation,
} from "../../redux/apiSlices/categoryApi";
import {
  useGetSubCategoriesQuery,
  useCreateSubCategoryMutation,
  useUpdateSubCategoryMutation,
  useDeleteSubCategoryMutation,
  useToggleSubCategoryStatusMutation,
} from "../../redux/apiSlices/subCategoryApi";

const CategoryManagement = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { categoryId } = useParams();
  console.log(categoryId);

  const [modalVisible, setModalVisible] = useState(false);
  const [subCategoryModalVisible, setSubCategoryModalVisible] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [editingSubCategory, setEditingSubCategory] = useState(null);
  const [categoryDetailsVisible, setCategoryDetailsVisible] = useState(
    !!categoryId
  ); // Show details if categoryId exists in URL
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [filterType, setFilterType] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");

  // Fetch data using RTK Query
  const { data: categoryData, isLoading: categoryLoading } =
    useGetCategoryQuery();
  const { data: subCategoryData, isLoading: subCategoryLoading } =
    useGetSubCategoriesQuery();

  // Use categoryId from URL params as selectedCategoryId if available
  const [selectedCategoryId, setSelectedCategoryId] = useState(
    categoryId || null
  );
  const { data: singleCategoryData, isLoading: singleCategoryLoading } =
    useGetSingleCategoryQuery(selectedCategoryId, {
      skip: !selectedCategoryId,
    });

  // API mutations
  const [createCategory] = useCreateCategoryMutation();
  const [updateCategory] = useUpdateCategoryMutation();
  const [deleteCategory] = useDeleteCategoryMutation();
  const [toggleCategoryStatus] = useToggleCategoryStatusMutation();

  const [createSubCategory] = useCreateSubCategoryMutation();
  const [updateSubCategory] = useUpdateSubCategoryMutation();
  const [deleteSubCategory] = useDeleteSubCategoryMutation();
  const [toggleSubCategoryStatus] = useToggleSubCategoryStatusMutation();

  // Update selectedCategoryId when URL params change
  useEffect(() => {
    if (categoryId) {
      setSelectedCategoryId(categoryId);
      setCategoryDetailsVisible(true);
    } else {
      setCategoryDetailsVisible(false);
    }
  }, [categoryId]);

  // Extract the actual data from the API responses
  const categories = categoryData?.data || [];
  const subCategories = subCategoryData?.data || [];

  // Format data for the table component (ensuring consistent structure)
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

  useEffect(() => {
    // When single category data is loaded, update the selected category
    if (singleCategoryData && selectedCategoryId) {
      // Find the subcategories that belong to this category
      const categorySubCategories = subCategories.filter(
        (subCat) => subCat.categoryId === singleCategoryData.data._id
      );

      // Enhance the selected category with its subcategories
      const enhancedCategory = {
        ...singleCategoryData.data,
        subCategory: categorySubCategories,
      };

      setSelectedCategory(enhancedCategory);
    }
  }, [singleCategoryData, subCategories, selectedCategoryId]);

  const Filtering = () => {
    return (
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
  };

  const showModal = (record = null) => {
    setEditingCategory(record);
    setModalVisible(true);
  };

  const showSubCategoryModal = (record = null) => {
    setEditingSubCategory(record);
    setSubCategoryModalVisible(true);
  };

  const handleCategoryFormSubmit = async (values, thumbnailFile) => {
    try {
      // Create FormData for file upload
      const formData = new FormData();

      // Collect all text data into a single object
      const categoryData = {};
      Object.keys(values).forEach((key) => {
        if (key !== "thumbnail") {
          // Skip the thumbnail field
          categoryData[key] = values[key];
        }
      });

      // Append the JSON stringified data to FormData
      formData.append("data", JSON.stringify(categoryData));

      // Append thumbnail file separately if it exists
      if (thumbnailFile) {
        formData.append("thumbnail", thumbnailFile);
      }

      if (editingCategory) {
        // Update existing category
        await updateCategory({
          id: editingCategory._id,
          updatedData: formData,
        }).unwrap();
        message.success("Category updated successfully!");
      } else {
        // Create new category
        await createCategory({ formData, categoryId }).unwrap();
        message.success("Category created successfully!");
      }

      setModalVisible(false);
      setEditingCategory(null);
    } catch (error) {
      console.error("Error saving category:", error);
      message.error("Failed to save category. Please try again.");
    }
  };

  const handleSubCategoryFormSubmit = async (values, thumbnailFile) => {
    try {
      console.log("Selected Category:", selectedCategory);
      console.log("Initial values:", values);

      // First, ensure we have a selected category for new subcategories
      if (!editingSubCategory && (!selectedCategory || !selectedCategory._id)) {
        message.error("No category selected. Please select a category first.");
        return;
      }

      const formData = new FormData();

      // Collect non-file form fields
      const subCategoryData = {
        ...values,
      };

      // IMPORTANT: Explicitly set categoryId for new subcategory
      if (!editingSubCategory) {
        subCategoryData.categoryId = selectedCategory._id;
        console.log("Adding categoryId:", selectedCategory._id);
      }

      // Double-check that categoryId is set
      if (!subCategoryData.categoryId) {
        console.error("Missing categoryId in payload:", subCategoryData);
        message.error("Category ID is required. Please try again.");
        return;
      }

      // Log the final data being sent
      console.log("Final subCategoryData:", subCategoryData);

      // Convert data to JSON string and append to formData
      formData.append("data", JSON.stringify(subCategoryData));

      // Append file if exists
      if (thumbnailFile) {
        formData.append("thumbnail", thumbnailFile);
      }

      if (editingSubCategory && editingSubCategory._id) {
        // Update sub-category (PATCH)
        await updateSubCategory({
          id: editingSubCategory._id,
          updatedData: formData,
        }).unwrap();
        message.success("Sub-category updated successfully!");
      } else {
        // Create new sub-category (POST)
        const response = await createSubCategory(formData).unwrap();
        console.log("Create subcategory response:", response);
        message.success("Sub-category created successfully!");
      }

      setSubCategoryModalVisible(false);
      setEditingSubCategory(null);
    } catch (error) {
      console.error("Error saving subcategory:", error);

      // Add more detailed error logging
      if (error.data) {
        console.error("Server error response:", error.data);
      }

      message.error(
        `Failed to save sub-category: ${error.message || "Unknown error"}`
      );
    }
  };

  const handleCancel = () => {
    setModalVisible(false);
    setEditingCategory(null);
  };

  const handleSubCategoryCancel = () => {
    setSubCategoryModalVisible(false);
    setEditingSubCategory(null);
  };

  const showCategoryDetails = (record) => {
    navigate(`/salesRepsManage/${record._id}`);
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

  const handleSubCategoryDelete = (id) => {
    Modal.confirm({
      title: "Are you sure you want to delete this sub-category?",
      content: "This action cannot be undone",
      okText: "Yes",
      okType: "danger",
      cancelText: "No",
      onOk: async () => {
        try {
          await deleteSubCategory(id).unwrap();
          message.success("Sub-category deleted successfully!");
        } catch (error) {
          console.error("Error deleting subcategory:", error);
          message.error("Failed to delete subcategory. Please try again.");
        }
      },
    });
  };

  const handleStatusChange = async (checked, record) => {
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
  };

  const handleSubCategoryStatusChange = async (checked, record) => {
    try {
      await toggleSubCategoryStatus({
        id: record._id,
        status: checked ? "active" : "inactive",
      }).unwrap();
      message.success(
        `Sub-category ${checked ? "activated" : "deactivated"} successfully!`
      );
    } catch (error) {
      console.error("Error updating subcategory status:", error);
      message.error("Failed to update subcategory status. Please try again.");
    }
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

  // Format subcategories for the details view
  const formattedSubCategories = subCategories.map((subCategory) => ({
    id: subCategory._id,
    _id: subCategory._id,
    name: subCategory.name,
    parentCategoryId: subCategory.categoryId,
    thumbnail: subCategory.thumbnail,
    videoCount: subCategory.videoCount || 0,
    createdDate: new Date(subCategory.createdAt).toLocaleDateString("en-US", {
      month: "long",
      day: "2-digit",
      year: "numeric",
    }),
    status: subCategory.status || "active",
    categoryType: subCategory.categoryType || "Free", // Adding this for consistency
  }));

  if (categoryLoading || subCategoryLoading) {
    return <div className="p-8 text-center">Loading categories...</div>;
  }

  if (categoryDetailsVisible && singleCategoryLoading) {
    return <div className="p-8 text-center">Loading category details...</div>;
  }

  const handleBackFromDetails = () => {
    // Navigate back to the main category listing page
    navigate("/category-management");
  };

  return (
    <div className="p-4">
      {/* Category Management Page */}
      {!categoryDetailsVisible && (
        <div>
          <div className="flex justify-end mb-4 items-center">
            <div className="flex items-center">
              <Dropdown overlay={filterMenu}>
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

              <Dropdown overlay={statusMenu}>
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
      )}

      {/* Category Details Page */}
      {categoryDetailsVisible && selectedCategory && (
        <CategoryDetails
          category={selectedCategory}
          subCategories={formattedSubCategories.filter(
            (subCat) => subCat.parentCategoryId === selectedCategory._id
          )}
          onBack={handleBackFromDetails}
          onAddSubCategory={showSubCategoryModal}
          onEditSubCategory={showSubCategoryModal}
          onStatusChange={handleSubCategoryStatusChange}
          onDeleteSubCategory={handleSubCategoryDelete}
        />
      )}

      {/* Add/Edit Category Modal */}
      <CategoryForm
        visible={modalVisible}
        onCancel={handleCancel}
        onSubmit={handleCategoryFormSubmit}
        initialValues={editingCategory}
      />

      {/* Add/Edit Sub Category Modal */}
      <SubCategoryForm
        visible={subCategoryModalVisible}
        onCancel={handleSubCategoryCancel}
        onSubmit={handleSubCategoryFormSubmit}
        initialValues={editingSubCategory}
        parentCategoryId={selectedCategory?._id}
      />
    </div>
  );
};

export default CategoryManagement;
