// models/Project.js

import mongoose from "mongoose";

// Define schema for Project
const ProjectSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true, // Project must have a title
    },
    description: {
      type: String,
      required: true, // Project must have a description
    },
    githubUrl: {
      type: String,
      required: false, // Optional GitHub repo link
    },
    liveUrl: {
      type: String,
      required: false, // Optional live demo link
    },
    tags: [
      {
        type: String, // Tags like: #React, #NextJS, etc.
      },
    ],
    thumbnail: {
      type: String, // Project image URL
    },
    creator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Refers to the user who created the project
      required: true,
    },
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", // List of user IDs who liked the project
      },
    ],
    comments: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        text: String,
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  { timestamps: true } 
);

// Export model (prevent multiple declarations in dev)
export default mongoose.models.Project || mongoose.model("Project", ProjectSchema);
