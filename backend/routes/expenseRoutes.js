import express from "express";
import Expense from "../models/expenseModel.js";
import Budget from "../models/Budget.js";
import Notification from "../models/Notification.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

/**
 * 🔹 GET all expenses for logged-in user
 */
router.get("/", protect, async (req, res) => {
  try {
    const expenses = await Expense.find({ user: req.user._id }).sort({ date: -1 });
    res.status(200).json({
      success: true,
      count: expenses.length,
      data: expenses,
    });
  } catch (err) {
    console.error("❌ Error fetching expenses:", err);
    res.status(500).json({
      success: false,
      message: "Error fetching expenses",
      error: err.message,
    });
  }
});

/**
 * 🔹 POST: Add New Expense
 */
router.post("/", protect, async (req, res) => {
  try {
    const { category, amount, description, date } = req.body;
    const userId = req.user._id;

    if (!category || amount === undefined || amount === null || isNaN(Number(amount))) {
      return res.status(400).json({
        success: false,
        message: "Category and valid amount are required.",
      });
    }

    // ✅ Create the new expense
    const newExpense = await Expense.create({
      user: userId,
      category,
      amount: Number(amount),
      description: description || "",
      date: date ? new Date(date) : new Date(),
    });

    // 🔹 Determine current month in YYYY-MM format
    const now = new Date();
    const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;

    // 🔹 Update budget if exists
    const budget = await Budget.findOne({ user: userId, category, month: currentMonth });

    let message = "✅ Expense added successfully!";

    if (budget) {
      budget.spent += Number(amount);
      await budget.save();

      const percentUsed = Math.round((budget.spent / budget.limit) * 100);

      if (percentUsed >= 80 && percentUsed < 100) {
        await Notification.create({
          user: userId,
          message: `⚠️ You've used ${percentUsed}% of your ${category} budget (₹${budget.spent}/₹${budget.limit})`,
          isRead: false,
        });
      }

      if (percentUsed >= 100) {
        message = `⚠️ Budget limit exceeded by ₹${budget.spent - budget.limit} for ${category}!`;
        await Notification.create({
          user: userId,
          message,
          isRead: false,
        });
      }
    } else {
      await Notification.create({
        user: userId,
        message: `💡 Expense added for ${category}, but no budget set for this category.`,
        isRead: false,
      });
    }

    // ✅ General expense notification
    await Notification.create({
      user: userId,
      message: `💸 New expense added: ${category} - ₹${amount}`,
      isRead: false,
    });

    res.status(201).json({
      success: true,
      message,
      data: newExpense,
    });
  } catch (error) {
    console.error("❌ Error adding expense:", error);
    res.status(500).json({
      success: false,
      message: "Server error while adding expense",
      error: error.message,
    });
  }
});

export default router;
