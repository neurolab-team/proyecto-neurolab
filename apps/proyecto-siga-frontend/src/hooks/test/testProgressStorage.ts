export interface TestProgressData {
  answers: Record<string, string>;
  currentIndex: number;
}

export interface TestProgressStorage {
  load(): TestProgressData | null;
  save(data: TestProgressData): void;
  clear(): void;
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
