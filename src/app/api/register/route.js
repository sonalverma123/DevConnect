import { connectDB } from "../../lib/db";
import User from "@/models/User";
import bcrypt from "bcrypt";

// Custom API route to handle user registration
export async function POST(req) {
  await connectDB();
  const { name, email, password, role } = await req.json();

  // Check for existing user
  const existing = await User.findOne({ email });
  if (existing) {
    return Response.json({ error: "User already exists" }, { status: 400 });
  }

  // Hash password before saving
  const hashed = await bcrypt.hash(password, 10);

  // Create and save user
  const user = await User.create({ name, email, password: hashed,  role: role || "user", });

  return Response.json({ message: "User created", user });
}
