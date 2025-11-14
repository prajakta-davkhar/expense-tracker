import Notification from "../models/Notification.js";
import mongoose from "mongoose";

// Get all notifications for logged-in user
export const getNotifications = async (req, res) => {
  try {
    const userId = req.user?._id;
    if (!userId) return res.status(401).json({ success: false, message: "User not authenticated" });

    const notifications = await Notification.find({ user: userId }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: notifications });
  } catch (error) {
    console.error("Get notifications error:", error);
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

// Create a new notification
export const createNotification = async (req, res) => {
  try {
    const userId = req.user?._id;
    if (!userId) return res.status(401).json({ success: false, message: "User not authenticated" });

    const { message } = req.body;
    if (!message) return res.status(400).json({ success: false, message: "Notification message is required" });

    const notification = await Notification.create({ user: userId, message, isRead: false });
    res.status(201).json({ success: true, data: notification });
  } catch (error) {
    console.error("Create notification error:", error);
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

// Mark a single notification as read
export const markAsRead = async (req, res) => {
  try {
    const userId = req.user?._id;
    const { id } = req.params;

    if (!userId) return res.status(401).json({ success: false, message: "User not authenticated" });
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ success: false, message: "Invalid notification ID" });

    const notification = await Notification.findOneAndUpdate(
      { _id: id, user: userId },
      { isRead: true },
      { new: true }
    );

    if (!notification) return res.status(404).json({ success: false, message: "Notification not found" });

    res.json({ success: true, message: "Notification marked as read", data: notification });
  } catch (error) {
    console.error("Mark notification as read error:", error);
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

// Mark all notifications as read
export const markAllRead = async (req, res) => {
  try {
    const userId = req.user?._id;
    if (!userId) return res.status(401).json({ success: false, message: "User not authenticated" });

    await Notification.updateMany({ user: userId, isRead: false }, { isRead: true });
    res.json({ success: true, message: "All notifications marked as read" });
  } catch (error) {
    console.error("Mark all notifications as read error:", error);
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

// Delete a single notification
export const deleteNotification = async (req, res) => {
  try {
    const userId = req.user?._id;
    const { id } = req.params;

    if (!userId) return res.status(401).json({ success: false, message: "User not authenticated" });
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ success: false, message: "Invalid notification ID" });

    const notification = await Notification.findOneAndDelete({ _id: id, user: userId });
    if (!notification) return res.status(404).json({ success: false, message: "Notification not found" });

    res.json({ success: true, message: "Notification deleted" });
  } catch (error) {
    console.error("Delete notification error:", error);
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

// Clear all notifications for logged-in user
export const clearAll = async (req, res) => {
  try {
    const userId = req.user?._id;
    if (!userId) return res.status(401).json({ success: false, message: "User not authenticated" });

    await Notification.deleteMany({ user: userId });
    res.json({ success: true, message: "All notifications cleared" });
  } catch (error) {
    console.error("Clear all notifications error:", error);
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};
