"use client";

import { useEffect, useState, useRef } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import ProjectCard from "./ProjectCard";
import Image from "next/image";
import BlogCard from "./BlogCard";
import { useSearchParams, useRouter } from "next/navigation";

const capitalize = (str) =>
  str ? str.charAt(0).toUpperCase() + str.slice(1).toLowerCase() : "";

export default function ProfileTabs({ userId }) {
  const tabs = ["Projects", "Blogs", "Followers", "Following"];
  const searchParams = useSearchParams();
  const router = useRouter();
  const { data: session } = useSession();

  const initialTab = searchParams.get("tab");
  const [activeTab, setActiveTab] = useState(
    tabs.includes(capitalize(initialTab)) ? capitalize(initialTab) : "Projects"
  );
  const tabRef = useRef();

  useEffect(() => {
    setTimeout(() => {
      tabRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  }, [activeTab]);

  const [projects, setProjects] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);

  const handleTabClick = (tab) => {
    setActiveTab(tab);
    router.push(`?tab=${tab.toLowerCase()}`, { scroll: false, shallow: true });
  };

  useEffect(() => {
    const fetchProjects = async () => {
      if (activeTab !== "Projects") return;
      const res = await fetch(`/api/projects/projects-api?creator=${userId}`);
      if (!res.ok) return;
      const data = await res.json();
      setProjects(data);
    };
    fetchProjects();
  }, [activeTab, userId]);

  useEffect(() => {
    const fetchBlogs = async () => {
      if (activeTab !== "Blogs") return;
      const res = await fetch(`/api/blogs?creator=${userId}`);
      if (!res.ok) return;
      const data = await res.json();
      setBlogs(data);
    };
    fetchBlogs();
  }, [activeTab, userId]);

  useEffect(() => {
    const fetchFollowers = async () => {
      if (activeTab !== "Followers") return;
      const res = await fetch(`/api/users/${userId}/followers`);
      if (res.ok) setFollowers(await res.json());
    };
    fetchFollowers();
  }, [activeTab, userId]);

  useEffect(() => {
    const fetchFollowing = async () => {
      if (activeTab !== "Following") return;
      const res = await fetch(`/api/users/${userId}/following`);
      if (res.ok) setFollowing(await res.json());
    };
    fetchFollowing();
  }, [activeTab, userId]);

  return (
    <div ref={tabRef} className="animate-fadeIn">
      <div className="max-w-2xl mx-auto mt-8 transition-all duration-500">
        <div className="flex justify-around border-b pb-2">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => handleTabClick(tab)}
              className={`py-2 px-4 transition-all duration-200 rounded-t-md ${activeTab === tab
                  ? "border-b-2 border-blue-600 font-semibold text-blue-600 bg-blue-50 dark:bg-gray-700"
                  : "text-gray-600 hover:text-blue-600"
                }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="mt-6 text-gray-700 dark:text-gray-300 transition-all">
          {activeTab === "Projects" && (
            <>
              {session?.user?.id === userId && (
                <div className="flex justify-end mb-4">
                  <Link href="/projects/add">
                    <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded shadow transition">
                      + Add Project
                    </button>
                  </Link>
                </div>
              )}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {projects.length > 0 ? (
                  projects.map((project) => (
                    <div
                      key={project._id}
                      className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow hover:shadow-lg transition-transform hover:scale-[1.02] border border-gray-200 dark:border-gray-700"
                    >
                      <ProjectCard project={project} />
                    </div>
                  ))
                ) : (
                  <p className="text-center text-gray-400">No projects found.</p>
                )}
              </div>
            </>
          )}

          {activeTab === "Blogs" && (
            <>
              {session?.user?.id === userId && (
                <div className="flex justify-end mb-4">
                  <Link href="/blogs/add">
                    <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded shadow transition">
                      + Add Blog
                    </button>
                  </Link>
                </div>
              )}
              <div className="grid grid-cols-1 gap-6">
                {blogs.length > 0 ? (
                  blogs.map((blog) => (
                    <div
                      key={blog._id}
                      className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow hover:shadow-lg transition-transform hover:scale-[1.02] border border-gray-200 dark:border-gray-700"
                    >
                      <BlogCard blog={blog} />
                    </div>
                  ))
                ) : (
                  <p className="text-center text-gray-400">No blogs found.</p>
                )}
              </div>
            </>
          )}

          {activeTab === "Followers" && (
            <div className="space-y-4">
              {followers.length > 0 ? (
                followers.map((follower) => (
                  <div
                    key={follower._id}
                    className="flex items-center justify-between bg-gray-100 dark:bg-gray-700 p-3 rounded shadow"
                  >
                    <div className="flex items-center gap-3">
                      <Image
                        src={follower.image || "/default.png"}
                        width={40}
                        height={40}
                        alt={follower.name}
                        className="rounded-full"
                      />
                      <span className="font-medium">{follower.name}</span>
                    </div>
                    <Link
                      href={`/profile/${follower.name}`}
                      className="text-blue-600 hover:underline"
                    >
                      View Profile
                    </Link>
                  </div>
                ))
              ) : (
                <p className="text-center text-gray-500">No followers yet.</p>
              )}
            </div>
          )}

          {activeTab === "Following" && (
            <div className="space-y-4">
              {following.length > 0 ? (
                following.map((user) => (
                  <div
                    key={user._id}
                    className="flex items-center justify-between bg-gray-100 dark:bg-gray-700 p-3 rounded shadow"
                  >
                    <div className="flex items-center gap-3">
                      <Image
                        src={user.image || "/default.png"}
                        width={40}
                        height={40}
                        alt={user.name}
                        className="rounded-full"
                      />
                      <span className="font-medium">{user.name}</span>
                    </div>
                    <Link
                      href={`/profile/${user.name}`}
                      className="text-blue-600 hover:underline"
                    >
                      View Profile
                    </Link>
                  </div>
                ))
              ) : (
                <p className="text-center text-gray-500">
                  Not following anyone.
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
