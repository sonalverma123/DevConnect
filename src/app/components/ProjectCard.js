// components/ProjectCard.js

import Link from "next/link";

export default function ProjectCard({ project }) {
  return (
    <div className="bg-white shadow-md rounded-xl overflow-hidden p-4">
      <img
        src={project.thumbnail}
        alt={project.title}
        className="w-full h-40 object-cover rounded-md"
      />
      <div className="mt-4 space-y-2">
        <h2 className="text-lg font-semibold">{project.title}</h2>
        <p className="text-sm text-gray-500">{project.description.slice(0, 100)}...</p>

        <div className="flex gap-2 flex-wrap mt-2">
          {project.tags.map((tag) => (
            <span
              key={tag}
              className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded"
            >
              #{tag}
            </span>
          ))}
        </div>

        <Link
          href={`/projects/${project._id}`}
          className="inline-block text-blue-600 text-sm mt-2 hover:underline"
        >
          View Details →
        </Link>
      </div>
    </div>
  );
}
