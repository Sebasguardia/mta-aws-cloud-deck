// src/slides/S03_Empresa.jsx
import React, { useEffect, useState, useRef } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { slidesContent } from "../data/content.es.js";
import { useSlideActive } from "../hooks/useSlideActive.js";
import { HybridCoreCanvas } from "../components/three/HybridCoreCanvas.jsx";
import { CanvasTransitionWrapper } from "../components/motion/CanvasTransitionWrapper.jsx";

const c = slidesContent.s03_empresa;

/**
 * S03 — La Empresa: Multiservicios Tecnoindustrial Acosta S.A.C.
 *
 * Directivas de diseño:
 *  - /industrial-brutalist-ui: Modular bimodal grid, micro-telemetría monospace, contrastes nítidos, 0px border-radius, framing táctico con brackets y separadores matemáticos.
 *  - /impeccable: Tipografía curada (Archivo Black, Yellowtail, JetBrains Mono, Inter), proporciones visuales de nivel editorial, layout asimétrico equilibrado.
 *  - /threejs-geometry + /threejs-animation + /threejs-interaction:
 *    Componente Three.js interactivo que modela la dualidad Híbrida (Metalmecánica + Software Cloud).
 *  - /emil-design-eng + /animate: Staggers deliberados con cubic-bezier(0.22, 1, 0.36, 1), soporte para prefers-reduced-motion, micro-interacciones en badges y métricas.
 */
