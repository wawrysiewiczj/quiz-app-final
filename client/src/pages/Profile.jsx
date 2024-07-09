import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { signOut } from "../redux/user/userSlice";
import { toast } from "react-toastify";
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from "@headlessui/react";

import {
  AcademicCapIcon,
  ArrowRightOnRectangleIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";

// import components
import Animation from "../components/Animation";
import EditProfile from "../components/EditProfile";
import Settings from "../components/Settings";
import ViewAllCompletedQuizzes from "../components/ViewAllCompletedQuizzes";

const Profile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentUser } = useSelector((state) => state.user);
  const [completedQuizzes, setCompletedQuizzes] = useState([]);

  useEffect(() => {
    const fetchCompletedQuizzes = async () => {
      try {
        const response = await fetch(`/api/result/user/${currentUser._id}`);
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        setCompletedQuizzes(data);
      } catch (error) {
        console.error("Error fetching completed quizzes:", error);
      }
    };

    fetchCompletedQuizzes();
  }, [currentUser]);

  const getClassForScore = (score) => {
    if (score >= 70) {
      return "ring-green-400";
    } else if (score >= 40) {
      return "ring-yellow-400";
    } else {
      return "ring-red-400";
    }
  };

  const handleSignOut = async () => {
    try {
      await fetch("/api/auth/signout");
      dispatch(signOut());
      navigate("/");
    } catch (error) {
      toast.error(error.message);
    }
  };

  const totalQuizzesTaken = completedQuizzes.length;
  const averageScore =
    completedQuizzes.reduce((acc, quiz) => acc + quiz.score, 0) /
      totalQuizzesTaken || 0;

  return (
    <Animation>
      <div className="grid grid-cols-4 md:grid-cols-8 gap-2">
        {/* Profile Info */}
        <div className="col-span-4 rounded-xl p-3 bg-opacity-0 flex flex-col gap-2 bg-black/5">
          <div className="flex flex-col gap-2 items-center justify-center mt-4 ">
            <div className="p-1 bg-indigo-500 rounded-full relative">
              <img
                className="w-24 h-24 rounded-full object-cover shadow-sm"
                src={currentUser?.profilePhoto}
                alt="Profile Photo"
              />
              <div className="absolute bottom-1 right-0 bg-indigo-500 rounded-full"></div>
            </div>
            <h3 className="text-2xl font-semibold">@{currentUser?.username}</h3>
            <div className="flex gap-2">
              <span className="text-sm font-semibold rounded-xl bg-black/5 px-3 py-2">
                Points
                <span className=" text-indigo-400 ml-1">1000</span>
              </span>
              <span className="text-sm font-semibold rounded-xl bg-black/5 px-3 py-2">
                Rank
                <span className=" text-indigo-400 ml-1">11</span>
              </span>
            </div>
          </div>
          <div className="flex items-center mt-4">
            <EditProfile />
            <Settings />
            <Link
              to="/"
              onClick={handleSignOut}
              className="animate duration-200 w-full flex justify-center items-center gap-x-1 rounded-xl p-2 text-md font-semibold hover:bg-indigo-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
            >
              <ArrowRightOnRectangleIcon className="size-5" />
            </Link>
          </div>
        </div>

        {/* Quiz Statistics */}
        <div className="col-span-4 flex flex-col gap-2">
          <div className="w-full max-w-md">
            <TabGroup className="rounded-xl bg-black/5">
              <TabList className="rounded-xl flex w-full justify-between gap-4 p-1 ">
                <Tab
                  key="stats"
                  className="rounded-lg w-full py-1 px-3 text-sm/6 font-semibold  focus:outline-none text-gray-600 dark:text-gray-400 data-[selected]:text-gray-900 data-[selected]:dark:text-gray-100 data-[hover]:bg-black/5 data-[selected]:data-[hover]:bg-black/10 data-[focus]:outline-1 data-[focus]:outline-white"
                >
                  Stats
                </Tab>
                <Tab
                  key="badges"
                  className="rounded-lg w-full py-1 px-3 text-sm/6 font-semibold  focus:outline-none text-gray-600 dark:text-gray-400 data-[selected]:text-gray-900 data-[selected]:dark:text-gray-100 data-[hover]:bg-black/5 data-[selected]:data-[hover]:bg-black/10 data-[focus]:outline-1 data-[focus]:outline-white"
                >
                  Badges
                </Tab>
                <Tab
                  key="achives"
                  className="rounded-lg w-full py-1 px-3 text-sm/6 font-semibold  focus:outline-none text-gray-600 dark:text-gray-400 data-[selected]:text-gray-900 data-[selected]:dark:text-gray-100 data-[hover]:bg-black/5 data-[selected]:data-[hover]:bg-black/10 data-[focus]:outline-1 data-[focus]:outline-white"
                >
                  Achives
                </Tab>
              </TabList>
              <TabPanels>
                <TabPanel key="stats" className="p-3">
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div>
                      <h4 className="text-2xl font-bold text-indigo-500">
                        {totalQuizzesTaken}
                      </h4>
                      <p className="text-sm">Completed</p>
                    </div>
                    <div>
                      <h4 className="text-2xl font-bold text-indigo-500">
                        {averageScore.toFixed(0)}%
                      </h4>
                      <p className="text-sm">Average Score</p>
                    </div>
                    <div>
                      <h4 className="text-2xl font-bold text-indigo-500">0</h4>
                      <p className="text-sm">Created</p>
                    </div>
                  </div>
                </TabPanel>
                <TabPanel key="badges" className="p-3">
                  <ul className="flex gap-2" aria-hidden="true">
                    <li>20.07.2023</li>
                    <li>32 comments</li>
                    <li>3 shares</li>
                  </ul>
                </TabPanel>
                <TabPanel key="achives" className="p-3">
                  <ul className="flex gap-2" aria-hidden="true">
                    <li>20.07.2023</li>
                    <li>32 comments</li>
                    <li>3 shares</li>
                  </ul>
                </TabPanel>
              </TabPanels>
            </TabGroup>
          </div>
        </div>

        {/* Completed Quizzes */}
        <div className="col-span-4 mt-4 text-center">
          <div className="mb-2 flex items-center justify-between">
            <h3 className="font-bold text-md text-gray-600 dark:text-gray-300">
              Completed Quizzes
            </h3>
            <ViewAllCompletedQuizzes />
          </div>

          {completedQuizzes.length === 0 ? (
            <p>No quizzes available</p>
          ) : (
            <ul className="grid grid-cols-4 gap-2">
              {completedQuizzes.slice(0, 3).map((quizResult) => (
                <Link
                  to={`/quiz/${quizResult.quizId.slug}`}
                  key={quizResult._id}
                  className="animate duration-300 col-span-4 bg-black/5 rounded-xl shadow-sm px-3.5 py-2.5"
                >
                  <li className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <div className="mb-1 flex space-y-2 items-center gap-3 overflow-hidden">
                        <span className="rounded-xl bg-indigo-300 dark:bg-indigo-800 p-3 bg-opacity-70">
                          <AcademicCapIcon className="h-6 w-6" />
                        </span>
                      </div>
                      <div className="text-left">
                        <h3 className="text-md font-semibold leading-6">
                          {quizResult.quizId.title}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {quizResult.quizId.categoryId.name}
                        </p>
                      </div>
                    </div>

                    <div
                      className={`p-3 rounded-full size-10 flex justify-center items-center ring ${getClassForScore(
                        quizResult.score
                      )}`}
                    >
                      <span className="text-xs">{quizResult.score}%</span>
                    </div>
                  </li>
                </Link>
              ))}
            </ul>
          )}
        </div>

        <div className="col-span-4 mt-4 text-center">
          <div className="mb-2 flex items-center justify-between">
            <h3 className="font-bold text-md text-gray-600 dark:text-gray-300">
              My Quizzes
            </h3>
            <button className="font-bold text-sm text-indigo-500">
              View all
            </button>
          </div>
          <div className="">
            <ul className="grid grid-cols-4 gap-2">
              <Link
                to={/quiz/}
                className="animate duration-300 col-span-4 bg-black/5 rounded-xl shadow-sm px-3.5 py-2.5"
              >
                <li className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <div className="mb-1 flex space-y-2 items-center gap-3 overflow-hidden">
                      <span className="rounded-xl bg-indigo-300 dark:bg-indigo-800 p-3 bg-opacity-70">
                        <AcademicCapIcon className="h-6 w-6" />
                      </span>
                    </div>
                    <div className="text-left">
                      <h3 className="text-md font-semibold leading-6">Title</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        category
                      </p>
                    </div>
                  </div>
                  <button className="flex justify-center items-center text-red-500 px-3.5 py-2.5 rounded-xl hover:bg-red-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                    <TrashIcon className="size-4 inline" />
                  </button>
                </li>
              </Link>
            </ul>
          </div>
        </div>
      </div>
    </Animation>
  );
};

export default Profile;
