import { connectDB } from "@/lib/db";
import User from "@/models/User";
import FollowButton from "@/components/FollowButton";
import ProfileTabs from "@/components/ProfileTabs";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import Link from "next/link";

export default async function ProfilePage({ params }) {
  const username = decodeURIComponent(params.username);

  await connectDB();
  const user = await User.findOne({ name: username }).lean();

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-600">
        User not found
      </div>
    );
  }

  const session = await getServerSession(authOptions);
  const currentUserId = session?.user?.id;

  return (
    <main className="min-h-screen bg-gradient-to-b from-white to-blue-50 dark:from-gray-900 dark:to-gray-950 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Profile Card */}
        <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg flex flex-col sm:flex-row gap-6 items-center sm:items-start">
          {/* Avatar */}
          <img
            src={user.image || "/default-avatar.png"}
            alt="User Avatar"
            className="w-32 h-32 rounded-full object-cover border-4 border-blue-500 shadow-md"
          />

          {/* Info */}
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              {user.name}
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">{user.email}</p>

            {/* Optional Fields */}
            <div className="mt-4 space-y-1 text-gray-800 dark:text-gray-200 text-sm">
              {user.bio && (
                <p>
                  <strong className="text-gray-600 dark:text-gray-400">Bio:</strong> {user.bio}
                </p>
              )}
              {user.location && (
                <p>
                  <strong className="text-gray-600 dark:text-gray-400">Location:</strong> {user.location}
                </p>
              )}
              {user.github && (
                <p>
                  <strong className="text-gray-600 dark:text-gray-400">GitHub:</strong>{" "}
                  <a
                    href={user.github}
                    target="_blank"
                    className="text-blue-600 hover:underline"
                  >
                    {user.github}
                  </a>
                </p>
              )}
              {user.linkedin && (
                <p>
                  <strong className="text-gray-600 dark:text-gray-400">LinkedIn:</strong>{" "}
                  <a
                    href={user.linkedin}
                    target="_blank"
                    className="text-blue-600 hover:underline"
                  >
                    {user.linkedin}
                  </a>
                </p>
              )}
            </div>

            {/* Action Buttons */}
            <div className="mt-6 flex flex-wrap gap-3">
              {currentUserId === user._id.toString() ? (
                <>
                  <Link href="/profile/edit">
                    <button className="bg-gray-200 hover:bg-gray-300 text-black px-4 py-2 rounded shadow-sm">
                      ✏️ Edit Profile
                    </button>
                  </Link>
                  <Link href="/dashboard">
                    <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded shadow-sm">
                      📊 Go to Dashboard
                    </button>
                  </Link>
                </>
              ) : (
                <FollowButton
                  targetUserId={user._id.toString()}
                  targetFollowers={user.followers.map((f) => f.toString())}
                />
              )}
            </div>
          </div>
        </div>

        {/* Profile Tabs (Projects, Blogs, Followers, etc.) */}
        <div className="mt-10">
          <ProfileTabs userId={user._id.toString()} />
        </div>
      </div>
    </main>
  );
}
