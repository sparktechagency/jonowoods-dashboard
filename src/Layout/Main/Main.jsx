import React from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";
import { Outlet } from "react-router-dom";

const Main = () => {
  return (
    <div className=" flex h-screen overflow-hidden">
      {/* Sidebar fixed on left */}
      <div className="w-1/6  border-r-2   border-primary bg-baseBg fixed top-0 left-0 bottom-0">
        <Sidebar />
      </div>
      <div className="flex flex-col flex-1 ml-[16.66%]">
       
        <div className="h-[68px]  fixed top-0 left-[16.66%] right-0 bg-baseBg z-10 flex items-center  border-primary">
          <Header />
        </div>
        {/* Scrollable Outlet area */}
        <main
          className="flex-1 pt-[88px] overflow-auto bg-baseBg px-4 py-6 rounded-md lg:px-10"
          style={{ height: "calc(100vh - 68px)" }}
        >
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Main;


// import React from "react";
// import Sidebar from "./Sidebar";
// import Header from "./Header";
// import { Outlet } from "react-router-dom";
 
// const Main = () => {
//   return (
//     <div className="grid grid-cols-12 gap-4 pe-3 bg-[#f1f1f9]">
//       {/* side bar */}
//       <div className="col-span-2 border-e h-screen bg-primary w-full overflow-y-auto">
//         <Sidebar />
//       </div>
 
//       {/* main container with header */}
//       <div className="col-span-10 space-y-4">
//         <div className="h-[68px] border-black bg-white rounded-b-3xl flex items-center justify-end pr-5">
//           <Header />
//         </div>
 
//         <div className="h-[calc(100vh-85px)] rounded-t-3xl overflow-y-auto">
//           <div className="h-full overflow-y-auto rounded-md">
//             <Outlet />
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };
 
// export default Main;