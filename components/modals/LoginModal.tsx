"use client";

import { useAuthStore } from "@/store/authStore";
import { useModalStore } from "@/store/modalStore";
import { motion, AnimatePresence } from "framer-motion";
import { FaGoogle, FaTimes } from "react-icons/fa";
import { useState } from "react";
import GoogleLoginButton from "../GoogleLoginButton";

export default function LoginModal() {
  const { modal, closeModal, openModal } = useModalStore();
  const { login, loadingAction } = useAuthStore();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  if (modal !== "login") return null;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await login({ username, password });
    if (success) {
      closeModal();
      setUsername("");
      setPassword("");
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          className="relative bg-gray-900 p-6 rounded-2xl shadow-lg w-11/12 max-w-md text-center"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
        >
          {/* Close button */}
          <button
            onClick={closeModal}
            className="absolute top-3 right-3 text-foreground hover:text-primary"
          >
            <FaTimes size={18} />
          </button>

          {/* Title */}
          <h2 className="text-2xl font-bold mb-6 text-foreground">Log In</h2>

          {/* Username field */}
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full px-4 py-2 mb-3 rounded-lg border border-gray-700 bg-[--background] text-[--foreground] focus:outline-none focus:ring-2 focus:ring-primary"
          />

          {/* Password field */}
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 mb-4 rounded-lg border border-gray-700 bg-[--background] text-[--foreground] focus:outline-none focus:ring-2 focus:ring-primary"
          />

          {/* Login button */}
          <button
            onClick={handleLogin}
            disabled={loadingAction=="login"}
            className="w-full py-3 bg-primary text-background rounded-xl font-semibold hover:opacity-90 transition disabled:opacity-50"
          >
            {loadingAction ? "Logging in..." : "Login"}
          </button>

          {/* Divider */}
          <div className="flex items-center gap-3 my-4">
            <div className="flex-1 h-px bg-gray-700"></div>
            <span className="text-sm text-muted">or</span>
            <div className="flex-1 h-px bg-gray-700"></div>
          </div>

          {/* Google login */}
          <div
            className="w-full flex items-center justify-center rounded-xl"
          >
            <GoogleLoginButton />
          </div>

          {/* Signup link */}
          <p className="mt-4 text-sm">
            Don’t have an account?{" "}
            <button
              className="text-primary font-semibold"
              onClick={() => openModal("signup")}
            >
              Sign up
            </button>
          </p>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
