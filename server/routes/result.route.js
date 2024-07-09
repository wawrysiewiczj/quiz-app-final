import express from "express";
import {
  getResultsByQuiz,
  getResultsByUser,
} from "../controllers/result.controller.js";
import { verifyToken } from "../utils/verifyUser.js";

const router = express.Router();

router.get("/user/:userId", getResultsByUser);
router.get("/quiz/:quizId", getResultsByQuiz);

export default router;
