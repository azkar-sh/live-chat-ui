"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var index_exports = {};
__export(index_exports, {
  LiveChat: () => LiveChat,
  default: () => LiveChat,
  resolveTheme: () => resolveTheme,
  useLiveChat: () => useLiveChat
});
module.exports = __toCommonJS(index_exports);

// src/LiveChat.tsx
var import_react2 = require("react");

// src/theme.ts
var darkColors = {
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
  dotError: "#ef4444"
};
var darkToast = {
  successBackground: "#14532d",
  errorBackground: "#7f1d1d",
  warningBackground: "#78350f",
  infoBackground: "#1e3a5f",
  textColor: "#f4f4f5"
};
var lightColors = {
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
  dotError: "#ef4444"
};
var lightToast = {
  successBackground: "#dcfce7",
  errorBackground: "#fee2e2",
  warningBackground: "#fef9c3",
  infoBackground: "#dbeafe",
  textColor: "#18181b"
};
function resolveTheme(theme) {
  const baseColors = theme?.mode === "light" ? lightColors : darkColors;
  const baseToast = theme?.mode === "light" ? lightToast : darkToast;
  return {
    colors: { ...baseColors, ...theme?.colors },
    toast: { ...baseToast, ...theme?.toast }
  };
}

// src/hooks/use-live-chat.ts
var import_react = require("react");
var import_socket = require("socket.io-client");

// src/utils/decode-token.ts
function decodeToken(token) {
  try {
    const clean = token.trim().replace(/^Bearer\s+/i, "").replace(/\s+/g, "");
    const parts = clean.split(".");
    const payload = parts.length >= 3 ? parts[1] : parts[0];
    if (!payload) return {};
    return JSON.parse(atob(payload.replace(/-/g, "+").replace(/_/g, "/")));
  } catch {
    return {};
  }
}

// src/utils/format-time.ts
function formatTime(value) {
  return new Date(value ?? Date.now()).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit"
  });
}
function formatDateLabel(isoString) {
  if (!isoString) return "";
  const date = new Date(isoString);
  const today = /* @__PURE__ */ new Date();
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);
  if (date.toDateString() === today.toDateString()) return "Today";
  if (date.toDateString() === yesterday.toDateString()) return "Yesterday";
  return date.toLocaleDateString(void 0, {
    month: "short",
    day: "numeric",
    year: "numeric"
  });
}
function getFileName(url) {
  try {
    const { pathname } = new URL(url);
    return pathname.split("/").filter(Boolean).pop() ?? "file";
  } catch {
    return url.split("/").filter(Boolean).pop() ?? "file";
  }
}

