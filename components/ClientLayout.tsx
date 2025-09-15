"use client";
import Navigation from "@/components/Navbar";
import LoginModal from "@/components/modals/LoginModal";
import SignupModal from "@/components/modals/SignupModal";
import LogoutConfirmModal from "@/components/modals/LogoutConfirmModal";
import { useAuthStore } from "@/store/authStore";
import { useEffect } from "react";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const checkAuth = useAuthStore((state) => state.checkAuth);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return (
    <>
      <Navigation />
      {children}
      <LoginModal />
      <SignupModal />
      <LogoutConfirmModal />
    </>
  );
}