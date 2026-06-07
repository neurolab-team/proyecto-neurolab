import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { assignmentService } from "@/services/assignment/assignment";

const EMPTY_ASSIGNED_TESTS: any[] = [];

export const useAssignedTests = () => {
  const { user } = useAuth();
  const userId = user?.userId;

  const { data, isLoading, isError } = useQuery({
    queryKey: ["assignedTests", userId],
    queryFn: () => assignmentService.getAllTests(userId as string),

    enabled: !!userId,
    select: (data: any[]) => {
      if (!Array.isArray(data)) return [];

      return data.map((item) => ({
        ...item,
        title: item.test?.title || "Sin Título",
        description: item.test?.description ?? null,
        testId: item.test?.testId,
        status: item.status,
        startDate: item.startedAt,
        dueDate: item.dueAt,
        assignmentId: item.assignmentId,
      }));
    },
  });

  return {
    tests: data ?? EMPTY_ASSIGNED_TESTS,
    isLoading,
    isError,
  };
};
