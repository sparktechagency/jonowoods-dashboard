import { Menu } from "antd";
import React, { useEffect, useState } from "react";
import {  MdOutlineInventory2 } from "react-icons/md";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { HiMiniUsers, } from "react-icons/hi2";
import { IoIosLogOut } from "react-icons/io";
import { IoSettingsOutline } from "react-icons/io5";
import { PiSquaresFourLight } from "react-icons/pi";
import image4 from "../../assets/image4.png";
import Frame1 from "../../assets/Frame1.png";
import Frame2 from "../../assets/Frame2.png";
import Frame3 from "../../assets/Frame3.png";
import Frame4 from "../../assets/Frame4.png";
import Frame5 from "../../assets/Frame5.png";
import Frame6 from "../../assets/Frame6.png";
import Frame7 from "../../assets/Frame7.png";
import Frame8 from "../../assets/Frame8.png";
import { LuChartNoAxesCombined } from "react-icons/lu";


const Sidebar = () => {
  const location = useLocation();
  const path = location.pathname;
  const [selectedKey, setSelectedKey] = useState("");
  const [openKeys, setOpenKeys] = useState([]);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/auth/login");
  };

  const menuItems = [
    {
      key: "/",
      icon: (
        <img
          src={Frame1}
          alt="Retailer Icon"
          style={{
            width: "24px",
            height: "24px",
            filter: "invert(1) grayscale(1)",
            transition: "filter 0.3s ease",
          }}
          className="icon-image"
        />
      ),
      label: <Link to="/">Overview</Link>,
    },
    {
      key: "/salesManagement",
      icon: (
        <img
          src={Frame2}
          alt="Retailer Icon"
          style={{
            width: "24px",
            height: "24px",
            filter: "invert(1) grayscale(1)", // Black by default
            transition: "filter 0.3s ease", // Smooth transition for hover effect
          }}
          className="icon-image"
        />
      ),
      label: <Link to="/salesManagement">Sales Management</Link>,
    },
    {
      key: "/retailer",
      icon: (
        <img
          src={Frame3}
          alt="Retailer Icon"
          style={{
            width: "24px",
            height: "24px",
            filter: "invert(1) grayscale(1)", // Black by default
            transition: "filter 0.3s ease", // Smooth transition for hover effect
          }}
          className="icon-image"
        />
      ),
      label: <Link to="/retailer">Retailer Management</Link>,
    },
    {
      key: "/salesRepsManage",
      icon: (
        <img
          src={Frame4}
          alt="Retailer Icon"
          style={{
            width: "24px",
            height: "24px",
            filter: "invert(1) grayscale(1)", // Black by default
            transition: "filter 0.3s ease", // Smooth transition for hover effect
          }}
          className="icon-image"
        />
      ),
      label: <Link to="/salesRepsManage">Sales Reps Management</Link>,
    },

    {
      key: "/inventory",
      icon: (
        <img
          src={Frame5}
          alt="Retailer Icon"
          style={{
            width: "24px",
            height: "24px",
            filter: "invert(1) grayscale(1)", // Black by default
            transition: "filter 0.3s ease", // Smooth transition for hover effect
          }}
          className="icon-image"
        />
      ),
      label: <Link to="/inventory">Inventory Management</Link>,
    },
    {
      key: "/loyaltyProgram",
      icon: (
        <img
          src={Frame6}
          alt="Retailer Icon"
          style={{
            width: "24px",
            height: "24px",
            filter: "invert(1) grayscale(1)", // Black by default
            transition: "filter 0.3s ease", // Smooth transition for hover effect
          }}
          className="icon-image"
        />
      ),
      label: <Link to="/loyaltyProgram">Loyalty Program</Link>,
    },
    {
      key: "/subsciption",
      icon: (
        <img
          src={Frame8}
          alt="Retailer Icon"
          style={{
            width: "24px",
            height: "24px",
            filter: "invert(1) grayscale(1)", // Black by default
            transition: "filter 0.3s ease", // Smooth transition for hover effect
          }}
          className="icon-image"
        />
      ),
      label: <Link to="/subsciption">Subsciption Management</Link>,
    },

    {
      key: "subMenuSetting",
      icon: (
        <img
          src={Frame7}
          alt="Retailer Icon"
          style={{
            width: "24px",
            height: "24px",
            filter: "invert(1) grayscale(1)",
            transition: "filter 0.3s ease",
          }}
          className="icon-image"
        />
      ),
      label: "Settings",
      children: [
        {
          key: "/profile",
          label: (
            <Link to="/profile" className="  ">
              Update Profile
            </Link>
          ),
        },
        {
          key: "/terms-and-conditions",
          label: (
            <Link
              to="/terms-and-conditions"
              className="text-white hover:text-white"
            >
              Terms And Condition
            </Link>
          ),
        },
        {
          key: "/privacy-policy",
          label: (
            <Link to="/privacy-policy" className="text-white hover:text-white">
              Privacy Policy
            </Link>
          ),
        },
      ],
    },
    {
      key: "/logout",
      icon: <IoIosLogOut size={24} />,
      label: <p onClick={handleLogout}>Logout</p>,
    },
  ];

  useEffect(() => {
    const selectedItem = menuItems.find(
      (item) =>
        item.key === path || item.children?.some((sub) => sub.key === path)
    );

    if (selectedItem) {
      setSelectedKey(path);

      if (selectedItem.children) {
        setOpenKeys([selectedItem.key]);
      } else {
        const parentItem = menuItems.find((item) =>
          item.children?.some((sub) => sub.key === path)
        );
        if (parentItem) {
          setOpenKeys([parentItem.key]);
        }
      }
    }
  }, [path]);

  const handleOpenChange = (keys) => {
    setOpenKeys(keys);
  };

  return (
    <div
      className="mb-20 h-screen 
     "
    >
      <Link
        to={"/"}
        className="flex items-center justify-center py-4 border-b-2 border-primary"
      >
        <img src={image4} alt="logo" className="w-40 h-40" />
      </Link>
      <Menu
        mode="inline"
        selectedKeys={[selectedKey]}
        openKeys={openKeys}
        onOpenChange={handleOpenChange}
        className="font-poppins text-black"
        style={{
          borderRightColor: "transparent",
          background: "transparent",
          marginTop: "30px",
        }}
        items={menuItems.map((item) => ({
          ...item,
          label: <span className="">{item.label}</span>, // Ensures text remains black
          children: item.children
            ? item.children.map((subItem) => ({
                ...subItem,
                label: <span className="">{subItem.label}</span>, // Ensures submenu text remains black
              }))
            : undefined,
        }))}
      />
    </div>
  );
};

export default Sidebar;
