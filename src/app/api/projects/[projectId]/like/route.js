// app/api/projects/[projectId]/like/route.js

import { connectDB } from "@/lib/db";
import Project from "@/models/Project";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

export async function POST(req, { params }) {
  await connectDB();
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;

  if (!userId) {
    return new Response("Unauthorized", { status: 401 });
  }

  const project = await Project.findById(params.projectId);
  if (!project) {
    return new Response("Project not found", { status: 404 });
  }

  const index = project.likes.indexOf(userId);

  if (index === -1) {
    project.likes.push(userId); // Like
  } else {
    project.likes.splice(index, 1); // Unlike
  }

  await project.save();

  return Response.json({ likes: project.likes.length });
}
