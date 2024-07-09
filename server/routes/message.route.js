import express from "express";
import {
  createMessage,
  getMessagesByConversationId,
} from "../controllers/message.controller.js";
import { verifyToken } from "../utils/verifyUser.js";

const router = express.Router();

router.get("/:conversationId", verifyToken, getMessagesByConversationId);
router.post("/send/:id", verifyToken, createMessage);

export default router;
