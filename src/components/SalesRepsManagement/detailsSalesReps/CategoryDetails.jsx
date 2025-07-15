import React, { useState, useEffect } from "react";
import { Button, Modal, message } from "antd";
import { useParams, useNavigate } from "react-router-dom";
import {
  useGetSubCategoriesQuery,
  useCreateSubCategoryMutation,
  useUpdateSubCategoryMutation,
  useDeleteSubCategoryMutation,
  useToggleSubCategoryStatusMutation,
} from "../../../redux/apiSlices/subCategoryApi";
import { getImageUrl } from "../../common/imageUrl";
import Spinner from "../../common/Spinner";
import SubCategoryTable from "./SubCategoryTable";
import SubCategoryForm from "./SubCategoryForm";
import { useGetSingleCategoryQuery } from "../../../redux/apiSlices/categoryApi";

const SubCategoryManagement = () => {
  const navigate = useNavigate();
  const { categoryId } = useParams();
  // console.log("Category ID:", categoryId);
  // console.log("subcategory");

  const [subCategoryModalVisible, setSubCategoryModalVisible] = useState(false);
  const [editingSubCategory, setEditingSubCategory] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);

  // Fetch category and subcategory data
  const { data: singleCategoryData, isLoading: singleCategoryLoading } =
    useGetSingleCategoryQuery(categoryId, {
      skip: !categoryId,
    });

  const { data: subCategoryData, isLoading: subCategoryLoading } =
    useGetSubCategoriesQuery();
  console.log(subCategoryData);
  // API mutations for subcategories
  const [createSubCategory] = useCreateSubCategoryMutation();
  const [updateSubCategory] = useUpdateSubCategoryMutation();
  const [deleteSubCategory] = useDeleteSubCategoryMutation();
  const [toggleSubCategoryStatus] = useToggleSubCategoryStatusMutation();

  // Extract the actual data
  const subCategories = subCategoryData?.data || [];

  useEffect(() => {
    if (singleCategoryData && categoryId) {
      const categorySubCategories = subCategories.filter(
        (subCat) => subCat.categoryId === singleCategoryData.data._id
      );

      const enhancedCategory = {
        ...singleCategoryData.data,
        subCategory: categorySubCategories,
      };

      setSelectedCategory(enhancedCategory);
    }
  }, [singleCategoryData, subCategories, categoryId]);

  const showSubCategoryModal = (record = null) => {
    if (record) {
      if (!record.equipments) record.equipments = record.equipment || []; // fallback if needed
    }
    setEditingSubCategory(record);
    setSubCategoryModalVisible(true);
  };
  

  const handleSubCategoryFormSubmit = async (values, thumbnailFile) => {
    try {
  
      if (!editingSubCategory && (!selectedCategory || !selectedCategory._id)) {
        message.error("No category selected. Please select a category first.");
        return;
      }

      const formData = new FormData();

      const subCategoryData = {
        name: values.name,
        description: values.description,
        equipment: values.equipments || [],
      };

      if (!editingSubCategory) {
        subCategoryData.categoryId = selectedCategory._id;
        console.log("Adding categoryId:", selectedCategory._id);
      }

      if (!editingSubCategory && !subCategoryData.categoryId) {
        console.error("Missing categoryId in payload:", subCategoryData);
        message.error("Category ID is required. Please try again.");
        return;
      }

      console.log("Final subCategoryData:", subCategoryData);

      formData.append("data", JSON.stringify(subCategoryData));

      if (thumbnailFile) {
        console.log("Appending thumbnail file:", thumbnailFile.name);
        formData.append("thumbnail", thumbnailFile);
      } else if (!editingSubCategory) {
        message.error("Please upload a thumbnail image.");
        return;
      }

      console.log("FormData contents:");
      for (let [key, value] of formData.entries()) {
        console.log(key + ":", value);
      }

      if (editingSubCategory && editingSubCategory._id) {
        const response = await updateSubCategory({
          id: editingSubCategory._id,
          updatedData: formData,
        }).unwrap();

        console.log("Update subcategory response:", response);
        message.success("Sub-category updated successfully!");
      } else {
        const response = await createSubCategory(formData).unwrap();
        console.log("Create subcategory response:", response);
        message.success("Sub-category created successfully!");
      }

      setSubCategoryModalVisible(false);
      setEditingSubCategory(null);
    } catch (error) {
      console.error("Error saving subcategory:", error);

      if (error.data) {
        console.error("Server error response:", error.data);
        console.error("Server error message:", error.data.message);
      }

      const errorMessage =
        error.data?.message || error.message || "Unknown error";
      message.error(`Failed to save sub-category: ${errorMessage}`);
    }
  };

  const showCategoryDetails = (record) => {
    navigate(`/video-management/${record._id}`);
  };
  

  const handleSubCategoryCancel = () => {
    setSubCategoryModalVisible(false);
    setEditingSubCategory(null);
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

  const handleBackFromDetails = () => {
    navigate("/category-management");
  };

  const formattedSubCategories = subCategories
    .filter((subCat) => subCat.categoryId === categoryId)
    .map((subCategory) => ({
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
      categoryType: subCategory.categoryType || "Free", 
    }));

  if (singleCategoryLoading || subCategoryLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Spinner />
      </div>
    );
  }

  if (!selectedCategory) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div>Category not found</div>
      </div>
    );
  }

  return (
    <div className="p-4">
      {/* Category Details Header */}
      <div className="flex justify-between mb-4 items-center">
        <div className="flex items-center">
          <Button onClick={handleBackFromDetails} className="mr-2">
            Back
          </Button>
          <div>
            <h2>Course Management</h2>
          </div>
        </div>
      </div>

      {/* Category Information */}
      <div className="flex mb-6">
        <div className="w-1/5">
          <img
            src={getImageUrl(selectedCategory.thumbnail)}
            alt="Category"
            className="w-full h-40 rounded"
          />
        </div>
        <div className="ml-6">
          <h3 className="text-xl mb-2">
            Course Name: {selectedCategory.name}
          </h3>
          {/* <p>Category Type: {selectedCategory.categoryType}</p> */}
          <p>Total Video: {selectedCategory.videoCount}</p>
        </div>
      </div>

      {/* Sub Category List Header */}
      <div className="mb-4 flex justify-end">
        {/* <h3 className="text-lg mb-2">
          Sub Category List ({formattedSubCategories.length})
        </h3> */}
        <Button
          type="primary"
          onClick={() => showSubCategoryModal()}
          className="bg-red-500 py-5"
        >
          Add New Course
        </Button>
      </div>

      {/* Sub Category Table */}
      <SubCategoryTable
        subCategories={formattedSubCategories}
        onEdit={showSubCategoryModal}
        onView={showCategoryDetails}
        onStatusChange={handleSubCategoryStatusChange}
        onDelete={handleSubCategoryDelete}
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

export default SubCategoryManagement;
