import { useEffect, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { usersService } from "@/services/users/users";
import { assignmentService } from "@/services/assignment/assignment";
import { notify } from "@/libs/toastService";
import { getApiErrorMessage } from "@/libs/getApiErrorMessage";
import { PsychologistStudentProfile, PsychologistStudentSummary } from "@packages/common-types/psychologist.types";

const priorityFilterOptions = ["all", "high", "medium", "low"] as const;

const resolvePriorityFilter = (value: string | null): string => {
  if (!value) return "all";

  if (priorityFilterOptions.includes(value as (typeof priorityFilterOptions)[number])) {
    return value;
  }

  return "all";
};

export function usePsychologistStudentsPage() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();

  const [search, setSearch] = useState("");
  const [userTypeFilter, setUserTypeFilter] = useState("all");
  const [caseStatusFilter, setCaseStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [selectedTestId, setSelectedTestId] = useState("");
  const [selectedStudentIds, setSelectedStudentIds] = useState<string[]>([]);
  const [bulkDueAt, setBulkDueAt] = useState("");

  const { data: students = [], isLoading } = useQuery<PsychologistStudentSummary[]>({
    queryKey: ["psychologist-students"],
    queryFn: () => usersService.getPsychologistStudents(),
  });

  const { data: assignableTests = [] } = useQuery({
    queryKey: ["psychologist-assignable-tests"],
    queryFn: () => assignmentService.getPsychologistAssignableTests(),
  });

  const priorityParam = searchParams?.get("priority") ?? null;
  const studentIdParam = searchParams?.get("studentId") ?? null;

  useEffect(() => {
    const nextPriority = resolvePriorityFilter(priorityParam);
    setPriorityFilter((current) =>
      current === nextPriority ? current : nextPriority,
    );
  }, [priorityParam]);

  const filteredStudents = students.filter((student) => {
    const normalizedSearch = search.trim().toLowerCase();
    const matchesSearch =
      normalizedSearch.length === 0 ||
      student.name.toLowerCase().includes(normalizedSearch) ||
      student.email.toLowerCase().includes(normalizedSearch) ||
      student.userNumber.toLowerCase().includes(normalizedSearch);

    const matchesUserType =
      userTypeFilter === "all" || student.userType === userTypeFilter;
    const matchesCaseStatus =
      caseStatusFilter === "all" || student.caseStatus === caseStatusFilter;
    const matchesPriority =
      priorityFilter === "all" || student.priority === priorityFilter;

    return (
      matchesSearch &&
      matchesUserType &&
      matchesCaseStatus &&
      matchesPriority
    );
  });

  const selectedStudentId = studentIdParam || filteredStudents[0]?.studentId || null;
  const queryString = useMemo(() => searchParams?.toString() ?? "", [searchParams]);

  useEffect(() => {
    if (filteredStudents.length === 0) return;
    const currentStudentId = studentIdParam;
    const existsInFiltered = filteredStudents.some(
      (student) => student.studentId === currentStudentId,
    );

    if (!currentStudentId || !existsInFiltered) {
      const nextStudentId = filteredStudents[0].studentId;
      if (currentStudentId === nextStudentId) {
        return;
      }

      const nextParams = new URLSearchParams(queryString);
      nextParams.set("studentId", nextStudentId);
      router.replace(`${pathname}?${nextParams.toString()}`);
    }
  }, [filteredStudents, studentIdParam, queryString, pathname, router]);

  const { data: studentDetail, isLoading: loadingDetail } =
    useQuery<PsychologistStudentProfile>({
      queryKey: ["psychologist-student", selectedStudentId],
      queryFn: () => usersService.getPsychologistStudentById(selectedStudentId!),
      enabled: !!selectedStudentId,
    });

  const reviewMutation = useMutation({
    mutationFn: (assignmentId: string) =>
      assignmentService.markAssignmentAsReviewed(assignmentId),
    onSuccess: () => {
      notify.success("Prueba marcada como revisada.");
      queryClient.invalidateQueries({ queryKey: ["psychologist-dashboard"] });
      queryClient.invalidateQueries({ queryKey: ["psychologist-students"] });
      if (selectedStudentId) {
        queryClient.invalidateQueries({
          queryKey: ["psychologist-student", selectedStudentId],
        });
      }
    },
    onError: (error) => {
      const message = getApiErrorMessage(
        error,
        "No fue posible marcar la prueba como revisada.",
      );
      notify.error(Array.isArray(message) ? message.join(", ") : message);
    },
  });

  const bulkAssignMutation = useMutation({
    mutationFn: () =>
      assignmentService.bulkAssignPsychologistTest({
        testId: selectedTestId,
        studentIds: selectedStudentIds,
        dueAt: bulkDueAt || undefined,
      }),
    onSuccess: (result) => {
      notify.success(
        `Asignaciones creadas: ${result.createdCount}. Duplicadas omitidas: ${result.duplicateCount}.`,
      );
      if (result.unauthorizedCount > 0) {
        notify.error(
          `${result.unauthorizedCount} estudiantes no autorizados o inactivos fueron omitidos.`,
        );
      }
      setSelectedStudentIds([]);
      queryClient.invalidateQueries({ queryKey: ["psychologist-dashboard"] });
      queryClient.invalidateQueries({ queryKey: ["psychologist-students"] });
      if (selectedStudentId) {
        queryClient.invalidateQueries({
          queryKey: ["psychologist-student", selectedStudentId],
        });
      }
    },
    onError: (error) => {
      const message = getApiErrorMessage(
        error,
        "No fue posible procesar la asignación masiva.",
      );
      notify.error(Array.isArray(message) ? message.join(", ") : message);
    },
  });

  const handleSelectStudent = (studentId: string) => {
    if (studentId === studentIdParam) {
      return;
    }

    const nextParams = new URLSearchParams(queryString);
    nextParams.set("studentId", studentId);
    router.replace(`${pathname}?${nextParams.toString()}`);
  };

  const handleToggleStudentSelection = (studentId: string) => {
    setSelectedStudentIds((prev) =>
      prev.includes(studentId)
        ? prev.filter((id) => id !== studentId)
        : [...prev, studentId],
    );
  };

  const handleToggleAllVisibleStudents = () => {
    const visibleIds = filteredStudents.map((student) => student.studentId);
    const allSelected =
      visibleIds.length > 0 && visibleIds.every((id) => selectedStudentIds.includes(id));

    if (allSelected) {
      setSelectedStudentIds((prev) => prev.filter((id) => !visibleIds.includes(id)));
      return;
    }

    setSelectedStudentIds((prev) => [...new Set([...prev, ...visibleIds])]);
  };

  const canSubmitBulkAssign =
    Boolean(selectedTestId) && selectedStudentIds.length > 0;

  return {
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
    students,
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
  };
}
