const STORAGE_KEY = "recently-viewed";
const MAX_ITEMS = 6;

export function readRecentlyViewed(): number[] {
  if (typeof window === "undefined") return [];
  try {
    const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    return Array.isArray(parsed) ? parsed.filter((id): id is number => typeof id === "number") : [];
  } catch {
    return [];
  }
}

export function recordRecentlyViewed(productId: number): void {
  if (typeof window === "undefined") return;
  const recent = readRecentlyViewed().filter((id) => id !== productId);
  localStorage.setItem(STORAGE_KEY, JSON.stringify([productId, ...recent].slice(0, MAX_ITEMS)));
}
