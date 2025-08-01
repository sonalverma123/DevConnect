import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false,
    },
    type: {
      type: String,
      enum: ["message", "blog-deletion", "project-deletion", "account-deletion"],
      default: "message",
      required: true,
    },
    message: {
      type: String, 
    },
    isRead: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const Notification =
  mongoose.models.Notification || mongoose.model("Notification", notificationSchema);

export default Notification;
