import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Notification must belong to a user"],
      index: true, // improves query performance for user notifications
    },
    message: {
      type: String,
      required: [true, "Notification message is required"],
      trim: true,
      maxlength: [300, "Message cannot exceed 300 characters"],
    },
    isRead: {
      type: Boolean,
      default: false,
      index: true, // allows filtering unread notifications quickly
    },
  },
  {
    timestamps: true, // adds createdAt & updatedAt
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

notificationSchema.virtual("preview").get(function () {
  return this.message.length > 50
    ? this.message.substring(0, 50) + "..."
    : this.message;
});

const Notification = mongoose.model("Notification", notificationSchema);
export default Notification;
