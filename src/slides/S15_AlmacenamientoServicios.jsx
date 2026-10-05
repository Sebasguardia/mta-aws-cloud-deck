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
  ArrowRight,
  Terminal,
} from "lucide-react";
import { slidesContent } from "../data/content.es.js";
import { useSlideActive } from "../hooks/useSlideActive.js";
import { StorageArchitecturesCanvas } from "../components/three/StorageArchitecturesCanvas.jsx";

const c = slidesContent.s15_almacenamiento || {
  sectionNum: "04",
  badge: "BLOQUE 4 · ENTREGABLE 2",
  scriptTag: "Estrategia de Datos",
  title: "ESTRATEGIA DE ALMACENAMIENTO Y ARCHIVO",
  subtitle: "Implementación de buckets en Amazon S3, almacenamiento compartido con Amazon EFS y archivado a largo plazo con ciclo de vida en S3 Glacier",
};

/**
 * Slide 15 — Almacenamiento Unificado y Archivo en AWS (Etapa 2 - Semana 7)
 * Fiel a docs/informacion.txt:
 *  1. Amazon S3 (Objetos): Assets estáticos de clientes (Strato Studio, VIISION), fotos de practicantes y builds con 11 nueves de durabilidad (99.999999999%).
 *  2. Amazon EFS (NFSv4): Sistema de archivos elástico multi-zona compartido de forma concurrente para los 10 practicantes de MTA y contenedores ECS.
 *  3. S3 Glacier Flexible Retrieval: Archivador histórico de backups de base de datos y logs legales (>90 días) con 84% de ahorro frente a S3 Standard.
 *
 * Visualización 3D: StorageArchitecturesCanvas (Three.js WebGL sin bloqueos, cámara elástica interactiva hacia el servicio activo).
 * Simulador Dinámico: Simulador de Reglas de Ciclo de Vida (S3 Lifecycle Rule) en tiempo real con cálculo de ahorro del 84%.
 */
