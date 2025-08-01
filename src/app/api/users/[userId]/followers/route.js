// app/api/users/[userId]/followers/route.js
import { connectDB } from "@/lib/db";
import User from "@/models/User";

export async function GET(req, { params }) {
  await connectDB();
  const user = await User.findById(params.userId).populate("followers", "name image _id");
  if (!user) return new Response("User not found", { status: 404 });
  return Response.json(user.followers);
}
