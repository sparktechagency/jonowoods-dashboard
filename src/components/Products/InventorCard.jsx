import React from "react";
import { LuBadgeDollarSign, LuBox } from "react-icons/lu";
import SalesRepsCard from "../SalesRepsManagement/CategoryTable";

const InventorCard = () => {
  // Data for cards
  const cardData = [
    { icon: LuBox, value: "337", label: "Total Product Available" },
    { icon: LuBox, value: "5", label: "Low Stock Alert" },
    { icon: LuBadgeDollarSign, value: "$6000", label: "Stock Value" },
  ];

  return (
    <div className="grid grid-cols-4 gap-6 h-[120px] mb-9">
      {cardData.map((data, index) => (
        <SalesRepsCard
          key={index}
          icon={data.icon}
          value={data.value}
          label={data.label}
        />
      ))}
    </div>
  );
};

export default InventorCard;
