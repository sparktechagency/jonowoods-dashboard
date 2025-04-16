import React from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";
import { Outlet } from "react-router-dom";

const Main = () => {
  return (
    <div className="h-screen grid grid-cols-12">
      {/* Sidebar */}
      <div className="col-span-2 h-full border-r-2 overflow-y-auto border-primary bg-baseBg">
        <Sidebar />
      </div>

      {/* Main content area */}
      <div className="col-span-10 flex flex-col h-full">
        {/* Header */}
        <div className="h-[68px] bg-baseBg">
          <Header />
        </div>

        {/* Main content area (Outlet) */}
        <div className="flex-1 overflow-y-auto py-6 px-4 lg:px-10 bg-baseBg">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Main;
