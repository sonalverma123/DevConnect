import { NextResponse } from "next/server";
import {connectDB} from "@/lib/db";
import Chat from "@/models/Chat";

export async function POST(req) {
  await connectDB();
  const { sender, receiver } = await req.json();

  if (!sender || !receiver) {
    return NextResponse.json({ error: "Missing params" }, { status: 400 });
  }

  try {
    // Find the chat document between both users
    const chat = await Chat.findOne({
      participants: { $all: [sender, receiver] },
    });

    if (!chat) {
      return NextResponse.json({ message: "Chat not found" }, { status: 404 });
    }

    // Update seenBy field for unseen messages
    chat.messages.forEach((msg) => {
      if (
        String(msg.sender) === sender && 
        !msg.seenBy?.includes(receiver)
      ) {
        msg.seenBy = [...(msg.seenBy || []), receiver];
      }
    });

    await chat.save();

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Error marking messages seen:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
