"use client";

import { useAuthStore } from "@/store/authStore";
import { useModalStore } from "@/store/modalStore";
import { motion, AnimatePresence } from "framer-motion";

export default function LogoutConfirmModal() {
  const { modal, closeModal } = useModalStore();
  const { logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    closeModal();
  };

  if (modal !== "logoutConfirm") return null; 

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          className="bg-background p-6 rounded-2xl shadow-lg w-11/12 max-w-sm text-center"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
        >
          <h2 className="text-xl font-semibold mb-4">
            Are you sure you want to logout?
          </h2>
          <div className="flex gap-4 justify-center">
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
            >
              Logout
            </button>
            <button
              onClick={closeModal}
              className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
            >
              Cancel
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
