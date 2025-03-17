import React from "react";
import { LuBadgeDollarSign } from "react-icons/lu";
import SalesRepsCard from "./SalesRepsCard";
import { FaUsers } from "react-icons/fa6";

const SalesCardInfo = () => {
  // Data for cards
  const cardData = [
    { icon: FaUsers, value: "100", label: "Total Products" },
    { icon: FaUsers, value: "$12", label: "Low Stoke Alert" },
    { icon: LuBadgeDollarSign, value: "$5000", label: "Stoke value" },
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

export default SalesCardInfo;
