"use client";

import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { MessageCircle } from "lucide-react";
import { useTheme } from "@/components/ThemeProvider";

export default function Navbar() {
  const { data: session } = useSession();
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="w-full py-4 px-6 shadow-md bg-white dark:bg-gray-900 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* ✅ Logo */}
        <Link
          href="/"
          className="text-2xl font-bold text-blue-600 hover:opacity-80 transition"
        >
          DevConnect
        </Link>

        {/* ✅ Navigation Links */}
        <nav className="flex items-center space-x-5 text-sm sm:text-base font-medium">
          <Link
            href="/"
            className="hover:text-blue-500 transition duration-150"
          >
            Home
          </Link>

          <Link
            href="/explore"
            className="hover:text-green-500 transition duration-150"
          >
            Explore 🔍
          </Link>

          <Link
            href="/chat"
            className="flex items-center gap-1 hover:text-blue-500 transition"
          >
            <MessageCircle className="w-5 h-5" />
            Chat
          </Link>

          {/* ✅ Theme toggle */}
          {/*
<button
  onClick={toggleTheme}
  className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded text-sm hover:scale-105 transition"
  title="Toggle Theme"
>
  {theme === "dark" ? "☀️ Light" : "🌙 Dark"}
</button>
*/}


          {session ? (
            <>
              {/* ✅ Profile */}
              <Link
                href={`/profile/${session.user.name}`}
                className="text-blue-600 hover:underline"
              >
                My Profile
              </Link>

              {/* ✅ Logout */}
              <button
                onClick={() => signOut()}
                className="text-red-500 hover:underline"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="text-gray-700 dark:text-gray-300 hover:text-blue-500"
              >
                Login
              </Link>
              <Link
                href="/register"
                className="text-gray-700 dark:text-gray-300 hover:text-blue-500"
              >
                Register
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
