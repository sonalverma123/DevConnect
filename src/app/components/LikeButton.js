"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";

export default function LikeButton({ projectId, initialLikes }) {
  const { data: session } = useSession();
  const userId = session?.user?.id;
  const [likes, setLikes] = useState(initialLikes || []);
  const [loading, setLoading] = useState(false);

  const isLiked = likes.includes(userId);

  const handleLike = async () => {
    if (!userId || loading) return;

    setLoading(true);

    try {
      const res = await fetch(`/api/projects/${projectId}/like`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      });

      const data = await res.json();

      if (res.ok) {
        setLikes(data.updatedLikes);
      } else {
        alert(data.error || "Error toggling like");
      }
    } catch (error) {
      console.error("Like error:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!session) return null; // Hide button if not logged in

  return (
    <button
      onClick={handleLike}
      className={`px-4 py-2 rounded text-white ${isLiked ? "bg-red-500" : "bg-gray-500"
        }`}
    >
      {isLiked ? "Unlike" : "Like"} ({likes.length})
    </button>
  );
}
