import { connectDB } from "@/lib/db";
import User from "@/models/User";
import Notification from "@/models/Notification";

export async function POST(req) {
  try {
    await connectDB();

    const formData = await req.formData();
    const id = formData.get("id");

    const user = await User.findById(id);
    if (!user) {
      return Response.json({ error: "User not found" }, { status: 404 });
    }

    // Mark user as deleted
    user.isDeleted = true;
    await user.save();

    // Send a notification
    await Notification.create({
      recipient: user._id,
      message: "Your account has been removed by the admin.",
      type: "account-deletion",
    });

    return Response.json({ success: true });
  } catch (err) {
    console.error("Error soft-deleting user:", err);
    return Response.json({ error: "Server error" }, { status: 500 });
  }
}
