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
  Terminal,
} from "lucide-react";
import { slidesContent } from "../data/content.es.js";
import { useSlideActive } from "../hooks/useSlideActive.js";
import { DatabaseArchitecturesCanvas } from "../components/three/DatabaseArchitecturesCanvas.jsx";

const c = slidesContent.s16_basesDatos || {
  sectionNum: "04",
  badge: "BLOQUE 4 · ENTREGABLE 2",
  scriptTag: "Persistencia Administrada",
  title: "BASES DE DATOS ADMINISTRADAS EN AWS",
  subtitle: "Despliegue de Amazon RDS (PostgreSQL/MySQL) con soporte Multi-AZ para el motor relacional de Workspace MTA frente a arquitecturas NoSQL",
};

/**
 * Slide 16 — Bases de Datos Administradas en AWS (Etapa 2 - Semana 7)
 * Fiel a docs/informacion.txt:
 *  1. Amazon RDS (PostgreSQL 16) Multi-AZ: Motor relacional principal seleccionado para Workspace MTA.
 *     Garantiza transaccionalidad ACID estricta, claves foráneas (FK), JOINs SQL complejos y failover síncrono.
 *  2. Amazon Aurora Serverless v2: Siguiente hito cloud-native con 6 copias repartidas en 3 AZs y 3x throughput.
 *  3. Amazon DynamoDB (NoSQL): Evaluado y descartado para el core ERP por falta de modelo relacional; reservado para sesiones.
 *
 * Visualización 3D: DatabaseArchitecturesCanvas (Three.js WebGL sin bloqueos, torre relacional Multi-AZ, Aurora distribuido y matriz DynamoDB).
 * Simulador Dinámico: Simulador de Transacciones ACID & Failover Multi-AZ en tiempo real con conmutación en segundos.
 */
