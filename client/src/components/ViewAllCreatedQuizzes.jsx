import React from "react";
import { Link } from "react-router-dom";
import { Drawer } from "vaul";
import { AcademicCapIcon, TrashIcon } from "@heroicons/react/24/outline";

const ViewAllCreatedQuizzes = ({ userQuizzes }) => {
  const [open, setOpen] = React.useState(false);

  return (
    <Drawer.Root open={open} onOpenChange={setOpen}>
      <Drawer.Trigger asChild>
        <button className="font-bold text-sm text-indigo-500">View all</button>
      </Drawer.Trigger>
      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 bg-black/40" />
        <Drawer.Content className="max-w-3xl mx-auto bg-gray-200 z-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 flex flex-col rounded-t-xl fixed bottom-0 left-0 right-0 max-h-[80%]">
          <div className="p-4 bg-gray-200 dark:bg-gray-800 rounded-t-xl pb-24 flex-1 overflow-auto">
            <div className="mx-auto w-12 h-1.5 flex-shrink-0 rounded-full bg-zinc-300 mb-4" />
            <div className="max-w-md mx-auto">
              <Drawer.Title className="font-medium text-center">
                All created quizzes
              </Drawer.Title>
              <div className="mt-4">
                {userQuizzes.length === 0 ? (
                  <p>No quizzes created</p>
                ) : (
                  <ul className="grid grid-cols-4 gap-2">
                    {userQuizzes.slice(0, 3).map((quizUser) => (
                      <Link
                        to={`/quiz/${userQuizzes.slug}`}
                        key={quizUser._id}
                        className="animate duration-300 col-span-4 bg-black/5 dark:bg-white/5 rounded-xl shadow-sm px-3.5 py-2.5"
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
                                {quizUser.title}
                              </h3>
                              <p className="text-sm text-gray-600 dark:text-gray-400">
                                {quizUser.categoryId.name}
                              </p>
                            </div>
                          </div>
                          <button className="flex justify-center items-center text-red-500 px-3.5 py-2.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                            <TrashIcon className="size-6 inline" />
                          </button>
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

export default ViewAllCreatedQuizzes;
