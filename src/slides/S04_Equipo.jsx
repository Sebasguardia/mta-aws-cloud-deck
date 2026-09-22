// src/slides/S04_Equipo.jsx
import React, { useEffect, useState, useRef } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { slidesContent } from "../data/content.es.js";
import { useSlideActive } from "../hooks/useSlideActive.js";
import { TeamTopologyCanvas } from "../components/three/TeamTopologyCanvas.jsx";
import { CanvasTransitionWrapper } from "../components/motion/CanvasTransitionWrapper.jsx";

const c = slidesContent.s04_equipo;

/**
 * S04 — El Equipo de TI: Colectivo de Ingeniería Ágil 100% Remoto.
 *
 * Directivas de diseño:
 *  - /industrial-brutalist-ui:
 *    Grid matemático bimodal, métricas en monospace JetBrains, avatares de radar táctico,
 *    borders nítidos de 1px en palette ink/olive/gold, 0px border-radius.
 *  - /impeccable:
 *    Composición editorial asimétrica (48% data / 52% visualizador 3D interactivo),
 *    jerarquía tipográfica estricta con Archivo Black y Yellowtail cursive.
 *  - /threejs-geometry + /threejs-animation + /threejs-interaction:
 *    TeamTopologyCanvas: red de 10 nodos periféricos + 1 núcleo coordinador,
 *    flujos de datos orbitales en tiempo real y respuesta de cámara inercial.
 *  - /emil-design-eng + /animate:
 *    Count-up animado progresivo de "10 Practicantes",
 *    staggers de badges tecnológicos con tooltips tácticos al hover y focus.
 */
