import { create } from "zustand";

export type ModalType = "login" | "signup" | "logoutConfirm" | null;

type ModalState = {
  modal: ModalType;
  openModal: (modal: ModalType) => void;
  closeModal: () => void;
};

export const useModalStore = create<ModalState>((set) => ({
  modal: null,
  openModal: (modal) => set({ modal }),
  closeModal: () => set({ modal: null }),
}));
