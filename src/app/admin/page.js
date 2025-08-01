import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import Blog from "@/models/Blog";
import LogoutButton from "@/components/LogoutButton";
import Project from "@/models/Project";
import AdminPageClient from "./AdminPageClient";
import { redirect } from "next/navigation";

export default async function AdminPage() {
  await connectDB();
  const session = await getServerSession(authOptions);

  // ✅ If session doesn't exist, redirect to login
  if (!session || !session.user?.id) {
    redirect("/login");
  }

  const currentUser = await User.findById(session?.user?.id);

  if (!currentUser || currentUser.role !== "admin") {
    redirect("/login");
  }

  const users = await User.find({ role: { $ne: "admin" } }).lean();
  const blogs = await Blog.find().populate("creator").lean();
  const projects = await Project.find().populate("creator").lean();

  const plainUsers = JSON.parse(JSON.stringify(users));
  const plainBlogs = JSON.parse(JSON.stringify(blogs));
  const plainProjects = JSON.parse(JSON.stringify(projects));

  return (
    <main className="min-h-screen p-6 bg-gray-50 dark:bg-gray-900 relative">
      <div className="absolute top-4 right-4">
        <LogoutButton />
      </div>

      <AdminPageClient
        users={plainUsers}
        blogs={plainBlogs}
        projects={plainProjects}
      />
    </main>
  );
}
