"use client";

import { useEffect, useRef, type KeyboardEvent, type RefObject } from "react";
import type { LiveChatProps, LiveChatMessage, ThemeColors } from "./types";
import { resolveTheme } from "./theme";
import { useLiveChat } from "./hooks/use-live-chat";
import { DateDivider } from "./components/DateDivider";
import { ToastList } from "./components/ToastList";
import {
  injectSpinKeyframe,
  PaperclipIcon,
  SendIcon,
  SpinnerIcon,
  XIcon,
} from "./components/Icons";

// ─── Sub-components ───────────────────────────────────────────────────────────

function ConnectionDot({
  status,
  colors,
}: {
  status: "idle" | "connecting" | "connected" | "error";
  colors: ThemeColors;
}) {
  const dotColor =
    status === "connected"
      ? colors.dotConnected
      : status === "connecting"
        ? colors.dotConnecting
        : status === "error"
          ? colors.dotError
          : colors.dotIdle;

  return (
    <span
      style={{
        display: "inline-block",
        width: "10px",
        height: "10px",
        borderRadius: "50%",
        background: dotColor ?? "#71717a",
        flexShrink: 0,
        animation:
          status === "connecting"
            ? "live-chat-spin 2s linear infinite"
            : undefined,
      }}
    />
  );
}

