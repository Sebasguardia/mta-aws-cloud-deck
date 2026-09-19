// src/components/motion/ClipReveal.jsx
import React from "react";
import { motion } from "framer-motion";
import { curtainReveal } from "../../lib/motionVariants";

/**
 * Contenedor con cortina cinemática tipo clip-path wipe.
 */
export function ClipReveal({ children, active = true, className = "", delay = 0 }) {
  return (
    <motion.div
      variants={curtainReveal}
      initial="hidden"
      animate={active ? "visible" : "hidden"}
      transition={{ delay }}
      className={`relative overflow-hidden ${className}`}
    >
      {children}
    </motion.div>
  );
}

export default ClipReveal;
