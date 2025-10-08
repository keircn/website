export function getStatusPriority(status: string): number {
  if (!status || status === "OTHER") return 50;
  if (status === "CURRENT") return 0;
  if (status === "PLANNING") return 10;
  if (status === "COMPLETED") return 20;
  if (status === "REPEATING") return 25;
  if (status === "PAUSED") return 90;
  if (status === "DROPPED") return 100;
  return 30;
}

export function getStatusLabel(status: string, name?: string): string {
  if (!status || status === "OTHER") return "Unflowed";
  if (status === "CURRENT") return "Watching";
  if (status === "PLANNING") return "Plan to Watch";
  if (status === "COMPLETED") return "Completed";
  if (status === "PAUSED") return "Paused";
  if (status === "DROPPED") return "Dropped";
  return name || status;
}

export function isStatusMuted(status: string): boolean {
  return status === "PAUSED" || status === "DROPPED";
}
