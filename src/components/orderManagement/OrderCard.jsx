import React from "react";
import { LuBadgeDollarSign } from "react-icons/lu";
import { FaUsers } from "react-icons/fa6";
import { BiBox, BiDollar } from "react-icons/bi";

const OrderCard = () => {
  // Data for cards
  const cardData = [
    { icon:BiDollar, value: "$3570", label: "Total Revinue" },
    { icon: FaUsers, value: "100", label: "Total Order boxes" },
    { icon: BiBox, value: "150", label: "Total Free Boxes Given" },
    { icon: LuBadgeDollarSign, value: "5", label: "Pending order" },
  ];

  return (
    <div className="grid grid-cols-4 gap-x-6 h-[120px] mb-6">
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

// SalesRepsCard Component Inside the Same File
const SalesRepsCard = ({ icon: Icon, value, label }) => {
  return (
    <div className="bg-gradient-to-r from-primary to-secondary shadow-lg rounded-lg  px-6 flex items-center justify-between gap-4 hover:shadow-xl transition-shadow duration-300">
      <div className="flex items-center justify-center gap-4">
        <div className="w-16 h-16 rounded-full bg-[#EFEFEF] flex items-center justify-center">
          <Icon color="#007BA5" size={40} />
        </div>
        <div>
          <h3 className="text-white text-[32px] font-semibold">{value}</h3>
          <h2 className="text-white text-center text-md">{label}</h2>
        </div>
      </div>
    </div>
  );
};

export default OrderCard;
