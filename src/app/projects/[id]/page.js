// app/projects/[id]/page.js

import { connectDB } from "@/lib/db";
import Project from "@/models/Project";
import User from "@/models/User";
import ProjectDetails from "@/components/ProjectDetails";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

export default async function SingleProjectPage({ params }) {


  // 1. Connect to DB
  await connectDB();

  const session = await getServerSession(authOptions);
  const currentUserId = session?.user?.id;

  // 2. Get project ID from URL
  const { id } = params;

  // 3. Fetch project and populate creator info
  const projectDoc = await Project.findById(id)
    .populate("creator")
    .populate("comments.user") // <--- populate user in comments
    .lean();

  const project = JSON.parse(JSON.stringify(projectDoc));

  console.log("Found project:", project); 

  // 4. Return 404 if not found
  if (!project) {
    return <div className="text-red-500">Project not found</div>;
  }
  const isOwner = project.creator?._id?.toString() === currentUserId;

  // 5. Send to component
  return (
    <div className="max-w-4xl mx-auto p-6">
      <ProjectDetails project={project} isOwner={isOwner} />
    </div>
  );
}
