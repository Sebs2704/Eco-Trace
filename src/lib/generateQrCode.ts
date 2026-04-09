export const generateQrCode = (materialId: string, canecaId?: string): string => {
  const materialCode = materialId.slice(0, 3).toUpperCase();
  const suffix = canecaId ? `-${canecaId}` : "";
  return `VLL-${Date.now()}-${materialCode}${suffix}`;
};
