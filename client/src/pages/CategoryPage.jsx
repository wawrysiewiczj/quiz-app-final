import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { AcademicCapIcon } from "@heroicons/react/24/outline";
import { PlayIcon } from "@heroicons/react/24/solid";
import { useSelector } from "react-redux";

const CategoryPage = () => {
  const { currentUser } = useSelector((state) => state.user);
  const { categorySlug } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [category, setCategory] = useState(null);
  const [quizzes, setQuizzes] = useState([]);
  const [completedQuizIds, setCompletedQuizIds] = useState([]);

  useEffect(() => {
    const fetchQuizzesByCategory = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/quiz/category/${categorySlug}`);
        if (!res.ok) {
          throw new Error("Failed to fetch quizzes");
        }
        const data = await res.json();
        setQuizzes(data.quizzes);
        setCategory(data.category);
      } catch (error) {
        console.error("Error fetching quizzes:", error);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    const fetchCompletedQuizzes = async () => {
      try {
        if (currentUser) {
          const response = await fetch(`/api/result/user/${currentUser._id}`);
          if (!response.ok) {
            throw new Error("Failed to fetch completed quizzes");
          }
          const data = await response.json();
          setCompletedQuizIds(data);
        }
      } catch (error) {
        console.error("Error fetching completed quizzes:", error.message);
        setError(true);
      }
    };

    fetchQuizzesByCategory();
    fetchCompletedQuizzes();
  }, [categorySlug, currentUser]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        Loading...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        Error loading category
      </div>
    );
  }

  return (
    <div>
      <div>
        <h2 className="text-2xl font-bold tracking-normal sm:text-3xl mt-2">
          {category && category.name}
        </h2>
        <p className="text-sm">{category && category.description}</p>

        <p className="mt-1">You Completed 40% </p>
        <div className="w-full h-1 bg-gray-300 dark:bg-gray-700 rounded-full overflow-hidden mt-2">
          <div className="h-full bg-indigo-500" style={{ width: `40%` }}></div>
        </div>
      </div>

      {quizzes.length === 0 ? (
        <p>No quizzes available</p>
      ) : (
        <ul className="grid grid-cols-4 sm:grid-cols-8 gap-2 mt-4">
          {quizzes.map((quiz) => (
            <Link
              key={quiz._id}
              to={`/quiz/${quiz.slug}`}
              className="animate duration-300 col-span-4 bg-white/5 rounded-xl shadow-sm px-3.5 py-2.5"
            >
              <li className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <div className="mb-1 flex space-y-2 items-center gap-3 overflow-hidden">
                    <span className="rounded-xl bg-indigo-300 dark:bg-indigo-800 p-3 bg-opacity-70">
                      <AcademicCapIcon className="h-6 w-6" />
                    </span>
                  </div>
                  <div className="text-center">
                    <h3 className="text-md font-semibold leading-6">
                      {quiz.title}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {quiz.categoryId.name}
                    </p>
                  </div>
                </div>
                <span className="pr-1.5 pl-2 py-2 w-8 h-8 rounded-full text-indigo-800 bg-indigo-300 dark:bg-indigo-800 flex justify-center items-center">
                  <PlayIcon className="size-4 text-gray-100" />
                </span>
              </li>
            </Link>
          ))}
        </ul>
      )}
    </div>
  );
};

export default CategoryPage;
