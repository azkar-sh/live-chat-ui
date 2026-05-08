import * as react_jsx_runtime from 'react/jsx-runtime';
import React, { RefObject, ChangeEvent } from 'react';

type ConnectionStatus = "idle" | "connecting" | "connected" | "error";
type MessageDirection = "incoming" | "outgoing" | "event";
type ContentType = "TEXT" | "IMAGE" | "FILE";
interface LiveChatMessageAttachment {
    name: string;
    url: string;
    isImage: boolean;
    mimeType?: string;
}
interface LiveChatMessage {
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
/**
 * Shape of each message returned by your onLoadHistory callback.
 * senderId is used to distinguish outgoing vs incoming messages.
 */
interface HistoryMessage {
    id: string;
    content: string;
    contentType?: ContentType;
    senderId?: string;
    senderName?: string;
    createdAt?: string;
}
interface UploadResult {
    /** Public URL of the uploaded file. */
    url: string;
    /** Whether the file is an image or a generic file attachment. */
    contentType: "IMAGE" | "FILE";
}
/**
 * Fine-grained color overrides. Every field is optional — only supply what you
 * want to change from the base dark/light preset.
 */
interface ThemeColors {
    background?: string;
    border?: string;
    headerBackground?: string;
    headerText?: string;
    statusText?: string;
    messagesBackground?: string;
    emptyText?: string;
    outgoingBackground?: string;
    outgoingText?: string;
    outgoingTick?: string;
    outgoingTickRead?: string;
    incomingBackground?: string;
    incomingText?: string;
    incomingName?: string;
    eventText?: string;
    eventBorder?: string;
    composerBackground?: string;
    composerBorder?: string;
    inputBackground?: string;
    inputText?: string;
    inputPlaceholder?: string;
    sendBackground?: string;
    sendText?: string;
    attachBackground?: string;
    attachBorder?: string;
    attachText?: string;
    loadMoreBackground?: string;
    loadMoreBorder?: string;
    loadMoreText?: string;
    timestamp?: string;
    unreadBadgeBackground?: string;
    unreadBadgeText?: string;
    dotIdle?: string;
    dotConnecting?: string;
    dotConnected?: string;
    dotError?: string;
}
interface ToastTheme {
    successBackground?: string;
    errorBackground?: string;
    warningBackground?: string;
    infoBackground?: string;
    textColor?: string;
}
interface LiveChatTheme {
    /** Base preset. Defaults to "dark". */
    mode?: "dark" | "light";
    /** Override individual colors on top of the base preset. */
    colors?: Partial<ThemeColors>;
    /** Override toast notification colors. */
    toast?: Partial<ToastTheme>;
}
interface LiveChatProps {
    /** Socket.IO server URL, e.g. "https://api.example.com" */
    serverUrl: string;
    /** Room ID to join after connecting. */
    roomId: string;
    /** JWT access token (with or without "Bearer " prefix). */
    token: string;
    /** Title shown in the panel header. Defaults to "Chat". */
    title?: string;
    /** Theme configuration (preset + optional color overrides). */
    theme?: LiveChatTheme;
    /** Input placeholder text. Defaults to "Type a message…". */
    placeholder?: string;
    /** Text shown when there are no messages yet. */
    emptyStateText?: string;
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
    onConnected?: () => void;
    onDisconnected?: (reason: string) => void;
    onError?: (error: Error) => void;
    /** Fired for every incoming message from other users. */
    onMessage?: (message: LiveChatMessage) => void;
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
    }) => Promise<{
        messages: HistoryMessage[];
        hasMore: boolean;
    }>;
    /** Inline styles applied to the outermost container div. */
    style?: React.CSSProperties;
    /** CSS class applied to the outermost container div. */
    className?: string;
}

declare function LiveChat({ serverUrl, roomId, token, title, theme: themeProp, placeholder, emptyStateText, autoConnect, showAttachmentButton, attachmentAccept, historyPageSize, onConnected, onDisconnected, onError, onMessage, onUploadAttachment, onLoadHistory, style, className, }: LiveChatProps): react_jsx_runtime.JSX.Element;

interface ToastItem {
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
interface UseLiveChatConfig {
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
    }) => Promise<{
        messages: HistoryMessage[];
        hasMore: boolean;
    }>;
}
interface UseLiveChatReturn {
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
declare function useLiveChat(config: UseLiveChatConfig): UseLiveChatReturn;

interface ResolvedTheme {
    colors: ThemeColors;
    toast: ToastTheme;
}
/**
 * Merges the chosen mode preset with any user-provided color overrides.
 * Always returns a fully-populated theme object.
 */
declare function resolveTheme(theme?: LiveChatTheme): ResolvedTheme;

export { type ConnectionStatus, type ContentType, type HistoryMessage, LiveChat, type LiveChatMessage, type LiveChatMessageAttachment, type LiveChatProps, type LiveChatTheme, type MessageDirection, type ResolvedTheme, type ThemeColors, type ToastItem, type ToastTheme, type UploadResult, type UseLiveChatConfig, type UseLiveChatReturn, LiveChat as default, resolveTheme, useLiveChat };
