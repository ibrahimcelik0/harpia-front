"use client";

import { useEffect, useState } from "react";
import { Clock } from "lucide-react";
import { cn } from "@/lib/utils";

interface CountdownProps {
  durationSeconds: number;
}

function formatTime(total: number) {
  if (total <= 0) return { h: "00", m: "00", s: "00", urgent: false };
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;
  return {
    h: String(h).padStart(2, "0"),
    m: String(m).padStart(2, "0"),
    s: String(s).padStart(2, "0"),
    urgent: total < 5 * 60, // Son 5 dakikada acil moda gir
  };
}

export default function Countdown({ durationSeconds }: CountdownProps) {
  const [remaining, setRemaining] = useState(durationSeconds);

  useEffect(() => {
    if (remaining <= 0) return;
    const id = setInterval(() => setRemaining((r) => Math.max(0, r - 1)), 1000);
    return () => clearInterval(id);
  }, [remaining]);

  const { h, m, s, urgent } = formatTime(remaining);

  if (remaining <= 0) {
    return (
      <span className="text-xs font-medium text-muted-foreground">
        Süre doldu
      </span>
    );
  }

  return (
    <span
      className={cn(
        "flex items-center gap-1.5 text-sm font-semibold tabular-nums",
        urgent ? "text-destructive" : "text-[oklch(0.62_0.18_38)]"
      )}
    >
      <Clock className="h-3.5 w-3.5 shrink-0" strokeWidth={2.5} />
      {h !== "00" ? `${h}:${m}:${s}` : `${m}:${s}`}
    </span>
  );
}
