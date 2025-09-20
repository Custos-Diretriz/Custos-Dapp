import React from 'react';

interface NotificationsDropdownProps {
  [key: string]: any;
}

const NotificationsDropdown = (props: NotificationsDropdownProps): React.JSX.Element => {
  return (
    <div
      className={`absolute 0 px-2 border border-gray-500 rounded-xl bg-[#050519]  py-4 w-[60vh]  top-12 z-10 text-white ${
        props.notificationDropDowm ? "block  right-0" : "hidden"
      }`}
    >
      {/* Notification Header */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-lg">Notifications</h1>
        <button className="text-[11px] border border-gray-700 p-2 rounded-lg">
          Mark all as read
        </button>
      </div>
      {/* Notifications List*/}

      <div className="flex flex-col gap-2 overflow-auto h-[20em]">
        {/* <div className="border border-gray-600 p-2 w-full rounded-md flex gap-2">
          <div className="min-w-[2em] min-h-[2em] max-w-[2em] max-h-[2em] bg-[#171735] rounded-full flex items-center justify-center">
            <Image src="/bell.svg" alt="Notifications" className="w-5 h-5" />
          </div>

          <p className="text-[10px] text-gray-400">
            Lorem ipsum, dolor sit amet consectetur adipisicing elit. Sed
            explicabo repellendus laboriosam temporibus ullam quasi debitis...
          </p>
        </div> */}
       
      </div>
    </div>
  );
};

export default NotificationsDropdown;
