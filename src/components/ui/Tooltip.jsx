// src/components/ui/Tooltip.jsx
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { popoverMotion } from "../../lib/motionVariants";

/**
 * Micro-superficie de inspección contextual.
 * Emerge directamente desde el ancla con estilo de ficha técnica y puntero perimetral.
 */
export function Tooltip({ children, content, title, category, position = "top" }) {
  const [isVisible, setIsVisible] = useState(false);

  const positionClasses = {
    top: "bottom-full mb-3 left-1/2 -translate-x-1/2",
    bottom: "top-full mt-3 left-1/2 -translate-x-1/2",
    left: "right-full mr-3 top-1/2 -translate-y-1/2",
    right: "left-full ml-3 top-1/2 -translate-y-1/2",
  };

  return (
    <div
      className="relative inline-block"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
      onFocus={() => setIsVisible(true)}
      onBlur={() => setIsVisible(false)}
    >
      {children}
      <AnimatePresence>
        {isVisible && (
          <motion.div
            variants={popoverMotion}
            initial="hidden"
            animate="visible"
            exit="exit"
            className={`absolute z-50 w-72 p-3.5 bg-[#0F0F0F] text-paper border-2 border-gold shadow-[6px_6px_0px_#0A0A0A] text-xs font-body pointer-events-none select-none ${positionClasses[position]}`}
          >
            {/* Header técnico con tag de categoría */}
            <div className="flex items-center justify-between gap-2 pb-1.5 mb-2 border-b border-white/20">
              {title && (
                <span className="font-display text-gold uppercase tracking-wider text-[11px]">
                  {title}
                </span>
              )}
              {category && (
                <span className="font-mono text-[9px] uppercase tracking-tech text-white/50 bg-white/10 px-1.5 py-0.5">
                  {category}
                </span>
              )}
            </div>

            <p className="text-paper/85 leading-relaxed text-[11px] font-normal font-sans">
              {content}
            </p>

            {/* Código de inspección en la base */}
            <div className="mt-2 pt-1.5 border-t border-white/10 flex justify-between text-[9px] font-mono text-gold/70">
              <span>● AWS INSPECTOR</span>
              <span>VERIFICADO</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default Tooltip;
