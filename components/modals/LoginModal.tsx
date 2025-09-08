"use client";

import { useAuthStore } from "@/store/authStore";
import { useModalStore } from "@/store/modalStore";
import { motion, AnimatePresence } from "framer-motion";

export default function LoginModal() {
  const { modal, closeModal, openModal } = useModalStore();
  const { login, setLoading, loading } = useAuthStore();

  const handleLogin = () => {
    setLoading(true);
    setTimeout(() => {
      login({ id: "123", name: "Vaibhav", email: "vaibhav@example.com" });
      closeModal();
    }, 1000);
  };

if (modal !== "login") return null; 


  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          className="bg-background p-6 rounded-2xl shadow-lg w-11/12 max-w-md text-center"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
        >
          <h2 className="text-2xl font-bold mb-4">Login</h2>
          <button
            onClick={handleLogin}
            disabled={loading}
            className="px-6 py-3 bg-primary text-background rounded-xl w-full font-semibold hover:opacity-90"
          >
            {loading ? "Logging in..." : "Login with Dummy Account"}
          </button>
          <p className="mt-4 text-sm">
            Don’t have an account?{" "}
            <button
              className="text-blue-500 font-semibold"
              onClick={() => openModal("signup")}
            >
              Sign up
            </button>
          </p>
          <button onClick={closeModal} className="mt-4 text-muted">
            Cancel
          </button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
