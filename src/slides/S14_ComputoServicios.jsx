// src/slides/S14_ComputoServicios.jsx
import React, { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import {
  Server,
  Zap,
  Box,
  HardDrive,
  Cpu,
  Layers,
  Activity,
  Play,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Sparkles,
  ShieldCheck,
  Maximize2,
  Minimize2,
  Terminal,
} from "lucide-react";
import { slidesContent } from "../data/content.es.js";
import { useSlideActive } from "../hooks/useSlideActive.js";
import { ComputeArchitecturesCanvas } from "../components/three/ComputeArchitecturesCanvas.jsx";
import { FocusModeSplitLayout } from "../components/layout/FocusModeSplitLayout.jsx";
import { ComputeArchitecturePanel } from "../components/diagram/ComputeArchitecturePanel.jsx";

const c = slidesContent.s14_computo || {
  badge: "BLOQUE 4 · ENTREGABLE 2",
  scriptTag: "Capa de Computación",
  title: "CÓMPUTO ELÁSTICO Y SERVERLESS EN AWS",
  subtitle: "Despliegue de instancias Amazon EC2 con volúmenes EBS optimizados y evaluación de funciones serverless con AWS Lambda para tareas asíncronas",
};

/**
 * Slide 14 — Cómputo Elástico y Serverless (Etapa 2 - Semana 7)
 * Reveal index: 14 (en App.jsx)
 */
export function S14_ComputoServicios({ isActive: propActive } = {}) {
  const shouldReduceMotion = useReducedMotion();
  const hookActive = useSlideActive(14); // Fixed index 14
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

  // Selector de tecnología activa: "ec2" | "lambda" | "containers"
  const [selectedTech, setSelectedTech] = useState("ec2");
  const [isFocusMode, setIsFocusMode] = useState(false); // Modo Enfoque 3D
  const [hoveredStage, setHoveredStage] = useState(null);

  // Simulador de invocación de cómputo en vivo
  const [isSimulating, setIsSimulating] = useState(false);

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

  const technologies = {
    ec2: {
      id: "ec2",
      name: "Amazon EC2 + EBS gp3",
      category: "Infraestructura (IaaS)",
      icon: Server,
      color: "#d4a017",
      specs: "t4g.small (Graviton2 ARM) · 2 vCPU · 2 GB RAM · 30 GB SSD gp3",
      roleMta: "Backend Node.js y APIs REST críticas con latencia < 30ms sostenida.",
    },
    lambda: {
      id: "lambda",
      name: "AWS Lambda (Serverless)",
      category: "Eventos (FaaS)",
      icon: Zap,
      color: "#e8a0bf",
      specs: "1M peticiones/mes gratis · Auto-escalado instantáneo de 0 a 1 000+",
      roleMta: "Cálculo de notas, reportes nocturnos y compresión de PDFs sin costo en reposo.",
    },
    containers: {
      id: "containers",
      name: "Docker + Amazon ECS",
      category: "Contenedores (CaaS)",
      icon: Box,
      color: "#7a9b5c",
      specs: "AWS Fargate / EC2 · Registro privado Amazon ECR",
      roleMta: "Mismo entorno inmutable Node.js / Next.js para los 10 practicantes de MTA.",
    },
  };

  const handleRunSimulation = (e, techKey) => {
    if (e) e.stopPropagation();
    setIsSimulating(true);
    setTimeout(() => {
      setIsSimulating(false);
    }, 850);
  };

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
              EC2 · LAMBDA · DOCKER
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
          {Object.values(technologies).map((tech, idx) => {
            const isSelected = selectedTech === tech.id;
            return (
              <motion.div
                key={tech.id}
                variants={fadeUp(0.20 + idx * 0.04)}
                initial="hidden"
                animate={entered ? "visible" : "hidden"}
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedTech(tech.id);
                }}
                style={{
                  padding: "0.65rem 0.85rem",
                  background: isSelected ? `${tech.color}18` : "rgba(15,15,15,0.8)",
                  backdropFilter: "blur(12px)",
                  border: isSelected ? `1.5px solid ${tech.color}` : "1px solid rgba(245,241,232,0.12)",
                  borderLeft: `3.5px solid ${tech.color}`,
                  boxShadow: isSelected ? `0 0 20px ${tech.color}33` : "none",
                  cursor: "pointer",
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.25rem",
                  transition: "all 0.2s ease",
                }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.45rem" }}>
                    <tech.icon size={15} color={tech.color} />
                    <h4 style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: "0.84rem", color: "#F5F1E8", textTransform: "uppercase", margin: 0, fontWeight: 400 }}>
                      0{idx + 1} · {tech.name}
                    </h4>
                  </div>
                  <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.68rem", color: tech.color, fontWeight: 700 }}>
                    {tech.category}
                  </span>
                </div>
                <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.72rem", color: tech.color, fontWeight: 600 }}>
                  {tech.specs}
                </div>
                <p style={{ fontFamily: "Inter, system-ui, sans-serif", fontSize: "0.78rem", color: "rgba(245,241,232,0.85)", margin: 0, lineHeight: 1.35 }}>
                  {tech.roleMta}
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
                JUSTIFICACIÓN DE ELECCIÓN · MTA SOFTWARE
              </span>
            </div>
            <p style={{ fontFamily: "Inter, sans-serif", fontSize: "0.76rem", color: "rgba(245,241,232,0.9)", margin: 0, lineHeight: 1.35 }}>
              Se seleccionó <strong>AWS EC2 y ECS/Fargate</strong> frente a Serverless puro (Lambda) para el backend del ERP porque garantiza sesiones HTTP persistentes y evita Cold Starts en consultas de practicantes.
            </p>
          </motion.div>

        </div>

        {/* Telemetría y Botón Probar Invocación */}
        <motion.div variants={fadeUp(0.32)} initial="hidden" animate={entered ? "visible" : "hidden"}
          style={{
            padding: "0.55rem 0.85rem",
            background: "rgba(14,14,14,0.88)",
            backdropFilter: "blur(10px)",
            border: "1px solid rgba(245,241,232,0.15)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "0.85rem",
          }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.55rem" }}>
            <Activity size={15} color="#d4a017" />
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.72rem", color: "#F5F1E8", fontWeight: 600 }}>
              SELECCIÓN: <strong style={{ color: (technologies[selectedTech] || technologies.ec2).color }}>{selectedTech === "all" ? "TODAS (VISTA GLOBAL)" : (technologies[selectedTech] || technologies.ec2).name}</strong>
            </span>
          </div>

          <button
            type="button"
            onClick={(e) => handleRunSimulation(e, selectedTech)}
            disabled={isSimulating}
            style={{
              background: isSimulating ? "rgba(245,241,232,0.1)" : "rgba(212,160,23,0.18)",
              color: isSimulating ? "rgba(245,241,232,0.5)" : "#d4a017",
              border: "1px solid #d4a017",
              padding: "0.28rem 0.65rem",
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: "0.70rem",
              fontWeight: 700,
              cursor: isSimulating ? "default" : "pointer",
              display: "flex",
              alignItems: "center",
              gap: "0.35rem",
              position: "relative",
              zIndex: 50,
            }}>
            <span>{isSimulating ? "PROBANDO..." : "PROBAR INVOCACIÓN"}</span>
          </button>
        </motion.div>
      </>
    }
    rightPanel={
      <ComputeArchitecturePanel
        selectedTech={selectedTech}
        setSelectedTech={setSelectedTech}
        isSimulating={isSimulating}
        handleRunSimulation={handleRunSimulation}
      />
    }
  />
</section>
);
}

export default S14_ComputoServicios;
