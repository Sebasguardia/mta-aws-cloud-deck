// src/slides/S14_Cierre.jsx
import React, { useEffect, useState, useRef } from "react";
import { motion, useReducedMotion } from "framer-motion";
import {
  Sparkles,
  RotateCcw,
  Users,
  Award,
  ArrowRight,
  HelpCircle,
  ShieldCheck,
  CheckCircle2,
  PartyPopper,
} from "lucide-react";
import { slidesContent } from "../data/content.es.js";
import { projectMeta } from "../data/team.js";
import { useSlideActive } from "../hooks/useSlideActive.js";
import { ClosingGratitudeCanvas } from "../components/three/ClosingGratitudeCanvas.jsx";
import { ClosingEvaluation } from "../components/dynamics/ClosingEvaluation.jsx";
import { Button } from "../components/ui/Button.jsx";
import { Badge } from "../components/ui/Badge.jsx";
import { easings } from "../lib/easings.js";

const c = slidesContent.s14_cierre;

/**
 * S14 — Cierre del Deck, Síntesis de Logros, Preguntas del Jurado y Conclusión.
 *
 * Directivas de diseño:
 *  - /industrial-brutalist-ui:
 *    Estética conmemorativa y editorial técnica (#0A0A0A),
 *    rejilla técnica, bordes nítidos de 1px/2px, etiquetas monospace y
 *    distribución panorámica de pantalla completa 50%/50% sin barras de scroll.
 *  - /impeccable:
 *    Mismo peso visual y sobriedad que la portada (Slide 01):
 *    - Créditos institucionales SENATI + AWS Practitioner Essentials.
 *    - Líder de desarrollo y mención a los 10 practicantes de ingeniería.
 *    - Call-to-action con botón interactivo táctil "Volver al Inicio" (navega al Slide 00/01).
 *  - Componentes de @dynamics:
 *    `ClosingEvaluation` interactivo (Puntos Clave TCO/ZeroTrust, 10 Practicantes, y FAQ para el Jurado).
 *  - /threejs-geometry + /threejs-animation + /threejs-interaction:
 *    `ClosingGratitudeCanvas`: Ecosistema 3D global en armonía con los 10 nodos orbitales
 *    danzando alrededor de la geodésica AWS y nube de partículas doradas con modo celebración "Warp Celebration".
 *  - /emil-design-eng + /animate:
 *    Interacciones fluidas con micro-animaciones en botones y badges.
 */
