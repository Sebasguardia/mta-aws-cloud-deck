// src/components/motion/ParallaxLayer.jsx
import React from "react";
import { motion } from "framer-motion";

/**
 * Capa con desplazamiento flotante suave para dar profundidad visual a los elementos de fondo.
 */
export function ParallaxLayer({ children, depth = 1, className = "" }) {
  const yOffset = depth * 12;

  return (
    <motion.div
      animate={{
        y: [-yOffset, yOffset, -yOffset],
      }}
      transition={{
        duration: 8 + depth * 2,
        repeat: Infinity,
        ease: "easeInOut",
      }}
      className={`pointer-events-none ${className}`}
    >
      {children}
    </motion.div>
  );
}

export default ParallaxLayer;
