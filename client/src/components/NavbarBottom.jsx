import React from "react";
import {
  HomeIcon,
  Squares2X2Icon,
  EnvelopeIcon,
  PlusIcon,
  UserIcon,
} from "@heroicons/react/24/outline";
import { Link, useLocation } from "react-router-dom";

const navItems = [
  { to: "/", icon: HomeIcon, label: "Home" },
  {
    to: "/start-game",
    icon: Squares2X2Icon,
    label: "Start Game",
  },
  {
    to: "/add-quiz",
    icon: PlusIcon,
    label: "Create Quiz",
  },
  { to: "/messages", icon: EnvelopeIcon, label: "Messages" },
  { to: "/profile", icon: UserIcon, label: "My Profile" },
];

const NavbarBottom = () => {
  const location = useLocation();

  return (
    <div className="w-full  bg-gray-100 dark:bg-gray-900 fixed bottom-0 left-0 z-50 backdrop-blur-sm bg-opacity-5">
      <div className="flex justify-around max-w-3xl mx-auto px-4 py-2 rounded-t-[10px]">
        {navItems.map((item, index) => {
          const isActive = location.pathname === item.to;

          return (
            <div key={index} className="group">
              <Link
                to={item.to}
                className={`flex items-end justify-center text-center mx-auto w-full rounded-xl group-hover:text-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500 ${
                  isActive ? "text-indigo-500" : ""
                }`}
              >
                <span className="block px-1 py-1">
                  <span className="sr-only block text-xs">{item.label}</span>
                  <item.icon
                    className={`size-6 pt-1 mb-1 ${
                      isActive ? "text-indigo-500" : ""
                    }`}
                  />
                  <span
                    className={`animate duration-300 block w-5 mx-auto h-1 ${
                      isActive ? "bg-indigo-500" : ""
                    } rounded-full`}
                  ></span>
                </span>
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default NavbarBottom;
