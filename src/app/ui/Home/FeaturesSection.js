"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function FeaturesSection() {
  const { data: session } = useSession();
  const router = useRouter();

  const handleClick = (path) => {
    if (!session?.user) {
      alert("Please register or login first to access this feature.");
      router.push("/register");
    } else {
      router.push(path);
    }
  };

  return (
    <section className="py-16 px-6 bg-gray-100 dark:bg-gray-800">
      {/* Section heading */}
      <h3 className="text-3xl font-bold text-center mb-12 text-gray-900 dark:text-white">
        Key Features
      </h3>

      {/* Responsive grid for feature cards */}
      <div className="grid gap-8 md:grid-cols-3 max-w-6xl mx-auto">
        {/* Feature 1: Developer Profiles */}
        <div
          onClick={() =>
            handleClick(`/profile/${session?.user?.name || ""}`)
          }
          className="cursor-pointer bg-white dark:bg-gray-900 p-6 rounded-lg shadow hover:scale-105 transition-transform border border-transparent hover:border-blue-500"
        >
          <h4 className="text-xl font-semibold mb-2 text-blue-600">
            Developer Profiles
          </h4>
          <p className="text-gray-700 dark:text-gray-300">
            Create a rich profile to highlight your skills, links, and projects.
          </p>
        </div>

        {/* Feature 2: Project Showcasing */}
        <div
          onClick={() =>
            handleClick(`/profile/${session?.user?.name || ""}?tab=projects`)
          }
          className="cursor-pointer bg-white dark:bg-gray-900 p-6 rounded-lg shadow hover:scale-105 transition-transform border border-transparent hover:border-green-500"
        >
          <h4 className="text-xl font-semibold mb-2 text-green-600">
            Project Showcasing
          </h4>
          <p className="text-gray-700 dark:text-gray-300">
            Upload, categorize, and share your projects with others.
          </p>
        </div>

        {/* Feature 3: Blogs */}
        <div
          onClick={() =>
            handleClick(`/profile/${session?.user?.name || ""}?tab=blogs`)
          }
          className="cursor-pointer bg-white dark:bg-gray-900 p-6 rounded-lg shadow hover:scale-105 transition-transform border border-transparent hover:border-purple-500"
        >
          <h4 className="text-xl font-semibold mb-2 text-purple-600">
            Blog Platform
          </h4>
          <p className="text-gray-700 dark:text-gray-300">
            Write and publish technical blogs in markdown format.
          </p>
        </div>
      </div>
    </section>
  );
}
