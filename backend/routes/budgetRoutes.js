import express from "express";
import Budget from "../models/Budget.js";
import Notification from "../models/Notification.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

/* --------------------------------------------
   ➕ Add New Budget
-------------------------------------------- */
router.post("/", protect, async (req, res) => {
  try {
    const { category, limit, month } = req.body;
    const userId = req.user?._id;

    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized user" });
    }

    if (!category || limit === undefined || limit === null) {
      return res
        .status(400)
        .json({ success: false, message: "Category and limit are required" });
    }

    const currentMonth =
      month || new Date().toLocaleString("default", { month: "long", year: "numeric" });

    // Check for existing budget
    const existing = await Budget.findOne({ user: userId, category, month: currentMonth });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: `Budget for '${category}' (${currentMonth}) already exists.`,
      });
    }

    // Create new budget
    const newBudget = await Budget.create({
      user: userId,
      category,
      limit: Number(limit),
      spent: 0,
      month: currentMonth,
    });

    // Create notification
    await Notification.create({
      user: userId,
      message: `📊 New budget added for '${category}' (${currentMonth}): ₹${limit}`,
      isRead: false,
    });

    res.status(201).json({
      success: true,
      message: "✅ Budget added successfully!",
      data: newBudget,
    });
  } catch (error) {
    console.error("❌ Error adding budget:", error);
    res.status(500).json({
      success: false,
      message: "Server error while adding budget",
      error: error.message,
    });
  }
});

/* --------------------------------------------
   📋 Get All Budgets for Logged-in User
-------------------------------------------- */
router.get("/", protect, async (req, res) => {
  try {
    const budgets = await Budget.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      count: budgets.length,
      data: budgets,
    });
  } catch (error) {
    console.error("❌ Error fetching budgets:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching budgets",
      error: error.message,
    });
  }
});

/* --------------------------------------------
   📊 Get Budget Summary
-------------------------------------------- */
router.get("/summary", protect, async (req, res) => {
  try {
    const budgets = await Budget.find({ user: req.user._id });
    if (!budgets.length) {
      return res.status(404).json({ success: false, message: "No budgets found" });
    }

    const summary = budgets.map((b) => {
      const remaining = Math.max(b.limit - b.spent, 0);
      const percentUsed = b.limit > 0 ? Math.min(Math.round((b.spent / b.limit) * 100), 100) : 0;

      return {
        category: b.category,
        limit: b.limit,
        spent: b.spent,
        remaining,
        percentUsed,
        month: b.month,
      };
    });

    res.status(200).json({ success: true, summary });
  } catch (error) {
    console.error("❌ Error generating summary:", error);
    res.status(500).json({
      success: false,
      message: "Error generating budget summary",
      error: error.message,
    });
  }
});

/* --------------------------------------------
   ✏️ Update Budget
-------------------------------------------- */
router.put("/:id", protect, async (req, res) => {
  try {
    const { id } = req.params;
    const { category, limit, month } = req.body;

    const budget = await Budget.findOne({ _id: id, user: req.user._id });
    if (!budget) {
      return res.status(404).json({ success: false, message: "Budget not found" });
    }

    if (category) budget.category = category;
    if (limit !== undefined && limit !== null) budget.limit = Number(limit);
    if (month) budget.month = month;

    const updatedBudget = await budget.save();

    res.status(200).json({
      success: true,
      message: "✅ Budget updated successfully",
      data: updatedBudget,
    });
  } catch (error) {
    console.error("❌ Error updating budget:", error);
    res.status(500).json({
      success: false,
      message: "Error updating budget",
      error: error.message,
    });
  }
});

/* --------------------------------------------
   ❌ Delete Budget
-------------------------------------------- */
router.delete("/:id", protect, async (req, res) => {
  try {
    const { id } = req.params;
    const budget = await Budget.findOneAndDelete({ _id: id, user: req.user._id });

    if (!budget) {
      return res.status(404).json({ success: false, message: "Budget not found" });
    }

    await Notification.create({
      user: req.user._id,
      message: `🗑️ Budget for ${budget.category} (${budget.month}) deleted.`,
      isRead: false,
    });

    res.status(200).json({
      success: true,
      message: "✅ Budget deleted successfully",
    });
  } catch (error) {
    console.error("❌ Error deleting budget:", error);
    res.status(500).json({
      success: false,
      message: "Error deleting budget",
      error: error.message,
    });
  }
});

/* --------------------------------------------
   📥 Download CSV Report
-------------------------------------------- */
router.get("/download-report", protect, async (req, res) => {
  try {
    const budgets = await Budget.find({ user: req.user._id });
    if (!budgets.length) {
      return res.status(404).json({ success: false, message: "No budgets found" });
    }

    const header = "Category,Limit,Spent,Month\n";
    const rows = budgets.map((b) => `${b.category},${b.limit},${b.spent},${b.month}`).join("\n");
    const csvData = header + rows;

    res.setHeader("Content-Disposition", "attachment; filename=budgets.csv");
    res.setHeader("Content-Type", "text/csv");
    res.status(200).send(csvData);
  } catch (error) {
    console.error("❌ Error generating CSV:", error);
    res.status(500).json({
      success: false,
      message: "Error generating CSV report",
      error: error.message,
    });
  }
});

export default router;
