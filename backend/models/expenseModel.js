import mongoose from "mongoose";

// 🔹 Expense Schema
const expenseSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Links expense to the logged-in user
      required: [true, "Expense must belong to a user"],
      index: true, // improves query performance
    },
    category: {
      type: String,
      required: [true, "Please add a category for the expense"],
      trim: true,
      enum: ["Food", "Travel", "Shopping", "Bills", "Others"], // optional predefined categories
    },
    amount: {
      type: Number,
      required: [true, "Please add an amount"],
      min: [0, "Amount cannot be negative"],
    },
    description: {
      type: String,
      default: "",
      trim: true,
      maxlength: [200, "Description cannot exceed 200 characters"],
    },
    date: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true, // adds createdAt & updatedAt automatically
  }
);

// 🔹 Optional: virtual to format amount with currency
expenseSchema.virtual("formattedAmount").get(function () {
  return `₹${this.amount.toFixed(2)}`;
});

// 🔹 Expense Model
const Expense = mongoose.model("Expense", expenseSchema);

export default Expense;
