import type { ToastItem } from "../hooks/use-live-chat";
import type { ToastTheme } from "../types";
import { XIcon } from "./Icons";

interface ToastListProps {
  toasts: ToastItem[];
  onDismiss: (id: string) => void;
  theme: ToastTheme;
}

const variantBg: Record<ToastItem["variant"], keyof ToastTheme> = {
  success: "successBackground",
  error: "errorBackground",
  warning: "warningBackground",
  info: "infoBackground",
};

const variantIcon: Record<ToastItem["variant"], string> = {
  success: "✓",
  error: "✕",
  warning: "⚠",
  info: "ℹ",
};

export function ToastList({ toasts, onDismiss, theme }: ToastListProps) {
  if (!toasts.length) return null;

  return (
    <div
      style={{
        position: "absolute",
        bottom: "80px",
        right: "12px",
        display: "flex",
        flexDirection: "column",
        gap: "8px",
        zIndex: 50,
        maxWidth: "280px",
        pointerEvents: "none",
      }}
    >
      {toasts.map((t) => {
        const bgKey = variantBg[t.variant];
        const bg = theme[bgKey] ?? "#27272a";
        const color = theme.textColor ?? "#f4f4f5";

        return (
          <div
            key={t.id}
            style={{
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
              pointerEvents: "auto",
            }}
          >
            <span
              style={{
                fontWeight: 700,
                fontSize: "13px",
                flexShrink: 0,
                marginTop: "1px",
              }}
            >
              {variantIcon[t.variant]}
            </span>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontWeight: 600, marginBottom: "2px" }}>
                {t.title}
              </div>
              {t.description ? (
                <div style={{ opacity: 0.85 }}>{t.description}</div>
              ) : null}
            </div>
            <button
              onClick={() => onDismiss(t.id)}
              style={{
                background: "none",
                border: "none",
                color,
                cursor: "pointer",
                padding: "0",
                flexShrink: 0,
                opacity: 0.7,
                lineHeight: 1,
              }}
              aria-label="Dismiss"
            >
              <XIcon size={12} />
            </button>
          </div>
        );
      })}
    </div>
  );
}
