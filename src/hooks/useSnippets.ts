import { useState, useEffect, useCallback } from 'react';
import {
  initDatabase,
  createSnippet,
  getAllSnippets,
  getSnippetById,
  updateSnippet,
  deleteSnippet,
  getFavoriteSnippets,
} from '../database/snippetDB';
import { Snippet } from '../types';

export const useSnippets = () => {
  const [snippets, setSnippets] = useState<Snippet[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Initialize database and load snippets
  useEffect(() => {
    const loadSnippets = async () => {
      try {
        await initDatabase();
        const allSnippets = await getAllSnippets();
        setSnippets(allSnippets);
        setLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
        setLoading(false);
      }
    };

    loadSnippets();
  }, []);

  const refreshSnippets = useCallback(async () => {
    setLoading(true);
    try {
      const allSnippets = await getAllSnippets();
      setSnippets(allSnippets);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }, []);

  const addSnippet = useCallback(async (snippetData: Omit<Snippet, 'id'>) => {
    try {
      const id = await createSnippet(snippetData);
      const newSnippet = {
        ...snippetData,
        id,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };
      setSnippets((prev) => [newSnippet, ...prev]);
      return id;
    } catch (err) {
      throw err;
    }
  }, []);

  const updateSnippetData = useCallback(async (snippet: Snippet) => {
    try {
      await updateSnippet(snippet);
      setSnippets((prev) =>
        prev.map((s) => (s.id === snippet.id ? snippet : s))
      );
    } catch (err) {
      throw err;
    }
  }, []);

  const removeSnippet = useCallback(async (id: string) => {
    try {
      await deleteSnippet(id);
      setSnippets((prev) => prev.filter((s) => s.id !== id));
    } catch (err) {
      throw err;
    }
  }, []);

  const toggleFavorite = useCallback(async (id: string) => {
    try {
      const snippet = snippets.find((s) => s.id === id);
      if (snippet) {
        const updatedSnippet = {
          ...snippet,
          isFavorite: !snippet.isFavorite,
        };
        await updateSnippet(updatedSnippet);
        setSnippets((prev) =>
          prev.map((s) => (s.id === id ? updatedSnippet : s))
        );
      }
    } catch (err) {
      throw err;
    }
  }, [snippets]);

  const getFavorites = useCallback(async () => {
    try {
      return await getFavoriteSnippets();
    } catch (err) {
      throw err;
    }
  }, []);

  return {
    snippets,
    loading,
    error,
    refreshSnippets,
    addSnippet,
    updateSnippet: updateSnippetData,
    deleteSnippet: removeSnippet,
    toggleFavorite,
    getFavorites,
  };
};