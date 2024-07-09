import React, { useState, useEffect } from "react";
import { AcademicCapIcon, PlayIcon } from "@heroicons/react/24/outline";
import { Link } from "react-router-dom";
import ViewAllQuizzes from "./ViewAllQuizzes";

const QuizList = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
    <div className="shadow-sm mt-4">
      <div className="mb-2 flex items-center justify-between">
        <h3 className="font-bold text-md text-gray-600 dark:text-gray-300">
          Quiz List
        </h3>
        <ViewAllQuizzes />
      </div>
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
                  <h3 className="text-md font-bold leading-6">{quiz.title}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {quiz.categoryId.name}
                  </p>
                </div>
                <span className="pr-1.5 pl-2 py-2 w-8 h-8 rounded-full text-violet-800 bg-violet-300 dark:bg-violet-800 flex justify-center items-center">
                  <PlayIcon className="h-6 w-6" />
                </span>
              </li>
            </Link>
          ))}
        </ul>
      )}
    </div>
  );
};

export default QuizList;
