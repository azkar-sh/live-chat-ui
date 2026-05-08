# live-chat-ui

[![npm version](https://img.shields.io/npm/v/live-chat-ui.svg)](https://www.npmjs.com/package/live-chat-ui)
[![license](https://img.shields.io/npm/l/live-chat-ui.svg)](https://github.com/azkar-sh/live-chat-ui/blob/main/LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue.svg)](https://www.typescriptlang.org/)

An embeddable, production-ready real-time chat panel for any React application backed by a Socket.IO server. Perfect for customer support, live collaboration, and in-app messaging.

## Features

- 🎨 **Two built-in themes** (dark/light) with full customization
- 📦 **File & image attachments** support
- 💬 **Real-time messaging** via Socket.IO
- 📜 **Message history** pagination
- ✍️ **Typing indicators** and connection status
- 🔔 **Toast notifications** for user feedback
- 🪝 **Headless hook** (`useLiveChat`) for advanced use cases
- 📱 **Responsive design** that works on mobile and desktop
- 🔒 **JWT token authentication**
- 🎯 **Fully typed** with TypeScript

## Installation

```bash
npm install live-chat-ui socket.io-client
# or
pnpm add live-chat-ui socket.io-client
# or
yarn add live-chat-ui socket.io-client
```

## Quick Start

### Basic Usage

```tsx
import { LiveChat } from "live-chat-ui";

export default function SupportPage() {
  return (
    <div style={{ height: "600px", width: "400px" }}>
      <LiveChat
        serverUrl="https://api.example.com"
        roomId="room-abc-123"
        token={userAccessToken}
      />
    </div>
  );
}
```

The component will automatically connect on mount when all required props are present.

### Styling

Wrap the component in a container with fixed dimensions. The component expands to fill its parent:

```tsx
<div style={{ height: "100vh", width: "100%" }}>
  <LiveChat {...props} />
</div>
```

## API Reference

### `<LiveChat />` Component Props

#### Required Props

| Prop        | Type     | Description                                                 |
| ----------- | -------- | ----------------------------------------------------------- |
| `serverUrl` | `string` | Socket.IO server base URL (e.g., `https://api.example.com`) |
| `roomId`    | `string` | Room ID to join after connecting                            |
| `token`     | `string` | JWT access token (with or without `Bearer `)                |

#### Appearance Props

| Prop             | Type            | Default             | Description                       |
| ---------------- | --------------- | ------------------- | --------------------------------- |
| `title`          | `string`        | `"Chat"`            | Panel header title                |
| `theme`          | `LiveChatTheme` | `{ mode: "dark" }`  | Theme configuration               |
| `placeholder`    | `string`        | `"Type a message…"` | Input field placeholder           |
| `emptyStateText` | `string`        | Default message     | Text shown when no messages exist |

#### Behavior Props

| Prop                   | Type      | Default | Description                                        |
| ---------------------- | --------- | ------- | -------------------------------------------------- |
| `autoConnect`          | `boolean` | `true`  | Auto-connect on mount and reconnect on prop change |
| `showAttachmentButton` | `boolean` | `true`  | Show the file attachment button                    |
| `attachmentAccept`     | `string`  | `"*/*"` | File input accept attribute (e.g., `"image/*"`)    |
| `historyPageSize`      | `number`  | `20`    | Messages per history page                          |

#### Event Callbacks

```tsx
<LiveChat
  onConnected={() => console.log("Connected")}
  onDisconnected={(reason) => console.log("Disconnected:", reason)}
  onError={(error) => console.error("Error:", error)}
  onMessage={(message) => console.log("New message:", message)}
/>
```

#### Async Handlers

**Upload attachment:**

```tsx
onUploadAttachment={async (file) => {
  const formData = new FormData();
  formData.append("file", file);
  const res = await fetch("/api/upload", { method: "POST", body: formData });
  const { url } = await res.json();
  return {
    url,
    contentType: file.type.startsWith("image/") ? "IMAGE" : "FILE"
  };
}}
```

**Load message history:**

```tsx
onLoadHistory={async ({ page, pageSize }) => {
  const res = await fetch(`/api/rooms/${roomId}/messages?page=${page}&limit=${pageSize}`);
  const { messages, hasMore } = await res.json();
  return {
    messages: messages.map(m => ({
      id: m.id,
      content: m.content,
      contentType: m.contentType,
      senderId: m.senderId,
      senderName: m.senderName,
      createdAt: m.createdAt,
    })),
    hasMore,
  };
}}
```

### Theming

#### Dark/Light Mode

```tsx
<LiveChat
  theme={{ mode: "dark" }} // or "light"
/>
```

#### Custom Colors

Override specific colors while keeping the preset as the base:

```tsx
<LiveChat
  theme={{
    mode: "dark",
    colors: {
      outgoingBackground: "#0ea5e9",
      outgoingText: "#ffffff",
      sendBackground: "#0ea5e9",
      dotConnected: "#0ea5e9",
      attachBorder: "#0ea5e9",
      attachText: "#38bdf8",
    },
  }}
/>
```

#### Full Color Reference

```tsx
interface ThemeColors {
  // Panel shell
  background?: string;
  border?: string;

  // Header bar
  headerBackground?: string;
  headerText?: string;
  statusText?: string;

  // Messages area
  messagesBackground?: string;
  emptyText?: string;

  // Outgoing bubble (sent by current user)
  outgoingBackground?: string;
  outgoingText?: string;
  outgoingTick?: string; // before read
  outgoingTickRead?: string; // after read

  // Incoming bubble (from other users)
  incomingBackground?: string;
  incomingText?: string;
  incomingName?: string;

  // Event/system message
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

  // Load history button
  loadMoreBackground?: string;
  loadMoreBorder?: string;
  loadMoreText?: string;

  // Misc
  timestamp?: string;
  unreadBadgeBackground?: string;
  unreadBadgeText?: string;

  // Connection status dot
  dotIdle?: string;
  dotConnecting?: string;
  dotConnected?: string;
  dotError?: string;
}
```

#### Toast Notifications

Customize toast appearance:

```tsx
<LiveChat
  theme={{
    toast: {
      successBackground: "#10b981",
      errorBackground: "#ef4444",
      warningBackground: "#f59e0b",
      infoBackground: "#3b82f6",
      textColor: "#ffffff",
    },
  }}
/>
```

### Headless Hook

For advanced use cases, use the `useLiveChat` hook to build a custom UI:

```tsx
import { useLiveChat } from "live-chat-ui";

export function CustomChat() {
  const {
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
  } = useLiveChat({
    serverUrl: "https://api.example.com",
    roomId: "room-abc-123",
    token: userAccessToken,
    onMessage: (message) => console.log(message),
    onUploadAttachment: async (file) => {
      // Your upload logic
    },
    onLoadHistory: async ({ page, pageSize }) => {
      // Your history loading logic
    },
  });

  return (
    <div>
      <div>Status: {statusText}</div>
      <div>Unread: {unreadCount}</div>
      <div>
        {messages.map((msg) => (
          <div key={msg.id}>{msg.content}</div>
        ))}
      </div>
      <input
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        placeholder="Type a message…"
      />
      <button onClick={send}>Send</button>
      <button onClick={pickFile}>Attach File</button>
      <input ref={fileInputRef} type="file" hidden />
    </div>
  );
}
```

## Message Types

```typescript
interface LiveChatMessage {
  id: string;
  content: string;
  type: "incoming" | "outgoing" | "event";
  contentType: "TEXT" | "IMAGE" | "FILE";
  senderName?: string;
  timestamp: string;
  createdAt?: string;
  tickStatus?: "sent" | "read"; // only for outgoing
  unread?: boolean;
  attachment?: {
    name: string;
    url: string;
    isImage: boolean;
    mimeType?: string;
  };
}
```

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- iOS Safari 14+

## Requirements

- React 18+
- Socket.IO Client 4+

## JWT Token Format

The token should be a valid JWT that your Socket.IO server can verify. The component will:

1. Decode the token to extract the user ID
2. Send it with the connection
3. Handle token refresh if needed (your server should emit `auth:need-refresh` event)

Example server-side validation (Node.js):

```typescript
const token = socket.handshake.auth.token;
const decoded = jwt.verify(token, SECRET);
// Store user info from decoded token
```

## Socket.IO Events

The component emits and listens for these events:

**Outgoing:**

- `message:send` - Send a message
- `attachment:upload` - Upload an attachment
- `history:load` - Load message history
- `room:mark-read` - Mark messages as read

**Incoming:**

- `message:new` - New message received
- `message:typing` - User typing
- `auth:need-refresh` - Token refresh needed

## Troubleshooting

### "Failed to connect"

- Verify `serverUrl` is accessible from the client
- Check CORS configuration on your Socket.IO server
- Ensure the token is valid

### Token issues

- Verify the JWT is properly signed
- Check token expiration
- Implement token refresh handling on your server

### Messages not appearing

- Check browser console for errors
- Verify Socket.IO events are being emitted
- Ensure `onMessage` callback is implemented if custom handling is needed

## License

MIT © 2026

## Contributing

Contributions are welcome! Please see [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines.

## Support

- 📖 [Full Documentation](https://github.com/azkar-sh/live-chat-ui)
- 🐛 [Report Issues](https://github.com/azkar-sh/live-chat-ui/issues)
- 💬 [Discussions](https://github.com/azkar-sh/live-chat-ui/discussions)
