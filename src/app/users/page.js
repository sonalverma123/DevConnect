// app/all-users/page.js
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import AllUsersList from "@/components/AllUsersList";
import Navbar from "@/components/Navbar";

export default async function AllUsersPage() {
  await connectDB();
  const session = await getServerSession(authOptions);
  const currentUserId = session?.user?.id;

  const usersRaw = await User.find({ _id: { $ne: currentUserId }, role: { $ne: "admin" }, })
    .select("name email image followers")
    .lean();

  const users = usersRaw.map((user) => ({
    ...user,
    _id: user._id.toString(),
    followers: user.followers?.map((f) => f.toString()) || [],
  }));

  return (
    <>
      <Navbar />
      <main className="min-h-screen p-8 bg-gray-50 dark:bg-gray-900">
        <h1 className="text-3xl font-bold text-blue-600 mb-6">All Users</h1>
        <AllUsersList users={users} />
      </main>
    </>
  );
}
