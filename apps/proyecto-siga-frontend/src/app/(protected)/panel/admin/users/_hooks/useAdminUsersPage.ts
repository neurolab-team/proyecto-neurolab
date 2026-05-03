import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { usersService } from "@/services/users/users";
import { User, UserRole } from "@packages/common-types/user.types";

type AssignmentFilter = "all" | "assigned" | "unassigned";
type VerificationFilter = "all" | "verified" | "pending";

function resolveAssignmentFilter(value: string | null): AssignmentFilter {
  if (value === "assigned" || value === "unassigned") {
    return value;
  }
  return "all";
}

function getRoleBadgeColor(role: string): string {
  switch (role) {
    case "admin":
      return "bg-red-100 text-red-800";
    case "psychologist":
      return "bg-blue-100 text-blue-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
}

export function useAdminUsersPage() {
  const { user } = useAuth();
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();

  const [emailFilter, setEmailFilter] = useState("");
  const [verificationFilter, setVerificationFilter] =
    useState<VerificationFilter>("all");
  const [assignmentFilter, setAssignmentFilter] = useState<AssignmentFilter>("all");

  useEffect(() => {
    const queryFilter = resolveAssignmentFilter(searchParams?.get("assignment") ?? null);
    setAssignmentFilter((current) =>
      current === queryFilter ? current : queryFilter,
    );
  }, [searchParams]);

  const { data: usersData, isLoading: loadingUsers } = useQuery({
    queryKey: ["users"],
    queryFn: () => usersService.getAll(),
    enabled: !!user,
  });

  const updateRoleMutation = useMutation({
    mutationFn: ({ userId, role }: { userId: string; role: UserRole }) =>
      usersService.updateRole(userId, role),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });

  const assignPsychologistMutation = useMutation({
    mutationFn: ({
      userId,
      psychologistId,
    }: {
      userId: string;
      psychologistId: string | null;
    }) => usersService.assignPsychologist(userId, { psychologistId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });

  const users: User[] = usersData?.data || [];
  const psychologists = users.filter(
    (currentUser) => currentUser.role === "psychologist" && currentUser.isActive,
  );

  const filteredUsers = users.filter((currentUser) =>
    currentUser.email.toLowerCase().includes(emailFilter.toLowerCase()),
  );

  const verificationFilteredUsers = filteredUsers.filter((currentUser) => {
    if (verificationFilter === "verified") return currentUser.verifiedEmail;
    if (verificationFilter === "pending") return !currentUser.verifiedEmail;
    return true;
  });

  const assignmentFilteredUsers = verificationFilteredUsers.filter((currentUser) => {
    if (assignmentFilter === "all") return true;
    if (currentUser.role !== "user") return false;
    if (assignmentFilter === "assigned") {
      return Boolean(currentUser.assignedPsychologistId);
    }
    return !currentUser.assignedPsychologistId;
  });

  return {
    emailFilter,
    setEmailFilter,
    verificationFilter,
    setVerificationFilter,
    assignmentFilter,
    setAssignmentFilter,
    loadingUsers,
    assignmentFilteredUsers,
    psychologists,
    getRoleBadgeColor,
    isUpdatingRole: updateRoleMutation.isPending,
    isAssigningPsychologist: assignPsychologistMutation.isPending,
    updateRole: (payload: { userId: string; role: UserRole }) =>
      updateRoleMutation.mutate(payload),
    assignPsychologist: (payload: {
      userId: string;
      psychologistId: string | null;
    }) => assignPsychologistMutation.mutate(payload),
  };
}
