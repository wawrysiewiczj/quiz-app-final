import express from "express";
import {
  createConversation,
  getConversationsByUserId,
} from "../controllers/conversation.controller.js";

import { verifyToken } from "../utils/verifyUser.js";

const router = express.Router();

router.post("/", verifyToken, createConversation);
router.get("/:userId", verifyToken, getConversationsByUserId);

export default router;
