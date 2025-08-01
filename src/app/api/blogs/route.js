import { connectDB } from "@/lib/db";
import Blog from "@/models/Blog";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";


await connectDB();


// 📌 GET: Fetch all blogs
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const creator = searchParams.get("creator");

    const query = creator ? { creator } : {};

    const blogs = await Blog.find(query)
      .populate("creator", "name image")
      .sort({ createdAt: -1 });

    return Response.json(blogs);
  } catch (error) {
    return new Response("Error fetching blogs", { status: 500 });
  }
}

export async function POST(req) {
  await connectDB();
  const session = await getServerSession(authOptions);
  const { title, content } = await req.json();

  if (!session) return new Response("Unauthorized", { status: 401 });

  const blog = new Blog({
    title,
    content,
    creator: session.user.id,
  });

  await blog.save();
  return Response.json(blog);
}
