export interface TestProgressData {
  answers: Record<string, string>;
  currentIndex: number;
}

export interface TestProgressStorage {
  load(): TestProgressData | null;
  save(data: TestProgressData): void;
  clear(): void;
}

/**
 * Returns the resume path for a given assignment based on localStorage progress.
 * If the user has saved at least one answer, navigates directly to the test;
 * otherwise navigates to the preview page.
 */
export function getTestResumePath(assignmentId: string): string {
  const saved = createLocalStorageProgress(assignmentId).load();
  const hasProgress = !!saved && Object.keys(saved.answers).length > 0;
  return hasProgress ? `/test/${assignmentId}` : `/test/${assignmentId}/preview`;
}

/**
 * Returns true if there is locally saved progress (at least one answer) for the given assignment.
 */
export function hasLocalProgress(assignmentId: string): boolean {
  const saved = createLocalStorageProgress(assignmentId).load();
  return !!saved && Object.keys(saved.answers).length > 0;
}

export function createLocalStorageProgress(assignmentId: string): TestProgressStorage {
  const key = `test-progress-${assignmentId}`;

  return {
    load() {
      try {
        const raw = localStorage.getItem(key);
        if (!raw) return null;
        const parsed = JSON.parse(raw);
        if (parsed && typeof parsed.answers === "object" && typeof parsed.currentIndex === "number") {
          return parsed as TestProgressData;
        }
        return null;
      } catch {
        return null;
      }
    },
    save(data) {
      try {
        localStorage.setItem(key, JSON.stringify(data));
      } catch { /* quota exceeded — silently ignore */ }
    },
    clear() {
      try {
        localStorage.removeItem(key);
      } catch { /* ignore */ }
    },
  };
}
