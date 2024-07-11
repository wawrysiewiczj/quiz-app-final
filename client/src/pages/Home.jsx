import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ChevronRightIcon } from "@heroicons/react/24/outline";
import { useSelector } from "react-redux";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";

import Animation from "../components/Animation";
import QuizList from "../components/QuizList";
import CategoryList from "../components/CategoryList";
import { Field, Fieldset, Input } from "@headlessui/react";
import clsx from "clsx";

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
        <div className="w-full ">
          <Fieldset>
            <Field>
              <div className="relative">
                <Input
                  required
                  placeholder="Search"
                  className={clsx(
                    "block w-full rounded-lg border-none bg-black/5 dark:bg-white/5 py-2.5 px-3 text-sm/6 placeholder:text-gray-700 dark:placeholder:text-gray-400",
                    "focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:outline-indigo-500"
                  )}
                />
                <MagnifyingGlassIcon
                  className="group pointer-events-none absolute top-3.5 right-2.5 size-4"
                  aria-hidden="true"
                />
              </div>
            </Field>
          </Fieldset>
        </div>
        <div className="mb-2">
          <h2 className="text-2xl font-semibold tracking-tight">
            Hello, {currentUser.username}
          </h2>
          <p className="mb-4">Welcome back!</p>

          <p className="text-sm text-gray-800 dark:text-gray-200">
            Test your skills against friends and family using QuizApp and
            improve your skills day by day.
          </p>
        </div>

        {/* <div className="grid grid-col-4 gap-2">
          <Link
            to="/profile"
            className="animate duration-300 col-span-4 w-full flex justify-between items-center rounded-xl px-3.5 py-2.5 border border-1 border-gray-300 dark:border-gray-700 shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
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
            className="animate duration-300 col-span-4 w-full flex justify-between items-stretch rounded-xl px-3.5 py-2.5 bg-indigo-500 shadow-sm text-white hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
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
                <ChevronRightIcon className="size-4" />
              </span>
            </div>
          </Link>
          <Link
            to="/ranking"
            className="animate duration-200 col-span-4 w-full flex justify-between items-stretch gap-x-1 rounded-xl border border-indigo-500 px-3.5 py-2.5 text-md font-semibold text-indigo-500 shadow-sm hover:bg-indigo-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
          >
            <div>
              <h3 className="text-xl font-semibold tracking-tight mb-2">
                Check out leaderboard
              </h3>
              <p className="text-sm">Play, Learn and Expllore with Quiz App!</p>
            </div>
            <div className="flex justify-center items-center">
              <span>
                <ChevronRightIcon className="size-4" />
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
