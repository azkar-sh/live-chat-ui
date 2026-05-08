/** Returns HH:MM:SS from an ISO string or "now". */
export function formatTime(value?: string | null): string {
  return new Date(value ?? Date.now()).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}

/** Returns "Today", "Yesterday", or a human-readable date. */
export function formatDateLabel(isoString?: string): string {
  if (!isoString) return "";
  const date = new Date(isoString);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);

  if (date.toDateString() === today.toDateString()) return "Today";
  if (date.toDateString() === yesterday.toDateString()) return "Yesterday";

  return date.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

/** Extracts a filename from a URL path. */
export function getFileName(url: string): string {
  try {
    const { pathname } = new URL(url);
    return pathname.split("/").filter(Boolean).pop() ?? "file";
  } catch {
    return url.split("/").filter(Boolean).pop() ?? "file";
  }
}
