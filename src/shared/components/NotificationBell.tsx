"use client";

import { Bell, X, Gavel } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { useNotificationStore } from "@/features/auction/store/notificationStore";
import { cn } from "@/lib/utils";

export default function NotificationBell() {
  const { notifications, markAllRead, remove } = useNotificationStore();
  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <Popover onOpenChange={(open) => open && markAllRead()}>
      <PopoverTrigger asChild>
        <button
          className="relative flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          aria-label="Bildirimler"
        >
          <Bell className="h-[18px] w-[18px]" strokeWidth={2} />
          {unreadCount > 0 && (
            <span className="absolute right-1 top-1 flex h-2 w-2 items-center justify-center rounded-full bg-destructive">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-destructive opacity-75" />
            </span>
          )}
        </button>
      </PopoverTrigger>

      <PopoverContent
        align="end"
        sideOffset={10}
        className="w-80 rounded-2xl border border-border bg-white p-0 shadow-[0_8px_30px_rgba(0,0,0,0.1)]"
      >
        {/* Başlık */}
        <div className="flex items-center justify-between border-b border-border px-4 py-3">
          <span className="text-sm font-semibold text-foreground">Bildirimler</span>
          {notifications.length > 0 && (
            <button
              onClick={() => notifications.forEach((n) => remove(n.id))}
              className="text-xs text-muted-foreground underline-offset-2 hover:text-foreground hover:underline"
            >
              Tümünü temizle
            </button>
          )}
        </div>

        {/* Bildirim listesi */}
        {notifications.length === 0 ? (
          <div className="flex flex-col items-center gap-2 px-4 py-8">
            <Bell className="h-8 w-8 text-muted-foreground/30" strokeWidth={1.5} />
            <p className="text-sm text-muted-foreground">Henüz bildirim yok.</p>
          </div>
        ) : (
          <ul className="max-h-80 overflow-y-auto divide-y divide-border">
            {notifications.map((n) => (
              <li
                key={n.id}
                className={cn(
                  "flex gap-3 px-4 py-3 transition-colors",
                  !n.read && "bg-destructive/[0.04]"
                )}
              >
                {/* İkon */}
                <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-destructive/10">
                  <Gavel className="h-3.5 w-3.5 text-destructive" strokeWidth={2.5} />
                </span>

                {/* Metin */}
                <div className="flex flex-1 flex-col gap-2">
                  <p className="text-sm leading-snug text-foreground">
                    Üzgünüz,{" "}
                    <span className="font-medium">{n.productName}</span>{" "}
                    için verdiğiniz teklif geçildi!
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Yeni bir teklif vermek ister misiniz?
                  </p>
                  <Button
                    size="sm"
                    className="h-7 w-fit rounded-lg bg-primary px-3 text-xs font-medium text-primary-foreground hover:bg-primary/90"
                  >
                    Teklif Ver
                  </Button>
                </div>

                {/* Kapat */}
                <button
                  onClick={() => remove(n.id)}
                  className="mt-0.5 shrink-0 text-muted-foreground/50 transition-colors hover:text-muted-foreground"
                  aria-label="Bildirimi kaldır"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </li>
            ))}
          </ul>
        )}
      </PopoverContent>
    </Popover>
  );
}
