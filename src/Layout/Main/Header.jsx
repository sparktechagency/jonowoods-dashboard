import React, { useState } from "react";
import { imageUrl } from "../../redux/api/baseApi";
import { Link } from "react-router-dom";
import { FaRegBell } from "react-icons/fa6";
import { Badge } from "antd";
import { useUser } from "../../provider/User";
import { Select } from "antd";
import { countries } from "../../Translation/Countries"; // Assuming you have a list of countries

const Header = () => {
  const { user } = useUser();
  const [selectedLanguage, setSelectedLanguage] = useState("eng-us");

  console.log(selectedLanguage)
  console.log(user)

  const src = user?.image?.startsWith("https")
    ? user?.image
    : `${imageUrl}/${user?.image}`;

  const handleLanguageChange = (value) => {
    setSelectedLanguage(value);
  };

  return (
    <div className="flex items-center justify-end gap-5 w-full px-4 lg:px-10">
      <div className="flex items-center gap-10">
        <Select
          value={selectedLanguage}
          onChange={handleLanguageChange}
          style={{ width: 150 }}
          options={countries.map(({ code, name, flag }) => ({
            label: (
              <div className="flex items-center gap-2">
                <img src={flag} alt={code} width={20} height={15} />
                {name} ({code.toUpperCase()})
              </div>
            ),
            value: code,
          }))}
        />
        <Link to="/notification" className="h-fit mt-[10px]">
          <Badge count={5} backgroundcolor="#3FC7EE">
            <FaRegBell color="#3FC7EE" size={24} />
          </Badge>
        </Link>
        <Link to="/profile" className="flex items-center gap-3">
          <img
            style={{
              clipPath: "circle()",
              width: 45,
              height: 45,
            }}
            src={src}
            alt="profile-pic"
            className="clip"
          />
          <div className="flex flex-col">
            <p>
              {user?.firstName} {user?.lastName}
            </p>
            <p>{user?.role || "user"}</p>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default Header;
