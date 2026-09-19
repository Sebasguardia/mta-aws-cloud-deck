// src/components/ui/SectionLabel.jsx
import React from "react";

/**
 * Indicador de jerarquía editorial y técnica para diapositivas.
 * Combina un tag de plano de ingeniería con la firma caligráfica artesanal.
 */
export function SectionLabel({ num, text, scriptTag, variant = "default" }) {
  const isDark = variant === "dark";

  return (
    <div className="inline-flex flex-col gap-1.5 mb-3 select-none">
      {scriptTag && (
        <span className="font-script text-gold text-2xl md:text-3xl -rotate-2 origin-left tracking-normal drop-shadow-sm">
          {scriptTag}
        </span>
      )}
      <div
        className={`inline-flex items-center gap-2.5 px-3 py-1 border-2 text-[11px] font-mono font-bold tracking-tech uppercase ${
          isDark
            ? "bg-ink text-paper border-gold shadow-[3px_3px_0px_#D4A017]"
            : "bg-paper text-ink border-ink shadow-brutal-sm"
        }`}
      >
        <span className="w-2 h-2 rounded-none bg-gold animate-pulse" />
        {num && <span className="text-gold font-extrabold">{num} //</span>}
        <span>{text}</span>
        <span className="text-[9px] opacity-40 ml-1">#MTA-CLOUD</span>
      </div>
    </div>
  );
}

export default SectionLabel;
