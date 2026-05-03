import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { useModal } from "@/hooks/useModal";
import { usersService } from "@/services/users/users";
import { User } from "@packages/common-types/user.types";

export function useAdminDashboardData() {
  const { user } = useAuth();
  const { openModal } = useModal();
  const queryClient = useQueryClient();

  const { data: usersData, isLoading: loadingUsers } = useQuery({
    queryKey: ["users"],
    queryFn: () => usersService.getAll(),
    enabled: Boolean(user),
  });

  const users: User[] = usersData?.data || [];
  const psychologistsCount = users.filter(
    (currentUser) => currentUser.role === "psychologist",
  ).length;

  const openCreateUserModal = () => {
    openModal("register", {
      isAdminMode: true,
      onSuccess: () => {
        void queryClient.invalidateQueries({
          queryKey: ["users"],
        });
      },
    });
  };

  return {
    loadingUsers,
    usersCount: users.length,
    psychologistsCount,
    openCreateUserModal,
  };
}
