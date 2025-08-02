// app/projects/page.js

import Project from "@/models/Project";
import { connectDB } from "@/lib/db";
import ProjectCard from "@/components/ProjectCard";
export const dynamic = "force-dynamic";


export default async function ProjectsPage() {
  await connectDB();

  const projects = await Project.find().sort({ createdAt: -1 }).lean();

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Explore Developer Projects</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {projects.map((project) => (
          <ProjectCard key={project._id} project={project} />
        ))}
      </div>
    </div>
  );
}
