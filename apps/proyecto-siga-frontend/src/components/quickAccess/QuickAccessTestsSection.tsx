"use client";

import { useAuth } from "@/hooks/useAuth";
import { useAssignedTests } from "@/app/(protected)/panel/assignmentTest/_hooks/useAssignedTests";
import { createLocalStorageProgress } from "@/libs/testProgressStorage";
import QuickAccessTestCard, { QuickAccessStatus } from "./QuickAccessTestCard";
import EmptyQuickAccessState from "./EmptyQuickAccessState";
import { QUICK_ACCESS_CONTENT } from "./quickAccessContent";

type DerivedTest = {
  assignmentId: string;
  title: string;
  status: QuickAccessStatus;
  answeredCount: number;
  totalQuestions: number;
  progress: number;
};

function deriveStatus(answeredCount: number, totalQuestions: number): QuickAccessStatus {
  if (answeredCount === 0) return "new";
  if (totalQuestions > 0 && answeredCount >= totalQuestions) return "pending_submit";
  return "in_progress";
}

export default function QuickAccessTestsSection() {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const { tests, isLoading, isError } = useAssignedTests();

  if (!isAuthenticated || authLoading) return null;
  if (isError) return null;

  if (isLoading) {
    return (
      <section className="w-full px-6 py-12 bg-[#F1F5F9]" aria-busy="true">
        <div className="max-w-4xl mx-auto">
          <div className="h-8 w-48 rounded bg-slate-200 animate-pulse mb-6" />
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-24 rounded-2xl bg-white animate-pulse" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  // Filter only pending/in-progress from server (assigned or in_progress)
  const pendingTests = tests.filter(
    (t) => t.status === "assigned" || t.status === "in_progress",
  );

  if (pendingTests.length === 0) {
    return <EmptyQuickAccessState />;
  }

  // Derive state from localStorage
  const derivedTests: DerivedTest[] = pendingTests.map((test) => {
    const totalQuestions = test.questionCount || 0;
    const saved = createLocalStorageProgress(test.assignmentId).load();
    const answeredCount = saved ? Object.keys(saved.answers).length : 0;
    const progress = totalQuestions > 0 ? Math.round((answeredCount / totalQuestions) * 100) : 0;
    const status = deriveStatus(answeredCount, totalQuestions);

    return {
      assignmentId: test.assignmentId,
      title: test.title,
      status,
      answeredCount,
      totalQuestions,
      progress,
    };
  });

  // Group by status
  const inProgressTests = derivedTests.filter((t) => t.status === "in_progress");
  const newTests = derivedTests.filter((t) => t.status === "new");
  const pendingSubmitTests = derivedTests.filter((t) => t.status === "pending_submit");

  // Counters for header
  const inProgressCount = inProgressTests.length + pendingSubmitTests.length;
  const newCount = newTests.length;

  return (
    <section className="w-full px-6 py-12 bg-[#F1F5F9]">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold text-[#2C5FE8]">
            {QUICK_ACCESS_CONTENT.sectionTitle}
          </h2>
          <div className="flex items-center gap-4 text-sm text-gray-500">
            {inProgressCount > 0 && (
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#F5A623]" />
                {inProgressCount} en curso
              </span>
            )}
            {newCount > 0 && (
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#7C4DFF]" />
                {newCount} nueva{newCount > 1 ? "s" : ""}
              </span>
            )}
          </div>
        </div>

        {/* Section: In Progress */}
        {inProgressTests.length > 0 && (
          <div className="mb-8">
            <h3 className="text-xs font-semibold uppercase tracking-widest text-gray-500 mb-3">
              {QUICK_ACCESS_CONTENT.sectionHeaders.in_progress}
            </h3>
            <div className="space-y-3">
              {inProgressTests.map((test) => (
                <QuickAccessTestCard key={test.assignmentId} {...test} />
              ))}
            </div>
          </div>
        )}

        {/* Section: Pending Submit */}
        {pendingSubmitTests.length > 0 && (
          <div className="mb-8">
            <h3 className="text-xs font-semibold uppercase tracking-widest text-gray-500 mb-3">
              {QUICK_ACCESS_CONTENT.sectionHeaders.pending_submit}
            </h3>
            <div className="space-y-3">
              {pendingSubmitTests.map((test) => (
                <QuickAccessTestCard key={test.assignmentId} {...test} />
              ))}
            </div>
          </div>
        )}

        {/* Section: New */}
        {newTests.length > 0 && (
          <div className="mb-8">
            <h3 className="text-xs font-semibold uppercase tracking-widest text-gray-500 mb-3">
              {QUICK_ACCESS_CONTENT.sectionHeaders.new}
            </h3>
            <div className="space-y-3">
              {newTests.map((test) => (
                <QuickAccessTestCard key={test.assignmentId} {...test} />
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
