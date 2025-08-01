import { Server } from "socket.io";
import { connectDB } from "@/lib/db";
import Chat from "@/models/Chat";

import Notification from "@/models/Notification";

let io;

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (!res.socket.server.io) {
    console.log("🔌 Initializing Socket.io");

    await connectDB();

    io = new Server(res.socket.server, {
      path: "/api/socket",
    });

    io.on("connection", (socket) => {
      console.log("✅ Socket connected:", socket.id);

      socket.on("join", (userId) => {
        socket.join(userId);


      });

      socket.on("seen", async ({ from, to }) => {
        const updated = await Chat.findOneAndUpdate(
          { participants: { $all: [from, to] } },
          {
            $set: {
              "messages.$[elem].seenBy": from,
            },
          },
          {
            arrayFilters: [
              {
                "elem.sender": to,
                "elem.seenBy": { $ne: from },
              },
            ],
            new: true,
          }
        );

        if (updated) {
          io.to(to).emit("seen-confirmation", {
            from,
            to,
          });
        }
      });



      socket.on("message", async ({ sender, receiver, text }) => {
        // Emit message
        io.to(receiver).emit("message", { sender, message: text });
        io.to(sender).emit("message", { sender, message: text });

        // ✅ Only create notification if one doesn't already exist
        const existingNotification = await Notification.findOne({
          sender,
          recipient: receiver,
          type: "message",
          isRead: false,
        });

        if (!existingNotification) {
          await Notification.create({
            sender,
            recipient: receiver,
            type: "message",
          });
        }
      });
    });

    res.socket.server.io = io;
  }

  res.end();
}
