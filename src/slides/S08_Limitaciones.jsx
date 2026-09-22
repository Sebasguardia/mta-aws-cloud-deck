// src/slides/S08_Limitaciones.jsx
import React, { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import {
  AlertTriangle,
  Server,
  ShieldAlert,
  ZapOff,
  RefreshCw,
  Flame,
  Layers,
  ArrowRight,
  Activity,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { slidesContent } from "../data/content.es.js";
import { useSlideActive } from "../hooks/useSlideActive.js";
import { useSharedDeckState } from "../hooks/useSharedDeckState.js";
import { CriticalBottleneckCanvas } from "../components/three/CriticalBottleneckCanvas.jsx";
import { CanvasTransitionWrapper } from "../components/motion/CanvasTransitionWrapper.jsx";
import { Button } from "../components/ui/Button.jsx";
import { Badge } from "../components/ui/Badge.jsx";
import { easings } from "../lib/easings.js";

const c = slidesContent.s08_limitaciones;

/**
 * S08 — Los 3 Problemas Críticos (Clímax del Bloque 2: El Diagnóstico).
 *
 * Directivas de diseño:
 *  - /industrial-brutalist-ui:
 *    Estética de terminal industrial de diagnóstico de fallos (#0A0A0A),
 *    rejilla técnica militar, bordes afilados de 1px/2px, etiquetas monospace y
 *    distribución panorámica de pantalla completa 50%/50% sin scroll ni recortes.
 *  - /impeccable:
 *    3 Tarjetas de problemas tácticos con tags de severidad, estado interactivo expandido/colapsado
 *    y métricas claras de riesgo.
 *  - /threejs-geometry + /threejs-animation + /threejs-interaction:
 *    CriticalBottleneckCanvas con el chasis Hostinger SPOF y 3 satélites interactivos en Three.js.
 *  - /emil-design-eng + /animate:
 *    Simulador de colapso con temporizador en tiempo real sincronizado con useSharedDeckState:
 *    Botón para simular caída y ver la reacción tanto en el 3D como en la telemetría.
 */
export function S08_Limitaciones({ isActive: propActive } = {}) {
  const shouldReduceMotion = useReducedMotion();
  const hookActive = useSlideActive(7);
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
  const [selectedProblem, setSelectedProblem] = useState(0);

  const {
    isServerDown,
    outageSeconds,
    triggerServerCrash,
    restoreServer,
    incrementOutageSeconds,
  } = useSharedDeckState();

  // Activar entrada escalonada al montarse el slide
  useEffect(() => {
    if (isActive) {
      const timer = setTimeout(() => setEntered(true), 40);
      return () => clearTimeout(timer);
    } else {
      setEntered(false);
    }
  }, [isActive]);

  // Cronómetro de caída si el servidor colapsa
  useEffect(() => {
    let interval = null;
    if (isServerDown && isActive) {
      interval = setInterval(() => {
        incrementOutageSeconds();
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isServerDown, isActive, incrementOutageSeconds]);

  const formatTime = (totalSec) => {
    const mins = Math.floor(totalSec / 60).toString().padStart(2, "0");
    const secs = (totalSec % 60).toString().padStart(2, "0");
    return `${mins}:${secs}`;
  };

  // Variantes de animación
  const fadeUp = (delay = 0) => ({
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 16 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: shouldReduceMotion ? 0.1 : 0.5, ease: [0.16, 1, 0.3, 1], delay },
    },
  });

  const problemIcons = [Flame, ZapOff, ShieldAlert];

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

      {/* ── Luz de advertencia ambiental cuando el sistema colapsa ── */}
      <AnimatePresence>
        {isServerDown && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: [0.15, 0.35, 0.15] }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
            style={{
              position: "absolute",
              inset: 0,
              background: "radial-gradient(circle at 75% 50%, rgba(198,67,43,0.3) 0%, transparent 70%)",
              pointerEvents: "none",
              zIndex: 1,
            }}
          />
        )}
      </AnimatePresence>

      {/* ── Barra de acento vertical izquierda Rojo Crítico ── */}
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
          background: "#c6432b",
          zIndex: 3,
        }}
      />

      {/* ══════════════════════════════════════════════════════════
          COLUMNA IZQUIERDA (50%): Los 3 Problemas Críticos & Auditoría
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
          gap: "1rem",
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
                color: "#c6432b",
                background: "rgba(198,67,43,0.12)",
                border: "1px solid rgba(198,67,43,0.4)",
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
              SEC_08 // CRITICAL_LIMITATIONS_AUDIT
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
              fontSize: "clamp(1.8rem, 2.6vw, 2.5rem)",
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

        {/* Acordeón / Tarjetas de los 3 Problemas Críticos */}
        <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
          {c.problems.map((prob, idx) => {
            const isSelected = selectedProblem === idx;
            const IconComponent = problemIcons[idx] || AlertTriangle;

            return (
              <motion.div
                key={prob.id}
                variants={fadeUp(0.2 + idx * 0.08)}
                initial="hidden"
                animate={entered ? "visible" : "hidden"}
                onClick={() => setSelectedProblem(idx)}
                whileHover={{ x: 3 }}
                transition={{ duration: 0.15, ease: easings.snappy }}
                style={{
                  padding: "0.85rem 1.15rem",
                  background: isSelected
                    ? "rgba(198,67,43,0.08)"
                    : "rgba(255,255,255,0.02)",
                  border: isSelected
                    ? "1.5px solid #c6432b"
                    : "1px solid rgba(245,241,232,0.12)",
                  borderLeft: isSelected
                    ? "4px solid #c6432b"
                    : "4px solid rgba(245,241,232,0.2)",
                  cursor: "pointer",
                  position: "relative",
                  transition: "background 0.2s ease, border-color 0.2s ease",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.8rem" }}>
                    <span
                      style={{
                        fontFamily: "'JetBrains Mono', monospace",
                        fontSize: "0.75rem",
                        fontWeight: 900,
                        color: isSelected ? "#c6432b" : "rgba(245,241,232,0.4)",
                      }}
                    >
                      {prob.num}
                    </span>
                    <IconComponent
                      size={17}
                      style={{
                        color: isSelected ? "#c6432b" : "rgba(245,241,232,0.5)",
                        flexShrink: 0,
                      }}
                    />
                    <h3
                      style={{
                        fontFamily: "'Archivo Black', sans-serif",
                        fontSize: "0.88rem",
                        color: isSelected ? "#F5F1E8" : "rgba(245,241,232,0.85)",
                        textTransform: "uppercase",
                        margin: 0,
                        letterSpacing: "0.02em",
                      }}
                    >
                      {prob.title}
                    </h3>
                  </div>

                  <span
                    style={{
                      fontFamily: "'JetBrains Mono', monospace",
                      fontSize: "0.58rem",
                      padding: "0.2rem 0.5rem",
                      border: isSelected
                        ? "1px solid rgba(198,67,43,0.5)"
                        : "1px solid rgba(245,241,232,0.15)",
                      color: isSelected ? "#c6432b" : "rgba(245,241,232,0.5)",
                      textTransform: "uppercase",
                      letterSpacing: "0.08em",
                    }}
                  >
                    {prob.tag}
                  </span>
                </div>

                <AnimatePresence>
                  {isSelected && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25, ease: easings.cinematic }}
                      style={{ overflow: "hidden" }}
                    >
                      <p
                        style={{
                          fontFamily: "system-ui, -apple-system, sans-serif",
                          fontSize: "0.8rem",
                          color: "rgba(245,241,232,0.75)",
                          lineHeight: 1.45,
                          margin: "0.6rem 0 0.5rem 0",
                        }}
                      >
                        {prob.desc}
                      </p>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "0.5rem",
                          padding: "0.45rem 0.65rem",
                          background: "rgba(0,0,0,0.45)",
                          border: "1px solid rgba(198,67,43,0.3)",
                        }}
                      >
                        <span
                          style={{
                            fontFamily: "'JetBrains Mono', monospace",
                            fontSize: "0.62rem",
                            color: "#c6432b",
                            fontWeight: 700,
                            letterSpacing: "0.05em",
                          }}
                        >
                          IMPACTO:
                        </span>
                        <span
                          style={{
                            fontFamily: "'JetBrains Mono', monospace",
                            fontSize: "0.68rem",
                            color: "#F5F1E8",
                          }}
                        >
                          {prob.impact}
                        </span>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>

        {/* Panel de Acción: Botón para Disparar Simulación de Caída (Outage) */}
        <motion.div
          variants={fadeUp(0.48)}
          initial="hidden"
          animate={entered ? "visible" : "hidden"}
          style={{
            padding: "0.9rem 1.2rem",
            background: "rgba(10,10,10,0.9)",
            border: isServerDown ? "1.5px solid #c6432b" : "1px solid rgba(245,241,232,0.15)",
            boxShadow: isServerDown ? "4px 4px 0px #c6432b" : "4px 4px 0px rgba(0,0,0,0.8)",
            display: "flex",
            flexDirection: "column",
            gap: "0.6rem",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <span
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  backgroundColor: isServerDown ? "#c6432b" : "#4a5d3a",
                  animation: isServerDown ? "ping 1.2s cubic-bezier(0, 0, 0.2, 1) infinite" : "none",
                }}
              />
              <span
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: "0.65rem",
                  letterSpacing: "0.15em",
                  color: isServerDown ? "#c6432b" : "#d4a017",
                  fontWeight: 700,
                  textTransform: "uppercase",
                }}
              >
                {isServerDown ? "FALLO ACTIVO EN HOSTINGER" : "TEST EN VIVO // SPOF AUDIT"}
              </span>
            </div>

            {isServerDown && (
              <div
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: "0.75rem",
                  color: "#c6432b",
                  fontWeight: 800,
                  letterSpacing: "0.1em",
                }}
              >
                TIEMPO CAÍDO: {formatTime(outageSeconds)}
              </div>
            )}
          </div>

          <div style={{ display: "flex", gap: "0.8rem", alignItems: "center" }}>
            {isServerDown ? (
              <Button
                variant="safe"
                size="sm"
                icon={RefreshCw}
                onClick={restoreServer}
                className="w-full justify-center"
              >
                RESTAURAR SERVIDOR Y SISTEMAS
              </Button>
            ) : (
              <Button
                variant="risk"
                size="sm"
                icon={AlertTriangle}
                onClick={triggerServerCrash}
                className="w-full justify-center"
              >
                SIMULAR CAÍDA DEL SERVIDOR ÚNICO
              </Button>
            )}
          </div>
        </motion.div>
      </div>

      {/* ══════════════════════════════════════════════════════════
          COLUMNA DERECHA (50%): Visualizador 3D SPOF & Telemetría
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
          background: "radial-gradient(ellipse at center, #141414 0%, #0a0a0a 80%)",
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
            <Server size={14} style={{ color: isServerDown ? "#c6432b" : "#d4a017" }} />
            <span
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: "0.65rem",
                letterSpacing: "0.15em",
                color: isServerDown ? "#c6432b" : "rgba(245,241,232,0.6)",
                textTransform: "uppercase",
              }}
            >
              HOSTINGER SHARED RACK // SPOF
            </span>
          </div>

          <div
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: "0.6rem",
              padding: "0.2rem 0.5rem",
              background: isServerDown ? "rgba(198,67,43,0.2)" : "rgba(0,0,0,0.6)",
              border: isServerDown ? "1px solid #c6432b" : "1px solid rgba(245,241,232,0.15)",
              color: isServerDown ? "#c6432b" : "#d4a017",
            }}
          >
            {isServerDown ? "STATUS: OUT_OF_SERVICE" : "STATUS: CRITICAL_OVERLOAD"}
          </div>
        </div>

        {/* Canvas 3D Three.js */}
        <div
          style={{
            width: "100%",
            height: "75%",
            position: "relative",
            zIndex: 5,
          }}
        >
          <CanvasTransitionWrapper isActive={isActive}>
            <CriticalBottleneckCanvas
              isActive={isActive}
              isDown={isServerDown}
              activeProblem={selectedProblem}
            />
          </CanvasTransitionWrapper>
        </div>

        {/* HUD Inferior de los 3 Nodos Afectados en Cascada */}
        <div
          style={{
            position: "absolute",
            bottom: "2rem",
            left: "3rem",
            right: "3.5rem",
            zIndex: 10,
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "0.75rem",
          }}
        >
          {/* Nodo 1: Workspace MTA */}
          <div
            style={{
              padding: "0.55rem 0.75rem",
              background: isServerDown ? "rgba(198,67,43,0.15)" : "rgba(14,14,14,0.75)",
              border: isServerDown ? "1px solid #c6432b" : "1px solid rgba(245,241,232,0.15)",
              backdropFilter: "blur(6px)",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.58rem", color: "rgba(245,241,232,0.6)" }}>
                ERP MTA
              </span>
              {isServerDown ? (
                <XCircle size={11} style={{ color: "#c6432b" }} />
              ) : (
                <CheckCircle2 size={11} style={{ color: "#6e8e59" }} />
              )}
            </div>
            <div
              style={{
                fontFamily: "'Archivo Black', sans-serif",
                fontSize: "0.72rem",
                color: isServerDown ? "#c6432b" : "#F5F1E8",
                marginTop: "0.2rem",
                textTransform: "uppercase",
              }}
            >
              {isServerDown ? "CONGELADO" : "OPERATIVO"}
            </div>
          </div>

          {/* Nodo 2: Strato Studio */}
          <div
            style={{
              padding: "0.55rem 0.75rem",
              background: isServerDown ? "rgba(198,67,43,0.15)" : "rgba(14,14,14,0.75)",
              border: isServerDown ? "1px solid #c6432b" : "1px solid rgba(245,241,232,0.15)",
              backdropFilter: "blur(6px)",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.58rem", color: "rgba(245,241,232,0.6)" }}>
                STRATO B2B
              </span>
              {isServerDown ? (
                <XCircle size={11} style={{ color: "#c6432b" }} />
              ) : (
                <CheckCircle2 size={11} style={{ color: "#6e8e59" }} />
              )}
            </div>
            <div
              style={{
                fontFamily: "'Archivo Black', sans-serif",
                fontSize: "0.72rem",
                color: isServerDown ? "#c6432b" : "#F5F1E8",
                marginTop: "0.2rem",
                textTransform: "uppercase",
              }}
            >
              {isServerDown ? "CAÍDA WEB" : "OPERATIVO"}
            </div>
          </div>

          {/* Nodo 3: VIISION */}
          <div
            style={{
              padding: "0.55rem 0.75rem",
              background: isServerDown ? "rgba(198,67,43,0.15)" : "rgba(14,14,14,0.75)",
              border: isServerDown ? "1px solid #c6432b" : "1px solid rgba(245,241,232,0.15)",
              backdropFilter: "blur(6px)",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.58rem", color: "rgba(245,241,232,0.6)" }}>
                VIISION
              </span>
              {isServerDown ? (
                <XCircle size={11} style={{ color: "#c6432b" }} />
              ) : (
                <CheckCircle2 size={11} style={{ color: "#6e8e59" }} />
              )}
            </div>
            <div
              style={{
                fontFamily: "'Archivo Black', sans-serif",
                fontSize: "0.72rem",
                color: isServerDown ? "#c6432b" : "#F5F1E8",
                marginTop: "0.2rem",
                textTransform: "uppercase",
              }}
            >
              {isServerDown ? "CAÍDA DEMO" : "OPERATIVO"}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default S08_Limitaciones;