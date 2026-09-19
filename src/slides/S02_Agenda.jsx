// src/slides/S02_Agenda.jsx
import React, { useEffect, useState, useCallback } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { slidesContent } from "../data/content.es.js";
import { useSlideActive } from "../hooks/useSlideActive.js";

const c = slidesContent.s02_agenda;

const ACCENT_MAP = {
  "var(--olive)": { border: "#4a5d3a", glow: "rgba(74,93,58,0.3)"  },
  "var(--risk)":  { border: "#c6432b", glow: "rgba(198,67,43,0.3)" },
  "var(--gold)":  { border: "#d4a017", glow: "rgba(212,160,23,0.3)" },
};

/**
 * S02 — Agenda / Roadmap del deck.
 *
 * index Reveal: 1 (segundo slide, después de S01_Cover).
 *
 * Usa useSlideActive(1) en lugar del prop isActive — más robusto porque
 * escucha el evento `deck:slidechanged` directamente sin depender de
 * prop-drilling desde App.jsx.
 *
 * Animación: stagger 120ms | translateY(28px→0) + opacity | ease cinematic.
 * Interactividad: click en tarjeta → deck.slide(targetSlide).
 */
export function S02_Agenda({ isActive: propActive } = {}) {
  const shouldReduceMotion = useReducedMotion();
  const hookActive = useSlideActive(1);
  const sectionRef = React.useRef(null);
  const [domActive, setDomActive] = useState(false);

  // Observador de mutación para detectar cuando reveal agrega la clase 'present'
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const checkPresent = () => {
      setDomActive(el.classList.contains("present"));
    };
    checkPresent();
    const observer = new MutationObserver(checkPresent);
    observer.observe(el, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, []);

  const isActive = propActive !== undefined ? (propActive || domActive) : (hookActive || domActive);
  const [entered, setEntered] = useState(false);
  const [hoveredIdx, setHoveredIdx] = useState(null);
  const [zoomingCardIdx, setZoomingCardIdx] = useState(null);

  useEffect(() => {
    if (isActive) {
      // Breve timeout para disparar la animación de entrada sincronizada
      const timer = setTimeout(() => setEntered(true), 40);
      return () => clearTimeout(timer);
    } else {
      setEntered(false);
      setZoomingCardIdx(null);
    }
  }, [isActive]);

  const jumpToSlide = useCallback((targetSlide, cardIndex) => {
    setZoomingCardIdx(cardIndex);
    // Efecto de portal / zoom cinemático hacia la tarjeta antes de ejecutar el slide
    setTimeout(() => {
      if (window.__revealDeck) {
        window.__revealDeck.slide(targetSlide);
      }
    }, 280);
  }, []);

  const cardVariant = (i) => ({
    hidden: { opacity: 0, transform: shouldReduceMotion ? "none" : "translateY(28px)" },
    visible: {
      opacity: 1,
      transform: "translateY(0px)",
      transition: { duration: shouldReduceMotion ? 0.1 : 0.52, ease: [0.22, 1, 0.36, 1], delay: 0.06 + i * 0.12 },
    },
  });

  const fadeUp = (delay = 0) => ({
    hidden: { opacity: 0, transform: shouldReduceMotion ? "none" : "translateY(10px)" },
    visible: {
      opacity: 1,
      transform: "translateY(0px)",
      transition: { duration: shouldReduceMotion ? 0.1 : 0.42, ease: [0.22, 1, 0.36, 1], delay },
    },
  });

  return (
    <section
      ref={sectionRef}
      data-transition="zoom"
      className="slide-col"
      style={{
        width: "100%",
        height: "100%",
        background: "#0a0a0a",
        position: "relative",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
      }}
    >
      {/* Blueprint grid */}
      <div aria-hidden="true" style={{
        position: "absolute", inset: 0, pointerEvents: "none",
        backgroundImage:
          "linear-gradient(rgba(245,241,232,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(245,241,232,0.04) 1px, transparent 1px)",
        backgroundSize: "48px 48px",
      }} />

      {/* CRT scanlines */}
      <div aria-hidden="true" style={{
        position: "absolute", inset: 0, pointerEvents: "none", zIndex: 1,
        background: "repeating-linear-gradient(0deg,transparent,transparent 3px,rgba(0,0,0,0.07) 3px,rgba(0,0,0,0.07) 6px)",
      }} />

      {/* Barra dorada izquierda */}
      <motion.div
        aria-hidden="true"
        initial={{ transform: "scaleY(0)", transformOrigin: "top center" }}
        animate={entered ? { transform: "scaleY(1)" } : { transform: "scaleY(0)" }}
        transition={{ duration: shouldReduceMotion ? 0.1 : 0.6, ease: [0.83, 0, 0.17, 1], delay: 0.04 }}
        style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 4, background: "#D4A017", zIndex: 2 }}
      />

      {/* Contenido */}
      <div style={{
        position: "relative", zIndex: 2,
        width: "100%", maxWidth: "1440px",
        margin: "0 auto",
        padding: "2.5rem 4rem 2.5rem 5rem",
        display: "flex", flexDirection: "column", gap: "1.4rem",
      }}>

        {/* ── Encabezado ── */}
        <div style={{ display: "flex", flexDirection: "column", gap: "0.35rem" }}>
          <motion.span
            variants={fadeUp(0.05)}
            initial="hidden"
            animate={entered ? "visible" : "hidden"}
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: "0.65rem",
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              fontWeight: 700,
              color: "#D4A017",
              background: "rgba(212,160,23,0.08)",
              border: "1px solid rgba(212,160,23,0.35)",
              padding: "0.28rem 0.7rem",
              display: "inline-block",
              width: "fit-content",
            }}
          >
            [ {c.badge} ]
          </motion.span>

          <motion.p
            variants={fadeUp(0.12)}
            initial="hidden"
            animate={entered ? "visible" : "hidden"}
            style={{
              fontFamily: "Yellowtail, cursive",
              fontSize: "clamp(1.2rem, 2vw, 1.9rem)",
              color: "#e8a0bf",
              lineHeight: 1.1,
            }}
          >
            {c.scriptTag}
          </motion.p>

          <motion.h1
            variants={fadeUp(0.18)}
            initial="hidden"
            animate={entered ? "visible" : "hidden"}
            style={{
              fontFamily: "'Archivo Black', 'Arial Black', sans-serif",
              fontSize: "clamp(1.8rem, 3vw, 3rem)",
              color: "#F5F1E8",
              letterSpacing: "-0.025em",
              textTransform: "uppercase",
              lineHeight: 1,
              fontWeight: 400,
              maxWidth: "640px",
            }}
          >
            {c.title}
          </motion.h1>

          <motion.p
            variants={fadeUp(0.24)}
            initial="hidden"
            animate={entered ? "visible" : "hidden"}
            style={{
              fontFamily: "Inter, sans-serif",
              fontSize: "0.83rem",
              color: "rgba(245,241,232,0.5)",
              maxWidth: "520px",
              lineHeight: 1.5,
            }}
          >
            {c.subtitle}
          </motion.p>
        </div>

        {/* Divider wipe dorado */}
        <motion.div
          aria-hidden="true"
          initial={{ clipPath: "inset(0 100% 0 0)" }}
          animate={entered ? { clipPath: "inset(0 0% 0 0)" } : { clipPath: "inset(0 100% 0 0)" }}
          transition={{ duration: shouldReduceMotion ? 0.1 : 0.5, ease: [0.83, 0, 0.17, 1], delay: 0.28 }}
          style={{ height: 2, background: "#D4A017", width: "100%", maxWidth: 280 }}
        />

        {/* ── Tarjetas de bloque — Grid 3 columnas ── */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: "1px",
          background: "rgba(245,241,232,0.08)",
        }}>
          {c.blocks.map((block, i) => {
            const acc = ACCENT_MAP[block.accent] ?? ACCENT_MAP["var(--gold)"];
            const isHovered = hoveredIdx === i;
            const isZooming = zoomingCardIdx === i;
            const anyZooming = zoomingCardIdx !== null;

            return (
              <motion.button
                key={block.num}
                variants={cardVariant(i)}
                initial="hidden"
                animate={entered ? "visible" : "hidden"}
                onClick={() => jumpToSlide(block.targetSlide, i)}
                onMouseEnter={() => setHoveredIdx(i)}
                onMouseLeave={() => setHoveredIdx(null)}
                aria-label={`Ir a bloque ${block.num}: ${block.title}`}
                style={{
                  background: isHovered ? "rgba(245,241,232,0.06)" : "#0a0a0a",
                  border: "none",
                  padding: "1.5rem 1.75rem",
                  cursor: "pointer",
                  textAlign: "left",
                  position: "relative",
                  overflow: "hidden",
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.55rem",
                  borderTop: `3px solid ${isHovered || isZooming ? acc.border : "rgba(245,241,232,0.1)"}`,
                  boxShadow: isZooming ? `0 0 35px ${acc.glow}` : "none",
                  transform: isZooming
                    ? "scale(1.12) translateZ(30px)"
                    : anyZooming
                    ? "scale(0.92) opacity(0.2)"
                    : "scale(1)",
                  zIndex: isZooming ? 20 : 1,
                  opacity: anyZooming && !isZooming ? 0.3 : 1,
                  transition: "all 0.28s cubic-bezier(0.22, 1, 0.36, 1)",
                }}
              >
                {/* Número gigante outline watermark */}
                <span aria-hidden="true" style={{
                  position: "absolute",
                  right: "-0.5rem",
                  bottom: "-1rem",
                  fontFamily: "'Archivo Black', 'Arial Black', sans-serif",
                  fontSize: "clamp(5rem, 10vw, 9.5rem)",
                  color: "transparent",
                  WebkitTextStroke: `2px ${isHovered ? acc.border : "rgba(245,241,232,0.07)"}`,
                  letterSpacing: "-0.05em",
                  lineHeight: 1,
                  userSelect: "none",
                  pointerEvents: "none",
                  fontWeight: 400,
                  transition: "-webkit-text-stroke-color 0.22s cubic-bezier(0.23,1,0.32,1)",
                }}>
                  {block.num}
                </span>

                {/* Indicador de bloque */}
                <span style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: "0.62rem",
                  letterSpacing: "0.18em",
                  textTransform: "uppercase",
                  fontWeight: 700,
                  color: isHovered ? acc.border : "rgba(212,160,23,0.55)",
                  display: "flex", alignItems: "center", gap: "0.4rem",
                  transition: "color 0.18s ease-out",
                }}>
                  <span style={{
                    display: "inline-block", width: 5, height: 5,
                    background: isHovered ? acc.border : "rgba(212,160,23,0.4)",
                    transition: "background 0.18s ease-out",
                  }} />
                  BLOQUE {block.num}
                </span>

                {/* Script acento */}
                <p style={{
                  fontFamily: "Yellowtail, cursive",
                  fontSize: "clamp(1rem, 1.5vw, 1.45rem)",
                  color: isHovered ? acc.border : "rgba(245,241,232,0.5)",
                  lineHeight: 1.1,
                  transition: "color 0.2s ease-out",
                }}>
                  {block.script}
                </p>

                {/* Título del bloque */}
                <p style={{
                  fontFamily: "'Archivo Black', 'Arial Black', sans-serif",
                  fontSize: "clamp(1.1rem, 1.7vw, 1.6rem)",
                  color: "#F5F1E8",
                  letterSpacing: "-0.02em",
                  textTransform: "uppercase",
                  lineHeight: 1.05,
                  fontWeight: 400,
                  maxWidth: "280px",
                }}>
                  {block.title}
                </p>

                {/* Divider */}
                <div aria-hidden="true" style={{
                  height: 1,
                  background: isHovered ? acc.border : "rgba(245,241,232,0.1)",
                  transition: "background 0.2s ease-out",
                }} />

                {/* Descripción */}
                <p style={{
                  fontFamily: "Inter, sans-serif",
                  fontSize: "0.76rem",
                  color: "rgba(245,241,232,0.52)",
                  lineHeight: 1.55,
                  maxWidth: "340px",
                }}>
                  {block.description}
                </p>

                {/* CTA flecha */}
                <div style={{ marginTop: "0.4rem", display: "flex", alignItems: "center", gap: "0.35rem" }}>
                  <span style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: "0.6rem",
                    letterSpacing: "0.14em",
                    textTransform: "uppercase",
                    color: isHovered ? acc.border : "rgba(245,241,232,0.28)",
                    transition: "color 0.18s ease-out",
                  }}>
                    VER BLOQUE
                  </span>
                  <span
                    aria-hidden="true"
                    style={{
                      display: "inline-block",
                      clipPath: isHovered ? "inset(0 0% 0 0)" : "inset(0 100% 0 0)",
                      transition: "clip-path 0.22s cubic-bezier(0.23,1,0.32,1)",
                      color: acc.border,
                      fontFamily: "'JetBrains Mono', monospace",
                      fontSize: "0.7rem",
                    }}
                  >
                    {" "}›››
                  </span>
                </div>
              </motion.button>
            );
          })}
        </div>

        {/* Footer meta */}
        <motion.div
          variants={fadeUp(0.55)}
          initial="hidden"
          animate={entered ? "visible" : "hidden"}
          style={{
            display: "flex", alignItems: "center", gap: "1.5rem",
            paddingTop: "0.5rem",
            borderTop: "1px solid rgba(245,241,232,0.07)",
          }}
        >
          <span style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: "0.6rem", letterSpacing: "0.16em",
            textTransform: "uppercase", color: "rgba(245,241,232,0.22)",
          }}>
            CLICK EN CADA BLOQUE PARA NAVEGAR DIRECTAMENTE
          </span>
          <span style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: "0.6rem", letterSpacing: "0.14em",
            textTransform: "uppercase", color: "rgba(212,160,23,0.38)",
          }}>
            // SLIDE 02 · AGENDA
          </span>
        </motion.div>
      </div>

      {/* Crosshairs */}
      {["top-left","top-right","bottom-left","bottom-right"].map((p) => (
        <span key={p} aria-hidden="true" style={{
          position: "absolute",
          top: p.includes("top") ? 12 : "auto",
          bottom: p.includes("bottom") ? 12 : "auto",
          left: p.includes("left") ? 14 : "auto",
          right: p.includes("right") ? 14 : "auto",
          color: "rgba(212,160,23,0.2)",
          fontSize: "0.75rem", fontFamily: "monospace",
          userSelect: "none", zIndex: 3,
        }}>＋</span>
      ))}
    </section>
  );
}

export default S02_Agenda;
