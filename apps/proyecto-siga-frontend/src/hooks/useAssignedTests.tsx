import { useQuery } from "@tanstack/react-query";
import { useAuth } from "./useAuth"; 
import { assignmentService } from "../services/assignment/assignment"; 

export const useAssignedTests = () => {
  const { accessToken, user } = useAuth(); 
  const userId = user?.userId!; 
 
  const { data, isLoading, isError } = useQuery({
    queryKey: ["assignedTests", userId],    
    queryFn: () => assignmentService.getAllTests(accessToken!, userId!),
    
    enabled: !!accessToken && !!userId,
    select: (data: any[]) => {
      if (!Array.isArray(data)) return []; 

      
      return data.map((item) => ({
        ...item,
        title: item.test?.title || "Sin Título",
        testId: item.test?.testId,
        status: item.status,
        startDate: item.startedAt,
        dueDate: item.dueAt,
        assignmentId: item.assignmentId
      }));
    }
  });

  return {
    tests: data || [], 
    isLoading,
    isError,
  };
};