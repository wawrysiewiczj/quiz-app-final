import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { signOut } from "../redux/user/userSlice";
import { toast } from "react-toastify";
import { Drawer } from "vaul";
import {
  AcademicCapIcon,
  ArrowRightOnRectangleIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";

const ViewAllCompletedQuizzes = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentUser } = useSelector((state) => state.user);
  const [completedQuizzes, setCompletedQuizzes] = useState([]);
  const [open, setOpen] = React.useState(false);

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
      return "ring-green-500";
    } else if (score >= 40) {
      return "ring-yellow-500";
    } else {
      return "ring-red-500";
    }
  };

  return (
    <Drawer.Root open={open} onOpenChange={setOpen}>
      <Drawer.Trigger asChild>
        <button className="font-bold text-sm text-violet-500">View all</button>
      </Drawer.Trigger>
      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 bg-black/40" />
        <Drawer.Content className="max-w-3xl mx-auto bg-gray-100 z-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 flex flex-col rounded-t-xl fixed bottom-0 left-0 right-0 max-h-[80%]">
          <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-t-xl pb-24 flex-1 overflow-auto">
            <div className="mx-auto w-12 h-1.5 flex-shrink-0 rounded-full bg-zinc-300 mb-4" />
            <div className="max-w-md mx-auto">
              <Drawer.Title className="font-medium text-center">
                All completed quizzes
              </Drawer.Title>
              <div className="mt-4">
                {completedQuizzes.length === 0 ? (
                  <p>No quizzes available</p>
                ) : (
                  <ul className="grid grid-cols-4 gap-2">
                    {completedQuizzes.map((quizResult) => (
                      <Link
                        to={`/quiz/${quizResult.quizId.slug}`}
                        key={quizResult._id}
                        className="animate duration-300 col-span-4 border border-gray-300 dark:border-gray-700 dark:text-gray-100 rounded-xl shadow-sm px-3.5 py-2.5"
                      >
                        <li className="flex justify-between items-center">
                          <div className="mb-1 flex space-y-2 items-center gap-3 overflow-hidden">
                            <span className="rounded-xl bg-violet-300 dark:bg-violet-800 p-3 bg-opacity-70">
                              <AcademicCapIcon className="h-6 w-6" />
                            </span>
                          </div>
                          <div className="text-center">
                            <h3 className="text-md font-semibold leading-6">
                              {quizResult.quizId.title}
                            </h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              {quizResult.quizId.categoryId.name}
                            </p>
                          </div>
                          <div
                            className={`p-3 rounded-full w-12 h-12 flex justify-center items-center ring ${getClassForScore(
                              quizResult.score
                            )}`}
                          >
                            <span className="text-sm">{quizResult.score}%</span>
                          </div>
                        </li>
                      </Link>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
};

export default ViewAllCompletedQuizzes;
