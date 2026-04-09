import { useEffect, useRef } from "react";
import { toast } from "sonner";
import { MISSIONS } from "@/constants/missions";
import { recyclingService } from "@/services/recyclingService";
import type { RecyclingLog, UserProfile } from "@/types";

interface UseMissionsProps {
  userId: string | undefined;
  profile: UserProfile | null;
  logs: RecyclingLog[];
  loadingLogs: boolean;
  onAwarded: () => void;
}

export const useMissions = ({ userId, profile, logs, loadingLogs, onAwarded }: UseMissionsProps) => {
  const missionCheckDone = useRef(false);
  const onAwardedRef = useRef(onAwarded);
  onAwardedRef.current = onAwarded;

  const awardedKey = userId ? `eco_awarded_${userId}` : null;

  useEffect(() => {
    if (loadingLogs || !userId || !profile || !awardedKey || missionCheckDone.current) return;
    missionCheckDone.current = true;

    const awarded: string[] = JSON.parse(localStorage.getItem(awardedKey) ?? "[]");
    const totalKg = Number(profile.total_kg ?? 0);
    const streak  = profile.streak  ?? 0;
    const points  = profile.points  ?? 0;

    const newlyCompleted = MISSIONS.filter(
      (m) => !awarded.includes(m.id) && m.check(logs, totalKg, streak, points)
    );
    if (newlyCompleted.length === 0) return;

    const totalBonus = newlyCompleted.reduce((s, m) => s + m.bonus, 0);
    recyclingService.awardMissionPoints(userId, points, totalBonus).then(() => {
      localStorage.setItem(awardedKey, JSON.stringify([...awarded, ...newlyCompleted.map((m) => m.id)]));
      newlyCompleted.forEach((m) => toast.success(`🏅 Misión: "${m.title}" +${m.bonus} pts`));
      onAwardedRef.current();
    });
  }, [loadingLogs, logs, userId, profile, awardedKey]);

  const getAwardedIds = (): string[] =>
    JSON.parse(localStorage.getItem(awardedKey ?? "") ?? "[]");

  return { getAwardedIds };
};
