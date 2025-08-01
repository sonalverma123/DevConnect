// Import React and Icons
import React from "react";
import { FaGithub, FaEnvelope } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="text-center py-8 px-6 bg-gradient-to-t from-gray-100 to-white dark:from-gray-900 dark:to-gray-800 border-t dark:border-gray-700 mt-10">
      {/* Main Footer Text */}
      <p className="text-sm sm:text-base text-gray-700 dark:text-gray-300">
        &copy; {new Date().getFullYear()}{" "}
        <span className="font-semibold text-blue-600 dark:text-blue-400">DevConnect</span>. Built with ❤️ using{" "}
        <span className="font-medium">Next.js</span> &{" "}
        <span className="font-medium">Tailwind CSS</span>.
      </p>

      {/* Footer Links */}
      <div className="mt-4 flex justify-center items-center gap-6">
        <a
          href="https://github.com"
          target="_blank"
          rel="noopener noreferrer"
          className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition transform hover:scale-110 flex items-center gap-2"
        >
          <FaGithub className="text-xl" />
          GitHub
        </a>
        <a
          href="/contact"
          className="text-gray-600 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400 transition transform hover:scale-110 flex items-center gap-2"
        >
          <FaEnvelope className="text-lg" />
          Contact
        </a>
      </div>
    </footer>
  );
}
