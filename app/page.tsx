"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { FaHeart } from "react-icons/fa";

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background text-foreground px-6 text-center">
      
      {/* Logo + Title */}
      <motion.h1
        initial={{ opacity: 0, y: -40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-primary mb-6 drop-shadow-lg"
      >
        👐 SignoLingo
      </motion.h1>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.8 }}
        className="text-base sm:text-lg md:text-xl max-w-2xl mb-10"
      >
        Learn sign language the fun way — gamified lessons, practice challenges, and streaks just like Duolingo!
      </motion.p>

      {/* Call-to-action buttons */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.8 }}
        className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto"
      >
        <Link
          href="/lessons"
          className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-primary text-background font-semibold hover:opacity-90 shadow-lg transition text-center"
        >
          Start Learning
        </Link>
        {/* <Link
          href="/leaderboard"
          className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-background border-2 border-primary text-primary font-semibold hover:bg-muted shadow-lg transition text-center"
        >
          View Leaderboard
        </Link> */}
      </motion.div>

      {/* Footer */}
      <motion.footer
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.8 }}
        className="absolute bottom-4 text-xs sm:text-sm text-muted px-2 text-center flex gap-2"
      >
        Made with <FaHeart className="mt-1"/> by Team SignoLingo
      </motion.footer>
    </div>
  );
}
