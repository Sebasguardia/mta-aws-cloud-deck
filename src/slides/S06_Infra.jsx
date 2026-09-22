// src/slides/S06_Infra.jsx
import React, { useEffect, useState, useRef } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { slidesContent } from "../data/content.es.js";
import { useSlideActive } from "../hooks/useSlideActive.js";
import { LegacyHostingerCanvas } from "../components/three/LegacyHostingerCanvas.jsx";
import { CanvasTransitionWrapper } from "../components/motion/CanvasTransitionWrapper.jsx";

const c = slidesContent.s06_infraestructura;

/**
 * S06 — Infraestructura y Tecnología Actual: Diagnóstico del Alojamiento Compartido.
 *
 * Directivas de diseño:
 *  - /industrial-brutalist-ui:
 *    Paleta reducida a tonos fríos/grises industriales con acento de advertencia rojo (#c6432b) y dorado (#d4a017).
 *    Diagrama táctico de arquitectura en 3 nodos con badges de severidad (CRÍTICO, MODERADO, ALTO).
 *  - /impeccable:
 *    Layout a pantalla completa (slide-row 50%/50%), tipografía editorial Archivo Black + Yellowtail cursive,
 *    separadores con clip-path reactivo.
 *  - /threejs-geometry + /threejs-animation + /threejs-interaction:
 *    LegacyHostingerCanvas: Torre de servidor compartido en wireframe 3D, que al activar el simulador
 *    "¿Qué pasa si...?", entra en colapso sísmico (shake) y emite pulsos de alarma en tiempo real.
 *  - /emil-design-eng + /animate:
 *    Toggle interactivo con respuesta háptica visual, staggers calibrados y micro-interacciones.
 */