function MessageBubble({
  msg,
  colors,
}: {
  msg: LiveChatMessage;
  colors: ThemeColors;
}) {
  if (msg.type === "event") {
    return (
      <div
        style={{ display: "flex", justifyContent: "center", margin: "4px 0" }}
      >
        <span
          style={{
            border: `1px dashed ${colors.eventBorder ?? "#3f3f46"}`,
            color: colors.eventText ?? "#71717a",
            borderRadius: "6px",
            padding: "2px 10px",
            fontSize: "11px",
          }}
        >
          {msg.content}
        </span>
      </div>
    );
  }

  const isOut = msg.type === "outgoing";

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: isOut ? "flex-end" : "flex-start",
        maxWidth: "85%",
        alignSelf: isOut ? "flex-end" : "flex-start",
        gap: "2px",
      }}
    >
      {!isOut && msg.senderName ? (
        <span
          style={{
            fontSize: "10px",
            color: colors.incomingName ?? "#a1a1aa",
            paddingLeft: "4px",
          }}
        >
          {msg.senderName}
        </span>
      ) : null}

      <div
        style={{
          background: isOut
            ? (colors.outgoingBackground ?? "#7c3aed")
            : (colors.incomingBackground ?? "#27272a"),
          color: isOut
            ? (colors.outgoingText ?? "#ffffff")
            : (colors.incomingText ?? "#f4f4f5"),
          borderRadius: isOut ? "16px 16px 4px 16px" : "16px 16px 16px 4px",
          padding: "8px 12px",
          fontSize: "14px",
          lineHeight: 1.5,
          wordBreak: "break-word",
        }}
      >
        {msg.attachment?.isImage ? (
          <img
            src={msg.attachment.url}
            alt={msg.attachment.name}
            style={{
              maxWidth: "224px",
              maxHeight: "176px",
              borderRadius: "8px",
              objectFit: "cover",
              display: "block",
            }}
          />
        ) : null}

        {msg.attachment && !msg.attachment.isImage ? (
          <a
            href={msg.attachment.url}
            download={msg.attachment.name}
            style={{
              color: "inherit",
              textDecoration: "underline",
              fontSize: "13px",
            }}
          >
            📎 {msg.attachment.name}
          </a>
        ) : null}

        {msg.content ? (
          <div style={msg.attachment ? { marginTop: "6px" } : {}}>
            {msg.content}
          </div>
        ) : null}
      </div>

      <div
        style={{
          fontSize: "10px",
          color: colors.timestamp ?? "#71717a",
          paddingInline: "4px",
        }}
      >
        {msg.timestamp}
        {isOut ? (
          <span
            style={{
              marginLeft: "4px",
              color:
                msg.tickStatus === "read"
                  ? (colors.outgoingTickRead ?? "#ffffff")
                  : (colors.outgoingTick ?? "rgba(255,255,255,0.45)"),
            }}
          >
            {msg.tickStatus === "read" ? "✓✓" : "✓"}
          </span>
        ) : null}
      </div>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function LiveChat({
  serverUrl,
  roomId,
  token,
  title = "Chat",
  theme: themeProp,
  placeholder = "Type a message…",
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
  className,
}: LiveChatProps) {
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
    onLoadHistory,
  });

  useEffect(() => {
    injectSpinKeyframe();
  }, []);

  // Only scroll when a new message is appended at the bottom (not on history prepend)
  const scrollRef = useRef<HTMLDivElement>(null);
  const lastMsgIdRef = useRef<string | undefined>(undefined);
  useEffect(() => {
    const last = chat.messages[chat.messages.length - 1];
    if (!last || last.id === lastMsgIdRef.current) return;
    lastMsgIdRef.current = last.id;
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [chat.messages]);

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      void chat.send();
    }
  };

  const canSend = Boolean(
    (chat.inputValue.trim() || chat.attachment) && !chat.isAttachmentSending,
  );

  return (
    <div
      className={className}
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        width: "100%",
        background: colors.background,
        border: `1px solid ${colors.border}`,
        borderRadius: "12px",
        overflow: "hidden",
        fontFamily:
          "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
        position: "relative",
        ...style,
      }}
    >
      {/* Hidden file input */}
      <input
        ref={chat.fileInputRef as RefObject<HTMLInputElement>}
        type="file"
        style={{ display: "none" }}
        accept={attachmentAccept}
        onChange={chat.onFilePicked}
      />

      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "12px 16px",
          background: colors.headerBackground,
          borderBottom: `1px solid ${colors.border}`,
          flexShrink: 0,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <ConnectionDot status={chat.connectionStatus} colors={colors} />
          <span
            style={{
              fontWeight: 600,
              fontSize: "14px",
              color: colors.headerText,
            }}
          >
            {title}
          </span>
          {chat.unreadCount > 0 ? (
            <span
              style={{
                background: colors.unreadBadgeBackground ?? "#7c3aed",
                color: colors.unreadBadgeText ?? "#ffffff",
                borderRadius: "9999px",
                padding: "1px 7px",
                fontSize: "10px",
                fontWeight: 600,
              }}
            >
              {chat.unreadCount}
            </span>
          ) : null}
        </div>
        <span style={{ fontSize: "11px", color: colors.statusText }}>
          {chat.statusText}
        </span>
      </div>

      {/* Load older messages button */}
      {onLoadHistory && !chat.isNoMoreHistory ? (
        <button
          onClick={() => void chat.loadHistory()}
          disabled={chat.isLoadingHistory}
          style={{
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
            flexShrink: 0,
          }}
        >
          {chat.isLoadingHistory ? "Loading…" : "Load older messages"}
        </button>
      ) : null}

      {/* Messages area */}
      <div
        ref={scrollRef}
        onClick={chat.markAllRead}
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "16px",
          display: "flex",
          flexDirection: "column",
          gap: "8px",
          background: colors.messagesBackground,
          cursor: chat.unreadCount > 0 ? "pointer" : "default",
        }}
      >
        {chat.messages.length === 0 ? (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              flex: 1,
              color: colors.emptyText,
              gap: "8px",
            }}
          >
            <svg
              width={36}
              height={36}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              style={{ opacity: 0.3 }}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.4}
                d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-4l-4 4z"
              />
            </svg>
            <span style={{ fontSize: "13px" }}>{emptyStateText}</span>
          </div>
        ) : (
          chat.messages.map((msg, i) => {
            const prev = chat.messages[i - 1];
            return (
              <div key={msg.id}>
                <DateDivider
                  datePrev={prev?.createdAt}
                  dateNext={msg.createdAt}
                  colors={colors}
                />
                <MessageBubble msg={msg} colors={colors} />
              </div>
            );
          })
        )}
      </div>

      {/* Attachment preview strip */}
      {chat.attachment ? (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            padding: "8px 16px",
            background: colors.composerBackground,
            borderTop: `1px solid ${colors.composerBorder}`,
            flexShrink: 0,
          }}
        >
          {chat.attachment.contentType === "IMAGE" &&
          chat.attachment.previewUrl ? (
            <img
              src={chat.attachment.previewUrl}
              alt={chat.attachment.name}
              style={{
                width: "40px",
                height: "40px",
                objectFit: "cover",
                borderRadius: "6px",
                flexShrink: 0,
              }}
            />
          ) : (
            <span style={{ fontSize: "20px" }}>📎</span>
          )}
          <span
            style={{
              flex: 1,
              fontSize: "12px",
              color: colors.inputText,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {chat.attachment.name}
          </span>
          <button
            onClick={chat.clearAttachment}
            style={{
              background: "none",
              border: "none",
              color: colors.inputText,
              cursor: "pointer",
              padding: "4px",
              opacity: 0.7,
              display: "flex",
              alignItems: "center",
            }}
            aria-label="Remove attachment"
          >
            <XIcon size={14} />
          </button>
        </div>
      ) : null}

      {/* Composer bar */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          padding: "10px 12px",
          background: colors.composerBackground,
          borderTop: `1px solid ${colors.composerBorder}`,
          flexShrink: 0,
        }}
      >
        {showAttachmentButton ? (
          <button
            onClick={chat.pickFile}
            disabled={!chat.isConnected || chat.isAttachmentSending}
            style={{
              background: colors.attachBackground,
              border: `1px solid ${colors.attachBorder}`,
              color: colors.attachText,
              borderRadius: "8px",
              padding: "7px 9px",
              cursor:
                chat.isConnected && !chat.isAttachmentSending
                  ? "pointer"
                  : "not-allowed",
              opacity: chat.isConnected && !chat.isAttachmentSending ? 1 : 0.4,
              display: "flex",
              alignItems: "center",
              flexShrink: 0,
            }}
            aria-label="Attach file"
          >
            <PaperclipIcon size={15} />
          </button>
        ) : null}

        <input
          type="text"
          value={chat.inputValue}
          onChange={(e) => chat.setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={!chat.isConnected || chat.isAttachmentSending}
          placeholder={chat.isConnected ? placeholder : "Not connected…"}
          style={{
            flex: 1,
            background: colors.inputBackground,
            color: colors.inputText,
            border: "none",
            borderRadius: "8px",
            padding: "8px 12px",
            fontSize: "14px",
            outline: "none",
          }}
        />

        <button
          onClick={() => void chat.send()}
          disabled={!canSend || !chat.isConnected}
          style={{
            background: colors.sendBackground,
            color: colors.sendText,
            border: "none",
            borderRadius: "8px",
            padding: "8px 12px",
            cursor: canSend && chat.isConnected ? "pointer" : "not-allowed",
            opacity: canSend && chat.isConnected ? 1 : 0.4,
            display: "flex",
            alignItems: "center",
            flexShrink: 0,
          }}
          aria-label="Send"
        >
          {chat.isAttachmentSending ? (
            <SpinnerIcon size={16} />
          ) : (
            <SendIcon size={16} />
          )}
        </button>
      </div>

      {/* Toast stack */}
      <ToastList
        toasts={chat.toasts}
        onDismiss={chat.dismissToast}
        theme={toastTheme}
      />
    </div>
  );
}
