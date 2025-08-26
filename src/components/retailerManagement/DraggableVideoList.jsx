import React from "react";
import DragDropList from "../common/DragDropList";
import VideoCard from "./VideoCard";

const DraggableVideoList = ({
  videos,
  onReorder,
  onEdit,
  onView,
  onDelete,
  onStatusChange,
  hasChanges,
  onUpdateOrder,
}) => {
  const renderVideoItem = (video, index, draggedItem) => (
    <VideoCard
      video={video}
      onEdit={onEdit}
      onView={onView}
      onDelete={onDelete}
      onStatusChange={onStatusChange}
      isDragging={draggedItem?._id === video._id}
    />
  );

  const handleUpdateOrder = async () => {
    try {
      const payload = videos.map((video, index) => ({
        _id: video._id,
        serial: index + 1,
      }));

      await onUpdateOrder(payload);
    } catch (error) {
      console.error("Order update failed:", error);
    }
  };

  return (
    <div className="draggable-video-list">
      <DragDropList
        items={videos}
        renderItem={renderVideoItem}
        onReorder={onReorder}
        onUpdateOrder={handleUpdateOrder}
        hasChanges={hasChanges}
        saveButton={true}
      />
    </div>
  );
};

export default DraggableVideoList;