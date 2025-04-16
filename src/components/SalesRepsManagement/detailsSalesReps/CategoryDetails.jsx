import React from "react";
import { Button } from "antd";
import SubCategoryTable from "./SubCategoryTable";

const CategoryDetails = ({
  category,
  subCategories,
  onBack,
  onAddSubCategory,
  onEditSubCategory,
  onStatusChange,
  onDeleteSubCategory,
}) => {
  return (
    <div>
      <div className="flex justify-between mb-4 items-center">
        <div className="flex items-center">
          <Button onClick={onBack} className="mr-2">
            Back
          </Button>
          <div>
            <h2>Category Details</h2>
          </div>
        </div>
        <Button
          type="primary"
          onClick={onAddSubCategory}
          className="bg-red-500"
        >
          Add New Sub Category
        </Button>
      </div>

      <div className="flex mb-6">
        <div className="w-1/4">
          <img
            src={category.thumbnail || "/api/placeholder/400/200"}
            alt="Category"
            className="w-full rounded"
          />
        </div>
        <div className="ml-6">
          <h3 className="text-xl mb-2">Category Name: {category.name}</h3>
          <p>Category Type: {category.categoryType}</p>
          <p>Total Video: {category.videoCount}</p>
        </div>
      </div>

      <div className="mb-4">
        <h3 className="text-lg mb-2">
          Sub Category List ({category.subCategoryCount})
        </h3>
      </div>

      <SubCategoryTable
        subCategories={subCategories}
        onEdit={onEditSubCategory}
        onStatusChange={onStatusChange}
        onDelete={onDeleteSubCategory}
      />
    </div>
  );
};

export default CategoryDetails;
