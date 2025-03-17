import React from 'react';
import { Outlet } from 'react-router-dom';

const Auth = () => {
    return (
      <div
        className="w-full flex items-center justify-center relative"
        style={{
          height: "100vh",
        }}
      >
        <div
          style={{
            background: "#3FC7EE",
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
            background: "#ffffff",
            padding: 30,
            borderRadius: 10,
            width: 510,
            position: "relative",
            zIndex: 2,
          }}
          className="shadow-xl"
        >
          <Outlet />
        </div>
      </div>
    );
};

export default Auth;
