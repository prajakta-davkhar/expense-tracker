import express from "express";
import Expense from "../models/expenseModel.js";
import Budget from "../models/Budget.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

/**
 * 📊 1️⃣ Category-wise Expense Summary
 */
router.get("/category-summary", protect, async (req, res) => {
  try {
    const userId = req.user._id;

    const summary = await Expense.aggregate([
      { $match: { user: userId } },
      {
        $group: {
          _id: "$category",
          total: { $sum: "$amount" },
        },
      },
      {
        $project: {
          _id: 0,
          category: "$_id",
          total: 1,
        },
      },
      { $sort: { total: -1 } },
    ]);

    res.json({ success: true, data: summary });
  } catch (error) {
    console.error("❌ Error fetching category summary:", error);
    res.status(500).json({ success: false, message: error.message });
  }
});

/**
 * 📅 2️⃣ Monthly Expense Summary
 */
router.get("/monthly-summary", protect, async (req, res) => {
  try {
    const userId = req.user._id;

    const monthly = await Expense.aggregate([
      { $match: { user: userId } },
      {
        $group: {
          _id: { year: { $year: "$date" }, month: { $month: "$date" } },
          total: { $sum: "$amount" },
        },
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } }, // Sort chronologically
      {
        $project: {
          _id: 0,
          month: {
            $concat: [
              {
                $arrayElemAt: [
                  [
                    "",
                    "January",
                    "February",
                    "March",
                    "April",
                    "May",
                    "June",
                    "July",
                    "August",
                    "September",
                    "October",
                    "November",
                    "December",
                  ],
                  "$_id.month",
                ],
              },
              " ",
              { $toString: "$_id.year" },
            ],
          },
          total: 1,
        },
      },
    ]);

    res.json({ success: true, data: monthly });
  } catch (error) {
    console.error("❌ Error fetching monthly summary:", error);
    res.status(500).json({ success: false, message: error.message });
  }
});

/**
 * 💰 3️⃣ Budget vs Expense Report
 */
router.get("/budget-status", protect, async (req, res) => {
  try {
    const userId = req.user._id;

    const expensesByCategory = await Expense.aggregate([
      { $match: { user: userId } },
      {
        $group: {
          _id: "$category",
          spent: { $sum: "$amount" },
        },
      },
    ]);

    const expenseMap = {};
    expensesByCategory.forEach((e) => (expenseMap[e._id] = e.spent));

    const budgets = await Budget.find({ user: userId });

    const report = budgets.map((b) => {
      const spent = expenseMap[b.category] || 0;
      const remaining = b.limit - spent;
      return {
        category: b.category,
        budget: b.limit,
        spent,
        remaining,
        percentUsed: b.limit ? Math.round((spent / b.limit) * 100) : 0,
      };
    });

    res.json({ success: true, data: report });
  } catch (error) {
    console.error("❌ Error fetching budget report:", error);
    res.status(500).json({ success: false, message: error.message });
  }
});

/**
 * 📈 4️⃣ Combined Report Summary for Dashboard
 */
router.get("/", protect, async (req, res) => {
  try {
    const userId = req.user._id;

    const expensesByCategory = await Expense.aggregate([
      { $match: { user: userId } },
      {
        $group: {
          _id: "$category",
          spent: { $sum: "$amount" },
        },
      },
    ]);

    const expenseMap = {};
    expensesByCategory.forEach((e) => (expenseMap[e._id] = e.spent));

    const budgets = await Budget.find({ user: userId });

    let totalBudget = 0;
    let totalSpent = 0;

    const data = budgets.map((b) => {
      const spent = expenseMap[b.category] || 0;
      totalBudget += b.limit;
      totalSpent += spent;
      return {
        category: b.category,
        budget: b.limit,
        spent,
        remaining: b.limit - spent,
      };
    });

    res.json({
      success: true,
      data,
      totalBudget,
      totalSpent,
      remaining: totalBudget - totalSpent,
    });
  } catch (err) {
    console.error("❌ Error generating combined report:", err);
    res.status(500).json({ success: false, message: "Server Error" });
  }
});

export default router;
