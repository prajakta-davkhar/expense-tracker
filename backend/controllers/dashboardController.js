import Budget from "../models/Budget.js";

// 🔹 Get Budget Summary for logged-in user
export const getBudgetSummary = async (req, res) => {
  try {
    const userId = req.user._id;

    // 🧾 Fetch all budgets for logged-in user
    const budgets = await Budget.find({ user: userId });

    if (!budgets.length) {
      return res.status(404).json({
        success: false,
        message: "No budgets found for this user",
      });
    }

    // 📊 Prepare summary data
    const summary = budgets.map((b) => {
      const remaining = b.amount - b.spent; // use amount instead of limit
      const percentUsed = Math.round((b.spent / b.amount) * 100);

      return {
        category: b.category,
        budget: b.amount, // amount field
        spent: b.spent,
        remaining: remaining < 0 ? 0 : remaining, // avoid negative remaining
        percentUsed: percentUsed > 100 ? 100 : percentUsed, // cap at 100%
        month: b.month,
      };
    });

    res.status(200).json({
      success: true,
      count: budgets.length,
      data: summary,
    });
  } catch (err) {
    console.error("❌ Error in getBudgetSummary:", err);
    res.status(500).json({
      success: false,
      message: "Server error while fetching budget summary",
      error: err.message,
    });
  }
};