export function S16_BasesDatosServicios({ isActive: propActive } = {}) {
  const shouldReduceMotion = useReducedMotion();
  const hookActive = useSlideActive(15);
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

  // Motor activo: "rds" | "aurora" | "dynamodb"
  const [selectedEngine, setSelectedEngine] = useState("rds");

  // Simulador de Transacción y Failover
  const [isExecutingQuery, setIsExecutingQuery] = useState(false);
  const [simResults, setSimResults] = useState(null);

  useEffect(() => {
    if (!isActive) return;
    const t = setTimeout(() => setEntered(true), 40);
    return () => {
      clearTimeout(t);
      setEntered(false);
    };
  }, [isActive]);

  const enginesData = {
    rds: {
      id: "rds",
      name: "Amazon RDS (PostgreSQL 16)",
      category: "RDBMS Relacional",
      verdict: "MOTOR SELECCIONADO (ÓPTIMO)",
      verdictColor: "#7a9b5c",
      icon: Database,
      pricing: "~$15.00 / mes (db.t3.micro Free Tier)",
      specs: "PostgreSQL 16 · Réplica Standby síncrona Multi-AZ",
      roleMta: "Core ERP: Asistencia, notas, contratos y facturación con integridad referencial (FK).",
      storageFeature: "SSD gp3 persistente con IOPS dedicadas y backups diarios automáticos.",
      whyChosen: "Supera MySQL de Hostinger: aísla memoria y elimina bloqueos de tablas.",
    },
    aurora: {
      id: "aurora",
      name: "Amazon Aurora Serverless v2",
      category: "Cloud-Native",
      verdict: "SIGUIENTE HITO DE ESCALA",
      verdictColor: "#d4a017",
      icon: Sparkles,
      pricing: "Por consumo ($0.12 / ACU-hora)",
      specs: "6 copias replicadas en 3 Zonas de Disponibilidad (AZs)",
      roleMta: "Fase de expansión masiva sin necesidad de aprovisionar capacidad por adelantado.",
      storageFeature: "Almacenamiento distribuido que auto-escala de 10 GB a 128 TB.",
      whyChosen: "Tolerancia a fallos: resiste la caída de un datacenter entero sin perder datos.",
    },
    dynamodb: {
      id: "dynamodb",
      name: "Amazon DynamoDB (NoSQL)",
      category: "NoSQL Clave-Valor",
      verdict: "COMPLEMENTARIO (NO PARA EL ERP)",
      verdictColor: "#e8a0bf",
      icon: Table2,
      pricing: "25 GB gratis + 25 WCUs / RCUs",
      specs: "Latencia de 1 dígito (ms) y auto-escalado horizontal ilimitado",
      roleMta: "Descartado para el ERP por falta de JOINs/FKs; reservado para tokens JWT.",
      storageFeature: "Particionamiento SSD totalmente gestionado por AWS sin mantenimiento.",
      whyChosen: "Rápido para búsquedas simples, pero inviable para la lógica relacional de notas.",
    },
  };

  const activeData = enginesData[selectedEngine];

  // Matriz de requerimientos técnicos
  const requirements = [
    { label: "ACID", rds: true, aurora: true, dynamodb: "parcial" },
    { label: "Claves FK", rds: true, aurora: true, dynamodb: false },
    { label: "JOINs SQL", rds: true, aurora: true, dynamodb: false },
    { label: "Multi-AZ", rds: true, aurora: true, dynamodb: true },
    { label: "Free Tier", rds: true, aurora: false, dynamodb: true },
  ];

  const RequirementIcon = ({ val }) => {
    if (val === true) return <CheckCircle2 size={16} style={{ color: "#7a9b5c" }} />;
    if (val === false) return <XCircle size={16} style={{ color: "#c6432b" }} />;
    return <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.68rem", color: "#d4a017", fontWeight: 700 }}>PARCIAL</span>;
  };

  // Simulación de consulta SQL y verificación transaccional
  const handleRunQuerySimulation = (engineKey) => {
    setIsExecutingQuery(true);
    setSimResults(null);

    setTimeout(() => {
      if (engineKey === "rds") {
        setSimResults({
          engine: "Amazon RDS PostgreSQL 16 (Multi-AZ)",
          query: "BEGIN; UPDATE mta_asistencia SET estado='PRESENTE'; COMMIT;",
          latency: "4 ms",
          acidStatus: "ACID Verificado (Commit síncrono)",
          impact: "Cero inconsistencias en cálculo de notas. Relaciones FK intactas.",
        });
      } else if (engineKey === "aurora") {
        setSimResults({
          engine: "Amazon Aurora Serverless v2",
          query: "SELECT p.nombre, a.asistencia FROM practicantes p JOIN ...",
          latency: "1.8 ms",
          acidStatus: "6 copias replicadas en 3 AZs",
          impact: "Throughput 3x superior con tolerancia a fallas de infraestructura.",
        });
      } else {
        setSimResults({
          engine: "Amazon DynamoDB (NoSQL)",
          query: "GetItem: PK=USER#P01 SK=SESSION#ACTIVE",
          latency: "2 ms",
          acidStatus: "Lectura Consistente Clave-Valor",
          impact: "Óptimo para sesiones, pero requiere duplicar datos para nóminas.",
        });
      }
      setIsExecutingQuery(false);
    }, 700);
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
              POSTGRESQL MULTI-AZ
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

        {/* Selector de 3 Motores de Bases de Datos */}
        <motion.div variants={fadeUp(0.20)} initial="hidden" animate={entered ? "visible" : "hidden"}
          style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "0.5rem", background: "rgba(18,18,18,0.9)", border: "1.5px solid rgba(245,241,232,0.15)", padding: "0.45rem" }}>
          {[
            { id: "rds", label: "AMAZON RDS (POSTGRESQL)", icon: Database, color: "#7a9b5c" },
            { id: "aurora", label: "AURORA SERVERLESS v2", icon: Sparkles, color: "#d4a017" },
            { id: "dynamodb", label: "AMAZON DYNAMODB", icon: Table2, color: "#e8a0bf" },
          ].map((tab) => {
            const isSel = selectedEngine === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setSelectedEngine(tab.id)}
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

        {/* Ficha Técnica Dinámica del Motor Seleccionado */}
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedEngine}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.18 }}
            style={{
              background: "#0c0c0c",
              border: `1.5px solid ${activeData.verdictColor}55`,
              padding: "0.85rem 1.05rem",
              display: "flex",
              flexDirection: "column",
              gap: "0.45rem",
            }}
          >
            {/* Título del motor y estimación de precio */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.86rem", color: activeData.verdictColor, fontWeight: 700 }}>
                {activeData.category.toUpperCase()} · {activeData.name.toUpperCase()}
              </span>
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.78rem", color: "#d4a017", fontWeight: 700, background: "rgba(212,160,23,0.12)", padding: "0.2rem 0.55rem", border: "1px solid rgba(212,160,23,0.35)" }}>
                {activeData.pricing}
              </span>
            </div>

            {/* Especificaciones clave */}
            <div style={{ background: "#141414", border: "1px solid rgba(245,241,232,0.1)", padding: "0.45rem 0.75rem", display: "flex", alignItems: "center", gap: "0.6rem" }}>
              <Cpu size={16} color={activeData.verdictColor} style={{ flexShrink: 0 }} />
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.80rem", color: "#F5F1E8", fontWeight: 500 }}>
                {activeData.specs}
              </span>
            </div>

            {/* Rol en Workspace MTA y Almacenamiento/Persistencia */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.55rem", marginTop: "0.1rem" }}>
              <div style={{ background: "#141414", border: "1px solid rgba(245,241,232,0.1)", padding: "0.55rem 0.75rem" }}>
                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.76rem", color: "#7a9b5c", display: "block", fontWeight: 700, marginBottom: "0.2rem" }}>
                  ROL EN WORKSPACE MTA
                </span>
                <span style={{ fontFamily: "Inter, system-ui, sans-serif", fontSize: "0.84rem", color: "rgba(245,241,232,0.9)", lineHeight: 1.4, display: "block" }}>
                  {activeData.roleMta}
                </span>
              </div>
              <div style={{ background: "#141414", border: "1px solid rgba(245,241,232,0.1)", padding: "0.55rem 0.75rem" }}>
                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.76rem", color: "#d4a017", display: "block", fontWeight: 700, marginBottom: "0.2rem" }}>
                  PERSISTENCIA & DISCO
                </span>
                <span style={{ fontFamily: "Inter, system-ui, sans-serif", fontSize: "0.84rem", color: "rgba(245,241,232,0.9)", lineHeight: 1.4, display: "block" }}>
                  {activeData.storageFeature}
                </span>
              </div>
            </div>

            {/* Veredicto de superación técnica */}
            <div style={{ borderLeft: `3px solid ${activeData.verdictColor}`, background: "rgba(255,255,255,0.02)", padding: "0.45rem 0.75rem", marginTop: "0.1rem" }}>
              <span style={{ fontFamily: "Inter, system-ui, sans-serif", fontSize: "0.84rem", color: "rgba(245,241,232,0.92)", lineHeight: 1.4, display: "block" }}>
                <strong>Superación de Hostinger:</strong> {activeData.whyChosen}
              </span>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Panel Interactivo: Matriz de Requerimientos y Simulador SQL */}
        <motion.div variants={fadeUp(0.30)} initial="hidden" animate={entered ? "visible" : "hidden"}
          style={{ background: "#0c0c0c", border: "1.5px solid rgba(212,160,23,0.35)", padding: "0.75rem 1.05rem", display: "flex", flexDirection: "column", gap: "0.45rem" }}>
          
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.55rem" }}>
              <Terminal size={16} color="#d4a017" />
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.82rem", color: "#d4a017", fontWeight: 700 }}>
                SIMULADOR DE TRANSACCIÓN ACID & FAILOVER (MULTI-AZ)
              </span>
            </div>

            {simResults ? (
              <button
                type="button"
                onClick={() => setSimResults(null)}
                style={{ background: "transparent", border: "1px solid rgba(245,241,232,0.2)", color: "#F5F1E8", padding: "0.26rem 0.65rem", fontFamily: "'JetBrains Mono', monospace", fontSize: "0.74rem", cursor: "pointer", display: "flex", alignItems: "center", gap: "0.3rem" }}
              >
                <RotateCcw size={12} /> Reiniciar
              </button>
            ) : (
              <button
                type="button"
                onClick={() => handleRunQuerySimulation(selectedEngine)}
                disabled={isExecutingQuery}
                style={{ background: "#7a9b5c", border: "none", color: "#0A0A0A", padding: "0.32rem 0.85rem", fontFamily: "'JetBrains Mono', monospace", fontSize: "0.78rem", fontWeight: 700, cursor: isExecutingQuery ? "not-allowed" : "pointer", display: "flex", alignItems: "center", gap: "0.4rem" }}
              >
                <Play size={12} fill="#0A0A0A" /> {isExecutingQuery ? "Verificando ACID..." : `Ejecutar Transacción ${selectedEngine.toUpperCase()}`}
              </button>
            )}
          </div>

          {/* Consola de Salida de Transacción */}
          <div style={{ background: "#050506", border: "1px solid rgba(255,255,255,0.08)", padding: "0.55rem 0.80rem", minHeight: "48px", display: "flex", flexDirection: "column", justifyContent: "center" }}>
            {isExecutingQuery && (
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.76rem", color: "#7a9b5c" }}>
                ➜ [ENGINE_IO] Validando integridad referencial, bloqueos y replicación Multi-AZ síncrona...
              </div>
            )}

            {!isExecutingQuery && !simResults && (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: "0.4rem", textAlign: "center" }}>
                {requirements.map((req) => (
                  <div key={req.label} style={{ background: "#111", padding: "0.25rem 0.35rem", border: "1px solid rgba(255,255,255,0.08)" }}>
                    <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.68rem", color: "rgba(245,241,232,0.7)", fontWeight: 600 }}>{req.label}</div>
                    <div style={{ marginTop: "0.15rem" }}><RequirementIcon val={req[selectedEngine]} /></div>
                  </div>
                ))}
              </div>
            )}

            {!isExecutingQuery && simResults && (
              <div style={{ display: "grid", gridTemplateColumns: "1.3fr 1fr", gap: "0.6rem", alignItems: "center" }}>
                <div>
                  <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.78rem", color: "#7a9b5c", fontWeight: 700 }}>
                    ✔ {simResults.engine}
                  </span>
                  <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.72rem", color: "#d4a017", marginTop: "0.1rem" }}>
                    {simResults.query}
                  </div>
                  <div style={{ fontFamily: "Inter, system-ui, sans-serif", fontSize: "0.78rem", color: "rgba(245,241,232,0.9)", marginTop: "0.1rem" }}>
                    {simResults.impact}
                  </div>
                </div>
                <div style={{ borderLeft: "1px solid rgba(255,255,255,0.1)", paddingLeft: "0.65rem", display: "flex", flexDirection: "column", gap: "0.2rem" }}>
                  <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.74rem", color: "rgba(245,241,232,0.75)" }}>
                    LATENCIA: <strong style={{ color: "#F5F1E8" }}>{simResults.latency}</strong>
                  </span>
                  <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.74rem", color: "rgba(245,241,232,0.75)" }}>
                    ESTADO: <strong style={{ color: "#7a9b5c" }}>{simResults.acidStatus}</strong>
                  </span>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>

      {/* ══════════════ COLUMNA DERECHA (50%): Canvas 3D de Bases de Datos ══════════════ */}
      <div style={{ flex: "0 0 50%", position: "relative", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", overflow: "hidden", borderLeft: "1px solid rgba(245,241,232,0.1)", background: "radial-gradient(ellipse at center, #141414 0%, #0a0a0a 85%)" }}>

        {/* Cabecera Técnica Flotante con Modo de Enfoque */}
        <div style={{ position: "absolute", top: "1.2rem", left: "1.5rem", right: "1.5rem", display: "flex", justifyContent: "space-between", alignItems: "center", zIndex: 10, pointerEvents: "none" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.55rem" }}>
            <span style={{ width: 9, height: 9, borderRadius: "50%", background: activeData.verdictColor, boxShadow: `0 0 10px ${activeData.verdictColor}` }} />
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
          <DatabaseArchitecturesCanvas
            selectedEngine={selectedEngine}
            isExecutingQuery={isExecutingQuery}
          />
        </div>

        {/* Badge inferior con los 3 motores */}
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
          <div style={{ color: selectedEngine === "rds" ? "#7a9b5c" : "rgba(245,241,232,0.5)" }}>
            <div style={{ fontWeight: 700 }}>1. AMAZON RDS</div>
            <div style={{ fontSize: "0.68rem" }}>PostgreSQL 16 Multi-AZ</div>
          </div>
          <div style={{ color: selectedEngine === "aurora" ? "#d4a017" : "rgba(245,241,232,0.5)" }}>
            <div style={{ fontWeight: 700 }}>2. AURORA SERVERLESS</div>
            <div style={{ fontSize: "0.68rem" }}>6 Copias Distribuidas</div>
          </div>
          <div style={{ color: selectedEngine === "dynamodb" ? "#e8a0bf" : "rgba(245,241,232,0.5)" }}>
            <div style={{ fontWeight: 700 }}>3. DYNAMODB NoSQL</div>
            <div style={{ fontSize: "0.68rem" }}>Caché & Latencia 1ms</div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default S16_BasesDatosServicios;
