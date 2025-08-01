import { connectDB } from "@/lib/db";
import Notification from "@/models/Notification";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import User from "@/models/User";

export async function GET(req) {
  await connectDB();
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return new Response("Unauthorized", { status: 401 });
  }

  const notifications = await Notification.find({
    recipient: session.user.id,
    isRead: false,
  })
    .populate("sender", "name")
    .sort({ createdAt: -1 })
    .lean();

  // ✅ Group by unique sender
  const uniqueMap = new Map();
  notifications.forEach((note) => {
    const senderId = note.sender._id.toString();
    if (!uniqueMap.has(senderId)) {
      uniqueMap.set(senderId, note);
    }
  });

  const uniqueNotifications = Array.from(uniqueMap.values());

  return Response.json(uniqueNotifications);
}
