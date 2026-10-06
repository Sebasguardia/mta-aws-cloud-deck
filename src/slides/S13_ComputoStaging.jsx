// src/slides/S13_ComputoStaging.jsx
import React, { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import {
  Server,
  HardDrive,
  Cpu,
  Play,
  Square,
  CheckCircle2,
  Terminal,
  Activity,
  Maximize2,
  Minimize2,
  Sparkles,
  ShieldCheck,
} from "lucide-react";
import { slidesContent } from "../data/content.es.js";
import { useSlideActive } from "../hooks/useSlideActive.js";
import { StagingInstanceCanvas } from "../components/three/StagingInstanceCanvas.jsx";
import { FocusModeSplitLayout } from "../components/layout/FocusModeSplitLayout.jsx";
import { StagingArchitecturePanel } from "../components/diagram/StagingArchitecturePanel.jsx";

const c = slidesContent.s13_computo_staging || {
  badge: "BLOQUE 4 · ENTREGABLE 2",
  scriptTag: "Capa de Computación",
  title: "ENTORNO DE PRUEBAS Y STAGING (EC2)",
  subtitle: "Centralización de compilación y pruebas en la nube con Amazon EC2 (t3.micro) y almacenamiento persistente Amazon EBS (30 GB gp3) para los 10 practicantes de MTA Software",
};

/**
 * Slide 13 — Capa de Computación: Entorno de Staging Unificado (EC2 + EBS gp3)
 * Reveal index: 13 (en App.jsx)
 */
export function S13_ComputoStaging({ isActive: propActive } = {}) {
  const shouldReduceMotion = useReducedMotion();
  const hookActive = useSlideActive(13); // Fixed index 13
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

  // Estados interactivos principales
  const [selectedTech, setSelectedTech] = useState("ec2"); // "ec2" | "ebs" | "workflow"
  const [selectedInstance, setSelectedInstance] = useState("t3.micro");
  const [serverState, setServerState] = useState("running"); // "running" | "stopped"
  const [focusCamera, setFocusCamera] = useState("panoramic"); // "panoramic" | "server" | "ebs" | "interns"
  const [isFocusMode, setIsFocusMode] = useState(false); // Modo Enfoque 3D
  const [hoveredStage, setHoveredStage] = useState(null);
  const [pulse, setPulse] = useState(false);

  useEffect(() => {
    if (!isActive) {
      setEntered(false);
      return;
    }
    const t = setTimeout(() => setEntered(true), 50);
    return () => clearTimeout(t);
  }, [isActive]);

  useEffect(() => {
    if (!entered) return;
    const interval = setInterval(() => setPulse((p) => !p), 1200);
    return () => clearInterval(interval);
  }, [entered]);

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

  const handleSelectTech = (e, techKey, camFocus) => {
    if (e) e.stopPropagation();
    setSelectedTech(techKey);
    setFocusCamera(camFocus);
  };

  const fadeUp = (delay = 0) => ({
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 14 },
    visible: {
      opacity: 1,
      y: 0,
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
              US-EAST-1 · FREE TIER
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

        {/* Tarjetas HUD Glassmorphism con selección sincronizada al 3D */}
        <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
          
          {/* Bloque 1: EC2 t3.micro */}
          <motion.div variants={fadeUp(0.20)} initial="hidden" animate={entered ? "visible" : "hidden"}
            onClick={(e) => handleSelectTech(e, "ec2", "server")}
            style={{
              padding: "0.65rem 0.85rem",
              background: selectedTech === "ec2" ? "rgba(212,160,23,0.18)" : "rgba(15,15,15,0.8)",
              backdropFilter: "blur(12px)",
              border: selectedTech === "ec2" ? "1.5px solid #d4a017" : "1px solid rgba(245,241,232,0.12)",
              borderLeft: "3.5px solid #d4a017",
              boxShadow: selectedTech === "ec2" ? "0 0 20px rgba(212,160,23,0.25)" : "none",
              cursor: "pointer",
              display: "flex",
              flexDirection: "column",
              gap: "0.25rem",
              transition: "all 0.2s ease",
            }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.45rem" }}>
                <Cpu size={15} color="#d4a017" />
                <h4 style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: "0.84rem", color: "#F5F1E8", textTransform: "uppercase", margin: 0, fontWeight: 400 }}>
                  01 · AMAZON EC2 t3.micro
                </h4>
              </div>
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.68rem", color: "#7a9b5c", fontWeight: 700 }}>$0.00 FREE TIER</span>
            </div>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.72rem", color: "#d4a017", fontWeight: 600 }}>
              2 vCPUs (Intel Xeon) · 1.0 GiB RAM · T3 Unlimited
            </div>
            <p style={{ fontFamily: "Inter, system-ui, sans-serif", fontSize: "0.78rem", color: "rgba(245,241,232,0.85)", margin: 0, lineHeight: 1.35 }}>
              Servidor centralizado para compilar <strong>Next.js / React</strong> y ejecutar pruebas del ERP Workspace MTA antes de despliegue.
            </p>
          </motion.div>

          {/* Bloque 2: EBS 30GB gp3 */}
          <motion.div variants={fadeUp(0.24)} initial="hidden" animate={entered ? "visible" : "hidden"}
            onClick={(e) => handleSelectTech(e, "ebs", "ebs")}
            style={{
              padding: "0.65rem 0.85rem",
              background: selectedTech === "ebs" ? "rgba(122,155,92,0.18)" : "rgba(15,15,15,0.8)",
              backdropFilter: "blur(12px)",
              border: selectedTech === "ebs" ? "1.5px solid #7a9b5c" : "1px solid rgba(245,241,232,0.12)",
              borderLeft: "3.5px solid #7a9b5c",
              boxShadow: selectedTech === "ebs" ? "0 0 20px rgba(122,155,92,0.25)" : "none",
              cursor: "pointer",
              display: "flex",
              flexDirection: "column",
              gap: "0.25rem",
              transition: "all 0.2s ease",
            }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.45rem" }}>
                <HardDrive size={15} color="#7a9b5c" />
                <h4 style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: "0.84rem", color: "#F5F1E8", textTransform: "uppercase", margin: 0, fontWeight: 400 }}>
                  02 · AMAZON EBS 30 GB gp3
                </h4>
              </div>
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.68rem", color: "#7a9b5c", fontWeight: 700 }}>30 GB PERSISTENTE</span>
            </div>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.72rem", color: "#7a9b5c", fontWeight: 600 }}>
              3 000 IOPS base · 125 MB/s · Ubuntu 22.04 LTS
            </div>
            <p style={{ fontFamily: "Inter, system-ui, sans-serif", fontSize: "0.78rem", color: "rgba(245,241,232,0.85)", margin: 0, lineHeight: 1.35 }}>
              Disco SSD elástico de alto rendimiento que elimina ralentizaciones durante compilaciones paralelas.
            </p>
          </motion.div>

          {/* Bloque 3: Workflow 10 Practicantes */}
          <motion.div variants={fadeUp(0.28)} initial="hidden" animate={entered ? "visible" : "hidden"}
            onClick={(e) => handleSelectTech(e, "workflow", "interns")}
            style={{
              padding: "0.65rem 0.85rem",
              background: selectedTech === "workflow" ? "rgba(232,160,191,0.18)" : "rgba(15,15,15,0.8)",
              backdropFilter: "blur(12px)",
              border: selectedTech === "workflow" ? "1.5px solid #e8a0bf" : "1px solid rgba(245,241,232,0.12)",
              borderLeft: "3.5px solid #e8a0bf",
              boxShadow: selectedTech === "workflow" ? "0 0 20px rgba(232,160,191,0.25)" : "none",
              cursor: "pointer",
              display: "flex",
              flexDirection: "column",
              gap: "0.25rem",
              transition: "all 0.2s ease",
            }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.45rem" }}>
                <Terminal size={15} color="#e8a0bf" />
                <h4 style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: "0.84rem", color: "#F5F1E8", textTransform: "uppercase", margin: 0, fontWeight: 400 }}>
                  03 · INTEGRACIÓN 10 PRACTICANTES
                </h4>
              </div>
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.68rem", color: "#e8a0bf", fontWeight: 700 }}>AUTOMÁTICO</span>
            </div>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.72rem", color: "rgba(245,241,232,0.75)" }}>
              Git Push ➔ Jest Tests ➔ Build EC2 ➔ Staging OK
            </div>
          </motion.div>
        </div>

        {/* Telemetría y Botón de Estado Servidor */}
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
            <motion.div
              animate={{ opacity: serverState === "running" ? (pulse ? 1 : 0.3) : 0.2 }}
              transition={{ duration: 0.5 }}
              style={{ width: 8, height: 8, borderRadius: "50%", background: serverState === "running" ? "#7a9b5c" : "#c6432b" }}
            />
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.72rem", color: "#F5F1E8", fontWeight: 600 }}>
              ESTADO EC2: <strong style={{ color: serverState === "running" ? "#7a9b5c" : "#c6432b" }}>{serverState === "running" ? "ONLINE (STAGING)" : "DETENIDO ($0/H)"}</strong>
            </span>
          </div>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setServerState((s) => (s === "running" ? "stopped" : "running"));
            }}
            style={{
              background: serverState === "running" ? "rgba(198,67,43,0.22)" : "rgba(122,155,92,0.22)",
              color: serverState === "running" ? "#e8a0bf" : "#7a9b5c",
              border: `1px solid ${serverState === "running" ? "#c6432b" : "#7a9b5c"}`,
              padding: "0.28rem 0.65rem",
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: "0.70rem",
              fontWeight: 700,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "0.35rem",
              position: "relative",
              zIndex: 50,
            }}>
            {serverState === "running" ? <Square size={11} /> : <Play size={11} />}
            <span>{serverState === "running" ? "APAGAR EC2" : "INICIAR EC2"}</span>
          </button>
        </motion.div>
      </>
    }
    rightPanel={
      <StagingArchitecturePanel
        serverState={serverState}
        setServerState={setServerState}
        selectedTech={selectedTech}
        setSelectedTech={setSelectedTech}
      />
    }
  />
</section>
);
}

export default S13_ComputoStaging;
