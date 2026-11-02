import type { SignStatus } from "./data";

/**
 * The signs table has no x/y columns, so the Home constellation places
 * each sign on a fixed arc derived from its display order.
 */
export function signPosition(index: number, total: number): { x: number; y: number } {
  const step = total <= 1 ? 0.5 : index / (total - 1);
  const x = 7 + 86 * step;
  const y = 68 - 44 * Math.sin(Math.PI * step) - (index % 2 === 0 ? 7 : 0);
  return { x: Math.round(x * 10) / 10, y: Math.round(y * 10) / 10 };
}

export function mapSignStatus(status: string | null): SignStatus {
  if (status === "sudah_terjadi") return "done";
  if (status === "sedang_berlangsung") return "ongoing";
  return "future";
}
