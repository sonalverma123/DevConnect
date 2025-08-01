"use client";

import { useEffect, useState, useRef } from "react";
import { io } from "socket.io-client";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useSearchParams, useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import Navbar from "@/components/Navbar";

const Picker = dynamic(() => import("emoji-picker-react"), { ssr: false });

export default function ChatPage() {
  const { data: session } = useSession();
  const userId = session?.user?.id;
  const router = useRouter();
  const [selectedUser, setSelectedUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const endRef = useRef(null);
  const socket = useRef(null);
  const typingRef = useRef(null);
  const searchParams = useSearchParams();
  const userParam = searchParams.get("user");

  const preselectedUserId = userParam;



  useEffect(() => {
    if (!userId) return;

    fetch("/api/socket");

    socket.current = io("/", {
      path: "/api/socket",
    });

    socket.current.emit("join", userId);

    socket.current.on("message", (msg) => {
      setMessages((prev) => [
        ...prev,
        {
          ...msg,
          seenBy: msg.seenBy || [], // ✅ make sure this is initialized
          createdAt: msg.createdAt || new Date().toISOString(),
          sender: {
            _id: msg.sender,
            name: msg.sender === userId ? session?.user?.name : selectedUser?.name || "User",
            image: msg.sender === userId ? session?.user?.image : selectedUser?.image || "",
          },
        },
      ]);
    });

    socket.current.on("seen-confirmation", ({ from, to }) => {
      setMessages((prev) =>
        prev.map((msg) => {
          if (msg.sender?._id === userId && !msg.seenBy?.includes(to)) {
            return {
              ...msg,
              seenBy: [...(msg.seenBy || []), to],
            };
          }

          return msg;
        })
      );
    });


    socket.current.on("typing", ({ from }) => {
      if (selectedUser && from === selectedUser._id) {
        setIsTyping(true);
        clearTimeout(typingRef.current);
        typingRef.current = setTimeout(() => setIsTyping(false), 2000);
      }
    });

    return () => {
      socket.current?.disconnect();
    };
  }, [userId]);

  useEffect(() => {
    fetch("/api/users")
      .then((res) => res.json())
      .then((data) => {
        setUsers(data);
        if (preselectedUserId) {
          const found = data.find((u) => u._id === preselectedUserId);
          if (found) setSelectedUser(found);
        }
      })
      .catch((err) => console.error("Error loading users:", err));
  }, [preselectedUserId]);




  useEffect(() => {
    if (userParam && users.length > 0) {
      const match = users.find((u) => u._id === userParam);
      if (match) setSelectedUser(match);
    }
  }, [userParam, users]);

  useEffect(() => {
    if (selectedUser) {
      fetch(`/api/chat/messages?sender=${userId}&receiver=${selectedUser._id}`)
        .then(async (res) => {
          const contentType = res.headers.get("content-type");
          if (!res.ok || !contentType?.includes("application/json")) {
            setMessages([]);
            return;
          }

          const data = await res.json();
          setMessages(data.messages || []);

          // ✅ Emit seen right after setting messages
          socket.current?.emit("seen", {
            from: userId,
            to: selectedUser._id,
          });
        })
        .catch((err) => console.error("Error loading messages:", err));
    }
  }, [selectedUser, userId]);


  useEffect(() => {
    if (selectedUser && userId) {
      fetch(`/api/chat/messages/mark-seen`, {
        method: "POST",
        body: JSON.stringify({
          sender: selectedUser._id,
          receiver: userId,
        }),
      }).catch((err) => console.error("Error marking seen:", err));
    }
  }, [selectedUser, userId]);

  useEffect(() => {
    if (selectedUser && socket.current) {
      socket.current.emit("seen", {
        from: userId,
        to: selectedUser._id,
      });
    }
  }, [messages]);


  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || !socket.current) return;

    const newMsg = {
      sender: userId,
      receiver: selectedUser._id,
      message: input,
      createdAt: new Date().toISOString(),
    };

    socket.current.emit("message", {
      sender: userId,
      receiver: selectedUser._id,
      text: input,
      createdAt: new Date().toISOString(),
    });

    await fetch("/api/chat/messages", {
      method: "POST",
      body: JSON.stringify(newMsg),
    });

    setInput("");
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex flex-1 overflow-hidden">
        <aside className="w-1/4 bg-white dark:bg-gray-900 border-r overflow-y-auto">
          <div className="p-4 border-b">
            <h2 className="text-xl font-semibold text-blue-600">💬 Chats</h2>
          </div>
          {users.filter((u) => u._id !== userId).map((u) => (
            <div
              key={u._id}
              onClick={() => {
                setSelectedUser(u);
                router.push(`/chat?user=${u._id}`);
              }}
              className={`flex items-center gap-3 p-3 cursor-pointer transition-all ${selectedUser?._id === u._id
                  ? "bg-blue-100 dark:bg-blue-800"
                  : "hover:bg-gray-100 dark:hover:bg-gray-800"
                } rounded`}
            >
              <Image
                src={u.image || "/default-avatar.png"}
                alt={u.name || "User"}
                width={40}
                height={40}
                className="rounded-full object-cover border"
              />
              <div>
                <p className="font-medium text-gray-900 dark:text-white">{u.name}</p>
              </div>
            </div>
          ))}
        </aside>


        <section className="flex-1 flex flex-col p-4 overflow-y-auto">
          <div className="flex-1 overflow-y-auto px-2 sm:px-4 py-2 space-y-3">
            {messages.map((msg, i) => {
              const senderId = typeof msg.sender === "string" ? msg.sender : msg.sender._id;
              const isCurrentUser = senderId === userId;
              const senderName = isCurrentUser ? "You" : msg.sender?.name || "User";
              const senderImage = isCurrentUser
                ? session?.user?.image || "/default-avatar.png"
                : msg.sender?.image || "/default-avatar.png";

              const dateObj = msg.createdAt ? new Date(msg.createdAt) : new Date();
              const dateStr = dateObj.toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              });
              const timeStr = dateObj.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              });

              return (
                <div
                  key={i}
                  className={`flex items-end gap-2 ${isCurrentUser ? "justify-end" : "justify-start"
                    }`}
                >
                  {!isCurrentUser && (
                    <Image
                      src={senderImage}
                      alt={senderName}
                      width={36}
                      height={36}
                      className="rounded-full shadow"
                    />
                  )}

                  <div
                    className={`max-w-xs sm:max-w-sm md:max-w-md px-4 py-2 rounded-2xl shadow ${isCurrentUser
                        ? "bg-blue-500 text-white font-semibold rounded-br-none"
                        : "bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded-bl-none"
                      }`}
                  >
                    <p className="text-sm whitespace-pre-wrap">{msg.message || msg.text}</p>
                    <p className="text-[10px] text-right mt-1 opacity-80">
                      {dateStr}, {timeStr}
                      {isCurrentUser && msg.seenBy?.includes(selectedUser?._id) && (
                        <span className="ml-1 text-blue-300">✓✓</span>
                      )}
                    </p>
                  </div>


                  {isCurrentUser && (
                    <Image
                      src={senderImage}
                      alt={senderName}
                      width={36}
                      height={36}
                      className="rounded-full shadow"
                    />
                  )}
                </div>
              );
            })}

            {isTyping && (
              <div className="text-sm italic text-gray-500 mb-2">{selectedUser?.name} is typing...</div>
            )}

            <div ref={endRef} />
          </div>

          {selectedUser && (
            <div className="border-t px-4 py-3 bg-white dark:bg-gray-800 flex items-center gap-2 relative">
              <button
                onClick={() => setShowEmojiPicker((prev) => !prev)}
                className="text-xl"
                title="Add emoji"
              >
                😊
              </button>

              {showEmojiPicker && (
                <div className="absolute bottom-14 left-2 z-50">
                  <Picker onEmojiClick={(emoji) => setInput((prev) => prev + emoji.emoji)} />
                </div>
              )}

              <input
                value={input}
                onChange={(e) => {
                  setInput(e.target.value);
                  socket.current?.emit("typing", { to: selectedUser._id });
                }}
                onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                className="flex-1 px-4 py-2 rounded-full border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Type a message..."
              />

              <button
                onClick={sendMessage}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-full"
              >
                Send
              </button>
            </div>

          )}
        </section>
      </div>
    </div>
  );
}
