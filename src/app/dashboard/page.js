"use client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import LogoutButton from "@/components/LogoutButton";
import Link from "next/link";

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [stats, setStats] = useState({ totalProjects: 0, totalBlogs: 0, totalFollowers: 0 });
  const [notifications, setNotifications] = useState([]);
  const [accountDeleted, setAccountDeleted] = useState(false);

  useEffect(() => {
    if (session?.user?.id) {
      fetch("/api/me").then(res => {
        if (!res.ok) setAccountDeleted(true);
      });
    }
  }, [session?.user?.id]);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status]);

  useEffect(() => {
    fetch("/api/notifications")
      .then(res => res.json())
      .then(data => setNotifications(data));
  }, []);

  useEffect(() => {
    fetch("/api/dashboard/stats")
      .then(res => res.json())
      .then(data => setStats(data));
  }, []);

  const username = session?.user?.name;

  if (status === "loading") {
    return (
      <div className="h-screen flex items-center justify-center text-xl text-blue-600">
        Loading your dashboard...
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-white via-blue-50 to-blue-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-6 sm:p-10">
      {/* Top Bar */}
      <header className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-blue-700 dark:text-blue-400">🚀 Dashboard</h1>
        <LogoutButton />
      </header>

      {/* Account deleted warning */}
      {accountDeleted && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded mb-6 shadow">
          ❗️ Your account has been removed by the admin. If you believe this was a mistake, contact:
          <a href="mailto:support@devconnect.com" className="ml-1 underline text-blue-800">
            support@devconnect.com
          </a>
        </div>
      )}

      {!accountDeleted && (
        <>
          {/* Stats */}
          <section className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
            <StatCard title="Projects" value={stats.totalProjects} color="blue" icon="📁" />
            <StatCard title="Blogs" value={stats.totalBlogs} color="green" icon="📝" />
            <StatCard title="Followers" value={stats.totalFollowers} color="purple" icon="👥" />
          </section>

          {/* Notifications */}
          <section className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-10">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2 text-gray-700 dark:text-white">
              🔔 Notifications
              {notifications.length > 0 && (
                <span className="bg-red-600 text-white text-sm px-2 py-0.5 rounded-full">
                  {notifications.length}
                </span>
              )}
            </h2>

            {notifications.length === 0 ? (
              <p className="text-sm text-gray-500">No new notifications</p>
            ) : (
              <ul className="space-y-3">
                {notifications.map((note, idx) => (
                  <li
                    key={idx}
                    onClick={async () => {
                      try {
                        if (note.sender) {
                          await fetch("/api/notifications/read", {
                            method: "PATCH",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({ senderId: note.sender._id }),
                          });
                          router.push(`/chat?user=${note.sender._id}`);
                        } else {
                          await fetch("/api/notifications/read", {
                            method: "PATCH",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({ notificationId: note._id }),
                          });
                        }
                        setNotifications(prev => prev.filter(n =>
                          note.sender ? n.sender?._id !== note.sender._id : n._id !== note._id
                        ));
                      } catch (err) {
                        console.error("Failed to mark notification as read:", err);
                      }
                    }}
                    className={`cursor-pointer transition p-4 rounded-lg border-l-4 ${note.sender
                        ? "bg-blue-100 dark:bg-blue-900 border-blue-500 text-blue-800 dark:text-blue-100"
                        : "bg-yellow-100 dark:bg-yellow-800 border-yellow-500 text-yellow-900 dark:text-yellow-100"
                      } hover:scale-[1.01] hover:shadow`}
                  >
                    {note.sender ? (
                      <>
                        💬 <strong>{note.sender.name}</strong> sent you a message.
                      </>
                    ) : (
                      <>
                        ⚠️ <strong>System:</strong> {note.message}
                      </>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </section>

          {/* User Info */}
          <section className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-8">
            <h2 className="text-lg font-semibold mb-4 text-gray-700 dark:text-white">👤 Your Info</h2>
            <p><strong>Name:</strong> {session?.user?.name}</p>
            <p><strong>Email:</strong> {session?.user?.email}</p>
            {session?.user?.image && (
              <img
                src={session.user.image}
                alt="User Avatar"
                className="w-20 h-20 rounded-full mt-4 border-4 border-blue-500 shadow"
              />
            )}
          </section>

          {/* Buttons */}
          <div className="flex flex-wrap gap-4">
            <ActionButton href={`/profile/${username}`} label="Public Profile" color="blue" />
            <ActionButton href="/chat" label="Go to Chat" color="indigo" />
            <ActionButton href="/users" label="All Users" color="cyan" />
            <ActionButton href="/blogs/add" label="+ Add Blog" color="green" />
            <ActionButton href="/projects/add" label="+ Add Project" color="purple" />
            <ActionButton href="/profile/edit" label="Edit Profile" color="gray" />
          </div>
        </>
      )}
    </main>
  );
}

// Components
function StatCard({ title, value, color, icon }) {
  const colorMap = {
    blue: "text-blue-600 bg-blue-100",
    green: "text-green-600 bg-green-100",
    purple: "text-purple-600 bg-purple-100",
  };
  return (
    <div className={`p-6 rounded-xl shadow-md ${colorMap[color]} dark:bg-opacity-20`}>
      <div className="text-4xl">{icon}</div>
      <h3 className="text-xl font-bold">{value}</h3>
      <p className="text-sm text-gray-700 dark:text-gray-300">{title}</p>
    </div>
  );
}

function ActionButton({ href, label, color }) {
  const colorMap = {
    blue: "bg-blue-600 hover:bg-blue-700",
    indigo: "bg-indigo-600 hover:bg-indigo-700",
    cyan: "bg-cyan-600 hover:bg-cyan-700",
    green: "bg-green-600 hover:bg-green-700",
    purple: "bg-purple-600 hover:bg-purple-700",
    gray: "bg-gray-500 hover:bg-gray-600",
  };
  return (
    <Link href={href}>
      <button
        className={`${colorMap[color]} text-white px-5 py-2 rounded-lg shadow transition duration-200`}
      >
        {label}
      </button>
    </Link>
  );
}
