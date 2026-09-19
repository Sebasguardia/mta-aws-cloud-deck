// src/components/ui/Card.jsx
import React from "react";
import { motion } from "framer-motion";
import { cardBrutalMotion, cardBrutalGoldMotion } from "../../lib/motionVariants";

/**
 * Tarjeta Neo-Brutalista inspirada en blueprints industriales y fichas técnicas suizas.
 * Cuenta con marca de serie técnica, esquinas marcadas y sombras tangibles.
 */
export function Card({
  children,
  variant = "paper",
  tag,
  serial,
  hoverable = true,
  className = "",
  onClick,
}) {
  const isDark = variant === "dark" || variant === "ink";
  const isGold = variant === "gold";

  const baseStyles = isDark
    ? "bg-[#101010] text-paper border-2 border-gold/40 shadow-[6px_6px_0px_#D4A017]"
    : isGold
    ? "bg-gold text-ink border-3 border-ink shadow-brutal"
    : "bg-paper text-ink border-3 border-ink shadow-brutal";

  const motionProps = hoverable
    ? {
        variants: isDark ? cardBrutalGoldMotion : cardBrutalMotion,
        initial: "rest",
        whileHover: "hover",
        whileTap: onClick ? "tap" : undefined,
      }
    : {};

  return (
    <motion.div
      onClick={onClick}
      {...motionProps}
      className={`relative p-6 ${onClick ? "cursor-pointer" : ""} ${baseStyles} ${className}`}
    >
      {/* Guías de cruce arquitectónico / crosshairs en esquinas */}
      <span className="absolute -top-1.5 -left-1.5 w-3 h-3 text-gold font-mono text-[11px] leading-none font-bold select-none pointer-events-none">
        +
      </span>
      <span className="absolute -bottom-1.5 -right-1.5 w-3 h-3 text-gold font-mono text-[11px] leading-none font-bold select-none pointer-events-none">
        +
      </span>

      {/* Cabecera técnica opcional de la tarjeta */}
      {(tag || serial) && (
        <div className="flex items-center justify-between gap-2 pb-3 mb-4 border-b border-current/15 font-mono text-[10px] uppercase tracking-tech font-bold opacity-70">
          <span>{tag || "ESPECIFICACIÓN TÉCNICA"}</span>
          {serial && <span>{serial}</span>}
        </div>
      )}

      {children}
    </motion.div>
  );
}

export default Card;
