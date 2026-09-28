// src/slides/S16_BasesDatos.jsx
import { useEffect, useState, useRef } from "react";
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
} from "lucide-react";
import { slidesContent } from "../data/content.es.js";
import { useSlideActive } from "../hooks/useSlideActive.js";

const c = slidesContent.s16_basesDatos;

export function S16_BasesDatos({ isActive: propActive } = {}) {
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
  const [selectedEngine, setSelectedEngine] = useState("rds");
  const [pulse, setPulse] = useState(false);

  useEffect(() => {
    if (!isActive) return;
    const t = setTimeout(() => setEntered(true), 40);
    return () => { clearTimeout(t); setEntered(false); };
  }, [isActive]);

  useEffect(() => {
    if (!entered) return;
    const interval = setInterval(() => setPulse(p => !p), 900);
    return () => clearInterval(interval);
  }, [entered]);

  const fadeUp = (delay = 0) => ({
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 18 },
    visible: {
      opacity: 1, y: 0,
      transition: { duration: shouldReduceMotion ? 0.1 : 0.52, ease: [0.16, 1, 0.3, 1], delay },
    },
  });

  const enginesData = {
    rds: {
      id: "rds", name: "Amazon RDS (PostgreSQL 16)", type: "Relacional Administrado (RDBMS)",
      verdict: "MOTOR SELECCIONADO PRINCIPAL (ÓPTIMO)", verdictColor: "#7a9b5c",
      icon: Database,
      pricing: "~$15.00 USD/mes (db.t3.micro 750h/mes Free Tier)",
      acidSupport: true, acidLabel: "100% Transaccional ACID Estricto",
      joinsSupport: true, joinsLabel: "Soporte nativo completo para JOINs complejos",
      scaleModel: "Escalado vertical de cómputo + Réplicas de Lectura",
      mtaFit: "Crítico e indispensable: gestiona la asistencia horaria, notas de los 10 practicantes, contratos de clientes y facturación con claves foráneas estrictas.",
      desc: "Servicio administrado que automatiza aprovisionamiento, parches, respaldos diarios y conmutación por error Multi-AZ con SLA del 99.95%.",
      hostingerComp: "En Hostinger, MySQL sufría bloqueos de tablas y cuotas de consultas concurrentes; RDS aísla la memoria y escala automáticamente sin downtime.",
    },
    aurora: {
      id: "aurora", name: "Amazon Aurora (Serverless v2)", type: "Relacional Cloud-Native de Alto Rendimiento",
      verdict: "SIGUIENTE HITO DE ESCALABILIDAD", verdictColor: "#d4a017",
      icon: Sparkles,
      pricing: "Escala por ACUs ($0.12 por ACU-hora)",
      acidSupport: true, acidLabel: "100% ACID con replicación en 6 copias",
      joinsSupport: true, joinsLabel: "Soporte nativo PostgreSQL con 3x más rendimiento",
      scaleModel: "Auto-escalado instantáneo en fracciones de segundo hasta 128 TB",
      mtaFit: "Ideal para la fase en que Workspace MTA incorpore cientos de empleados y clientes concurrentes, evitando la administración manual de capacidad.",
      desc: "Motor relacional compatible con PostgreSQL diseñado para la nube con almacenamiento distribuido y auto-reparable que escala hasta 128 TB.",
      hostingerComp: "Multiplica por 3 el throughput de PostgreSQL tradicional y tolera la pérdida completa de dos copias de datos sin interrumpir lecturas.",
    },
    dynamodb: {
      id: "dynamodb", name: "Amazon DynamoDB (NoSQL)", type: "NoSQL Clave-Valor y Documentos",
      verdict: "COMPLEMENTARIO (NO PARA CORE ERP)", verdictColor: "#e8a0bf",
      icon: Table2,
      pricing: "25 GB gratis + 25 WCUs / 25 RCUs Free Tier",
      acidSupport: true, acidLabel: "Transacciones soportadas (sin modelo relacional)",
      joinsSupport: false, joinsLabel: "No soporta JOINs relacionales ni claves foráneas",
      scaleModel: "Escalado horizontal automático sin límites (latencia de 1 dígito ms)",
      mtaFit: "Descartado para el ERP core por falta de relaciones complejas; reservado para caché de sesiones de practicantes y telemetría de clics.",
      desc: "Base de datos NoSQL serverless de ultra baja latencia diseñada para cargas masivas con acceso simple por clave de partición.",
      hostingerComp: "Excelente para peticiones simples de alta velocidad, pero obliga a duplicar datos manualmente para emular relaciones de empleados y proyectos.",
    },
  };

  const current = enginesData[selectedEngine] || enginesData.rds;

  // Requirement matrix rows
  const requirements = [
    { label: "Transaccionalidad ACID", rds: true, aurora: true, dynamodb: "parcial" },
    { label: "Claves Foráneas (FK)", rds: true, aurora: true, dynamodb: false },
    { label: "JOINs SQL Complejos", rds: true, aurora: true, dynamodb: false },
    { label: "Escalado Automático", rds: "vertical", aurora: true, dynamodb: true },
    { label: "Multi-AZ Nativo", rds: true, aurora: true, dynamodb: true },
    { label: "Costo inicial (Free Tier)", rds: true, aurora: false, dynamodb: true },
  ];

  const RequirementIcon = ({ val }) => {
    if (val === true) return <CheckCircle2 size={13} style={{ color: "#7a9b5c" }} />;
    if (val === false) return <XCircle size={13} style={{ color: "#c6432b" }} />;
    return <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.5rem", color: "#d4a017", fontWeight: 700 }}>{val === "parcial" ? "PARCIAL" : "VERT."}</span>;
  };

  return (
    <section
      ref={sectionRef}
      className="slide-fullscreen"
      style={{ width: "100%", height: "100%", position: "relative", background: "#0A0A0A", overflow: "hidden", display: "flex", flexDirection: "row" }}
    >
      <div aria-hidden="true" style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(245,241,232,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(245,241,232,0.025) 1px, transparent 1px)", backgroundSize: "64px 64px", pointerEvents: "none", zIndex: 0 }} />
      <div aria-hidden="true" style={{ position: "absolute", inset: 0, background: "repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,0,0,0.07) 3px, rgba(0,0,0,0.07) 6px)", pointerEvents: "none", zIndex: 1 }} />
      <div aria-hidden="true" style={{ position: "absolute", inset: 0, background: "radial-gradient(circle at 75% 50%, rgba(212,160,23,0.18) 0%, transparent 65%)", pointerEvents: "none", zIndex: 1 }} />

      <motion.div aria-hidden="true"
        initial={{ scaleY: 0, transformOrigin: "top" }}
        animate={entered ? { scaleY: 1 } : { scaleY: 0 }}
        transition={{ duration: shouldReduceMotion ? 0.1 : 0.65, ease: [0.83, 0, 0.17, 1], delay: 0.05 }}
        style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 4, background: "#d4a017", zIndex: 3 }}
      />

      {/* ══════════════ COLUMNA IZQUIERDA ══════════════ */}
      <div style={{ flex: "0 0 50%", display: "flex", flexDirection: "column", justifyContent: "center", padding: "2.5rem 3rem 2.5rem 4.8rem", position: "relative", zIndex: 2, gap: "0.85rem" }}>

        <div style={{ display: "flex", flexDirection: "column", gap: "0.2rem" }}>
          <motion.div variants={fadeUp(0.04)} initial="hidden" animate={entered ? "visible" : "hidden"} style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.65rem", letterSpacing: "0.2em", textTransform: "uppercase", fontWeight: 700, color: "#d4a017", background: "rgba(212,160,23,0.12)", border: "1px solid rgba(212,160,23,0.4)", padding: "0.25rem 0.65rem" }}>
              [ {c.badge} ]
            </span>
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.62rem", letterSpacing: "0.15em", color: "rgba(245,241,232,0.45)" }}>
              SEC_16 // MANAGED_DATABASES
            </span>
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.58rem", color: "#7a9b5c", background: "rgba(122,155,92,0.15)", border: "1px solid rgba(122,155,92,0.35)", padding: "0.15rem 0.45rem", fontWeight: 700 }}>
              RDS · AURORA · DYNAMODB
            </span>
          </motion.div>

          <motion.p variants={fadeUp(0.08)} initial="hidden" animate={entered ? "visible" : "hidden"}
            style={{ fontFamily: "Yellowtail, cursive", fontSize: "clamp(1.3rem, 2vw, 1.8rem)", color: "#e8a0bf", lineHeight: 1.1, margin: "0.15rem 0 0 0" }}>
            {c.scriptTag}
          </motion.p>

          <motion.h1 variants={fadeUp(0.12)} initial="hidden" animate={entered ? "visible" : "hidden"}
            style={{ fontFamily: "'Archivo Black', 'Arial Black', sans-serif", fontSize: "clamp(1.6rem, 2.3vw, 2.2rem)", color: "#F5F1E8", letterSpacing: "-0.025em", lineHeight: 1.05, textTransform: "uppercase", margin: 0 }}>
            {c.title}
          </motion.h1>

          <motion.div
            initial={{ clipPath: "inset(0 100% 0 0)" }}
            animate={entered ? { clipPath: "inset(0 0% 0 0)" } : { clipPath: "inset(0 100% 0 0)" }}
            transition={{ duration: shouldReduceMotion ? 0.1 : 0.55, ease: [0.83, 0, 0.17, 1], delay: 0.18 }}
            style={{ height: 2, background: "#d4a017", width: "100%", maxWidth: 220, margin: "0.2rem 0" }}
          />

          <motion.p variants={fadeUp(0.16)} initial="hidden" animate={entered ? "visible" : "hidden"}
            style={{ fontFamily: "system-ui, -apple-system, sans-serif", fontSize: "clamp(0.85rem, 1.05vw, 0.95rem)", color: "rgba(245,241,232,0.65)", margin: 0, lineHeight: 1.4 }}>
            {c.subtitle}
          </motion.p>
        </div>

        {/* Engine selector */}
        <motion.div variants={fadeUp(0.22)} initial="hidden" animate={entered ? "visible" : "hidden"}
          style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "0.4rem", background: "rgba(18,18,18,0.9)", border: "1.5px solid rgba(245,241,232,0.15)", padding: "0.35rem" }}>
          {Object.values(enginesData).map((eng) => {
            const isSelected = selectedEngine === eng.id;
            return (
              <button key={eng.id} type="button" onClick={() => setSelectedEngine(eng.id)}
                style={{ background: isSelected ? "#d4a017" : "transparent", color: isSelected ? "#0A0A0A" : "rgba(245,241,232,0.7)", border: isSelected ? "1px solid #d4a017" : "1px solid rgba(245,241,232,0.1)", padding: "0.45rem 0.35rem", fontFamily: "'JetBrains Mono', monospace", fontSize: "0.6rem", fontWeight: 700, cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: "0.2rem", transition: "all 0.18s ease", position: "relative", overflow: "hidden" }}>
                {isSelected && (
                  <motion.div layoutId="engine-selector-glow"
                    style={{ position: "absolute", inset: 0, background: "rgba(212,160,23,0.15)" }}
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
                <eng.icon size={14} style={{ position: "relative", zIndex: 1 }} />
                <span style={{ position: "relative", zIndex: 1 }}>{eng.id.toUpperCase()}</span>
              </button>
            );
          })}
        </motion.div>

        {/* Engine verdict status bar */}
        <motion.div variants={fadeUp(0.28)} initial="hidden" animate={entered ? "visible" : "hidden"}
          style={{ padding: "0.45rem 0.75rem", background: "#0A0A0A", border: "1px solid rgba(245,241,232,0.12)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <motion.div animate={{ opacity: pulse ? 1 : 0.3, scale: pulse ? 1.2 : 0.9 }} transition={{ duration: 0.5 }}
              style={{ width: 7, height: 7, borderRadius: "50%", background: current.verdictColor }} />
            <Activity size={13} style={{ color: "#d4a017", flexShrink: 0 }} />
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.62rem", color: "#d4a017", fontWeight: 700 }}>ENGINE VERDICT:</span>
          </div>
          <AnimatePresence mode="wait">
            <motion.span key={selectedEngine + "-verdict"}
              initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.22 }}
              style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.6rem", color: current.verdictColor, fontWeight: 700 }}>
              {current.verdict}
            </motion.span>
          </AnimatePresence>
        </motion.div>

        {/* Requirements Matrix */}
        <motion.div variants={fadeUp(0.34)} initial="hidden" animate={entered ? "visible" : "hidden"}
          style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
          <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.58rem", color: "#d4a017", letterSpacing: "0.1em", fontWeight: 700 }}>
            JUSTIFICACIÓN TÉCNICA SEGÚN CARGAS DE TRABAJO DE MTA:
          </span>
          <div style={{ background: "#0c0c0c", border: "1.5px solid rgba(212,160,23,0.35)", overflow: "hidden" }}>
            {/* Table header */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", borderBottom: "1px solid rgba(245,241,232,0.1)", padding: "0.3rem 0.6rem", background: "#111" }}>
              {["REQUERIMIENTO", "RDS", "AURORA", "DYNAMO"].map(h => (
                <span key={h} style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.5rem", color: "rgba(245,241,232,0.4)", fontWeight: 700, textAlign: h !== "REQUERIMIENTO" ? "center" : "left" }}>{h}</span>
              ))}
            </div>
            {requirements.map((row, i) => (
              <motion.div key={row.label}
                initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.25, delay: entered ? 0.38 + i * 0.06 : 0 }}
                style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", padding: "0.32rem 0.6rem", borderBottom: i < requirements.length - 1 ? "1px solid rgba(245,241,232,0.06)" : "none", background: i % 2 === 0 ? "transparent" : "rgba(255,255,255,0.015)" }}>
                <span style={{ fontFamily: "system-ui, sans-serif", fontSize: "0.62rem", color: "rgba(245,241,232,0.7)" }}>{row.label}</span>
                {[row.rds, row.aurora, row.dynamodb].map((val, j) => (
                  <div key={j} style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                    <RequirementIcon val={val} />
                  </div>
                ))}
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* ══════════════ COLUMNA DERECHA ══════════════ */}
      <div style={{ flex: "0 0 50%", position: "relative", display: "flex", flexDirection: "column", justifyContent: "center", padding: "2.5rem 4rem 2.5rem 1rem", zIndex: 2, gap: "0.75rem" }}>

        <motion.div variants={fadeUp(0.1)} initial="hidden" animate={entered ? "visible" : "hidden"}
          style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0.3rem 0.6rem", background: "#101010", border: "1px solid rgba(245,241,232,0.12)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <Database size={13} style={{ color: "#d4a017" }} />
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.62rem", letterSpacing: "0.15em", color: "rgba(245,241,232,0.7)", textTransform: "uppercase", fontWeight: 700 }}>
              DATABASE ENGINE MATRIX // SEMANA 7
            </span>
          </div>
          <AnimatePresence mode="wait">
            <motion.span key={selectedEngine + "-type"}
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}
              style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.55rem", color: current.verdictColor, fontWeight: 700 }}>
              {current.type}
            </motion.span>
          </AnimatePresence>
        </motion.div>

        {/* Detail Card — AnimatePresence swap */}
        <AnimatePresence mode="wait">
          <motion.div key={selectedEngine}
            initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 20, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: shouldReduceMotion ? 0 : -16, scale: 0.97 }}
            transition={{ duration: shouldReduceMotion ? 0.1 : 0.38, ease: [0.16, 1, 0.3, 1] }}
            style={{ background: "#0c0c0c", border: `2px solid ${current.verdictColor}55`, padding: "0.9rem", display: "flex", flexDirection: "column", gap: "0.65rem" }}>

            <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
              <motion.div
                initial={{ scale: 0, rotate: -20 }} animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", stiffness: 400, damping: 20, delay: 0.05 }}
                style={{ width: 36, height: 36, background: `${current.verdictColor}22`, border: `1px solid ${current.verdictColor}`, display: "flex", alignItems: "center", justifyContent: "center", color: current.verdictColor }}>
                <current.icon size={20} />
              </motion.div>
              <div>
                <h3 style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: "0.95rem", color: "#F5F1E8", margin: 0, textTransform: "uppercase" }}>{current.name}</h3>
                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.58rem", color: current.verdictColor, fontWeight: 700 }}>{current.verdict}</span>
              </div>
            </div>

            <p style={{ fontFamily: "system-ui, sans-serif", fontSize: "0.74rem", color: "rgba(245,241,232,0.85)", lineHeight: 1.4, margin: 0 }}>
              {current.desc}
            </p>

            {/* ACID + JOINs chips */}
            <motion.div initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.3, delay: 0.1 }}
              style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
              {[
                { label: current.acidLabel, ok: current.acidSupport },
                { label: current.joinsLabel, ok: current.joinsSupport },
              ].map((chip, i) => (
                <span key={i} style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.52rem", color: chip.ok ? "#7a9b5c" : "#c6432b", background: chip.ok ? "rgba(122,155,92,0.1)" : "rgba(198,67,43,0.1)", border: `1px solid ${chip.ok ? "rgba(122,155,92,0.35)" : "rgba(198,67,43,0.35)"}`, padding: "0.2rem 0.5rem", fontWeight: 700 }}>
                  {chip.ok ? "✓" : "✗"} {chip.label}
                </span>
              ))}
            </motion.div>

            <motion.div initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.3, delay: 0.18 }}
              style={{ background: "#121212", border: "1px solid rgba(245,241,232,0.1)", padding: "0.5rem 0.65rem", display: "flex", flexDirection: "column", gap: "0.2rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                <ShieldCheck size={12} style={{ color: "#d4a017" }} />
                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.58rem", color: "#d4a017", fontWeight: 700 }}>ESCALABILIDAD Y RESILIENCIA:</span>
              </div>
              <p style={{ fontFamily: "system-ui, sans-serif", fontSize: "0.68rem", color: "rgba(245,241,232,0.75)", margin: 0, lineHeight: 1.3 }}>{current.scaleModel}</p>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.3, delay: 0.22 }}
              style={{ borderLeft: "3px solid #d4a017", background: "rgba(212,160,23,0.06)", padding: "0.45rem 0.65rem" }}>
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.55rem", color: "#d4a017", fontWeight: 700, display: "block", marginBottom: "0.15rem" }}>
                CASO EN WORKSPACE MTA:
              </span>
              <p style={{ fontFamily: "system-ui, sans-serif", fontSize: "0.68rem", color: "#F5F1E8", margin: 0, lineHeight: 1.35 }}>{current.mtaFit}</p>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.3, delay: 0.3 }}
              style={{ borderLeft: "3px solid #7a9b5c", background: "rgba(122,155,92,0.06)", padding: "0.45rem 0.65rem" }}>
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.55rem", color: "#7a9b5c", fontWeight: 700, display: "block", marginBottom: "0.15rem" }}>
                SUPERACIÓN DEL HOSTING COMPARTIDO:
              </span>
              <p style={{ fontFamily: "system-ui, sans-serif", fontSize: "0.68rem", color: "#F5F1E8", margin: 0, lineHeight: 1.35 }}>{current.hostingerComp}</p>
            </motion.div>
          </motion.div>
        </AnimatePresence>

        <motion.div variants={fadeUp(0.45)} initial="hidden" animate={entered ? "visible" : "hidden"}
          style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.55rem", color: "rgba(245,241,232,0.45)", display: "flex", justifyContent: "space-between" }}>
          <span>ENTREGABLE 2 · PERSISTENCIA ADMINISTRADA</span>
          <span style={{ color: "#d4a017" }}>SEMANA 7 · SENATI</span>
        </motion.div>
      </div>
    </section>
  );
}

export default S16_BasesDatos;
