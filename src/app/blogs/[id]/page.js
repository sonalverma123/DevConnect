
import { connectDB } from "@/lib/db";
import Blog from "@/models/Blog";
import User from "@/models/User";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import BlogContent from "@/components/BlogContent";

export default async function BlogDetailPage({ params }) {
  await connectDB();
  const session = await getServerSession(authOptions);
  const currentUserId = session?.user?.id;

  const blogDoc = await Blog.findById(params.id)
    .populate("creator")
    .populate("comments.user")
    .lean();

  if (!blogDoc) {
    return <div className="text-red-500">Blog not found</div>;
  }

  const blog = JSON.parse(JSON.stringify(blogDoc));
  const isOwner = blog.creator._id.toString() === currentUserId;

  return (
    <main className="max-w-4xl mx-auto p-6">
      <BlogContent blog={blog} isOwner={isOwner} currentUserId={currentUserId} />
    </main>
  );
}
