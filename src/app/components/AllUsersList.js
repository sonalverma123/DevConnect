// components/AllUsersList.js
"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import FollowButton from "@/components/FollowButton";

export default function AllUsersList({ users }) {
  const router = useRouter();

  const startChat = async (otherUserId) => {
    const res = await fetch("/api/chat/start", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ otherUserId }),
    });

    if (res.ok) {
      const data = await res.json();
      router.push(`/chat/${data.chatId}`);
    } else {
      alert("Error starting chat");
    }
  };

  return (
    <div className="grid gap-4">
      {users.map((user) => (
        <div
          key={user._id}
          className="flex items-center justify-between bg-white dark:bg-gray-800 p-4 rounded shadow hover:bg-gray-100"
        >
          <Link href={`/profile/${user.name}`} className="flex items-center gap-4">
            {user.image && (
              <Image
                src={user.image}
                alt={user.name}
                width={50}
                height={50}
                className="rounded-full"
              />
            )}
            <div>
              <p className="text-lg font-semibold">{user.name}</p>
              <p className="text-sm text-gray-500">{user.email}</p>
            </div>
          </Link>

          <Link
            href={`/users/${user._id}/projects`}
            className="text-sm text-blue-500 hover:underline ml-4"
          >
            View Projects
          </Link>

          <Link href={`/chat?user=${user._id}`} className="text-blue-600 hover:underline">
            💬 Chat
          </Link>



          <Link
            href={`/users/${user._id}/blogs`}
            className="text-sm text-blue-500 hover:underline ml-4"
          >
            View Blogs
          </Link>

          <FollowButton
            targetUserId={user._id.toString()}
            targetFollowers={user.followers?.map((f) => f.toString()) || []}
          />
        </div>
      ))}
    </div>
  );
}
