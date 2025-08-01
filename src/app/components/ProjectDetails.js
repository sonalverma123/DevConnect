// components/ProjectDetails.js
"use client";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import React, { useState, useEffect } from "react";

import { Pencil } from "lucide-react"; 

export default function ProjectDetails({ project, isOwner }) {
  const router = useRouter();

  const { data: session } = useSession();
  const userId = session?.user?.id;
  const [likesCount, setLikesCount] = useState(project.likes?.length || 0);
  const [comments, setComments] = useState(project.comments || []);
  const [commentText, setCommentText] = useState("");
  const [hasLiked, setHasLiked] = useState(
    project.likes?.includes(userId) || false
  );

  const handleLike = async () => {
    if (!userId) return alert("Please log in to like.");

    const res = await fetch(`/api/projects/${project._id}/like`, {
      method: "POST",
    });

    if (res.ok) {
      const data = await res.json();
      setLikesCount(data.likes);
      setHasLiked(!hasLiked);
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    const res = await fetch(`/api/projects/${project._id}/comment`, {
      method: "POST",
      body: JSON.stringify({ text: commentText }),
      headers: { "Content-Type": "application/json" },
    });

    if (res.ok) {
      setComments([...comments, { text: commentText, user: { name: session.user.name } }]);
      setCommentText("");
    }
  };

  return (

    <div className="bg-white p-6 rounded-xl shadow-md relative">

      {isOwner && (
        <button
          onClick={() => router.push(`/projects/edit/${project._id}`)}
          title="Edit Project"
          className="absolute top-4 right-4 text-blue-600 hover:text-blue-800 transition"
        >
          <Pencil className="w-5 h-5" />
        </button>
      )}


      {isOwner && (
        <div className="mt-6 text-right">
          <button
            onClick={() => router.push(`/profile/${session.user.name}`)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
          >
            Go to Your Profile
          </button>
        </div>
      )}

      {/* Project Thumbnail */}
      <img
        src={project.thumbnail} // Project thumbnail image URL
        alt="Project Thumbnail" // Alternative text for accessibility
        className="w-full h-64 object-cover rounded-lg mb-6" // Tailwind classes for layout
      />


      {/* Project Title */}
      <h1 className="text-3xl font-bold mb-4">{project.title}</h1>

      {/* Project Description */}
      <p className="text-gray-700 mb-4">{project.description}</p>

      {/* Tags list */}
      <div className="flex gap-2 mb-4 flex-wrap">
        {project.tags.map((tag) => (
          <span
            key={tag} // Unique key for each tag
            className="text-sm px-3 py-1 bg-blue-100 text-blue-600 rounded-full" // Tailwind styling
          >
            #{tag}
          </span>
        ))}
      </div>

      {/* GitHub and Live Site URLs */}
      <div className="flex gap-4 mb-6">
        {/* GitHub URL link */}
        {project.githubUrl && (
          <Link
            href={project.githubUrl} // Link to GitHub
            target="_blank" // Open in new tab
            className="text-blue-600 underline"
          >
            GitHub →
          </Link>
        )}

        {/* Live Site URL link */}
        {project.liveUrl && (
          <Link
            href={project.liveUrl} // Link to live site
            target="_blank"
            className="text-green-600 underline"
          >
            Live Site →
          </Link>
        )}
      </div>

      {/* Project Creator info */}
      {project.creator && (
        <div className="flex items-center gap-4 mt-8 border-t pt-4">
          <Image
            src={project.creator.image || "/default.png"}
            alt={project.creator.name}
            width={40}
            height={40}
            className="rounded-full"
          />
          <div>
            <p className="font-semibold">{project.creator.name}</p>
            <p className="text-sm text-gray-500">{project.creator.email}</p>
          </div>
        </div>
      )}
      {/* --- Likes --- */}
      <div className="flex items-center gap-4 mt-6">
        <button
          onClick={handleLike}
          className={`px-4 py-2 rounded text-white ${hasLiked ? "bg-red-500" : "bg-blue-500"
            }`}
        >
          {hasLiked ? "Unlike" : "Like"}
        </button>
        <span>{likesCount} {likesCount === 1 ? "like" : "likes"}</span>
      </div>

      {/* --- Comments --- */}
      <div className="mt-8 space-y-4">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Comments</h2>

        {/* Comments list */}
        {comments.length > 0 ? (
          comments.map((c, idx) => (
            <div
              key={idx}
              className="bg-gray-100 dark:bg-gray-700 p-3 rounded text-sm flex justify-between items-start"
            >
              <div>
                <strong className="text-blue-600">{c.user?.name || "Anonymous"}</strong>
                <p>{c.text}</p>
                <p className="text-xs text-gray-500">
                  {new Date(c.createdAt).toLocaleString()}
                </p>
              </div>

              {/* Delete Button (for comment author or project owner) */}
              {(c.user?._id === userId || isOwner) && (
                <button
                  onClick={async () => {
                    const res = await fetch(`/api/projects/${project._id}/comment/${c._id}`, {
                      method: "DELETE",
                    });

                    if (res.ok) {
                      setComments(comments.filter((_, i) => i !== idx));
                    }
                  }}
                  className="text-red-500 text-sm hover:underline ml-4"
                >
                  Delete
                </button>
              )}
            </div>
          ))
        ) : (
          <p className="text-gray-500">No comments yet.</p>
        )}


        {/* Comment form */}
        {session ? (
          <form onSubmit={handleCommentSubmit} className="flex gap-2 mt-4">
            <input
              type="text"
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Write a comment..."
              className="flex-1 px-3 py-2 border rounded"
            />
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded"
            >
              Post
            </button>
          </form>
        ) : (
          <p className="text-gray-500">Log in to comment.</p>
        )}
      </div>
    </div>
  );
}
