// app/api/blogs/[id]/like/route.js

import { connectDB } from "@/lib/db";
import Blog from "@/models/Blog";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

export async function POST(_, { params }) {
  await connectDB();
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;

  if (!userId) {
    return Response.json({ success: false, message: "Unauthorized" }, { status: 401 });
  }

  const blog = await Blog.findById(params.id);
  if (!blog) return Response.json({ success: false, message: "Not found" }, { status: 404 });

  const liked = blog.likes.includes(userId);
  if (liked) {
    blog.likes.pull(userId);
  } else {
    blog.likes.push(userId);
  }

  await blog.save();

  return Response.json({
    success: true,
    likes: blog.likes,
    liked: !liked,
  });
}
