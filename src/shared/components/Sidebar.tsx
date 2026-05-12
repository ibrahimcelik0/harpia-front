"use client";

import { Flame, Sparkles, LayoutGrid, Star, Trophy, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { useUIStore } from "@/features/auction/store/uiStore";
import { CATEGORIES, type NavTab, type Category } from "@/features/auction/data/mockProducts";

const NAV_ITEMS: { id: NavTab; label: string; Icon: React.ElementType }[] = [
  { id: "son-firsatlar",    label: "Son Fırsatlar",    Icon: Flame     },
  { id: "yeni-gelenler",    label: "Yeni Gelenler",    Icon: Sparkles  },
  { id: "kategoriler",      label: "Kategoriler",      Icon: LayoutGrid},
  { id: "takip-ettiklerim", label: "Takip Ettiklerim", Icon: Star      },
  { id: "kazandiklarim",    label: "Kazandıklarım",    Icon: Trophy    },
];

export default function Sidebar() {
  const { activeTab, activeCategory, setTab, setCategory } = useUIStore();

  return (
    <aside className="sticky top-20 h-fit w-52 shrink-0">
      <nav className="flex flex-col gap-0.5">
        {NAV_ITEMS.map(({ id, label, Icon }) => (
          <div key={id}>
            <button
              onClick={() => setTab(id)}
              className={cn(
                "flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm transition-colors",
                activeTab === id
                  ? "bg-primary/[0.08] font-medium text-primary"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <Icon
                className={cn(
                  "h-[17px] w-[17px] shrink-0",
                  activeTab === id ? "text-primary" : "text-muted-foreground"
                )}
                strokeWidth={2}
              />
              <span className="flex-1">{label}</span>
              {id === "kategoriler" && (
                <ChevronRight
                  className={cn(
                    "h-3.5 w-3.5 shrink-0 transition-transform duration-200",
                    activeTab === "kategoriler" ? "rotate-90 text-primary" : "text-muted-foreground/50"
                  )}
                  strokeWidth={2.5}
                />
              )}
            </button>

            {/* Kategori alt menüsü */}
            {id === "kategoriler" && activeTab === "kategoriler" && (
              <div className="ml-3 mt-0.5 flex flex-col gap-0.5 border-l border-border pb-1 pl-3">
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
      </nav>
    </aside>
  );
}
