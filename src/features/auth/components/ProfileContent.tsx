"use client";

import { User, Gavel, Heart, Wallet, Clock, ChevronRight } from "lucide-react";
import { useAuthStore } from "../store/authStore";
import { useAuctionStore } from "@/features/auction/store/auctionStore";
import Countdown from "@/features/auction/components/Countdown";
import { cn } from "@/lib/utils";

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("tr-TR", {
    style: "currency",
    currency: "TRY",
    maximumFractionDigits: 0,
  }).format(amount);
}

/* ── Profil Başlığı ── */
function ProfileHeader() {
  const { phone, memberStatus } = useAuthStore();

  const statusColor: Record<string, string> = {
    "Bronz Üye": "bg-amber-700/10 text-amber-700",
    "Gümüş Üye": "bg-slate-400/10 text-slate-500",
    "Altın Üye": "bg-yellow-500/10 text-yellow-600",
  };

  return (
    <div className="flex items-center gap-5 rounded-2xl bg-white px-6 py-5 shadow-[0_2px_12px_rgba(0,0,0,0.06)]">
      <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-primary/10">
        <User className="h-7 w-7 text-primary" strokeWidth={1.8} />
      </span>
      <div className="flex flex-col gap-1">
        <p className="text-base font-semibold text-foreground">
          {phone || "+90 5__ ___ __ __"}
        </p>
        <span className={cn("w-fit rounded-full px-2.5 py-0.5 text-xs font-medium", statusColor[memberStatus])}>
          {memberStatus}
        </span>
      </div>
    </div>
  );
}

/* ── Sanal Cüzdan ── */
function WalletCard() {
  const { walletBalance, memberStatus, phone } = useAuthStore();
  const last4 = phone ? phone.slice(-4) : "0000";

  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-800 via-slate-800 to-primary p-6 text-white shadow-[0_8px_24px_rgba(0,0,0,0.18)]">
      {/* Dekoratif çemberler */}
      <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/5" />
      <div className="pointer-events-none absolute -bottom-16 -right-6 h-52 w-52 rounded-full bg-white/5" />

      {/* Logo */}
      <div className="flex items-center gap-2">
        <Gavel className="h-4 w-4" strokeWidth={2.5} />
        <span className="text-sm font-semibold tracking-wide">Harpia</span>
      </div>

      {/* Çip */}
      <div className="mt-5 flex h-7 w-10 items-center justify-center rounded-md bg-yellow-300/80">
        <div className="grid grid-cols-2 gap-0.5">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-1.5 w-1.5 rounded-sm bg-yellow-700/60" />
          ))}
        </div>
      </div>

      {/* Bakiye */}
      <div className="mt-4">
        <p className="text-xs text-white/50">Sanal Bakiye</p>
        <p className="mt-0.5 text-3xl font-bold tracking-tight">
          {formatCurrency(walletBalance)}
        </p>
      </div>

      {/* Kart numarası */}
      <p className="mt-5 font-mono text-sm tracking-[0.2em] text-white/40">
        •••• •••• •••• {last4 || "4242"}
      </p>

      {/* Alt kısım */}
      <div className="mt-3 flex items-end justify-between">
        <div>
          <p className="text-[10px] uppercase tracking-widest text-white/40">Üye Statüsü</p>
          <p className="text-sm font-medium">{memberStatus}</p>
        </div>
        {/* Mastercard benzeri çemberler */}
        <div className="flex -space-x-3">
          <div className="h-9 w-9 rounded-full bg-rose-400/80 shadow" />
          <div className="h-9 w-9 rounded-full bg-amber-300/80 shadow" />
        </div>
      </div>
    </div>
  );
}

