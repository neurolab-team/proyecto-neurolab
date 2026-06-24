"use client";

import { useQuery } from "@tanstack/react-query";
import { publicTestsService } from "../../services/tests/publicTests";
import { PublicTestCard } from "@packages/common-types/test.types";

export function useLandingTests() {
  const query = useQuery<PublicTestCard[]>({
    queryKey: ["public-landing-tests"],
    queryFn: publicTestsService.getLandingTests,
    staleTime: 5 * 60 * 1000,
  });

  return {
    tests: query.data ?? [],
    isLoading: query.isLoading,
    hasError: query.isError,
    refetch: query.refetch,
  };
}
