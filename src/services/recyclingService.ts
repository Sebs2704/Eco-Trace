import { supabase } from "@/integrations/supabase/client";
import type { RecyclingLog } from "@/types";

interface InsertLogPayload {
  user_id: string;
  material: string;
  quantity_kg: number;
  location: string;
  notes: string | null;
  qr_code: string;
  points_earned: number;
}

export const recyclingService = {
  async fetchLogs(userId: string): Promise<RecyclingLog[]> {
    const { data, error } = await supabase
      .from("recycling_logs")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(20);
    if (error) throw error;
    return (data ?? []) as RecyclingLog[];
  },

  async insertLog(payload: InsertLogPayload): Promise<void> {
    const { error } = await supabase.from("recycling_logs").insert(payload);
    if (error) throw error;
  },

  async fetchLeaderboard(limit = 5) {
    const { data, error } = await supabase
      .from("profiles")
      .select("full_name, points, streak")
      .order("points", { ascending: false })
      .limit(limit);
    if (error) throw error;
    return data ?? [];
  },

  async awardMissionPoints(userId: string, currentPoints: number, bonus: number): Promise<void> {
    const { error } = await supabase
      .from("profiles")
      .update({ points: currentPoints + bonus })
      .eq("user_id", userId);
    if (error) throw error;
  },
};
