// src/hooks/useAutosave.ts
import { useState, useEffect, useCallback, useRef } from "react";
import type { KDomEditDto } from "@/types/KDom";

interface UseAutosaveProps {
  kdomSlug: string; // Changed from kdomId to kdomSlug
  content: string;
  initialContent: string;
  onSave: (data: KDomEditDto) => Promise<void>;
  enabled?: boolean;
  autosaveInterval?: number; // milliseconds
}

interface UseAutosaveReturn {
  isSaving: boolean;
  lastSaved: Date | null;
  hasUnsavedChanges: boolean;
  error: Error | null;
  saveNow: (editNote?: string, isMinor?: boolean) => Promise<void>;
  resetError: () => void;
}

const AUTOSAVE_DELAY = 2000; // 2 seconds after user stops typing
const AUTOSAVE_INTERVAL = 30000; // Auto-save every 30 seconds if there are changes

export function useAutosave({
  kdomSlug,
  content,
  initialContent,
  onSave,
  enabled = true,
  autosaveInterval = AUTOSAVE_INTERVAL,
}: UseAutosaveProps): UseAutosaveReturn {
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [error, setError] = useState<Error | null>(null);

  // Refs for tracking state - Fixed: Added initial values
  const lastContentRef = useRef(initialContent);
  const debounceTimerRef = useRef<number | null>(null); // Fixed: Use number instead of NodeJS.Timeout
  const intervalTimerRef = useRef<number | null>(null); // Fixed: Use number instead of NodeJS.Timeout
  const lastSaveTimeRef = useRef<Date | null>(null);

  // Calculate if there are unsaved changes
  const hasUnsavedChanges = content !== lastContentRef.current;

  // Function to perform the actual save
  const performSave = useCallback(
    async (editNote?: string, isMinor = false, isAutoSave = true) => {
      if (isSaving || !enabled || !hasUnsavedChanges) {
        return;
      }

      try {
        setIsSaving(true);
        setError(null);

        const saveData: KDomEditDto = {
          kdomSlug, // Use slug instead of ID
          contentHtml: content,
          editNote,
          isMinor,
          isAutoSave,
        };

        await onSave(saveData);

        // Update tracking variables
        lastContentRef.current = content;
        const now = new Date();
        setLastSaved(now);
        lastSaveTimeRef.current = now;
      } catch (err) {
        const error = err instanceof Error ? err : new Error("Save failed");
        setError(error);
        throw error;
      } finally {
        setIsSaving(false);
      }
    },
    [content, enabled, hasUnsavedChanges, isSaving, kdomSlug, onSave]
  );

  // Manual save function
  const saveNow = useCallback(
    async (editNote?: string, isMinor = false) => {
      await performSave(editNote, isMinor, false);
    },
    [performSave]
  );

  // Reset error function
  const resetError = useCallback(() => {
    setError(null);
  }, []);

  // Debounced autosave effect
  useEffect(() => {
    if (!enabled || !hasUnsavedChanges || isSaving) {
      return;
    }

    // Clear existing debounce timer
    if (debounceTimerRef.current !== null) {
      clearTimeout(debounceTimerRef.current);
    }

    // Set new debounce timer
    debounceTimerRef.current = window.setTimeout(() => {
      performSave(undefined, false, true);
    }, AUTOSAVE_DELAY);

    return () => {
      if (debounceTimerRef.current !== null) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [content, enabled, hasUnsavedChanges, isSaving, performSave]);

  // Interval-based autosave effect
  useEffect(() => {
    if (!enabled || autosaveInterval <= 0) {
      return;
    }

    intervalTimerRef.current = window.setInterval(() => {
      const now = new Date();
      const timeSinceLastSave = lastSaveTimeRef.current
        ? now.getTime() - lastSaveTimeRef.current.getTime()
        : Infinity;

      // Only auto-save if:
      // 1. There are unsaved changes
      // 2. Not currently saving
      // 3. Enough time has passed since last save
      if (
        hasUnsavedChanges &&
        !isSaving &&
        timeSinceLastSave >= autosaveInterval
      ) {
        performSave(undefined, false, true);
      }
    }, autosaveInterval);

    return () => {
      if (intervalTimerRef.current !== null) {
        clearInterval(intervalTimerRef.current);
      }
    };
  }, [enabled, autosaveInterval, hasUnsavedChanges, isSaving, performSave]);

  // Cleanup effect
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current !== null) {
        clearTimeout(debounceTimerRef.current);
      }
      if (intervalTimerRef.current !== null) {
        clearInterval(intervalTimerRef.current);
      }
    };
  }, []);

  // Update initial content when K-Dom changes
  useEffect(() => {
    if (initialContent !== lastContentRef.current && !hasUnsavedChanges) {
      lastContentRef.current = initialContent;
    }
  }, [initialContent, hasUnsavedChanges]);

  return {
    isSaving,
    lastSaved,
    hasUnsavedChanges,
    error,
    saveNow,
    resetError,
  };
}
