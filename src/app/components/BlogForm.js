"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function BlogForm({ initialData = null }) {
  const router = useRouter();

  const [title, setTitle] = useState(initialData?.title || "");
  const [content, setContent] = useState(initialData?.content || "");
  const [loading, setLoading] = useState(false);
  const isEditing = !!initialData;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const res = await fetch(
      isEditing ? `/api/blogs/${initialData._id}` : "/api/blogs",
      {
        method: isEditing ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, content }),
      }
    );

    if (res.ok) {
      const blog = await res.json();
      router.push(`/blogs/${blog._id}`);
    } else {
      alert("Something went wrong.");
    }

    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        type="text"
        placeholder="Blog Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full border border-gray-300 dark:border-gray-700 p-2 rounded"
        required
      />

      <textarea
        placeholder="Blog content (Markdown supported)"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="w-full border border-gray-300 dark:border-gray-700 p-2 rounded h-60"
        required
      />

      <button
        type="submit"
        disabled={loading}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
      >
        {isEditing ? "Update Blog" : "Publish Blog"}
      </button>
    </form>
  );
}
