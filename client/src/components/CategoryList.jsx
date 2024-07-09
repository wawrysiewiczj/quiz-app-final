import React, { useState, useEffect } from "react";
import { AcademicCapIcon, PlayIcon } from "@heroicons/react/24/outline";
import { Link } from "react-router-dom";

import ViewAllCategories from "./ViewAllCategories";

const QuizList = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch(`/api/category/get`);
        if (!res.ok) {
          throw new Error("Failed to fetch categories");
        }
        const data = await res.json();
        setCategories(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="shadow-sm mt-4">
      <div className="mb-2 flex items-center justify-between">
        <h3 className="font-bold text-md text-gray-600 dark:text-gray-300 ">
          Category List
        </h3>
        <ViewAllCategories />
      </div>
      {categories.length === 0 ? (
        <p>No categories available</p>
      ) : (
        <ul className="grid grid-cols-4 sm:grid-cols-8 gap-2">
          {categories.slice(0, 4).map((category) => (
            <Link
              key={category._id}
              to={`/category/${category.slug}`}
              className="animate duration-300 col-span-2 sm:grid-col-4 border border-1 border-gray-300 dark:border-gray-700 rounded-xl shadow-sm px-3.5 pt-3.5 pb-3.5"
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
  );
};

export default QuizList;
