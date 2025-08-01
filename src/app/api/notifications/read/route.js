import { connectDB } from "@/lib/db";
import Notification from "@/models/Notification";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import mongoose from "mongoose";

export async function PATCH(req) {
  await connectDB();
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return new Response("Unauthorized", { status: 401 });
  }

  const body = await req.json();
  const { senderId, notificationId } = body;

  if (senderId) {
    const senderObjectId = new mongoose.Types.ObjectId(senderId);
    await Notification.updateMany(
      {
        recipient: session.user.id,
        sender: senderObjectId,
        isRead: false,
      },
      { $set: { isRead: true } }
    );
  } else if (notificationId) {
    await Notification.findOneAndUpdate(
      { _id: notificationId, recipient: session.user.id },
      { $set: { isRead: true } }
    );
  }

  return Response.json({ success: true });
}
