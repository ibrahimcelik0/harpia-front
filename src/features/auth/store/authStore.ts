import { create } from "zustand";

export type MemberStatus = "Bronz Üye" | "Gümüş Üye" | "Altın Üye";

interface AuthState {
  isLoggedIn: boolean;
  phone: string;
  email: string;
  walletBalance: number;
  memberStatus: MemberStatus;
  // TODO: Firebase'den dönen kullanıcı nesnesi buraya eklenecek
  login: (phone?: string, email?: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  isLoggedIn: false,
  phone: "",
  email: "",
  walletBalance: 50_000,
  memberStatus: "Bronz Üye",
  login: (phone = "", email = "") => set({ isLoggedIn: true, phone, email }),
  logout: () => set({ isLoggedIn: false, phone: "", email: "" }),
}));
