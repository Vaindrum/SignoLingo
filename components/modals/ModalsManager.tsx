"use client";

import { useModalStore } from "@/store/modalStore";
import LoginModal from "./LoginModal";
import SignupModal from "./SignupModal";
import LogoutConfirmModal from "./LogoutConfirmModal";

export default function ModalManager() {
  const { modal } = useModalStore();

  return (
    <>
      {modal === "login" && <LoginModal />}
      {modal === "signup" && <SignupModal />}
      {modal === "logoutConfirm" && <LogoutConfirmModal />}
    </>
  );
}
