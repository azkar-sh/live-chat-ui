import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
  type RefObject,
} from "react";
import { io, type Socket } from "socket.io-client";
import type {
  ConnectionStatus,
  ContentType,
  HistoryMessage,
  LiveChatMessage,
  UploadResult,
} from "../types";
import { decodeToken } from "../utils/decode-token";
import { formatTime, getFileName } from "../utils/format-time";

// ─── Internal types ───────────────────────────────────────────────────────────

export interface ToastItem {
  id: string;
  variant: "success" | "error" | "warning" | "info";
  title: string;
  description: string;
}

interface AttachmentDraft {
  file: File;
  name: string;
  contentType: "IMAGE" | "FILE";
  previewUrl?: string;
}

// ─── Hook config ──────────────────────────────────────────────────────────────

export interface UseLiveChatConfig {
  serverUrl: string;
  roomId: string;
  token: string;
  autoConnect?: boolean;
  historyPageSize?: number;
  onConnected?: () => void;
  onDisconnected?: (reason: string) => void;
  onError?: (error: Error) => void;
  onMessage?: (message: LiveChatMessage) => void;
  onUploadAttachment?: (file: File) => Promise<UploadResult>;
  onLoadHistory?: (params: {
    page: number;
    pageSize: number;
  }) => Promise<{ messages: HistoryMessage[]; hasMore: boolean }>;
}

// ─── Return shape ─────────────────────────────────────────────────────────────

