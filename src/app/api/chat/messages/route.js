import { connectDB } from "@/lib/db";
import Chat from "@/models/Chat";
import { NextResponse } from "next/server";

// ✅ GET messages between sender and receiver
export async function GET(req) {
  await connectDB();

  const { searchParams } = new URL(req.url);
  const sender = searchParams.get("sender");
  const receiver = searchParams.get("receiver");

  if (!sender || !receiver) {
    return NextResponse.json({ error: "Missing sender or receiver" }, { status: 400 });
  }

  const chat = await Chat.findOne({
    participants: { $all: [sender, receiver] },
  }).populate("messages.sender", "name image");

  return NextResponse.json({ messages: chat?.messages || [] });
}

// ✅ POST a new message
export async function POST(req) {
  try {
    await connectDB();

    const { sender, receiver, message } = await req.json();

    if (!sender || !receiver || !message) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    let chat = await Chat.findOne({
      participants: { $all: [sender, receiver] },
    });

    const newMessage = {
      sender,
      message,
      createdAt: new Date().toISOString(), // ✅ Add timestamp
    };

    if (!chat) {
      chat = await Chat.create({
        participants: [sender, receiver],
        messages: [newMessage],
      });
    } else {
      chat.messages.push(newMessage);
      await chat.save();
    }

    return NextResponse.json({ success: true, message: newMessage });
  } catch (error) {
    console.error("POST error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