export function S04_Equipo({ isActive: propActive } = {}) {
  const shouldReduceMotion = useReducedMotion();
  const hookActive = useSlideActive(3);
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
  const [count, setCount] = useState(0);
  const [activeNode, setActiveNode] = useState(null);
  const [activeSupervisor, setActiveSupervisor] = useState(null);
  const [hoveredTech, setHoveredTech] = useState(null);

  // Reset y trigger de animaciones
  useEffect(() => {
    if (isActive) {
      const timer = setTimeout(() => setEntered(true), 40);
      return () => clearTimeout(timer);
    } else {
      setEntered(false);
      setCount(0);
      setActiveNode(null);
      setActiveSupervisor(null);
      setHoveredTech(null);
    }
  }, [isActive]);

  // Count-up animado con curva easeOutExpo
  useEffect(() => {
    if (!entered) {
      setCount(0);
      return;
    }
    if (shouldReduceMotion) {
      setCount(c.statNumber);
      return;
    }

    let start = 0;
    const target = c.statNumber;
    const duration = 950;
    const startTime = performance.now();

    const updateCounter = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // easeOutExpo: progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress)
      const easeVal = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      const currentVal = Math.round(easeVal * target);
      setCount(currentVal);

      if (progress < 1) {
        requestAnimationFrame(updateCounter);
      }
    };

    const animFrame = requestAnimationFrame(updateCounter);
    return () => cancelAnimationFrame(animFrame);
  }, [entered, shouldReduceMotion]);

  const fadeUp = (delay = 0) => ({
    hidden: { opacity: 0, transform: shouldReduceMotion ? "none" : "translateY(14px)" },
    visible: {
      opacity: 1,
      transform: "translateY(0px)",
      transition: { duration: shouldReduceMotion ? 0.1 : 0.45, ease: [0.22, 1, 0.36, 1], delay },
    },
  });

  const interns = Array.from({ length: 10 }, (_, i) => ({
    id: i,
    label: `DEV-${String(i + 1).padStart(2, "0")}`,
    role: i % 2 === 0 ? "Frontend / UI" : "Backend / Cloud",
    status: "ACTIVE_NODE",
  }));

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
      aria-label="Slide 04: El Área de Desarrollo de TI"
    >
      {/* ── Blueprint Grid & Scanlines ── */}
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

      {/* ── Barra de acento dorada vertical izquierda ── */}
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
          background: "#D4A017",
          zIndex: 3,
        }}
      />

      {/* ══════════════════════════════════════════════════════════
          COLUMNA IZQUIERDA (48%): Jerarquía Editorial & Telemetría
      ══════════════════════════════════════════════════════════ */}
      <div
        style={{
          flex: "0 0 48%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "2.8rem 3rem 2.8rem 4.8rem",
          position: "relative",
          zIndex: 2,
          gap: "1.15rem",
        }}
      >
        {/* Header editorial */}
        <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
          <motion.div
            variants={fadeUp(0.06)}
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
                color: "#D4A017",
                background: "rgba(212,160,23,0.08)",
                border: "1px solid rgba(212,160,23,0.35)",
                padding: "0.26rem 0.65rem",
              }}
            >
              [ {c.badge} ]
            </span>
            <span
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: "0.65rem",
                letterSpacing: "0.15em",
                color: "rgba(245,241,232,0.4)",
              }}
            >
              SEC_04 // DISTRIBUTED_TEAM
            </span>
          </motion.div>

          {/* Script accent */}
          <motion.p
            variants={fadeUp(0.12)}
            initial="hidden"
            animate={entered ? "visible" : "hidden"}
            style={{
              fontFamily: "Yellowtail, cursive",
              fontSize: "clamp(1.3rem, 2vw, 1.9rem)",
              color: "#e8a0bf",
              lineHeight: 1.1,
              margin: "0.2rem 0 0 0",
            }}
          >
            {c.scriptTag}
          </motion.p>

          {/* Título principal Archivo Black */}
          <motion.h1
            variants={fadeUp(0.18)}
            initial="hidden"
            animate={entered ? "visible" : "hidden"}
            style={{
              fontFamily: "'Archivo Black', 'Arial Black', sans-serif",
              fontSize: "clamp(1.9rem, 3vw, 2.9rem)",
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
            variants={fadeUp(0.24)}
            initial="hidden"
            animate={entered ? "visible" : "hidden"}
            style={{
              fontFamily: "Inter, sans-serif",
              fontSize: "0.85rem",
              color: "rgba(245,241,232,0.65)",
              lineHeight: 1.5,
              maxWidth: "500px",
              margin: 0,
            }}
          >
            {c.lead}
          </motion.p>
        </div>

        {/* Divider dorado que se dibuja con clip-path */}
        <motion.div
          aria-hidden="true"
          initial={{ clipPath: "inset(0 100% 0 0)" }}
          animate={entered ? { clipPath: "inset(0 0% 0 0)" } : { clipPath: "inset(0 100% 0 0)" }}
          transition={{ duration: shouldReduceMotion ? 0.1 : 0.55, ease: [0.83, 0, 0.17, 1], delay: 0.28 }}
          style={{ height: 2, background: "#D4A017", width: "100%", maxWidth: 300 }}
        />

        {/* ── Métrica Clave: Count-Up Animado "10" ── */}
        <motion.div
          variants={fadeUp(0.32)}
          initial="hidden"
          animate={entered ? "visible" : "hidden"}
          style={{
            background: "rgba(245,241,232,0.03)",
            border: "1px solid rgba(245,241,232,0.12)",
            borderLeft: "3px solid #D4A017",
            padding: "1rem 1.4rem",
            display: "flex",
            alignItems: "center",
            gap: "1.5rem",
          }}
        >
          {/* Número gigante count-up */}
          <div style={{ display: "flex", alignItems: "baseline", gap: "0.3rem" }}>
            <span
              style={{
                fontFamily: "'Archivo Black', sans-serif",
                fontSize: "clamp(2.8rem, 4.2vw, 4.5rem)",
                color: "#F5F1E8",
                lineHeight: 0.9,
                letterSpacing: "-0.04em",
              }}
            >
              {String(count).padStart(2, "0")}
            </span>
            <span
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: "1rem",
                color: "#D4A017",
                fontWeight: 700,
              }}
            >
              NODOS
            </span>
          </div>

          {/* Subtítulos de la métrica */}
          <div style={{ display: "flex", flexDirection: "column", gap: "0.2rem" }}>
            <span
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: "0.78rem",
                color: "#F5F1E8",
                fontWeight: 700,
                letterSpacing: "0.05em",
                textTransform: "uppercase",
              }}
            >
              {c.statLabel}
            </span>
            <span
              style={{
                fontFamily: "Inter, sans-serif",
                fontSize: "0.74rem",
                color: "rgba(245,241,232,0.5)",
                lineHeight: 1.4,
              }}
            >
              {c.statSubtext}
            </span>
          </div>
        </motion.div>

        {/* ── SECCIÓN 1: LOS 4 ENCARGADOS / SUPERVISORES DE TI ── */}
        <motion.div
          variants={fadeUp(0.36)}
          initial="hidden"
          animate={entered ? "visible" : "hidden"}
          style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: "0.62rem",
                letterSpacing: "0.15em",
                color: "#D4A017",
                textTransform: "uppercase",
                fontWeight: 700,
              }}
            >
              // 4 ENCARGADOS DE TI (LIDERAZGO & ARQUITECTURA)
            </span>
            <span
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: "0.55rem",
                color: "rgba(245,241,232,0.45)",
              }}
            >
              NÚCLEO CENTRAL EN 3D
            </span>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(4, 1fr)",
              gap: "6px",
            }}
          >
            {[
              { id: 0, title: "Líder Arquitectura", code: "LEAD-01", focus: "AWS & Infraestructura" },
              { id: 1, title: "Líder Backend", code: "LEAD-02", focus: "Node / APIs / DB" },
              { id: 2, title: "Líder Frontend", code: "LEAD-03", focus: "React & Next.js" },
              { id: 3, title: "Líder QA & Ops", code: "LEAD-04", focus: "Git / CI / Staging" },
            ].map((lead) => {
              const isLeadActive = activeSupervisor === lead.id;
              return (
                <button
                  key={lead.id}
                  onClick={() => setActiveSupervisor(isLeadActive ? null : lead.id)}
                  style={{
                    background: isLeadActive ? "rgba(212,160,23,0.18)" : "rgba(245,241,232,0.03)",
                    border: `1px solid ${isLeadActive ? "#D4A017" : "rgba(212,160,23,0.3)"}`,
                    padding: "0.55rem 0.45rem",
                    cursor: "pointer",
                    textAlign: "left",
                    display: "flex",
                    flexDirection: "column",
                    gap: "0.2rem",
                    transition: "all 0.18s ease",
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.58rem", color: "#D4A017", fontWeight: 700 }}>
                      {lead.code}
                    </span>
                    <span
                      style={{
                        width: 5,
                        height: 5,
                        borderRadius: "50%",
                        background: "#D4A017",
                        boxShadow: "0 0 6px #D4A017",
                      }}
                    />
                  </div>
                  <span style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: "0.68rem", color: "#F5F1E8", textTransform: "uppercase" }}>
                    {lead.title}
                  </span>
                  <span style={{ fontFamily: "Inter, sans-serif", fontSize: "0.58rem", color: "rgba(245,241,232,0.55)" }}>
                    {lead.focus}
                  </span>
                </button>
              );
            })}
          </div>
        </motion.div>

        {/* ── SECCIÓN 2: LOS 10 PRACTICANTES DE INGENIERÍA ── */}
        <motion.div
          variants={fadeUp(0.4)}
          initial="hidden"
          animate={entered ? "visible" : "hidden"}
          style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: "0.62rem",
                letterSpacing: "0.15em",
                color: "#6e8e59",
                textTransform: "uppercase",
                fontWeight: 700,
              }}
            >
              // 10 PRACTICANTES REMOTOS (DESARROLLO & TESTING)
            </span>
            <span
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: "0.55rem",
                color: activeNode !== null ? "#d4a017" : "#4a5d3a",
                fontWeight: 700,
              }}
            >
              {activeNode !== null ? `DEV-${String(activeNode + 1).padStart(2, "0")} ENFOCADO` : "● 100% DISPONIBLE"}
            </span>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(5, 1fr)",
              gap: "6px",
            }}
          >
            {interns.map((intern, i) => {
              const isSelected = activeNode === i;
              return (
                <button
                  key={intern.id}
                  onClick={() => setActiveNode(isSelected ? null : i)}
                  onMouseEnter={() => setActiveNode(i)}
                  onMouseLeave={() => setActiveNode(null)}
                  style={{
                    background: isSelected ? "rgba(212,160,23,0.18)" : "rgba(245,241,232,0.03)",
                    border: `1px solid ${isSelected ? "#D4A017" : "rgba(245,241,232,0.1)"}`,
                    padding: "0.45rem 0.35rem",
                    cursor: "pointer",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: "0.2rem",
                    transition: "all 0.15s ease",
                  }}
                >
                  <span
                    style={{
                      fontFamily: "'JetBrains Mono', monospace",
                      fontSize: "0.62rem",
                      fontWeight: 700,
                      color: isSelected ? "#D4A017" : "rgba(245,241,232,0.75)",
                    }}
                  >
                    {intern.label}
                  </span>
                  <div style={{ display: "flex", alignItems: "center", gap: "3px" }}>
                    <span
                      style={{
                        width: 5,
                        height: 5,
                        borderRadius: "50%",
                        background: isSelected ? "#D4A017" : "#6e8e59",
                        boxShadow: isSelected ? "0 0 6px #D4A017" : "none",
                      }}
                    />
                    <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.48rem", color: "rgba(245,241,232,0.4)" }}>
                      {intern.role.split(" ")[0]}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Ficha interactiva de asignación remota */}
          <div
            style={{
              padding: "0.55rem 0.85rem",
              background: "rgba(14,14,14,0.75)",
              border: "1px solid rgba(245,241,232,0.12)",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.58rem", color: "rgba(245,241,232,0.7)" }}>
              {activeNode !== null
                ? `Nodo DEV-${String(activeNode + 1).padStart(2, "0")}: Asignado a [${interns[activeNode].role}] · Modalidad Remota Localhost`
                : "Inspecciona cualquier nodo o líder para visualizar sus enlaces de datos en 3D"}
            </div>
            <span
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: "0.52rem",
                color: "#d4a017",
                background: "rgba(212,160,23,0.12)",
                padding: "0.15rem 0.4rem",
              }}
            >
              METODOLOGÍA: ÁGIL
            </span>
          </div>
        </motion.div>

        {/* ── Badges del Stack Tecnológico Interactivo ── */}
        <motion.div
          variants={fadeUp(0.44)}
          initial="hidden"
          animate={entered ? "visible" : "hidden"}
          style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}
        >
          <span
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: "0.62rem",
              letterSpacing: "0.15em",
              color: "rgba(245,241,232,0.45)",
              textTransform: "uppercase",
            }}
          >
            // STACK DE DESARROLLO ESTÁNDAR
          </span>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "8px" }}>
            {c.stackTechnologies.map((tech, idx) => {
              const isHovered = hoveredTech === idx;
              return (
                <div
                  key={tech.name}
                  onMouseEnter={() => setHoveredTech(idx)}
                  onMouseLeave={() => setHoveredTech(null)}
                  style={{
                    position: "relative",
                    background: isHovered ? "rgba(212,160,23,0.08)" : "rgba(245,241,232,0.02)",
                    border: `1px solid ${isHovered ? "#D4A017" : "rgba(245,241,232,0.1)"}`,
                    padding: "0.55rem 0.5rem",
                    textAlign: "center",
                    cursor: "help",
                    transition: "all 0.15s ease",
                  }}
                >
                  <span
                    style={{
                      fontFamily: "'JetBrains Mono', monospace",
                      fontSize: "0.72rem",
                      fontWeight: 700,
                      color: isHovered ? "#D4A017" : "#F5F1E8",
                      display: "block",
                    }}
                  >
                    {tech.name}
                  </span>

                  {/* Tooltip táctico brutalista al hover */}
                  {isHovered && (
                    <div
                      style={{
                        position: "absolute",
                        bottom: "115%",
                        left: "50%",
                        transform: "translateX(-50%)",
                        background: "#141414",
                        border: "1px solid #D4A017",
                        padding: "0.45rem 0.65rem",
                        width: "160px",
                        zIndex: 30,
                        boxShadow: "0 8px 24px rgba(0,0,0,0.8)",
                        pointerEvents: "none",
                      }}
                    >
                      <span
                        style={{
                          fontFamily: "'JetBrains Mono', monospace",
                          fontSize: "0.6rem",
                          color: "#D4A017",
                          display: "block",
                          marginBottom: "0.15rem",
                        }}
                      >
                        [ FUNCIONALIDAD ]
                      </span>
                      <span
                        style={{
                          fontFamily: "Inter, sans-serif",
                          fontSize: "0.66rem",
                          color: "rgba(245,241,232,0.85)",
                          lineHeight: 1.3,
                          display: "block",
                        }}
                      >
                        {tech.role}
                      </span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </motion.div>
      </div>

      {/* ══════════════════════════════════════════════════════════
          COLUMNA DERECHA (52%): Topología 3D en Tiempo Real
      ══════════════════════════════════════════════════════════ */}
      <div
        style={{
          flex: "0 0 52%",
          position: "relative",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderLeft: "1px solid rgba(245,241,232,0.08)",
          background: "radial-gradient(circle at center, rgba(212,160,23,0.04) 0%, rgba(10,10,10,0.95) 75%)",
          overflow: "hidden",
        }}
      >
        {/* Canvas 3D de Topología (Fluido directo, sin desmontar context) */}
        <TeamTopologyCanvas
          isActive={isActive}
          selectedNode={activeNode}
          selectedSupervisor={activeSupervisor}
        />

        {/* HUD overlay de coordenadas y status técnico */}
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
              color: "#D4A017",
              fontWeight: 700,
            }}
          >
            SYS_TOPOLOGY // 4_LEADS + 10_INTERNS
          </span>
          <span
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: "0.58rem",
              color: "rgba(245,241,232,0.4)",
            }}
          >
            LATENCY: ZERO_LOCAL · PROTOCOL: REMOTE_AGILE
          </span>
        </div>

        {/* Watermark táctico en esquina inferior derecha */}
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            bottom: "2.5rem",
            right: "3rem",
            border: "1px solid rgba(245,241,232,0.12)",
            background: "rgba(10,10,10,0.7)",
            backdropFilter: "blur(6px)",
            padding: "0.5rem 0.8rem",
            display: "flex",
            flexDirection: "column",
            gap: "0.2rem",
            zIndex: 10,
            maxWidth: "240px",
          }}
        >
          <span
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: "0.6rem",
              color: "#D4A017",
              fontWeight: 700,
            }}
          >
            [ ARQUITECTURA DE MANDO ]
          </span>
          <span
            style={{
              fontFamily: "Inter, sans-serif",
              fontSize: "0.68rem",
              color: "rgba(245,241,232,0.6)",
              lineHeight: 1.3,
            }}
          >
            4 Encargados de TI coordinan a 10 practicantes en paralelo. Flujo descentralizado hacia el repositorio.
          </span>
        </div>
      </div>
    </section>
  );
}
