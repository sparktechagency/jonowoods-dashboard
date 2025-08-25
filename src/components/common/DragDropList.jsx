// DragDropList.jsx
import React, { useState } from "react";

const DragDropList = ({
  items,
  renderItem,
  onReorder,
  onUpdateOrder, 
  hasChanges,
  saveButton = true,
}) => {
  const [draggedItem, setDraggedItem] = useState(null);
  const [dragOverItem, setDragOverItem] = useState(null);

  const handleDragStart = (e, item) => {
    setDraggedItem(item);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e, item) => {
    e.preventDefault();
    setDragOverItem(item);
    e.dataTransfer.dropEffect = "move";
  };

  const handleDragEnd = () => {
    setDraggedItem(null);
    setDragOverItem(null);
  };

  const handleDrop = (e, targetItem) => {
    e.preventDefault();

    if (!draggedItem || draggedItem._id === targetItem._id) return;

    const draggedIndex = items.findIndex((i) => i._id === draggedItem._id);
    const targetIndex = items.findIndex((i) => i._id === targetItem._id);

    const newItems = [...items];
    const [removed] = newItems.splice(draggedIndex, 1);
    newItems.splice(targetIndex, 0, removed);


    const reorderedItems = newItems.map((item, index) => ({
      ...item,
      serial: index + 1,
    }));

    onReorder(reorderedItems);
  };

  const handleSaveOrder = async () => {
    try {
      const payload = items.map((item, index) => ({
        _id: item._id,
        serial: index + 1,
      }));

      await onUpdateOrder(payload); 
    } catch (error) {
      console.error("Order update failed:", error);
    }
  };

  return (
    <div>
      {saveButton && hasChanges && (
        <div style={{ marginBottom: 16, textAlign: "right" }}>
          <button
            onClick={handleSaveOrder}
            style={{
              backgroundColor: "#52c41a",
              color: "#fff",
              padding: "8px 16px",
              border: "none",
              borderRadius: "8px",
              fontWeight: "600",
              cursor: "pointer",
            }}
          >
            Save Order
          </button>
        </div>
      )}

      {items.map((item, index) => (
        <div
          key={item._id}
          draggable
          onDragStart={(e) => handleDragStart(e, item)}
          onDragOver={(e) => handleDragOver(e, item)}
          onDragEnd={handleDragEnd}
          onDrop={(e) => handleDrop(e, item)}
          className={`drag-item ${
            dragOverItem?._id === item._id ? "drag-over" : ""
          }`}
          style={{
            transition: "all 0.2s ease",
            marginBottom: "10px",
          }}
        >
          {renderItem(item, index, draggedItem)}
        </div>
      ))}
    </div>
  );
};

export default DragDropList;
