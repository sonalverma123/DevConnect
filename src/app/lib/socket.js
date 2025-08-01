import { Server } from "socket.io";

let io;

export function setupSocket(server) {
  if (!io) {
    io = new Server(server, {
      path: "/api/socket",
      addTrailingSlash: false,
    });

    io.on("connection", (socket) => {
      console.log("User connected:", socket.id);

      socket.on("join", (userId) => {
        socket.join(userId); // join room
      });

      socket.on("message", ({ sender, receiver, text }) => {
        io.to(receiver).emit("message", { sender, text });
      });

      socket.on("disconnect", () => {
        console.log("User disconnected:", socket.id);
      });
    });
  }

  return io;
}
