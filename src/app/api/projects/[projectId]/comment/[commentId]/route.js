// DELETE /api/projects/[projectId]/comment/[commentId]
import { connectDB } from "@/lib/db";
import Project from "@/models/Project";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

export async function DELETE(req, { params }) {
  await connectDB();
  const session = await getServerSession(authOptions);

  const userId = session?.user?.id;
  const { projectId, commentId } = params;

  if (!userId) {
    return new Response("Unauthorized", { status: 401 });
  }

  const project = await Project.findById(projectId).populate("creator comments.user");
  if (!project) {
    return new Response("Project not found", { status: 404 });
  }

  const comment = project.comments.id(commentId);
  if (!comment) {
    return new Response("Comment not found", { status: 404 });
  }

  const isOwner = project.creator._id.toString() === userId;
  const isCommentAuthor = comment.user._id.toString() === userId;

  if (!isOwner && !isCommentAuthor) {
    return new Response("Forbidden", { status: 403 });
  }

  project.comments = project.comments.filter(
    (c) => c._id.toString() !== commentId
  );
  await project.save();


  return Response.json({ success: true });
}
