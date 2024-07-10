import Quiz from "../models/quiz.model.js";
import Question from "../models/question.model.js";
import Result from "../models/result.model.js";
import Answer from "../models/answers.model.js";
import Category from "../models/category.model.js";
import Leaderboard from "../models/leaderboard.model.js";
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

// Pobierz quizy po użytkowniku
export const getQuizzesByUser = async (req, res) => {
  try {
    const userId = req.params.userId;
    const quizzes = await Quiz.find({ userId: userId }).populate(
      "categoryId",
      "name"
    );

    if (quizzes.length === 0) {
      return res
        .status(404)
        .json({ message: "No quizzes found for this user" });
    }

    res.json(quizzes);
  } catch (error) {
    console.error("Error fetching quizzes by user:", error);
    res.status(500).json({ message: error.message });
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
  const { title, description, categoryId, userId, questions } = req.body;

  try {
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
      userId,
      slug,
      questions: [],
    });

    const savedQuiz = await quiz.save();

    // Update quizId in questions and save questions
    const savedQuestions = await Promise.all(
      questions.map(async (q) => {
        const question = new Question({
          content: q.content,
          correctAnswerIndex: q.correctAnswerIndex,
          quizId: savedQuiz._id, // Set quizId here
        });

        const savedQuestion = await question.save();

        const savedAnswers = await Promise.all(
          q.answers.map(async (a, index) => {
            const answer = new Answer({
              content: a,
              index,
              questionId: savedQuestion._id,
            });

            const savedAnswer = await answer.save();

            return savedAnswer;
          })
        );

        savedQuestion.answers = savedAnswers.map((a) => a._id);
        await savedQuestion.save();

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

    // Calculate score and update results
    let result = await Result.findOne({ userId, quizId });

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
      // Update existing result
      result.score = score;
      result.selectedAnswers = selectedAnswers.map((answer, index) => ({
        questionId: quiz.questions[index]._id,
        selectedAnswerIndex: answer,
      }));
      result.correctAnswers = correctAnswers;
    } else {
      // Create new result
      result = new Result({
        userId,
        quizId,
        score,
        selectedAnswers: selectedAnswers.map((answer, index) => ({
          questionId: quiz.questions[index]._id,
          selectedAnswerIndex: answer,
        })),
        correctAnswers,
      });
    }

    const savedResult = await result.save();

    // Update quiz popularity stats
    const totalAttempts = quiz.popularity.attempts + 1;
    const averageScore =
      (quiz.popularity.averageScore * quiz.popularity.attempts + score) /
      totalAttempts;

    await Quiz.findByIdAndUpdate(
      quiz._id,
      {
        $set: {
          "popularity.attempts": totalAttempts,
          "popularity.averageScore": averageScore,
        },
      },
      { new: true }
    );

    // Update leaderboard
    const leaderboardEntry = await updateLeaderboard(userId);

    res.status(201).json({ savedResult, leaderboardEntry });
  } catch (error) {
    console.error("Error saving quiz result:", error);
    res.status(500).json({ message: error.message });
  }
};

// Aktualizacja punktów w leaderboard
const updateLeaderboard = async (userId) => {
  try {
    // Pobierz wszystkie wyniki użytkownika
    const results = await Result.find({ userId });

    // Oblicz totalPoints
    const totalPoints = results.reduce((acc, result) => acc + result.score, 0);

    // Znajdź istniejący wpis na leaderboardzie lub utwórz nowy
    const leaderboardEntry = await Leaderboard.findOneAndUpdate(
      { userId },
      { totalPoints },
      { new: true, upsert: true }
    );

    return leaderboardEntry;
  } catch (error) {
    console.error("Error updating leaderboard:", error);
  }
};
