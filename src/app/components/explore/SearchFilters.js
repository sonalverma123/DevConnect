export default function SearchFilters({
  query,
  setQuery,
  tagFilter,
  setTagFilter,
  techFilter,
  setTechFilter,
}) {
  const tagOptions = ["portfolio", "blog", "open-source", "tutorial"];
  const techOptions = ["React", "Next.js", "Node.js", "MongoDB", "Tailwind"];

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md flex flex-col sm:flex-row flex-wrap gap-4 items-center justify-between transition-all duration-300">
      {/* Search Input */}
      <input
        type="text"
        placeholder="🔍 Search by name, title, content..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="w-full sm:flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white transition duration-200"
      />

      {/* Tag Filter */}
      <select
        value={tagFilter}
        onChange={(e) => setTagFilter(e.target.value)}
        className="w-full sm:w-auto px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-white transition duration-200"
      >
        <option value="">🎯 Filter by Tag</option>
        {tagOptions.map((tag) => (
          <option key={tag} value={tag}>
            {tag.charAt(0).toUpperCase() + tag.slice(1)}
          </option>
        ))}
      </select>

      {/* Tech Filter */}
      <select
        value={techFilter}
        onChange={(e) => setTechFilter(e.target.value)}
        className="w-full sm:w-auto px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-white transition duration-200"
      >
        <option value="">💻 Filter by Tech</option>
        {techOptions.map((tech) => (
          <option key={tech} value={tech}>
            {tech}
          </option>
        ))}
      </select>
    </div>
  );
}
