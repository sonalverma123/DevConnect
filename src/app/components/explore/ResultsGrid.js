// components/explore/ResultsGrid.jsx
import Link from "next/link";
import Image from "next/image";

export default function ResultsGrid({ results }) {
  const { users, projects, blogs } = results;

  return (
    <div className="space-y-12">
      {/* USERS */}
      <section>
        <h2 className="text-2xl font-bold mb-4 text-blue-600">👤 Developers</h2>
        {users.length === 0 ? (
          <p className="text-gray-500 italic">No users found.</p>
        ) : (
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
            {users.map((user) => (
              <Link
                key={user._id}
                href={`/profile/${user.name}`}
                className="bg-white dark:bg-gray-800 p-5 rounded-xl shadow-md hover:shadow-xl transition duration-300 transform hover:-translate-y-1 group"
              >
                {user.image && (
                  <div className="flex justify-center">
                    <Image
                      src={user.image}
                      alt={user.name}
                      width={60}
                      height={60}
                      className="rounded-full mb-3 border-2 border-blue-500"
                    />
                  </div>
                )}
                <h3 className="text-lg font-semibold text-center group-hover:text-blue-600">
                  {user.name}
                </h3>
                <p className="text-sm text-center text-gray-500">{user.email}</p>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* PROJECTS */}
      <section>
        <h2 className="text-2xl font-bold mb-4 text-green-600">🚀 Projects</h2>
        {projects.length === 0 ? (
          <p className="text-gray-500 italic">No projects found.</p>
        ) : (
          <div className="grid sm:grid-cols-2 gap-6">
            {projects.map((project) => (
              <Link
                key={project._id}
                href={`/projects/${project._id}`}
                className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md hover:shadow-xl transition duration-300 transform hover:-translate-y-1 group"
              >
                <h3 className="text-lg font-bold group-hover:text-green-600">{project.title}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                  {project.description.slice(0, 100)}...
                </p>
                <p className="text-xs mt-3 text-purple-600 italic">
                  Tags: {project.tags.join(", ")}
                </p>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* BLOGS */}
      <section>
        <h2 className="text-2xl font-bold mb-4 text-purple-600">📝 Blogs</h2>
        {blogs.length === 0 ? (
          <p className="text-gray-500 italic">No blogs found.</p>
        ) : (
          <div className="grid sm:grid-cols-2 gap-6">
            {blogs.map((blog) => (
              <Link
                key={blog._id}
                href={`/blogs/${blog._id}`}
                className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md hover:shadow-xl transition duration-300 transform hover:-translate-y-1 group"
              >
                <h3 className="text-lg font-bold group-hover:text-purple-600">{blog.title}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                  {blog.content.slice(0, 100)}...
                </p>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
