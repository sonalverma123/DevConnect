import { connectDB } from "@/lib/db";
import Blog from "@/models/Blog";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

await connectDB();

// 📌 PUT: Update a blog
export async function PUT(req, { params }) {
    const session = await getServerSession(authOptions);
    if (!session) return new Response("Unauthorized", { status: 401 });

    const { title, content } = await req.json();

    const updatedBlog = await Blog.findOneAndUpdate(
        { _id: params.id, creator: session.user.id },
        { title, content },
        { new: true }
    );

    if (!updatedBlog) {
        return new Response("Blog not found or not authorized", { status: 404 });
    }

    return Response.json(updatedBlog);
}
