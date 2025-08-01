// app/explore/page.jsx
"use client";

import { useState, useEffect } from "react";
import SearchFilters from "@/components/explore/SearchFilters";
import ResultsGrid from "@/components/explore/ResultsGrid";

export default function ExplorePage() {
  const [query, setQuery] = useState("");
  const [tagFilter, setTagFilter] = useState("");
  const [techFilter, setTechFilter] = useState("");
  const [results, setResults] = useState({ users: [], projects: [], blogs: [] });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchResults = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (query) params.append("q", query);
        if (tagFilter) params.append("tag", tagFilter);
        if (techFilter) params.append("tech", techFilter);

        const res = await fetch(`/api/explore?${params.toString()}`);
        const data = await res.json();
        setResults(data);
      } catch (err) {
        console.error("Error fetching explore data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [query, tagFilter, techFilter]);

  return (
    <main className="p-8 min-h-screen bg-gray-50 dark:bg-gray-900">
      <h1 className="text-3xl font-bold text-blue-600 mb-6">🔍 Explore DevConnect</h1>

      <SearchFilters
        query={query}
        setQuery={setQuery}
        tagFilter={tagFilter}
        setTagFilter={setTagFilter}
        techFilter={techFilter}
        setTechFilter={setTechFilter}
      />

      {loading ? (
        <p className="mt-6 text-center">Loading results...</p>
      ) : (
        <ResultsGrid results={results} />
      )}
    </main>
  );
}
