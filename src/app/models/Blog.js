// models/Blog.js
import mongoose from "mongoose";

const commentSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    text: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
  },

);

const blogSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
    thumbnail: { type: String },
    tags: [String],
    creator: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    comments: [commentSchema],
  },
  { timestamps: true }
);

export default mongoose.models.Blog || mongoose.model("Blog", blogSchema);