export function S15_AlmacenamientoServicios({ isActive: propActive } = {}) {
  const shouldReduceMotion = useReducedMotion();
  const hookActive = useSlideActive(14);
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

  const isActive = propActive !== undefined ? (propActive || domActive) : (hookActive || domActive);
  const [entered, setEntered] = useState(false);

  // Pestaña de servicio: "s3" | "efs" | "glacier"
  const [selectedStorage, setSelectedStorage] = useState("s3");

  // Simulador de Ciclo de Vida (Día 0, 30, 90+)
  const [lifecycleDay, setLifecycleDay] = useState(90);
  const [isMigrating, setIsMigrating] = useState(false);
  const [simResults, setSimResults] = useState(null);

  useEffect(() => {
    if (!isActive) return;
    const t = setTimeout(() => setEntered(true), 40);
    return () => {
      clearTimeout(t);
      setEntered(false);
    };
  }, [isActive]);

  const storageServices = {
    s3: {
      id: "s3",
      name: "Amazon S3 Standard",
      category: "Objetos",
      icon: FolderArchive,
      color: "#d4a017",
      title: "Objetos con 11 Nueves de Durabilidad",
      pricing: "$0.023 / GB (5 GB gratis Free Tier)",
      specs: "99.999999999% de durabilidad · Conexión con CDN CloudFront",
      roleMta: "Assets de clientes (Strato Studio, VIISION), bundles y fotos con URLs prefirmadas.",
      retentionFeature: "Bucket 'mta-production-backups' con versionado y cifrado SSE-S3.",
      whyChosen: "Desacopla archivos del servidor: cero saturación de disco I/O en EC2.",
    },
    efs: {
      id: "efs",
      name: "Amazon EFS (NFSv4)",
      category: "Archivos Compartidos",
      icon: Share2,
      color: "#7a9b5c",
      title: "Almacenamiento Concurrente Multi-AZ",
      pricing: "$0.30 / GB (Escalado bajo demanda)",
      specs: "Montaje POSIX NFSv4 concurrente en instancias y contenedores",
      roleMta: "Workspace compartido '/mnt/mta-shared-workspace' para los 10 practicantes.",
      retentionFeature: "Redundancia sincrónica en 3 Zonas de Disponibilidad (us-east-1).",
      whyChosen: "Erradica la duplicación de dependencias en 10 laptops individuales.",
    },
    glacier: {
      id: "glacier",
      name: "Amazon S3 Glacier Flexible",
      category: "Archivado Histórico",
      icon: Archive,
      color: "#e8a0bf",
      title: "Archivado en Frío (-84% Costo)",
      pricing: "$0.0036 / GB ($3.60 / TB vs $23 en S3)",
      specs: "Retención por normativas académicas y auditorías SENATI",
      roleMta: "Backups de PostgreSQL, auditorías CloudTrail y registros de asistencia > 90 días.",
      retentionFeature: "Regla S3 Lifecycle: paso automático a Glacier a los 90 días.",
      whyChosen: "Ahorro del 84% en archivos históricos frente a tarifas caras de Hostinger.",
    },
  };

  const activeData = storageServices[selectedStorage];

  // Ejecución del simulador de ciclo de vida
  const handleRunLifecycleSimulation = (targetDay) => {
    setIsMigrating(true);
    setLifecycleDay(targetDay);
    setSimResults(null);

    setTimeout(() => {
      if (targetDay === 0) {
        setSimResults({
          tier: "S3 Standard",
          timeline: "Día 1–30",
          costPerTB: "$23.00 / TB",
          savings: "Línea Base",
          impact: "Acceso inmediato en milisegundos para builds y producción activa.",
        });
      } else if (targetDay === 30) {
        setSimResults({
          tier: "S3 Standard-IA",
          timeline: "Día 31–90",
          costPerTB: "$12.50 / TB",
          savings: "46% Ahorro",
          impact: "Acceso rápido para reportes del mes anterior de consulta esporádica.",
        });
      } else {
        setSimResults({
          tier: "S3 Glacier Flexible",
          timeline: "Día 91+",
          costPerTB: "$3.60 / TB",
          savings: "84% Ahorro",
          impact: "Archivado normativo legal y de auditoría SENATI a costo mínimo.",
        });
      }
      setIsMigrating(false);
    }, 600);
  };

  const fadeUp = (delay = 0) => ({
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 14 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: shouldReduceMotion ? 0.1 : 0.45,
        ease: [0.16, 1, 0.3, 1],
        delay: entered ? delay : 0,
      },
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
        background: "#0A0A0A",
        overflow: "hidden",
        display: "flex",
        flexDirection: "row",
      }}
    >
      {/* Retícula ambiental */}
      <div aria-hidden="true" style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(245,241,232,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(245,241,232,0.025) 1px, transparent 1px)", backgroundSize: "64px 64px", pointerEvents: "none", zIndex: 0 }} />
      <div aria-hidden="true" style={{ position: "absolute", inset: 0, background: "repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,0,0,0.07) 3px, rgba(0,0,0,0.07) 6px)", pointerEvents: "none", zIndex: 1 }} />

      {/* Línea vertical de acento Oro AWS */}
      <motion.div
        aria-hidden="true"
        initial={{ scaleY: 0, transformOrigin: "top" }}
        animate={entered ? { scaleY: 1 } : { scaleY: 0 }}
        transition={{ duration: shouldReduceMotion ? 0.1 : 0.65, ease: [0.83, 0, 0.17, 1], delay: 0.05 }}
        style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 4, background: "#d4a017", zIndex: 3 }}
      />

      {/* ══════════════ COLUMNA IZQUIERDA (50%) ══════════════ */}
      <div style={{ flex: "0 0 50%", display: "flex", flexDirection: "column", justifyContent: "center", padding: "1.8rem 2.5rem 1.8rem 4.5rem", position: "relative", zIndex: 2, gap: "0.75rem", boxSizing: "border-box" }}>

        {/* Header Editorial idéntico al estándar del deck */}
        <div style={{ display: "flex", flexDirection: "column", gap: "0.15rem" }}>
          <motion.div variants={fadeUp(0.04)} initial="hidden" animate={entered ? "visible" : "hidden"} style={{ display: "flex", alignItems: "center", gap: "0.6rem", flexWrap: "wrap" }}>
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.85rem", letterSpacing: "0.15em", textTransform: "uppercase", fontWeight: 700, color: "#d4a017", background: "rgba(212,160,23,0.12)", border: "1px solid rgba(212,160,23,0.4)", padding: "0.24rem 0.65rem" }}>
              [ {c.badge} ]
            </span>
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.80rem", color: "#7a9b5c", background: "rgba(122,155,92,0.15)", border: "1px solid rgba(122,155,92,0.35)", padding: "0.20rem 0.55rem", fontWeight: 600 }}>
              11 NUEVES DE DURABILIDAD
            </span>
          </motion.div>

          <motion.p variants={fadeUp(0.08)} initial="hidden" animate={entered ? "visible" : "hidden"}
            style={{ fontFamily: "Yellowtail, cursive", fontSize: "clamp(1.5rem, 2.3vw, 2.1rem)", color: "#e8a0bf", lineHeight: 1.1, margin: "0.1rem 0 0 0", fontWeight: 400 }}>
            {c.scriptTag}
          </motion.p>

          <motion.h1 variants={fadeUp(0.12)} initial="hidden" animate={entered ? "visible" : "hidden"}
            style={{ fontFamily: "'Archivo Black', 'Arial Black', sans-serif", fontSize: "clamp(1.7rem, 2.5vw, 2.35rem)", color: "#F5F1E8", letterSpacing: "-0.025em", lineHeight: 1.06, textTransform: "uppercase", margin: 0, fontWeight: 400 }}>
            {c.title}
          </motion.h1>

          <motion.div
            initial={{ clipPath: "inset(0 100% 0 0)" }}
            animate={entered ? { clipPath: "inset(0 0% 0 0)" } : { clipPath: "inset(0 100% 0 0)" }}
            transition={{ duration: shouldReduceMotion ? 0.1 : 0.55, ease: [0.83, 0, 0.17, 1], delay: 0.18 }}
            style={{ height: 2, background: "#d4a017", width: "100%", maxWidth: 220, margin: "0.12rem 0" }}
          />

          <motion.p variants={fadeUp(0.16)} initial="hidden" animate={entered ? "visible" : "hidden"}
            style={{ fontFamily: "Inter, system-ui, -apple-system, sans-serif", fontSize: "clamp(0.92rem, 1.05vw, 1.02rem)", color: "rgba(245,241,232,0.85)", margin: 0, lineHeight: 1.4, fontWeight: 400 }}>
            {c.subtitle}
          </motion.p>
        </div>

        {/* Selector de 3 Pestañas Técnicas de Almacenamiento */}
        <motion.div variants={fadeUp(0.20)} initial="hidden" animate={entered ? "visible" : "hidden"}
          style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "0.5rem", background: "rgba(18,18,18,0.9)", border: "1.5px solid rgba(245,241,232,0.15)", padding: "0.45rem" }}>
          {[
            { id: "s3", label: "AMAZON S3 (OBJETOS)", icon: FolderArchive, color: "#d4a017" },
            { id: "efs", label: "AMAZON EFS (NFSv4)", icon: Share2, color: "#7a9b5c" },
            { id: "glacier", label: "S3 GLACIER (ARCHIVE)", icon: Archive, color: "#e8a0bf" },
          ].map((tab) => {
            const isSel = selectedStorage === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setSelectedStorage(tab.id)}
                style={{
                  background: isSel ? tab.color : "transparent",
                  color: isSel ? "#0A0A0A" : "rgba(245,241,232,0.92)",
                  border: isSel ? `1px solid ${tab.color}` : "1px solid rgba(245,241,232,0.1)",
                  padding: "0.6rem 0.45rem",
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: "0.80rem",
                  fontWeight: isSel ? 700 : 500,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "0.45rem",
                  transition: "all 0.18s ease",
                }}
              >
                <tab.icon size={16} style={{ flexShrink: 0 }} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </motion.div>

        {/* Ficha Técnica Dinámica del Servicio Seleccionado */}
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedStorage}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.18 }}
            style={{
              background: "#0c0c0c",
              border: `1.5px solid ${activeData.color}55`,
              padding: "0.85rem 1.05rem",
              display: "flex",
              flexDirection: "column",
              gap: "0.45rem",
            }}
          >
            {/* Título de la tecnología y estimación de costo */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.86rem", color: activeData.color, fontWeight: 700 }}>
                {activeData.category.toUpperCase()} · {activeData.name.toUpperCase()}
              </span>
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.78rem", color: "#d4a017", fontWeight: 700, background: "rgba(212,160,23,0.12)", padding: "0.2rem 0.55rem", border: "1px solid rgba(212,160,23,0.35)" }}>
                {activeData.pricing}
              </span>
            </div>

            {/* Especificaciones clave */}
            <div style={{ background: "#141414", border: "1px solid rgba(245,241,232,0.1)", padding: "0.45rem 0.75rem", display: "flex", alignItems: "center", gap: "0.6rem" }}>
              <HardDrive size={16} color={activeData.color} style={{ flexShrink: 0 }} />
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.80rem", color: "#F5F1E8", fontWeight: 500 }}>
                {activeData.specs}
              </span>
            </div>

            {/* Rol en Workspace MTA y Reglas de Retención */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.55rem", marginTop: "0.1rem" }}>
              <div style={{ background: "#141414", border: "1px solid rgba(245,241,232,0.1)", padding: "0.55rem 0.75rem" }}>
                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.76rem", color: "#7a9b5c", display: "block", fontWeight: 700, marginBottom: "0.2rem" }}>
                  ROL EN MTA SOFTWARE
                </span>
                <span style={{ fontFamily: "Inter, system-ui, sans-serif", fontSize: "0.84rem", color: "rgba(245,241,232,0.9)", lineHeight: 1.4, display: "block" }}>
                  {activeData.roleMta}
                </span>
              </div>
              <div style={{ background: "#141414", border: "1px solid rgba(245,241,232,0.1)", padding: "0.55rem 0.75rem" }}>
                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.76rem", color: "#d4a017", display: "block", fontWeight: 700, marginBottom: "0.2rem" }}>
                  REGLA DE PERSISTENCIA
                </span>
                <span style={{ fontFamily: "Inter, system-ui, sans-serif", fontSize: "0.84rem", color: "rgba(245,241,232,0.9)", lineHeight: 1.4, display: "block" }}>
                  {activeData.retentionFeature}
                </span>
              </div>
            </div>

            {/* Veredicto de superación de Hostinger */}
            <div style={{ borderLeft: `3px solid ${activeData.color}`, background: "rgba(255,255,255,0.02)", padding: "0.45rem 0.75rem", marginTop: "0.1rem" }}>
              <span style={{ fontFamily: "Inter, system-ui, sans-serif", fontSize: "0.84rem", color: "rgba(245,241,232,0.92)", lineHeight: 1.4, display: "block" }}>
                <strong>Superación de Hostinger:</strong> {activeData.whyChosen}
              </span>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Panel Interactivo: Simulador de Transición de Ciclo de Vida S3 */}
        <motion.div variants={fadeUp(0.30)} initial="hidden" animate={entered ? "visible" : "hidden"}
          style={{ background: "#0c0c0c", border: "1.5px solid rgba(212,160,23,0.35)", padding: "0.75rem 1.05rem", display: "flex", flexDirection: "column", gap: "0.45rem" }}>
          
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.55rem" }}>
              <TrendingDown size={16} color="#7a9b5c" />
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.82rem", color: "#d4a017", fontWeight: 700 }}>
                SIMULADOR DE REGLA S3 LIFECYCLE (AHORRO 84%)
              </span>
            </div>

            {/* Botones de Selección de Día de Ciclo de Vida */}
            <div style={{ display: "flex", gap: "0.35rem" }}>
              {[
                { day: 0, label: "Día 1: Standard" },
                { day: 30, label: "Día 30: IA (-46%)" },
                { day: 90, label: "Día 90: Glacier (-84%)" },
              ].map((step) => (
                <button
                  key={step.day}
                  type="button"
                  onClick={() => handleRunLifecycleSimulation(step.day)}
                  disabled={isMigrating}
                  style={{
                    background: lifecycleDay === step.day ? "#d4a017" : "#161618",
                    color: lifecycleDay === step.day ? "#0A0A0A" : "rgba(245,241,232,0.85)",
                    border: lifecycleDay === step.day ? "1px solid #d4a017" : "1px solid rgba(255,255,255,0.1)",
                    padding: "0.26rem 0.60rem",
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: "0.74rem",
                    fontWeight: 600,
                    cursor: isMigrating ? "wait" : "pointer",
                    transition: "all 0.15s ease",
                  }}
                >
                  {step.label}
                </button>
              ))}
            </div>
          </div>

          {/* Consola de Salida del Ciclo de Vida */}
          <div style={{ background: "#050506", border: "1px solid rgba(255,255,255,0.08)", padding: "0.55rem 0.80rem", minHeight: "48px", display: "flex", flexDirection: "column", justifyContent: "center" }}>
            {isMigrating && (
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.76rem", color: "#d4a017" }}>
                ➜ [LIFECYCLE_ENGINE] Transfiriendo bloques de almacenamiento y recalculando tarifa por gigabyte...
              </div>
            )}

            {!isMigrating && !simResults && (
              <span style={{ fontFamily: "Inter, system-ui, sans-serif", fontSize: "0.82rem", color: "rgba(245,241,232,0.65)" }}>
                Selecciona una etapa temporal para evaluar la transición automática de costos en AWS S3.
              </span>
            )}

            {!isMigrating && simResults && (
              <div style={{ display: "grid", gridTemplateColumns: "1.3fr 1fr", gap: "0.6rem", alignItems: "center" }}>
                <div>
                  <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.78rem", color: "#7a9b5c", fontWeight: 700 }}>
                    ✔ NIVEL ACTIVO: {simResults.tier} ({simResults.timeline})
                  </span>
                  <div style={{ fontFamily: "Inter, system-ui, sans-serif", fontSize: "0.78rem", color: "rgba(245,241,232,0.9)", marginTop: "0.1rem" }}>
                    {simResults.impact}
                  </div>
                </div>
                <div style={{ borderLeft: "1px solid rgba(255,255,255,0.1)", paddingLeft: "0.65rem", display: "flex", flexDirection: "column", gap: "0.2rem" }}>
                  <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.74rem", color: "rgba(245,241,232,0.75)" }}>
                    COSTO TB: <strong style={{ color: "#F5F1E8" }}>{simResults.costPerTB}</strong>
                  </span>
                  <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.74rem", color: "rgba(245,241,232,0.75)" }}>
                    AHORRO: <strong style={{ color: "#7a9b5c" }}>{simResults.savings}</strong>
                  </span>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>

      {/* ══════════════ COLUMNA DERECHA (50%): Canvas 3D de Almacenamiento ══════════════ */}
      <div style={{ flex: "0 0 50%", position: "relative", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", overflow: "hidden", borderLeft: "1px solid rgba(245,241,232,0.1)", background: "radial-gradient(ellipse at center, #141414 0%, #0a0a0a 85%)" }}>

        {/* Cabecera Técnica Flotante con Modo de Enfoque */}
        <div style={{ position: "absolute", top: "1.2rem", left: "1.5rem", right: "1.5rem", display: "flex", justifyContent: "space-between", alignItems: "center", zIndex: 10, pointerEvents: "none" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.55rem" }}>
            <span style={{ width: 9, height: 9, borderRadius: "50%", background: activeData.color, boxShadow: `0 0 10px ${activeData.color}` }} />
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.82rem", color: "#F5F1E8", letterSpacing: "0.12em", textTransform: "uppercase", fontWeight: 700 }}>
              VISTA ESPACIAL: {activeData.name}
            </span>
          </div>
          <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.72rem", color: "rgba(245,241,232,0.6)", background: "rgba(0,0,0,0.5)", border: "1px solid rgba(245,241,232,0.15)", padding: "0.25rem 0.65rem", fontWeight: 600 }}>
            INTERACTIVE WEBGL 3D
          </span>
        </div>

        {/* Contenedor del Canvas Three.js */}
        <div style={{ width: "100%", height: "100%", position: "relative" }}>
          <StorageArchitecturesCanvas
            selectedStorage={selectedStorage}
            isMigrating={isMigrating}
            lifecycleTier={lifecycleDay === 0 ? "standard" : lifecycleDay === 30 ? "ia" : "glacier"}
          />
        </div>

        {/* Badge inferior con los 3 servicios de almacenamiento */}
        <div
          style={{
            position: "absolute",
            bottom: "1.2rem",
            left: "1.5rem",
            right: "1.5rem",
            zIndex: 10,
            background: "rgba(10,10,12,0.9)",
            backdropFilter: "blur(8px)",
            border: "1px solid rgba(245,241,232,0.12)",
            padding: "0.65rem 1.05rem",
            display: "grid",
            gridTemplateColumns: "1fr 1fr 1fr",
            gap: "0.75rem",
            textAlign: "center",
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: "0.74rem",
          }}
        >
          <div style={{ color: selectedStorage === "s3" ? "#d4a017" : "rgba(245,241,232,0.5)" }}>
            <div style={{ fontWeight: 700 }}>1. AMAZON S3</div>
            <div style={{ fontSize: "0.68rem" }}>11 Nueves Durabilidad</div>
          </div>
          <div style={{ color: selectedStorage === "efs" ? "#7a9b5c" : "rgba(245,241,232,0.5)" }}>
            <div style={{ fontWeight: 700 }}>2. AMAZON EFS</div>
            <div style={{ fontSize: "0.68rem" }}>10 Practicantes NFS</div>
          </div>
          <div style={{ color: selectedStorage === "glacier" ? "#e8a0bf" : "rgba(245,241,232,0.5)" }}>
            <div style={{ fontWeight: 700 }}>3. S3 GLACIER</div>
            <div style={{ fontSize: "0.68rem" }}>-84% Costo Archivado</div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default S15_AlmacenamientoServicios;
