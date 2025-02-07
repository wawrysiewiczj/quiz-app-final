import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  ChevronLeftIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";
import { useSelector } from "react-redux";
import Notifications from "./Notifications";

const headerIconClassName =
  "w-auto flex justify-center items-center gap-x-1 rounded-xl px-3 py-3 text-sm font-semibold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500";

const Header = () => {
  const { currentUser } = useSelector((state) => state.user);
  const location = useLocation();

  const getTitle = () => {
    const { pathname } = location;
    switch (pathname) {
      case "/":
        return "Quiz App";
      case "/start":
        return "Quiz App";
      case "/notifications":
        return "Notifications";
      case "/messages":
        return "Chat";
      case "/settings":
        return "Settings";
      case "/profile":
        return "Profile";
      case "/edit-profile":
        return "Edit Profile";
      case "/start-game":
        return "Choose category";
      case "/create-quiz":
        return "Create Quiz";
      default:
        return "Quiz App";
    }
  };

  return (
    <div className="w-full py-1.5 flex flex-col justify-between items-center max-w-3xl mx-auto">
      <div className="w-full py-1.5 flex justify-between items-center max-w-3xl mx-auto">
        {currentUser ? (
          <Link to="/home" className={`${headerIconClassName}`}>
            <ChevronLeftIcon className="size-6 text-gray-800 dark:text-gray-200" />
          </Link>
        ) : (
          <div className={headerIconClassName} />
        )}

        <h2 className="px-3 py-2 text-lg font-semibold">{getTitle()}</h2>
        {currentUser ? (
          <Notifications />
        ) : (
          <div className={headerIconClassName} />
        )}
      </div>
      {/* <form className="w-full flex gap-2">
        <input
          type="text"
          className="flex-1 bg-black placeholder:text-gray-500 text-gray-800 border-none px-3.5 py-2.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          placeholder="Search"
        />
        <button className="flex justify-center items-center bg-indigo-500 text-white px-3.5 py-2.5 rounded-xl shadow hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
          <MagnifyingGlassIcon className="w-5 h-5 inline" />
        </button>
      </form> */}
    </div>
  );
};

export default Header;
