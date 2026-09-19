// src/components/ui/Chip.jsx
import React from "react";
import { motion } from "framer-motion";
import { easings } from "../../lib/easings";

/**
 * Chip interactivo para mostrar stack, tags e integrantes del equipo.
 */
export function Chip({ label, sublabel, icon: Icon, active = false, onClick, className = "" }) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      whileHover={{ y: -3, scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      transition={easings.spring}
      className={`inline-flex items-center gap-2 px-3 py-1.5 border-2 text-xs font-mono font-bold tracking-wide select-none ${
        active
          ? "bg-gold text-ink border-ink shadow-[3px_3px_0px_#0A0A0A]"
          : "bg-paper text-ink border-ink shadow-[2px_2px_0px_#0A0A0A] hover:bg-white"
      } ${onClick ? "cursor-pointer" : "cursor-default"} ${className}`}
    >
      {Icon && <Icon className="w-3.5 h-3.5 shrink-0 text-gold" />}
      <span>{label}</span>
      {sublabel && <span className="opacity-60 text-[10px]">({sublabel})</span>}
    </motion.button>
  );
}

export default Chip;
