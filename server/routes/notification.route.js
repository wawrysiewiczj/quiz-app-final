import express from "express";
import { verifyToken } from "../utils/verifyUser.js";
import { getNotificationsByUser } from "../controllers/notification.controller.js";

const router = express.Router();

router.get("/user/:userId", getNotificationsByUser);

export default router;
