"use client";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useState } from "react";
import Navbar from "@/components/Navbar";

export default function AddBlog() {
  const { data: session } = useSession();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch("/api/blogs", {
      method: "POST",
      body: JSON.stringify({ title, content, creator: session?.user?.id, }),
      headers: { "Content-Type": "application/json" },
    });

    if (res.ok) {
      // ✅ Redirect to profile's Blogs tab
      router.push(`/profile/${encodeURIComponent(session.user.name)}?tab=blogs`);

    }
  };

  return (
    <>
      <Navbar />

      <div className="max-w-3xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-4">Create New Blog</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Blog Title"
            className="w-full border p-2 rounded"
            required
          />
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write markdown content here..."
            className="w-full border p-2 rounded h-60"
            required
          />
          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
            Publish
          </button>
        </form>
      </div>
    </>
  );
}
