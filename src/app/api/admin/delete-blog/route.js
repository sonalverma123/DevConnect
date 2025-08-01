import { connectDB } from "@/lib/db";
import Blog from "@/models/Blog";
import Notification from "@/models/Notification";

export async function POST(req) {
  await connectDB();

  const formData = await req.formData();
  const blogId = formData.get("id");

  const blog = await Blog.findById(blogId).populate("creator", "_id name");

  if (!blog) {
    return Response.json({ error: "Blog not found" }, { status: 404 });
  }

  // ✅ Notify the creator of the blog
  await Notification.create({
    recipient: blog.creator._id, // ✅ Fix here
    message: `Your blog "${blog.title}" has been deleted by the admin.`,
    type: "blog-deletion",
    sender: null,
  });


  await Blog.findByIdAndDelete(blogId);

  return Response.json({ success: true });
}
