// MongoDB database connection using Mongoose
import mongoose from "mongoose";

// Save connection across hot reloads
let isConnected = false;

export const connectDB = async () => {
  if (isConnected) return;

  try {
    console.log('MongoDB URI:', process.env.MONGODB_URI);

    await mongoose.connect(process.env.MONGODB_URI, {
      dbName: "devconnect",
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    isConnected = true;
    console.log("✅ Using MongoDB URI:", process.env.MONGODB_URI);
    console.log("✅ MongoDB Connected");
  } catch (err) {
    console.error("❌ MongoDB Connection Error:", err);
  }
};
