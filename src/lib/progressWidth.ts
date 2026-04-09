/**
 * Maps a percentage (0–100) to a Tailwind width class.
 * Needed because Tailwind can't generate classes from dynamic strings at runtime.
 */
export const progressWidth = (p: number): string => {
  if (p <= 0)  return "w-0";
  if (p <= 5)  return "w-[5%]";
  if (p <= 10) return "w-[10%]";
  if (p <= 15) return "w-[15%]";
  if (p <= 20) return "w-1/5";
  if (p <= 25) return "w-1/4";
  if (p <= 30) return "w-[30%]";
  if (p <= 33) return "w-1/3";
  if (p <= 40) return "w-2/5";
  if (p <= 45) return "w-[45%]";
  if (p <= 50) return "w-1/2";
  if (p <= 55) return "w-[55%]";
  if (p <= 60) return "w-3/5";
  if (p <= 66) return "w-2/3";
  if (p <= 70) return "w-[70%]";
  if (p <= 75) return "w-3/4";
  if (p <= 80) return "w-4/5";
  if (p <= 85) return "w-[85%]";
  if (p <= 90) return "w-[90%]";
  if (p <= 95) return "w-[95%]";
  return "w-full";
};
