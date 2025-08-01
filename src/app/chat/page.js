"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import ChatPage from "@/components/ChatPage"; // ✅ move your full chat logic into a component

export default function ProtectedChatPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  // Redirect if unauthenticated
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status]);

  // Show loading screen while checking session
  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center text-xl">
        Loading chat...
      </div>
    );
  }

  // Return null briefly while redirecting unauthenticated user
  if (!session) return null;

  // ✅ Authenticated: render the chat
  return <ChatPage />;
}
