import { create } from "zustand";
import type { NavTab, Category } from "../data/mockProducts";

interface UIState {
  activeTab: NavTab;
  activeCategory: Category | null;
  setTab: (tab: NavTab) => void;
  setCategory: (cat: Category | null) => void;
}

export const useUIStore = create<UIState>((set) => ({
  activeTab: "son-firsatlar",
  activeCategory: null,
  setTab: (tab) => set({ activeTab: tab, activeCategory: null }),
  setCategory: (activeCategory) => set({ activeCategory }),
}));
