"use client";
import { motion } from "framer-motion";
import { ReactNode } from "react";

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.05 } },
};

const item = {
  hidden: { opacity: 0, y: 15 },
  show: { opacity: 1, y: 0, transition: { duration: 0.3 } },
};

export function AnimatedGrid({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <motion.div variants={container} initial="hidden" animate="show" className={className}>
      {children}
    </motion.div>
  );
}

export function AnimatedItem({ children }: { children: ReactNode }) {
  return <motion.div variants={item}>{children}</motion.div>;
}
