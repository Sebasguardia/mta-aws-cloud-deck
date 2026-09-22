// src/slides/S13_Roadmap.jsx
import React, { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import {
  Calendar,
  CheckCircle2,
  Clock,
  ArrowRight,
  Milestone,
  Layers,
  Sparkles,
  ChevronRight,
  TrendingUp,
} from "lucide-react";
import { slidesContent } from "../data/content.es.js";
import { useSlideActive } from "../hooks/useSlideActive.js";
import { RoadmapContinuityCanvas } from "../components/three/RoadmapContinuityCanvas.jsx";
import { CanvasTransitionWrapper } from "../components/motion/CanvasTransitionWrapper.jsx";
import { Badge } from "../components/ui/Badge.jsx";
import { easings } from "../lib/easings.js";

const c = slidesContent.s13_roadmap;

/**
 * S13 — Roadmap de Adopción Cloud y Próximos Pasos.
 *
 * Directivas de diseño:
 *  - /industrial-brutalist-ui:
 *    Estética de blueprint evolutivo y cronograma militar (#0A0A0A),
 *    rejilla técnica, bordes nítidos de 1px/2px, etiquetas monospace y
 *    distribución panorámica de pantalla completa 50%/50% sin scroll ni recortes.
 *  - /impeccable:
 *    Línea de tiempo horizontal escalonada con 3 etapas bien diferenciadas:
 *    - Etapa 01: Diagnóstico y Fundamentos (Completada ✅)
 *    - Etapa 02: Aprovisionamiento y Staging (Siguiente Hito ⚡)
 *    - Etapa 03: Automatización y Migración Final (Futuro 🌐)
 *  - /threejs-geometry + /threejs-animation + /threejs-interaction:
 *    `RoadmapContinuityCanvas`: 3 estaciones tridimensionales unidas por un riel temporal curvado
 *    donde viaja un pulso lumínico continuo, con elevación e iluminación interactiva al seleccionar cada etapa.
 *  - /emil-design-eng + /animate:
 *    Micro-interacciones táctiles en cada tarjeta de etapa para alternar la fase activa en el canvas 3D
 *    con feedback visual inmediato y badges de estado.
 */
export function S13_Roadmap({ isActive: propActive } = {}) {
  const shouldReduceMotion = useReducedMotion();
  const hookActive = useSlideActive(12);
  const sectionRef = useRef(null);
  const [domActive, setDomActive] = useState(false);

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
  const [selectedPhase, setSelectedPhase] = useState(1); // Por default seleccionada Etapa 02 (Siguiente hito)

  // Activar entrada escalonada al montarse el slide
  useEffect(() => {
    if (isActive) {
      const timer = setTimeout(() => setEntered(true), 40);
      return () => clearTimeout(timer);
    } else {
      setEntered(false);
    }
  }, [isActive]);

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

      {/* ── Resplandor ambiental de visión de futuro ── */}
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
          COLUMNA IZQUIERDA (50%): Línea de Tiempo & Fases del Curso
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
          gap: "1.1rem",
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
              SEC_13 // ADOPTION_TIMELINE
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

        {/* Las 3 Fases del Roadmap con interactividad */}
        <div style={{ display: "flex", flexDirection: "column", gap: "0.65rem" }}>
          {c.phases.map((ph, idx) => {
            const isSelected = selectedPhase === idx;
            const isCompleted = idx === 0;
            const isNext = idx === 1;

            return (
              <motion.div
                key={ph.phase}
                variants={fadeUp(0.22 + idx * 0.08)}
                initial="hidden"
                animate={entered ? "visible" : "hidden"}
                onClick={() => setSelectedPhase(idx)}
                whileHover={{ x: 3 }}
                transition={{ duration: 0.15, ease: easings.snappy }}
                style={{
                  padding: "0.9rem 1.15rem",
                  background: isSelected
                    ? isCompleted
                      ? "rgba(110,142,89,0.1)"
                      : isNext
                      ? "rgba(212,160,23,0.12)"
                      : "rgba(255,255,255,0.04)"
                    : "rgba(255,255,255,0.02)",
                  border: isSelected
                    ? isCompleted
                      ? "1.5px solid #6e8e59"
                      : isNext
                      ? "1.5px solid #d4a017"
                      : "1.5px solid rgba(245,241,232,0.4)"
                    : "1px solid rgba(245,241,232,0.12)",
                  borderLeft: isSelected
                    ? isCompleted
                      ? "4px solid #6e8e59"
                      : isNext
                      ? "4px solid #d4a017"
                      : "4px solid rgba(245,241,232,0.6)"
                    : "4px solid rgba(245,241,232,0.2)",
                  cursor: "pointer",
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.35rem",
                  boxShadow: isSelected ? "3px 3px 0px #000000" : "none",
                  transition: "all 0.2s ease",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
                    <span
                      style={{
                        fontFamily: "'JetBrains Mono', monospace",
                        fontSize: "0.65rem",
                        fontWeight: 800,
                        color: isCompleted ? "#6e8e59" : isNext ? "#d4a017" : "rgba(245,241,232,0.5)",
                      }}
                    >
                      {ph.phase} //
                    </span>
                    <h3
                      style={{
                        fontFamily: "'Archivo Black', sans-serif",
                        fontSize: "0.85rem",
                        color: "#F5F1E8",
                        textTransform: "uppercase",
                        margin: 0,
                        letterSpacing: "0.02em",
                      }}
                    >
                      {ph.title}
                    </h3>
                  </div>

                  <span
                    style={{
                      fontFamily: "'JetBrains Mono', monospace",
                      fontSize: "0.55rem",
                      fontWeight: 700,
                      padding: "0.2rem 0.5rem",
                      background: isCompleted ? "rgba(110,142,89,0.2)" : isNext ? "rgba(212,160,23,0.2)" : "rgba(255,255,255,0.06)",
                      color: isCompleted ? "#6e8e59" : isNext ? "#d4a017" : "rgba(245,241,232,0.5)",
                      border: isCompleted ? "1px solid #6e8e59" : isNext ? "1px solid #d4a017" : "1px solid rgba(245,241,232,0.2)",
                      textTransform: "uppercase",
                    }}
                  >
                    {ph.status}
                  </span>
                </div>

                <p
                  style={{
                    fontFamily: "system-ui, -apple-system, sans-serif",
                    fontSize: "0.75rem",
                    color: "rgba(245,241,232,0.7)",
                    lineHeight: 1.45,
                    margin: 0,
                  }}
                >
                  {ph.desc}
                </p>
              </motion.div>
            );
          })}
        </div>

        {/* Footer Editorial de Continuidad Académica */}
        <motion.div
          variants={fadeUp(0.44)}
          initial="hidden"
          animate={entered ? "visible" : "hidden"}
          style={{
            padding: "0.75rem 1rem",
            background: "rgba(0,0,0,0.6)",
            border: "1px solid rgba(245,241,232,0.12)",
            borderLeft: "3px solid #6e8e59",
            display: "flex",
            alignItems: "center",
            gap: "0.75rem",
          }}
        >
          <Milestone size={20} style={{ color: "#6e8e59", flexShrink: 0 }} />
          <p
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: "0.65rem",
              color: "rgba(245,241,232,0.75)",
              lineHeight: 1.45,
              margin: 0,
            }}
          >
            "La Etapa 01 establece los cimientos metodológicos y económicos; la Etapa 02 materializa la infraestructura en la consola AWS."
          </p>
        </motion.div>
      </div>

      {/* ══════════════════════════════════════════════════════════
          COLUMNA DERECHA (50%): Riel 3D de Estaciones Temporales
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
            top: "2.5rem",
            right: "3.5rem",
            left: "3rem",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            zIndex: 10,
            pointerEvents: "none",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
            <Calendar size={14} style={{ color: "#d4a017" }} />
            <span
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: "0.65rem",
                letterSpacing: "0.15em",
                color: "rgba(245,241,232,0.7)",
                textTransform: "uppercase",
              }}
            >
              AWS ROADMAP VECTOR // 3-PHASE CONTINUITY
            </span>
          </div>

          <div
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: "0.6rem",
              padding: "0.2rem 0.5rem",
              background: "rgba(212,160,23,0.15)",
              border: "1px solid #d4a017",
              color: "#d4a017",
            }}
          >
            FOCUS: {c.phases[selectedPhase].phase}
          </div>
        </div>

        {/* Canvas 3D Three.js (Desmontado condicional GPU) */}
        <div
          style={{
            width: "100%",
            height: "75%",
            position: "relative",
            zIndex: 5,
          }}
        >
          <CanvasTransitionWrapper isActive={isActive}>
            <RoadmapContinuityCanvas
              isActive={isActive}
              activePhase={selectedPhase}
            />
          </CanvasTransitionWrapper>
        </div>

        {/* HUD Inferior de los 3 Hitos Clave */}
        <div
          style={{
            position: "absolute",
            bottom: "2rem",
            left: "3rem",
            right: "3.5rem",
            zIndex: 10,
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "0.65rem",
          }}
        >
          <div
            onClick={() => setSelectedPhase(0)}
            style={{
              padding: "0.55rem 0.75rem",
              background: selectedPhase === 0 ? "rgba(110,142,89,0.2)" : "rgba(14,14,14,0.75)",
              border: selectedPhase === 0 ? "1.5px solid #6e8e59" : "1px solid rgba(245,241,232,0.15)",
              backdropFilter: "blur(6px)",
              cursor: "pointer",
              transition: "all 0.2s ease",
            }}
          >
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.52rem", color: "#6e8e59", fontWeight: 700 }}>
              ETAPA 01 // LISTA
            </div>
            <div style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: "0.72rem", color: "#F5F1E8", marginTop: "0.15rem" }}>
              DIAGNÓSTICO
            </div>
          </div>

          <div
            onClick={() => setSelectedPhase(1)}
            style={{
              padding: "0.55rem 0.75rem",
              background: selectedPhase === 1 ? "rgba(212,160,23,0.2)" : "rgba(14,14,14,0.75)",
              border: selectedPhase === 1 ? "1.5px solid #d4a017" : "1px solid rgba(245,241,232,0.15)",
              backdropFilter: "blur(6px)",
              cursor: "pointer",
              transition: "all 0.2s ease",
            }}
          >
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.52rem", color: "#d4a017", fontWeight: 700 }}>
              ETAPA 02 // HITO
            </div>
            <div style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: "0.72rem", color: "#F5F1E8", marginTop: "0.15rem" }}>
              STAGING & VPC
            </div>
          </div>

          <div
            onClick={() => setSelectedPhase(2)}
            style={{
              padding: "0.55rem 0.75rem",
              background: selectedPhase === 2 ? "rgba(255,255,255,0.1)" : "rgba(14,14,14,0.75)",
              border: selectedPhase === 2 ? "1.5px solid #FFFFFF" : "1px solid rgba(245,241,232,0.15)",
              backdropFilter: "blur(6px)",
              cursor: "pointer",
              transition: "all 0.2s ease",
            }}
          >
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.52rem", color: "rgba(245,241,232,0.5)", fontWeight: 700 }}>
              ETAPA 03 // FUTURO
            </div>
            <div style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: "0.72rem", color: "#F5F1E8", marginTop: "0.15rem" }}>
              CI/CD & MIGRACIÓN
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default S13_Roadmap;