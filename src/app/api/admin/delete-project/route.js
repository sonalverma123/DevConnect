import { connectDB } from "@/lib/db";
import Project from "@/models/Project";
import Notification from "@/models/Notification";

export async function POST(req) {
  await connectDB();

  const formData = await req.formData();
  const id = formData.get("id");

  const project = await Project.findById(id).populate("creator");
  if (!project) {
    return Response.json({ error: "Project not found" }, { status: 404 });
  }

  // Create a notification for the creator
  await Notification.create({
    recipient: project.creator,
    message: `Your project "${project.title}" has been deleted by the admin.`,
    type: "project-deletion",
    sender: null,
  });

  await Project.findByIdAndDelete(id);

  return Response.json({ success: true });
}
