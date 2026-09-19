// src/components/motion/CountUp.jsx
import React from "react";
import { useCountUp } from "../../hooks/useCountUp";

/**
 * Visualizador analógico-digital de métricas.
 * Emplea fuente mono de ancho fijo con ceros cruzados para evitar temblores de ancho durante el conteo.
 */
export function CountUp({
  value,
  duration = 1200,
  active = true,
  prefix = "",
  suffix = "",
  className = "",
  label,
}) {
  const count = useCountUp(value, duration, active);

  return (
    <div className="inline-flex flex-col items-baseline">
      <span
        className={`font-mono font-extrabold tabular-nums tracking-tight select-none ${className}`}
        style={{ fontFeatureSettings: "'tnum' 1, 'zero' 1" }}
      >
        {prefix}
        {count}
        {suffix}
      </span>
      {label && (
        <span className="font-mono text-[10px] uppercase tracking-tech text-current opacity-60 mt-0.5">
          {label}
        </span>
      )}
    </div>
  );
}

export default CountUp;
