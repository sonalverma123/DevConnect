import { connectDB } from "@/lib/db";
import User from "@/models/User";

export async function POST(req) {
  await connectDB();

  const { userId, image, bio, location, github, linkedin } = await req.json();

  const user = await User.findById(userId);
  if (!user) {
    return new Response(JSON.stringify({ error: "User not found" }), { status: 404 });
  }

  user.image = image;
  user.bio = bio;
  user.location = location;
  user.github = github;
  user.linkedin = linkedin;

  await user.save();

  return new Response(JSON.stringify({ success: true }), { status: 200 });
}
