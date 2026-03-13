"use client";

import { motion } from "framer-motion";

export default function Introduction() {
  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-6xl font-bold text-center"
      >
        Chờ cập nhật
      </motion.h1>
    </div>
  );
}
