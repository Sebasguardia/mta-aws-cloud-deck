// src/hooks/useRevealSlideActive.js
import { useState, useEffect } from "react";
import { useDeckStore } from "../store/deckStore";

/**
 * Hook para saber si un slide específico está actualmente activo en pantalla.
 * Permite que las animaciones pesadas o contadores solo se ejecuten cuando el usuario está en ese slide.
 * @param {number} slideIndex - El índice base 0 de la diapositiva en reveal.js
 * @returns {boolean} isActive
 */
export function useRevealSlideActive(slideIndex) {
  const activeSlideIndex = useDeckStore((state) => state.activeSlideIndex);
  const setActiveSlideIndex = useDeckStore((state) => state.setActiveSlideIndex);
  const [isActive, setIsActive] = useState(activeSlideIndex === slideIndex);

  useEffect(() => {
    setIsActive(activeSlideIndex === slideIndex);
  }, [activeSlideIndex, slideIndex]);

  // Listener para sincronizar con el evento personalizado de RevealDeck
  useEffect(() => {
    function handleSlideChanged(e) {
      if (e.detail && typeof e.detail.indexh === "number") {
        setActiveSlideIndex(e.detail.indexh);
      }
    }

    window.addEventListener("deck:slidechanged", handleSlideChanged);
    return () => {
      window.removeEventListener("deck:slidechanged", handleSlideChanged);
    };
  }, [setActiveSlideIndex]);

  return isActive;
}
