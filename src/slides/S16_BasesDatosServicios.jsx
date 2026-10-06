// src/slides/S16_BasesDatosServicios.jsx
import React, { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import {
  Database,
  Table2,
  ShieldCheck,
  Zap,
  Activity,
  Sparkles,
  CheckCircle2,
  XCircle,
  Play,
  RotateCcw,
  Cpu,
  Layers,
  Maximize2,
  Minimize2,
  Terminal,
} from "lucide-react";
import { slidesContent } from "../data/content.es.js";
import { useSlideActive } from "../hooks/useSlideActive.js";
import { DatabaseArchitecturesCanvas } from "../components/three/DatabaseArchitecturesCanvas.jsx";
import { FocusModeSplitLayout } from "../components/layout/FocusModeSplitLayout.jsx";
import { DatabaseArchitecturePanel } from "../components/diagram/DatabaseArchitecturePanel.jsx";

const c = slidesContent.s16_basesDatos || {
  badge: "BLOQUE 4 · ENTREGABLE 2",
  scriptTag: "Persistencia Administrada",
  title: "BASES DE DATOS ADMINISTRADAS EN AWS",
  subtitle: "Despliegue de Amazon RDS (PostgreSQL/MySQL) con soporte Multi-AZ para el motor relacional de Workspace MTA frente a arquitecturas NoSQL",
};

/**
 * Slide 16 — Bases de Datos Administradas en AWS (Etapa 2 - Semana 7)
 * Reveal index: 16 (en App.jsx)
 */
export function S16_BasesDatosServicios({ isActive: propActive } = {}) {
  const shouldReduceMotion = useReducedMotion();
  const hookActive = useSlideActive(16); // Fixed index 16
  const sectionRef = useRef(null);
  const [domActive, setDomActive] = useState(false);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const checkPresent = () => setDomActive(el.classList.contains("present"));
    checkPresent();
    const observer = new MutationObserver(checkPresent);
    observer.observe(el, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, []);

  const isActive = propActive !== undefined ? propActive : (hookActive || domActive);
  const [entered, setEntered] = useState(false);

  // Motor activo: "rds" | "aurora" | "dynamodb"
  const [selectedEngine, setSelectedEngine] = useState("rds");
  const [isFocusMode, setIsFocusMode] = useState(false); // Modo Enfoque 3D
  const [hoveredStage, setHoveredStage] = useState(null);

  useEffect(() => {
    if (!isActive) {
      setEntered(false);
      return;
    }
    const t = setTimeout(() => setEntered(true), 50);
    return () => clearTimeout(t);
  }, [isActive]);

  // Atajo de teclado 'F' para alternar Modo Enfoque 3D
  useEffect(() => {
    if (!isActive) return;
    const handleKeyDown = (e) => {
      if (e.key.toLowerCase() === "f" && !e.ctrlKey && !e.metaKey) {
        setIsFocusMode((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isActive]);

  const enginesData = {
    rds: {
      id: "rds",
      name: "Amazon RDS (PostgreSQL 16)",
      category: "RDBMS Relacional",
      verdict: "MOTOR SELECCIONADO (ÓPTIMO)",
      verdictColor: "#7a9b5c",
      icon: Database,
      specs: "PostgreSQL 16 · Réplica Standby síncrona Multi-AZ",
      roleMta: "Core ERP: Asistencia, notas, contratos y facturación con integridad referencial (FK).",
    },
    aurora: {
      id: "aurora",
      name: "Amazon Aurora Serverless v2",
      category: "Cloud-Native Multi-AZ",
      verdict: "SIGUIENTE HITO DE ESCALA",
      verdictColor: "#d4a017",
      icon: Sparkles,
      specs: "6 copias replicadas en 3 Zonas de Disponibilidad (AZs)",
      roleMta: "Fase de expansión masiva sin necesidad de aprovisionar capacidad por adelantado.",
    },
    dynamodb: {
      id: "dynamodb",
      name: "Amazon DynamoDB (NoSQL)",
      category: "NoSQL Clave-Valor",
      verdict: "COMPLEMENTARIO (NO PARA CORE)",
      verdictColor: "#e8a0bf",
      icon: Table2,
      specs: "Latencia de 1 dígito (ms) y auto-escalado horizontal ilimitado",
      roleMta: "Descartado para el ERP por falta de JOINs/FKs; reservado para tokens JWT.",
    },
  };

  const requirements = [
    { label: "ACID", rds: "100%", aurora: "100%", dynamodb: "Eventual" },
    { label: "Claves FK", rds: "Sí", aurora: "Sí", dynamodb: "No" },
    { label: "JOINs SQL", rds: "Sí", aurora: "Sí", dynamodb: "No" },
    { label: "Multi-AZ", rds: "Síncrono", aurora: "6 Copias", dynamodb: "Nativo" },
  ];

  const fadeUp = (delay = 0) => ({
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 14 },
    visible: {
      opacity: 1, y: 0,
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
        background: "#070707",
        overflow: "hidden",
        display: "flex",
        flexDirection: "row",
      }}
    >
      {/* Retícula ambiental limpia */}
      <div aria-hidden="true" style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(245,241,232,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(245,241,232,0.02) 1px, transparent 1px)", backgroundSize: "64px 64px", pointerEvents: "none", zIndex: 0 }} />

      {/* Línea vertical de acento Oro AWS */}
      <motion.div
        aria-hidden="true"
        initial={{ scaleY: 0, transformOrigin: "top" }}
        animate={entered ? { scaleY: 1 } : { scaleY: 0 }}
        transition={{ duration: shouldReduceMotion ? 0.1 : 0.65, ease: [0.83, 0, 0.17, 1], delay: 0.05 }}
        style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 4, background: "#d4a017", zIndex: 10 }}
      />

      {/* ══════════════ DISPOSICIÓN REUTILIZABLE CON TRANSICIÓN DE ENFOQUE ══════════════ */}
      <FocusModeSplitLayout
        isFocusMode={isFocusMode}
        leftPanel={
          <>
            {/* Header Editorial */}
        <div style={{ display: "flex", flexDirection: "column", gap: "0.2rem" }}>
          <motion.div variants={fadeUp(0.04)} initial="hidden" animate={entered ? "visible" : "hidden"} style={{ display: "flex", alignItems: "center", gap: "0.6rem", flexWrap: "wrap" }}>
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.80rem", letterSpacing: "0.15em", textTransform: "uppercase", fontWeight: 700, color: "#d4a017", background: "rgba(212,160,23,0.12)", border: "1px solid rgba(212,160,23,0.4)", padding: "0.20rem 0.60rem" }}>
              [ {c.badge} ]
            </span>
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.76rem", color: "#7a9b5c", background: "rgba(122,155,92,0.15)", border: "1px solid rgba(122,155,92,0.35)", padding: "0.18rem 0.55rem", fontWeight: 600 }}>
              RDS MULTI-AZ · RPO = 0
            </span>
          </motion.div>

          <motion.p variants={fadeUp(0.08)} initial="hidden" animate={entered ? "visible" : "hidden"}
            style={{ fontFamily: "Yellowtail, cursive", fontSize: "clamp(1.35rem, 2.0vw, 1.85rem)", color: "#e8a0bf", lineHeight: 1.1, margin: "0.1rem 0 0 0", fontWeight: 400 }}>
            {c.scriptTag}
          </motion.p>

          <motion.h1 variants={fadeUp(0.12)} initial="hidden" animate={entered ? "visible" : "hidden"}
            style={{ fontFamily: "'Archivo Black', 'Arial Black', sans-serif", fontSize: "clamp(1.45rem, 2.1vw, 2.0rem)", color: "#F5F1E8", letterSpacing: "-0.025em", lineHeight: 1.05, textTransform: "uppercase", margin: 0, fontWeight: 400 }}>
            {c.title}
          </motion.h1>

          <motion.div
            initial={{ clipPath: "inset(0 100% 0 0)" }}
            animate={entered ? { clipPath: "inset(0 0% 0 0)" } : { clipPath: "inset(0 100% 0 0)" }}
            transition={{ duration: shouldReduceMotion ? 0.1 : 0.55, ease: [0.83, 0, 0.17, 1], delay: 0.18 }}
            style={{ height: 2, background: "#d4a017", width: "100%", maxWidth: 200, margin: "0.1rem 0" }}
          />

          <motion.p variants={fadeUp(0.16)} initial="hidden" animate={entered ? "visible" : "hidden"}
            style={{ fontFamily: "Inter, system-ui, sans-serif", fontSize: "clamp(0.85rem, 0.95vw, 0.95rem)", color: "rgba(245,241,232,0.85)", margin: 0, lineHeight: 1.4, fontWeight: 400 }}>
            {c.subtitle}
          </motion.p>
        </div>

        {/* Tarjetas HUD Glassmorphism con Selección Sincronizada al 3D */}
        <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
          {Object.values(enginesData).map((engine, idx) => {
            const isSelected = selectedEngine === engine.id;
            return (
              <motion.div
                key={engine.id}
                variants={fadeUp(0.20 + idx * 0.04)}
                initial="hidden"
                animate={entered ? "visible" : "hidden"}
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedEngine(engine.id);
                }}
                style={{
                  padding: "0.65rem 0.85rem",
                  background: isSelected ? `${engine.verdictColor}18` : "rgba(15,15,15,0.8)",
                  backdropFilter: "blur(12px)",
                  border: isSelected ? `1.5px solid ${engine.verdictColor}` : "1px solid rgba(245,241,232,0.12)",
                  borderLeft: `3.5px solid ${engine.verdictColor}`,
                  boxShadow: isSelected ? `0 0 20px ${engine.verdictColor}33` : "none",
                  cursor: "pointer",
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.25rem",
                  transition: "all 0.2s ease",
                }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.45rem" }}>
                    <engine.icon size={15} color={engine.verdictColor} />
                    <h4 style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: "0.84rem", color: "#F5F1E8", textTransform: "uppercase", margin: 0, fontWeight: 400 }}>
                      0{idx + 1} · {engine.name}
                    </h4>
                  </div>
                  <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.68rem", color: engine.verdictColor, fontWeight: 700 }}>
                    {engine.verdict}
                  </span>
                </div>
                <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.72rem", color: engine.verdictColor, fontWeight: 600 }}>
                  {engine.specs}
                </div>
                <p style={{ fontFamily: "Inter, system-ui, sans-serif", fontSize: "0.78rem", color: "rgba(245,241,232,0.85)", margin: 0, lineHeight: 1.35 }}>
                  {engine.roleMta}
                </p>
              </motion.div>
            );
          })}

          {/* Bloque de Justificación Técnica */}
          <motion.div variants={fadeUp(0.30)} initial="hidden" animate={entered ? "visible" : "hidden"}
            style={{
              padding: "0.6rem 0.85rem",
              background: "rgba(212,160,23,0.08)",
              backdropFilter: "blur(10px)",
              border: "1px solid rgba(212,160,23,0.3)",
              borderLeft: "3.5px solid #d4a017",
              display: "flex",
              flexDirection: "column",
              gap: "0.25rem",
            }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.45rem" }}>
              <ShieldCheck size={14} color="#d4a017" />
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.70rem", color: "#d4a017", fontWeight: 700, letterSpacing: "0.05em" }}>
                JUSTIFICACIÓN ARQUITECTÓNICA · MTA SOFTWARE
              </span>
            </div>
            <p style={{ fontFamily: "Inter, sans-serif", fontSize: "0.76rem", color: "rgba(245,241,232,0.9)", margin: 0, lineHeight: 1.35 }}>
              Se seleccionó <strong>Amazon RDS PostgreSQL / Aurora</strong> porque el ERP exige relaciones complejas y transacciones ACID estrictas. Se descartó NoSQL (DynamoDB) para el núcleo ERP para evitar la complejidad de rediseños a Single-Table.
            </p>
          </motion.div>

        </div>

        {/* Tabla Comparativa de Requerimientos Técnicos */}
        <motion.div variants={fadeUp(0.32)} initial="hidden" animate={entered ? "visible" : "hidden"}
          style={{
            padding: "0.55rem 0.85rem",
            background: "rgba(14,14,14,0.88)",
            backdropFilter: "blur(10px)",
            border: "1px solid rgba(245,241,232,0.15)",
            display: "flex",
            flexDirection: "column",
            gap: "0.3rem",
          }}>
          <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.70rem", color: "#d4a017", fontWeight: 700 }}>
            MATRIZ COMPARATIVA DE CAPACIDADES:
          </span>
          <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr 1fr 1fr", gap: "0.25rem", fontFamily: "'JetBrains Mono', monospace", fontSize: "0.66rem" }}>
            <span style={{ color: "rgba(245,241,232,0.5)" }}>REQ.</span>
            <span style={{ color: "#7a9b5c", fontWeight: 700 }}>RDS</span>
            <span style={{ color: "#d4a017", fontWeight: 700 }}>AURORA</span>
            <span style={{ color: "#e8a0bf", fontWeight: 700 }}>DYNAMO</span>

            {requirements.map((req) => (
              <React.Fragment key={req.label}>
                <span style={{ color: "#F5F1E8" }}>{req.label}</span>
                <span style={{ color: "#7a9b5c" }}>{req.rds}</span>
                <span style={{ color: "#d4a017" }}>{req.aurora}</span>
                <span style={{ color: "#e8a0bf" }}>{req.dynamodb}</span>
              </React.Fragment>
            ))}
          </div>
        </motion.div>
      </>
    }
    rightPanel={
      <DatabaseArchitecturePanel
        selectedEngine={selectedEngine}
        setSelectedEngine={setSelectedEngine}
      />
    }
  />
</section>
);
}

export default S16_BasesDatosServicios;
