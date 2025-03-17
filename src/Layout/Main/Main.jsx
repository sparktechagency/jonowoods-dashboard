import React from 'react'
import Sidebar from './Sidebar';
import Header from './Header';
import { Outlet } from 'react-router-dom';

const Main = () => {
    return (
      <div className="grid grid-cols-12">
        {/* side bar */}
        <div className="col-span-2 h-screen border-r-2 border-primary bg-baseBg">
          <Sidebar  />
        </div>

        {/* main container with header */}
        <div className="col-span-10">
          {/* <div className='h-[68px] flex items-center  pr-5 '>
                    <Header/>
                </div> */}

          <div className="bg-baseBg h-screen ">
            <div className=" overflow-y-auto rounded-md pt-6 px-4 lg:px-10">
              <Outlet />
            </div>
          </div>
        </div>
      </div>
    );
}

export default Main