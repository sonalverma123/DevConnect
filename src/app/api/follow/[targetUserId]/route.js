// app/api/follow/[targetUserId]/route.js

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import User from "@/models/User";
import { connectDB } from "@/lib/db";

export async function POST(req, { params }) {
  await connectDB(); // Connect to MongoDB

  const session = await getServerSession(authOptions); // Get logged-in user
  if (!session) return Response.json({ error: "Not authenticated" }, { status: 401 });

  const currentUserEmail = session.user.email;
  const targetUserId = params.targetUserId;

  const currentUser = await User.findOne({ email: currentUserEmail });
  const targetUser = await User.findById(targetUserId);

  if (!targetUser) return Response.json({ error: "User not found" }, { status: 404 });

  const isFollowing = targetUser.followers.includes(currentUser._id);

  if (isFollowing) {
    // Unfollow
    targetUser.followers.pull(currentUser._id);
    currentUser.following.pull(targetUser._id);
  } else {
    // Follow
    targetUser.followers.push(currentUser._id);
    currentUser.following.push(targetUser._id);
  }

  await targetUser.save();
  await currentUser.save();

  return Response.json({ success: true, isFollowing: !isFollowing });
}
