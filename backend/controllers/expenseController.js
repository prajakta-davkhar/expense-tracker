import Expense from "../models/Expense.js";
import Budget from "../models/Budget.js";
import Notification from "../models/Notification.js";

// 🔹 Add Expense Controller
export const addExpense = async (req, res) => {
  try {
    const { description, amount, category, date } = req.body;

    if (!description || !amount || !category) {
      return res.status(400).json({
        success: false,
        message: "Description, amount, and category are required",
      });
    }

    // ✅ 1. Create Expense
    const expense = await Expense.create({
      user: req.user._id,
      description,
      amount: Number(amount),
      category,
      date: date ? new Date(date) : new Date(),
    });

    // ✅ 2. Determine current month (matching Budget month format)
    const budgetMonth = new Date().toLocaleString("default", {
      month: "long",
      year: "numeric",
    });

    // ✅ 3. Find Budget for category & month
    const budget = await Budget.findOne({
      user: req.user._id,
      category,
      month: budgetMonth,
    });

    if (budget) {
      // ✅ Update spent
      budget.spent += Number(amount);
      await budget.save();

      const percentUsed = (budget.spent / budget.amount) * 100;

      // ⚠️ Warning if 80–99%
      if (percentUsed >= 80 && percentUsed < 100) {
        await Notification.create({
          user: req.user._id,
          message: `⚠️ You've used ${percentUsed.toFixed(
            1
          )}% of your ${category} budget (₹${budget.spent} / ₹${budget.amount})`,
          isRead: false,
        });
      }

      // 🔴 Over budget
      if (percentUsed >= 100) {
        await Notification.create({
          user: req.user._id,
          message: `🔴 You've exceeded your ${category} budget! (₹${budget.spent} / ₹${budget.amount})`,
          isRead: false,
        });
      }
    } else {
      // ❗ No budget found notification (optional)
      await Notification.create({
        user: req.user._id,
        message: `💡 Expense added for ${category}, but no budget is set for this category.`,
        isRead: false,
      });
    }

    // ✅ Regular expense notification
    await Notification.create({
      user: req.user._id,
      message: `💸 New expense added: ${description} - ₹${amount}`,
      isRead: false,
    });

    res.status(201).json({
      success: true,
      message: "Expense added successfully",
      data: expense,
    });
  } catch (error) {
    console.error("❌ Error adding expense:", error);
    res.status(500).json({
      success: false,
      message: "Server error while adding expense",
      error: error.message,
    });
  }
};
