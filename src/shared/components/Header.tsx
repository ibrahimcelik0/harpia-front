"use client";

import { Search, Gavel } from "lucide-react";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuthStore } from "@/features/auth/store/authStore";
import NotificationBell from "./NotificationBell";

const AUTH_PAGES = ["/login", "/register"];

export default function Header() {
  const isLoggedIn = useAuthStore((s) => s.isLoggedIn);
  const pathname = usePathname();
  const isAuthPage = AUTH_PAGES.includes(pathname);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur-sm">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-4 px-4 sm:px-6 lg:px-8">

        {/* Logo */}
        <a href="/" className="flex shrink-0 items-center gap-2 select-none">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
            <Gavel className="h-4 w-4 text-primary-foreground" strokeWidth={2.5} />
          </span>
          <span className="text-[17px] font-semibold tracking-tight text-foreground">
            Harpia
            <span className="text-primary">.</span>
          </span>
        </a>

        {/* Arama çubuğu */}
        {!isAuthPage && (
          <div className="relative mx-4 flex flex-1 items-center">
            <Search
              className="pointer-events-none absolute left-3 h-4 w-4 text-muted-foreground"
              strokeWidth={2}
            />
            <Input
              type="search"
              placeholder="Ürün, kategori veya marka ara…"
              className="w-full rounded-full border-border bg-muted/60 pl-9 pr-4 text-sm placeholder:text-muted-foreground focus-visible:bg-white focus-visible:ring-primary/40"
            />
          </div>
        )}

        {/* Bildirim çanı */}
        {!isAuthPage && <NotificationBell />}

        {/* Auth butonları */}
        {!isAuthPage && (
          isLoggedIn ? (
            <a href="/profile" className="shrink-0">
              <Button
                size="sm"
                variant="outline"
                className="rounded-full border-border px-5 text-sm font-medium"
              >
                Profilim
              </Button>
            </a>
          ) : (
            <>
              <a href="/register" className="shrink-0">
                <Button
                  size="sm"
                  variant="outline"
                  className="rounded-full border-border px-5 text-sm font-medium"
                >
                  Kayıt Ol
                </Button>
              </a>
              <a href="/login" className="shrink-0">
                <Button
                  size="sm"
                  className="rounded-full bg-primary px-5 text-sm font-medium text-primary-foreground hover:bg-primary/90"
                >
                  Giriş Yap
                </Button>
              </a>
            </>
          )
        )}
      </div>
    </header>
  );
}
