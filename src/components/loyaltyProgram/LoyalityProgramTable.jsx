import { useState } from "react";
import { Pencil, Trash2, X } from "lucide-react";
import JoditEditor from "jodit-react";
import { Modal } from "antd"; // Import Modal from Ant Design

export default function SubscriptionManagement() {
  const [showRuleModal, setShowRuleModal] = useState(false);
  const [showPackageModal, setShowPackageModal] = useState(false);
  const [subscriptionRules, setSubscriptionRules] = useState([
    "Price dropped! Save on your favorite items.",
    "Price dropped! Save on your favorite items.",
    "Price dropped! Save on your favorite items.",
    "Price dropped! Save on your favorite items.",
    "Price dropped! Save on your favorite items.",
    "Price dropped! Save on your favorite items.",
    "Price dropped! Save on your favorite items.",
  ]);
  const [currentRule, setCurrentRule] = useState(""); // To hold the current rule for editing
  const [isEditing, setIsEditing] = useState(false); // Flag to track if we're editing
  const [editingRuleIndex, setEditingRuleIndex] = useState(null); // Index of rule being edited

  // For package editing
  const [subscriptionPlans, setSubscriptionPlans] = useState([
    {
      period: "1 Month",
      price: "$60.99",
      trialDays: 7,
      description:
        "Get more access to entire yoga with jen library of classes, meditations and courses.",
    },
    {
      period: "6 Month",
      price: "$60.99",
      trialDays: 7,
      description:
        "Get more access to entire yoga with jen library of classes, meditations and courses.",
    },
    {
      period: "1 Year",
      price: "$60.99",
      trialDays: 7,
      description:
        "Get more access to entire yoga with jen library of classes, meditations and courses.",
    },
  ]);
  const [currentPackage, setCurrentPackage] = useState({
    period: "",
    price: "",
    trialDays: 0,
    description: "",
  });
  const [editingPackageIndex, setEditingPackageIndex] = useState(null);

  // Rule functions
  const addSubscriptionRule = () => {
    if (isEditing && editingRuleIndex !== null) {
      // Update existing rule
      const updatedRules = [...subscriptionRules];
      updatedRules[editingRuleIndex] = currentRule;
      setSubscriptionRules(updatedRules);
    } else {
      // Add new rule
      setSubscriptionRules([
        ...subscriptionRules,
        currentRule || "Price dropped! Save on your favorite items.",
      ]);
    }
    setShowRuleModal(false);
    setCurrentRule(""); // Clear the rule after adding
    setIsEditing(false); // Reset editing flag
    setEditingRuleIndex(null); // Reset index
  };

  const editSubscriptionRule = (index) => {
    setCurrentRule(subscriptionRules[index]);
    setIsEditing(true);
    setEditingRuleIndex(index);
    setShowRuleModal(true); // Open modal to edit the rule
  };

  const handleDeleteRule = (index) => {
    Modal.confirm({
      title: "Are you sure you want to delete this subscription rule?",
      content: "This action cannot be undone.",
      okText: "Yes, Delete",
      okType: "danger",
      cancelText: "Cancel",
      onOk: () => {
        // Proceed with deletion if confirmed
        deleteSubscriptionRule(index);
      },
    });
  };

  const deleteSubscriptionRule = (index) => {
    const updatedRules = subscriptionRules.filter((_, i) => i !== index);
    setSubscriptionRules(updatedRules);
  };

  const handleRuleChange = (newContent) => {
    setCurrentRule(newContent); // Update the current rule content
  };

  // Package functions
  const savePackage = () => {
    if (editingPackageIndex !== null) {
      // Update existing package
      const updatedPlans = [...subscriptionPlans];
      updatedPlans[editingPackageIndex] = currentPackage;
      setSubscriptionPlans(updatedPlans);
    }
    setShowPackageModal(false);
    setCurrentPackage({
      period: "",
      price: "",
      trialDays: 0,
      description: "",
    });
    setEditingPackageIndex(null);
  };

  const editPackage = (index) => {
    setCurrentPackage({ ...subscriptionPlans[index] });
    setEditingPackageIndex(index);
    setShowPackageModal(true);
  };

  const handlePackageChange = (e) => {
    const { name, value } = e.target;
    setCurrentPackage((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const joditConfig = {
    readonly: false,
    toolbar: true,
    width: "100%",
    height: 200,
  };

  return (
    <div className="">
      {/* Subscription Plans */}
      <div className="grid grid-cols-4 gap-16 mb-8">
        {subscriptionPlans.map((plan, index) => (
          <div
            key={index}
            className="flex-1 border rounded-lg p-10 min-w-64 relative"
          >
            <button
              className="absolute top-4 right-4"
              onClick={() => editPackage(index)}
            >
              <Pencil size={28} />
            </button>
            <div className="text-sm text-center mb-2">For {plan.period}</div>
            <div className="text-6xl font-bold text-center mb-2">
              {plan.price}
            </div>
            <div className="text-xs text-center mb-4">
              {plan.trialDays}-Days Free Trial
            </div>
            <p className="text-xs text-center mb-6">{plan.description}</p>
            <button className="w-full bg-red-500 text-white py-2 rounded-md">
              Subscribe
            </button>
          </div>
        ))}
      </div>

      {/* Add Subscription Rules Button */}
      <div className="flex justify-end mb-4">
        <button
          className="bg-red-500 text-white px-4 py-2 rounded-md flex items-center"
          onClick={() => {
            setShowRuleModal(true);
            setIsEditing(false);
            setCurrentRule("");
          }}
        >
          Add Subscription Rules
        </button>
      </div>

      {/* Subscription Rules List */}
      <div className="border-t-8 border-red-500 mb-8 rounded-lg ">
        <h2 className="text-lg p-2 bg-red-500 text-white">
          Subscription Rules
        </h2>
        <div className="bg-white">
          {subscriptionRules.map((rule, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-3 border-b"
            >
              <div className="flex items-center">
                <span className="inline-flex items-center justify-center rounded-full bg-gray-100 w-6 h-6 mr-3 text-xs">
                  {index + 1}
                </span>
                <span dangerouslySetInnerHTML={{ __html: rule }}></span>
              </div>
              <div className="flex gap-2">
                <button onClick={() => editSubscriptionRule(index)}>
                  <Pencil size={16} />
                </button>
                <button onClick={() => handleDeleteRule(index)}>
                  <Trash2 size={16} className="text-red-500" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add/Edit Subscription Rule Modal */}
      {showRuleModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white w-full max-w-2xl rounded-lg shadow-lg overflow-hidden">
            {/* Modal Header */}
            <div className="flex justify-between items-center p-4 border-b">
              <h2 className="text-2xl font-bold text-red-500">
                {isEditing
                  ? "Edit Subscription Rule"
                  : "Add New Subscription Rule"}
              </h2>
              <button onClick={() => setShowRuleModal(false)}>
                <X size={24} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-4 min-h-64">
              {/* Jodit Editor */}
              <JoditEditor
                value={currentRule}
                config={joditConfig}
                onChange={handleRuleChange}
              />
            </div>

            {/* Modal Footer */}
            <div className="p-4">
              <button
                className="w-full bg-red-500 text-white py-3 rounded-md font-medium"
                onClick={addSubscriptionRule}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Subscription Package Modal */}
      {showPackageModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white w-full max-w-2xl rounded-lg shadow-lg overflow-hidden">
            {/* Modal Header */}
            <div className="flex justify-between items-center p-4 border-b">
              <h2 className="text-2xl font-bold text-red-500">
                Edit Subscription Package
              </h2>
              <button onClick={() => setShowPackageModal(false)}>
                <X size={24} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-4">
              <form className="space-y-4">
                {/* Period */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Period
                  </label>
                  <input
                    type="text"
                    name="period"
                    value={currentPackage.period}
                    onChange={handlePackageChange}
                    className="w-full border border-gray-300 rounded-md p-2"
                    placeholder="e.g. 1 Month, 6 Month, 1 Year"
                  />
                </div>

                {/* Price */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Price
                  </label>
                  <input
                    type="text"
                    name="price"
                    value={currentPackage.price}
                    onChange={handlePackageChange}
                    className="w-full border border-gray-300 rounded-md p-2"
                    placeholder="e.g. $60.99"
                  />
                </div>

                {/* Trial Days */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Free Trial Days
                  </label>
                  <input
                    type="number"
                    name="trialDays"
                    value={currentPackage.trialDays}
                    onChange={handlePackageChange}
                    className="w-full border border-gray-300 rounded-md p-2"
                    placeholder="e.g. 7"
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={currentPackage.description}
                    onChange={handlePackageChange}
                    className="w-full border border-gray-300 rounded-md p-2"
                    rows="4"
                    placeholder="Enter package description"
                  ></textarea>
                </div>
              </form>
            </div>

            {/* Modal Footer */}
            <div className="p-4">
              <button
                className="w-full bg-red-500 text-white py-3 rounded-md font-medium"
                onClick={savePackage}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
