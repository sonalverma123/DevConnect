// components/FollowButton.js

"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";

export default function FollowButton({ targetUserId, targetFollowers }) {
  const { data: session } = useSession();
  const [isFollowing, setIsFollowing] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!session?.user) return;

    // If current user ID is in target's followers → we are following
    const currentUserId = session.user.id;
    setIsFollowing(targetFollowers.includes(currentUserId));
  }, [session, targetFollowers]);

  const handleFollow = async () => {
    setLoading(true);

    const res = await fetch(`/api/follow/${targetUserId}`, {
      method: "POST",
    });

    const data = await res.json();

    setIsFollowing(data.isFollowing);
    setLoading(false);
  };

  if (!session || session.user.id === targetUserId) return null; // Don't show if it's your own profile

  return (
    <button
      onClick={handleFollow}
      className={`mt-4 px-4 py-2 rounded ${isFollowing ? "bg-gray-300 text-black" : "bg-blue-600 text-white"
        }`}
      disabled={loading}
    >
      {loading ? "Loading..." : isFollowing ? "Unfollow" : "Follow"}
    </button>
  );
}
