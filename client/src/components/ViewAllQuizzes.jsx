import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { Drawer } from "vaul";
import {
  AcademicCapIcon,
  ArrowRightOnRectangleIcon,
  PlayIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";

const ViewAllCompletedQuizzes = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [open, setOpen] = React.useState(false);

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const res = await fetch("/api/quiz/get");
        if (!res.ok) {
          throw new Error("Failed to fetch quizzes");
        }
        const data = await res.json();
        setQuizzes(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchQuizzes();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <Drawer.Root open={open} onOpenChange={setOpen}>
      <Drawer.Trigger asChild>
        <button className="font-bold text-sm text-indigo-500">View all</button>
      </Drawer.Trigger>
      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 bg-black/40" />
        <Drawer.Content className="max-w-3xl mx-auto bg-gray-100 z-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 flex flex-col rounded-t-xl fixed bottom-0 left-0 right-0 max-h-[80%]">
          <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-t-xl pb-24 flex-1 overflow-auto">
            <div className="mx-auto w-12 h-1.5 flex-shrink-0 rounded-full bg-zinc-300 mb-4" />
            <div className="max-w-md mx-auto">
              <Drawer.Title className="font-medium text-center">
                All quizzes
              </Drawer.Title>
              <div className="mt-4">
                {quizzes.length === 0 ? (
                  <p>No quizzes available</p>
                ) : (
                  <ul className="grid grid-cols-4 sm:grid-cols-8 gap-2">
                    {quizzes.slice(0, 4).map((quiz) => (
                      <Link
                        key={quiz._id}
                        to={`/quiz/${quiz.slug}`}
                        className="animate duration-300 col-span-4 border border-1 border-gray-300 dark:border-gray-700 rounded-xl shadow-sm px-3.5 py-2.5"
                      >
                        <li className="flex justify-between items-center">
                          <div className="mb-1 flex space-y-2 items-center gap-3 overflow-hidden">
                            <span className="rounded-xl bg-gray-200 dark:bg-gray-800 p-3 bg-opacity-70">
                              <AcademicCapIcon className="h-6 w-6" />
                            </span>
                          </div>
                          <div className="text-center">
                            <h3 className="text-md font-bold leading-6">
                              {quiz.title}
                            </h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              {quiz.categoryId.name}
                            </p>
                          </div>
                          <span className="pr-1.5 pl-2 py-2 w-8 h-8 rounded-full text-indigo-800 bg-indigo-300 dark:bg-indigo-800 flex justify-center items-center">
                            <PlayIcon className="h-6 w-6" />
                          </span>
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
