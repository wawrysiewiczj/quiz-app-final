import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  Field,
  Label,
  Select,
  Input,
  Textarea,
  ComboboxButton,
  ComboboxInput,
  Combobox,
  ComboboxOptions,
  ComboboxOption,
} from "@headlessui/react";
import { ChevronDownIcon, CheckIcon } from "@heroicons/react/24/solid";
import clsx from "clsx";
import Animation from "./Animation";
import { toast } from "react-toastify";
import {} from "@heroicons/react/24/outline";

const AddQuiz = () => {
  const navigate = useNavigate();
  const { currentUser } = useSelector((state) => state.user);
  const { quizSlug } = useParams();
  const [currentStep, setCurrentStep] = useState(1);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [query, setQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null); // Updated state to store selected category
  const [questions, setQuestions] = useState([
    { content: "", answers: ["", "", "", ""], correctAnswerIndex: [] },
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
    } else if (field === "correctAnswer") {
      // Update correct answer index based on the selected value
      const correctAnswerIndex = newQuestions[index].answers.findIndex(
        (answer) => answer === value
      );
      newQuestions[index].correctAnswerIndex = correctAnswerIndex;
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
      console.log("Maximum 10 questions allowed.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newQuiz = {
      title,
      description,
      categoryId: categoryId || null,
      userId: currentUser._id,
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
        toast.success("Quiz created successfully");
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

  const handleCategoryChange = (value) => {
    setSelectedCategory(value); // Ustawienie wybranej kategorii
    setQuery(""); // Wyczyszczenie pola wyszukiwania

    if (value) {
      setCategoryId(value._id); // Ustawienie categoryId na _id wybranej kategorii
    } else {
      setCategoryId(""); // Ustawienie categoryId na pusty string, jeśli value jest null
    }
  };

  const filteredCategories =
    query === ""
      ? categories
      : categories.filter((category) =>
          category.name.toLowerCase().includes(query.toLowerCase())
        );

  return (
    <Animation className="">
      <h2 className="text-2xl font-bold mb-4">Add New Quiz</h2>
      <form onSubmit={handleSubmit}>
        {currentStep === 1 && (
          <div>
            <div className="w-full mt-1">
              <Field>
                <Label className="text-sm/6 font-medium text-gray-900 dark:text-gray-100">
                  Title
                </Label>
                <Input
                  placeholder="Title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  className={clsx(
                    "block w-full rounded-lg border-none bg-black/10 py-2.5 px-3 text-sm/6 placeholder:text-gray-700 dark:placeholder:text-gray-400",
                    "focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:outline-white/25"
                  )}
                />
              </Field>
            </div>
            <div className="w-full mt-1">
              <Field>
                <Label className="text-sm/6 font-medium text-gray-900 dark:text-gray-100">
                  Description
                </Label>
                <Textarea
                  placeholder="Description"
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className={clsx(
                    "resize-none block w-full rounded-lg border-none bg-black/10 py-2.5 px-3 text-sm/6 placeholder:text-gray-700 dark:placeholder:text-gray-400",
                    "focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:outline-white/25"
                  )}
                  rows={4}
                />
              </Field>
            </div>
            <div className="w-full mt-1">
              <Field>
                <Label className="text-sm/6 font-medium text-gray-900 dark:text-gray-100">
                  Category
                </Label>
                <Combobox
                  value={selectedCategory}
                  onChange={(value) => handleCategoryChange(value)}
                  onClose={() => setQuery("")}
                >
                  <div className="relative">
                    <ComboboxInput
                      className={clsx(
                        "block w-full rounded-lg border-none bg-black/10 py-2.5 px-3 text-sm/6 placeholder:text-gray-700 dark:placeholder:text-gray-400",
                        "focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:outline-white/25"
                      )}
                      value={selectedCategory ? selectedCategory.name : ""}
                      onChange={(event) => setQuery(event.target.value)}
                      placeholder="Select a category"
                    />
                    <ComboboxButton className="group absolute inset-y-0 right-0 px-2.5">
                      <ChevronDownIcon className="size-4 fill-white/60 group-data-[hover]:fill-white" />
                    </ComboboxButton>
                  </div>

                  <ComboboxOptions
                    className={clsx(
                      "mt-1 w-[var(--input-width)] max-h-52 rounded-xl border border-white/5 bg-white/5 p-1 [--anchor-gap:var(--spacing-1)] empty:invisible",
                      "transition duration-100 ease-in data-[leave]:data-[closed]:opacity-0 overflow-y-scroll"
                    )}
                  >
                    {filteredCategories.map((category) => (
                      <ComboboxOption
                        key={category._id}
                        value={category}
                        className={({ active }) =>
                          clsx(
                            active
                              ? "bg-blue-600 text-white"
                              : "text-gray-900 dark:text-gray-100",
                            "group flex cursor-default items-center gap-2 rounded-lg py-1.5 px-3 select-none data-[focus]:bg-white/10"
                          )
                        }
                      >
                        {({ selected }) => (
                          <>
                            <CheckIcon className="invisible size-4 fill-white group-data-[selected]:visible" />
                            <span
                              className={
                                selected ? "font-semibold" : "font-normal"
                              }
                            >
                              {category.name}
                            </span>
                          </>
                        )}
                      </ComboboxOption>
                    ))}
                  </ComboboxOptions>
                </Combobox>
              </Field>
            </div>
            <div className="w-full fixed bottom-20 left-0">
              <div className="flex flex-col gap-4 justify-around max-w-3xl mx-auto px-4">
                <button
                  type="button"
                  onClick={() => setCurrentStep(2)} // Move to the first question step
                  className="animate duration-300 w-full flex justify-center items-center gap-x-1 rounded-xl bg-indigo-500 px-3.5 py-2.5 text-md font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
                >
                  Start creating
                </button>
              </div>
            </div>
          </div>
        )}

        {currentStep > 1 && currentStep <= questions.length + 1 && (
          <div>
            <div className="w-full mb-4">
              <Field>
                <Label className="text-sm/6 font-medium text-gray-900 dark:text-gray-100">
                  Question {currentStep - 1}
                </Label>
                <Input
                  value={questions[currentStep - 2].content}
                  onChange={(e) =>
                    handleQuestionChange(
                      currentStep - 2,
                      "content",
                      e.target.value
                    )
                  }
                  placeholder={`Enter you question #${currentStep - 1}`}
                  required
                  className={clsx(
                    "block w-full rounded-lg border-none bg-black/10 py-2.5 px-3 text-sm/6 placeholder:text-gray-700 dark:placeholder:text-gray-400",
                    "focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:outline-white/25"
                  )}
                />
              </Field>
            </div>
            <div className="mb-4">
              <h2 className="text-sm/6 font-medium text-gray-900 dark:text-gray-100">
                Answers
              </h2>
              <div className="flex flex-col gap-2 mt-1">
                <Field className="space-y-2">
                  {questions[currentStep - 2].answers.map(
                    (answer, answerIndex) => (
                      <div className="w-full" key={answerIndex}>
                        <Input
                          value={answer}
                          onChange={(e) =>
                            handleQuestionChange(
                              currentStep - 2,
                              answerIndex,
                              e.target.value
                            )
                          }
                          placeholder={`Enter answer #${answerIndex + 1}`}
                          required
                          className={clsx(
                            "block w-full rounded-lg border-none bg-black/10 py-2.5 px-3 text-sm/6 placeholder:text-gray-700 dark:placeholder:text-gray-400",
                            "focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:outline-white/25"
                          )}
                        />
                      </div>
                    )
                  )}
                </Field>
              </div>
            </div>
            <div className="w-full mb-4">
              <Field>
                <Label className="text-sm/6 font-medium text-gray-900 dark:text-gray-100">
                  Correct answer
                </Label>
                <div className="relative">
                  <Select
                    required
                    value={
                      questions[currentStep - 2].answers[
                        questions[currentStep - 2].correctAnswerIndex
                      ] || ""
                    }
                    onChange={(e) =>
                      handleQuestionChange(
                        currentStep - 2,
                        "correctAnswer",
                        e.target.value
                      )
                    }
                    className={clsx(
                      "appearance-none block w-full rounded-lg border-none bg-black/10 py-2.5 px-3 text-sm/6 placeholder:text-gray-700 dark:placeholder:text-gray-400",
                      "focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:outline-white/25",
                      // Make the text of each option black on Windows
                      "*:text-black"
                    )}
                  >
                    <option value="">Select correct answer</option>
                    {questions[currentStep - 2].answers.map(
                      (answer, answerIndex) => (
                        <option key={answerIndex} value={answer}>
                          {answer}
                        </option>
                      )
                    )}
                  </Select>
                  <ChevronDownIcon
                    className="group pointer-events-none absolute top-3.5 right-2.5 size-4 "
                    aria-hidden="true"
                  />
                </div>
              </Field>
            </div>
            <div className="w-full fixed bottom-20 left-0">
              <div className="flex gap-2 justify-around max-w-3xl mx-auto px-4">
                <button
                  type="button"
                  onClick={handleNext}
                  className="animate duration-200 w-full flex justify-center items-center gap-x-1 rounded-xl border border-indigo-500 px-3.5 py-2.5 text-md font-semibold text-indigo-500 shadow-sm hover:bg-indigo-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
                >
                  Add Question
                </button>
                <button
                  className="animate duration-300 w-full flex justify-center items-center gap-x-1 rounded-xl bg-indigo-500 px-3.5 py-2.5 text-md font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
                  type="submit"
                >
                  Save Quiz
                </button>
              </div>
            </div>
          </div>
        )}
      </form>
    </Animation>
  );
};

export default AddQuiz;
