import React from "react";
import { Button } from "antd";
import SubCategoryTable from "./SubCategoryTable";
import { getImageUrl } from "../../common/imageUrl";

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
      </div>

      <div className="flex mb-6">
        <div className="w-1/5">
          <img
            src={getImageUrl(category.thumbnail)}
            alt="Category"
            className="w-full h-40 rounded"
          />
        </div>
        <div className="ml-6">
          <h3 className="text-xl mb-2">Category Name: {category.name}</h3>
          <p>Category Type: {category.categoryType}</p>
          <p>Total Video: {category.videoCount}</p>
        </div>
      </div>

      <div className="mb-4 flex justify-between">
        <h3 className="text-lg mb-2">
          Sub Category List ({category.subCategory.length})
        </h3>
        <Button
          type="primary"
          onClick={onAddSubCategory}
          className="bg-red-500 py-5"
        >
          Add New Sub Category
        </Button>
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
