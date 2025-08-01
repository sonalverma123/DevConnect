import { connectDB } from "@/lib/db";
import Blog from "@/models/Blog";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

export async function DELETE(_, { params }) {
  await connectDB();
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;

  const blog = await Blog.findById(params.id);
  const comment = blog.comments.id(params.commentId);

  if (!comment) return new Response("Not found", { status: 404 });

  const isOwner = comment.user.toString() === userId || blog.creator.toString() === userId;
  if (!isOwner) return new Response("Unauthorized", { status: 403 });

  comment.deleteOne();
  await blog.save();
  return Response.json({ success: true });
}
