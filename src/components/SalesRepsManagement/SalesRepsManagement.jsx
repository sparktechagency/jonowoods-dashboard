import React, { useState, useEffect } from "react";
import { Button, Space, Modal, Dropdown, Menu } from "antd";
import { DownOutlined } from "@ant-design/icons";
import CategoryTable from "./CategoryTable";
import CategoryDetails from "./detailsSalesReps/CategoryDetails";
import CategoryForm from "./detailsSalesReps/CategoryForm";
import SubCategoryForm from "./detailsSalesReps/SubCategoryForm";
import { Filtering } from "../common/Svg";
import GradientButton from "../common/GradiantButton";

const CategoryManagement = () => {
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [subCategoryModalVisible, setSubCategoryModalVisible] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [editingSubCategory, setEditingSubCategory] = useState(null);
  const [categoryDetailsVisible, setCategoryDetailsVisible] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [filterType, setFilterType] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");


  const Filtering = () => {
    return (
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
          fill="#000"
        />
      </svg>
    );
  };

  // Mock data functions
  const generateMockCategories = () => {
    return [
      {
        id: 1,
        name: "Web Development",
        description: "Learn to build websites and web apps",
        thumbnail: "https://i.ibb.co/C5dPm7xb/Frame-2147226698.png",
        categoryType: "Free",
        subCategoryCount: 3,
        videoCount: 10,
        createdDate: "April 10, 2025",
        status: "Active",
      },
      {
        id: 2,
        name: "Data Science",
        description: "Learn data analysis, visualization, and ML",
        thumbnail: "https://i.ibb.co/C5dPm7xb/Frame-2147226698.png",
        categoryType: "Paid",
        subCategoryCount: 2,
        videoCount: 8,
        createdDate: "April 09, 2025",
        status: "Inactive",
      },
      {
        id: 3,
        name: "Graphic Design",
        description: "Master design tools and techniques",
        thumbnail: "https://i.ibb.co/C5dPm7xb/Frame-2147226698.png",
        categoryType: "Free",
        subCategoryCount: 4,
        videoCount: 12,
        createdDate: "April 08, 2025",
        status: "Active",
      },
    ];
  };

  const generateMockSubCategories = () => {
    return [
      {
        id: 1,
        name: "HTML & CSS",
        parentCategoryId: 1,
        thumbnail: "https://i.ibb.co/C5dPm7xb/Frame-2147226698.png",
        videoCount: 4,
        createdDate: "April 10, 2025",
        categoryType: "Free",
        status: "Active",
      },
      {
        id: 2,
        name: "JavaScript",
        parentCategoryId: 1,
        thumbnail: "https://i.ibb.co/C5dPm7xb/Frame-2147226698.png",
        videoCount: 3,
        createdDate: "April 09, 2025",
        categoryType: "Free",
        status: "Active",
      },
      {
        id: 3,
        name: "Python for Data Science",
        parentCategoryId: 2,
        thumbnail: "https://i.ibb.co/C5dPm7xb/Frame-2147226698.png",
        videoCount: 5,
        createdDate: "April 09, 2025",
        categoryType: "Paid",
        status: "Inactive",
      },
    ];
  };

  // Mock data initialization
  useEffect(() => {
    setCategories(generateMockCategories());
    setSubCategories(generateMockSubCategories());
  }, []);

  const showModal = (record = null) => {
    setEditingCategory(record);
    setModalVisible(true);
  };

  const showSubCategoryModal = (record = null) => {
    setEditingSubCategory(record);
    setSubCategoryModalVisible(true);
  };

  const handleCategoryFormSubmit = (values, thumbnailFile) => {
    if (editingCategory) {
      setCategories(
        categories.map((cat) =>
          cat.id === editingCategory.id
            ? {
                ...cat,
                ...values,
                thumbnail: thumbnailFile
                  ? URL.createObjectURL(thumbnailFile)
                  : cat.thumbnail,
              }
            : cat
        )
      );
    } else {
      const newCategory = {
        id: categories.length + 1,
        ...values,
        thumbnail: thumbnailFile
          ? URL.createObjectURL(thumbnailFile)
          : "https://i.ibb.co.com/C5dPm7xb/Frame-2147226698.png",
        subCategoryCount: 0,
        videoCount: 0,
        createdDate: new Date().toLocaleDateString("en-US", {
          month: "long",
          day: "2-digit",
          year: "numeric",
        }),
        status: "Active",
      };
      setCategories([...categories, newCategory]);
    }
    setModalVisible(false);
  };

  const handleSubCategoryFormSubmit = (values, thumbnailFile) => {
    if (editingSubCategory) {
      setSubCategories(
        subCategories.map((subCat) =>
          subCat.id === editingSubCategory.id
            ? {
                ...subCat,
                ...values,
                thumbnail: thumbnailFile
                  ? URL.createObjectURL(thumbnailFile)
                  : subCat.thumbnail,
              }
            : subCat
        )
      );
    } else {
      const newSubCategory = {
        id: subCategories.length + 1,
        ...values,
        thumbnail: thumbnailFile
          ? URL.createObjectURL(thumbnailFile)
          : "https://i.ibb.co.com/C5dPm7xb/Frame-2147226698.png",
        videoCount: 0,
        createdDate: new Date().toLocaleDateString("en-US", {
          month: "long",
          day: "2-digit",
          year: "numeric",
        }),
        categoryType: selectedCategory?.categoryType || "Free",
        status: "Active",
      };
      setSubCategories([...subCategories, newSubCategory]);
    }
    setSubCategoryModalVisible(false);
  };

  const handleCancel = () => {
    setModalVisible(false);
  };

  const handleSubCategoryCancel = () => {
    setSubCategoryModalVisible(false);
  };

  const showCategoryDetails = (record) => {
    setSelectedCategory(record);
    setCategoryDetailsVisible(true);
  };

  const handleDelete = (id) => {
    Modal.confirm({
      title: "Are you sure you want to delete this category?",
      content: "This action cannot be undone",
      okText: "Yes",
      okType: "danger",
      cancelText: "No",
      onOk: () => {
        setCategories(categories.filter((category) => category.id !== id));
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
      onOk: () => {
        setSubCategories(
          subCategories.filter((subCategory) => subCategory.id !== id)
        );
      },
    });
  };

  const handleStatusChange = (checked, record) => {
    setCategories(
      categories.map((cat) =>
        cat.id === record.id
          ? { ...cat, status: checked ? "Active" : "Inactive" }
          : cat
      )
    );
  };

  const handleSubCategoryStatusChange = (checked, record) => {
    setSubCategories(
      subCategories.map((subCat) =>
        subCat.id === record.id
          ? { ...subCat, status: checked ? "Active" : "Inactive" }
          : subCat
      )
    );
  };

  const getFilteredCategories = () => {
    return categories.filter((cat) => {
      const typeMatch = filterType === "all" || cat.categoryType === filterType;
      const statusMatch = filterStatus === "all" || cat.status === filterStatus;
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
      <Menu.Item key="active" onClick={() => setFilterStatus("Active")}>
        Active
      </Menu.Item>
      <Menu.Item key="inactive" onClick={() => setFilterStatus("Inactive")}>
        Inactive
      </Menu.Item>
    </Menu>
  );

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
                    {filterType === "all" ? "Free" : filterType}
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
                    {filterStatus === "all" ? "Active" : filterStatus}
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
          subCategories={subCategories}
          onBack={() => setCategoryDetailsVisible(false)}
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
      />
    </div>
  );
};

export default CategoryManagement;
