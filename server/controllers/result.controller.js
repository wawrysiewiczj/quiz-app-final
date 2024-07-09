import Category from "../models/category.model.js";
import Quiz from "../models/quiz.model.js";
import Result from "../models/result.model.js";

// Pobierz wyniki użytkownika
export const getResultsByUser = async (req, res) => {
  try {
    const results = await Result.find({ userId: req.params.userId })
      .populate({
        path: "quizId",
        populate: {
          path: "categoryId",
          model: "Category",
        },
      })
      .sort({ completedAt: -1 }); // Sortuj malejąco po dacie ukończenia

    res.json(results);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Pobierz wyniki quizu
export const getResultsByQuiz = async (req, res) => {
  try {
    const results = await Result.find({ quizId: req.params.quizId }).populate(
      "userId"
    );
    res.json(results);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
