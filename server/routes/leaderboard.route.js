import express from "express";
import {
  getAllLeaderboardEntries,
  getLeaderboardEntryByUserId,
  getWeeklyLeaderboardEntries,
} from "../controllers/leaderboard.controller.js";

const router = express.Router();

router.get("/", getAllLeaderboardEntries);
router.get("/user/:userId", getLeaderboardEntryByUserId);
router.get("/weekly", getWeeklyLeaderboardEntries);

export default router;
