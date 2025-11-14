// backend/routes/notificationRoutes.js
import express from "express";
import {
  getNotifications,
  createNotification,
  markAsRead,
  deleteNotification,
  markAllRead,
  clearAll,
} from "../controllers/notificationController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

/* --------------------------------------------
   🔹 Get all notifications for logged-in user
   GET /api/notifications
-------------------------------------------- */
router.get("/", protect, getNotifications);

/* --------------------------------------------
   🔹 Create a new notification
   POST /api/notifications
   Body: { message: String, type?: String }
-------------------------------------------- */
router.post("/", protect, createNotification);

/* --------------------------------------------
   🔹 Mark all notifications as read
   PATCH /api/notifications/read-all
-------------------------------------------- */
router.patch("/read-all", protect, markAllRead);

/* --------------------------------------------
   🔹 Delete all notifications for the user
   DELETE /api/notifications/clear-all
-------------------------------------------- */
router.delete("/clear-all", protect, clearAll);

/* --------------------------------------------
   🔹 Mark a specific notification as read
   PATCH /api/notifications/:id/read
-------------------------------------------- */
router.patch("/:id/read", protect, markAsRead);

/* --------------------------------------------
   🔹 Delete a specific notification
   DELETE /api/notifications/:id
-------------------------------------------- */
router.delete("/:id", protect, deleteNotification);

export default router;
