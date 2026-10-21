export function roastTone(roast: string | null): string {
  if (!roast) return "var(--surface-strong)";
  const value = roast.toLowerCase();
  if (value.includes("light")) return "var(--tone-light)";
  if (value.includes("medium")) return "var(--tone-medium)";
  return "var(--tone-dark)";
}

export function roastInk(roast: string | null): string {
  return roast?.toLowerCase().includes("light") ? "var(--ink)" : "var(--bone)";
}
