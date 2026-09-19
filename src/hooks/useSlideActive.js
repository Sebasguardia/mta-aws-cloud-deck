// src/hooks/useSlideActive.js
/**
 * Hook que devuelve `true` cuando el slide con el índice dado está activo.
 *
 * Escucha el evento `deck:slidechanged` que RevealDeck despacha en `window`
 * cada vez que cambia el slide. También detecta el slide inicial.
 *
 * Uso:
 *   const isActive = useSlideActive(1); // → true cuando Reveal muestra el slide 1
 *
 * Ventaja sobre prop-drilling isActive: no depende de que App.jsx
 * actualice el estado y lo pase hacia abajo — funciona de forma autónoma.
 */
import { useState, useEffect } from "react";

export function useSlideActive(slideIndex) {
  const [active, setActive] = useState(false);

  useEffect(() => {
    // Manejador del evento personalizado que dispara RevealDeck
    const onSlideChanged = (e) => {
      const { indexh } = e.detail ?? {};
      setActive(indexh === slideIndex);
    };

    // Verificar si __revealDeck ya existe o si el hash en URL coincide
    const checkState = () => {
      if (window.__revealDeck) {
        const { h } = window.__revealDeck.getIndices();
        setActive(h === slideIndex);
        return;
      }
      // Si deck aún no está inicializado, inferir por URL hash (ej. #/1)
      const hash = window.location.hash;
      const match = hash.match(/#\/(\d+)/);
      if (match) {
        setActive(parseInt(match[1], 10) === slideIndex);
      } else if (slideIndex === 0) {
        setActive(true);
      }
    };

    window.addEventListener("deck:slidechanged", onSlideChanged);
    window.addEventListener("hashchange", checkState);
    checkState();

    const timer1 = setTimeout(checkState, 150);
    const timer2 = setTimeout(checkState, 500);

    return () => {
      window.removeEventListener("deck:slidechanged", onSlideChanged);
      window.removeEventListener("hashchange", checkState);
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, [slideIndex]);

  return active;
}