// src/hooks/use-live-chat.ts
function uid() {
  return `local-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
}
function mapHistoryMsg(msg, currentUserId) {
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
      attachment: isFile ? {
        name: getFileName(msg.content),
        url: msg.content,
        isImage
      } : void 0
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
    attachment: isFile ? {
      name: getFileName(msg.content),
      url: msg.content,
      isImage
    } : void 0
  };
}
function useLiveChat(config) {
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
    onLoadHistory
  } = config;
  const [connectionStatus, setConnectionStatus] = (0, import_react.useState)("idle");
  const [statusText, setStatusText] = (0, import_react.useState)("Not connected");
  const [messages, setMessages] = (0, import_react.useState)([]);
  const [inputValue, setInputValue] = (0, import_react.useState)("");
  const [unreadCount, setUnreadCount] = (0, import_react.useState)(0);
  const [isConnected, setIsConnected] = (0, import_react.useState)(false);
  const [roomJoined, setRoomJoined] = (0, import_react.useState)(false);
  const [isAttachmentSending, setIsAttachmentSending] = (0, import_react.useState)(false);
  const [isLoadingHistory, setIsLoadingHistory] = (0, import_react.useState)(false);
  const [isNoMoreHistory, setIsNoMoreHistory] = (0, import_react.useState)(false);
  const [historyPage, setHistoryPage] = (0, import_react.useState)(0);
  const [attachment, setAttachment] = (0, import_react.useState)(null);
  const [toasts, setToasts] = (0, import_react.useState)([]);
  const socketRef = (0, import_react.useRef)(null);
  const userIdRef = (0, import_react.useRef)(void 0);
  const pendingReads = (0, import_react.useRef)(/* @__PURE__ */ new Map());
  const fileInputRef = (0, import_react.useRef)(null);
  (0, import_react.useEffect)(() => {
    return () => {
      socketRef.current?.disconnect();
    };
  }, []);
  const pushToast = (0, import_react.useCallback)(
    (toast, ttlMs = 4e3) => {
      const id = uid();
      setToasts((prev) => [...prev, { ...toast, id }]);
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, ttlMs);
    },
    []
  );
  const dismissToast = (0, import_react.useCallback)((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);
  const appendMsg = (0, import_react.useCallback)((msg) => {
    setMessages((prev) => [...prev, msg]);
  }, []);
  const connect = (0, import_react.useCallback)(() => {
    const cleanToken = token.trim().replace(/^Bearer\s+/i, "").replace(/\s+/g, "");
    const cleanRoomId = roomId.trim();
    const base = serverUrl.trim().replace(/\/+$/, "");
    if (!cleanToken || !cleanRoomId || !base) {
      pushToast({
        variant: "warning",
        title: "Missing config",
        description: "serverUrl, roomId, and token are all required."
      });
      return;
    }
    let parsedBase;
    try {
      parsedBase = new URL(base);
    } catch {
      pushToast({
        variant: "error",
        title: "Invalid server URL",
        description: "Use a valid URL like https://api.example.com"
      });
      return;
    }
    if (!["http:", "https:"].includes(parsedBase.protocol)) {
      pushToast({
        variant: "error",
        title: "Unsupported protocol",
        description: "URL must start with http:// or https://"
      });
      return;
    }
    if (typeof window !== "undefined" && window.location.protocol === "https:" && parsedBase.protocol === "http:") {
      pushToast({
        variant: "warning",
        title: "Mixed content blocked",
        description: "HTTPS page cannot connect to an HTTP WebSocket. Use an HTTPS server URL."
      });
      return;
    }
    const decoded = decodeToken(cleanToken);
    userIdRef.current = decoded.sub;
    socketRef.current?.disconnect();
    pendingReads.current.clear();
    setHistoryPage(0);
    setIsNoMoreHistory(false);
    setIsLoadingHistory(false);
    setMessages([]);
    setUnreadCount(0);
    setConnectionStatus("connecting");
    setStatusText("Connecting\u2026");
    setIsConnected(false);
    setRoomJoined(false);
    const socket = (0, import_socket.io)(base, {
      auth: { token: `Bearer ${cleanToken}` },
      transports: ["websocket"],
      timeout: 7e3,
      reconnectionAttempts: 2
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
        description: "No response from server. Check URL, CORS, and auth."
      });
    }, 8e3);
    socket.on("connect", () => {
      clearTimeout(watchdog);
      setConnectionStatus("connected");
      setStatusText("Connected \xB7 joining room\u2026");
      setIsConnected(true);
      socket.timeout(6e3).emit(
        "room:join",
        { roomId: cleanRoomId },
        (err, ack) => {
          if (err || ack?.ok === false) {
            const msg = err?.message ?? ack?.error?.message ?? "Unable to join room";
            setStatusText("Connected \xB7 room join failed");
            setRoomJoined(false);
            pushToast({
              variant: "error",
              title: "Room join failed",
              description: msg
            });
            return;
          }
          setStatusText("Connected \xB7 room joined");
          setRoomJoined(true);
          pushToast({
            variant: "success",
            title: "Joined room",
            description: cleanRoomId
          });
          onConnected?.();
        }
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
        description: err.message
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
        timestamp: formatTime()
      });
      onDisconnected?.(reason);
    });
    socket.on(
      "message:new",
      (p) => {
        const isMine = Boolean(
          userIdRef.current && p.senderId === userIdRef.current
        );
        if (isMine) {
          setMessages(
            (prev) => prev.map(
              (m) => m.id === p.id ? { ...m, tickStatus: "sent" } : m
            )
          );
          return;
        }
        const isFile = p.type === "IMAGE" || p.type === "FILE";
        const msg = {
          id: p.id,
          content: isFile ? "" : p.content,
          type: "incoming",
          contentType: p.type ?? "TEXT",
          senderName: p.sender?.username ?? "?",
          timestamp: formatTime(p.createdAt),
          createdAt: p.createdAt,
          unread: true,
          attachment: isFile ? {
            name: getFileName(p.content),
            url: p.content,
            isImage: p.type === "IMAGE"
          } : void 0
        };
        pendingReads.current.set(p.id, true);
        setUnreadCount((c) => c + 1);
        appendMsg(msg);
        onMessage?.(msg);
      }
    );
    socket.on("message:read", (p) => {
      if (p.readerId === userIdRef.current) return;
      setMessages(
        (prev) => prev.map(
          (m) => m.id === p.messageId ? { ...m, tickStatus: "read" } : m
        )
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
    onMessage
  ]);
  (0, import_react.useEffect)(() => {
    if (autoConnect && serverUrl && roomId && token) {
      connect();
    }
  }, [autoConnect, serverUrl, roomId, token]);
  const disconnect = (0, import_react.useCallback)(() => {
    socketRef.current?.disconnect();
    socketRef.current = null;
    pendingReads.current.clear();
    userIdRef.current = void 0;
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
  const clearAttachment = (0, import_react.useCallback)(() => {
    setAttachment((prev) => {
      if (prev?.previewUrl) URL.revokeObjectURL(prev.previewUrl);
      return null;
    });
    if (fileInputRef.current) fileInputRef.current.value = "";
  }, []);
  const onFilePicked = (0, import_react.useCallback)((e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const isImage = file.type.startsWith("image/");
    const previewUrl = isImage ? URL.createObjectURL(file) : void 0;
    setAttachment({
      file,
      name: file.name,
      contentType: isImage ? "IMAGE" : "FILE",
      previewUrl
    });
  }, []);
  const pickFile = (0, import_react.useCallback)(() => {
    fileInputRef.current?.click();
  }, []);
  const send = (0, import_react.useCallback)(async () => {
    if (!socketRef.current?.connected || !roomJoined) return;
    const content = inputValue.trim();
    if (!content && !attachment) return;
    setInputValue("");
    if (attachment) {
      if (!onUploadAttachment) {
        pushToast({
          variant: "warning",
          title: "Upload not configured",
          description: "Provide the onUploadAttachment prop to send files."
        });
        return;
      }
      const localId2 = uid();
      appendMsg({
        id: localId2,
        content: "",
        type: "outgoing",
        contentType: attachment.contentType,
        timestamp: formatTime(),
        attachment: {
          name: attachment.name,
          url: attachment.previewUrl ?? "",
          isImage: attachment.contentType === "IMAGE"
        }
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
            type: result.contentType
          },
          (ack) => {
            if (ack?.id) {
              const serverId = ack.id;
              setMessages(
                (prev) => prev.map(
                  (m) => m.id === localId2 ? {
                    ...m,
                    id: serverId,
                    attachment: m.attachment ? { ...m.attachment, url: result.url } : void 0
                  } : m
                )
              );
            }
          }
        );
      } catch (err) {
        pushToast({
          variant: "error",
          title: "Upload failed",
          description: err.message ?? "Could not upload file."
        });
        setMessages((prev) => prev.filter((m) => m.id !== localId2));
      } finally {
        setIsAttachmentSending(false);
      }
      return;
    }
    const localId = uid();
    appendMsg({
      id: localId,
      content,
      type: "outgoing",
      contentType: "TEXT",
      timestamp: formatTime(),
      tickStatus: "sent"
    });
    socketRef.current.emit(
      "message:send",
      { roomId: roomId.trim(), content, type: "TEXT" },
      (ack) => {
        if (ack?.id) {
          const serverId = ack.id;
          setMessages(
            (prev) => prev.map((m) => m.id === localId ? { ...m, id: serverId } : m)
          );
        }
      }
    );
  }, [
    inputValue,
    attachment,
    roomJoined,
    roomId,
    appendMsg,
    clearAttachment,
    onUploadAttachment,
    pushToast
  ]);
  const markAllRead = (0, import_react.useCallback)(() => {
    const pending = [...pendingReads.current.keys()];
    if (!pending.length || !socketRef.current?.connected || !roomJoined) return;
    for (const msgId of pending) {
      socketRef.current.emit("message:read", { messageId: msgId });
    }
    pendingReads.current.clear();
    setUnreadCount(0);
    setMessages(
      (prev) => prev.map((m) => m.unread ? { ...m, unread: false } : m)
    );
  }, [roomJoined]);
  const loadHistory = (0, import_react.useCallback)(async () => {
    if (!onLoadHistory) return;
    if (isLoadingHistory || isNoMoreHistory) return;
    if (!roomJoined) {
      pushToast({
        variant: "warning",
        title: "Cannot load history",
        description: "Join a room first."
      });
      return;
    }
    const nextPage = historyPage + 1;
    setIsLoadingHistory(true);
    try {
      const { messages: fetched, hasMore } = await onLoadHistory({
        page: nextPage,
        pageSize: historyPageSize
      });
      setHistoryPage(nextPage);
      setIsNoMoreHistory(!hasMore || fetched.length === 0);
      const sorted = [...fetched].sort(
        (a, b) => new Date(a.createdAt ?? 0).getTime() - new Date(b.createdAt ?? 0).getTime()
      );
      const mapped = sorted.map((m) => mapHistoryMsg(m, userIdRef.current));
      setMessages((prev) => [
        ...mapped.filter((m) => !prev.some((existing) => existing.id === m.id)),
        ...prev
      ]);
    } catch (err) {
      pushToast({
        variant: "error",
        title: "Failed to load history",
        description: err.message ?? "Unknown error."
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
    pushToast
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
    onFilePicked
  };
}

// src/components/DateDivider.tsx
var import_jsx_runtime = require("react/jsx-runtime");
function DateDivider({ datePrev, dateNext, colors }) {
  if (!dateNext) return null;
  if (datePrev && datePrev.slice(0, 10) === dateNext.slice(0, 10)) return null;
  const label = formatDateLabel(dateNext);
  if (!label) return null;
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
    "div",
    {
      style: {
        display: "flex",
        alignItems: "center",
        gap: "12px",
        fontSize: "11px",
        color: colors.emptyText ?? "#71717a",
        margin: "8px 0"
      },
      children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
          "div",
          {
            style: {
              flex: 1,
              height: "1px",
              background: colors.eventBorder ?? "#3f3f46"
            }
          }
        ),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: label }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
          "div",
          {
            style: {
              flex: 1,
              height: "1px",
              background: colors.eventBorder ?? "#3f3f46"
            }
          }
        )
      ]
    }
  );
}

// src/components/Icons.tsx
var import_jsx_runtime2 = require("react/jsx-runtime");
function SendIcon({ size = 16 }) {
  return /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)(
    "svg",
    {
      width: size,
      height: size,
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: "currentColor",
      strokeWidth: 2,
      strokeLinecap: "round",
      strokeLinejoin: "round",
      "aria-hidden": "true",
      children: [
        /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("path", { d: "M22 2L11 13" }),
        /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("path", { d: "M22 2L15 22L11 13L2 9L22 2Z" })
      ]
    }
  );
}
function PaperclipIcon({ size = 16 }) {
  return /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
    "svg",
    {
      width: size,
      height: size,
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: "currentColor",
      strokeWidth: 2,
      strokeLinecap: "round",
      strokeLinejoin: "round",
      "aria-hidden": "true",
      children: /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("path", { d: "M21.44 11.05l-9.19 9.19a6 6 0 01-8.49-8.49l9.19-9.19a4 4 0 015.66 5.66l-9.2 9.19a2 2 0 01-2.83-2.83l8.49-8.48" })
    }
  );
}
function XIcon({ size = 14 }) {
  return /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)(
    "svg",
    {
      width: size,
      height: size,
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: "currentColor",
      strokeWidth: 2.5,
      strokeLinecap: "round",
      strokeLinejoin: "round",
      "aria-hidden": "true",
      children: [
        /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("line", { x1: "18", y1: "6", x2: "6", y2: "18" }),
        /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("line", { x1: "6", y1: "6", x2: "18", y2: "18" })
      ]
    }
  );
}
function SpinnerIcon({ size = 16 }) {
  return /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
    "svg",
    {
      width: size,
      height: size,
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: "currentColor",
      strokeWidth: 2,
      strokeLinecap: "round",
      strokeLinejoin: "round",
      "aria-hidden": "true",
      style: { animation: "live-chat-spin 1s linear infinite" },
      children: /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("path", { d: "M21 12a9 9 0 1 1-6.219-8.56" })
    }
  );
}
function injectSpinKeyframe() {
  if (typeof document === "undefined" || document.getElementById("live-chat-keyframes")) {
    return;
  }
  const style = document.createElement("style");
  style.id = "live-chat-keyframes";
  style.textContent = `@keyframes live-chat-spin { to { transform: rotate(360deg); } }`;
  document.head.appendChild(style);
}

// src/components/ToastList.tsx
var import_jsx_runtime3 = require("react/jsx-runtime");
var variantBg = {
  success: "successBackground",
  error: "errorBackground",
  warning: "warningBackground",
  info: "infoBackground"
};
var variantIcon = {
  success: "\u2713",
  error: "\u2715",
  warning: "\u26A0",
  info: "\u2139"
};
function ToastList({ toasts, onDismiss, theme }) {
  if (!toasts.length) return null;
  return /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(
    "div",
    {
      style: {
        position: "absolute",
        bottom: "80px",
        right: "12px",
        display: "flex",
        flexDirection: "column",
        gap: "8px",
        zIndex: 50,
        maxWidth: "280px",
        pointerEvents: "none"
      },
      children: toasts.map((t) => {
        const bgKey = variantBg[t.variant];
        const bg = theme[bgKey] ?? "#27272a";
        const color = theme.textColor ?? "#f4f4f5";
        return /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)(
          "div",
          {
            style: {
              background: bg,
              color,
              borderRadius: "8px",
              padding: "10px 12px",
              fontSize: "12px",
              lineHeight: 1.4,
              display: "flex",
              alignItems: "flex-start",
              gap: "8px",
              boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
              pointerEvents: "auto"
            },
            children: [
              /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(
                "span",
                {
                  style: {
                    fontWeight: 700,
                    fontSize: "13px",
                    flexShrink: 0,
                    marginTop: "1px"
                  },
                  children: variantIcon[t.variant]
                }
              ),
              /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("div", { style: { flex: 1, minWidth: 0 }, children: [
                /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("div", { style: { fontWeight: 600, marginBottom: "2px" }, children: t.title }),
                t.description ? /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("div", { style: { opacity: 0.85 }, children: t.description }) : null
              ] }),
              /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(
                "button",
                {
                  onClick: () => onDismiss(t.id),
                  style: {
                    background: "none",
                    border: "none",
                    color,
                    cursor: "pointer",
                    padding: "0",
                    flexShrink: 0,
                    opacity: 0.7,
                    lineHeight: 1
                  },
                  "aria-label": "Dismiss",
                  children: /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(XIcon, { size: 12 })
                }
              )
            ]
          },
          t.id
        );
      })
    }
  );
}

// src/LiveChat.tsx
var import_jsx_runtime4 = require("react/jsx-runtime");
function ConnectionDot({
  status,
  colors
}) {
  const dotColor = status === "connected" ? colors.dotConnected : status === "connecting" ? colors.dotConnecting : status === "error" ? colors.dotError : colors.dotIdle;
  return /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(
    "span",
    {
      style: {
        display: "inline-block",
        width: "10px",
        height: "10px",
        borderRadius: "50%",
        background: dotColor ?? "#71717a",
        flexShrink: 0,
        animation: status === "connecting" ? "live-chat-spin 2s linear infinite" : void 0
      }
    }
  );
}
function MessageBubble({
  msg,
  colors
}) {
  if (msg.type === "event") {
    return /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(
      "div",
      {
        style: { display: "flex", justifyContent: "center", margin: "4px 0" },
        children: /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(
          "span",
          {
            style: {
              border: `1px dashed ${colors.eventBorder ?? "#3f3f46"}`,
              color: colors.eventText ?? "#71717a",
              borderRadius: "6px",
              padding: "2px 10px",
              fontSize: "11px"
            },
            children: msg.content
          }
        )
      }
    );
  }
  const isOut = msg.type === "outgoing";
  return /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)(
    "div",
    {
      style: {
        display: "flex",
        flexDirection: "column",
        alignItems: isOut ? "flex-end" : "flex-start",
        maxWidth: "85%",
        alignSelf: isOut ? "flex-end" : "flex-start",
        gap: "2px"
      },
      children: [
        !isOut && msg.senderName ? /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(
          "span",
          {
            style: {
              fontSize: "10px",
              color: colors.incomingName ?? "#a1a1aa",
              paddingLeft: "4px"
            },
            children: msg.senderName
          }
        ) : null,
        /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)(
          "div",
          {
            style: {
              background: isOut ? colors.outgoingBackground ?? "#7c3aed" : colors.incomingBackground ?? "#27272a",
              color: isOut ? colors.outgoingText ?? "#ffffff" : colors.incomingText ?? "#f4f4f5",
              borderRadius: isOut ? "16px 16px 4px 16px" : "16px 16px 16px 4px",
              padding: "8px 12px",
              fontSize: "14px",
              lineHeight: 1.5,
              wordBreak: "break-word"
            },
            children: [
              msg.attachment?.isImage ? /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(
                "img",
                {
                  src: msg.attachment.url,
                  alt: msg.attachment.name,
                  style: {
                    maxWidth: "224px",
                    maxHeight: "176px",
                    borderRadius: "8px",
                    objectFit: "cover",
                    display: "block"
                  }
                }
              ) : null,
              msg.attachment && !msg.attachment.isImage ? /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)(
                "a",
                {
                  href: msg.attachment.url,
                  download: msg.attachment.name,
                  style: {
                    color: "inherit",
                    textDecoration: "underline",
                    fontSize: "13px"
                  },
                  children: [
                    "\u{1F4CE} ",
                    msg.attachment.name
                  ]
                }
              ) : null,
              msg.content ? /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("div", { style: msg.attachment ? { marginTop: "6px" } : {}, children: msg.content }) : null
            ]
          }
        ),
        /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)(
          "div",
          {
            style: {
              fontSize: "10px",
              color: colors.timestamp ?? "#71717a",
              paddingInline: "4px"
            },
            children: [
              msg.timestamp,
              isOut ? /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(
                "span",
                {
                  style: {
                    marginLeft: "4px",
                    color: msg.tickStatus === "read" ? colors.outgoingTickRead ?? "#ffffff" : colors.outgoingTick ?? "rgba(255,255,255,0.45)"
                  },
                  children: msg.tickStatus === "read" ? "\u2713\u2713" : "\u2713"
                }
              ) : null
            ]
          }
        )
      ]
    }
  );
}
function LiveChat({
  serverUrl,
  roomId,
  token,
  title = "Chat",
  theme: themeProp,
  placeholder = "Type a message\u2026",
  emptyStateText = "Connect to start chatting",
  autoConnect = true,
  showAttachmentButton = true,
  attachmentAccept = "*/*",
  historyPageSize = 20,
  onConnected,
  onDisconnected,
  onError,
  onMessage,
  onUploadAttachment,
  onLoadHistory,
  style,
  className
}) {
  const { colors, toast: toastTheme } = resolveTheme(themeProp);
  const chat = useLiveChat({
    serverUrl,
    roomId,
    token,
    autoConnect,
    historyPageSize,
    onConnected,
    onDisconnected,
    onError,
    onMessage,
    onUploadAttachment,
    onLoadHistory
  });
  (0, import_react2.useEffect)(() => {
    injectSpinKeyframe();
  }, []);
  const scrollRef = (0, import_react2.useRef)(null);
  const lastMsgIdRef = (0, import_react2.useRef)(void 0);
  (0, import_react2.useEffect)(() => {
    const last = chat.messages[chat.messages.length - 1];
    if (!last || last.id === lastMsgIdRef.current) return;
    lastMsgIdRef.current = last.id;
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [chat.messages]);
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      void chat.send();
    }
  };
  const canSend = Boolean(
    (chat.inputValue.trim() || chat.attachment) && !chat.isAttachmentSending
  );
  return /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)(
    "div",
    {
      className,
      style: {
        display: "flex",
        flexDirection: "column",
        height: "100%",
        width: "100%",
        background: colors.background,
        border: `1px solid ${colors.border}`,
        borderRadius: "12px",
        overflow: "hidden",
        fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
        position: "relative",
        ...style
      },
      children: [
        /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(
          "input",
          {
            ref: chat.fileInputRef,
            type: "file",
            style: { display: "none" },
            accept: attachmentAccept,
            onChange: chat.onFilePicked
          }
        ),
        /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)(
          "div",
          {
            style: {
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "12px 16px",
              background: colors.headerBackground,
              borderBottom: `1px solid ${colors.border}`,
              flexShrink: 0
            },
            children: [
              /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("div", { style: { display: "flex", alignItems: "center", gap: "8px" }, children: [
                /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(ConnectionDot, { status: chat.connectionStatus, colors }),
                /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(
                  "span",
                  {
                    style: {
                      fontWeight: 600,
                      fontSize: "14px",
                      color: colors.headerText
                    },
                    children: title
                  }
                ),
                chat.unreadCount > 0 ? /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(
                  "span",
                  {
                    style: {
                      background: colors.unreadBadgeBackground ?? "#7c3aed",
                      color: colors.unreadBadgeText ?? "#ffffff",
                      borderRadius: "9999px",
                      padding: "1px 7px",
                      fontSize: "10px",
                      fontWeight: 600
                    },
                    children: chat.unreadCount
                  }
                ) : null
              ] }),
              /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("span", { style: { fontSize: "11px", color: colors.statusText }, children: chat.statusText })
            ]
          }
        ),
        onLoadHistory && !chat.isNoMoreHistory ? /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(
          "button",
          {
            onClick: () => void chat.loadHistory(),
            disabled: chat.isLoadingHistory,
            style: {
              alignSelf: "center",
              marginTop: "12px",
              padding: "4px 14px",
              fontSize: "12px",
              background: colors.loadMoreBackground,
              color: colors.loadMoreText,
              border: `1px solid ${colors.loadMoreBorder}`,
              borderRadius: "6px",
              cursor: chat.isLoadingHistory ? "not-allowed" : "pointer",
              opacity: chat.isLoadingHistory ? 0.6 : 1,
              flexShrink: 0
            },
            children: chat.isLoadingHistory ? "Loading\u2026" : "Load older messages"
          }
        ) : null,
        /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(
          "div",
          {
            ref: scrollRef,
            onClick: chat.markAllRead,
            style: {
              flex: 1,
              overflowY: "auto",
              padding: "16px",
              display: "flex",
              flexDirection: "column",
              gap: "8px",
              background: colors.messagesBackground,
              cursor: chat.unreadCount > 0 ? "pointer" : "default"
            },
            children: chat.messages.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)(
              "div",
              {
                style: {
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  flex: 1,
                  color: colors.emptyText,
                  gap: "8px"
                },
                children: [
                  /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(
                    "svg",
                    {
                      width: 36,
                      height: 36,
                      fill: "none",
                      viewBox: "0 0 24 24",
                      stroke: "currentColor",
                      style: { opacity: 0.3 },
                      children: /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(
                        "path",
                        {
                          strokeLinecap: "round",
                          strokeLinejoin: "round",
                          strokeWidth: 1.4,
                          d: "M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-4l-4 4z"
                        }
                      )
                    }
                  ),
                  /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("span", { style: { fontSize: "13px" }, children: emptyStateText })
                ]
              }
            ) : chat.messages.map((msg, i) => {
              const prev = chat.messages[i - 1];
              return /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("div", { children: [
                /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(
                  DateDivider,
                  {
                    datePrev: prev?.createdAt,
                    dateNext: msg.createdAt,
                    colors
                  }
                ),
                /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(MessageBubble, { msg, colors })
              ] }, msg.id);
            })
          }
        ),
        chat.attachment ? /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)(
          "div",
          {
            style: {
              display: "flex",
              alignItems: "center",
              gap: "8px",
              padding: "8px 16px",
              background: colors.composerBackground,
              borderTop: `1px solid ${colors.composerBorder}`,
              flexShrink: 0
            },
            children: [
              chat.attachment.contentType === "IMAGE" && chat.attachment.previewUrl ? /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(
                "img",
                {
                  src: chat.attachment.previewUrl,
                  alt: chat.attachment.name,
                  style: {
                    width: "40px",
                    height: "40px",
                    objectFit: "cover",
                    borderRadius: "6px",
                    flexShrink: 0
                  }
                }
              ) : /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("span", { style: { fontSize: "20px" }, children: "\u{1F4CE}" }),
              /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(
                "span",
                {
                  style: {
                    flex: 1,
                    fontSize: "12px",
                    color: colors.inputText,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap"
                  },
                  children: chat.attachment.name
                }
              ),
              /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(
                "button",
                {
                  onClick: chat.clearAttachment,
                  style: {
                    background: "none",
                    border: "none",
                    color: colors.inputText,
                    cursor: "pointer",
                    padding: "4px",
                    opacity: 0.7,
                    display: "flex",
                    alignItems: "center"
                  },
                  "aria-label": "Remove attachment",
                  children: /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(XIcon, { size: 14 })
                }
              )
            ]
          }
        ) : null,
        /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)(
          "div",
          {
            style: {
              display: "flex",
              alignItems: "center",
              gap: "8px",
              padding: "10px 12px",
              background: colors.composerBackground,
              borderTop: `1px solid ${colors.composerBorder}`,
              flexShrink: 0
            },
            children: [
              showAttachmentButton ? /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(
                "button",
                {
                  onClick: chat.pickFile,
                  disabled: !chat.isConnected || chat.isAttachmentSending,
                  style: {
                    background: colors.attachBackground,
                    border: `1px solid ${colors.attachBorder}`,
                    color: colors.attachText,
                    borderRadius: "8px",
                    padding: "7px 9px",
                    cursor: chat.isConnected && !chat.isAttachmentSending ? "pointer" : "not-allowed",
                    opacity: chat.isConnected && !chat.isAttachmentSending ? 1 : 0.4,
                    display: "flex",
                    alignItems: "center",
                    flexShrink: 0
                  },
                  "aria-label": "Attach file",
                  children: /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(PaperclipIcon, { size: 15 })
                }
              ) : null,
              /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(
                "input",
                {
                  type: "text",
                  value: chat.inputValue,
                  onChange: (e) => chat.setInputValue(e.target.value),
                  onKeyDown: handleKeyDown,
                  disabled: !chat.isConnected || chat.isAttachmentSending,
                  placeholder: chat.isConnected ? placeholder : "Not connected\u2026",
                  style: {
                    flex: 1,
                    background: colors.inputBackground,
                    color: colors.inputText,
                    border: "none",
                    borderRadius: "8px",
                    padding: "8px 12px",
                    fontSize: "14px",
                    outline: "none"
                  }
                }
              ),
              /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(
                "button",
                {
                  onClick: () => void chat.send(),
                  disabled: !canSend || !chat.isConnected,
                  style: {
                    background: colors.sendBackground,
                    color: colors.sendText,
                    border: "none",
                    borderRadius: "8px",
                    padding: "8px 12px",
                    cursor: canSend && chat.isConnected ? "pointer" : "not-allowed",
                    opacity: canSend && chat.isConnected ? 1 : 0.4,
                    display: "flex",
                    alignItems: "center",
                    flexShrink: 0
                  },
                  "aria-label": "Send",
                  children: chat.isAttachmentSending ? /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(SpinnerIcon, { size: 16 }) : /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(SendIcon, { size: 16 })
                }
              )
            ]
          }
        ),
        /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(
          ToastList,
          {
            toasts: chat.toasts,
            onDismiss: chat.dismissToast,
            theme: toastTheme
          }
        )
      ]
    }
  );
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  LiveChat,
  resolveTheme,
  useLiveChat
});
