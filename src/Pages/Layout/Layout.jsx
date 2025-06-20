import React, { useState } from 'react';
import { FaBars } from 'react-icons/fa';
import Sidebar from '../../components/Sidebar';
import logo from "../../assets/fundkaro.svg";

const Layout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };
  return (
    <div className='w-screen h-screen'>
      <header className="fixed top-0 z-50 w-full bg-gradient-to-r from-darkPrimary to-lightPrimary flex h-16 items-center py-2 px-4">
        <button onClick={toggleSidebar}>
          <FaBars className="text-white w-6 h-6" />
        </button>
        <img src={logo} className="w-32 h-9 ml-4" alt="Logo" />
      </header>
      <div className='grid grid-cols-5 w-full relative top-16'>
        <div className={`col-span-1 z-20 ${sidebarOpen ? 'block' : 'hidden'} min-w-48`}>
          <Sidebar />
        </div>
        {sidebarOpen && (
          <div
            className="fixed w-screen h-screen z-10 bg-transparent opacity-50 md:hidden"
            onClick={toggleSidebar}
          >
          </div>
        )}
        <div className={`${sidebarOpen ? 'col-span-4' : 'col-span-full'}`}>
          {children}
        </div>
      </div>
      {/* Overlay to close the sidebar when clicked outside */}

    </div>
  );
};

export default Layout;
