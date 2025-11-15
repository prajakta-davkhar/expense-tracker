// routes/authRoutes.js
import express from "express";
import {
  registerUser,
  authUser,
  getProfile,
  updateProfile,
  logoutUser,
} from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";
import { upload } from "../middleware/uploadMiddleware.js";

const router = express.Router();

/* --------------------------------------------
   🔹 Public Routes (No Auth Required)
-------------------------------------------- */

// 📝 Register new user
router.post("/register", registerUser);

// 🔑 Login user and get token
router.post("/login", authUser);

/* --------------------------------------------
   🔹 Protected Routes (JWT Required)
-------------------------------------------- */

// 🚪 Logout user (invalidate token client-side)
router.post("/logout", protect, logoutUser);

// 👤 Get logged-in user's profile
router.get("/profile", protect, getProfile);

// ✏️ Update profile details (supports image upload & theme)
router.put("/profile", protect, upload.single("profileImage"), updateProfile);

/* --------------------------------------------
   ✅ Export Router
-------------------------------------------- */
export default router;