export interface UseLiveChatReturn {
  connectionStatus: ConnectionStatus;
  statusText: string;
  messages: LiveChatMessage[];
  inputValue: string;
  setInputValue: (v: string) => void;
  unreadCount: number;
  isConnected: boolean;
  roomJoined: boolean;
  isAttachmentSending: boolean;
  isLoadingHistory: boolean;
  isNoMoreHistory: boolean;
  attachment: AttachmentDraft | null;
  toasts: ToastItem[];
  connect: () => void;
  disconnect: () => void;
  send: () => void;
  markAllRead: () => void;
  pickFile: () => void;
  clearAttachment: () => void;
  loadHistory: () => void;
  dismissToast: (id: string) => void;
  fileInputRef: RefObject<HTMLInputElement>;
  onFilePicked: (e: ChangeEvent<HTMLInputElement>) => void;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function uid() {
  return `local-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
}

function mapHistoryMsg(
  msg: HistoryMessage,
  currentUserId: string | undefined,
): LiveChatMessage {
  const isMine = Boolean(currentUserId && msg.senderId === currentUserId);
  const isFile = msg.contentType === "IMAGE" || msg.contentType === "FILE";
  const isImage = msg.contentType === "IMAGE";
  const ts = formatTime(msg.createdAt);

  if (isMine) {
    return {
      id: msg.id,
      content: isFile ? "" : msg.content,
      type: "outgoing",
      contentType: msg.contentType ?? "TEXT",
      timestamp: ts,
      createdAt: msg.createdAt,
      tickStatus: "sent",
      attachment: isFile
        ? {
            name: getFileName(msg.content),
            url: msg.content,
            isImage,
          }
        : undefined,
    };
  }

  return {
    id: msg.id,
    content: isFile ? "" : msg.content,
    type: "incoming",
    contentType: msg.contentType ?? "TEXT",
    senderName: msg.senderName ?? "?",
    timestamp: ts,
    createdAt: msg.createdAt,
    unread: false,
    attachment: isFile
      ? {
          name: getFileName(msg.content),
          url: msg.content,
          isImage,
        }
      : undefined,
  };
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useLiveChat(config: UseLiveChatConfig): UseLiveChatReturn {
  const {
    serverUrl,
    roomId,
    token,
    autoConnect = true,
    historyPageSize = 20,
    onConnected,
    onDisconnected,
    onError,
    onMessage,
    onUploadAttachment,
    onLoadHistory,
  } = config;

  const [connectionStatus, setConnectionStatus] =
    useState<ConnectionStatus>("idle");
  const [statusText, setStatusText] = useState("Not connected");
  const [messages, setMessages] = useState<LiveChatMessage[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [unreadCount, setUnreadCount] = useState(0);
  const [isConnected, setIsConnected] = useState(false);
  const [roomJoined, setRoomJoined] = useState(false);
  const [isAttachmentSending, setIsAttachmentSending] = useState(false);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  const [isNoMoreHistory, setIsNoMoreHistory] = useState(false);
  const [historyPage, setHistoryPage] = useState(0);
  const [attachment, setAttachment] = useState<AttachmentDraft | null>(null);
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const socketRef = useRef<Socket | null>(null);
  const userIdRef = useRef<string | undefined>(undefined);
  const pendingReads = useRef<Map<string, true>>(new Map());
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      socketRef.current?.disconnect();
    };
  }, []);

  // ── Toast helpers ─────────────────────────────────────────────────────────

  const pushToast = useCallback(
    (toast: Omit<ToastItem, "id">, ttlMs = 4000) => {
      const id = uid();
      setToasts((prev) => [...prev, { ...toast, id }]);
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, ttlMs);
    },
    [],
  );

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // ── Append message ────────────────────────────────────────────────────────

  const appendMsg = useCallback((msg: LiveChatMessage) => {
    setMessages((prev) => [...prev, msg]);
  }, []);

  // ── connect ───────────────────────────────────────────────────────────────

  const connect = useCallback(() => {
    const cleanToken = token
      .trim()
      .replace(/^Bearer\s+/i, "")
      .replace(/\s+/g, "");
    const cleanRoomId = roomId.trim();
    const base = serverUrl.trim().replace(/\/+$/, "");

    if (!cleanToken || !cleanRoomId || !base) {
      pushToast({
        variant: "warning",
        title: "Missing config",
        description: "serverUrl, roomId, and token are all required.",
      });
      return;
    }

    let parsedBase: URL;
    try {
      parsedBase = new URL(base);
    } catch {
      pushToast({
        variant: "error",
        title: "Invalid server URL",
        description: "Use a valid URL like https://api.example.com",
      });
      return;
    }

    if (!["http:", "https:"].includes(parsedBase.protocol)) {
      pushToast({
        variant: "error",
        title: "Unsupported protocol",
        description: "URL must start with http:// or https://",
      });
      return;
    }

    if (
      typeof window !== "undefined" &&
      window.location.protocol === "https:" &&
      parsedBase.protocol === "http:"
    ) {
      pushToast({
        variant: "warning",
        title: "Mixed content blocked",
        description:
          "HTTPS page cannot connect to an HTTP WebSocket. Use an HTTPS server URL.",
      });
      return;
    }

    const decoded = decodeToken(cleanToken);
    userIdRef.current = decoded.sub;

    // Tear down any existing socket cleanly
    socketRef.current?.disconnect();
    pendingReads.current.clear();
    setHistoryPage(0);
    setIsNoMoreHistory(false);
    setIsLoadingHistory(false);
    setMessages([]);
    setUnreadCount(0);
    setConnectionStatus("connecting");
    setStatusText("Connecting…");
    setIsConnected(false);
    setRoomJoined(false);

    const socket = io(base, {
      auth: { token: `Bearer ${cleanToken}` },
      transports: ["websocket"],
      timeout: 7000,
      reconnectionAttempts: 2,
    });
    socketRef.current = socket;

    const watchdog = setTimeout(() => {
      setConnectionStatus((prev) => {
        if (prev !== "connecting") return prev;
        setStatusText("Error: connection timeout");
        return "error";
      });
      pushToast({
        variant: "error",
        title: "Connection timeout",
        description: "No response from server. Check URL, CORS, and auth.",
      });
    }, 8000);

    socket.on("connect", () => {
      clearTimeout(watchdog);
      setConnectionStatus("connected");
      setStatusText("Connected · joining room…");
      setIsConnected(true);

      socket
        .timeout(6000)
        .emit(
          "room:join",
          { roomId: cleanRoomId },
          (
            err: unknown,
            ack: { ok?: boolean; error?: { message?: string } } | undefined,
          ) => {
            if (err || ack?.ok === false) {
              const msg =
                (err as Error)?.message ??
                ack?.error?.message ??
                "Unable to join room";
              setStatusText("Connected · room join failed");
              setRoomJoined(false);
              pushToast({
                variant: "error",
                title: "Room join failed",
                description: msg,
              });
              return;
            }

            setStatusText("Connected · room joined");
            setRoomJoined(true);
            pushToast({
              variant: "success",
              title: "Joined room",
              description: cleanRoomId,
            });
            onConnected?.();
          },
        );
    });

    socket.on("connect_error", (err) => {
      clearTimeout(watchdog);
      setConnectionStatus("error");
      setStatusText(`Error: ${err.message}`);
      setIsConnected(false);
      pushToast({
        variant: "error",
        title: "Connection error",
        description: err.message,
      });
      onError?.(err);
    });

    socket.on("disconnect", (reason) => {
      clearTimeout(watchdog);
      setConnectionStatus("idle");
      setStatusText(`Disconnected: ${reason}`);
      setIsConnected(false);
      setRoomJoined(false);
      appendMsg({
        id: `evt-${Date.now()}`,
        content: `Disconnected: ${reason}`,
        type: "event",
        contentType: "TEXT",
        timestamp: formatTime(),
      });
      onDisconnected?.(reason);
    });

    socket.on(
      "message:new",
      (p: {
        id: string;
        content: string;
        type?: ContentType;
        senderId: string;
        sender?: { username?: string };
        createdAt?: string;
      }) => {
        const isMine = Boolean(
          userIdRef.current && p.senderId === userIdRef.current,
        );

        // Outgoing: the server echoed our own message — update the optimistic
        // entry's id in case we used a local placeholder.
        if (isMine) {
          setMessages((prev) =>
            prev.map((m) =>
              m.id === p.id ? { ...m, tickStatus: "sent" as const } : m,
            ),
          );
          return;
        }

        const isFile = p.type === "IMAGE" || p.type === "FILE";
        const msg: LiveChatMessage = {
          id: p.id,
          content: isFile ? "" : p.content,
          type: "incoming",
          contentType: p.type ?? "TEXT",
          senderName: p.sender?.username ?? "?",
          timestamp: formatTime(p.createdAt),
          createdAt: p.createdAt,
          unread: true,
          attachment: isFile
            ? {
                name: getFileName(p.content),
                url: p.content,
                isImage: p.type === "IMAGE",
              }
            : undefined,
        };

        pendingReads.current.set(p.id, true);
        setUnreadCount((c) => c + 1);
        appendMsg(msg);
        onMessage?.(msg);
      },
    );

    socket.on("message:read", (p: { messageId: string; readerId: string }) => {
      // Someone else read our message — flip the tick to double-check
      if (p.readerId === userIdRef.current) return;
      setMessages((prev) =>
        prev.map((m) =>
          m.id === p.messageId ? { ...m, tickStatus: "read" as const } : m,
        ),
      );
    });
  }, [
    serverUrl,
    roomId,
    token,
    appendMsg,
    pushToast,
    onConnected,
    onDisconnected,
    onError,
    onMessage,
  ]);

  // ── Auto-connect when props are provided ──────────────────────────────────

  useEffect(() => {
    if (autoConnect && serverUrl && roomId && token) {
      connect();
    }
    // Re-run only when the three required props or autoConnect flag changes.
    // Omitting `connect` from deps intentionally to avoid double-connecting;
    // `connect` already captures the latest prop values via its own closure.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoConnect, serverUrl, roomId, token]);

  // ── disconnect ────────────────────────────────────────────────────────────

  const disconnect = useCallback(() => {
    socketRef.current?.disconnect();
    socketRef.current = null;
    pendingReads.current.clear();
    userIdRef.current = undefined;
    setMessages([]);
    setUnreadCount(0);
    setConnectionStatus("idle");
    setStatusText("Not connected");
    setIsConnected(false);
    setRoomJoined(false);
    setHistoryPage(0);
    setIsNoMoreHistory(false);
    setIsLoadingHistory(false);
  }, []);

  // ── Attachment management ─────────────────────────────────────────────────

  const clearAttachment = useCallback(() => {
    setAttachment((prev) => {
      if (prev?.previewUrl) URL.revokeObjectURL(prev.previewUrl);
      return null;
    });
    if (fileInputRef.current) fileInputRef.current.value = "";
  }, []);

  const onFilePicked = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const isImage = file.type.startsWith("image/");
    const previewUrl = isImage ? URL.createObjectURL(file) : undefined;
    setAttachment({
      file,
      name: file.name,
      contentType: isImage ? "IMAGE" : "FILE",
      previewUrl,
    });
  }, []);

  const pickFile = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  // ── send ──────────────────────────────────────────────────────────────────

  const send = useCallback(async () => {
    if (!socketRef.current?.connected || !roomJoined) return;

    const content = inputValue.trim();
    if (!content && !attachment) return;

    setInputValue("");

    // ── File message ──────────────────────────────────────────────────────
    if (attachment) {
      if (!onUploadAttachment) {
        pushToast({
          variant: "warning",
          title: "Upload not configured",
          description: "Provide the onUploadAttachment prop to send files.",
        });
        return;
      }

      const localId = uid();
      // Optimistic entry with local preview
      appendMsg({
        id: localId,
        content: "",
        type: "outgoing",
        contentType: attachment.contentType,
        timestamp: formatTime(),
        attachment: {
          name: attachment.name,
          url: attachment.previewUrl ?? "",
          isImage: attachment.contentType === "IMAGE",
        },
      });

      const captured = attachment;
      clearAttachment();
      setIsAttachmentSending(true);

      try {
        const result = await onUploadAttachment(captured.file);
        socketRef.current?.emit(
          "message:send",
          {
            roomId: roomId.trim(),
            content: result.url,
            type: result.contentType,
          },
          (ack: { id?: string } | undefined) => {
            if (ack?.id) {
              const serverId = ack.id;
              setMessages((prev) =>
                prev.map((m) =>
                  m.id === localId
                    ? {
                        ...m,
                        id: serverId,
                        attachment: m.attachment
                          ? { ...m.attachment, url: result.url }
                          : undefined,
                      }
                    : m,
                ),
              );
            }
          },
        );
      } catch (err) {
        pushToast({
          variant: "error",
          title: "Upload failed",
          description: (err as Error).message ?? "Could not upload file.",
        });
        setMessages((prev) => prev.filter((m) => m.id !== localId));
      } finally {
        setIsAttachmentSending(false);
      }

      return;
    }

    // ── Text message ──────────────────────────────────────────────────────
    const localId = uid();
    appendMsg({
      id: localId,
      content,
      type: "outgoing",
      contentType: "TEXT",
      timestamp: formatTime(),
      tickStatus: "sent",
    });

    socketRef.current.emit(
      "message:send",
      { roomId: roomId.trim(), content, type: "TEXT" },
      (ack: { id?: string } | undefined) => {
        if (ack?.id) {
          const serverId = ack.id;
          setMessages((prev) =>
            prev.map((m) => (m.id === localId ? { ...m, id: serverId } : m)),
          );
        }
      },
    );
  }, [
    inputValue,
    attachment,
    roomJoined,
    roomId,
    appendMsg,
    clearAttachment,
    onUploadAttachment,
    pushToast,
  ]);

  // ── markAllRead ───────────────────────────────────────────────────────────

  const markAllRead = useCallback(() => {
    const pending = [...pendingReads.current.keys()];
    if (!pending.length || !socketRef.current?.connected || !roomJoined) return;

    for (const msgId of pending) {
      socketRef.current.emit("message:read", { messageId: msgId });
    }

    pendingReads.current.clear();
    setUnreadCount(0);
    setMessages((prev) =>
      prev.map((m) => (m.unread ? { ...m, unread: false } : m)),
    );
  }, [roomJoined]);

  // ── loadHistory ───────────────────────────────────────────────────────────

  const loadHistory = useCallback(async () => {
    if (!onLoadHistory) return;
    if (isLoadingHistory || isNoMoreHistory) return;
    if (!roomJoined) {
      pushToast({
        variant: "warning",
        title: "Cannot load history",
        description: "Join a room first.",
      });
      return;
    }

    const nextPage = historyPage + 1;
    setIsLoadingHistory(true);

    try {
      const { messages: fetched, hasMore } = await onLoadHistory({
        page: nextPage,
        pageSize: historyPageSize,
      });

      setHistoryPage(nextPage);
      setIsNoMoreHistory(!hasMore || fetched.length === 0);

      const sorted = [...fetched].sort(
        (a, b) =>
          new Date(a.createdAt ?? 0).getTime() -
          new Date(b.createdAt ?? 0).getTime(),
      );

      const mapped = sorted.map((m) => mapHistoryMsg(m, userIdRef.current));

      setMessages((prev) => [
        ...mapped.filter((m) => !prev.some((existing) => existing.id === m.id)),
        ...prev,
      ]);
    } catch (err) {
      pushToast({
        variant: "error",
        title: "Failed to load history",
        description: (err as Error).message ?? "Unknown error.",
      });
    } finally {
      setIsLoadingHistory(false);
    }
  }, [
    onLoadHistory,
    historyPage,
    historyPageSize,
    isLoadingHistory,
    isNoMoreHistory,
    roomJoined,
    pushToast,
  ]);

  return {
    connectionStatus,
    statusText,
    messages,
    inputValue,
    setInputValue,
    unreadCount,
    isConnected,
    roomJoined,
    isAttachmentSending,
    isLoadingHistory,
    isNoMoreHistory,
    attachment,
    toasts,
    connect,
    disconnect,
    send,
    markAllRead,
    pickFile,
    clearAttachment,
    loadHistory,
    dismissToast,
    fileInputRef,
    onFilePicked,
  };
}
