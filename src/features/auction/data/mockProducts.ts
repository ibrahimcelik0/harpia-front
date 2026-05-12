export interface Product {
  id: number;
  name: string;
  category: string;
  currentBid: number;
  bidCount: number;
  durationSeconds: number;
  lastBidAt: string; // "12 Mayıs 2026, 14:37" formatında
}

export const CATEGORIES = [
  "Elektronik",
  "Aksesuar",
  "Ses Sistemleri",
  "Tablet",
  "Ev & Yaşam",
  "Fotoğraf & Video",
  "Giyim",
] as const;

export type Category = (typeof CATEGORIES)[number];

export type NavTab =
  | "son-firsatlar"
  | "yeni-gelenler"
  | "kategoriler"
  | "takip-ettiklerim"
  | "kazandiklarim";

// TODO: Gerçek veri TanStack Query + backend ile buraya bağlanacak
export const mockProducts: Product[] = [
  { id: 1,  name: "PlayStation 5 Oyun Konsolu", category: "Elektronik",       currentBid: 15_400, bidCount: 34, durationSeconds: 4 * 60 + 22,      lastBidAt: "12 May 2026, 14:51" },
  { id: 2,  name: "Apple Watch Series 9",        category: "Aksesuar",         currentBid: 8_750,  bidCount: 21, durationSeconds: 12 * 60 + 5,       lastBidAt: "12 May 2026, 14:43" },
  { id: 3,  name: "Sony WH-1000XM5 Kulaklık",   category: "Ses Sistemleri",   currentBid: 4_200,  bidCount: 18, durationSeconds: 1 * 3600 + 37 * 60, lastBidAt: "12 May 2026, 13:18" },
  { id: 4,  name: "De'Longhi Kahve Makinesi",    category: "Ev & Yaşam",       currentBid: 6_900,  bidCount: 9,  durationSeconds: 28 * 60 + 10,      lastBidAt: "12 May 2026, 14:27" },
  { id: 5,  name: "iPad Pro 12.9\" M4",          category: "Tablet",           currentBid: 22_300, bidCount: 47, durationSeconds: 2 * 60 + 55,       lastBidAt: "12 May 2026, 14:52" },
  { id: 6,  name: "DJI Mini 4 Pro Drone",        category: "Fotoğraf & Video", currentBid: 11_100, bidCount: 29, durationSeconds: 45 * 60,           lastBidAt: "12 May 2026, 14:10" },
  { id: 7,  name: "GoPro Hero 12 Black",         category: "Fotoğraf & Video", currentBid: 3_650,  bidCount: 12, durationSeconds: 3 * 3600 + 10 * 60, lastBidAt: "12 May 2026, 11:45" },
  { id: 8,  name: "Dyson V15 Detect Süpürge",    category: "Ev & Yaşam",       currentBid: 7_480,  bidCount: 16, durationSeconds: 18 * 60 + 40,      lastBidAt: "12 May 2026, 14:36" },
  { id: 9,  name: "MacBook Air M3 15\"",         category: "Elektronik",       currentBid: 34_900, bidCount: 58, durationSeconds: 2 * 3600 + 15 * 60, lastBidAt: "12 May 2026, 12:40" },
  { id: 10, name: "AirPods Pro 2. Nesil",        category: "Aksesuar",         currentBid: 3_100,  bidCount: 11, durationSeconds: 1 * 3600 + 20 * 60, lastBidAt: "12 May 2026, 13:35" },
  { id: 11, name: "Samsung QLED 55\" 4K TV",     category: "Elektronik",       currentBid: 18_600, bidCount: 39, durationSeconds: 6 * 60 + 30,       lastBidAt: "12 May 2026, 14:48" },
  { id: 12, name: "Nike Air Max 270",            category: "Giyim",            currentBid: 1_850,  bidCount: 7,  durationSeconds: 1 * 3600 + 5 * 60,  lastBidAt: "12 May 2026, 13:50" },
  { id: 13, name: "Levi's 501 Orijinal Jean",    category: "Giyim",            currentBid: 980,    bidCount: 4,  durationSeconds: 2 * 3600 + 40 * 60, lastBidAt: "12 May 2026, 12:15" },
];

// Hangi sekme hangi ürünleri gösterir
export const TAB_PRODUCT_IDS: Record<NavTab, number[]> = {
  "son-firsatlar":    [1, 2, 4, 5, 8, 11],
  "yeni-gelenler":    [3, 6, 7, 9, 10, 12, 13],
  "kategoriler":      [],
  "takip-ettiklerim": [], // Watchlist Zustand'dan okunur, bu liste kullanılmaz
  "kazandiklarim":    [2, 8],
};
