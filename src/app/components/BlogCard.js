import Link from "next/link";
import { useSession } from "next-auth/react";
import { FiEdit } from "react-icons/fi"; // pencil icon

export default function BlogCard({ blog }) {
  const { data: session } = useSession();

  const isOwner = session?.user?.id === blog.creator;

  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded shadow hover:shadow-lg relative">
      <h3 className="text-xl font-semibold text-blue-600">{blog.title}</h3>

      <p className="text-gray-600 dark:text-gray-300 mt-2 line-clamp-3">
        {blog.content}
      </p>

      <Link
        href={`/blogs/${blog._id}`}
        className="text-sm text-blue-500 hover:underline mt-2 inline-block"
      >
        Read More
      </Link>

      {isOwner && (
        <Link
          href={`/blogs/edit/${blog._id}`}
          className="absolute top-2 right-2 text-gray-500 hover:text-blue-600"
          title="Edit blog"
        >
          <FiEdit size={18} />
        </Link>
      )}
    </div>
  );
}
