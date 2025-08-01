// app/api/projects/route.js

import { connectDB } from "@/lib/db";
import Project from "@/models/Project";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

// Connect to DB
await connectDB();

// 📌 GET: Fetch all projects
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const creator = searchParams.get("creator");

    const query = creator ? { creator } : {};

    const projects = await Project.find(query)
      .populate("creator", "name image")
      .sort({ createdAt: -1 });

    return Response.json(projects);
  } catch (error) {
    return new Response("Error fetching projects", { status: 500 });
  }
}

// 📌 POST: Add new project
export async function POST(req) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return new Response("Unauthorized", { status: 401 });
  }

  const body = await req.json();
  const { title, description, githubUrl, liveUrl, tags, thumbnail } = body;

  try {
    const newProject = await Project.create({
      title,
      description,
      githubUrl,
      liveUrl,
      tags,
      thumbnail,
      creator: session.user.id,
    });

    return Response.json(newProject);
  } catch (err) {
    return new Response("Error creating project", { status: 500 });
  }
}
