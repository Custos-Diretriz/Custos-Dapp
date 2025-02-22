import React from 'react';
import BackNavigation from '../components/BackNavigation';
import UploadOrReload from '../components/UploadOrRecord';
import Header from '../components/Header';
import SideBar from '../components/SideBar';

const Main = () => {
  return (
    <div
      className="flex flex-col lg:flex-row h-auto lg:h-screen text-white font-sans bg-inherit"
      style={{
        backgroundImage: 'url(/path-to-your-background.jpg)', // Replace with the image path
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      {/* Sidebar */}

      {/* Main Content */}
      <div className="flex flex-col w-full lg:w-3/4 h-auto lg:h-screen bg-opacity-70 text-white px-4 sm:px-6 lg:px-8 py-4 lg:py-0">
        <div className="mt-4">
          <BackNavigation />
          <div className="mt-6">
            <UploadOrReload />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Main;
