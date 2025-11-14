// backend/controllers/budgetController.js
import Budget from "../models/Budget.js";
import Notification from "../models/Notification.js";

// 🔹 Add New Budget
export const addBudget = async (req, res) => {
  try {
    const { category, limit, month } = req.body;

    // 🧩 Validation
    if (!category || !limit) {
      return res.status(400).json({
        success: false,
        message: "Category and limit are required",
      });
    }

    const userId = req.user._id;

    // 🔍 Determine current month if not provided
    const budgetMonth =
      month ||
      new Date().toLocaleString("default", { month: "long", year: "numeric" });

    // ⚙️ Check if budget for same category & month exists
    const existing = await Budget.findOne({
      user: userId,
      category,
      month: budgetMonth,
    });

    if (existing) {
      return res.status(400).json({
        success: false,
        message: `Budget for '${category}' (${budgetMonth}) already exists.`,
      });
    }

    // ✅ Create new budget
    const budget = await Budget.create({
      user: userId,
      category,
      amount: limit, // amount field
      spent: 0,
      month: budgetMonth,
    });

    // 🛎️ Create notification
    const notification = await Notification.create({
      user: userId,
      message: `📊 Budget set for ${category}: ₹${limit} (${budgetMonth})`,
      isRead: false,
    });

    res.status(201).json({
      success: true,
      message: "Budget added successfully!",
      budget,
      notification,
    });
  } catch (error) {
    console.error("❌ Error adding budget:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};
