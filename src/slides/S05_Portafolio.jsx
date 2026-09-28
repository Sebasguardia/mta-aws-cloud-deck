// src/slides/S05_Portafolio.jsx
import React, { useEffect, useState, useRef } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { slidesContent } from "../data/content.es.js";
import { useSlideActive } from "../hooks/useSlideActive.js";
import { PortfolioMonolithCanvas } from "../components/three/PortfolioMonolithCanvas.jsx";
import { CanvasTransitionWrapper } from "../components/motion/CanvasTransitionWrapper.jsx";

const c = slidesContent.s05_portafolio;

/**
 * S05 — Portafolio de Proyectos: Carga en Producción y Sistemas Críticos.
 *
 * Arquitectura de layout pantalla completa (100% viewport width/height):
 *  - Estructura `slide-row` idéntica a S03 y S04:
 *    Columna Izquierda (50%): Jerarquía editorial, selector de proyectos, badges y flip 3D.
 *    Columna Derecha (50%): Escenario 3D interactivo a pantalla completa con los monolitos holográficos y HUD de criticidad.
 */
export function S05_Portafolio({ isActive: propActive } = {}) {
  const shouldReduceMotion = useReducedMotion();
  const hookActive = useSlideActive(4);
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
  const [activeProjectIdx, setActiveProjectIdx] = useState(2); // Workspace MTA por defecto
  const [isWorkspaceFlipped, setIsWorkspaceFlipped] = useState(false);

  useEffect(() => {
    if (isActive) {
      const timer = setTimeout(() => setEntered(true), 40);
      return () => clearTimeout(timer);
    } else {
      setEntered(false);
      setIsWorkspaceFlipped(false);
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

  const allProjects = [
    {
      id: "01",
      code: "EXT-01",
      name: c.externalProjects[0].name,
      category: c.externalProjects[0].category,
      desc: c.externalProjects[0].description,
      status: c.externalProjects[0].status,
      accent: "#d4a017",
      glow: "rgba(212,160,23,0.3)",
      isInternal: false,
      tag: "AGENCIA DE GROWTH & CONTENIDO",
    },
    {
      id: "02",
      code: "EXT-02",
      name: c.externalProjects[1].name,
      category: c.externalProjects[1].category,
      desc: c.externalProjects[1].description,
      status: c.externalProjects[1].status,
      accent: "#4a5d3a",
      glow: "rgba(74,93,58,0.3)",
      isInternal: false,
      tag: "CONVERSIÓN WEB & ERP CLIENTE",
    },
    {
      id: "03",
      code: "INT-CORE",
      name: c.internalProject.name,
      category: c.internalProject.category,
      desc: c.internalProject.description,
      status: c.internalProject.status,
      criticalNote: c.internalProject.criticalNote,
      accent: "#c6432b",
      glow: "rgba(198,67,43,0.3)",
      isInternal: true,
      tag: "SISTEMA OPERATIVO CENTRAL MTA",
    },
  ];

  const currentProject = allProjects[activeProjectIdx];

  return (
    <section
      ref={sectionRef}
      data-transition="convex"
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
      aria-label="Slide 05: Portafolio de Proyectos Activos"
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
          COLUMNA IZQUIERDA (46%): Contenido Editorial & Selector
      ══════════════════════════════════════════════════════════ */}
      <div
        style={{
          flex: "0 0 46%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "2.5rem 2.8rem 2.5rem 4.4rem",
          position: "relative",
          zIndex: 2,
          gap: "1.1rem",
        }}
      >
        {/* Encabezado Editorial */}
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
                color: "#D4A017",
                background: "rgba(212,160,23,0.08)",
                border: "1px solid rgba(212,160,23,0.35)",
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
              SEC_05 // WORKLOAD_ANALYSIS
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
              fontSize: "clamp(1.9rem, 2.9vw, 2.8rem)",
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

        {/* Divider dorado que se dibuja con clip-path */}
        <motion.div
          aria-hidden="true"
          initial={{ clipPath: "inset(0 100% 0 0)" }}
          animate={entered ? { clipPath: "inset(0 0% 0 0)" } : { clipPath: "inset(0 100% 0 0)" }}
          transition={{ duration: shouldReduceMotion ? 0.1 : 0.55, ease: [0.83, 0, 0.17, 1], delay: 0.26 }}
          style={{ height: 2, background: "#D4A017", width: "100%", maxWidth: 320 }}
        />

        {/* Selector de los 3 Proyectos (Títulos y estado) */}
        <motion.div
          variants={fadeUp(0.3)}
          initial="hidden"
          animate={entered ? "visible" : "hidden"}
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "8px",
          }}
        >
          {allProjects.map((project, idx) => {
            const isSelected = activeProjectIdx === idx;
            return (
              <button
                key={project.id}
                onClick={() => {
                  setActiveProjectIdx(idx);
                  setIsWorkspaceFlipped(false);
                }}
                style={{
                  background: isSelected ? "rgba(245,241,232,0.06)" : "rgba(245,241,232,0.02)",
                  border: `1px solid ${isSelected ? project.accent : "rgba(245,241,232,0.1)"}`,
                  borderTop: `3px solid ${project.accent}`,
                  padding: "0.65rem 0.75rem",
                  cursor: "pointer",
                  textAlign: "left",
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.3rem",
                  boxShadow: isSelected ? `0 0 20px ${project.glow}` : "none",
                  transition: "all 0.2s cubic-bezier(0.22, 1, 0.36, 1)",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span
                    style={{
                      fontFamily: "'JetBrains Mono', monospace",
                      fontSize: "0.6rem",
                      color: project.accent,
                      fontWeight: 700,
                    }}
                  >
                    [ {project.code} ]
                  </span>
                  <span
                    style={{
                      width: 6,
                      height: 6,
                      borderRadius: "50%",
                      background: project.isInternal ? "#c6432b" : "#4a5d3a",
                    }}
                  />
                </div>
                <span
                  style={{
                    fontFamily: "'Archivo Black', sans-serif",
                    fontSize: "0.78rem",
                    color: "#F5F1E8",
                    lineHeight: 1.1,
                  }}
                >
                  {project.name}
                </span>
              </button>
            );
          })}
        </motion.div>

        {/* ── Tarjeta Detallada Activa (con Soporte para Flip 3D) ── */}
        <motion.div
          variants={fadeUp(0.38)}
          initial="hidden"
          animate={entered ? "visible" : "hidden"}
          style={{ perspective: "1000px", minHeight: "210px" }}
        >
          <div
            style={{
              width: "100%",
              height: "100%",
              position: "relative",
              transformStyle: "preserve-3d",
              transition: "transform 0.6s cubic-bezier(0.22, 1, 0.36, 1)",
              transform: currentProject.isInternal && isWorkspaceFlipped ? "rotateY(180deg)" : "none",
            }}
          >
            {/* CARA FRONTAL DEL PROYECTO ACTIVO */}
            <div
              style={{
                background: "rgba(245,241,232,0.03)",
                border: `1px solid ${currentProject.accent}`,
                borderLeft: `4px solid ${currentProject.accent}`,
                padding: "1.4rem 1.6rem",
                display: "flex",
                flexDirection: "column",
                gap: "0.8rem",
                backfaceVisibility: "hidden",
                position: "relative",
                overflow: "hidden",
              }}
            >
              {/* Watermark táctico outline */}
              <span
                aria-hidden="true"
                style={{
                  position: "absolute",
                  right: "-0.5rem",
                  bottom: "-1.5rem",
                  fontFamily: "'Archivo Black', sans-serif",
                  fontSize: "6.5rem",
                  color: "transparent",
                  WebkitTextStroke: "1px rgba(245,241,232,0.06)",
                  lineHeight: 1,
                  pointerEvents: "none",
                  userSelect: "none",
                }}
              >
                {currentProject.id}
              </span>

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", zIndex: 1 }}>
                <span
                  style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: "0.68rem",
                    color: "rgba(245,241,232,0.5)",
                    textTransform: "uppercase",
                  }}
                >
                  {currentProject.category} // {currentProject.tag}
                </span>

                {/* Dot pulsante animado */}
                <div style={{ display: "flex", alignItems: "center", gap: "0.45rem" }}>
                  <motion.span
                    animate={
                      currentProject.isInternal
                        ? { scale: [1, 1.35, 1], opacity: [0.7, 1, 0.7] }
                        : { opacity: [0.8, 1, 0.8] }
                    }
                    transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                    style={{
                      width: 8,
                      height: 8,
                      borderRadius: "50%",
                      background: currentProject.isInternal ? "#c6432b" : "#4a5d3a",
                      boxShadow: `0 0 10px ${currentProject.isInternal ? "#c6432b" : "#4a5d3a"}`,
                    }}
                  />
                  <span
                    style={{
                      fontFamily: "'JetBrains Mono', monospace",
                      fontSize: "0.65rem",
                      color: "rgba(245,241,232,0.85)",
                      fontWeight: 700,
                    }}
                  >
                    {currentProject.status}
                  </span>
                </div>
              </div>

              <h2
                style={{
                  fontFamily: "'Archivo Black', sans-serif",
                  fontSize: "1.6rem",
                  color: "#F5F1E8",
                  margin: 0,
                  letterSpacing: "-0.02em",
                  zIndex: 1,
                }}
              >
                {currentProject.name}
              </h2>

              <p
                style={{
                  fontFamily: "Inter, sans-serif",
                  fontSize: "0.85rem",
                  color: "rgba(245,241,232,0.75)",
                  lineHeight: 1.5,
                  margin: 0,
                  zIndex: 1,
                }}
              >
                {currentProject.desc}
              </p>

              {/* Botón Flip para Workspace MTA o nota de producción */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  paddingTop: "0.6rem",
                  borderTop: "1px solid rgba(245,241,232,0.08)",
                  zIndex: 1,
                }}
              >
                {currentProject.isInternal ? (
                  <button
                    onClick={() => setIsWorkspaceFlipped(true)}
                    style={{
                      background: "rgba(198,67,43,0.2)",
                      border: "1px solid #c6432b",
                      color: "#F5F1E8",
                      fontFamily: "'JetBrains Mono', monospace",
                      fontSize: "0.68rem",
                      fontWeight: 700,
                      padding: "0.45rem 0.85rem",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: "0.5rem",
                      transition: "all 0.2s ease",
                    }}
                  >
                    <span>FLIP 3D // REVELAR IMPACTO OPERATIVO</span>
                    <span style={{ color: "#c6432b" }}>↻</span>
                  </button>
                ) : (
                  <span
                    style={{
                      fontFamily: "'JetBrains Mono', monospace",
                      fontSize: "0.65rem",
                      color: "rgba(245,241,232,0.45)",
                    }}
                  >
                    CARGA DE USUARIOS EXTERNA EN PRODUCCIÓN
                  </span>
                )}

                <span
                  style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: "0.65rem",
                    color: currentProject.accent,
                    fontWeight: 700,
                  }}
                >
                  [ MONOLITO 3D VINCULADO ]
                </span>
              </div>
            </div>

            {/* REVERSO (Flip 3D para Workspace MTA) */}
            {currentProject.isInternal && (
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background: "#160e0e",
                  border: "1px solid #c6432b",
                  borderLeft: "4px solid #c6432b",
                  padding: "1.4rem 1.6rem",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  backfaceVisibility: "hidden",
                  transform: "rotateY(180deg)",
                  boxShadow: "0 0 35px rgba(198,67,43,0.4)",
                  zIndex: 10,
                }}
              >
                <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span
                      style={{
                        fontFamily: "'JetBrains Mono', monospace",
                        fontSize: "0.65rem",
                        color: "#c6432b",
                        fontWeight: 700,
                      }}
                    >
                      [ ANÁLISIS DE IMPACTO CRÍTICO ]
                    </span>
                    <button
                      onClick={() => setIsWorkspaceFlipped(false)}
                      style={{
                        background: "transparent",
                        border: "none",
                        color: "#F5F1E8",
                        cursor: "pointer",
                        fontFamily: "'JetBrains Mono', monospace",
                        fontSize: "0.9rem",
                      }}
                    >
                      ✕
                    </button>
                  </div>

                  <h3
                    style={{
                      fontFamily: "'Archivo Black', sans-serif",
                      fontSize: "1.2rem",
                      color: "#F5F1E8",
                      margin: 0,
                    }}
                  >
                    RIESGO DE PARÁLISIS OPERATIVA
                  </h3>

                  <div
                    style={{
                      background: "rgba(198,67,43,0.15)",
                      borderLeft: "3px solid #c6432b",
                      padding: "0.65rem 0.8rem",
                    }}
                  >
                    <p
                      style={{
                        fontFamily: "Inter, sans-serif",
                        fontSize: "0.78rem",
                        color: "rgba(245,241,232,0.95)",
                        lineHeight: 1.4,
                        margin: 0,
                      }}
                    >
                      {currentProject.criticalNote}
                    </p>
                  </div>

                  <div style={{ display: "flex", flexDirection: "column", gap: "0.2rem" }}>
                    <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.65rem", color: "#D4A017" }}>
                      • Registro de Asistencia y Turnos Diarios
                    </span>
                    <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.65rem", color: "#D4A017" }}>
                      • Evaluación de los 10 Practicantes
                    </span>
                    <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.65rem", color: "#D4A017" }}>
                      • Dashboard de Métricas y Proyectos en Tiempo Real
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => setIsWorkspaceFlipped(false)}
                  style={{
                    background: "#c6432b",
                    border: "none",
                    color: "#F5F1E8",
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: "0.68rem",
                    fontWeight: 700,
                    padding: "0.5rem",
                    cursor: "pointer",
                    textAlign: "center",
                  }}
                >
                  ← VOLVER AL POSTER
                </button>
              </div>
            )}
          </div>
        </motion.div>

        {/* HUD Inferior de Diagnóstico */}
        <motion.div
          variants={fadeUp(0.44)}
          initial="hidden"
          animate={entered ? "visible" : "hidden"}
          style={{
            border: "1px solid rgba(245,241,232,0.1)",
            background: "rgba(245,241,232,0.02)",
            padding: "0.75rem 1.2rem",
            display: "flex",
            flexDirection: "column",
            gap: "0.3rem",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
            <span
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: "0.62rem",
                letterSpacing: "0.15em",
                color: "#D4A017",
                fontWeight: 700,
              }}
            >
              // DIAGNÓSTICO DE ARQUITECTURA:
            </span>
            <span
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: "0.62rem",
                color: "#c6432b",
                fontWeight: 700,
              }}
            >
              ● PUNTO ÚNICO DE VULNERABILIDAD
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
            Los 3 sistemas (2 comerciales externos y 1 ERP interno crítico) conviven actualmente en un único hosting compartido sin segmentación ni failover.
          </p>
        </motion.div>
      </div>

      {/* ══════════════════════════════════════════════════════════
          COLUMNA DERECHA (54%): Escenario 3D Pantalla Completa
      ══════════════════════════════════════════════════════════ */}
      <div
        style={{
          flex: "0 0 54%",
          position: "relative",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderLeft: "1px solid rgba(245,241,232,0.08)",
          background: "radial-gradient(circle at center, rgba(212,160,23,0.04) 0%, rgba(10,10,10,0.95) 75%)",
          overflow: "hidden",
        }}
      >
        {/* Canvas 3D de Monolitos con Texturas Reales, Beacon de Riesgo y selección directa */}
        <PortfolioMonolithCanvas
          isActive={isActive}
          activeIndex={activeProjectIdx}
          onSelectProject={(id) => {
            setActiveProjectIdx(id);
            setIsWorkspaceFlipped(false);
          }}
        />

        {/* HUD overlay superior derecho */}
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
            SYS_MONOLITHS // 3_ACTIVE_TARGETS
          </span>
          <span
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: "0.58rem",
              color: "rgba(245,241,232,0.4)",
            }}
          >
            SHARED_HOSTING: HOSTINGER_BUSINESS · FAILOVER: NONE
          </span>
        </div>

        {/* HUD overlay inferior derecho con detalle del monolito enfocado */}
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            bottom: "2.5rem",
            right: "3rem",
            border: `1px solid ${currentProject.accent}`,
            background: "rgba(10,10,10,0.75)",
            backdropFilter: "blur(8px)",
            padding: "0.6rem 1rem",
            display: "flex",
            flexDirection: "column",
            gap: "0.2rem",
            zIndex: 10,
            maxWidth: "280px",
          }}
        >
          <span
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: "0.6rem",
              color: currentProject.accent,
              fontWeight: 700,
            }}
          >
            [ NÚCLEO EN VIVO: {currentProject.name.toUpperCase()} ]
          </span>
          <span
            style={{
              fontFamily: "Inter, sans-serif",
              fontSize: "0.68rem",
              color: "rgba(245,241,232,0.7)",
              lineHeight: 1.3,
            }}
          >
            {currentProject.isInternal
              ? "Reactor de procesos internos de MTA. Tráfico continuo de 10 nodos de desarrollo."
              : "Plataforma de cara a cliente externo bajo demanda variable y picos de tráfico."}
          </span>
        </div>
      </div>
    </section>
  );
}
