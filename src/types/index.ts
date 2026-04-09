import type { ComponentType } from "react";

export interface UserProfile {
  full_name: string;
  points: number;
  streak: number;
  total_kg: number;
}

export interface RecyclingLog {
  id: string;
  material: string;
  quantity_kg: number;
  location: string;
  notes: string | null;
  qr_code: string | null;
  points_earned: number;
  created_at: string;
}

export interface Material {
  id: string;
  name: string;
  icon: ComponentType<{ size?: number; className?: string }>;
  color: string;
  pts_per_kg: number;
}

export interface Mission {
  id: string;
  title: string;
  desc: string;
  bonus: number;
  icon: ComponentType<{ size?: number; className?: string }>;
  check: (
    logs: Pick<RecyclingLog, "material" | "quantity_kg">[],
    totalKg: number,
    streak: number,
    points: number
  ) => boolean;
  currentVal: (
    logs: Pick<RecyclingLog, "material" | "quantity_kg">[],
    totalKg: number,
    streak: number,
    points: number
  ) => number;
  total: number;
}

export interface LeaderboardEntry {
  rank: number;
  name: string;
  points: number;
  avatar: string;
  streak: number;
}
