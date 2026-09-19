// src/components/ui/Badge.jsx
import React from "react";

/**
 * Insignia de estado de ingeniería y hardware industrial.
 * Micro-superficies funcionales con esquinas mecánicas, pernos perimetrales y tipografía estricta.
 */
export function Badge({ children, variant = "gold", size = "md", pulse = false, icon: Icon, className = "" }) {
  const variantStyles = {
    gold: "bg-gold text-ink border-ink shadow-[2px_2px_0px_#0A0A0A]",
    risk: "bg-risk text-white border-ink shadow-[2px_2px_0px_#0A0A0A]",
    safe: "bg-safe text-white border-ink shadow-[2px_2px_0px_#0A0A0A]",
    olive: "bg-olive text-paper border-ink shadow-[2px_2px_0px_#0A0A0A]",
    ink: "bg-ink text-gold border-gold/40 shadow-[2px_2px_0px_rgba(212,160,23,0.35)]",
    ghost: "bg-transparent text-ink border-ink/40",
    blueprint: "bg-[#0c1626] text-[#64B5F6] border-[#1E88E5]/50 shadow-[2px_2px_0px_#0d47a1]",
  };

  const sizeStyles = {
    sm: "px-2 py-0.5 text-[10px] tracking-wider",
    md: "px-2.5 py-1 text-xs tracking-wider",
    lg: "px-3.5 py-1.5 text-sm tracking-widest",
  };

  return (
    <span
      className={`relative inline-flex items-center gap-1.5 font-mono font-bold uppercase select-none border-2 transition-transform duration-100 active:scale-95 ${
        variantStyles[variant] || variantStyles.gold
      } ${sizeStyles[size] || sizeStyles.md} ${className}`}
    >
      {/* Pernos táctiles industriales en las esquinas */}
      <span className="w-1 h-1 bg-current opacity-30 absolute top-0.5 left-0.5 pointer-events-none" />
      <span className="w-1 h-1 bg-current opacity-30 absolute top-0.5 right-0.5 pointer-events-none" />

      {pulse && (
        <span className="relative flex h-2 w-2 shrink-0">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-current opacity-75" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-current" />
        </span>
      )}

      {Icon && <Icon className="w-3.5 h-3.5 shrink-0" />}
      <span className="leading-none pt-0.5">{children}</span>
    </span>
  );
}

export default Badge;
