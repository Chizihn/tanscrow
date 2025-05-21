"use client";

import { ReactNode } from "react";
import { motion } from "framer-motion";

type AnimatedSectionProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
};

export function AnimatedSection({
  children,
  className = "",
  delay = 0.2,
}: AnimatedSectionProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.6, delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
