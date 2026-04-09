import { getMaterialById } from "@/constants/materials";

export const calculatePoints = (materialId: string, kg: number): number => {
  const material = getMaterialById(materialId);
  if (!material || kg <= 0) return 0;
  return Math.round(kg * material.pts_per_kg);
};
