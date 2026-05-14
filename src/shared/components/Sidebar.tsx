"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Flame, Sparkles, LayoutGrid, Star, Trophy, ChevronRight, Gavel } from "lucide-react";
import { cn } from "@/lib/utils";
import { useUIStore } from "@/features/auction/store/uiStore";
import { CATEGORIES, type NavTab, type Category } from "@/features/auction/data/mockProducts";

const NAV_ITEMS: { id: NavTab; label: string; Icon: React.ElementType }[] = [
  { id: "son-firsatlar",    label: "Son Fırsatlar",    Icon: Flame      },
  { id: "yeni-gelenler",    label: "Yeni Gelenler",    Icon: Sparkles   },
  { id: "kategoriler",      label: "Kategoriler",      Icon: LayoutGrid },
  { id: "takip-ettiklerim", label: "Takip Ettiklerim", Icon: Star       },
  { id: "kazandiklarim",    label: "Kazandıklarım",    Icon: Trophy     },
];

const PAGE_LINKS: { href: string; label: string; Icon: React.ElementType }[] = [
  { href: "/tekliflerim", label: "Tekliflerim", Icon: Gavel },
];

export default function Sidebar() {
  const { activeTab, activeCategory, setTab, setCategory } = useUIStore();
  const [kategorilerOpen, setKategorilerOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  function handleTabClick(id: NavTab) {
    if (id === "kategoriler") {
      setKategorilerOpen((prev) => !prev);
      setTab(id);
    } else {
      setKategorilerOpen(false);
      setTab(id);
    }
    if (pathname !== "/") router.push("/");
  }

  return (
    <aside className="sticky top-20 h-fit w-52 shrink-0">
      <nav className="flex flex-col gap-0.5">
        {NAV_ITEMS.map(({ id, label, Icon }) => (
          <div key={id}>
            <button
              onClick={() => handleTabClick(id)}
              className={cn(
                "flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm transition-colors",
                activeTab === id && pathname === "/"
                  ? "bg-primary/[0.08] font-medium text-primary"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <Icon
                className={cn(
                  "h-[17px] w-[17px] shrink-0",
                  activeTab === id && pathname === "/" ? "text-primary" : "text-muted-foreground"
                )}
                strokeWidth={2}
              />
              <span className="flex-1">{label}</span>
              {id === "kategoriler" && (
                <ChevronRight
                  className={cn(
                    "h-3.5 w-3.5 shrink-0 transition-transform duration-500",
                    kategorilerOpen ? "rotate-90 text-primary" : "text-muted-foreground/50"
                  )}
                  strokeWidth={2.5}
                />
              )}
            </button>

            {/* Kategori alt menüsü */}
            {id === "kategoriler" && kategorilerOpen && (
              <div className="animate-in slide-in-from-top-2 fade-in-0 duration-500 ml-3 mt-0.5 flex flex-col gap-0.5 border-l border-border pb-1 pl-3">
                <button
                  onClick={() => setCategory(null)}
                  className={cn(
                    "rounded-lg px-2 py-1.5 text-left text-xs transition-colors",
                    activeCategory === null
                      ? "font-medium text-primary"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  Tümü
                </button>
                {CATEGORIES.map((cat: Category) => (
                  <button
                    key={cat}
                    onClick={() => setCategory(cat)}
                    className={cn(
                      "rounded-lg px-2 py-1.5 text-left text-xs transition-colors",
                      activeCategory === cat
                        ? "font-medium text-primary"
                        : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}

        {/* Ayırıcı */}
        <div className="my-2 border-t border-border" />

        {/* Sayfa linkleri */}
        {PAGE_LINKS.map(({ href, label, Icon }) => (
          <Link
            key={href}
            href={href}
            className={cn(
              "flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors",
              pathname === href
                ? "bg-primary/[0.08] font-medium text-primary"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            )}
          >
            <Icon
              className={cn(
                "h-[17px] w-[17px] shrink-0",
                pathname === href ? "text-primary" : "text-muted-foreground"
              )}
              strokeWidth={2}
            />
            <span className="flex-1">{label}</span>
          </Link>
        ))}
      </nav>
    </aside>
  );
}
