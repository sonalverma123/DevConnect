// /api/chat/user-chats/route.js
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { connectDB } from "@/lib/db";
import ChatRoom from "@/models/ChatRoom";
import User from "@/models/User";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return new Response("Unauthorized", { status: 401 });

  await connectDB();
  const rooms = await ChatRoom.find({ participants: session.user.id })
    .populate("participants", "name")
    .lean();

  return Response.json(rooms);
}
