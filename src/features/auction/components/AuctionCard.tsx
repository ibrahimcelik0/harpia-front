"use client";

import { useState } from "react";
import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import Countdown from "./Countdown";
import BidModal from "./BidModal";
import { useAuctionStore } from "../store/auctionStore";
import { cn } from "@/lib/utils";
import type { Product } from "../data/mockProducts";

interface AuctionCardProps {
  product: Product;
}

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("tr-TR", {
    style: "currency",
    currency: "TRY",
    maximumFractionDigits: 0,
  }).format(amount);
}

export default function AuctionCard({ product }: AuctionCardProps) {
  const [modalOpen, setModalOpen] = useState(false);

  const currentBid = useAuctionStore(
    (s) => s.products.find((p) => p.id === product.id)?.currentBid ?? product.currentBid
  );
  const bidCount = useAuctionStore(
    (s) => s.products.find((p) => p.id === product.id)?.bidCount ?? product.bidCount
  );
  const isWatched = useAuctionStore((s) => s.watchlist.includes(product.id));
  const toggleWatchlist = useAuctionStore((s) => s.toggleWatchlist);

  return (
    <>
      <article className="flex flex-col rounded-2xl bg-white shadow-[0_2px_12px_rgba(0,0,0,0.06)] transition-shadow hover:shadow-[0_4px_20px_rgba(0,0,0,0.1)]">
        {/* Ürün görseli alanı */}
        <div className="relative flex h-44 items-center justify-center rounded-t-2xl bg-muted/70">
          <span className="select-none text-3xl opacity-30">📦</span>
          <button
            onClick={(e) => { e.stopPropagation(); toggleWatchlist(product.id); }}
            className="absolute right-2.5 top-2.5 flex h-7 w-7 items-center justify-center rounded-full bg-white/80 shadow-sm backdrop-blur-sm transition-colors hover:bg-white"
            aria-label={isWatched ? "Takipten çıkar" : "Takibe al"}
          >
            <Heart
              className={cn("h-3.5 w-3.5 transition-colors", isWatched ? "fill-rose-500 text-rose-500" : "text-muted-foreground")}
              strokeWidth={2}
            />
          </button>
        </div>

        {/* Kart içeriği */}
        <div className="flex flex-1 flex-col gap-3 p-4">
          {/* Kategori + ürün adı */}
          <div>
            <span className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
              {product.category}
            </span>
            <h3 className="mt-0.5 line-clamp-2 text-sm font-semibold leading-snug text-foreground">
              {product.name}
            </h3>
          </div>

          {/* En yüksek teklif */}
          <div>
            <p className="text-[11px] text-muted-foreground">En Yüksek Teklif</p>
            <p className="text-xl font-bold tracking-tight text-foreground">
              {formatCurrency(currentBid)}
            </p>
            <p className="text-[11px] text-muted-foreground">
              {bidCount} teklif &middot; {product.lastBidAt}
            </p>
          </div>

          {/* Geri sayım */}
          <Countdown durationSeconds={product.durationSeconds} />

          {/* Teklif Ver butonu */}
          <Button
            onClick={() => setModalOpen(true)}
            className="mt-auto w-full rounded-xl bg-primary py-5 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          >
            Teklif Ver
          </Button>
        </div>
      </article>

      <BidModal
        product={product}
        currentBid={currentBid}
        open={modalOpen}
        onClose={() => setModalOpen(false)}
      />
    </>
  );
}
