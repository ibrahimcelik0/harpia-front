"use client";

import { motion } from "framer-motion";
import { CheckCircle2, TrendingDown, Gavel, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import Countdown from "./Countdown";
import { useMyBidsStore, type MyBid } from "../store/myBidsStore";

// ─────────────────────────────────────────────
// Yardımcılar
// ─────────────────────────────────────────────

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("tr-TR", {
    style: "currency",
    currency: "TRY",
    maximumFractionDigits: 0,
  }).format(amount);
}

const CATEGORY_STYLE: Record<string, { bg: string; emoji: string }> = {
  "Elektronik":       { bg: "bg-blue-50",    emoji: "🖥️" },
  "Aksesuar":         { bg: "bg-purple-50",  emoji: "⌚" },
  "Ses Sistemleri":   { bg: "bg-indigo-50",  emoji: "🎧" },
  "Tablet":           { bg: "bg-sky-50",     emoji: "📱" },
  "Ev & Yaşam":       { bg: "bg-emerald-50", emoji: "🏠" },
  "Fotoğraf & Video": { bg: "bg-amber-50",   emoji: "📸" },
  "Giyim":            { bg: "bg-pink-50",    emoji: "👗" },
};

// ─────────────────────────────────────────────
// Alt bileşenler
// ─────────────────────────────────────────────

function ProductImage({ category }: { category: string }) {
  const style = CATEGORY_STYLE[category] ?? { bg: "bg-muted", emoji: "📦" };
  return (
    <div
      className={cn(
        "flex h-[60px] w-[60px] shrink-0 items-center justify-center rounded-xl text-2xl",
        style.bg
      )}
    >
      {style.emoji}
    </div>
  );
}

function BidStatusBadge({ isLeading }: { isLeading: boolean }) {
  if (isLeading) {
    return (
      <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-600 ring-1 ring-emerald-200/70">
        <CheckCircle2 className="h-3.5 w-3.5" />
        Öndesiniz
      </span>
    );
  }
  return (
    <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-red-50 px-3 py-1 text-xs font-semibold text-red-500 ring-1 ring-red-200/70">
      <TrendingDown className="h-3.5 w-3.5" />
      Teklif Geçildi
    </span>
  );
}

function StatCard({
  label,
  value,
  valueClass,
}: {
  label: string;
  value: number;
  valueClass?: string;
}) {
  return (
    <div className="flex flex-1 flex-col gap-0.5 rounded-2xl bg-white px-5 py-4 shadow-[0_2px_12px_rgba(0,0,0,0.06)]">
      <span className={cn("text-2xl font-bold tabular-nums text-foreground", valueClass)}>
        {value}
      </span>
      <span className="text-xs font-medium text-muted-foreground">{label}</span>
    </div>
  );
}

// ─────────────────────────────────────────────
// Tekil teklif satırı
// ─────────────────────────────────────────────

function BidRow({ bid, index, onRaise }: { bid: MyBid; index: number; onRaise: (id: number) => void }) {
  const isLeading = bid.userBid >= bid.highestBid;

  return (
    <motion.li
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, ease: "easeOut", delay: index * 0.05 }}
      className="flex flex-col gap-4 px-5 py-4 sm:flex-row sm:items-center sm:gap-5"
    >

      {/* Sol — görsel + bilgiler */}
      <div className="flex min-w-0 flex-1 items-center gap-3">
        <ProductImage category={bid.category} />
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-foreground">
            {bid.productName}
          </p>
          <p className="mt-0.5 text-xs text-muted-foreground">{bid.category}</p>
          <div className="mt-1.5">
            <Countdown durationSeconds={bid.durationSeconds} />
          </div>
        </div>
      </div>

      {/* Orta — fiyat karşılaştırması */}
      <div className="ml-[72px] flex items-center gap-5 sm:ml-0 sm:shrink-0 sm:flex-col sm:items-end sm:gap-1">
        <div className="flex flex-col">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
            Sizin Teklifiniz
          </span>
          <span
            className={cn(
              "text-sm font-bold tabular-nums",
              isLeading ? "text-emerald-600" : "text-foreground"
            )}
          >
            {formatCurrency(bid.userBid)}
          </span>
        </div>

        <div className="h-4 w-px bg-border sm:hidden" />

        <div className="flex flex-col sm:items-end">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
            Güncel En Yüksek
          </span>
          <span
            className={cn(
              "text-sm font-bold tabular-nums",
              !isLeading && "text-red-500"
            )}
          >
            {formatCurrency(bid.highestBid)}
          </span>
        </div>
      </div>

      {/* Sağ — badge + buton */}
      <div className="ml-[72px] flex items-center gap-3 sm:ml-0 sm:shrink-0">
        <BidStatusBadge isLeading={isLeading} />

        {isLeading ? (
          <Button
            size="sm"
            disabled
            className="rounded-xl bg-muted px-4 text-xs font-semibold text-muted-foreground shadow-none"
          >
            Lidersiniz
          </Button>
        ) : (
          <Button
            size="sm"
            onClick={() => onRaise(bid.id)}
            className="rounded-xl bg-primary px-4 text-xs font-semibold text-primary-foreground hover:bg-primary/90"
          >
            <TrendingUp className="mr-1.5 h-3.5 w-3.5" />
            Teklifi Yükselt
          </Button>
        )}
      </div>
    </motion.li>
  );
}

// ─────────────────────────────────────────────
// Ana bileşen
// ─────────────────────────────────────────────

export default function MyBidsContent() {
  const bids = useMyBidsStore((s) => s.bids);
  const raiseBid = useMyBidsStore((s) => s.raiseBid);

  const leadingCount = bids.filter((b) => b.userBid >= b.highestBid).length;
  const outbidCount = bids.filter((b) => b.userBid < b.highestBid).length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className="mx-auto w-full max-w-3xl px-4 py-8 sm:px-6"
    >

      {/* Başlık */}
      <div className="mb-6 flex items-center gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10">
          <Gavel className="h-5 w-5 text-primary" strokeWidth={2.5} />
        </span>
        <div>
          <h1 className="text-xl font-semibold text-foreground">
            Teklif Verdiklerim
          </h1>
          <p className="text-sm text-muted-foreground">
            Aktif artırmalardaki teklifleriniz
          </p>
        </div>
      </div>

      {/* Özet kartlar */}
      <div className="mb-6 flex gap-3">
        <StatCard label="Toplam Teklif" value={bids.length} />
        <StatCard label="Önde" value={leadingCount} valueClass="text-emerald-600" />
        <StatCard label="Geride" value={outbidCount} valueClass="text-red-500" />
      </div>

      {/* Boş durum */}
      {bids.length === 0 ? (
        <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-border bg-white py-16">
          <Gavel
            className="h-10 w-10 text-muted-foreground/20"
            strokeWidth={1.5}
          />
          <p className="text-sm font-medium text-muted-foreground">
            Henüz teklif vermediniz.
          </p>
          <p className="text-xs text-muted-foreground">
            Ana sayfadaki artırmalara katılmaya başlayın.
          </p>
        </div>
      ) : (
        <ul className="flex flex-col divide-y divide-border overflow-hidden rounded-2xl bg-white shadow-[0_2px_12px_rgba(0,0,0,0.06)]">
          {bids.map((bid, i) => (
            <BidRow key={bid.id} bid={bid} index={i} onRaise={raiseBid} />
          ))}
        </ul>
      )}
    </motion.div>
  );
}
