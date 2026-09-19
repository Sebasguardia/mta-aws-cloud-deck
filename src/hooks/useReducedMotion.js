// src/hooks/useReducedMotion.js
import { useState, useEffect } from "react";

/**
 * Hook para detectar si el usuario tiene activada la preferencia de movimiento reducido en su sistema operativo.
 * Cumple con accesibilidad y las directrices de Emil Kowalski / Impeccable.
 * @returns {boolean} prefersReducedMotion
 */
export function useReducedMotion() {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;

    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mediaQuery.matches);

    const listener = (event) => {
      setPrefersReducedMotion(event.matches);
    };

    mediaQuery.addEventListener("change", listener);
    return () => mediaQuery.removeEventListener("change", listener);
  }, []);

  return prefersReducedMotion;
}
