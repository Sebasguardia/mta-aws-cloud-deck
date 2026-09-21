// src/reveal/RevealDeck.jsx
import React, { useEffect, useRef } from "react";
import Reveal from "reveal.js";
import { revealConfig } from "./revealConfig";
import { getDeckPlugins } from "./plugins";

/**
 * Componente contenedor de reveal.js adaptado para React SPA.
 * Monta los sections hijos y orquesta eventos de navegación y sincronización de estado.
 */
export function RevealDeck({ children, onSlideChange }) {
  const deckRef = useRef(null);
  const revealInstance = useRef(null);

  useEffect(() => {
    let isMounted = true;

    async function initDeck() {
      if (!deckRef.current) return;

      const plugins = await getDeckPlugins();

      const deck = new Reveal(deckRef.current, {
        ...revealConfig,
        plugins,
      });

      try {
        await deck.initialize();

        if (!isMounted) {
          deck.destroy();
          return;
        }

        revealInstance.current = deck;

        // Forzar recalculación del layout para que width:"100%" tome el viewport real
        deck.sync();
        deck.layout();

        // Ocultar controles de navegación (flechas) en todas las páginas
        const controls = deckRef.current?.querySelector(".controls");
        if (controls) {
          controls.style.display = "none";
        }

        // Exponer la instancia para llamadas programáticas globales (ej. saltar desde Agenda)
        window.__revealDeck = deck;

        // Notificar slide inicial
        const initialIndices = deck.getIndices();
        if (onSlideChange) {
          onSlideChange(initialIndices.h);
        }

        // Listener de cambio de diapositiva
        deck.on("slidechanged", (event) => {
          if (onSlideChange) {
            onSlideChange(event.indexh);
          }
          // Disparar evento personalizado para hooks desacoplados
          window.dispatchEvent(
            new CustomEvent("deck:slidechanged", {
              detail: { indexh: event.indexh, indexv: event.indexv },
            })
          );
        });
      } catch (err) {
        console.error("Error al inicializar Reveal.js:", err);
      }
    }

    initDeck();

    return () => {
      isMounted = false;
      if (revealInstance.current) {
        try {
          revealInstance.current.destroy();
        } catch {
          // cleanup seguro
        }
        revealInstance.current = null;
        window.__revealDeck = null;
      }
    };
  }, [onSlideChange]);

  return (
    <div className="reveal" ref={deckRef}>
      <div className="slides">{children}</div>
    </div>
  );
}

export default RevealDeck;
