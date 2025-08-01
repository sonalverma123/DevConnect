"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function ProjectForm({ initialData = {}, isEditing = false }) {
  const [formData, setFormData] = useState({
    title: initialData.title || "",
    description: initialData.description || "",
    githubUrl: initialData.githubUrl || "",
    liveUrl: initialData.liveUrl || "",
    tags: initialData.tags?.join(", ") || "",
    thumbnail: initialData.thumbnail || "",
  });

  const router = useRouter();

  useEffect(() => {
    if (!window.cloudinary) {
      const script = document.createElement("script");
      script.src = "https://widget.cloudinary.com/v2.0/global/all.js";
      script.async = true;
      document.body.appendChild(script);
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // 🔽 Cloudinary upload handler
  const handleImageUpload = () => {
    if (!window.cloudinary) return;

    const widget = window.cloudinary.createUploadWidget(
      {
        cloudName: "dak56rq0z", 
        uploadPreset: "devconnect_preset", 
        sources: ["local", "url", "camera", "image_search"],
        cropping: false,
        multiple: false,
        maxFileSize: 2000000,
        folder: "devconnect/projects",
      },
      (error, result) => {
        if (!error && result.event === "success") {
          setFormData((prev) => ({
            ...prev,
            thumbnail: result.info.secure_url,
          }));
        }
      }
    );

    widget.open();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      ...formData,
      tags: formData.tags.split(",").map((tag) => tag.trim()),
    };

    const res = await fetch(
      isEditing
        ? `/api/projects/projects-api/${initialData._id}`
        : "/api/projects/projects-api",
      {
        method: isEditing ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      }
    );

    if (res.ok) {
      const data = await res.json();
      const projectId = isEditing ? initialData._id : data._id;
      router.push(`/projects/${projectId}`);
    } else {
      alert("Something went wrong");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-xl mx-auto p-4 space-y-4">
      <input
        type="text"
        name="title"
        placeholder="Project Title"
        value={formData.title}
        onChange={handleChange}
        className="w-full p-2 border rounded"
        required
      />
      <textarea
        name="description"
        placeholder="Description"
        value={formData.description}
        onChange={handleChange}
        className="w-full p-2 border rounded"
        rows={4}
        required
      />
      <input
        type="text"
        name="githubUrl"
        placeholder="GitHub Repo URL"
        value={formData.githubUrl}
        onChange={handleChange}
        className="w-full p-2 border rounded"
      />
      <input
        type="text"
        name="liveUrl"
        placeholder="Live Demo URL"
        value={formData.liveUrl}
        onChange={handleChange}
        className="w-full p-2 border rounded"
      />
      <input
        type="text"
        name="tags"
        placeholder="Tags (comma separated)"
        value={formData.tags}
        onChange={handleChange}
        className="w-full p-2 border rounded"
      />

      <div className="space-y-2">
        {formData.thumbnail && (
          <img
            src={formData.thumbnail}
            alt="Project Thumbnail"
            className="w-full h-48 object-cover rounded border"
          />
        )}
        <button
          type="button"
          onClick={handleImageUpload}
          className="bg-purple-600 text-white px-4 py-2 rounded"
        >
          Upload Project Thumbnail
        </button>
      </div>

      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        {isEditing ? "Update Project" : "Create Project"}
      </button>
    </form>
  );
}
