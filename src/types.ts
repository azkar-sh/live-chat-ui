import type React from "react";

// ─── Connection ────────────────────────────────────────────────────────────────

export type ConnectionStatus = "idle" | "connecting" | "connected" | "error";

// ─── Messages ──────────────────────────────────────────────────────────────────

export type MessageDirection = "incoming" | "outgoing" | "event";
export type ContentType = "TEXT" | "IMAGE" | "FILE";

export interface LiveChatMessageAttachment {
  name: string;
  url: string;
  isImage: boolean;
  mimeType?: string;
}

export interface LiveChatMessage {
  id: string;
  content: string;
  type: MessageDirection;
  contentType: ContentType;
  senderName?: string;
  timestamp: string;
  createdAt?: string;
  tickStatus?: "sent" | "read";
  unread?: boolean;
  attachment?: LiveChatMessageAttachment;
}

// ─── History (consumer-facing) ─────────────────────────────────────────────────

/**
 * Shape of each message returned by your onLoadHistory callback.
 * senderId is used to distinguish outgoing vs incoming messages.
 */
export interface HistoryMessage {
  id: string;
  content: string;
  contentType?: ContentType;
  senderId?: string;
  senderName?: string;
  createdAt?: string;
}

// ─── Attachment upload ─────────────────────────────────────────────────────────

export interface UploadResult {
  /** Public URL of the uploaded file. */
  url: string;
  /** Whether the file is an image or a generic file attachment. */
  contentType: "IMAGE" | "FILE";
}

// ─── Theme ────────────────────────────────────────────────────────────────────

/**
 * Fine-grained color overrides. Every field is optional — only supply what you
 * want to change from the base dark/light preset.
 */
export interface ThemeColors {
  // Panel shell
  background?: string;
  border?: string;
  // Header bar
  headerBackground?: string;
  headerText?: string;
  statusText?: string;
  // Messages area background
  messagesBackground?: string;
  emptyText?: string;
  // Outgoing bubble
  outgoingBackground?: string;
  outgoingText?: string;
  outgoingTick?: string;
  outgoingTickRead?: string;
  // Incoming bubble
  incomingBackground?: string;
  incomingText?: string;
  incomingName?: string;
  // Event / system message
  eventText?: string;
  eventBorder?: string;
  // Composer bar
  composerBackground?: string;
  composerBorder?: string;
  inputBackground?: string;
  inputText?: string;
  inputPlaceholder?: string;
  // Buttons
  sendBackground?: string;
  sendText?: string;
  attachBackground?: string;
  attachBorder?: string;
  attachText?: string;
  // "Load older messages" button
  loadMoreBackground?: string;
  loadMoreBorder?: string;
  loadMoreText?: string;
  // Misc
  timestamp?: string;
  unreadBadgeBackground?: string;
  unreadBadgeText?: string;
  // Connection-status dot
  dotIdle?: string;
  dotConnecting?: string;
  dotConnected?: string;
  dotError?: string;
}

export interface ToastTheme {
  successBackground?: string;
  errorBackground?: string;
  warningBackground?: string;
  infoBackground?: string;
  textColor?: string;
}

export interface LiveChatTheme {
  /** Base preset. Defaults to "dark". */
  mode?: "dark" | "light";
  /** Override individual colors on top of the base preset. */
  colors?: Partial<ThemeColors>;
  /** Override toast notification colors. */
  toast?: Partial<ToastTheme>;
}

// ─── Main component props ─────────────────────────────────────────────────────

export interface LiveChatProps {
  // ── Required connection config ────────────────────────────────────────────
  /** Socket.IO server URL, e.g. "https://api.example.com" */
  serverUrl: string;
  /** Room ID to join after connecting. */
  roomId: string;
  /** JWT access token (with or without "Bearer " prefix). */
  token: string;

  // ── Appearance ────────────────────────────────────────────────────────────
  /** Title shown in the panel header. Defaults to "Chat". */
  title?: string;
  /** Theme configuration (preset + optional color overrides). */
  theme?: LiveChatTheme;
  /** Input placeholder text. Defaults to "Type a message…". */
  placeholder?: string;
  /** Text shown when there are no messages yet. */
  emptyStateText?: string;

  // ── Behaviour ─────────────────────────────────────────────────────────────
  /**
   * Connect automatically when the component mounts (and reconnect when
   * serverUrl / roomId / token change). Defaults to true.
   */
  autoConnect?: boolean;
  /** Show the paperclip attachment button. Defaults to true. */
  showAttachmentButton?: boolean;
  /** File types accepted by the hidden file input. Defaults to "*\/*". */
  attachmentAccept?: string;
  /** Number of messages fetched per history page. Defaults to 20. */
  historyPageSize?: number;

  // ── Event callbacks ───────────────────────────────────────────────────────
  onConnected?: () => void;
  onDisconnected?: (reason: string) => void;
  onError?: (error: Error) => void;
  /** Fired for every incoming message from other users. */
  onMessage?: (message: LiveChatMessage) => void;

  // ── Async action handlers ─────────────────────────────────────────────────
  /**
   * Required to enable file/image sending.
   * Upload the file to your storage and return its public URL + type.
   *
   * @example
   * onUploadAttachment={async (file) => {
   *   const form = new FormData();
   *   form.append("file", file);
   *   const res = await fetch("/api/upload", { method: "POST", body: form });
   *   const { url } = await res.json();
   *   return { url, contentType: file.type.startsWith("image/") ? "IMAGE" : "FILE" };
   * }}
   */
  onUploadAttachment?: (file: File) => Promise<UploadResult>;

  /**
   * Required to enable the "Load older messages" button.
   * Fetch a page of history from your backend and return it in this shape.
   *
   * @example
   * onLoadHistory={async ({ page, pageSize }) => {
   *   const res = await fetch(`/api/rooms/${roomId}/messages?page=${page}&limit=${pageSize}`);
   *   const { data, meta } = await res.json();
   *   return {
   *     messages: data.map(m => ({
   *       id: m.id, content: m.content, contentType: m.type,
   *       senderId: m.senderId, senderName: m.sender?.username, createdAt: m.createdAt,
   *     })),
   *     hasMore: meta.current_page < meta.last_page,
   *   };
   * }}
   */
  onLoadHistory?: (params: {
    page: number;
    pageSize: number;
  }) => Promise<{ messages: HistoryMessage[]; hasMore: boolean }>;

  // ── Container ─────────────────────────────────────────────────────────────
  /** Inline styles applied to the outermost container div. */
  style?: React.CSSProperties;
  /** CSS class applied to the outermost container div. */
  className?: string;
}
