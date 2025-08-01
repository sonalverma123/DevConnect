"use client";

import { useState } from "react";
import { signIn, getSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { FcGoogle } from "react-icons/fc";
import { Loader2 } from "lucide-react";
import { useSession } from "next-auth/react";
import { useEffect } from "react";


export default function AuthForm({ type = "login" }) {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState("user");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

   useEffect(() => {
    if (status === "authenticated") {
      router.push("/dashboard");
    }
  }, [status]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    
    if (type === "register") {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, role }),
      });

      const data = await res.json();
      setLoading(false);
      if (data.error) return setError(data.error);
      return router.push("/login");
    }

    

    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (res.error) {
      setLoading(false);
      return setError("Invalid credentials");
    }

    const session = await getSession();
    setLoading(false);

    if (session?.user?.role === "admin") {
      router.push("/admin");
    } else {
      router.push("/dashboard");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white dark:bg-gray-900 p-8 rounded-xl shadow-lg max-w-md mx-auto mt-20 space-y-5 transition-all duration-300"
    >
      <h2 className="text-3xl font-bold text-center text-blue-600 dark:text-white">
        {type === "login" ? "Welcome Back 👋" : "Create Account 🚀"}
      </h2>

      {type === "register" && (
        <>
          <input
            type="text"
            placeholder="Your Name"
            className="w-full border border-gray-300 dark:border-gray-700 px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <select
            className="w-full border border-gray-300 dark:border-gray-700 px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            value={role}
            onChange={(e) => setRole(e.target.value)}
          >
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>
        </>
      )}

      <input
        type="email"
        placeholder="Email"
        className="w-full border border-gray-300 dark:border-gray-700 px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />

      <input
        type="password"
        placeholder="Password"
        className="w-full border border-gray-300 dark:border-gray-700 px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />

      {error && (
        <p className="text-red-500 text-sm animate-pulse text-center">{error}</p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded flex items-center justify-center gap-2 transition disabled:opacity-50"
      >
        {loading ? <Loader2 className="animate-spin w-5 h-5" /> : null}
        {type === "login" ? "Login" : "Register"}
      </button>

      {type === "login" && (
        <button
          type="button"
          onClick={() => signIn("google")}
          className="w-full border border-gray-300 dark:border-gray-600 py-2 rounded flex items-center justify-center gap-2 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
        >
          <FcGoogle className="w-5 h-5" />
          <span>Continue with Google</span>
        </button>
      )}

      <div className="text-center text-sm text-gray-500 mt-4">
        {type === "login" ? (
          <>
            New here?{" "}
            <span
              className="text-blue-600 cursor-pointer hover:underline"
              onClick={() => router.push("/register")}
            >
              Register
            </span>
          </>
        ) : (
          <>
            Already have an account?{" "}
            <span
              className="text-blue-600 cursor-pointer hover:underline"
              onClick={() => router.push("/login")}
            >
              Login
            </span>
          </>
        )}
      </div>
    </form>
  );
}
