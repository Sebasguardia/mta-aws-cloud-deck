// src/components/motion/CanvasTransitionWrapper.jsx
import React from "react";
import { motion, AnimatePresence } from "framer-motion";

/**
 * CanvasTransitionWrapper Component.
 * Transición cinematográfica escalonada para los contenedores 3D.
 * Configurado con un retraso deliberado (delay por defecto 0.45s) para que el objeto 3D
 * aparezca AL FINAL de la secuencia de entrada, después de los títulos, badges y tarjetas UI.
 */
export function CanvasTransitionWrapper({
  isActive,
  delay = 0.45,
  duration = 0.6,
  children,
  className = "",
  style = {},
}) {
  return (
    <AnimatePresence mode="wait">
      {isActive && (
        <motion.div
          key="3d-canvas-wrapper"
          initial={{ opacity: 0, scale: 0.94, y: 16, filter: "blur(6px)" }}
          animate={{ opacity: 1, scale: 1, y: 0, filter: "blur(0px)" }}
          exit={{ opacity: 0, scale: 0.97, y: -8, filter: "blur(3px)" }}
          transition={{ duration, ease: [0.16, 1, 0.3, 1], delay }}
          className={className}
          style={{
            width: "100%",
            height: "100%",
            position: "relative",
            ...style,
          }}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default CanvasTransitionWrapper;
