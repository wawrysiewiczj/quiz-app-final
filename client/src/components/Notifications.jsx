import React from "react";
import "react-toastify/dist/ReactToastify.css";
import { useNotificationCenter } from "react-toastify/addons/use-notification-center";
import { BellIcon } from "@heroicons/react/24/outline";
import { Drawer } from "vaul";

const Notifications = () => {
  const { notifications } = useNotificationCenter();
  const { unreadCount } = useNotificationCenter();

  return (
    <Drawer.Root>
      <Drawer.Trigger asChild>
        <button className="w-auto flex justify-center items-center gap-x-1 rounded-xl px-3 py-3 text-sm font-semibold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500 relative">
          <BellIcon className="size-6 text-gray-800 dark:text-gray-200" />
          {unreadCount > 0 && (
            <span className="relative">
              <span className="absolute top-0 right-1 inline-flex items-center justify-center w-2 h-2 rounded-full bg-red-500 text-xs font-medium text-gray-600 ring-1 ring-inset ring-gray-500/10"></span>
            </span>
          )}
        </button>
      </Drawer.Trigger>
      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 bg-black/40 " />
        <Drawer.Content className="max-w-3xl mx-auto bg-gray-100 z-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 flex flex-col rounded-t-3xl fixed bottom-0 left-0 right-0 max-h-[80%]">
          <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-t-3xl pb-24 flex-1 overflow-auto">
            <div className="mx-auto w-12 h-1.5 flex-shrink-0 rounded-full bg-zinc-300 mb-8" />
            <div className="max-w-md mx-auto text-center">
              <Drawer.Title className="font-medium text-center">
                Notifications
              </Drawer.Title>

              <ul className="flex flex-col gap-2 mt-4 text-left">
                {notifications.length === 0 && <p>No notifications found.</p>}
                {notifications.map((notification) => (
                  <li
                    key={notification.id}
                    className="p-4 rounded-xl shadow-sm bg-black/5 dark:bg-white/5"
                  >
                    <span>{notification.content}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
};

export default Notifications;