export function S03_Empresa({ isActive: propActive } = {}) {
  const shouldReduceMotion = useReducedMotion();
  const hookActive = useSlideActive(2);
  const sectionRef = useRef(null);
  const [domActive, setDomActive] = useState(false);

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
  const [entered, setEntered] = useState(true);
  const [selectedPillar, setSelectedPillar] = useState(0);

  useEffect(() => {
    if (isActive) {
      setEntered(true);
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

  const pillars = [
    {
      id: "00",
      code: "HYB-00",
      name: "Modelo Híbrido",
      tag: "SINERGIA TOTAL",
      color: "#e8a0bf",
      summary: "Integración estratégica: la tracción industrial tradicional financia y potencia la división tecnológica.",
      stat: "Dualidad Global",
      sub: "Hardware + Cloud",
    },
    {
      id: "01",
      code: "MET-01",
      name: "División Mecánica",
      tag: "HARDWARE & PLANTA",
      color: "#6e8e59",
      summary: "Servicios tecnoindustriales, matricería, torneado, soldadura y manufactura mecánica especializada.",
      stat: "Sector Físico",
      sub: "Operaciones en Taller",
    },
    {
      id: "02",
      code: "B2B-TI",
      name: "División Software",
      tag: "SAAS & MODELO B2B",
      color: "#d4a017",
      summary: "Plataformas web a medida, ERP Workspace MTA, Strato Studio y VIISION con arquitectura AWS.",
      stat: "Soluciones Digitales",
      sub: "10 Devs + 4 Líderes",
    },
  ];

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
      aria-label="Slide 03: Naturaleza y Sector de la Empresa"
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
          background: "repeating-linear-gradient(0deg,transparent,transparent 3px,rgba(0,0,0,0.07) 3px,rgba(0,0,0,0.07) 6px)",
          pointerEvents: "none",
          zIndex: 1,
        }}
      />

      {/* ── Borde vertical izquierdo Olive (Bloque 01) ── */}
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
          background: "#4A5D3A",
          zIndex: 4,
        }}
      />

      {/* ════════════════════════════════════════════════════════════
          COLUMNA IZQUIERDA: Contexto Editorial & Pilares (58%)
          ════════════════════════════════════════════════════════════ */}
      <div
        style={{
          flex: "0 0 58%",
          maxWidth: "58%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "3.2rem 3.5rem 3rem 4.5rem",
          position: "relative",
          zIndex: 2,
          borderRight: "1px solid rgba(245,241,232,0.1)",
        }}
      >
        {/* Header de Telemetría */}
        <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
            <motion.span
              variants={fadeUp(0.04)}
              initial="hidden"
              animate={entered ? "visible" : "hidden"}
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: "0.65rem",
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                fontWeight: 700,
                color: "#4A5D3A",
                background: "rgba(74,93,58,0.12)",
                border: "1px solid rgba(74,93,58,0.4)",
                padding: "0.24rem 0.65rem",
              }}
            >
              [ {c.badge} ]
            </motion.span>

            <span
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: "0.62rem",
                letterSpacing: "0.15em",
                color: "rgba(245,241,232,0.4)",
              }}
            >
              SECTOR // TECNOINDUSTRIAL & SAAS
            </span>
          </div>

          <motion.p
            variants={fadeUp(0.1)}
            initial="hidden"
            animate={entered ? "visible" : "hidden"}
            style={{
              fontFamily: "Yellowtail, cursive",
              fontSize: "clamp(1.2rem, 1.8vw, 1.7rem)",
              color: "#e8a0bf",
              lineHeight: 1.1,
              marginTop: "0.15rem",
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
              fontSize: "clamp(1.9rem, 2.8vw, 2.9rem)",
              color: "#F5F1E8",
              letterSpacing: "-0.03em",
              textTransform: "uppercase",
              lineHeight: 1.05,
              fontWeight: 400,
              maxWidth: "680px",
            }}
          >
            {c.commercialName}
          </motion.h1>

          <motion.p
            variants={fadeUp(0.22)}
            initial="hidden"
            animate={entered ? "visible" : "hidden"}
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: "0.75rem",
              color: "rgba(245,241,232,0.55)",
              letterSpacing: "0.08em",
              textTransform: "uppercase",
            }}
          >
            RAZÓN SOCIAL: {c.title}
          </motion.p>
        </div>

        {/* Lead & Cuerpo analítico */}
        <div style={{ display: "flex", flexDirection: "column", gap: "0.85rem", margin: "1.2rem 0" }}>
          <motion.p
            variants={fadeUp(0.28)}
            initial="hidden"
            animate={entered ? "visible" : "hidden"}
            style={{
              fontFamily: "Inter, sans-serif",
              fontSize: "1.02rem",
              fontWeight: 600,
              color: "#F5F1E8",
              lineHeight: 1.45,
              maxWidth: "620px",
            }}
          >
            {c.leadText}
          </motion.p>

          <motion.p
            variants={fadeUp(0.34)}
            initial="hidden"
            animate={entered ? "visible" : "hidden"}
            style={{
              fontFamily: "Inter, sans-serif",
              fontSize: "0.86rem",
              color: "rgba(245,241,232,0.65)",
              lineHeight: 1.65,
              maxWidth: "620px",
            }}
          >
            {c.body}
          </motion.p>
        </div>

        {/* ── Bimodal Dual Switch / Pilares interactivos con 3 Modos ── */}
        <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <span
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: "0.62rem",
                color: "#D4A017",
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                fontWeight: 700,
              }}
            >
              // DUALIDAD ESTRUCTURAL DEL NEGOCIO
            </span>
            <span
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: "0.6rem",
                color: "rgba(245,241,232,0.45)",
              }}
            >
              SELECCIONA O TOCA EL 3D PARA INSPECCIONAR
            </span>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr 1fr",
              gap: "1px",
              background: "rgba(245,241,232,0.1)",
            }}
          >
            {pillars.map((pillar, idx) => {
              const isSelected = selectedPillar === idx;
              return (
                <button
                  key={pillar.id}
                  onClick={() => setSelectedPillar(idx)}
                  style={{
                    background: isSelected ? "rgba(245,241,232,0.08)" : "#0c0c0c",
                    border: "none",
                    borderTop: `3px solid ${isSelected ? pillar.color : "transparent"}`,
                    padding: "0.9rem 1rem",
                    cursor: "pointer",
                    textAlign: "left",
                    display: "flex",
                    flexDirection: "column",
                    gap: "0.35rem",
                    position: "relative",
                    transition: "all 0.18s ease",
                  }}
                  aria-pressed={isSelected}
                >
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <span
                      style={{
                        fontFamily: "'JetBrains Mono', monospace",
                        fontSize: "0.62rem",
                        fontWeight: 700,
                        color: pillar.color,
                      }}
                    >
                      {pillar.code}
                    </span>
                    <span
                      style={{
                        fontFamily: "'JetBrains Mono', monospace",
                        fontSize: "0.52rem",
                        color: isSelected ? "#F5F1E8" : "rgba(245,241,232,0.4)",
                        letterSpacing: "0.06em",
                      }}
                    >
                      {pillar.tag}
                    </span>
                  </div>

                  <span
                    style={{
                      fontFamily: "'Archivo Black', sans-serif",
                      fontSize: "0.82rem",
                      color: "#F5F1E8",
                      textTransform: "uppercase",
                      letterSpacing: "-0.01em",
                      lineHeight: 1.15,
                    }}
                  >
                    {pillar.name}
                  </span>

                  <p
                    style={{
                      fontFamily: "Inter, sans-serif",
                      fontSize: "0.68rem",
                      color: "rgba(245,241,232,0.65)",
                      lineHeight: 1.35,
                      margin: 0,
                    }}
                  >
                    {pillar.summary}
                  </p>
                </button>
              );
            })}
          </div>

          {/* Ficha técnica detallada del pilar seleccionado */}
          <div
            style={{
              padding: "0.75rem 1rem",
              background: "rgba(14,14,14,0.8)",
              border: `1px solid ${selectedPillar === 1 ? "#4A5D3A" : selectedPillar === 2 ? "#D4A017" : "rgba(245,241,232,0.15)"}`,
              borderLeft: `4px solid ${selectedPillar === 1 ? "#6e8e59" : selectedPillar === 2 ? "#D4A017" : "#e8a0bf"}`,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginTop: "0.2rem",
            }}
          >
            <div>
              <div style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: "0.75rem", color: "#F5F1E8" }}>
                {selectedPillar === 0
                  ? "SISTEMA INTEGRADO: HARDWARE & SOFTWARE"
                  : selectedPillar === 1
                  ? "OPERACIONES MECÁNICAS DE PLANTA"
                  : "ARQUITECTURA DE SOFTWARE & SAAS B2B"}
              </div>
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.58rem", color: "rgba(245,241,232,0.65)", marginTop: "0.15rem" }}>
                {selectedPillar === 0
                  ? "Coexistencia estratégica que financia y potencia la división de ingeniería tecnológica."
                  : selectedPillar === 1
                  ? "Matricería industrial, torneado, soldadura y manufactura metalmecánica de precisión."
                  : "Desarrollo de Workspace MTA (ERP interno), Strato Studio y VIISION para clientes externos."}
              </div>
            </div>

            <span
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: "0.58rem",
                fontWeight: 700,
                color: selectedPillar === 1 ? "#6e8e59" : selectedPillar === 2 ? "#d4a017" : "#e8a0bf",
                background: "rgba(0,0,0,0.5)",
                border: "1px solid currentColor",
                padding: "0.25rem 0.5rem",
              }}
            >
              MODO_3D: {selectedPillar === 0 ? "HÍBRIDO" : selectedPillar === 1 ? "MECÁNICA" : "CLOUD_TI"}
            </span>
          </div>
        </div>

        {/* Footer Monospace */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderTop: "1px solid rgba(245,241,232,0.08)",
            paddingTop: "0.9rem",
            marginTop: "0.6rem",
          }}
        >
          <span
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: "0.62rem",
              color: "rgba(245,241,232,0.4)",
              letterSpacing: "0.12em",
            }}
          >
            MTA // DOCS REF: SEC-01-ESTRUC
          </span>
          <span
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: "0.62rem",
              color: "#D4A017",
              letterSpacing: "0.12em",
            }}
          >
            SLIDE 03 · LA EMPRESA
          </span>
        </div>
      </div>

      {/* ════════════════════════════════════════════════════════════
          COLUMNA DERECHA: Visualizador 3D & Telemetría Técnica (42%)
          ════════════════════════════════════════════════════════════ */}
      <div
        style={{
          flex: "0 0 42%",
          maxWidth: "42%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "3.2rem 3.5rem 3rem 3rem",
          position: "relative",
          zIndex: 2,
          background: "rgba(10,10,10,0.7)",
        }}
      >
        {/* Encabezado del visor 3D */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <span
              style={{
                display: "inline-block",
                width: 7,
                height: 7,
                borderRadius: "50%",
                background: selectedPillar === 1 ? "#6e8e59" : selectedPillar === 2 ? "#d4a017" : "#7A9B5C",
                boxShadow: "0 0 8px currentColor",
              }}
            />
            <span
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: "0.65rem",
                color: "#F5F1E8",
                letterSpacing: "0.12em",
                fontWeight: 700,
              }}
            >
              {selectedPillar === 0
                ? "HYBRID-CORE // 3D COMPLETE MODEL"
                : selectedPillar === 1
                ? "HARDWARE-CORE // DIVISIÓN MECÁNICA"
                : "SOFTWARE-CORE // DIVISIÓN CLOUD B2B"}
            </span>
          </div>

          <span
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: "0.6rem",
              color: "#D4A017",
              letterSpacing: "0.1em",
            }}
          >
            CLIC PARA ALTERNAR
          </span>
        </div>

        {/* Contenedor Canvas 3D */}
        <div
          style={{
            flex: 1,
            position: "relative",
            minHeight: "320px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            border: "1px solid rgba(245,241,232,0.07)",
            background: "radial-gradient(circle at center, rgba(74,93,58,0.12) 0%, transparent 70%)",
            margin: "1.2rem 0",
          }}
        >
          {/* Marcadores tácticos de esquina */}
          <span style={{ position: "absolute", top: 6, left: 8, fontFamily: "monospace", fontSize: "0.7rem", color: "rgba(245,241,232,0.3)" }}>+</span>
          <span style={{ position: "absolute", top: 6, right: 8, fontFamily: "monospace", fontSize: "0.7rem", color: "rgba(245,241,232,0.3)" }}>+</span>
          <span style={{ position: "absolute", bottom: 6, left: 8, fontFamily: "monospace", fontSize: "0.7rem", color: "rgba(245,241,232,0.3)" }}>+</span>
          <span style={{ position: "absolute", bottom: 6, right: 8, fontFamily: "monospace", fontSize: "0.7rem", color: "rgba(245,241,232,0.3)" }}>+</span>

          {/* Badge flotante con el estado del modelo */}
          <div
            style={{
              position: "absolute",
              top: 12,
              left: 14,
              zIndex: 10,
              pointerEvents: "none",
              background: "rgba(10,10,10,0.85)",
              border: "1px solid rgba(245,241,232,0.15)",
              padding: "0.3rem 0.6rem",
              backdropFilter: "blur(4px)",
            }}
          >
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.55rem", color: "#d4a017", fontWeight: 700 }}>
              ESTRUCTURA: {selectedPillar === 0 ? "COEXISTENCIA DUAL" : selectedPillar === 1 ? "MATRICERÍA Y HARDWARE" : "SAAS & RED AWS CLOUD"}
            </div>
          </div>

          {/* Three.js canvas (Directo, reactivo, fluido a 60 FPS sin recargas) */}
          <HybridCoreCanvas
            isActive={isActive}
            activeMode={selectedPillar}
            onSelectMode={(mode) => setSelectedPillar(mode)}
          />
        </div>

        {/* ── Highlights en Bento Box inferior ── */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "1px",
            background: "rgba(245,241,232,0.1)",
          }}
        >
          {c.highlights.map((h, i) => (
            <motion.div
              key={h.label}
              variants={fadeUp(0.4 + i * 0.08)}
              initial="hidden"
              animate={entered ? "visible" : "hidden"}
              style={{
                background: "#0d0d0d",
                padding: "0.85rem 0.9rem",
                display: "flex",
                flexDirection: "column",
                gap: "0.25rem",
              }}
            >
              <span
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: "0.58rem",
                  color: "#D4A017",
                  textTransform: "uppercase",
                  letterSpacing: "0.1em",
                }}
              >
                {h.label}
              </span>
              <span
                style={{
                  fontFamily: "Inter, sans-serif",
                  fontSize: "0.72rem",
                  fontWeight: 600,
                  color: "#F5F1E8",
                  lineHeight: 1.3,
                }}
              >
                {h.val}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
