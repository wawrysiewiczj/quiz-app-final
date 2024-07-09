import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";

const AddQuiz = () => {
  const navigate = useNavigate();
  const { currentUser } = useSelector((state) => state.user);
  const { quizSlug } = useParams();
  const [currentStep, setCurrentStep] = useState(1);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [questions, setQuestions] = useState([
    { content: "", answers: ["", "", "", ""], correctAnswerIndex: 0 },
  ]);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch("/api/category/get");
        if (!res.ok) {
          throw new Error("Failed to fetch categories");
        }
        const data = await res.json();
        setCategories(data); // Assuming data is an array of categories
      } catch (err) {
        console.error("Failed to fetch categories:", err);
      }
    };

    fetchCategories();
  }, [currentUser]);

  const handleQuestionChange = (index, field, value) => {
    const newQuestions = [...questions];
    if (field === "content") {
      newQuestions[index].content = value;
    } else if (field === "correctAnswerIndex") {
      newQuestions[index].correctAnswerIndex = Number(value);
    } else {
      newQuestions[index].answers[Number(field)] = value;
    }
    setQuestions(newQuestions);
  };

  const addQuestion = () => {
    if (questions.length < 10) {
      setQuestions([
        ...questions,
        { content: "", answers: ["", "", "", ""], correctAnswerIndex: 0 },
      ]);
      setCurrentStep(questions.length + 1); // Move to the next step after adding a question
    } else {
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newQuiz = {
      title,
      description,
      categoryId: categoryId || null,
      authorId: currentUser._id,
      questions,
    };

    console.log("Submitting new quiz:", newQuiz);

    try {
      const res = await fetch(`/api/quiz/create?slug=${quizSlug}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newQuiz),
      });

      if (res.ok) {
        const data = await res.json();
        navigate(`/quiz/${data.slug}`);
      } else {
        const errorData = await res.json();
        console.error("Error details:", errorData);
      }
    } catch (err) {
      console.error("Error while adding quiz:", err);
    }
  };

  const handleNext = () => {
    addQuestion();
    setCurrentStep(currentStep + 1);
  };

  const handlePrevious = () => {
    setCurrentStep(currentStep - 1);
  };

  return (
    <div className="">
      <h2 className="text-2xl font-bold mb-4">Add New Quiz</h2>
      <form onSubmit={handleSubmit}>
        {currentStep === 1 && (
          <div>
            <div className="mb-4">
              <label className="block text-gray-700 dark:text-gray-300 text-sm font-semibold mb-1">
                Title
              </label>
              <input
                type="text"
                placeholder="Title"
                className="w-full flex-1 bg-white dark:bg-gray-900  border-none px-3.5 py-2.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-600"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 dark:text-gray-300 text-sm font-semibold mb-1">
                Description
              </label>
              <textarea
                placeholder="Description"
                className="w-full flex-1 bg-white dark:bg-gray-900  border-none px-3.5 py-2.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-600"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 dark:text-gray-300 text-sm font-semibold mb-1">
                Category
              </label>
              <select
                className="w-full flex-1 bg-white dark:bg-gray-900 border-none px-3.5 py-2.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-600"
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                required
              >
                <option value="">Select a category</option>
                {categories.map((category) => (
                  <option key={category._id} value={category._id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex gap-2 mt-4">
              <button
                type="button"
                onClick={() => setCurrentStep(2)} // Move to the first question step
                className="animate duration-200 w-full flex justify-center items-center gap-x-1 rounded-xl border border-violet-500 px-3.5 py-2.5 text-md font-semibold text-violet-500 shadow-sm hover:bg-violet-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
              >
                Start creating
              </button>
            </div>
          </div>
        )}

        {currentStep > 1 && currentStep <= questions.length + 1 && (
          <div>
            <div className="mb-4">
              <label className="block text-gray-700 dark:text-gray-300 text-sm font-semibold mb-1">
                Question {currentStep - 1}
              </label>
              <input
                type="text"
                className="w-full flex-1 bg-white dark:bg-gray-900  border-none px-3.5 py-2.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-600"
                value={questions[currentStep - 2].content}
                onChange={(e) =>
                  handleQuestionChange(
                    currentStep - 2,
                    "content",
                    e.target.value
                  )
                }
                placeholder="Question content"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 dark:text-gray-300 text-sm font-semibold mb-1">
                Answers
              </label>
              <div className="flex flex-col gap-2">
                {questions[currentStep - 2].answers.map(
                  (answer, answerIndex) => (
                    <input
                      key={answerIndex}
                      type="text"
                      className="w-full flex-1 bg-white dark:bg-gray-900  border-none px-3.5 py-2.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-600"
                      value={answer}
                      onChange={(e) =>
                        handleQuestionChange(
                          currentStep - 2,
                          answerIndex,
                          e.target.value
                        )
                      }
                      placeholder={`Answer ${answerIndex + 1}`}
                      required
                    />
                  )
                )}
              </div>
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 dark:text-gray-300 text-sm font-semibold mb-1">
                Correct Answer Index
              </label>
              <input
                type="number"
                className="w-full flex-1 bg-white dark:bg-gray-900  border-none px-3.5 py-2.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-600"
                value={questions[currentStep - 2].correctAnswerIndex}
                onChange={(e) =>
                  handleQuestionChange(
                    currentStep - 2,
                    "correctAnswerIndex",
                    e.target.value
                  )
                }
                min="0"
                max="3"
                required
              />
            </div>
            <div className="flex gap-2 mt-4">
              <button
                type="button"
                onClick={handleNext}
                className="animate duration-200 w-full flex justify-center items-center gap-x-1 rounded-xl border border-violet-500 px-3.5 py-2.5 text-md font-semibold text-violet-500 shadow-sm hover:bg-violet-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
              >
                Add Question
              </button>
              <button
                className="animate duration-300 w-full flex justify-center items-center gap-x-1 rounded-xl bg-violet-600 px-3.5 py-2.5 text-md font-semibold text-white shadow-sm hover:bg-violet-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
                type="submit"
              >
                Save Quiz
              </button>
            </div>
          </div>
        )}
      </form>
    </div>
  );
};

export default AddQuiz;
