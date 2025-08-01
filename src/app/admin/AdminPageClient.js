"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function AdminPageClient({ users, blogs, projects }) {
  const [userList, setUserList] = useState([]);
  const [blogList, setBlogList] = useState([]);
  const [projectList, setProjectList] = useState([]);
  const [status, setStatus] = useState("");

  useEffect(() => {
    setUserList(users);
    setBlogList(blogs);
    setProjectList(projects);
  }, [users, blogs, projects]);

  async function handleDeleteUser(userId) {
    const confirmed = window.confirm("Are you sure you want to delete this user?");
    if (!confirmed) return;

    try {
      const formData = new FormData();
      formData.append("id", userId);

      const res = await fetch("/api/admin/delete-user", {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        setUserList((prev) => prev.filter((u) => u._id !== userId));
        setStatus("✅ User deleted successfully");
      } else {
        setStatus("❌ Failed to delete user");
      }
    } catch (err) {
      console.error("Error deleting user:", err);
      setStatus("❌ Something went wrong");
    } finally {
      setTimeout(() => setStatus(""), 3000);
    }
  }

  async function handleDeleteBlog(blogId) {
    const confirmed = window.confirm("Are you sure you want to delete this blog?");
    if (!confirmed) return;

    try {
      const formData = new FormData();
      formData.append("id", blogId);

      const res = await fetch("/api/admin/delete-blog", {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        setBlogList((prev) => prev.filter((b) => b._id !== blogId));
        setStatus("✅ Blog deleted successfully");
      } else {
        setStatus("❌ Failed to delete blog");
      }
    } catch (err) {
      console.error("Error deleting blog:", err);
      setStatus("❌ Something went wrong");
    } finally {
      setTimeout(() => setStatus(""), 3000);
    }
  }

  async function handleDeleteProject(projectId) {
    const confirmed = window.confirm("Are you sure you want to delete this project?");
    if (!confirmed) return;

    try {
      const formData = new FormData();
      formData.append("id", projectId);

      const res = await fetch("/api/admin/delete-project", {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        setProjectList((prev) => prev.filter((p) => p._id !== projectId));
        setStatus("✅ Project deleted successfully");
      } else {
        setStatus("❌ Failed to delete project");
      }
    } catch (err) {
      console.error("Error deleting project:", err);
      setStatus("❌ Something went wrong");
    } finally {
      setTimeout(() => setStatus(""), 3000);
    }
  }

  return (
    <main className="max-w-7xl mx-auto p-8">
      <h1 className="text-3xl font-bold text-blue-600 mb-4">Admin Panel</h1>
      {status && <div className="mb-4 text-green-600 font-semibold">{status}</div>}

      {/* STATS */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="bg-gray-100 p-4 rounded shadow text-center">
          <h2 className="text-xl font-semibold">Total Users</h2>
          <p className="text-2xl">{userList.length}</p>
        </div>
        <div className="bg-gray-100 p-4 rounded shadow text-center">
          <h2 className="text-xl font-semibold">Total Blogs</h2>
          <p className="text-2xl">{blogList.length}</p>
        </div>
        <div className="bg-gray-100 p-4 rounded shadow text-center">
          <h2 className="text-xl font-semibold">Total Projects</h2>
          <p className="text-2xl">{projectList.length}</p>
        </div>
      </div>

      {/* USERS TABLE */}
      <section className="mb-10">
        <h2 className="text-2xl font-bold mb-2">Users</h2>
        <table className="w-full table-auto border">
          <thead>
            <tr className="bg-gray-200">
              <th className="p-2">Name</th>
              <th>Email</th>
              <th>Admin</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {userList.map((user) => (
              <tr key={user._id} className="border-t">
                <td className="p-2">{user.name}</td>
                <td>{user.email}</td>
                <td>{user.isAdmin ? "Yes" : "No"}</td>
                <td>
                  <button
                    className="text-red-500 hover:underline"
                    onClick={() => handleDeleteUser(user._id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {/* BLOG MODERATION */}
      <section className="mb-10">
        <h2 className="text-2xl font-bold mb-2">Blogs</h2>
        <ul>
          {blogList.map((blog) => (
            <li key={blog._id} className="flex justify-between items-center py-2 border-b">
              <div>
                <Link href={`/blogs/${blog._id}`} className="text-blue-600 hover:underline">
                  {blog.title}
                </Link>
                <span className="ml-2 text-sm text-gray-500">by {blog.creator.name}</span>
              </div>
              <button
                className="text-red-500 hover:underline"
                onClick={() => handleDeleteBlog(blog._id)}
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      </section>

      {/* PROJECT MODERATION */}
      <section>
        <h2 className="text-2xl font-bold mb-2">Projects</h2>
        <ul>
          {projectList.map((project) => (
            <li key={project._id} className="flex justify-between items-center py-2 border-b">
              <div>
                <Link href={`/projects/${project._id}`} className="text-blue-600 hover:underline">
                  {project.title}
                </Link>
                <span className="ml-2 text-sm text-gray-500">by {project.creator.name}</span>
              </div>
              <button
                className="text-red-500 hover:underline"
                onClick={() => handleDeleteProject(project._id)}
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
