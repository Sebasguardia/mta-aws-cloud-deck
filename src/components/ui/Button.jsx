// src/components/ui/Button.jsx
import React from "react";
import { motion } from "framer-motion";
import { easings } from "../../lib/easings";

/**
 * Botón con tactilidad industrial analógica.
 * Incorpora biselado mecánico, colapso de sombra física de 6px a 1px y micro-movimiento intencional.
 */
export function Button({
  children,
  onClick,
  variant = "primary",
  size = "md",
  icon: Icon,
  disabled = false,
  className = "",
  type = "button",
}) {
  const variantClasses = {
    primary:
      "bg-gold text-ink border-ink shadow-[5px_5px_0px_#0A0A0A] hover:bg-[#E5B026] active:bg-[#C99614]",
    secondary:
      "bg-paper text-ink border-ink shadow-[5px_5px_0px_#0A0A0A] hover:bg-white active:bg-[#E6E2D8]",
    outline:
      "bg-transparent text-ink border-ink shadow-[4px_4px_0px_#0A0A0A] hover:bg-ink hover:text-paper",
    dark:
      "bg-[#151515] text-paper border-gold shadow-[5px_5px_0px_#D4A017] hover:bg-[#202020] active:bg-black",
    risk:
      "bg-risk text-white border-ink shadow-[5px_5px_0px_#0A0A0A] hover:bg-[#b03822] active:bg-[#8f2b18]",
    safe:
      "bg-safe text-white border-ink shadow-[5px_5px_0px_#0A0A0A] hover:bg-[#68864d] active:bg-[#526b3c]",
  };

  const sizeClasses = {
    sm: "px-3.5 py-1.5 text-xs font-mono font-bold border-2",
    md: "px-6 py-3 text-xs font-display tracking-wider border-3",
    lg: "px-8 py-4 text-sm font-display tracking-widest border-3",
  };

  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled}
      whileHover={disabled ? {} : { x: -2, y: -2, boxShadow: "7px 7px 0px #0A0A0A" }}
      whileTap={disabled ? {} : { x: 3, y: 3, boxShadow: "1px 1px 0px #0A0A0A" }}
      transition={{ duration: 0.1, ease: easings.snappy }}
      className={`relative inline-flex items-center justify-center gap-2.5 font-display uppercase cursor-pointer select-none disabled:opacity-40 disabled:cursor-not-allowed ${
        variantClasses[variant] || variantClasses.primary
      } ${sizeClasses[size] || sizeClasses.md} ${className}`}
    >
      {/* Marcador táctil de esquina técnica */}
      <span className="absolute top-1 left-1 w-1.5 h-1.5 border-t-2 border-l-2 border-current opacity-30 pointer-events-none" />
      <span className="absolute bottom-1 right-1 w-1.5 h-1.5 border-b-2 border-r-2 border-current opacity-30 pointer-events-none" />

      {Icon && <Icon className="w-4 h-4 shrink-0" />}
      <span className="pt-0.5">{children}</span>
    </motion.button>
  );
}

export default Button;
