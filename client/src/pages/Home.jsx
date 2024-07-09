import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ChevronRightIcon } from "@heroicons/react/24/outline";
import { useSelector } from "react-redux";
import {
  AcademicCapIcon,
  PlusIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";

import Animation from "../components/Animation";
import QuizList from "../components/QuizList";
import CategoryList from "../components/CategoryList";

const Home = () => {
  const { currentUser } = useSelector((state) => state.user);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get("searchTerm");
    if (searchTermFromUrl) {
      setSearchTerm(searchTermFromUrl);
    }
  }, [location.search]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams(location.search);
    urlParams.set("searchTerm", searchTerm);
    const searchQuery = urlParams.toString();
    navigate(`/search?${searchQuery}`);
  };

  return (
    <Animation>
      <div className="flex flex-col gap-2">
        <div className="mb-4">
          <h2 className="text-2xl font-semibold tracking-tight">
            Hello, {currentUser.username}
          </h2>
          <p className="mb-4">Welcome back!</p>

          <p className="text-sm text-gray-800 dark:text-gray-200">
            Test your skills against friends and family using QuizApp and
            improve your skills day by day.
          </p>
        </div>
        <form className="max-w-3xl mx-auto w-full flex gap-2 mb-4">
          <label
            htmlFor="name"
            className="sr-only block text-gray-700 text-sm font-bold"
          >
            Search
          </label>
          <input
            type="text"
            id="name"
            name="name"
            placeholder="Search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 bg-white dark:bg-gray-700 border-none px-3.5 py-2.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-600"
          />

          <button className="flex justify-center items-center bg-violet-600 text-white px-3.5 py-2.5 rounded-xl shadow hover:bg-violet-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
            <MagnifyingGlassIcon className="w-5 h-5 inline" />
          </button>
        </form>
        {/* <div className="grid grid-col-4 gap-2">
          <Link
            to="/profile"
            className="animate duration-300 col-span-4 w-full flex justify-between items-center rounded-xl px-3.5 py-2.5 border border-1 border-gray-300 dark:border-gray-700 shadow-sm hover:bg-violet-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
          >
            <div>
              <h3 className="text-xl font-semibold tracking-tight mb-2">
                Your Profile
              </h3>
              <p className="text-sm">Check your progress and achievements</p>
            </div>
            <div>
              <span>
                <ChevronRightIcon className="size-6" />
              </span>
            </div>
          </Link>
        </div> */}
        <div className="grid grid-cols-4 gap-2">
          <Link
            to="/start-game"
            className="animate duration-300 col-span-4 w-full flex justify-between items-stretch rounded-xl px-3.5 py-2.5 bg-violet-600 shadow-sm text-white hover:bg-violet-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
          >
            <div>
              <h3 className="text-xl font-semibold tracking-tight mb-2">
                Let's Start Now!
              </h3>
              <p className="text-sm text-gray-100">
                Play, Learn and Explore with Quiz App!
              </p>
            </div>
            <div className="flex justify-center items-center">
              <span>
                <ChevronRightIcon className="size-6" />
              </span>
            </div>
          </Link>
          <Link
            to="/ranking"
            className="animate duration-200 col-span-4 w-full flex justify-between items-stretch gap-x-1 rounded-xl border border-violet-500 px-3.5 py-2.5 text-md font-semibold text-violet-500 shadow-sm hover:bg-violet-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
          >
            <div>
              <h3 className="text-xl font-semibold tracking-tight mb-2">
                Check out leaderboard
              </h3>
              <p className="text-sm">Play, Learn and Expllore with Quiz App!</p>
            </div>
            <div className="flex justify-center items-center">
              <span>
                <ChevronRightIcon className="size-6" />
              </span>
            </div>
          </Link>
        </div>
        <CategoryList />
        <QuizList />
      </div>
    </Animation>
  );
};

export default Home;
