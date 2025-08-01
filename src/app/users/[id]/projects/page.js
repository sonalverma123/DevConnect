// app/users/[id]/projects/page.js

import { connectDB } from "@/lib/db";
import Project from "@/models/Project";
import User from "@/models/User";
import ProjectCard from "@/components/ProjectCard";

export default async function UserProjectsPage({ params }) {
  await connectDB();
  const userId = params.id;

  const user = await User.findById(userId).lean();
  const projects = await Project.find({ creator: userId }).lean();

  if (!user) return <div>User not found</div>;

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">{user.name} Projects</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {projects.map((project) => (
          <ProjectCard key={project._id} project={project} />
        ))}
      </div>
    </div>
  );
}
