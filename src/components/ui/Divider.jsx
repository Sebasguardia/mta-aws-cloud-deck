// src/components/ui/Divider.jsx
import React from "react";

/**
 * Divisor brutalista industrial con símbolo crosshair opcional o label técnico.
 */
export function Divider({ label, variant = "solid", className = "" }) {
  return (
    <div className={`relative flex items-center my-6 select-none ${className}`}>
      <div
        className={`flex-grow ${
          variant === "dashed"
            ? "border-b-2 border-dashed border-ink/30"
            : "border-b-2 border-ink/20"
        }`}
      />
      {label ? (
        <span className="px-3 font-mono text-[10px] uppercase font-bold tracking-tech text-ink/70 bg-paper border border-ink/40">
          {label}
        </span>
      ) : (
        <span className="px-2 font-mono text-xs text-gold font-extrabold">+</span>
      )}
      <div
        className={`flex-grow ${
          variant === "dashed"
            ? "border-b-2 border-dashed border-ink/30"
            : "border-b-2 border-ink/20"
        }`}
      />
    </div>
  );
}

export default Divider;
