import express from "express";
import {
  createQuiz,
  finishQuiz,
  getAllQuizzes,
  getQuizBySlug,
  getQuizStatistics,
  getQuizzesByCategory,
  getQuizzesByUser,
} from "../controllers/quiz.controller.js";
import { verifyToken } from "../utils/verifyUser.js";

const router = express.Router();

// Route do tworzenia nowego quizu użytkownika
router.post("/create", createQuiz);

router.get("/get/:slug", verifyToken, getQuizBySlug);

router.post("/finish", verifyToken, finishQuiz);

router.get("/get", getAllQuizzes);

router.get("/user/:userId", getQuizzesByUser);

router.get("/category/:slug", getQuizzesByCategory);

router.get("/statistics/:quizId", getQuizStatistics);

export default router;
