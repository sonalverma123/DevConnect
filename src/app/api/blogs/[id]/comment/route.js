import { connectDB } from "@/lib/db";
import Blog from "@/models/Blog";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import User from "@/models/User"; // 🆕

export async function POST(req, { params }) {
  await connectDB();
  const session = await getServerSession(authOptions);
  const { text } = await req.json();

  if (!session) return new Response("Unauthorized", { status: 401 });

  const blog = await Blog.findById(params.id);
  const newComment = {
    user: session.user.id,
    text,
    createdAt: new Date(),
  };

  blog.comments.push(newComment);
  await blog.save();

  // Get the last added comment with populated user
  const lastComment = blog.comments[blog.comments.length - 1];
  const populatedUser = await User.findById(lastComment.user).select("name");

  return Response.json({
    success: true,
    comment: {
      _id: lastComment._id,
      text: lastComment.text,
      createdAt: lastComment.createdAt,
      user: { _id: populatedUser._id, name: populatedUser.name },
    },
  });
}
