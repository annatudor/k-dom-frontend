// src/hooks/useGlobalSearch.ts
import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { globalSearch } from "@/api/search";
import type { GlobalSearchResultDto } from "@/types/Search";

export const useGlobalSearch = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<GlobalSearchResultDto | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  // Debounce search
  useEffect(() => {
    if (!query.trim()) {
      setResults(null);
      setIsOpen(false);
      return;
    }

    if (query.length < 2) {
      return;
    }

    setIsLoading(true);
    const timeoutId = setTimeout(async () => {
      try {
        const searchResults = await globalSearch(query.trim());
        setResults(searchResults);
        setIsOpen(true);
      } catch (error) {
        console.error("Search failed:", error);
        setResults(null);
      } finally {
        setIsLoading(false);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [query]);

  const handleKDomSelect = useCallback(
    (slug: string) => {
      navigate(`/kdoms/slug/${slug}`);
      setIsOpen(false);
      setQuery("");
    },
    [navigate]
  );

  const handleUserSelect = useCallback(
    (userId: number) => {
      navigate(`/profile/${userId}`);
      setIsOpen(false);
      setQuery("");
    },
    [navigate]
  );

  const handleTagSelect = useCallback(
    (tag: string) => {
      navigate(`/search?tag=${encodeURIComponent(tag)}`);
      setIsOpen(false);
      setQuery("");
    },
    [navigate]
  );

  const clearSearch = useCallback(() => {
    setQuery("");
    setResults(null);
    setIsOpen(false);
  }, []);

  const hasResults =
    results &&
    (results.kdoms.length > 0 ||
      results.users.length > 0 ||
      results.tags.length > 0);

  return {
    query,
    setQuery,
    results,
    isLoading,
    isOpen,
    setIsOpen,
    hasResults,
    handleKDomSelect,
    handleUserSelect,
    handleTagSelect,
    clearSearch,
  };
};
