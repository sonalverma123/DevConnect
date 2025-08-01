// app/projects/edit/[id]/page.js

import ProjectForm from "@/components/ProjectForm";
import Project from "@/models/Project";
import { connectDB } from "@/lib/db";
import { notFound } from "next/navigation";

export default async function EditProjectPage({ params }) {
  await connectDB();

  const projectDoc = await Project.findById(params.id).lean();

  if (!projectDoc) return notFound();

  const project = JSON.parse(JSON.stringify(projectDoc)); 
  return (
    <div className="p-4">
      <h1 className="text-xl font-semibold mb-4">Edit Project</h1>
      <ProjectForm initialData={project} isEditing={true} />
    </div>
  );
}
