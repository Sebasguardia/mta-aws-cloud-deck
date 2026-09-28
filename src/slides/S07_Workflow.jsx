// src/slides/S07_Workflow.jsx
import React, { useEffect, useState, useRef } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { slidesContent } from "../data/content.es.js";
import { useSlideActive } from "../hooks/useSlideActive.js";
import { GitPipelineCanvas } from "../components/three/GitPipelineCanvas.jsx";
import { CanvasTransitionWrapper } from "../components/motion/CanvasTransitionWrapper.jsx";

const c = slidesContent.s07_workflow;

/**
 * S07 — Flujo de Trabajo del Equipo: Pipeline Manual y Simulación de Fallo.
 *
 * Directivas de diseño:
 *  - /industrial-brutalist-ui:
 *    Estética de terminal UNIX / Git CLI (#0A0A0A), tipografía monospace JetBrains,
 *    códigos de comando formateados, bordes nítidos de 1px y división de pantalla completa (50%/50%).
 *  - /impeccable:
 *    Línea de tiempo horizontal escalonada con 5 pasos tácticos,
 *    jerarquía clara con Archivo Black y script Yellowtail.
 *  - /threejs-geometry + /threejs-animation + /threejs-interaction:
 *    GitPipelineCanvas: Circuito 3D con los 5 nodos de despliegue y paquete de commit viajero.
 *  - /emil-design-eng + /animate:
 *    Simulador interactivo "Antes vs Ahora (Parte 1)":
 *    Botón "SIMULAR DESPLIEGUE MANUAL" que recorre paso a paso el pipeline (Clone → Branch → Test → Push → Deploy)
 *    hasta culminar en el clásico error 500: "❌ FUNCIONA EN MI MÁQUINA, EN PRODUCCIÓN COLAPSA".
 */
