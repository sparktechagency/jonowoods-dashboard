import React from "react";
import { Outlet } from "react-router-dom";
import bgImage from "../../assets/bgImage.png"; // Importing the image

const Auth = () => {
  return (
    <div
      className="w-full flex items-center justify-end relative"
      style={{
        height: "100vh",
      }}
    >
      <div
        style={{
          backgroundImage: `url(${bgImage})`, // Using the imported bgImage
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 1,
        }}
      ></div>

      <div
        style={{
          background: "#FCFCFC3B",
          padding: 30,
          borderRadius: 15,
          width: 510,
          position: "relative",
          right: 100,
          zIndex: 1,
         border: "2px solid #A92C2C",
backdropFilter: "blur(10px)",
        }}
        className="shadow-xl "
      >
        <Outlet />
      </div>
    </div>
  );
};

export default Auth;
