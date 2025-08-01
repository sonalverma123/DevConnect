"use client";

import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";

export default function EditProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [formData, setFormData] = useState({
    image: "",
    bio: "",
    location: "",
    github: "",
    linkedin: "",
  });

  useEffect(() => {
    if (session?.user?.id) {
      fetch(`/api/user/${session.user.id}`)
        .then((res) => res.json())
        .then((data) => {
          setFormData({
            image: data.image || "",
            bio: data.bio || "",
            location: data.location || "",
            github: data.github || "",
            linkedin: data.linkedin || "",
          });
        });
    }
  }, [session]);

  const handleUpload = () => {
    const widget = window.cloudinary.createUploadWidget(
      {
        cloudName: "dak56rq0z",
        uploadPreset: "devconnect_preset",
        multiple: false,
        cropping: true,
        folder: "devconnect-users",
      },
      (error, result) => {
        if (!error && result.event === "success") {
          setFormData((prev) => ({ ...prev, image: result.info.secure_url }));
        }
      }
    );
    widget.open();
  };

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    await fetch("/api/user/update", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId: session.user.id,
        ...formData,
      }),
    });

    router.push(`/profile/${session.user.name}`);
  };

  if (status === "loading") {
    return (
      <div className="h-screen flex items-center justify-center text-xl text-blue-600">
        Loading your profile...
      </div>
    );
  }

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-gradient-to-b from-white to-blue-50 dark:from-gray-900 dark:to-gray-950 p-6">
        <div className="max-w-2xl mx-auto bg-white dark:bg-gray-800 shadow-lg rounded-xl p-8">
          <h1 className="text-3xl font-bold text-blue-700 dark:text-blue-300 mb-6 text-center">
            ✏️ Edit Your Profile
          </h1>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Profile Image */}
            <div className="text-center">
              {formData.image ? (
                <img
                  src={formData.image}
                  alt="Profile Preview"
                  className="w-28 h-28 rounded-full object-cover border-4 border-blue-500 shadow-md mx-auto mb-2"
                />
              ) : (
                <div className="w-28 h-28 bg-gray-200 dark:bg-gray-700 rounded-full mx-auto mb-2" />
              )}

              <button
                type="button"
                onClick={handleUpload}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 text-sm rounded shadow-sm transition"
              >
                Upload New Profile Image
              </button>
            </div>

            {/* Bio */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                Bio
              </label>
              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                placeholder="Tell us about yourself..."
                rows={3}
                className="w-full p-3 rounded border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Location */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                Location
              </label>
              <input
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="e.g. Delhi, India"
                className="w-full p-3 rounded border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* GitHub */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                GitHub Profile URL
              </label>
              <input
                name="github"
                value={formData.github}
                onChange={handleChange}
                placeholder="https://github.com/yourusername"
                className="w-full p-3 rounded border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* LinkedIn */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                LinkedIn Profile URL
              </label>
              <input
                name="linkedin"
                value={formData.linkedin}
                onChange={handleChange}
                placeholder="https://linkedin.com/in/yourname"
                className="w-full p-3 rounded border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Submit */}
            <div className="text-center">
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded-lg shadow transition duration-200"
              >
                ✅ Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
