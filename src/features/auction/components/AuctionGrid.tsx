"use client";

import { useMemo } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { PackageSearch, Heart } from "lucide-react";
import AuctionCard from "./AuctionCard";
import WonCard from "./WonCard";
import { useAuctionStore } from "../store/auctionStore";
import { useUIStore } from "../store/uiStore";
import { TAB_PRODUCT_IDS } from "../data/mockProducts";

const EMPTY_STATES: Partial<Record<string, { icon: React.ElementType; text: string; sub?: string }>> = {
  "takip-ettiklerim": {
    icon: Heart,
    text: "Henüz takip ettiğiniz ürün yok.",
    sub: "Ana sayfadaki ürün kartlarındaki ♡ ikonunu kullanın.",
  },
};

export default function AuctionGrid() {
  const products     = useAuctionStore((s) => s.products);
  const watchlist    = useAuctionStore((s) => s.watchlist);
  const { activeTab, activeCategory } = useUIStore();

  const filtered = useMemo(() => {
    if (activeTab === "takip-ettiklerim") {
      return products.filter((p) => watchlist.includes(p.id));
    }
    if (activeTab === "kategoriler") {
      return activeCategory
        ? products.filter((p) => p.category === activeCategory)
        : products;
    }
    const ids = TAB_PRODUCT_IDS[activeTab];
    return products.filter((p) => ids.includes(p.id));
  }, [products, watchlist, activeTab, activeCategory]);

  const animKey = `${activeTab}-${activeCategory ?? "all"}`;
  const emptyState = EMPTY_STATES[activeTab];

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={animKey}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -6 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
      >
        {filtered.length === 0 ? (
          <div className="flex min-h-[400px] flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-border bg-white">
            {emptyState ? (
              <>
                <emptyState.icon className="h-10 w-10 text-muted-foreground/30" strokeWidth={1.5} />
                <p className="text-sm text-muted-foreground">{emptyState.text}</p>
                {emptyState.sub && (
                  <p className="text-xs text-muted-foreground/70">{emptyState.sub}</p>
                )}
              </>
            ) : (
              <>
                <PackageSearch className="h-10 w-10 text-muted-foreground/30" strokeWidth={1.5} />
                <p className="text-sm text-muted-foreground">Bu bölümde henüz ürün yok.</p>
              </>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 xl:grid-cols-3">
            {filtered.map((product) =>
              activeTab === "kazandiklarim" ? (
                <WonCard key={product.id} product={product} />
              ) : (
                <AuctionCard key={product.id} product={product} />
              )
            )}
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  );
}
