import { formatDateLabel } from "../utils/format-time";
import type { ThemeColors } from "../types";

interface DateDividerProps {
  datePrev?: string;
  dateNext?: string;
  colors: ThemeColors;
}

export function DateDivider({ datePrev, dateNext, colors }: DateDividerProps) {
  if (!dateNext) return null;
  // Only render when crossing a day boundary
  if (datePrev && datePrev.slice(0, 10) === dateNext.slice(0, 10)) return null;

  const label = formatDateLabel(dateNext);
  if (!label) return null;

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "12px",
        fontSize: "11px",
        color: colors.emptyText ?? "#71717a",
        margin: "8px 0",
      }}
    >
      <div
        style={{
          flex: 1,
          height: "1px",
          background: colors.eventBorder ?? "#3f3f46",
        }}
      />
      <span>{label}</span>
      <div
        style={{
          flex: 1,
          height: "1px",
          background: colors.eventBorder ?? "#3f3f46",
        }}
      />
    </div>
  );
}
