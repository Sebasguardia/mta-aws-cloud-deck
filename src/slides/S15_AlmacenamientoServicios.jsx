// src/slides/S15_AlmacenamientoServicios.jsx
import React, { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import {
  FolderArchive,
  Share2,
  Archive,
  HardDrive,
  Database,
  Layers,
  Activity,
  Play,
  RotateCcw,
  CheckCircle2,
  ShieldCheck,
  TrendingDown,
  Clock,
  Sparkles,
  Maximize2,
  Minimize2,
  Terminal,
} from "lucide-react";
import { slidesContent } from "../data/content.es.js";
import { useSlideActive } from "../hooks/useSlideActive.js";
import { StorageArchitecturesCanvas } from "../components/three/StorageArchitecturesCanvas.jsx";
import { FocusModeSplitLayout } from "../components/layout/FocusModeSplitLayout.jsx";
import { StorageArchitecturePanel } from "../components/diagram/StorageArchitecturePanel.jsx";

const c = slidesContent.s15_almacenamiento || {
  badge: "BLOQUE 4 · ENTREGABLE 2",
  scriptTag: "Estrategia de Datos",
  title: "ESTRATEGIA DE ALMACENAMIENTO Y ARCHIVO",
  subtitle: "Implementación de buckets en Amazon S3, almacenamiento compartido con Amazon EFS y archivado a largo plazo con ciclo de vida en S3 Glacier",
};

/**
 * Slide 15 — Almacenamiento Unificado y Archivo en AWS (Etapa 2 - Semana 7)
 * Reveal index: 15 (en App.jsx)
 */
export function S15_AlmacenamientoServicios({ isActive: propActive } = {}) {
  const shouldReduceMotion = useReducedMotion();
  const hookActive = useSlideActive(15); // Fixed index 15
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

  // Pestaña de servicio: "s3" | "efs" | "glacier"
  const [selectedStorage, setSelectedStorage] = useState("s3");
  const [isFocusMode, setIsFocusMode] = useState(false); // Modo Enfoque 3D
  const [hoveredStage, setHoveredStage] = useState(null);
  const [lifecycleDay, setLifecycleDay] = useState(90);

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

  const storageServices = {
    s3: {
      id: "s3",
      name: "Amazon S3 Standard",
      category: "Objetos Cloud",
      icon: FolderArchive,
      color: "#d4a017",
      specs: "11 Nueves de Durabilidad (99.999999999%)",
      roleMta: "Assets estáticos (Strato Studio, VIISION), fotos de practicantes y builds.",
    },
    efs: {
      id: "efs",
      name: "Amazon EFS (NFSv4)",
      category: "Archivos Compartidos",
      icon: Share2,
      color: "#7a9b5c",
      specs: "Montaje POSIX Multi-AZ Concurrente",
      roleMta: "Workspace compartido '/mnt/mta-shared-workspace' para los 10 practicantes.",
    },
    glacier: {
      id: "glacier",
      name: "Amazon S3 Glacier Flexible",
      category: "Archivado en Frío",
      icon: Archive,
      color: "#e8a0bf",
      specs: "Retención > 90 días por auditorías SENATI (-84% costo)",
      roleMta: "Backups de PostgreSQL, CloudTrail y asistencias históricas.",
    },
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
              S3 · EFS · GLACIER
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
          {Object.values(storageServices).map((service, idx) => {
            const isSelected = selectedStorage === service.id;
            return (
              <motion.div
                key={service.id}
                variants={fadeUp(0.20 + idx * 0.04)}
                initial="hidden"
                animate={entered ? "visible" : "hidden"}
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedStorage(service.id);
                }}
                style={{
                  padding: "0.65rem 0.85rem",
                  background: isSelected ? `${service.color}18` : "rgba(15,15,15,0.8)",
                  backdropFilter: "blur(12px)",
                  border: isSelected ? `1.5px solid ${service.color}` : "1px solid rgba(245,241,232,0.12)",
                  borderLeft: `3.5px solid ${service.color}`,
                  boxShadow: isSelected ? `0 0 20px ${service.color}33` : "none",
                  cursor: "pointer",
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.25rem",
                  transition: "all 0.2s ease",
                }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.45rem" }}>
                    <service.icon size={15} color={service.color} />
                    <h4 style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: "0.84rem", color: "#F5F1E8", textTransform: "uppercase", margin: 0, fontWeight: 400 }}>
                      0{idx + 1} · {service.name}
                    </h4>
                  </div>
                  <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.68rem", color: service.color, fontWeight: 700 }}>
                    {service.category}
                  </span>
                </div>
                <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.72rem", color: service.color, fontWeight: 600 }}>
                  {service.specs}
                </div>
                <p style={{ fontFamily: "Inter, system-ui, sans-serif", fontSize: "0.78rem", color: "rgba(245,241,232,0.85)", margin: 0, lineHeight: 1.35 }}>
                  {service.roleMta}
                </p>
              </motion.div>
            );
          })}

          {/* Bloque de Justificación Técnica */}
          <motion.div variants={fadeUp(0.30)} initial="hidden" animate={entered ? "visible" : "hidden"}
            style={{
              padding: "0.6rem 0.85rem",
              background: "rgba(122,155,92,0.08)",
              backdropFilter: "blur(10px)",
              border: "1px solid rgba(122,155,92,0.3)",
              borderLeft: "3.5px solid #7a9b5c",
              display: "flex",
              flexDirection: "column",
              gap: "0.25rem",
            }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.45rem" }}>
              <ShieldCheck size={14} color="#7a9b5c" />
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.70rem", color: "#7a9b5c", fontWeight: 700, letterSpacing: "0.05em" }}>
                JUSTIFICACIÓN DE ESTRATEGIA · MTA SOFTWARE
              </span>
            </div>
            <p style={{ fontFamily: "Inter, sans-serif", fontSize: "0.76rem", color: "rgba(245,241,232,0.9)", margin: 0, lineHeight: 1.35 }}>
              Combinación óptima: <strong>Amazon S3</strong> para activos web públicos ($0.023/GB), <strong>Amazon EFS</strong> para compartir código POSIX entre los 10 practicantes y <strong>S3 Glacier</strong> para retención legal SUNAT a $0.00099/GB.
            </p>
          </motion.div>

        </div>

        {/* Simulador S3 Lifecycle */}
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
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.70rem", color: "#d4a017", fontWeight: 700 }}>
              S3 LIFECYCLE:
            </span>
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.68rem", color: "#7a9b5c", fontWeight: 700 }}>
              AHORRO: -84.3% GLACIER
            </span>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "0.35rem" }}>
            {[
              { day: 0, label: "DÍAS 1–30", tier: "S3 Standard" },
              { day: 30, label: "DÍAS 30–90", tier: "S3 IA" },
              { day: 90, label: "DÍAS 90+", tier: "S3 Glacier" },
            ].map((st) => (
              <button
                key={st.day}
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setLifecycleDay(st.day);
                }}
                style={{
                  background: lifecycleDay === st.day ? "rgba(212,160,23,0.22)" : "#141414",
                  border: lifecycleDay === st.day ? "1px solid #d4a017" : "1px solid rgba(245,241,232,0.1)",
                  color: lifecycleDay === st.day ? "#d4a017" : "rgba(245,241,232,0.7)",
                  padding: "0.25rem 0.35rem",
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: "0.66rem",
                  fontWeight: 600,
                  cursor: "pointer",
                }}>
                <div>{st.label}</div>
                <div style={{ fontSize: "0.58rem", opacity: 0.8 }}>{st.tier}</div>
              </button>
            ))}
          </div>
        </motion.div>
      </>
    }
    rightPanel={
      <StorageArchitecturePanel
        selectedStorage={selectedStorage}
        setSelectedStorage={setSelectedStorage}
      />
    }
  />
</section>
);
}

export default S15_AlmacenamientoServicios;