export function S06_Infra({ isActive: propActive } = {}) {
  const shouldReduceMotion = useReducedMotion();
  const hookActive = useSlideActive(5);
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
  const [isFaultActive, setIsFaultActive] = useState(false);
  const [activeComponentIdx, setActiveComponentIdx] = useState(0);

  useEffect(() => {
    if (isActive) {
      const timer = setTimeout(() => setEntered(true), 40);
      return () => clearTimeout(timer);
    } else {
      setEntered(false);
      setIsFaultActive(false);
      setActiveComponentIdx(0);
    }
  }, [isActive]);

  const fadeUp = (delay = 0) => ({
    hidden: { opacity: 0, transform: shouldReduceMotion ? "none" : "translateY(14px)" },
    visible: {
      opacity: 1,
      transform: "translateY(0px)",
      transition: { duration: shouldReduceMotion ? 0.1 : 0.45, ease: [0.22, 1, 0.36, 1], delay },
    },
  });

  const getRiskColor = (level) => {
    switch (level) {
      case "CRÍTICO":
        return { text: "#c6432b", bg: "rgba(198,67,43,0.12)", border: "#c6432b" };
      case "ALTO":
        return { text: "#d4a017", bg: "rgba(212,160,23,0.12)", border: "#d4a017" };
      case "MODERADO":
      default:
        return { text: "#4a5d3a", bg: "rgba(74,93,58,0.12)", border: "#4a5d3a" };
    }
  };

  return (
    <section
      ref={sectionRef}
      data-transition="slide"
      className="slide-row"
      style={{
        width: "100%",
        height: "100%",
        background: "#0a0a0a",
        position: "relative",
        overflow: "hidden",
        display: "flex",
        alignItems: "stretch",
      }}
      aria-label="Slide 06: Infraestructura y Tecnología Actual"
    >
      {/* ── Blueprint Grid & CRT Background ── */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "linear-gradient(rgba(245,241,232,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(245,241,232,0.04) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          background: "repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,0,0,0.08) 3px, rgba(0,0,0,0.08) 6px)",
          pointerEvents: "none",
          zIndex: 1,
        }}
      />

      {/* ── Barra de acento vertical izquierda Rojo Riesgo (Bloque 02: El Diagnóstico) ── */}
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
          COLUMNA IZQUIERDA (50%): Jerarquía Editorial & Componentes
      ══════════════════════════════════════════════════════════ */}
      <div
        style={{
          flex: "0 0 50%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "2.8rem 3.5rem 2.8rem 4.8rem",
          position: "relative",
          zIndex: 2,
          gap: "1.1rem",
        }}
      >
        {/* Header Editorial */}
        <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
          <motion.div
            variants={fadeUp(0.05)}
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
                background: "rgba(198,67,43,0.08)",
                border: "1px solid rgba(198,67,43,0.35)",
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
                color: "rgba(245,241,232,0.4)",
              }}
            >
              SEC_06 // LEGACY_INFRASTRUCTURE
            </span>
          </motion.div>

          <motion.p
            variants={fadeUp(0.1)}
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
            variants={fadeUp(0.16)}
            initial="hidden"
            animate={entered ? "visible" : "hidden"}
            style={{
              fontFamily: "'Archivo Black', 'Arial Black', sans-serif",
              fontSize: "clamp(1.8rem, 2.8vw, 2.7rem)",
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
            variants={fadeUp(0.22)}
            initial="hidden"
            animate={entered ? "visible" : "hidden"}
            style={{
              fontFamily: "Inter, sans-serif",
              fontSize: "0.85rem",
              color: "rgba(245,241,232,0.65)",
              lineHeight: 1.45,
              margin: 0,
            }}
          >
            {c.subtitle}
          </motion.p>
        </div>

        {/* Divider con clip-path en rojo de riesgo */}
        <motion.div
          aria-hidden="true"
          initial={{ clipPath: "inset(0 100% 0 0)" }}
          animate={entered ? { clipPath: "inset(0 0% 0 0)" } : { clipPath: "inset(0 100% 0 0)" }}
          transition={{ duration: shouldReduceMotion ? 0.1 : 0.55, ease: [0.83, 0, 0.17, 1], delay: 0.26 }}
          style={{ height: 2, background: "#c6432b", width: "100%", maxWidth: 320 }}
        />

        {/* ── 3 Componentes Tácticos del Diagnóstico ── */}
        <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
          {c.components.map((item, idx) => {
            const isSelected = activeComponentIdx === idx;
            const risk = getRiskColor(item.riskLevel);

            return (
              <motion.div
                key={item.title}
                variants={fadeUp(0.3 + idx * 0.08)}
                initial="hidden"
                animate={entered ? "visible" : "hidden"}
                whileHover={{ scale: 1.02, x: 4 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setActiveComponentIdx(idx)}
                style={{
                  background: isSelected ? "rgba(245,241,232,0.07)" : "rgba(245,241,232,0.02)",
                  border: `1px solid ${isSelected ? risk.border : "rgba(245,241,232,0.09)"}`,
                  borderLeft: `4px solid ${risk.border}`,
                  padding: isSelected ? "0.95rem 1.2rem" : "0.85rem 1.1rem",
                  cursor: "pointer",
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.35rem",
                  boxShadow: isSelected ? `0 0 20px ${risk.bg}` : "none",
                  transition: "padding 0.25s ease, background 0.2s ease, border 0.2s ease, box-shadow 0.25s ease",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
                    <span
                      style={{
                        fontFamily: "'Archivo Black', sans-serif",
                        fontSize: "0.88rem",
                        color: "#F5F1E8",
                      }}
                    >
                      {item.title}
                    </span>
                    <span
                      style={{
                        fontFamily: "'JetBrains Mono', monospace",
                        fontSize: "0.58rem",
                        color: "rgba(245,241,232,0.5)",
                        background: "rgba(245,241,232,0.04)",
                        padding: "0.15rem 0.45rem",
                        border: "1px solid rgba(245,241,232,0.1)",
                      }}
                    >
                      {item.badge}
                    </span>
                  </div>

                  <span
                    style={{
                      fontFamily: "'JetBrains Mono', monospace",
                      fontSize: "0.62rem",
                      fontWeight: 700,
                      color: risk.text,
                      background: risk.bg,
                      border: `1px solid ${risk.border}`,
                      padding: "0.18rem 0.5rem",
                    }}
                  >
                    RIESGO: {item.riskLevel}
                  </span>
                </div>

                <p
                  style={{
                    fontFamily: "Inter, sans-serif",
                    fontSize: "0.76rem",
                    color: "rgba(245,241,232,0.65)",
                    lineHeight: 1.4,
                    margin: 0,
                  }}
                >
                  {item.desc}
                </p>
              </motion.div>
            );
          })}
        </div>

        {/* ── Simulador Interactivo: Toggle "¿Qué pasa si...?" ── */}
        <motion.div
          variants={fadeUp(0.5)}
          initial="hidden"
          animate={entered ? "visible" : "hidden"}
          style={{
            border: `1px solid ${isFaultActive ? "#c6432b" : "rgba(245,241,232,0.12)"}`,
            background: isFaultActive ? "rgba(198,67,43,0.1)" : "rgba(245,241,232,0.02)",
            padding: "0.85rem 1.2rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            transition: "all 0.3s ease",
          }}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: "0.2rem" }}>
            <span
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: "0.68rem",
                color: isFaultActive ? "#c6432b" : "#D4A017",
                fontWeight: 700,
                letterSpacing: "0.1em",
              }}
            >
              [ SIMULADOR INTERACTIVO ]
            </span>
            <span
              style={{
                fontFamily: "Inter, sans-serif",
                fontSize: "0.78rem",
                color: "rgba(245,241,232,0.85)",
              }}
            >
              ¿Qué pasa si Hostinger sufre una caída de servicio?
            </span>
          </div>

          <button
            onClick={() => setIsFaultActive(!isFaultActive)}
            style={{
              background: isFaultActive ? "#c6432b" : "rgba(245,241,232,0.08)",
              border: `1px solid ${isFaultActive ? "#c6432b" : "rgba(245,241,232,0.3)"}`,
              color: "#F5F1E8",
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: "0.68rem",
              fontWeight: 700,
              padding: "0.5rem 1rem",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              transition: "all 0.2s cubic-bezier(0.22, 1, 0.36, 1)",
              boxShadow: isFaultActive ? "0 0 20px rgba(198,67,43,0.6)" : "none",
            }}
          >
            <span>{isFaultActive ? "FALLO SIMULADO: ACTIVO" : "SIMULAR COLAPSO"}</span>
            <span>{isFaultActive ? "⚡" : "▶"}</span>
          </button>
        </motion.div>
      </div>

      {/* ══════════════════════════════════════════════════════════
          COLUMNA DERECHA (50%): Torre de Servidor 3D y Telemetría
      ══════════════════════════════════════════════════════════ */}
      <div
        style={{
          flex: "0 0 50%",
          position: "relative",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderLeft: "1px solid rgba(245,241,232,0.08)",
          background: isFaultActive
            ? "radial-gradient(circle at center, rgba(198,67,43,0.12) 0%, rgba(10,10,10,0.98) 75%)"
            : "radial-gradient(circle at center, rgba(85,85,85,0.05) 0%, rgba(10,10,10,0.95) 75%)",
          transition: "background 0.5s ease",
          overflow: "hidden",
        }}
      >
        {/* Canvas 3D de Servidor Hostinger continuo y fluido (Cero desmontes ni recargas) */}
        <LegacyHostingerCanvas
          isActive={isActive}
          isFaultActive={isFaultActive}
          selectedComponentIdx={activeComponentIdx}
          onSelectComponent={(idx) => setActiveComponentIdx(idx)}
        />

        {/* HUD superior derecho de telemetría de servidor */}
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            top: "2.5rem",
            right: "3rem",
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-end",
            gap: "0.25rem",
            pointerEvents: "none",
            zIndex: 10,
          }}
        >
          <span
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: "0.62rem",
              letterSpacing: "0.2em",
              color: isFaultActive ? "#c6432b" : "#D4A017",
              fontWeight: 700,
            }}
          >
            {isFaultActive ? "SYSTEM_ALERT // SEVERITY_HIGH" : "LEGACY_NODE // MONOLITH_HOST"}
          </span>
          <span
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: "0.58rem",
              color: "rgba(245,241,232,0.4)",
            }}
          >
            STATUS: {isFaultActive ? "OFFLINE / UNRESPONSIVE" : "SHARED_CPU_SATURATED"}
          </span>
        </div>

        {/* HUD inferior derecho: Diagnóstico técnico */}
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            bottom: "2.5rem",
            right: "3rem",
            border: `1px solid ${isFaultActive ? "#c6432b" : "rgba(245,241,232,0.12)"}`,
            background: "rgba(10,10,10,0.75)",
            backdropFilter: "blur(8px)",
            padding: "0.65rem 1rem",
            display: "flex",
            flexDirection: "column",
            gap: "0.25rem",
            zIndex: 10,
            maxWidth: "300px",
            boxShadow: isFaultActive ? "0 0 25px rgba(198,67,43,0.35)" : "none",
          }}
        >
          <span
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: "0.62rem",
              color: isFaultActive ? "#c6432b" : "#D4A017",
              fontWeight: 700,
            }}
          >
            {isFaultActive ? "[ COLAPSO EN CADENA ]" : "[ ANATOMÍA DEL RIESGO ]"}
          </span>
          <span
            style={{
              fontFamily: "Inter, sans-serif",
              fontSize: "0.72rem",
              color: "rgba(245,241,232,0.75)",
              lineHeight: 1.35,
            }}
          >
            {isFaultActive
              ? "Al fallar el servidor único de Hostinger, colapsan simultáneamente los portafolios comerciales de clientes y el ERP Workspace MTA."
              : "Sin arquitectura redundante ni auto-scaling. Todo el tráfico de desarrollo, clientes y administración compite por la misma memoria RAM."}
          </span>
        </div>
      </div>
    </section>
  );
}
