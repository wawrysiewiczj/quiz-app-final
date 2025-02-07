import React, { useState, useRef, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Switch } from "@headlessui/react";
import { toast } from "react-toastify";
import { Drawer } from "vaul";
import { toggleTheme } from "../redux/theme/themeSlice";

import { Cog8ToothIcon } from "@heroicons/react/24/outline";

import {
  deleteUserFailure,
  deleteUserStart,
  deleteUserSuccess,
} from "../redux/user/userSlice";

const Settings = () => {
  const [enabled1, setEnabled1] = useState(false);
  const [enabled2, setEnabled2] = useState(false);
  const [enabled3, setEnabled3] = useState(false);
  const [enabled4, setEnabled4] = useState(false);
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state) => state.user);
  const { theme } = useSelector((state) => state.theme);

  const handleThemeToggle = () => {
    dispatch(toggleTheme());
  };

  const handleDeleteAccount = async () => {
    // Dodajemy okno dialogowe do potwierdzenia
    const confirmDelete = window.confirm(
      "You sure you want to delete you account?"
    );

    if (!confirmDelete) {
      // Jeśli użytkownik kliknie "Anuluj", przerwij operację
      return;
    }

    try {
      dispatch(deleteUserStart());
      const res = await fetch(`/api/user/delete/${currentUser._id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(deleteUserFailure(data));
        toast.error(data.message);
        return;
      }
      dispatch(deleteUserSuccess(data));
    } catch (error) {
      dispatch(deleteUserFailure(error));
      toast.error(error.message);
    }
  };

  return (
    <Drawer.Root>
      <Drawer.Trigger asChild>
        <button className="rounded-xl w-full flex justify-center items-center gap-x-1 p-2 text-md font-semibold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500">
          <Cog8ToothIcon className="size-6 text-gray-800 dark:text-gray-200" />
        </button>
      </Drawer.Trigger>
      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 bg-black/40" />
        <Drawer.Content className="max-w-3xl mx-auto bg-gray-200 z-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 flex flex-col rounded-t-3xl fixed bottom-0 left-0 right-0 max-h-[80%]">
          <div className="p-4 bg-gray-200 dark:bg-gray-800 rounded-t-3xl pb-24 flex-1 overflow-auto">
            <div className="mx-auto w-12 h-1.5 flex-shrink-0 rounded-full bg-zinc-300 mb-8" />
            <div className="max-w-md mx-auto">
              <Drawer.Title className="font-medium text-center">
                Settings
              </Drawer.Title>

              <div className="col-span-4 mt-4">
                <h3 className="font-medium mb-4">Application Settings</h3>
                <div className="flex flex-col gap-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-700 dark:text-gray-300">
                      Dark Mode
                    </span>
                    <Switch
                      checked={theme === "dark"}
                      onChange={handleThemeToggle}
                      className="group inline-flex h-6 w-11 items-center rounded-full bg-black/10 transition data-[checked]:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
                    >
                      <span className="animate duration-200 size-4 translate-x-1 rounded-full bg-white transition group-data-[checked]:translate-x-6" />
                    </Switch>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-700 dark:text-gray-300">
                      Notifications
                    </span>
                    <Switch
                      disabled
                      checked={enabled2}
                      onChange={setEnabled2}
                      className="group inline-flex h-6 w-11 items-center rounded-full bg-black/10 transition data-[checked]:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
                    >
                      <span className="animate duration-200 size-4 translate-x-1 rounded-full bg-white transition group-data-[checked]:translate-x-6" />
                    </Switch>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-700 dark:text-gray-300">
                      Language
                    </span>
                    <select
                      disabled
                      className="bg-gray-100 text-gray-700 p-2 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
                    >
                      <option>English</option>
                      <option>Spanish</option>
                      <option>French</option>
                      <option>Polish</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Notification Settings */}
              <div className="col-span-4 mt-4">
                <h3 className="font-medium mb-4">Notification Settings</h3>
                <div className="flex flex-col gap-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-700 dark:text-gray-300">
                      Enable Email Notifications
                    </span>
                    <Switch
                      disabled
                      checked={enabled3}
                      onChange={setEnabled3}
                      className="group inline-flex h-6 w-11 items-center rounded-full bg-black/10 transition data-[checked]:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
                    >
                      <span className="animate duration-200 size-4 translate-x-1 rounded-full bg-white transition group-data-[checked]:translate-x-6" />
                    </Switch>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-700 dark:text-gray-300">
                      Enable Push Notifications
                    </span>
                    <Switch
                      disabled
                      checked={enabled4}
                      onChange={setEnabled4}
                      className="group inline-flex h-6 w-11 items-center rounded-full bg-black/10 transition data-[checked]:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
                    >
                      <span className="animate duration-200 size-4 translate-x-1 rounded-full bg-white transition group-data-[checked]:translate-x-6" />
                    </Switch>
                  </div>
                </div>
              </div>

              {/* Account Settings */}
              <div className="col-span-4 mt-4">
                <h3 className="font-medium mb-4">Account Settings</h3>
                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between"></div>
                  <div className="flex items-center justify-between">
                    <button className="animate duration-200 w-full flex justify-center items-center gap-x-1 rounded-xl border border-indigo-500 px-3.5 py-2.5 text-sm font-semibold text-indigo-500 shadow-sm hover:bg-indigo-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500">
                      <span className="">Change Password</span>
                    </button>
                  </div>
                  <div className="flex items-center justify-between">
                    <button
                      onClick={handleDeleteAccount}
                      className="animate duration-200 w-full flex justify-center items-center gap-x-1 rounded-xl border border-red-500 px-3.5 py-2.5 text-sm font-semibold text-red-500 shadow-sm hover:bg-red-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
                    >
                      <span className="">Delete Account</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
};

export default Settings;
