// app/api/explore/route.js
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import Project from "@/models/Project";
import Blog from "@/models/Blog";

export async function GET(req) {
  await connectDB();
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q") || "";
  const tag = searchParams.get("tag") || "";
  const tech = searchParams.get("tech") || "";

  const userQuery = {
    $or: [
      { name: { $regex: q, $options: "i" } },
      { email: { $regex: q, $options: "i" } },
    ],
  };

  const projectQuery = {
    $and: [
      {
        $or: [
          { title: { $regex: q, $options: "i" } },
          { description: { $regex: q, $options: "i" } },
        ],
      },
      tag ? { tags: tag } : {},
      tech ? { techStack: tech } : {},
    ],
  };

  const blogQuery = {
    $and: [
      {
        $or: [
          { title: { $regex: q, $options: "i" } },
          { content: { $regex: q, $options: "i" } },
        ],
      },
      tag ? { tags: tag } : {},
    ],
  };

  const [users, projects, blogs] = await Promise.all([
    User.find(userQuery).select("name email image").lean(),
    Project.find(projectQuery).lean(),
    Blog.find(blogQuery).lean(),
  ]);

  return Response.json({ users, projects, blogs });
}
