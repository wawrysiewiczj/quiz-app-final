import Quiz from "../models/quiz.model.js";
import Question from "../models/question.model.js";
import Result from "../models/result.model.js";
import Answer from "../models/answers.model.js";
import Category from "../models/category.model.js";
import { errorHandler } from "../utils/error.js";

// Pobierz wszystkie quizy
export const getAllQuizzes = async (req, res) => {
  try {
    const quizzes = await Quiz.find().populate("categoryId");
    res.json(quizzes);
  } catch (error) {
    next(error);
  }
};

// Pobierz quiz po slug z pytaniami i odpowiedziami
export const getQuizBySlug = async (req, res) => {
  try {
    const quiz = await Quiz.findOne({ slug: req.params.slug }).populate({
      path: "questions",
      populate: {
        path: "answers",
        model: "Answer",
      },
    });

    if (!quiz) {
      return res.status(404).json({ message: "Quiz not found" });
    }
    res.json(quiz);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getQuizzesByCategory = async (req, res) => {
  try {
    const category = await Category.findOne({ slug: req.params.slug });
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }
    const quizzes = await Quiz.find({ categoryId: category._id });
    res.json({ category, quizzes });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Pobierz statystyki quizu
export const getQuizStatistics = async (req, res) => {
  try {
    const results = await Result.find({ quizId: req.params.quizId });
    const attempts = results.length;
    const averageScore =
      results.reduce((acc, result) => acc + result.score, 0) / attempts || 0;

    res.json({ attempts, averageScore });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Utwórz nowy quiz
export const createQuiz = async (req, res) => {
  const { title, description, categoryId, authorId, questions } = req.body;

  try {
    console.log("Rozpoczynam tworzenie quizu");

    const slug = title
      .split(" ")
      .join("-")
      .toLowerCase()
      .replace(/[^a-zA-Z0-9-]/g, "");

    // Create and save the quiz
    const quiz = new Quiz({
      title,
      description,
      categoryId,
      authorId,
      slug,
      questions: [],
    });

    const savedQuiz = await quiz.save();
    console.log(`Quiz zapisany: ${savedQuiz._id}`);

    // Update quizId in questions and save questions
    const savedQuestions = await Promise.all(
      questions.map(async (q) => {
        console.log(`Tworzenie pytania: ${q.content}`);
        const question = new Question({
          content: q.content,
          correctAnswerIndex: q.correctAnswerIndex,
          quizId: savedQuiz._id, // Set quizId here
        });

        const savedQuestion = await question.save();
        console.log(`Pytanie zapisane: ${savedQuestion._id}`);

        const savedAnswers = await Promise.all(
          q.answers.map(async (a, index) => {
            console.log(`Tworzenie odpowiedzi: ${a}`);
            const answer = new Answer({
              content: a,
              index,
              questionId: savedQuestion._id,
            });

            const savedAnswer = await answer.save();
            console.log(`Odpowiedź zapisana: ${savedAnswer._id}`);

            return savedAnswer;
          })
        );

        savedQuestion.answers = savedAnswers.map((a) => a._id);
        await savedQuestion.save();
        console.log(
          `Pytanie zaktualizowane z odpowiedziami: ${savedQuestion._id}`
        );

        return savedQuestion._id;
      })
    );

    // Update quiz with questions
    savedQuiz.questions = savedQuestions;
    await savedQuiz.save();

    res.status(201).json(savedQuiz);
  } catch (err) {
    console.error("Błąd podczas tworzenia quizu:", err);
    res.status(400).json({ message: err.message });
  }
};

// Zakończ quiz i zapisz wyniki
export const finishQuiz = async (req, res) => {
  const { quizId, selectedAnswers } = req.body;
  const userId = req.user.id;

  try {
    const quiz = await Quiz.findById(quizId).populate("questions");
    if (!quiz) {
      return res.status(404).json({ message: "Quiz not found" });
    }

    // Sprawdź, czy istnieje już wynik dla tego użytkownika i tego quizu
    let result = await Result.findOne({ userId, quizId });

    // Oblicz wynik quizu na podstawie wybranych i poprawnych odpowiedzi
    let points = 0;
    const correctAnswers = [];

    quiz.questions.forEach((question, index) => {
      const correctAnswerIndex = question.correctAnswerIndex;
      const selectedAnswerIndex = selectedAnswers[index];

      if (selectedAnswerIndex === correctAnswerIndex) {
        points++;
      }

      correctAnswers.push({
        questionId: question._id,
        correctAnswerIndex: correctAnswerIndex,
      });
    });

    const score = (points / quiz.questions.length) * 100;

    if (result) {
      // Jeśli istnieje już wynik, zaktualizuj go
      result.score = score;
      result.selectedAnswers = selectedAnswers.map((answer, index) => ({
        questionId: quiz.questions[index]._id,
        selectedAnswerIndex: answer,
      }));
      result.correctAnswers = correctAnswers;
    } else {
      // Jeśli nie ma jeszcze wyniku, utwórz nowy obiekt wyniku
      result = new Result({
        userId,
        quizId,
        score,
        selectedAnswers: selectedAnswers.map((answer, index) => ({
          questionId: quiz.questions[index]._id,
          selectedAnswerIndex: answer,
        })),
        correctAnswers: correctAnswers,
      });
    }

    const savedResult = await result.save();

    // Update quiz popularity stats (optional)
    await Quiz.findByIdAndUpdate(quiz._id, {
      $inc: { "popularity.attempts": 1 },
      $set: {
        "popularity.averageScore":
          (quiz.popularity.averageScore + score) /
          (quiz.popularity.attempts + 1),
      },
    });

    res.status(201).json(savedResult);
  } catch (err) {
    console.error("Error saving quiz result:", err);
    res.status(400).json({ message: err.message });
  }
};
