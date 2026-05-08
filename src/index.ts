// Main component
export { default as LiveChat } from "./LiveChat";
export { default } from "./LiveChat";

// Hook — for advanced usage (headless)
export { useLiveChat } from "./hooks/use-live-chat";
export type {
  UseLiveChatConfig,
  UseLiveChatReturn,
  ToastItem,
} from "./hooks/use-live-chat";

// Theme helpers
export { resolveTheme } from "./theme";
export type { ResolvedTheme } from "./theme";

// All public types
export type {
  ConnectionStatus,
  MessageDirection,
  ContentType,
  LiveChatMessage,
  LiveChatMessageAttachment,
  HistoryMessage,
  UploadResult,
  ThemeColors,
  ToastTheme,
  LiveChatTheme,
  LiveChatProps,
} from "./types";
