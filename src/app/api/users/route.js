// app/api/users/route.js
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

export async function GET() {
  await connectDB();
  const session = await getServerSession(authOptions);
  const currentUserId = session?.user?.id;

  const users = await User.find({ _id: { $ne: currentUserId },  role: { $ne: "admin" }  })
    .select("name email image followers")
    .lean();

  const safeUsers = users.map((user) => ({
    ...user,
    _id: user._id.toString(),
    followers: user.followers?.map((f) => f.toString()) || [],
  }));

  return Response.json(safeUsers);
}
