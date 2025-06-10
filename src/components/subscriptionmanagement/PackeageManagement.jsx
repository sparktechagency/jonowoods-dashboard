import { useState } from "react";
import { Pencil, X, Plus, ChevronDown } from "lucide-react";
import { Dropdown, Menu, Button, Modal } from "antd";
import {
  useGetSubscriptionPackagesQuery,
  useCreateSubscriptionPackageMutation,
  useUpdateSubscriptionPackageMutation,
  useDeleteSubscriptionPackageMutation,
} from "../../redux/apiSlices/subscriptionManagementApi";
import Spinner from "../common/Spinner";
import { Filtering } from "../common/Svg";

// Custom Filter Icon SVG component
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
      fill="#fff"
    />
  </svg>
);

// Duration options that match the API's expected enum values
const DURATION_OPTIONS = [
  { value: "1 month", label: "1 Month" },
  { value: "3 months", label: "3 Months" },
  { value: "6 months", label: "6 Months" },
  { value: "1 year", label: "1 Year" },
];

// Payment type options that match the API's expected enum values
const PAYMENT_TYPE_OPTIONS = [
  { value: "Yearly", label: "Yearly" },
  { value: "Monthly", label: "Monthly" },
];

// Remove discount type options since we only need percentage

// Membership types that can see discounts
const MEMBERSHIP_OPTIONS = [
  { value: "all", label: "All Users" },
  { value: "premium", label: "Premium Members" },
  { value: "gold", label: "Gold Members" },
  { value: "platinum", label: "Platinum Members" },
  { value: "vip", label: "VIP Members" },
];

