"use client";
import { signOut } from "next-auth/react";

export default function LogoutButton() {
  return (
    <button
      onClick={() =>
        signOut({ callbackUrl: "/login" }) // ✅ Redirects after logout
      }
      className="absolute top-4 right-4 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
    >
      Logout
    </button>
  );
}
