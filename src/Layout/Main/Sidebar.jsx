import { Menu, Modal } from "antd";
import React, { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { IoIosLogOut } from "react-icons/io";
import {
  Dashboard,
  SalesRepsmanagement,
  Settings,
  Videomanagement,
  Inventorymanagement,
  LoyaltyProgram,
  Subscriptionmanagement,
  Usermanagement,
  LoginCredentials,
  ComingSoon,
} from "../../components/common/Svg";
import image4 from "../../assets/image4.png"; // Logo image

const Sidebar = () => {
  const location = useLocation();
  const path = location.pathname;
  const [selectedKey, setSelectedKey] = useState("");
  const [openKeys, setOpenKeys] = useState([]);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const navigate = useNavigate();

  // ✅ Token decode safely
  const token = localStorage.getItem("token");
  let decoded = {};
  let role = null;

  if (token && typeof token === "string") {
    try {
      decoded = jwtDecode(token);
      role = decoded?.role;
    } catch (error) {
      console.error("Invalid token:", error);
      localStorage.removeItem("token");
      navigate("/auth/login"); // Redirect to login if token invalid
    }
  } else {
    navigate("/auth/login"); // Redirect if token is missing
  }

  const showLogoutConfirm = () => {
    setIsLogoutModalOpen(true);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLogoutModalOpen(false);
    navigate("/auth/login");
  };

  const handleCancel = () => {
    setIsLogoutModalOpen(false);
  };

  const isItemActive = (itemKey) => {
    return (
      selectedKey === itemKey ||
      (itemKey === "subMenuSetting" &&
        ["/profile", "/terms-and-conditions", "/privacy-policy"].includes(
          selectedKey
        ))
    );
  };

  const renderIcon = (IconComponent, itemKey) => {
    const isActive = isItemActive(itemKey);
    return (
      <div
        style={{ width: 28, height: 28 }}
        className={isActive ? "svg-active" : ""}
      >
        <IconComponent
          className="menu-icon"
          fill={isActive ? "#ffffff" : "#1E1E1E"}
          style={{
            fontWeight: "bold",
            strokeWidth: isActive ? 2 : 1,
          }}
        />
      </div>
    );
  };

  const menuItems = [
    {
      key: "/",
      icon: renderIcon(Dashboard, "/"),
      label: <Link to="/">Overview</Link>,
      roles: ["SUPER_ADMIN"],
    },
    {
      key: "/user-management",
      icon: renderIcon(Usermanagement, "/user-management"),
      label: <Link to="/user-management">Users management</Link>,
      roles: ["SUPER_ADMIN"],
    },
    {
      key: "/category-management",
      icon: renderIcon(SalesRepsmanagement, "/category-management"),
      label: <Link to="/category-management">Category management</Link>,
    },
    {
      key: "/video-management",
      icon: renderIcon(Videomanagement, "/video-management"),
      label: <Link to="/video-management">Video management</Link>,
    },
    {
      key: "/coming-soon",
      icon: renderIcon(ComingSoon, "/coming-soon"),
      label: <Link to="/coming-soon"> Coming Soon</Link>,
    },
    {
      key: "/today-video",
      icon: renderIcon(Videomanagement, "/today-video"),
      label: <Link to="/today-video">Challenge management</Link>,
    },
    {
      key: "/daily-inspiration",
      icon: renderIcon(Videomanagement, "/daily-inspiration"),
      label: <Link to="/daily-inspiration"> Daily Inspiration</Link>,
    },
    {
      key: "/create-post",
      icon: renderIcon(LoginCredentials, "/create-post"),
      label: <Link to="/create-post">Create Post</Link>,
    },
    {
      key: "/loyalty-program",
      icon: renderIcon(Subscriptionmanagement, "/loyalty-program"),
      label: <Link to="/loyalty-program">Subscription package</Link>,
      roles: ["SUPER_ADMIN"],
    },
    {
      key: "/subcription-user",
      icon: renderIcon(LoginCredentials, "/subcription-user"),
      label: <Link to="/subcription-user">Subscription Users</Link>,
      roles: ["SUPER_ADMIN"],
    },
    {
      key: "/inventory",
      icon: renderIcon(Inventorymanagement, "/inventory"),
      label: <Link to="/inventory">Quotation management</Link>,
    },
    {
      key: "/subsciption",
      icon: renderIcon(LoyaltyProgram, "/subsciption"),
      label: <Link to="/subsciption">Push Notification</Link>,
    },
    {
      key: "/login-credentials",
      icon: renderIcon(LoginCredentials, "/login-credentials"),
      label: <Link to="/login-credentials">Login Credentials</Link>,
      roles: ["SUPER_ADMIN"],
    },
    {
      key: "/contactUs",
      icon: renderIcon(LoginCredentials, "/contactUs"),
      label: <Link to="/contactUs">Contact Us</Link>,
    },
    {
      key: "subMenuSetting",
      icon: renderIcon(Settings, "subMenuSetting"),
      label: "Settings",
      children: [
        {
          key: "/profile",
          label: <Link to="/profile">Update Profile</Link>,
          roles: ["SUPER_ADMIN"],
        },
        {
          key: "/terms-and-conditions",
          label: <Link to="/terms-and-conditions">Terms And Condition</Link>,
        },
        {
          key: "/privacy-policy",
          label: <Link to="/privacy-policy">Privacy Policy</Link>,
        },
      ],
    },
    {
      key: "/logout",
      icon: <IoIosLogOut size={24} />,
      label: <p onClick={showLogoutConfirm}>Logout</p>,
    },
  ];

  const getFilteredMenuItems = () => {
    return menuItems.filter((item) => {
      if (item.roles) {
        return item.roles.includes(role);
      }
      if (item.children) {
        const filteredChildren = item.children.filter((child) => {
          if (child.roles) {
            return child.roles.includes(role);
          }
          return true;
        });
        return filteredChildren.length > 0;
      }
      return true;
    });
  };

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
    <div className="mb-20 h-screen flex flex-col">
      <div className="flex-shrink-0 border-b-2 border-primary flex items-center justify-center h-36">
        <img src={image4} alt="logo" className="w-60" />
      </div>

      <div className="flex-1 overflow-y-auto mt-2">
        <Menu
          mode="inline"
          selectedKeys={[selectedKey]}
          openKeys={openKeys}
          onOpenChange={handleOpenChange}
          className="font-poppins text-black sidebar-menu"
          style={{
            borderRightColor: "transparent",
            background: "transparent",
          }}
          items={getFilteredMenuItems().map((item) => ({
            ...item,
            label: <span>{item.label}</span>,
            children: item.children
              ? item.children.map((subItem) => ({
                  ...subItem,
                  label: <span>{subItem.label}</span>,
                }))
              : undefined,
          }))}
        />
      </div>

      {/* Logout Modal */}
      <Modal
        centered
        title="Confirm Logout"
        open={isLogoutModalOpen}
        onOk={handleLogout}
        onCancel={handleCancel}
        okText="Logout"
        cancelText="Cancel"
        okButtonProps={{
          style: {
            backgroundColor: "red",
            borderColor: "red",
          },
        }}
      >
        <p>Are you sure you want to logout?</p>
      </Modal>
    </div>
  );
};

export default Sidebar;
