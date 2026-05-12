import { create } from "zustand";

export type MemberStatus = "Bronz Üye" | "Gümüş Üye" | "Altın Üye";

interface AuthState {
  isLoggedIn: boolean;
  phone: string;
  walletBalance: number;
  memberStatus: MemberStatus;
  // TODO: Firebase'den dönen kullanıcı nesnesi buraya eklenecek
  login: (phone?: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  isLoggedIn: false,
  phone: "",
  walletBalance: 50_000,
  memberStatus: "Bronz Üye",
  login: (phone = "") => set({ isLoggedIn: true, phone }),
  logout: () => set({ isLoggedIn: false, phone: "" }),
}));
