import { useQuery } from "@tanstack/react-query";
import { recyclingService } from "@/services/recyclingService";

export const useRecyclingLogs = (userId: string | undefined) =>
  useQuery({
    queryKey: ["recycling-logs", userId],
    queryFn: () => recyclingService.fetchLogs(userId!),
    enabled: !!userId,
  });
