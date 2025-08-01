// app/api/projects/[id]/route.js

import { connectDB } from "@/lib/db";
import Project from "@/models/Project";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

await connectDB();

export async function PUT(req, { params }) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return new Response("Unauthorized", { status: 401 });
  }

  const body = await req.json();

  const updatedProject = await Project.findOneAndUpdate(
    { _id: params.id, creator: session.user.id }, // Only owner can update
    {
      $set: {
        title: body.title,
        description: body.description,
        githubUrl: body.githubUrl,
        liveUrl: body.liveUrl,
        tags: body.tags,
        thumbnail: body.thumbnail,
      },
    },
    { new: true }
  );

  if (!updatedProject) {
    return new Response("Project not found or not authorized", { status: 404 });
  }

  return Response.json(updatedProject);
}
