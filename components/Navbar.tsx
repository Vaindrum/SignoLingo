// src/components/Navigation.tsx
"use client";

import Link from "next/link";
import { FaHome, FaBookOpen, FaTrophy, FaUser } from "react-icons/fa";
import { useAuthStore } from "@/store/authStore";
import { useModalStore } from "@/store/modalStore";

export default function Navigation() {
    const { authUser } = useAuthStore();
    const { openModal } = useModalStore();

    return (
    <>
      {/* Desktop Navbar */}
      <nav className="hidden md:flex justify-between items-center px-8 py-4 shadow-sm bg-background sticky top-0 z-50">
        <div className="text-xl font-bold">SignoLingo</div>
        <div className="flex gap-6">
          <Link href="/" className="hover:text-blue-500">Home</Link>
          <Link href="/learn" className="hover:text-blue-500">Learn</Link>
          <Link href="/progress" className="hover:text-blue-500">Progress</Link>
          {authUser ? (
          <div className="flex gap-4 items-center">
            {/* <span>Hello, {authUser.username}</span> */}
            <button
              onClick={() => openModal("logoutConfirm")}
              className="text-red-500 font-semibold hover:underline"
            >
              Logout
            </button>
          </div>
        ) : (
          <button
            onClick={() => openModal("login")}
            className="hover:text-blue-500"
          >
            Login
          </button>
        )}
        </div>
      </nav>

      {/* Mobile Bottom Menu */}
      <nav className="md:hidden fixed bottom-0 left-0 w-full bg-background border-t border-gray-200 shadow-t z-50">
        <div className="flex justify-around items-center py-2">
          <Link href="/" className="flex flex-col items-center text-sm">
            <FaHome className="w-6 h-6" />
            <span>Home</span>
          </Link>
          <Link href="/learn" className="flex flex-col items-center text-sm">
            <FaBookOpen className="w-6 h-6" />
            <span>Learn</span>
          </Link>
          <Link href="/progress" className="flex flex-col items-center text-sm">
            <FaTrophy className="w-6 h-6" />
            <span>Progress</span>
          </Link>
          {authUser ? (
          <div className="flex gap-4 items-center">
            {/* <span>Hello, {authUser.username}</span> */}
            <button
              onClick={() => openModal("logoutConfirm")}
              className="text-red-500 font-semibold hover:underline"
            >
              Logout
            </button>
          </div>
        ) : (
          <button
            onClick={() => openModal("login")}
            className="flex flex-col items-center text-sm"
          >
            <FaUser className="w-6 h-6" /> Login
          </button>
        )}
        </div>
      </nav>
    </>
  );
}