export function S07_Workflow({ isActive: propActive } = {}) {
  const shouldReduceMotion = useReducedMotion();
  const hookActive = useSlideActive(6);
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
  const [activeStep, setActiveStep] = useState(0);
  const [isSimulating, setIsSimulating] = useState(false);
  const [hasFailed, setHasFailed] = useState(false);
  const timeoutsRef = useRef([]);

  const clearAllTimeouts = () => {
    timeoutsRef.current.forEach((t) => clearTimeout(t));
    timeoutsRef.current = [];
  };

  useEffect(() => {
    if (isActive) {
      const timer = setTimeout(() => setEntered(true), 40);
      return () => clearTimeout(timer);
    } else {
      clearAllTimeouts();
      setEntered(false);
      setActiveStep(0);
      setIsSimulating(false);
      setHasFailed(false);
    }
  }, [isActive]);

  // Cancelar la simulación en cualquier instante
  const cancelSimulation = () => {
    clearAllTimeouts();
    setIsSimulating(false);
    setHasFailed(false);
    setActiveStep(0);
  };

  // Manejador del Simulador "Antes vs Ahora" con avance secuencial ordenado
  const runSimulation = () => {
    if (isSimulating) return;
    clearAllTimeouts();
    setIsSimulating(true);
    setHasFailed(false);
    setActiveStep(0);

    // Tiempos espaciados y cómodos para apreciar el viaje nodo a nodo
    const delays = [0, 950, 1900, 2850, 3800];

    delays.forEach((delay, idx) => {
      const t = setTimeout(() => {
        setActiveStep(idx);
        if (idx === 4) {
          const tFail = setTimeout(() => {
            setHasFailed(true);
            setIsSimulating(false);
          }, 950);
          timeoutsRef.current.push(tFail);
        }
      }, delay);
      timeoutsRef.current.push(t);
    });
  };

  const fadeUp = (delay = 0) => ({
    hidden: { opacity: 0, transform: shouldReduceMotion ? "none" : "translateY(14px)" },
    visible: {
      opacity: 1,
      transform: "translateY(0px)",
      transition: { duration: shouldReduceMotion ? 0.1 : 0.45, ease: [0.22, 1, 0.36, 1], delay },
    },
  });

  const stepIcons = ["git clone", "git checkout -b", "npm run dev", "git push origin", "manual ftp/cpanel"];

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
      aria-label="Slide 07: Flujo de Trabajo del Equipo"
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

      {/* ── Barra de acento vertical izquierda Rojo Riesgo ── */}
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
          COLUMNA IZQUIERDA (50%): Timeline Git & Simulador
      ══════════════════════════════════════════════════════════ */}
      <div
        style={{
          flex: "0 0 50%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "2.5rem 3.5rem 2.5rem 4.8rem",
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
              SEC_07 // MANUAL_DEPLOYMENT_WORKFLOW
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
            variants={fadeUp(0.14)}
            initial="hidden"
            animate={entered ? "visible" : "hidden"}
            style={{
              fontFamily: "'Archivo Black', 'Arial Black', sans-serif",
              fontSize: "clamp(1.8rem, 2.7vw, 2.6rem)",
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
            variants={fadeUp(0.2)}
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

        {/* Divider dorado que se dibuja con clip-path */}
        <motion.div
          aria-hidden="true"
          initial={{ clipPath: "inset(0 100% 0 0)" }}
          animate={entered ? { clipPath: "inset(0 0% 0 0)" } : { clipPath: "inset(0 100% 0 0)" }}
          transition={{ duration: shouldReduceMotion ? 0.1 : 0.55, ease: [0.83, 0, 0.17, 1], delay: 0.24 }}
          style={{ height: 2, background: "#c6432b", width: "100%", maxWidth: 300 }}
        />

        {/* ── Timeline Táctico de 5 Pasos ── */}
        <div style={{ display: "flex", flexDirection: "column", gap: "0.45rem" }}>
          {c.steps.map((item, idx) => {
            const isCurrent = activeStep === idx;
            const isPast = activeStep > idx;

            return (
              <motion.div
                key={item.step}
                variants={fadeUp(0.26 + idx * 0.06)}
                initial="hidden"
                animate={entered ? "visible" : "hidden"}
                whileHover={{ scale: 1.02, x: 4 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  if (isSimulating) cancelSimulation();
                  setActiveStep(idx);
                }}
                style={{
                  background: isCurrent ? "rgba(245,241,232,0.07)" : "rgba(245,241,232,0.02)",
                  border: `1px solid ${isCurrent ? "#d4a017" : "rgba(245,241,232,0.08)"}`,
                  borderLeft: `4px solid ${
                    idx === 4 && hasFailed
                      ? "#c6432b"
                      : isCurrent
                      ? "#d4a017"
                      : isPast
                      ? "#4a5d3a"
                      : "rgba(245,241,232,0.15)"
                  }`,
                  padding: isCurrent ? "0.65rem 1.0rem" : "0.55rem 0.9rem",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  boxShadow: isCurrent ? "0 0 15px rgba(212,160,23,0.15)" : "none",
                  transition: "padding 0.2s ease, background 0.2s ease, border 0.2s ease, box-shadow 0.2s ease",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                  <span
                    style={{
                      fontFamily: "'JetBrains Mono', monospace",
                      fontSize: "0.7rem",
                      fontWeight: 700,
                      color: isCurrent ? "#d4a017" : "rgba(245,241,232,0.4)",
                    }}
                  >
                    0{item.step}
                  </span>

                  <div style={{ display: "flex", flexDirection: "column", gap: "0.1rem" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                      <span
                        style={{
                          fontFamily: "'Archivo Black', sans-serif",
                          fontSize: "0.82rem",
                          color: isCurrent ? "#F5F1E8" : "rgba(245,241,232,0.85)",
                        }}
                      >
                        {item.action}
                      </span>
                      <span
                        style={{
                          fontFamily: "'JetBrains Mono', monospace",
                          fontSize: "0.58rem",
                          color: "#d4a017",
                          background: "rgba(212,160,23,0.08)",
                          padding: "0.1rem 0.35rem",
                          border: "1px solid rgba(212,160,23,0.2)",
                        }}
                      >
                        {stepIcons[idx]}
                      </span>
                    </div>
                    <span
                      style={{
                        fontFamily: "Inter, sans-serif",
                        fontSize: "0.72rem",
                        color: "rgba(245,241,232,0.55)",
                      }}
                    >
                      {item.desc}
                    </span>
                  </div>
                </div>

                <span
                  style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: "0.6rem",
                    fontWeight: 700,
                    color:
                      idx === 4 && hasFailed
                        ? "#c6432b"
                        : isCurrent
                        ? "#d4a017"
                        : isPast
                        ? "#4a5d3a"
                        : "rgba(245,241,232,0.3)",
                  }}
                >
                  {idx === 4 && hasFailed ? "❌ ERROR 500" : isCurrent ? "EN PROCESO" : isPast ? "COMPLETADO" : "PENDIENTE"}
                </span>
              </motion.div>
            );
          })}
        </div>

        {/* ── Simulador Interactivo "Antes vs Ahora (Parte 1)" ── */}
        <motion.div
          variants={fadeUp(0.5)}
          initial="hidden"
          animate={entered ? "visible" : "hidden"}
          style={{
            border: `1px solid ${hasFailed ? "#c6432b" : "rgba(245,241,232,0.12)"}`,
            background: hasFailed ? "rgba(198,67,43,0.1)" : "rgba(245,241,232,0.02)",
            padding: "0.85rem 1.1rem",
            display: "flex",
            flexDirection: "column",
            gap: "0.5rem",
            transition: "all 0.3s ease",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.15rem" }}>
              <span
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: "0.64rem",
                  color: hasFailed ? "#c6432b" : "#d4a017",
                  fontWeight: 700,
                  letterSpacing: "0.1em",
                }}
              >
                [ SIMULADOR: ANTES VS AHORA — PARTE 1 ]
              </span>
              <span
                style={{
                  fontFamily: "Inter, sans-serif",
                  fontSize: "0.76rem",
                  color: "rgba(245,241,232,0.85)",
                }}
              >
                Ejecuta el ciclo de despliegue manual tradicional:
              </span>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              {isSimulating && (
                <button
                  onClick={cancelSimulation}
                  style={{
                    background: "rgba(245,241,232,0.06)",
                    border: "1px solid rgba(245,241,232,0.25)",
                    color: "rgba(245,241,232,0.8)",
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: "0.66rem",
                    fontWeight: 700,
                    padding: "0.45rem 0.8rem",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.35rem",
                    transition: "all 0.2s ease",
                  }}
                >
                  <span>CANCELAR</span>
                  <span>⏹</span>
                </button>
              )}

              <button
                onClick={runSimulation}
                disabled={isSimulating}
                style={{
                  background: isSimulating ? "#d4a017" : hasFailed ? "#c6432b" : "rgba(245,241,232,0.08)",
                  border: `1px solid ${hasFailed ? "#c6432b" : isSimulating ? "#d4a017" : "rgba(245,241,232,0.3)"}`,
                  color: "#F5F1E8",
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: "0.66rem",
                  fontWeight: 700,
                  padding: "0.45rem 0.95rem",
                  cursor: isSimulating ? "wait" : "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.45rem",
                  transition: "all 0.2s cubic-bezier(0.22, 1, 0.36, 1)",
                  boxShadow: hasFailed ? "0 0 20px rgba(198,67,43,0.5)" : "none",
                }}
              >
                <span>{isSimulating ? "DESPLEGANDO..." : hasFailed ? "REINTENTAR DESPLIEGUE" : "SIMULAR DESPLIEGUE MANUAL"}</span>
                <span>{isSimulating ? "⏳" : hasFailed ? "↻" : "▶"}</span>
              </button>
            </div>
          </div>

          {/* Resultado de la simulación */}
          {hasFailed && (
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              style={{
                background: "rgba(198,67,43,0.18)",
                borderLeft: "3px solid #c6432b",
                padding: "0.6rem 0.8rem",
                display: "flex",
                alignItems: "center",
                gap: "0.75rem",
              }}
            >
              <span style={{ fontSize: "1.2rem" }}>❌</span>
              <div style={{ display: "flex", flexDirection: "column" }}>
                <span
                  style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: "0.72rem",
                    fontWeight: 700,
                    color: "#F5F1E8",
                  }}
                >
                  "EN MI MÁQUINA FUNCIONA... EN PRODUCCIÓN COLAPSA"
                </span>
                <span
                  style={{
                    fontFamily: "Inter, sans-serif",
                    fontSize: "0.68rem",
                    color: "rgba(245,241,232,0.7)",
                  }}
                >
                  Discrepancias de variables de entorno, versiones de Node.js y falta de Staging automatizado.
                </span>
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>

      {/* ══════════════════════════════════════════════════════════
          COLUMNA DERECHA (50%): Circuito Pipeline 3D
      ══════════════════════════════════════════════════════════ */}
      <div
        style={{
          flex: "0 0 50%",
          position: "relative",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderLeft: "1px solid rgba(245,241,232,0.08)",
          background: hasFailed
            ? "radial-gradient(circle at center, rgba(198,67,43,0.12) 0%, rgba(10,10,10,0.98) 75%)"
            : "radial-gradient(circle at center, rgba(212,160,23,0.04) 0%, rgba(10,10,10,0.95) 75%)",
          transition: "background 0.5s ease",
          overflow: "hidden",
        }}
      >
         {/* Canvas 3D de Circuito Git continuo y fluido (Cero desmontes ni recargas) */}
        <GitPipelineCanvas
          isActive={isActive}
          currentStep={activeStep}
          isSimulating={isSimulating}
          hasFailed={hasFailed}
        />

        {/* HUD superior derecho */}
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
              color: hasFailed ? "#c6432b" : "#d4a017",
              fontWeight: 700,
            }}
          >
            {hasFailed ? "PIPELINE_STATUS // BROKEN_BUILD" : "GIT_PIPELINE // 5_STAGES"}
          </span>
          <span
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: "0.58rem",
              color: "rgba(245,241,232,0.4)",
            }}
          >
            CI_CD: ABSENT · STAGING: NONE · DEPLOY_METHOD: MANUAL
          </span>
        </div>

        {/* HUD inferior derecho con conclusión técnica */}
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            bottom: "2.5rem",
            right: "3rem",
            border: `1px solid ${hasFailed ? "#c6432b" : "rgba(245,241,232,0.12)"}`,
            background: "rgba(10,10,10,0.75)",
            backdropFilter: "blur(8px)",
            padding: "0.65rem 1rem",
            display: "flex",
            flexDirection: "column",
            gap: "0.25rem",
            zIndex: 10,
            maxWidth: "300px",
            boxShadow: hasFailed ? "0 0 25px rgba(198,67,43,0.35)" : "none",
          }}
        >
          <span
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: "0.62rem",
              color: hasFailed ? "#c6432b" : "#d4a017",
              fontWeight: 700,
            }}
          >
            {hasFailed ? "[ ANATOMÍA DEL ERROR 500 ]" : "[ COOPERACIÓN MANUAL ]"}
          </span>
          <span
            style={{
              fontFamily: "Inter, sans-serif",
              fontSize: "0.72rem",
              color: "rgba(245,241,232,0.75)",
              lineHeight: 1.35,
            }}
          >
            {hasFailed
              ? "Sin un entorno de Staging que replique las condiciones de producción, cada despliegue manual representa un riesgo crítico de caída de servicio."
              : "10 desarrolladores suben código al mismo repositorio sin validaciones automáticas de tests ni pipeline continuo en la nube."}
          </span>
        </div>
      </div>
    </section>
  );
}
