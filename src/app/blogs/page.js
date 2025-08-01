"use client";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function BlogFeed() {
  const [blogs, setBlogs] = useState([]);

  useEffect(() => {
    fetch("/api/blogs")
      .then((res) => res.json())
      .then(setBlogs);
  }, []);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">📝 Latest Blogs</h1>
      <Link href="/blogs/add" className="text-blue-600 underline mb-4 block">
        ➕ Write a Blog
      </Link>
      {blogs.map((blog) => (
        <div key={blog._id} className="bg-white p-4 rounded shadow mb-4">
          <Link href={`/blogs/${blog._id}`}>
            <h2 className="text-xl font-semibold">{blog.title}</h2>
          </Link>
          <p className="text-sm text-gray-500">By {blog.creator?.name}</p>
        </div>
      ))}
    </div>
  );
}
