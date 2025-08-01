import { connectDB } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import Project from "@/models/Project";
import Blog from "@/models/Blog";
import User from "@/models/User";

export async function GET(req) {
  try {
    await connectDB();

    const session = await getServerSession(authOptions);
    const userId = session?.user?.id;

    if (!userId) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
    }

    // Count stats
    const totalProjects = await Project.countDocuments({ creator: userId });
    const totalBlogs = await Blog.countDocuments({ creator: userId });
    const user = await User.findById(userId).select("followers");
    const totalFollowers = user.followers.length;

    return new Response(JSON.stringify({ totalProjects, totalBlogs, totalFollowers }), { status: 200 });
  } catch (err) {
    console.error("Error fetching dashboard stats", err);
    return new Response(JSON.stringify({ error: "Server error" }), { status: 500 });
  }
}
