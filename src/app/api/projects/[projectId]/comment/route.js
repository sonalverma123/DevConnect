// app/api/projects/[projectId]/comment/route.js

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

  const { text } = await req.json();

  const project = await Project.findById(params.projectId);
  if (!project) {
    return new Response("Project not found", { status: 404 });
  }

  project.comments.push({ user: userId, text });

  await project.save();

  return Response.json({ success: true });
}
