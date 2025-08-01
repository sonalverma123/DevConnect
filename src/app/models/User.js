// Mongoose schema for storing user data
import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String, // Hashed
  role: {
    type: String,
    enum: ["user", "admin"],
    default: "admin",
  },
  image: String,    // Google avatar or custom
  isDeleted: {
    type: Boolean,
    default: false, // 👈 this marks user as deleted
  },

  // 👇 These two fields are arrays of ObjectIds (user references)
  followers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  following: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],

  bio: { type: String, default: "" },
  location: { type: String, default: "" },
  github: { type: String, default: "" },
  linkedin: { type: String, default: "" },

});


// Export model if not already registered
export default mongoose.models.User || mongoose.model("User", UserSchema);
