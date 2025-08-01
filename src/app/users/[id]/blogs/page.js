// app/users/[userId]/blogs/page.jsx

import { connectDB } from "@/lib/db";
import Blog from "@/models/Blog";
import User from "@/models/User";
import Link from "next/link";

export default async function UserBlogsPage({ params }) {
  await connectDB();

  const userId = params.id;

  const user = await User.findById(userId).lean();
  if (!user) {
    return <div className="text-red-500">User not found</div>;
  }

  const blogs = await Blog.find({ creator: userId })
    .sort({ createdAt: -1 })
    .populate("creator")
    .lean();

  return (
    <main className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">
        Blogs by {user.name || user.email}
      </h1>

      {blogs.length === 0 ? (
        <p className="text-gray-500">No blogs found.</p>
      ) : (
        <div className="space-y-4">
          {blogs.map((blog) => (
            <div
              key={blog._id}
              className="bg-white dark:bg-gray-800 p-4 rounded shadow"
            >
              <Link href={`/blogs/${blog._id}`}>
                <h2 className="text-xl font-semibold text-blue-600 hover:underline">
                  {blog.title}
                </h2>
              </Link>
              <p className="text-sm text-gray-500">
                {new Date(blog.createdAt).toLocaleDateString()}
              </p>
              <p className="mt-2 text-gray-700 dark:text-gray-200 line-clamp-3">
                {blog.content.slice(0, 200)}...
              </p>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
