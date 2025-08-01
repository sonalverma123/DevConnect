import { connectDB } from "@/lib/db";
import User from "@/models/User";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

export async function GET() {
  await connectDB();

  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return new Response("Unauthorized", { status: 401 });
  }

  const user = await User.findById(session.user.id);
  if (!user || user.isDeleted) {
    return new Response("Deleted", { status: 403 }); // Or 404
  }

  return Response.json({ user });
}
