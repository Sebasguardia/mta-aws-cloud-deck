// src/slides/S17_Cierre.jsx
import { useEffect, useState, useRef } from "react";
import { motion, useReducedMotion } from "framer-motion";
import {
  Sparkles,
  RotateCcw,
  Users,
  Award,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  PartyPopper,
} from "lucide-react";
import { slidesContent } from "../data/content.es.js";
import { projectMeta } from "../data/team.js";
import { useSlideActive } from "../hooks/useSlideActive.js";
import { ClosingGratitudeCanvas } from "../components/three/ClosingGratitudeCanvas.jsx";
import { CanvasTransitionWrapper } from "../components/motion/CanvasTransitionWrapper.jsx";
import { ClosingEvaluation } from "../components/dynamics/ClosingEvaluation.jsx";
import { Button } from "../components/ui/Button.jsx";

const c = slidesContent.s17_cierre;

/**
 * S17 — Cierre del Deck, Síntesis de Logros (Etapas 1 y 2), Preguntas y Conclusión.
 */
export function S17_Cierre({ isActive: propActive } = {}) {
  const shouldReduceMotion = useReducedMotion();
  const hookActive = useSlideActive(16);
  const sectionRef = useRef(null);
  const [domActive, setDomActive] = useState(false);
  const [celebrateCount, setCelebrateCount] = useState(0);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const checkPresent = () => setDomActive(el.classList.contains("present"));
    checkPresent();
    const observer = new MutationObserver(checkPresent);
    observer.observe(el, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, []);

  const isActive = propActive !== undefined ? (propActive || domActive) : (hookActive || domActive);
  const [entered, setEntered] = useState(false);

  useEffect(() => {
    if (!isActive) return;
    const timer = setTimeout(() => setEntered(true), 40);
    return () => {
      clearTimeout(timer);
      setEntered(false);
    };
  }, [isActive]);

  const handleReturnToStart = () => {
    if (window.__revealDeck) {
      window.__revealDeck.slide(0);
    }
  };

  const handleCelebrate = () => {
    setCelebrateCount((prev) => prev + 1);
  };

  const fadeUp = (delay = 0) => ({
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 16 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: shouldReduceMotion ? 0.1 : 0.5, ease: [0.16, 1, 0.3, 1], delay },
    },
  });

  return (
    <section
      ref={sectionRef}
      className="slide-fullscreen"
      style={{
        width: "100%",
        height: "100%",
        position: "relative",
        background: "#0A0A0A",
        overflow: "hidden",
        display: "flex",
        flexDirection: "row",
      }}
    >
      {/* ── Retícula de fondo sutil ── */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "linear-gradient(rgba(245,241,232,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(245,241,232,0.025) 1px, transparent 1px)",
          backgroundSize: "64px 64px",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />

      {/* ── Scanlines analógicas tenues ── */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          background:
            "repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,0,0,0.07) 3px, rgba(0,0,0,0.07) 6px)",
          pointerEvents: "none",
          zIndex: 1,
        }}
      />

      {/* ── Resplandor perimetral dorado ── */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          background: "radial-gradient(circle at 75% 50%, rgba(212,160,23,0.18) 0%, transparent 65%)",
          pointerEvents: "none",
          zIndex: 1,
        }}
      />

      {/* ── Barra de acento vertical izquierda Oro AWS ── */}
      <motion.div
        aria-hidden="true"
        initial={{ transform: "scaleY(0)", transformOrigin: "top" }}
        animate={entered ? { transform: "scaleY(1)" } : { transform: "scaleY(0)" }}
        transition={{ duration: shouldReduceMotion ? 0.1 : 0.65, ease: [0.83, 0, 0.17, 1], delay: 0.05 }}
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          bottom: 0,
          width: 4,
          background: "#d4a017",
          zIndex: 3,
        }}
      />

      {/* ══════════════════════════════════════════════════════════
          COLUMNA IZQUIERDA (50%): Despedida, Evaluación y Créditos
      ══════════════════════════════════════════════════════════ */}
      <div
        style={{
          flex: "0 0 50%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "2.5rem 3rem 2.5rem 4.8rem",
          position: "relative",
          zIndex: 2,
          gap: "0.85rem",
        }}
      >
        {/* Header Editorial */}
        <div style={{ display: "flex", flexDirection: "column", gap: "0.2rem" }}>
          <motion.div
            variants={fadeUp(0.04)}
            initial="hidden"
            animate={entered ? "visible" : "hidden"}
            style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}
          >
            <span
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: "0.65rem",
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                fontWeight: 700,
                color: "#d4a017",
                background: "rgba(212,160,23,0.12)",
                border: "1px solid rgba(212,160,23,0.4)",
                padding: "0.25rem 0.65rem",
              }}
            >
              [ {c.badge} ]
            </span>
            <span
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: "0.62rem",
                letterSpacing: "0.15em",
                color: "rgba(245,241,232,0.45)",
              }}
            >
              SEC_17 // PROYECTO_FINALIZADO
            </span>
          </motion.div>

          <motion.p
            variants={fadeUp(0.08)}
            initial="hidden"
            animate={entered ? "visible" : "hidden"}
            style={{
              fontFamily: "Yellowtail, cursive",
              fontSize: "clamp(1.3rem, 2vw, 1.8rem)",
              color: "#e8a0bf",
              lineHeight: 1.1,
              margin: "0.15rem 0 0 0",
            }}
          >
            {c.scriptTag}
          </motion.p>

          <motion.h1
            variants={fadeUp(0.12)}
            initial="hidden"
            animate={entered ? "visible" : "hidden"}
            style={{
              fontFamily: "'Archivo Black', 'Arial Black', sans-serif",
              fontSize: "clamp(1.7rem, 2.5vw, 2.4rem)",
              color: "#F5F1E8",
              letterSpacing: "-0.025em",
              lineHeight: 1.05,
              textTransform: "uppercase",
              margin: 0,
            }}
          >
            {c.title}
          </motion.h1>

          <motion.p
            variants={fadeUp(0.16)}
            initial="hidden"
            animate={entered ? "visible" : "hidden"}
            style={{
              fontFamily: "system-ui, -apple-system, sans-serif",
              fontSize: "clamp(0.85rem, 1.05vw, 0.95rem)",
              color: "rgba(245,241,232,0.65)",
              margin: "0.2rem 0 0 0",
              lineHeight: 1.4,
            }}
          >
            {c.subtitle}
          </motion.p>
        </div>

        {/* Componente dinámico de evaluación del jurado y logros */}
        <motion.div
          variants={fadeUp(0.20)}
          initial="hidden"
          animate={entered ? "visible" : "hidden"}
        >
          <ClosingEvaluation active={isActive} />
        </motion.div>

        {/* Botones de acción y celebración */}
        <motion.div
          variants={fadeUp(0.28)}
          initial="hidden"
          animate={entered ? "visible" : "hidden"}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.8rem",
            marginTop: "0.2rem",
          }}
        >
          <Button
            variant="primary"
            size="md"
            icon={RotateCcw}
            onClick={handleReturnToStart}
          >
            Volver al Inicio
          </Button>

          <Button
            variant="dark"
            size="md"
            icon={PartyPopper}
            onClick={handleCelebrate}
          >
            {celebrateCount > 0 ? `Celebrado × ${celebrateCount} 🎉` : "Celebrar Cierre 🎉"}
          </Button>
        </motion.div>
      </div>

      {/* ══════════════════════════════════════════════════════════
          COLUMNA DERECHA (50%): Canvas 3D Conmemorativo
      ══════════════════════════════════════════════════════════ */}
      <div
        style={{
          flex: "0 0 50%",
          position: "relative",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          overflow: "hidden",
          borderLeft: "1px solid rgba(245,241,232,0.1)",
          background: "radial-gradient(ellipse at center, #141414 0%, #0a0a0a 85%)",
        }}
      >
        {/* Cabecera Técnica Flotante */}
        <div
          style={{
            position: "absolute",
            top: "2rem",
            left: "2.5rem",
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            zIndex: 10,
            pointerEvents: "none",
          }}
        >
          <Sparkles size={13} style={{ color: "#d4a017" }} />
          <span
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: "0.62rem",
              letterSpacing: "0.15em",
              color: "rgba(245,241,232,0.6)",
              textTransform: "uppercase",
              fontWeight: 700,
            }}
          >
            AWS CLOUD FOUNDATIONS // ETAPAS 01 & 02
          </span>
        </div>

        {/* Canvas 3D */}
        <CanvasTransitionWrapper
          isActive={isActive}
          aspectRatio="1/1"
          style={{ width: "100%", height: "100%", maxHeight: "680px" }}
        >
          <ClosingGratitudeCanvas isActive={isActive} isWarpMode={celebrateCount > 0} />
        </CanvasTransitionWrapper>
      </div>
    </section>
  );
}

export default S17_Cierre;
