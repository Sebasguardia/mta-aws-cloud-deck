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

        {/* Las 2 Fases del Roadmap con interactividad y entregables de SENATI */}
        <div style={{ display: "flex", flexDirection: "column", gap: "0.85rem" }}>
          {c.phases.map((ph, idx) => {
            const isSelected = selectedPhase === idx;
            const isCompleted = idx === 0;

            return (
              <motion.div
                key={ph.phase}
                variants={fadeUp(0.22 + idx * 0.1)}
                initial="hidden"
                animate={entered ? "visible" : "hidden"}
                onClick={() => setSelectedPhase(idx)}
                whileHover={{ x: 4 }}
                transition={{ duration: 0.15, ease: easings.snappy }}
                style={{
                  padding: "1rem 1.25rem",
                  background: isSelected
                    ? isCompleted
                      ? "rgba(110,142,89,0.12)"
                      : "rgba(212,160,23,0.14)"
                    : "rgba(255,255,255,0.02)",
                  border: isSelected
                    ? isCompleted
                      ? "1.5px solid #6e8e59"
                      : "1.5px solid #d4a017"
                    : "1px solid rgba(245,241,232,0.12)",
                  borderLeft: isSelected
                    ? isCompleted
                      ? "5px solid #6e8e59"
                      : "5px solid #d4a017"
                    : "5px solid rgba(245,241,232,0.2)",
                  cursor: "pointer",
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.45rem",
                  boxShadow: isSelected ? "4px 4px 0px #000000" : "none",
                  transition: "all 0.2s ease",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
                    <span
                      style={{
                        fontFamily: "'JetBrains Mono', monospace",
                        fontSize: "0.68rem",
                        fontWeight: 800,
                        color: isCompleted ? "#6e8e59" : "#d4a017",
                      }}
                    >
                      {ph.phase} // {ph.period}
                    </span>
                    <h3
                      style={{
                        fontFamily: "'Archivo Black', sans-serif",
                        fontSize: "0.9rem",
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
                      padding: "0.2rem 0.55rem",
                      background: isCompleted ? "rgba(110,142,89,0.2)" : "rgba(212,160,23,0.2)",
                      color: isCompleted ? "#6e8e59" : "#d4a017",
                      border: isCompleted ? "1px solid #6e8e59" : "1px solid #d4a017",
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
                    color: "rgba(245,241,232,0.75)",
                    lineHeight: 1.45,
                    margin: 0,
                  }}
                >
                  {ph.desc}
                </p>

                {/* Checklist de Entregables Principales */}
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "0.3rem",
                    marginTop: "0.25rem",
                    paddingTop: "0.4rem",
                    borderTop: "1px dashed rgba(245,241,232,0.12)",
                  }}
                >
                  {ph.deliverables?.map((item, dIdx) => (
                    <div
                      key={dIdx}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.35rem",
                        fontFamily: "'JetBrains Mono', monospace",
                        fontSize: "0.58rem",
                        color: isSelected ? "#F5F1E8" : "rgba(245,241,232,0.6)",
                      }}
                    >
                      <span style={{ color: isCompleted ? "#6e8e59" : "#d4a017", fontWeight: 800 }}>
                        {isCompleted ? "✔" : "▸"}
                      </span>
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
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
            "La Etapa 01 consolida el diagnóstico y arquitectura conceptual; la Etapa 02 materializa el cómputo EC2, almacenamiento S3 y base de datos administrada RDS."
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
            top: "2rem",
            left: "2.5rem",
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            zIndex: 10,
            pointerEvents: "none",
          }}
        >
          <Calendar size={13} style={{ color: "#d4a017" }} />
          <span
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: "0.62rem",
              letterSpacing: "0.15em",
              color: "rgba(245,241,232,0.7)",
              textTransform: "uppercase",
              fontWeight: 700,
            }}
          >
            AWS ROADMAP SENATI // 2-PHASE VECTOR
          </span>
        </div>

        {/* ── CUADRO FLOTANTE ARRIBA A LA DERECHA: EXPLICACIÓN DE LA ETAPA SELECCIONADA ── */}
        <div
          style={{
            position: "absolute",
            top: "1.8rem",
            right: "2.5rem",
            zIndex: 20,
            maxWidth: 320,
          }}
        >
          <AnimatePresence mode="wait">
            {selectedPhase === 0 ? (
              <motion.div
                key="stage-0-card"
                initial={{ opacity: 0, y: -8, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -6, scale: 0.96 }}
                transition={{ duration: 0.18 }}
                style={{
                  padding: "0.75rem 0.95rem",
                  background: "rgba(12,20,12,0.94)",
                  border: "1.5px solid #6e8e59",
                  boxShadow: "4px 4px 0px #6e8e59",
                  backdropFilter: "blur(8px)",
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.35rem",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                    <CheckCircle2 size={14} style={{ color: "#6e8e59" }} />
                    <span style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: "0.72rem", color: "#F5F1E8", textTransform: "uppercase" }}>
                      ETAPA 01 // SEMANA 6
                    </span>
                  </div>
                  <span
                    style={{
                      fontFamily: "'JetBrains Mono', monospace",
                      fontSize: "0.52rem",
                      color: "#6e8e59",
                      background: "rgba(110,142,89,0.2)",
                      border: "1px solid #6e8e59",
                      padding: "0.15rem 0.4rem",
                      fontWeight: 800,
                    }}
                  >
                    COMPLETADA
                  </span>
                </div>

                <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.6rem", color: "#6e8e59" }}>
                  Servicios: Amazon VPC · AWS IAM · Route 53 · CloudFront
                </div>

                <p style={{ fontFamily: "system-ui, sans-serif", fontSize: "0.68rem", color: "rgba(245,241,232,0.85)", lineHeight: 1.35, margin: 0 }}>
                  Estudio de limitaciones en Hostinger, justificación CAF, cálculo de TCO con alertas en $10 USD y diseño conceptual de red perimetral aislada.
                </p>

                <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.55rem", color: "rgba(245,241,232,0.5)", borderTop: "1px solid rgba(110,142,89,0.3)", paddingTop: "0.25rem" }}>
                  Representación 3D: Cubo perimetral de red VPC con anillo de CloudFront y núcleo de llaves IAM.
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="stage-1-card"
                initial={{ opacity: 0, y: -8, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -6, scale: 0.96 }}
                transition={{ duration: 0.18 }}
                style={{
                  padding: "0.75rem 0.95rem",
                  background: "rgba(18,14,10,0.94)",
                  border: "1.5px solid #d4a017",
                  boxShadow: "4px 4px 0px #d4a017",
                  backdropFilter: "blur(8px)",
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.35rem",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                    <Sparkles size={14} style={{ color: "#d4a017" }} />
                    <span style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: "0.72rem", color: "#F5F1E8", textTransform: "uppercase" }}>
                      ETAPA 02 // SEMANA 7
                    </span>
                  </div>
                  <span
                    style={{
                      fontFamily: "'JetBrains Mono', monospace",
                      fontSize: "0.52rem",
                      color: "#0A0A0A",
                      background: "#d4a017",
                      padding: "0.15rem 0.4rem",
                      fontWeight: 800,
                    }}
                  >
                    SIGUIENTE HITO
                  </span>
                </div>

                <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.6rem", color: "#d4a017" }}>
                  Servicios: Amazon EC2 · AWS Lambda · Amazon S3/EFS/Glacier · Amazon RDS
                </div>

                <p style={{ fontFamily: "system-ui, sans-serif", fontSize: "0.68rem", color: "rgba(245,241,232,0.85)", lineHeight: 1.35, margin: 0 }}>
                  Aprovisionamiento de cómputo en EC2, serverless con Lambda, almacenamiento de backups en S3 y despliegue del motor PostgreSQL en Amazon RDS dentro de la subred privada.
                </p>

                <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.55rem", color: "rgba(245,241,232,0.5)", borderTop: "1px solid rgba(212,160,23,0.3)", paddingTop: "0.25rem" }}>
                  Representación 3D: Torre hexagonal de cómputo EC2 con cilindro de RDS y anillo orbital de S3.
                </div>
              </motion.div>
            )}
          </AnimatePresence>
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

        {/* HUD Inferior de los 2 Hitos Curriculares */}
        <div
          style={{
            position: "absolute",
            bottom: "2rem",
            left: "3rem",
            right: "3.5rem",
            zIndex: 10,
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "0.85rem",
          }}
        >
          <div
            onClick={() => setSelectedPhase(0)}
            style={{
              padding: "0.6rem 0.9rem",
              background: selectedPhase === 0 ? "rgba(110,142,89,0.2)" : "rgba(14,14,14,0.75)",
              border: selectedPhase === 0 ? "1.5px solid #6e8e59" : "1px solid rgba(245,241,232,0.15)",
              backdropFilter: "blur(6px)",
              cursor: "pointer",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              boxShadow: selectedPhase === 0 ? "3px 3px 0px #6e8e59" : "none",
              transition: "all 0.2s ease",
            }}
          >
            <div>
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.55rem", color: "#6e8e59", fontWeight: 700 }}>
                ETAPA 01 // SEMANA 6 (ENTREGADO)
              </div>
              <div style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: "0.78rem", color: "#F5F1E8", marginTop: "0.15rem" }}>
                DIAGNÓSTICO & FUNDAMENTOS CLOUD
              </div>
            </div>
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.58rem", color: "#6e8e59", fontWeight: 800 }}>
              COMPLETADA
            </span>
          </div>

          <div
            onClick={() => setSelectedPhase(1)}
            style={{
              padding: "0.6rem 0.9rem",
              background: selectedPhase === 1 ? "rgba(212,160,23,0.2)" : "rgba(14,14,14,0.75)",
              border: selectedPhase === 1 ? "1.5px solid #d4a017" : "1px solid rgba(245,241,232,0.15)",
              backdropFilter: "blur(6px)",
              cursor: "pointer",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              boxShadow: selectedPhase === 1 ? "3px 3px 0px #d4a017" : "none",
              transition: "all 0.2s ease",
            }}
          >
            <div>
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.55rem", color: "#d4a017", fontWeight: 700 }}>
                ETAPA 02 // SEMANA 7 (SIGUIENTE PASO)
              </div>
              <div style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: "0.78rem", color: "#F5F1E8", marginTop: "0.15rem" }}>
                SERVICIOS CORE, ALMACENAMIENTO & BD
              </div>
            </div>
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.58rem", color: "#d4a017", fontWeight: 800 }}>
              SIGUIENTE HITO
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}

export default S13_Roadmap;