export default function SubscriptionPackagesManagement() {
  const [showPackageModal, setShowPackageModal] = useState(false);
  const [selectedType, setSelectedType] = useState("app");
  const [currentPackage, setCurrentPackage] = useState({
    title: "",
    description: "",
    price: "",
    duration: "1 month",
    paymentType: "Yearly",
    subscriptionType: "web",
    // New discount fields
    discountPercentage: "",
    discountVisibleTo: "all",
  });
  const [editingPackageId, setEditingPackageId] = useState(null);

  // RTK Query hooks
  const { data: subscriptionPackages = [], isLoading: isLoadingPackages } =
    useGetSubscriptionPackagesQuery();
  const [createPackage, { isLoading: isCreating }] =
    useCreateSubscriptionPackageMutation();
  const [updatePackage, { isLoading: isUpdating }] =
    useUpdateSubscriptionPackageMutation();
  const [deletePackage] = useDeleteSubscriptionPackageMutation();

  // Calculate discounted price
  const calculateDiscountedPrice = (originalPrice, discountPercentage) => {
    if (!discountPercentage || discountPercentage <= 0) return originalPrice;

    const price = Number(originalPrice);
    const discount = Number(discountPercentage);

    return price - (price * discount) / 100;
  };

  // Package functions
  const openPackageModal = (packageObj = null) => {
    if (packageObj) {
      // Edit existing - normalize data to match API expectations
      const normalizedDuration =
        packageObj.duration?.toLowerCase() || "1 month";

      setCurrentPackage({
        title: packageObj.title,
        description: packageObj.description,
        price: packageObj.price,
        duration: normalizedDuration,
        paymentType:
          packageObj.paymentType === "One-time"
            ? "Yearly"
            : packageObj.paymentType,
        subscriptionType: packageObj.subscriptionType,
        // Handle discount fields with defaults
        discountPercentage: packageObj.discountPercentage || "",
        discountVisibleTo: packageObj.discountVisibleTo || "all",
      });
      setEditingPackageId(packageObj._id || packageObj.id);
    } else {
      // Add new
      setCurrentPackage({
        title: "",
        description: "",
        price: "",
        duration: "1 month",
        paymentType: "Yearly",
        subscriptionType: "web",
        discountPercentage: "",
        discountVisibleTo: "all",
      });
      setEditingPackageId(null);
    }
    setShowPackageModal(true);
  };

  const savePackage = async () => {
    try {
      // Format package data
      const formattedPackage = {
        ...currentPackage,
        price: Number(currentPackage.price),
        discountPercentage: currentPackage.discountPercentage
          ? Number(currentPackage.discountPercentage)
          : 0,
      };

      if (editingPackageId !== null) {
        // Update existing package
        await updatePackage({
          id: editingPackageId,
          ...formattedPackage,
        });
      } else {
        // Add new package
        await createPackage(formattedPackage);
      }
      setShowPackageModal(false);
      setCurrentPackage({
        title: "",
        description: "",
        price: "",
        duration: "1 month",
        paymentType: "Yearly",
        subscriptionType: "web",
        discountPercentage: "",
        discountVisibleTo: "all",
      });
      setEditingPackageId(null);
    } catch (error) {
      console.error("Error saving package:", error);
      Modal.error({
        title: "Error saving package",
        content: error.message || "Please check all fields and try again.",
      });
    }
  };

  const handlePackageChange = (e) => {
    const { name, value } = e.target;
    setCurrentPackage((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const confirmDeletePackage = (id) => {
    Modal.confirm({
      title: "Are you sure you want to delete this subscription package?",
      content: "This action cannot be undone.",
      okText: "Yes, Delete",
      okType: "danger",
      cancelText: "Cancel",
      onOk: async () => {
        try {
          await deletePackage(id);
        } catch (error) {
          console.error("Error deleting package:", error);
          Modal.error({
            title: "Error deleting package",
            content:
              error.message || "An error occurred while deleting the package.",
          });
        }
      },
    });
  };

  // Filter packages based on selected type
  const filteredPackages =
    selectedType === "All"
      ? subscriptionPackages
      : subscriptionPackages.filter(
          (pkg) => pkg.subscriptionType === selectedType.toLowerCase()
        );

  // Filter menu items
  const typeFilterMenu = (
    <Menu>
      <Menu.Item key="all" onClick={() => setSelectedType("All")}>
        All Types
      </Menu.Item>
      <Menu.Item key="web" onClick={() => setSelectedType("Web")}>
        Web
      </Menu.Item>
      <Menu.Item key="app" onClick={() => setSelectedType("App")}>
        App
      </Menu.Item>
    </Menu>
  );

  if (isLoadingPackages) {
    return <Spinner />;
  }

  return (
    <div className="">
      {/* Type Filter */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Dropdown overlay={typeFilterMenu} trigger={["click"]}>
            <Button
              className="py-5 mr-2 text-white bg-red-600 hover:text-black"
              style={{ border: "none" }}
            >
              <div className="flex items-center gap-4">
                <Filtering />
                <span>
                  {selectedType === "All" ? "All Types" : selectedType}
                </span>
                <ChevronDown className="ml-2" size={14} />
              </div>
            </Button>
          </Dropdown>
        </div>

        {/* Add Package Button */}
        <button
          className="flex items-center gap-2 px-4 py-2 text-white bg-red-500 rounded-md"
          onClick={() => openPackageModal()}
        >
          <Plus size={18} />
          Add Subscription Package
        </button>
      </div>

      {/* Subscription Plans */}
      <div className="grid grid-cols-1 gap-8 mb-8 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filteredPackages.length === 0 ? (
          <div className="p-4 col-span-full text-center text-gray-500">
            No subscription packages found. Add a new package to get started.
          </div>
        ) : (
          filteredPackages.map((pkg) => {
            const originalPrice = Number(pkg.price);
            const discountedPrice = calculateDiscountedPrice(
              originalPrice,
              pkg.discountPercentage
            );
            const hasDiscount = pkg.discountPercentage > 0;

            return (
              <div
                key={pkg.id || pkg._id}
                className="relative flex-1 p-10 border rounded-lg min-w-64"
              >
                {/* Type Label - Rotated and positioned at top left */}
                <div
                  className="absolute top-0 px-3 py-1 text-xs text-black bg-gray-100 rounded-md -left-5"
                  style={{
                    transform: "rotate(-50deg)",
                    transformOrigin: "top right",
                  }}
                >
                  {pkg.subscriptionType}
                </div>

                {/* Discount Badge */}
                {hasDiscount && (
                  <div className="absolute top-2 right-2 px-2 py-1 text-xs text-white bg-red-500 rounded-full">
                    {pkg.discountPercentage}% OFF
                  </div>
                )}

                <div className="flex justify-end">
                  <button
                    className="p-1 mr-2"
                    onClick={() => openPackageModal(pkg)}
                  >
                    <Pencil size={18} />
                  </button>
                  <button
                    className="p-1 text-red-500"
                    onClick={() => confirmDeletePackage(pkg.id || pkg._id)}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M3 6h18"></path>
                      <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
                      <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
                    </svg>
                  </button>
                </div>

                <div className="mb-3 text-sm text-center">{pkg.title}</div>

                {/* Price Display with Discount */}
                <div className="mb-3 text-center">
                  {hasDiscount ? (
                    <div>
                      <div className="text-3xl font-bold text-gray-400 line-through">
                        ${originalPrice}
                      </div>
                      <div className="text-6xl font-bold text-red-600">
                        ${discountedPrice.toFixed(2)}
                      </div>
                    </div>
                  ) : (
                    <div className="text-6xl font-bold">${pkg.price}</div>
                  )}
                </div>

                <div className="mb-2 text-xs text-center">
                  {DURATION_OPTIONS.find(
                    (opt) => opt.value === pkg.duration?.toLowerCase()
                  )?.label || pkg.duration}{" "}
                  - {pkg.paymentType}
                </div>

                {/* Membership Visibility */}
                {hasDiscount && pkg.discountVisibleTo !== "all" && (
                  <div className="mb-2 text-xs text-center text-orange-600">
                    Discount for{" "}
                    {
                      MEMBERSHIP_OPTIONS.find(
                        (opt) => opt.value === pkg.discountVisibleTo
                      )?.label
                    }{" "}
                    only
                  </div>
                )}

                <p className="mb-8 text-xs text-center">{pkg.description}</p>
                <button className="w-full py-2 text-white bg-red-500 rounded-md">
                  Subscribe
                </button>
              </div>
            );
          })
        )}
      </div>

      {/* Add/Edit Subscription Package Modal */}
      {showPackageModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
          onClick={() => setShowPackageModal(false)}
        >
          <div
            className="w-full max-w-2xl overflow-hidden bg-white rounded-lg shadow-lg max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="text-2xl font-bold text-red-500">
                {editingPackageId !== null
                  ? "Edit Subscription Package"
                  : "Add New Subscription Package"}
              </h2>
              <button onClick={() => setShowPackageModal(false)}>
                <X size={24} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-4">
              <form className="space-y-4">
                {/* Title */}
                <div>
                  <label className="block mb-1 text-sm font-medium text-gray-700">
                    Title
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={currentPackage.title}
                    onChange={handlePackageChange}
                    className="w-full p-2 border border-gray-300 rounded-md"
                    placeholder="e.g. Basic Plan, Premium Plan"
                    required
                  />
                </div>

                {/* Duration */}
                <div>
                  <label className="block mb-1 text-sm font-medium text-gray-700">
                    Duration
                  </label>
                  <select
                    name="duration"
                    value={currentPackage.duration}
                    onChange={handlePackageChange}
                    className="w-full p-2 border border-gray-300 rounded-md"
                    required
                  >
                    {DURATION_OPTIONS.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Price */}
                <div>
                  <label className="block mb-1 text-sm font-medium text-gray-700">
                    Original Price
                  </label>
                  <input
                    type="number"
                    name="price"
                    value={currentPackage.price}
                    onChange={handlePackageChange}
                    className="w-full p-2 border border-gray-300 rounded-md"
                    placeholder="e.g. 60.99"
                    required
                  />
                </div>

                {/* Discount Section */}
                <div className="p-4 border rounded-md bg-gray-50">
                  <h3 className="mb-3 text-lg font-semibold text-gray-700">
                    Discount Settings
                  </h3>

                  {/* Discount Percentage */}
                  <div className="mb-3">
                    <label className="block mb-1 text-sm font-medium text-gray-700">
                      Discount Percentage (%)
                    </label>
                    <input
                      type="number"
                      name="discountPercentage"
                      value={currentPackage.discountPercentage}
                      onChange={handlePackageChange}
                      className="w-full p-2 border border-gray-300 rounded-md"
                      placeholder="e.g. 20 (for 20% off)"
                      min="0"
                      max="100"
                    />
                    <p className="mt-1 text-xs text-gray-500">
                      Enter 0 for no discount, or any number from 1-100 for
                      percentage off
                    </p>
                  </div>

                  {/* Discount Visibility */}
                  {/* {currentPackage.discountPercentage > 0 && (
                    <div className="mb-3">
                      <label className="block mb-1 text-sm font-medium text-gray-700">
                        Discount Visible To
                      </label>
                      <select
                        name="discountVisibleTo"
                        value={currentPackage.discountVisibleTo}
                        onChange={handlePackageChange}
                        className="w-full p-2 border border-gray-300 rounded-md"
                      >
                        {MEMBERSHIP_OPTIONS.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  )} */}

                  {/* Price Preview */}
                  {currentPackage.discountPercentage > 0 &&
                    currentPackage.price && (
                      <div className="p-3 mt-3 bg-white border rounded-md">
                        <div className="text-sm text-gray-600">
                          Price Preview:
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-lg text-gray-400 line-through">
                            ${Number(currentPackage.price).toFixed(2)}
                          </span>
                          <span className="text-xl font-bold text-red-600">
                            $
                            {calculateDiscountedPrice(
                              currentPackage.price,
                              currentPackage.discountPercentage
                            ).toFixed(2)}
                          </span>
                          <span className="text-sm text-green-600">
                            ({currentPackage.discountPercentage}% off)
                          </span>
                        </div>
                      </div>
                    )}
                </div>

                {/* Payment Type */}
                <div>
                  <label className="block mb-1 text-sm font-medium text-gray-700">
                    Payment Type
                  </label>
                  <select
                    name="paymentType"
                    value={currentPackage.paymentType}
                    onChange={handlePackageChange}
                    className="w-full p-2 border border-gray-300 rounded-md"
                    required
                  >
                    {PAYMENT_TYPE_OPTIONS.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Subscription Type */}
                <div>
                  <label className="block mb-1 text-sm font-medium text-gray-700">
                    Subscription Type
                  </label>
                  <select
                    name="subscriptionType"
                    value={currentPackage.subscriptionType}
                    onChange={handlePackageChange}
                    className="w-full p-2 border border-gray-300 rounded-md"
                    required
                  >
                    <option value="web">Web</option>
                    <option value="app">App</option>
                  </select>
                </div>

                {/* Description */}
                <div>
                  <label className="block mb-1 text-sm font-medium text-gray-700">
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={currentPackage.description}
                    onChange={handlePackageChange}
                    className="w-full p-2 border border-gray-300 rounded-md"
                    rows="4"
                    placeholder="Enter package description"
                    required
                  ></textarea>
                </div>
              </form>
            </div>

            {/* Modal Footer */}
            <div className="p-4">
              <button
                className="w-full py-3 font-medium text-white bg-red-500 rounded-md disabled:bg-red-300"
                onClick={savePackage}
                disabled={isCreating || isUpdating}
              >
                {isCreating || isUpdating ? "Saving..." : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
