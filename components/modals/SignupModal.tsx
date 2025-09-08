"use client";

import { useModalStore } from "@/store/modalStore";
import { motion, AnimatePresence } from "framer-motion";

export default function SignupModal() {
  const { modal, closeModal, openModal } = useModalStore();

  const handleSignup = () => {
    // later: integrate backend signup
    alert("Signup not implemented yet 🚀");
    closeModal();
  };

  if (modal !== "signup") return null; 


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
          <h2 className="text-2xl font-bold mb-4">Sign Up</h2>
          <button
            onClick={handleSignup}
            className="px-6 py-3 bg-green-600 text-white rounded-xl w-full font-semibold hover:opacity-90"
          >
            Create Account
          </button>
          <p className="mt-4 text-sm">
            Already have an account?{" "}
            <button
              className="text-blue-500 font-semibold"
              onClick={() => openModal("login")}
            >
              Login
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
