import { create } from 'zustand';

interface UiState {
  isSidebarPinned: boolean;
  toggleSidebarPin: () => void;
}

export const useUiStore = create<UiState>((set) => ({
  isSidebarPinned: true,
  toggleSidebarPin: () => set((state) => ({ isSidebarPinned: !state.isSidebarPinned })),
}));