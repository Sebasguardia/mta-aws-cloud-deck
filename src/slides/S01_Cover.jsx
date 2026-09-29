// src/slides/S01_Cover.jsx
import React, { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { slidesContent } from "../data/content.es.js";
import { projectMeta } from "../data/team.js";
import { useSlideActive } from "../hooks/useSlideActive.js";

const c = slidesContent.s01_cover;

/**
 * S01 — Portada / Cover Slide — Rediseño "Neo-Brutalist Industrial Print".
 *
 * Letras agrandadas y sin exceso de negrita para máxima legibilidad.
 */
export function S01_Cover({ isActive: propActive } = {}) {
  const shouldReduceMotion = useReducedMotion();
  const hookActive = useSlideActive(0);
  const sectionRef = React.useRef(null);
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
  const [entered, setEntered] = useState(false);

  useEffect(() => {
    if (isActive) {
      const timer = setTimeout(() => setEntered(true), 40);
      return () => clearTimeout(timer);
    } else {
      setEntered(false);
    }
  }, [isActive]);

  const fadeUp = (delay = 0) => ({
    hidden: {
      opacity: 0,
      transform: shouldReduceMotion ? "none" : "translateY(10px)",
    },
    visible: {
      opacity: 1,
      transform: "translateY(0px)",
      transition: {
        duration: shouldReduceMotion ? 0.12 : 0.52,
        ease: [0.22, 1, 0.36, 1],
        delay,
      },
    },
  });

  const panels = [
    { label: "CURSO", value: projectMeta.course, sub: "SENATI · Formación Profesional" },
    { label: "INSTRUCTOR", value: projectMeta.instructor.name, sub: projectMeta.instructor.role },
    { label: "CASO DE ESTUDIO", value: "MTA Software", sub: "Multiservicios Tecnoindustrial Acosta S.A.C. (Área TI: 4 Encargados + 10 Practicantes)" },
  ];

  return (
    <section
      ref={sectionRef}
      data-transition="zoom"
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
      aria-label="Portada: Diagnóstico de la Empresa y Fundamentos Cloud"
    >
      {/* ── Blueprint grid tenue ── */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "linear-gradient(rgba(245,241,232,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(245,241,232,0.05) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />

      {/* ── Acento dorado vertical izquierdo ── */}
      <motion.div
        initial={{ transform: "scaleY(0)", transformOrigin: "top" }}
        animate={entered ? { transform: "scaleY(1)" } : { transform: "scaleY(0)" }}
        transition={{ duration: shouldReduceMotion ? 0.1 : 0.7, ease: [0.83, 0, 0.17, 1], delay: 0.1 }}
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          bottom: 0,
          width: 5,
          background: "#D4A017",
          zIndex: 2,
        }}
        aria-hidden="true"
      />

      {/* ══════════════════════════════════════════
          COLUMNA IZQUIERDA — Jerarquía tipográfica
      ══════════════════════════════════════════ */}
      <div
        style={{
          flex: "0 0 57%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "2.5rem 2.5rem 2.5rem 4.5rem",
          position: "relative",
          zIndex: 1,
        }}
      >
        {/* Badge superior */}
        <motion.div
          variants={fadeUp(0.05)}
          initial="hidden"
          animate={entered ? "visible" : "hidden"}
          style={{ marginBottom: "0.85rem" }}
        >
          <span
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: "0.82rem",
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              fontWeight: 600,
              color: "#D4A017",
              background: "rgba(212,160,23,0.12)",
              border: "1px solid rgba(212,160,23,0.45)",
              padding: "0.45rem 1rem",
              display: "inline-block",
              borderRadius: "2px",
            }}
          >
            {c.badge}
          </span>
        </motion.div>

        {/* Script tagline — acento emocional */}
        <motion.p
          variants={fadeUp(0.14)}
          initial="hidden"
          animate={entered ? "visible" : "hidden"}
          style={{
            fontFamily: "Yellowtail, cursive",
            fontSize: "clamp(1.7rem, 2.8vw, 2.6rem)",
            color: "#e8a0bf",
            lineHeight: 1.15,
            marginBottom: "0.45rem",
            opacity: 0.95,
            fontWeight: 400,
          }}
        >
          {c.scriptTag}
        </motion.p>

        {/* Título Display grande pero sin peso pesado */}
        <motion.h1
          variants={fadeUp(0.24)}
          initial="hidden"
          animate={entered ? "visible" : "hidden"}
          style={{
            fontFamily: "'Archivo Black', 'Arial Black', sans-serif",
            fontSize: "clamp(2rem, 3.6vw, 3.4rem)",
            color: "#F5F1E8",
            letterSpacing: "-0.02em",
            lineHeight: 1.08,
            textTransform: "uppercase",
            marginBottom: "1.1rem",
            maxWidth: "720px",
            fontWeight: 400,
          }}
        >
          {c.title}
        </motion.h1>

        {/* Wipe dorado */}
        <motion.div
          initial={{ clipPath: "inset(0 100% 0 0)" }}
          animate={entered ? { clipPath: "inset(0 0% 0 0)" } : { clipPath: "inset(0 100% 0 0)" }}
          transition={{
            duration: shouldReduceMotion ? 0.12 : 0.6,
            ease: [0.83, 0, 0.17, 1],
            delay: 0.36,
          }}
          style={{
            height: 3,
            width: "100%",
            maxWidth: 520,
            background: "#D4A017",
            marginBottom: "1.1rem",
          }}
          aria-hidden="true"
        />

        {/* Lead */}
        <motion.p
          variants={fadeUp(0.42)}
          initial="hidden"
          animate={entered ? "visible" : "hidden"}
          style={{
            fontFamily: "Inter, sans-serif",
            fontSize: "clamp(1rem, 1.25vw, 1.25rem)",
            color: "rgba(245,241,232,0.85)",
            lineHeight: 1.55,
            maxWidth: "580px",
            marginBottom: "0.8rem",
            fontWeight: 400,
          }}
        >
          {c.lead}
        </motion.p>

        {/* Empresa */}
        <motion.p
          variants={fadeUp(0.48)}
          initial="hidden"
          animate={entered ? "visible" : "hidden"}
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: "0.82rem",
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            color: "rgba(212,160,23,0.85)",
            marginBottom: "1.6rem",
            fontWeight: 500,
          }}
        >
          {c.companyTag} · {c.academicNotice}
        </motion.p>

        {/* Chips */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.6rem" }}>
          {["SENATI", "AWS CLOUD", "5 INTEGRANTES", "CASO MTA SOFTWARE"].map((chip, i) => (
            <motion.span
              key={chip}
              initial={{ opacity: 0, transform: "translateY(6px)" }}
              animate={
                entered
                  ? {
                      opacity: 1,
                      transform: "translateY(0px)",
                      transition: {
                        type: shouldReduceMotion ? "tween" : "spring",
                        stiffness: 260,
                        damping: 22,
                        delay: 0.6 + i * 0.06,
                      },
                    }
                  : { opacity: 0 }
              }
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: "0.78rem",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                fontWeight: 500,
                padding: "0.4rem 0.9rem",
                border: `1.5px solid ${i < 2 ? "#D4A017" : "rgba(245,241,232,0.3)"}`,
                color: i < 2 ? "#D4A017" : "rgba(245,241,232,0.7)",
                background: i < 2 ? "rgba(212,160,23,0.08)" : "rgba(245,241,232,0.04)",
                cursor: "default",
                borderRadius: "2px",
              }}
            >
              {chip}
            </motion.span>
          ))}
        </div>
      </div>

      {/* ══════════════════════════════════════
          COLUMNA DERECHA — Panel de datos técnico
      ══════════════════════════════════════ */}
      <motion.div
        variants={fadeUp(0.18)}
        initial="hidden"
        animate={entered ? "visible" : "hidden"}
        style={{
          flex: "0 0 43%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          borderLeft: "2px solid rgba(212,160,23,0.25)",
          background: "rgba(212,160,23,0.03)",
          padding: "2.4rem 2.4rem",
          position: "relative",
          zIndex: 1,
          gap: "0",
        }}
      >
        {/* Número de sección — watermark interno */}
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            bottom: "1rem",
            right: "1.5rem",
            fontFamily: "'Archivo Black', sans-serif",
            fontSize: "clamp(6rem, 12vw, 14rem)",
            color: "rgba(245,241,232,0.035)",
            letterSpacing: "-0.05em",
            lineHeight: 1,
            userSelect: "none",
            pointerEvents: "none",
            fontWeight: 400,
          }}
        >
          01
        </div>

        {/* Label de sección */}
        <div
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: "0.82rem",
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            fontWeight: 500,
            color: "rgba(212,160,23,0.85)",
            marginBottom: "1.1rem",
            display: "flex",
            alignItems: "center",
            gap: "0.6rem",
          }}
        >
          <span
            style={{
              display: "inline-block",
              width: 7,
              height: 7,
              borderRadius: "50%",
              background: "#D4A017",
            }}
          />
          FICHA TÉCNICA DE LA INVESTIGACIÓN
        </div>

        {/* Grid de datos de la investigación */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "0",
            border: "1px solid rgba(212,160,23,0.25)",
          }}
        >
          {panels.map((item, i) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0 }}
              animate={
                entered
                  ? {
                      opacity: 1,
                      transition: { duration: 0.35, delay: 0.45 + i * 0.08 },
                    }
                  : { opacity: 0 }
              }
              style={{
                padding: "0.75rem 1.1rem",
                borderBottom: "1px solid rgba(212,160,23,0.15)",
                background: i % 2 === 0 ? "rgba(245,241,232,0.02)" : "transparent",
              }}
            >
              <p
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: "0.78rem",
                  letterSpacing: "0.15em",
                  textTransform: "uppercase",
                  fontWeight: 500,
                  color: "rgba(212,160,23,0.85)",
                  margin: "0 0 0.2rem 0",
                }}
              >
                {item.label}
              </p>
              <p
                style={{
                  fontFamily: "'Archivo Black', 'Arial Black', sans-serif",
                  fontSize: "1.08rem",
                  color: "#F5F1E8",
                  letterSpacing: "-0.01em",
                  lineHeight: 1.2,
                  margin: "0 0 0.2rem 0",
                  fontWeight: 400,
                }}
              >
                {item.value}
              </p>
              <p
                style={{
                  fontFamily: "Inter, sans-serif",
                  fontSize: "0.85rem",
                  fontWeight: 400,
                  color: "rgba(245,241,232,0.68)",
                  lineHeight: 1.3,
                  margin: 0,
                }}
              >
                {item.sub}
              </p>
            </motion.div>
          ))}

          {/* Bloque especial de los 5 integrantes del grupo de investigación */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={
              entered
                ? {
                    opacity: 1,
                    transition: { duration: 0.35, delay: 0.7 },
                  }
                : { opacity: 0 }
            }
            style={{
              padding: "0.85rem 1.1rem",
              background: "rgba(212,160,23,0.04)",
            }}
          >
            <p
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: "0.78rem",
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                color: "#D4A017",
                margin: "0 0 0.5rem 0",
                fontWeight: 600,
              }}
            >
              EQUIPO DE INVESTIGACIÓN (5 INTEGRANTES)
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.3rem" }}>
              {projectMeta.academic.researchTeam.map((m, idx) => (
                <div
                  key={m.id}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: "0.84rem",
                    fontWeight: 400,
                    color: "rgba(245,241,232,0.92)",
                    borderBottom: idx < 4 ? "1px dashed rgba(245,241,232,0.08)" : "none",
                    paddingBottom: "0.22rem",
                  }}
                >
                  <span>
                    <span style={{ color: "#D4A017", marginRight: "0.45rem", fontWeight: 500 }}>
                      0{idx + 1}.
                    </span>
                    {m.name}
                  </span>
                  <span
                    style={{
                      fontSize: "0.72rem",
                      color: "rgba(245,241,232,0.55)",
                      textTransform: "uppercase",
                      fontWeight: 400,
                    }}
                  >
                    SENATI
                  </span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Status indicator */}
        <motion.div
          variants={fadeUp(0.82)}
          initial="hidden"
          animate={entered ? "visible" : "hidden"}
          style={{
            marginTop: "1.2rem",
            display: "flex",
            alignItems: "center",
            gap: "0.6rem",
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: "0.74rem",
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            color: "rgba(122,155,92,0.9)",
            fontWeight: 500,
          }}
        >
          <span
            style={{
              display: "inline-block",
              width: 7,
              height: 7,
              borderRadius: "50%",
              background: "#7a9b5c",
              boxShadow: "0 0 6px rgba(122,155,92,0.7)",
            }}
          />
          ETAPA 01 · INVESTIGACIÓN ACADÉMICA
        </motion.div>
      </motion.div>

      {/* ── Crosshairs ── */}
      {["top-left", "top-right", "bottom-left", "bottom-right"].map((pos) => (
        <span
          key={pos}
          aria-hidden="true"
          style={{
            position: "absolute",
            top: pos.includes("top") ? 12 : "auto",
            bottom: pos.includes("bottom") ? 12 : "auto",
            left: pos.includes("left") ? 14 : "auto",
            right: pos.includes("right") ? 14 : "auto",
            fontFamily: "monospace",
            fontSize: "0.75rem",
            color: "rgba(212,160,23,0.25)",
            userSelect: "none",
            pointerEvents: "none",
            zIndex: 3,
          }}
        >
          ＋
        </span>
      ))}
    </section>
  );
}

export default S01_Cover;