export function S14_Cierre({ isActive: propActive } = {}) {
  const shouldReduceMotion = useReducedMotion();
  const hookActive = useSlideActive(13);
  const sectionRef = useRef(null);
  const [domActive, setDomActive] = useState(false);
  const [celebrateCount, setCelebrateCount] = useState(0);

  // Observador de mutación para Reveal.js .present
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

  // Activar entrada escalonada al montarse el slide
  useEffect(() => {
    if (isActive) {
      const timer = setTimeout(() => setEntered(true), 40);
      return () => clearTimeout(timer);
    } else {
      setEntered(false);
    }
  }, [isActive]);

  // Manejador para volver al inicio del deck
  const handleReturnToStart = () => {
    if (window.Reveal) {
      window.Reveal.slide(0);
    } else {
      window.location.hash = "#/0";
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
      transition: { duration: shouldReduceMotion ? 0.1 : 0.45, ease: [0.16, 1, 0.3, 1], delay },
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

      {/* ── Resplandor ambiental de culminación ── */}
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
          COLUMNA IZQUIERDA (50%): Gratitud, Dynamics & Acciones
      ══════════════════════════════════════════════════════════ */}
      <div
        style={{
          flex: "0 0 50%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "2.2rem 2.8rem 2.2rem 4.5rem",
          position: "relative",
          zIndex: 2,
          gap: "0.85rem",
          overflowY: "auto",
        }}
      >
        {/* Header Editorial */}
        <div style={{ display: "flex", flexDirection: "column", gap: "0.15rem" }}>
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
                padding: "0.2rem 0.6rem",
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
              SEC_14 // PRESENTATION_CLOSING
            </span>
          </motion.div>

          <motion.p
            variants={fadeUp(0.08)}
            initial="hidden"
            animate={entered ? "visible" : "hidden"}
            style={{
              fontFamily: "Yellowtail, cursive",
              fontSize: "clamp(1.2rem, 1.8vw, 1.6rem)",
              color: "#e8a0bf",
              lineHeight: 1.1,
              margin: "0.1rem 0 0 0",
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
              fontSize: "clamp(0.8rem, 0.95vw, 0.88rem)",
              color: "rgba(245,241,232,0.65)",
              margin: "0.1rem 0 0 0",
              lineHeight: 1.35,
            }}
          >
            {c.subtitle}
          </motion.p>
        </div>

        {/* Componente dinámico interactivo @dynamics/ClosingEvaluation */}
        <motion.div
          variants={fadeUp(0.2)}
          initial="hidden"
          animate={entered ? "visible" : "hidden"}
        >
          <ClosingEvaluation onCelebrate={handleCelebrate} />
        </motion.div>

        {/* Ficha Institucional Compacta SENATI */}
        <motion.div
          variants={fadeUp(0.24)}
          initial="hidden"
          animate={entered ? "visible" : "hidden"}
          style={{
            padding: "0.65rem 0.85rem",
            background: "rgba(14,14,14,0.85)",
            border: "1px solid rgba(245,241,232,0.12)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <Award size={15} style={{ color: "#d4a017" }} />
            <div>
              <div style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: "0.72rem", color: "#F5F1E8" }}>
                {projectMeta.teamLead.name}
              </div>
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.55rem", color: "rgba(245,241,232,0.5)" }}>
                {projectMeta.teamLead.role} · {projectMeta.institution}
              </div>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
            <span
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: "0.58rem",
                color: "#6e8e59",
                background: "rgba(110,142,89,0.15)",
                border: "1px solid #6e8e59",
                padding: "0.2rem 0.45rem",
                fontWeight: 700,
              }}
            >
              10 PRACTICANTES REMOTOS
            </span>
          </div>
        </motion.div>

        {/* Botonera de Cierre y Navegación */}
        <motion.div
          variants={fadeUp(0.28)}
          initial="hidden"
          animate={entered ? "visible" : "hidden"}
          style={{
            display: "flex",
            gap: "0.65rem",
            alignItems: "center",
          }}
        >
          <Button
            variant="primary"
            size="md"
            icon={RotateCcw}
            onClick={handleReturnToStart}
            className="flex-1 justify-center"
          >
            VOLVER AL INICIO (PORTADA)
          </Button>

          <Button
            variant="secondary"
            size="md"
            icon={PartyPopper}
            onClick={handleCelebrate}
            className="justify-center"
            title="Lanzar aceleración cósmica de partículas"
          >
            CELEBRAR
          </Button>
        </motion.div>
      </div>

      {/* ══════════════════════════════════════════════════════════
          COLUMNA DERECHA (50%): Visualizador 3D Ecosistema Global
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
            top: "2.2rem",
            right: "3rem",
            left: "2.8rem",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            zIndex: 10,
            pointerEvents: "none",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
            <ShieldCheck size={14} style={{ color: "#d4a017" }} />
            <span
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: "0.65rem",
                letterSpacing: "0.15em",
                color: "rgba(245,241,232,0.7)",
                textTransform: "uppercase",
              }}
            >
              MTA SOFTWARE // AWS CLOUD COMPLETE
            </span>
          </div>

          <div
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: "0.6rem",
              padding: "0.2rem 0.5rem",
              background: "rgba(110,142,89,0.2)",
              border: "1px solid #6e8e59",
              color: "#6e8e59",
              fontWeight: 700,
            }}
          >
            STATUS: READY_FOR_STAGE_02
          </div>
        </div>

        {/* Canvas 3D Three.js */}
        <div
          style={{
            width: "100%",
            height: "78%",
            position: "relative",
            zIndex: 5,
          }}
        >
          <ClosingGratitudeCanvas
            isActive={isActive}
            celebrateTrigger={celebrateCount}
          />
        </div>

        {/* HUD Inferior de Certificación & Estado */}
        <div
          style={{
            position: "absolute",
            bottom: "1.8rem",
            left: "2.8rem",
            right: "3rem",
            zIndex: 10,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "0.6rem 0.95rem",
            background: "rgba(14,14,14,0.75)",
            border: "1px solid rgba(245,241,232,0.15)",
            backdropFilter: "blur(6px)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
            <CheckCircle2 size={13} style={{ color: "#6e8e59" }} />
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.62rem", color: "#F5F1E8", fontWeight: 700 }}>
              14 SLIDES COMPLETADOS // DECK OPERATIVO AL 100%
            </span>
          </div>

          <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.58rem", color: "#d4a017", fontWeight: 700 }}>
            SENATI 2026 // AWS CLOUD ESSENTIALS
          </span>
        </div>
      </div>
    </section>
  );
}

export default S14_Cierre;