import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Radio, RadioGroup } from "@headlessui/react";
import { CheckCircleIcon } from "@heroicons/react/24/solid";

const QuizPage = () => {
  const navigate = useNavigate();
  const { quizSlug } = useParams();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [quiz, setQuiz] = useState(null);
  const [selectedAnswers, setSelectedAnswers] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [quizStarted, setQuizStarted] = useState(false);
  const [result, setResult] = useState(null);

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/quiz/get/${quizSlug}`);
        const data = await res.json();

        if (!res.ok) {
          setError(true);
          setLoading(false);
          return;
        }
        if (res.ok && data.questions.length > 0) {
          setQuiz(data);
          setSelectedAnswers(new Array(data.questions.length).fill(null));
          setLoading(false);
          setError(false);
        }
      } catch (error) {
        setError(true);
        setLoading(false);
      }
    };

    fetchQuiz();
  }, [quizSlug]);

  const startQuiz = () => {
    setQuizStarted(true);
  };

  const handleAnswerSelect = (selectedValue) => {
    const newSelectedAnswers = [...selectedAnswers];
    newSelectedAnswers[currentQuestionIndex] = selectedValue;
    setSelectedAnswers(newSelectedAnswers);
  };

  const goToNextQuestion = () => {
    setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
  };

  const handleSubmit = async () => {
    try {
      const res = await fetch(`/api/quiz/finish`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          quizId: quiz._id,
          selectedAnswers: selectedAnswers,
        }),
      });

      if (!res.ok) {
        throw new Error(
          `Failed to submit quiz: ${res.status} ${res.statusText}`
        );
      }

      const data = await res.json();
      console.log("Quiz submitted successfully. Score: ", data.score);
      setResult(data);
    } catch (error) {
      console.error("Error submitting quiz:", error.message);
      // Display error message to the user or handle error state
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error loading quiz</div>;
  if (!quiz) return <div>No quiz found</div>;

  if (!quizStarted) {
    return (
      <div className="flex flex-col gap-2">
        <h1 className="text-center text-2xl font-bold tracking-normal sm:text-3xl mt-2">
          {quiz.title}
        </h1>
        <p className="text-center text-sm">{quiz.description}</p>
        <p className="text-center text-sm mt-4">Rules:</p>
        <ol className="list-decimal list-inside flex flex-col gap-2">
          <li>
            <span className="font-semibold">Time Limit: </span>Each question has
            a set time limit for answering. Once the time expires, the app will
            automatically move to the next question.
          </li>
          <li>
            <span className="font-semibold">No Cheating:</span> Participants are
            not allowed to use external resources (such as the internet, books,
            or help from others) while answering the quiz questions.
          </li>
          <li>
            <span className="font-semibold">Scoring System:</span> Points are
            awarded based on the accuracy and speed of the answers. Correct
            answers within a shorter time frame will earn more points.
          </li>
          <li>
            <span className="font-semibold">Single Attempt:</span> Each quiz can
            only be taken once per user. No retakes are allowed to ensure
            fairness.
          </li>

          <li>
            <span className="font-semibold">Behavior:</span>Participants should
            maintain respectful behavior throughout the quiz. Any inappropriate
            language or behavior may result in disqualification.
          </li>
        </ol>
        <div className="flex gap-2 mt-4">
          <button
            onClick={startQuiz}
            className="animate duration-300 w-full flex justify-center items-center gap-x-1 rounded-xl bg-indigo-600 px-3.5 py-2.5 text-md font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
          >
            Start Test
          </button>
        </div>
      </div>
    );
  }

  if (result) {
    return (
      <div className="mt-8 text-center flex flex-col items-center gap-2">
        <img
          src="https://cdn-icons-png.flaticon.com/512/5511/5511415.png"
          alt=""
          className="w-48 h-48"
        />
        <div className="mt-4">
          <h2 className="text-xl font-semibold mb-2">
            Congrats! You passed the quiz!
          </h2>
          <p>Your score: {result.score}%</p>
          <p>Your earn {result.score} Quizpoints</p>
          {/* Możesz dodać inne statystyki, np. procent poprawnych odpowiedzi, czas wykonania quizu itp. */}
        </div>
        {/* Buttons */}
        <div className="flex flex-col gap-2 mt-4 w-full ">
          <Link
            to=""
            className="animate duration-300 w-full flex justify-center items-center gap-x-1 rounded-xl bg-indigo-600 px-3.5 py-2.5 text-md font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
          >
            Statistics
          </Link>
          <Link
            className="animate duration-200 w-full flex justify-center items-center gap-x-1 rounded-xl border border-indigo-500 px-3.5 py-2.5 text-md font-semibold text-indigo-500 shadow-sm hover:bg-indigo-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
            to=""
          >
            More quizzes
          </Link>
        </div>
      </div>
    );
  }

  const currentQuestion = quiz.questions[currentQuestionIndex];

  return (
    <div>
      <div className="flex justify-between items-center">
        <div className="text-center">
          <p>Time Remaining: {/* Add timer logic here */}</p>
        </div>
        <div className="text-center">
          <p>
            Question {currentQuestionIndex + 1} of {quiz.questions.length}
          </p>
        </div>
      </div>
      <h2 className="text-2xl font-semibold">{currentQuestion.content}</h2>
      <div className="mx-auto w-full max-w-md mt-4">
        <RadioGroup
          className="space-y-2"
          value={selectedAnswers[currentQuestionIndex]}
          onChange={handleAnswerSelect}
        >
          {currentQuestion.answers.map((answer, aIndex) => (
            <Radio
              key={aIndex}
              value={aIndex}
              className="group relative flex cursor-pointer rounded-lg bg-white/5 py-4 px-5 text-white shadow-md transition focus:outline-none"
            >
              {({ checked }) => (
                <div className="flex w-full items-center justify-between">
                  <p className="">{answer.content}</p>
                  {checked && (
                    <CheckCircleIcon className="w-6 h-6 fill-white opacity-100" />
                  )}
                </div>
              )}
            </Radio>
          ))}
        </RadioGroup>
      </div>

      <div className="flex gap-2 mt-4">
        {currentQuestionIndex < quiz.questions.length - 1 ? (
          <button
            onClick={goToNextQuestion}
            className="animate duration-300 w-full flex justify-center items-center gap-x-1 rounded-xl bg-indigo-600 px-3.5 py-2.5 text-md font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
          >
            Next Question
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            className="animate duration-300 w-full flex justify-center items-center gap-x-1 rounded-xl bg-indigo-600 px-3.5 py-2.5 text-md font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
          >
            Submit Quiz
          </button>
        )}
      </div>
    </div>
  );
};

export default QuizPage;
