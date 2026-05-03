"use client";

import PsychologistLayout from "../_components/PsychologistLayout";
import { usePsychologistStudentsPage } from "./_hooks/usePsychologistStudentsPage";
import { StudentsFiltersSection } from "./_components/StudentsFiltersSection";
import { BulkAssignSection } from "./_components/BulkAssignSection";
import { StudentsListPanel } from "./_components/StudentsListPanel";
import { StudentDetailPanel } from "./_components/StudentDetailPanel";

export default function PsychologistStudentsPage() {
  const {
    search,
    setSearch,
    userTypeFilter,
    setUserTypeFilter,
    caseStatusFilter,
    setCaseStatusFilter,
    priorityFilter,
    setPriorityFilter,
    selectedTestId,
    setSelectedTestId,
    selectedStudentIds,
    bulkDueAt,
    setBulkDueAt,
    isLoading,
    assignableTests,
    filteredStudents,
    selectedStudentId,
    studentDetail,
    loadingDetail,
    reviewMutation,
    bulkAssignMutation,
    handleSelectStudent,
    handleToggleStudentSelection,
    handleToggleAllVisibleStudents,
    canSubmitBulkAssign,
  } = usePsychologistStudentsPage();

  return (
    <PsychologistLayout>
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <section className="rounded-[2rem] bg-white p-8 shadow-sm">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[#0D4A8C]">
            Mis estudiantes
          </p>
          <h1 className="mt-3 text-4xl font-bold text-[#102D69]">
            Resumen psicológico del estudiante
          </h1>
          <p className="mt-3 max-w-3xl text-slate-600">
            Esta vista consolida contexto, resultados e hitos recientes por
            estudiante para que no tengas que navegar entre pruebas aisladas.
          </p>
        </section>

        <StudentsFiltersSection
          search={search}
          userTypeFilter={userTypeFilter}
          caseStatusFilter={caseStatusFilter}
          priorityFilter={priorityFilter}
          onSearchChange={setSearch}
          onUserTypeChange={setUserTypeFilter}
          onCaseStatusChange={setCaseStatusFilter}
          onPriorityChange={setPriorityFilter}
        />

        <BulkAssignSection
          selectedStudentCount={selectedStudentIds.length}
          selectedTestId={selectedTestId}
          bulkDueAt={bulkDueAt}
          assignableTests={assignableTests}
          visibleStudentsCount={filteredStudents.length}
          canSubmitBulkAssign={canSubmitBulkAssign}
          isAssigning={bulkAssignMutation.isPending}
          onSelectedTestChange={setSelectedTestId}
          onBulkDueAtChange={setBulkDueAt}
          onToggleAllVisibleStudents={handleToggleAllVisibleStudents}
          onSubmit={() => bulkAssignMutation.mutate()}
        />

        <section className="mt-8 grid gap-6 xl:grid-cols-[360px_minmax(0,1fr)]">
          <StudentsListPanel
            isLoading={isLoading}
            students={filteredStudents}
            selectedStudentId={selectedStudentId}
            selectedStudentIds={selectedStudentIds}
            onSelectStudent={handleSelectStudent}
            onToggleStudentSelection={handleToggleStudentSelection}
          />

          <StudentDetailPanel
            loadingDetail={loadingDetail}
            studentDetail={studentDetail}
            isReviewPending={reviewMutation.isPending}
            reviewMutationAssignmentId={reviewMutation.variables}
            onReviewAssignment={(assignmentId) => reviewMutation.mutate(assignmentId)}
          />
        </section>
      </div>
    </PsychologistLayout>
  );
}
