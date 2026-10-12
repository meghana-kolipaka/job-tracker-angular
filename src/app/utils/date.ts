/** Today's date in local time as YYYY-MM-DD (toISOString would use UTC). */
export function todayIso(): string {
  const d = new Date();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${d.getFullYear()}-${month}-${day}`;
}

/** Whole days between an ISO date (YYYY-MM-DD) and today, local time. */
export function daysSince(iso: string): number {
  const then = new Date(`${iso}T00:00:00`);
  const now = new Date(`${todayIso()}T00:00:00`);
  return Math.round((now.getTime() - then.getTime()) / 86_400_000);
}
