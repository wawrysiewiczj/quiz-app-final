import React from "react";
import { Link } from "react-router-dom";
import { Drawer } from "vaul";

const ViewAllCompletedQuizzes = ({ categories }) => {
  const [open, setOpen] = React.useState(false);

  return (
    <Drawer.Root open={open} onOpenChange={setOpen}>
      <Drawer.Trigger asChild>
        <button className="font-bold text-sm text-indigo-500 rounded-xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500">
          View all
        </button>
      </Drawer.Trigger>
      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 bg-black/40" />
        <Drawer.Content className="max-w-3xl mx-auto bg-gray-200 z-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 flex flex-col rounded-t-xl fixed bottom-0 left-0 right-0 max-h-[80%]">
          <div className="p-4 bg-gray-200 dark:bg-gray-800 rounded-t-xl pb-24 flex-1 overflow-auto">
            <div className="mx-auto w-12 h-1.5 flex-shrink-0 rounded-full bg-zinc-300 mb-4" />
            <div className="max-w-md mx-auto">
              <Drawer.Title className="font-medium text-center">
                All categories
              </Drawer.Title>
              <div className="mt-4">
                {categories.length === 0 ? (
                  <p>No categories available</p>
                ) : (
                  <ul className="grid grid-cols-4 sm:grid-cols-8 gap-2">
                    {categories.map((category) => (
                      <Link
                        key={category._id}
                        to={`/category/${category.slug}`}
                        className="animate duration-300 col-span-2 sm:grid-col-4 bg-black/5 dark:bg-white/5 rounded-xl shadow-sm px-3.5 pt-3.5 pb-3.5"
                      >
                        <li className="flex flex-col h-full justify-between">
                          <div className="flex flex-col justify-between h-full">
                            <h2 className="text-md font-semibold overflow-hidden overflow-ellipsis">
                              {category && category.name}
                            </h2>
                            <div>
                              <p className="mt-2 text-xs">You Completed 40% </p>
                              <div className="w-full h-1 bg-gray-300 dark:bg-gray-700 rounded-full overflow-hidden mt-1 mb-1">
                                <div
                                  className="h-full bg-green-500"
                                  style={{ width: `40%` }}
                                ></div>
                              </div>
                            </div>
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
