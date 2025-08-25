import React, { useState } from "react";

const ReusableDragTable = ({
  data,
  columns, // [{ key: 'name', title: 'Name' }, { key: 'status', title: 'Status' }, ...]
  onReorder,
  onUpdateOrder,
  hasChanges,
}) => {
  const [draggedItem, setDraggedItem] = useState(null);
  const [dragOverItem, setDragOverItem] = useState(null);

  const handleDragStart = (item) => {
    setDraggedItem(item);
  };

  const handleDragOver = (e, item) => {
    e.preventDefault();
    setDragOverItem(item);
  };

  const handleDrop = (targetItem) => {
    if (!draggedItem || draggedItem.id === targetItem.id) return;

    const draggedIndex = data.findIndex(d => d.id === draggedItem.id);
    const targetIndex = data.findIndex(d => d.id === targetItem.id);

    const newData = [...data];
    const [removed] = newData.splice(draggedIndex, 1);
    newData.splice(targetIndex, 0, removed);

    const updatedData = newData.map((d, idx) => ({ ...d, serial: idx + 1 }));

    onReorder(updatedData);

    setDraggedItem(null);
    setDragOverItem(null);
  };

  const handleSaveOrder = () => {
    if (onUpdateOrder) {
      onUpdateOrder();
    }
  };

  return (
    <div>
      {hasChanges && (
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

      <table className="w-full table-auto border-collapse">
        <thead>
          <tr>
            {columns.map(col => (
              <th key={col.key} style={{ textAlign: "left", padding: "8px" }}>
                {col.title}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <tr
              key={item.id}
              draggable
              onDragStart={() => handleDragStart(item)}
              onDragOver={(e) => handleDragOver(e, item)}
              onDrop={() => handleDrop(item)}
              style={{
                backgroundColor:
                  dragOverItem?.id === item.id ? "#e6f7ff" : "white",
                cursor: "grab",
              }}
            >
              {columns.map(col => (
                <td key={col.key} style={{ padding: "8px" }}>
                  {col.render ? col.render(item, index) : item[col.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ReusableDragTable;
