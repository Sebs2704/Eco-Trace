import { useQuery } from "@tanstack/react-query";
import { recyclingService } from "@/services/recyclingService";
import type { LeaderboardEntry } from "@/types";

const AVATARS = ["🌱", "🌿", "🍃", "♻️", "🌍", "🌎", "🌳", "🌲"];

const MOCK_LEADERBOARD: LeaderboardEntry[] = [
  { rank: 1, name: "María López",    points: 2850, avatar: "🌱", streak: 45 },
  { rank: 2, name: "Carlos Ruiz",    points: 2340, avatar: "🌿", streak: 32 },
  { rank: 3, name: "Ana García",     points: 2100, avatar: "🍃", streak: 28 },
  { rank: 4, name: "Pedro Martínez", points: 1890, avatar: "♻️", streak: 21 },
  { rank: 5, name: "Laura Díaz",     points: 1650, avatar: "🌍", streak: 15 },
];

export const useLeaderboard = () =>
  useQuery({
    queryKey: ["leaderboard"],
    queryFn: async (): Promise<LeaderboardEntry[]> => {
      const data = await recyclingService.fetchLeaderboard(5);
      if (!data.length) return MOCK_LEADERBOARD;
      return data.map((row, i) => ({
        rank: i + 1,
        name: row.full_name ?? "Reciclador",
        points: row.points ?? 0,
        avatar: AVATARS[i % AVATARS.length],
        streak: (row as { streak?: number }).streak ?? 0,
      }));
    },
    staleTime: 5 * 60 * 1000,
  });