/* ── Aktif Tekliflerim ── */
function ActiveBids() {
  const activeBids = useAuctionStore((s) => s.activeBids);

  return (
    <section className="flex flex-col gap-3">
      <h2 className="flex items-center gap-2 text-sm font-semibold text-foreground">
        <Gavel className="h-4 w-4 text-primary" strokeWidth={2.5} />
        Aktif Tekliflerim
        {activeBids.length > 0 && (
          <span className="ml-auto rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
            {activeBids.length}
          </span>
        )}
      </h2>

      {activeBids.length === 0 ? (
        <div className="flex flex-col items-center gap-2 rounded-2xl border border-dashed border-border bg-white py-8">
          <Gavel className="h-7 w-7 text-muted-foreground/30" strokeWidth={1.5} />
          <p className="text-sm text-muted-foreground">Henüz aktif teklifiniz yok.</p>
        </div>
      ) : (
        <ul className="flex flex-col divide-y divide-border overflow-hidden rounded-2xl bg-white shadow-[0_2px_12px_rgba(0,0,0,0.06)]">
          {activeBids.map((bid) => (
            <li key={bid.productId} className="flex items-center gap-3 px-4 py-3">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-muted text-base">
                📦
              </span>
              <div className="flex flex-1 flex-col gap-0.5 min-w-0">
                <p className="truncate text-sm font-medium text-foreground">{bid.productName}</p>
                <p className="text-[11px] text-muted-foreground">{bid.category}</p>
              </div>
              <div className="flex flex-col items-end gap-1 shrink-0">
                <span className="text-sm font-bold text-foreground">{formatCurrency(bid.amount)}</span>
                <Countdown durationSeconds={bid.durationSeconds} />
              </div>
              <ChevronRight className="h-3.5 w-3.5 shrink-0 text-muted-foreground/40" />
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

/* ── Takip Listesi ── */
function Watchlist() {
  const products = useAuctionStore((s) => s.products);
  const watchlist = useAuctionStore((s) => s.watchlist);
  const toggleWatchlist = useAuctionStore((s) => s.toggleWatchlist);
  const watched = products.filter((p) => watchlist.includes(p.id));

  return (
    <section className="flex flex-col gap-3">
      <h2 className="flex items-center gap-2 text-sm font-semibold text-foreground">
        <Heart className="h-4 w-4 text-rose-500" strokeWidth={2.5} />
        Takip Listesi
        {watched.length > 0 && (
          <span className="ml-auto rounded-full bg-rose-50 px-2 py-0.5 text-xs font-medium text-rose-500">
            {watched.length}
          </span>
        )}
      </h2>

      {watched.length === 0 ? (
        <div className="flex flex-col items-center gap-2 rounded-2xl border border-dashed border-border bg-white py-8">
          <Heart className="h-7 w-7 text-muted-foreground/30" strokeWidth={1.5} />
          <p className="text-sm text-muted-foreground">Takip ettiğiniz ürün yok.</p>
          <p className="text-xs text-muted-foreground">Ürün kartlarındaki ♡ ikonunu kullanın.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {watched.map((p) => (
            <div
              key={p.id}
              className="flex flex-col rounded-2xl bg-white p-3 shadow-[0_2px_12px_rgba(0,0,0,0.06)]"
            >
              <div className="flex h-24 items-center justify-center rounded-xl bg-muted/70 text-2xl">
                📦
              </div>
              <p className="mt-2 line-clamp-1 text-xs font-medium text-foreground">{p.name}</p>
              <p className="mt-0.5 text-xs font-bold text-foreground">{formatCurrency(p.currentBid)}</p>
              <button
                onClick={() => toggleWatchlist(p.id)}
                className="mt-2 flex items-center justify-center gap-1 rounded-lg py-1 text-[11px] text-rose-500 transition-colors hover:bg-rose-50"
              >
                <Heart className="h-3 w-3 fill-rose-500" strokeWidth={0} />
                Takibi bırak
              </button>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

/* ── Ana bileşen ── */
export default function ProfileContent() {
  const isLoggedIn = useAuthStore((s) => s.isLoggedIn);

  if (!isLoggedIn) {
    return (
      <div className="flex flex-col items-center gap-3 py-24">
        <User className="h-10 w-10 text-muted-foreground/30" strokeWidth={1.5} />
        <p className="text-sm text-muted-foreground">Bu sayfayı görmek için giriş yapmalısınız.</p>
        <a href="/login" className="text-sm font-medium text-primary underline-offset-2 hover:underline">
          Giriş Yap
        </a>
      </div>
    );
  }

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-6 px-4 py-8 sm:px-6">
      <ProfileHeader />

      <div className="grid gap-6 lg:grid-cols-2">
        <ActiveBids />
        <div className="flex flex-col gap-3">
          <h2 className="flex items-center gap-2 text-sm font-semibold text-foreground">
            <Wallet className="h-4 w-4 text-primary" strokeWidth={2.5} />
            Sanal Cüzdan
          </h2>
          <WalletCard />
        </div>
      </div>

      <Watchlist />
    </div>
  );
}
