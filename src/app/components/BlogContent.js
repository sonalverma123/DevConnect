"use client";

import Image from "next/image";
import { Pencil } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { formatDistanceToNow } from "date-fns";

export default function BlogContent({ blog, isOwner, currentUserId }) {
  const [likes, setLikes] = useState(blog.likes || []);
  const router = useRouter();

  const [comments, setComments] = useState(blog.comments || []);
  const [commentText, setCommentText] = useState("");

  const hasLiked = currentUserId && likes.includes(currentUserId);


  const toggleLike = async () => {
    const res = await fetch(`/api/blogs/${blog._id}/like`, { method: "POST" });
    const data = await res.json();
    if (data.success) {
      setLikes(data.likes); // Correctly update the state
    } else {
      console.error("Like failed:", data.message);
    }
  };

  const addComment = async () => {
    if (!commentText.trim()) return;
    const res = await fetch(`/api/blogs/${blog._id}/comment`, {
      method: "POST",
      body: JSON.stringify({ text: commentText }),
    });
    const data = await res.json();
    if (data.success) {
      setComments([...comments, data.comment]);
      console.log("New comment:", data.comment);

      setCommentText("");
    }
  };

  const deleteComment = async (commentId) => {
    const res = await fetch(`/api/blogs/${blog._id}/comment/${commentId}`, {
      method: "DELETE",
    });
    const data = await res.json();
    if (data.success) {
      setComments(comments.filter((c) => c._id !== commentId));
    }
  };

  return (
    <article className="relative bg-white dark:bg-gray-900 p-6 rounded-xl shadow">

      {/* ✏️ Edit Button (visible only to owner) */}
      {isOwner && (
        <button
          onClick={() => router.push(`/blogs/edit/${blog._id}`)}
          className="absolute top-4 right-4 bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-full"
          title="Edit Blog"
        >
          <Pencil className="w-4 h-4" />
        </button>
      )}

      {/* Title */}
      <h1 className="text-3xl font-bold mb-2">{blog.title}</h1>

      {/* Author Info */}
      <div className="flex items-center gap-3 mb-4">
        <Image
          src={blog.creator.image || "/default-avatar.png"}
          alt={blog.creator.name}
          width={40}
          height={40}
          className="rounded-full"
        />
        <Link
          href={`/profile/${blog.creator.name}`}
          className="text-blue-600 hover:underline"
        >
          {blog.creator.name}
        </Link>
      </div>

      {/* Markdown Content */}
      <div className="prose dark:prose-invert max-w-none">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{blog.content}</ReactMarkdown>
      </div>

      {currentUserId && (
        <button
          onClick={toggleLike}
          className={`mt-6 px-4 py-2 rounded ${hasLiked ? "bg-red-500 text-white" : "bg-gray-200 dark:bg-gray-700"
            }`}
        >
          {hasLiked ? "❤️ Liked" : "🤍 Like"} ({likes.length})
        </button>
      )}

      {/* Comments */}
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-2">Comments ({comments.length})</h2>

        {/* Add comment */}
        {currentUserId && (
          <div className="flex gap-2 mb-4">
            <input
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Add a comment..."
              className="flex-1 px-3 py-2 border rounded dark:bg-gray-800"
            />
            <button onClick={addComment} className="px-4 py-2 bg-blue-600 text-white rounded">
              Post
            </button>
          </div>
        )}

        {/* Show comments */}
        <div className="space-y-4">
          {comments.map((comment) => (
            <div
              key={comment._id}
              className="p-3 border rounded dark:border-gray-700 dark:bg-gray-800"
            >
              <div className="flex justify-between items-center">
                <div className="font-medium">{comment.user.name}</div>
                <div className="text-sm text-gray-500">
                  {formatDistanceToNow(new Date(comment.createdAt))} ago
                </div>
              </div>
              <p className="mt-1">{comment.text}</p>
              {(comment.user._id === currentUserId || isOwner) && (
                <button
                  onClick={() => deleteComment(comment._id)}
                  className="text-red-500 text-sm mt-1"
                >
                  Delete
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </article>
  );
}
