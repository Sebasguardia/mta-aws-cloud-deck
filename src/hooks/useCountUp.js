// src/hooks/useCountUp.js
import { useState, useEffect } from "react";

/**
 * Hook para animar números de forma suave con easing cuando se activa el componente.
 * @param {number} target - El número final al que llegará el contador
 * @param {number} durationMs - Duración total en milisegundos (default 1000ms)
 * @param {boolean} active - Si la animación debe correr (ej. cuando el slide está activo)
 * @returns {number} currentCount
 */
export function useCountUp(target, durationMs = 1000, active = true) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!active) {
      setCount(0);
      return;
    }

    let startTimestamp = null;
    let animationFrameId;

    // Función de easing outExpo: rápido al inicio, desaceleración suave al final
    const easeOutExpo = (t) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t));

    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / durationMs, 1);
      const easedProgress = easeOutExpo(progress);
      
      setCount(Math.round(easedProgress * target));

      if (progress < 1) {
        animationFrameId = window.requestAnimationFrame(step);
      }
    };

    animationFrameId = window.requestAnimationFrame(step);

    return () => {
      if (animationFrameId) {
        window.cancelAnimationFrame(animationFrameId);
      }
    };
  }, [target, durationMs, active]);

  return count;
}
