import { connectDB } from "@/lib/db";
import Blog from "@/models/Blog";
import BlogForm from "@/components/BlogForm";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { redirect } from "next/navigation";

export default async function EditBlogPage({ params }) {
  await connectDB();

  const session = await getServerSession(authOptions);
  const currentUserId = session?.user?.id;

  const blog = await Blog.findById(params.id).lean();

  // Redirect if no blog or not owner
  if (!blog || blog.creator.toString() !== currentUserId) {
    redirect("/blogs");
  }

  return (
    <main className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Edit Blog</h1>
      <BlogForm initialData={blog} />
    </main>
  );
}
