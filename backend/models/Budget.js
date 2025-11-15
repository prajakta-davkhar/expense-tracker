import mongoose from "mongoose";

// 🔹 Budget Schema
const budgetSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // links budget to the logged-in user
      required: [true, "Budget must belong to a user"],
      index: true, // improves query performance
    },
    category: {
      type: String,
      required: [true, "Category is required"],
      trim: true,
    },
    limit: {
      type: Number,
      required: [true, "Budget limit is required"],
      min: [0, "Budget limit cannot be negative"],
    },
    spent: {
      type: Number,
      default: 0,
      min: [0, "Spent amount cannot be negative"],
    },
    month: {
      type: String,
      required: [true, "Month is required"],
      trim: true,
      index: true,
    },
  },
  {
    timestamps: true, // automatically adds createdAt & updatedAt
  }
);

// 🔹 Optional: virtual field to calculate remaining budget
budgetSchema.virtual("remaining").get(function () {
  return Math.max(this.limit - this.spent, 0);
});

// 🔹 Budget Model
const Budget = mongoose.model("Budget", budgetSchema);

export default Budget;
