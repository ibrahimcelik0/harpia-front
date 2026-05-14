import { create } from "zustand";

export interface MyBid {
  id: number;
  productName: string;
  category: string;
  userBid: number;
  highestBid: number;
  durationSeconds: number;
}

// TODO: Gerçek veri — kullanıcının aktif teklifleri TanStack Query ile backend'den çekilecek
const INITIAL_BIDS: MyBid[] = [
  { id: 1, productName: 'iPad Pro 12.9" M4',         category: "Tablet",           userBid: 22_300, highestBid: 22_300, durationSeconds: 175   },
  { id: 2, productName: "Sony WH-1000XM5 Kulaklık",  category: "Ses Sistemleri",   userBid:  4_200, highestBid:  4_200, durationSeconds: 5_820  },
  { id: 3, productName: 'MacBook Air M3 15"',         category: "Elektronik",       userBid: 34_900, highestBid: 34_900, durationSeconds: 8_100  },
  { id: 4, productName: "PlayStation 5 Oyun Konsolu", category: "Elektronik",       userBid: 14_800, highestBid: 15_400, durationSeconds: 262    },
  { id: 5, productName: "DJI Mini 4 Pro Drone",       category: "Fotoğraf & Video", userBid: 10_500, highestBid: 11_100, durationSeconds: 2_700  },
  { id: 6, productName: 'Samsung QLED 55" 4K TV',     category: "Elektronik",       userBid: 17_200, highestBid: 18_600, durationSeconds: 390    },
  { id: 7, productName: "Apple Watch Series 9",       category: "Aksesuar",         userBid:  8_750, highestBid:  8_750, durationSeconds: 725    },
  { id: 8, productName: "De'Longhi Kahve Makinesi",   category: "Ev & Yaşam",       userBid:  6_200, highestBid:  6_900, durationSeconds: 1_690  },
];

interface MyBidsState {
  bids: MyBid[];
  // TODO: Teklif yükseltme — BidModal açılacak ve backend'e POST isteği gönderilecek
  raiseBid: (bidId: number) => void;
}

export const useMyBidsStore = create<MyBidsState>(() => ({
  bids: INITIAL_BIDS,

  raiseBid: (bidId) => {
    // TODO: Backend'e yeni teklif tutarı gönderilecek, şimdilik log
    console.log("[MyBidsStore] Teklif yükseltme isteği — bidId:", bidId);
  },
}));
