import type { ThemeColors, ToastTheme, LiveChatTheme } from "./types";

// ─── Dark preset ──────────────────────────────────────────────────────────────

const darkColors: ThemeColors = {
  background: "#18181b",
  border: "#27272a",
  headerBackground: "#09090b",
  headerText: "#f4f4f5",
  statusText: "#71717a",
  messagesBackground: "#18181b",
  emptyText: "#52525b",
  outgoingBackground: "#7c3aed",
  outgoingText: "#ffffff",
  outgoingTick: "rgba(255,255,255,0.45)",
  outgoingTickRead: "#ffffff",
  incomingBackground: "#27272a",
  incomingText: "#f4f4f5",
  incomingName: "#a1a1aa",
  eventText: "#71717a",
  eventBorder: "#3f3f46",
  composerBackground: "#09090b",
  composerBorder: "#27272a",
  inputBackground: "#27272a",
  inputText: "#f4f4f5",
  inputPlaceholder: "#52525b",
  sendBackground: "#7c3aed",
  sendText: "#ffffff",
  attachBackground: "transparent",
  attachBorder: "#7c3aed",
  attachText: "#a78bfa",
  loadMoreBackground: "#09090b",
  loadMoreBorder: "#93c5fd",
  loadMoreText: "#93c5fd",
  timestamp: "#71717a",
  unreadBadgeBackground: "#7c3aed",
  unreadBadgeText: "#ffffff",
  dotIdle: "#71717a",
  dotConnecting: "#fbbf24",
  dotConnected: "#7c3aed",
  dotError: "#ef4444",
};

const darkToast: ToastTheme = {
  successBackground: "#14532d",
  errorBackground: "#7f1d1d",
  warningBackground: "#78350f",
  infoBackground: "#1e3a5f",
  textColor: "#f4f4f5",
};

// ─── Light preset ─────────────────────────────────────────────────────────────

const lightColors: ThemeColors = {
  background: "#ffffff",
  border: "#e4e4e7",
  headerBackground: "#fafafa",
  headerText: "#09090b",
  statusText: "#71717a",
  messagesBackground: "#f4f4f5",
  emptyText: "#a1a1aa",
  outgoingBackground: "#7c3aed",
  outgoingText: "#ffffff",
  outgoingTick: "rgba(255,255,255,0.7)",
  outgoingTickRead: "#ffffff",
  incomingBackground: "#ffffff",
  incomingText: "#18181b",
  incomingName: "#71717a",
  eventText: "#71717a",
  eventBorder: "#d4d4d8",
  composerBackground: "#ffffff",
  composerBorder: "#e4e4e7",
  inputBackground: "#f4f4f5",
  inputText: "#18181b",
  inputPlaceholder: "#a1a1aa",
  sendBackground: "#7c3aed",
  sendText: "#ffffff",
  attachBackground: "transparent",
  attachBorder: "#7c3aed",
  attachText: "#7c3aed",
  loadMoreBackground: "#ffffff",
  loadMoreBorder: "#3b82f6",
  loadMoreText: "#3b82f6",
  timestamp: "#a1a1aa",
  unreadBadgeBackground: "#7c3aed",
  unreadBadgeText: "#ffffff",
  dotIdle: "#a1a1aa",
  dotConnecting: "#f59e0b",
  dotConnected: "#7c3aed",
  dotError: "#ef4444",
};

const lightToast: ToastTheme = {
  successBackground: "#dcfce7",
  errorBackground: "#fee2e2",
  warningBackground: "#fef9c3",
  infoBackground: "#dbeafe",
  textColor: "#18181b",
};

// ─── Resolved theme ───────────────────────────────────────────────────────────

export interface ResolvedTheme {
  colors: ThemeColors;
  toast: ToastTheme;
}

/**
 * Merges the chosen mode preset with any user-provided color overrides.
 * Always returns a fully-populated theme object.
 */
export function resolveTheme(theme?: LiveChatTheme): ResolvedTheme {
  const baseColors = theme?.mode === "light" ? lightColors : darkColors;
  const baseToast = theme?.mode === "light" ? lightToast : darkToast;

  return {
    colors: { ...baseColors, ...theme?.colors },
    toast: { ...baseToast, ...theme?.toast },
  };
}
