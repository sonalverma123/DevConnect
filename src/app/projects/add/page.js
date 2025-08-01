// app/projects/add/page.js

import Navbar from "@/components/Navbar";
import ProjectForm from "@/components/ProjectForm";
import { authOptions } from "@/lib/authOptions";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";


export default async function AddProjectPage() {
  const session = await getServerSession(authOptions);

  // Redirect if not logged in
  if (!session) {
    redirect("/login");
  }

  return (
    <>
      <Navbar />
      <div className="max-w-2xl mx-auto p-4">
        <h1 className="text-2xl font-bold mb-6">Add New Project</h1>
        <ProjectForm />
      </div>
    </>
  );
}
