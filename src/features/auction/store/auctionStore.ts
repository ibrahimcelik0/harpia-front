import { create } from "zustand";
import { mockProducts, type Product } from "../data/mockProducts";

export interface ActiveBid {
  productId: number;
  productName: string;
  category: string;
  amount: number;
  durationSeconds: number;
}

interface AuctionState {
  products: Product[];
  activeBids: ActiveBid[];
  watchlist: number[]; // product id'leri
  // TODO: Gerçek backend'den ürünleri çekmek için TanStack Query buraya bağlanacak
  placeBid: (productId: number, amount: number) => void;
  toggleWatchlist: (productId: number) => void;
}

export const useAuctionStore = create<AuctionState>((set) => ({
  products: mockProducts,
  activeBids: [],
  watchlist: [],

  placeBid: (productId, amount) =>
    set((state) => {
      const product = state.products.find((p) => p.id === productId);
      const now = new Date();
      const lastBidAt = now.toLocaleString("tr-TR", {
        day: "2-digit", month: "short", year: "numeric",
        hour: "2-digit", minute: "2-digit",
      });

      // Aynı ürüne önceki teklif varsa güncelle, yoksa ekle
      const existing = state.activeBids.findIndex((b) => b.productId === productId);
      const newBid: ActiveBid = {
        productId,
        productName: product?.name ?? "",
        category: product?.category ?? "",
        amount,
        durationSeconds: product?.durationSeconds ?? 0,
      };
      const activeBids =
        existing >= 0
          ? state.activeBids.map((b, i) => (i === existing ? newBid : b))
          : [...state.activeBids, newBid];

      return {
        activeBids,
        products: state.products.map((p) =>
          p.id === productId
            ? { ...p, currentBid: amount, bidCount: p.bidCount + 1, lastBidAt }
            : p
        ),
      };
    }),

  toggleWatchlist: (productId) =>
    set((state) => ({
      watchlist: state.watchlist.includes(productId)
        ? state.watchlist.filter((id) => id !== productId)
        : [...state.watchlist, productId],
    })),
}));
