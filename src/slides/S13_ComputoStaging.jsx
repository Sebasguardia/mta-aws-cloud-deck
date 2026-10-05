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
  RotateCcw,
} from "lucide-react";
import { slidesContent } from "../data/content.es.js";
import { useSlideActive } from "../hooks/useSlideActive.js";
import { StagingInstanceCanvas } from "../components/three/StagingInstanceCanvas.jsx";

const c = slidesContent.s13_computo_staging || {
  badge: "BLOQUE 4 · ENTREGABLE 2",
  scriptTag: "Capa de Computación",
  title: "ENTORNO DE PRUEBAS Y STAGING EN AMAZON EC2",
  subtitle: "Centralización de compilación y pruebas en la nube con Amazon EC2 (t2/t3.micro) y almacenamiento persistente Amazon EBS (30 GB gp3) para los 10 practicantes de MTA Software",
};

/**
 * Slide 13 — Capa de Computación: Entorno de Staging Unificado (EC2 + EBS gp3)
 *
 * Directivas de diseño:
 *  - /industrial-brutalist-ui: terminal técnica oscura (#0A0A0A), líneas nítidas, acentos en #d4a017 y #7a9b5c.
 *  - /impeccable: layout split 50/50 balanceado sin scroll, contenido 100% fiel a docs/informacion.txt.
 *  - /threejs-geometry + /threejs-animation + /threejs-interaction: visualización 3D interactiva
 *    con el servidor Blade EC2, disco EBS 30GB y los 10 practicantes (P01..P10) con transmisión de paquetes.
 *  - /animate: simulador dinámico en vivo "Simular despliegue a Staging vs Caos en Localhost".
 */
export function S13_ComputoStaging({ isActive: propActive } = {}) {
  const shouldReduceMotion = useReducedMotion();
  const hookActive = useSlideActive(12);
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

  // Estados interactivos
  const [activeTab, setActiveTab] = useState("ec2"); // "ec2" | "ebs" | "workflow"
  const [selectedInstance, setSelectedInstance] = useState("t3.micro");
  const [serverState, setServerState] = useState("running"); // "running" | "stopped"
  const [focusCamera, setFocusCamera] = useState("panoramic"); // "panoramic" | "server" | "ebs" | "interns"
  const [pulse, setPulse] = useState(false);

  // Simulador de Pipeline de Staging en vivo
  const [simStep, setSimStep] = useState(0); // 0=reposo, 1=git push, 2=tests jest, 3=build staging, 4=staging ok!
  const [isSimulating, setIsSimulating] = useState(false);

  useEffect(() => {
    if (!isActive) return;
    const t = setTimeout(() => setEntered(true), 40);
    return () => { clearTimeout(t); setEntered(false); };
  }, [isActive]);

  useEffect(() => {
    if (!entered) return;
    const interval = setInterval(() => setPulse(p => !p), 1200);
    return () => clearInterval(interval);
  }, [entered]);

  // Manejador del simulador interactivo
  const runStagingSimulation = () => {
    if (serverState === "stopped") {
      setServerState("running");
    }
    setIsSimulating(true);
    setSimStep(1);

    const timeouts = [
      setTimeout(() => setSimStep(2), 900),
      setTimeout(() => setSimStep(3), 1800),
      setTimeout(() => {
        setSimStep(4);
        setIsSimulating(false);
      }, 2800),
    ];

    return () => timeouts.forEach(clearTimeout);
  };

  const resetSimulation = () => {
    setSimStep(0);
    setIsSimulating(false);
  };

  const fadeUp = (delay = 0) => ({
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 16 },
    visible: {
      opacity: 1, y: 0,
      transition: { duration: shouldReduceMotion ? 0.1 : 0.50, ease: [0.16, 1, 0.3, 1], delay },
    },
  });

  const instanceDetails = {
    "t2.micro": {
      name: "Amazon EC2 t2.micro",
      vCPU: "1 vCPU (Intel Xeon)",
      ram: "1.0 GiB Memoria",
      credits: "Burstable Standard",
      cost: "$0.00 USD (750h Free Tier)",
      network: "Baja a Moderada",
      purpose: "Pruebas unitarias y despliegues ligeros individuales.",
      verdict: "Suficiente para pruebas aisladas, pero limitado al compilar el ERP completo.",
    },
    "t3.micro": {
      name: "Amazon EC2 t3.micro (Recomendado)",
      vCPU: "2 vCPU (Intel Xeon Platinum)",
      ram: "1.0 GiB Memoria",
      credits: "T3 Unlimited (Sin freno de CPU)",
      cost: "$0.00 USD (750h Free Tier 12m)",
      network: "Hasta 5 Gbps",
      purpose: "Entorno ideal para compilar Next.js/React y ejecutar tests del ERP Workspace MTA.",
      verdict: "Opción óptima de equilibrio: 2 núcleos virtuales y sin costo en Capa Gratuita.",
    },
    "t4g.small": {
      name: "Amazon EC2 t4g.small (Graviton2)",
      vCPU: "2 vCPU (AWS Graviton2 ARM)",
      ram: "2.0 GiB Memoria",
      credits: "Rendimiento Dedicado ARM64",
      cost: "~$12.26 USD / mes",
      network: "Hasta 5 Gbps",
      purpose: "Entorno de alta concurrencia para los 10 practicantes simultáneos.",
      verdict: "40% mejor relación precio/rendimiento para cuando termine el Free Tier.",
    },
  };

  const currInst = instanceDetails[selectedInstance];

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
      <div style={{ flex: "0 0 50%", display: "flex", flexDirection: "column", justifyContent: "center", padding: "1.8rem 2.5rem 1.8rem 4.5rem", position: "relative", zIndex: 2, gap: "0.75rem" }}>

        {/* Header Editorial */}
        <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
          <motion.div variants={fadeUp(0.04)} initial="hidden" animate={entered ? "visible" : "hidden"} style={{ display: "flex", alignItems: "center", gap: "0.75rem", flexWrap: "wrap" }}>
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.92rem", letterSpacing: "0.15em", textTransform: "uppercase", fontWeight: 700, color: "#d4a017", background: "rgba(212,160,23,0.12)", border: "1px solid rgba(212,160,23,0.4)", padding: "0.32rem 0.82rem" }}>
              [ {c.badge} ]
            </span>
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.85rem", letterSpacing: "0.12em", color: "rgba(245,241,232,0.75)", fontWeight: 500 }}>
              SEC_13 // EC2_EBS_STAGING
            </span>
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.82rem", color: "#7a9b5c", background: "rgba(122,155,92,0.15)", border: "1px solid rgba(122,155,92,0.35)", padding: "0.26rem 0.68rem", fontWeight: 600 }}>
              US-EAST-1 · FREE TIER 750H
            </span>
          </motion.div>

          <motion.p variants={fadeUp(0.08)} initial="hidden" animate={entered ? "visible" : "hidden"}
            style={{ fontFamily: "Yellowtail, cursive", fontSize: "clamp(1.55rem, 2.5vw, 2.25rem)", color: "#e8a0bf", lineHeight: 1.1, margin: "0.1rem 0 0 0", fontWeight: 400 }}>
            {c.scriptTag}
          </motion.p>

          <motion.h1 variants={fadeUp(0.12)} initial="hidden" animate={entered ? "visible" : "hidden"}
            style={{ fontFamily: "'Archivo Black', 'Arial Black', sans-serif", fontSize: "clamp(1.78rem, 2.65vw, 2.55rem)", color: "#F5F1E8", letterSpacing: "-0.025em", lineHeight: 1.06, textTransform: "uppercase", margin: 0, fontWeight: 400 }}>
            {c.title}
          </motion.h1>

          <motion.div
            initial={{ clipPath: "inset(0 100% 0 0)" }}
            animate={entered ? { clipPath: "inset(0 0% 0 0)" } : { clipPath: "inset(0 100% 0 0)" }}
            transition={{ duration: shouldReduceMotion ? 0.1 : 0.55, ease: [0.83, 0, 0.17, 1], delay: 0.18 }}
            style={{ height: 2, background: "#d4a017", width: "100%", maxWidth: 240, margin: "0.15rem 0" }}
          />

          <motion.p variants={fadeUp(0.16)} initial="hidden" animate={entered ? "visible" : "hidden"}
            style={{ fontFamily: "Inter, system-ui, -apple-system, sans-serif", fontSize: "clamp(0.96rem, 1.12vw, 1.08rem)", color: "rgba(245,241,232,0.88)", margin: 0, lineHeight: 1.48, fontWeight: 400 }}>
            {c.subtitle}
          </motion.p>
        </div>

        {/* Selector de 3 Pestañas Técnicas */}
        <motion.div variants={fadeUp(0.20)} initial="hidden" animate={entered ? "visible" : "hidden"}
          style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "0.5rem", background: "rgba(18,18,18,0.9)", border: "1.5px solid rgba(245,241,232,0.15)", padding: "0.45rem" }}>
          {[
            { id: "ec2", label: "AMAZON EC2 (STAGING)", icon: Server, color: "#d4a017" },
            { id: "ebs", label: "DISCO EBS 30GB GP3", icon: HardDrive, color: "#7a9b5c" },
            { id: "workflow", label: "PIPELINE VS LOCALHOST", icon: Terminal, color: "#e8a0bf" },
          ].map((tab) => {
            const isSel = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                style={{
                  background: isSel ? tab.color : "transparent",
                  color: isSel ? "#0A0A0A" : "rgba(245,241,232,0.95)",
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

        {/* Panel Dinámico según Pestaña */}
        <AnimatePresence mode="wait">
          {activeTab === "ec2" && (
            <motion.div
              key="tab-ec2"
              initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.18 }}
              style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}
            >
              {/* Selector de Instancias */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "0.5rem" }}>
                {Object.keys(instanceDetails).map((key) => {
                  const isSelInst = selectedInstance === key;
                  return (
                    <button
                      key={key}
                      type="button"
                      onClick={() => setSelectedInstance(key)}
                      style={{
                        padding: "0.6rem 0.75rem",
                        background: isSelInst ? "rgba(212,160,23,0.15)" : "#101010",
                        border: isSelInst ? "1.5px solid #d4a017" : "1px solid rgba(245,241,232,0.12)",
                        color: isSelInst ? "#d4a017" : "rgba(245,241,232,0.75)",
                        fontFamily: "'JetBrains Mono', monospace",
                        fontSize: "0.82rem",
                        fontWeight: 600,
                        cursor: "pointer",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "flex-start",
                        gap: "0.22rem",
                        transition: "all 0.15s ease",
                      }}
                    >
                      <div style={{ display: "flex", justifyContent: "space-between", width: "100%", alignItems: "center" }}>
                        <span>{key}</span>
                        {key === "t3.micro" && (
                          <span style={{ fontSize: "0.66rem", color: "#7a9b5c", background: "rgba(122,155,92,0.15)", padding: "0.12rem 0.35rem", fontWeight: 700 }}>RECOM.</span>
                        )}
                      </div>
                      <span style={{ fontSize: "0.74rem", color: "rgba(245,241,232,0.75)", fontWeight: 400 }}>
                        {instanceDetails[key].vCPU} · {instanceDetails[key].ram}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Ficha técnica de la instancia */}
              <div style={{ background: "#0c0c0c", border: "1.5px solid rgba(212,160,23,0.35)", padding: "0.85rem 1.05rem", display: "flex", flexDirection: "column", gap: "0.4rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: "0.94rem", color: "#F5F1E8", textTransform: "uppercase", fontWeight: 400 }}>
                    {currInst.name}
                  </span>
                  <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.84rem", color: "#7a9b5c", fontWeight: 700 }}>
                    {currInst.cost}
                  </span>
                </div>
                <p style={{ fontFamily: "Inter, system-ui, sans-serif", fontSize: "0.90rem", color: "rgba(245,241,232,0.92)", margin: 0, lineHeight: 1.45, fontWeight: 400 }}>
                  {currInst.purpose}
                </p>
                <div style={{ borderLeft: "3px solid #d4a017", paddingLeft: "0.7rem", marginTop: "0.2rem" }}>
                  <span style={{ fontFamily: "Inter, system-ui, sans-serif", fontSize: "0.86rem", color: "rgba(245,241,232,0.88)" }}>
                    <strong>Veredicto técnico:</strong> {currInst.verdict}
                  </span>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === "ebs" && (
            <motion.div
              key="tab-ebs"
              initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.18 }}
              style={{ background: "#0c0c0c", border: "1.5px solid rgba(122,155,92,0.35)", padding: "0.9rem 1.15rem", display: "flex", flexDirection: "column", gap: "0.55rem" }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.88rem", color: "#7a9b5c", fontWeight: 700 }}>
                  AMAZON EBS (ELASTIC BLOCK STORE) · 30 GB SSD GP3
                </span>
                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.80rem", color: "#d4a017", fontWeight: 700 }}>
                  100% FREE TIER (30 GB/mes)
                </span>
              </div>
              <p style={{ fontFamily: "Inter, system-ui, sans-serif", fontSize: "0.92rem", color: "rgba(245,241,232,0.92)", margin: 0, lineHeight: 1.48, fontWeight: 400 }}>
                Disco de estado sólido persistente conectado a la instancia EC2. Almacena el sistema operativo Ubuntu Server 22.04 LTS y aloja los repositorios Git del ERP Workspace MTA y de los proyectos de clientes (Strato Studio, VIISION).
              </p>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.55rem", marginTop: "0.2rem" }}>
                <div style={{ background: "#141414", border: "1px solid rgba(245,241,232,0.1)", padding: "0.55rem 0.75rem" }}>
                  <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.80rem", color: "#7a9b5c", display: "block", fontWeight: 700 }}>3 000 IOPS / 125 MB/s</span>
                  <span style={{ fontFamily: "Inter, system-ui, sans-serif", fontSize: "0.84rem", color: "rgba(245,241,232,0.85)" }}>Rendimiento SSD base sin degradación en compilaciones masivas.</span>
                </div>
                <div style={{ background: "#141414", border: "1px solid rgba(245,241,232,0.1)", padding: "0.55rem 0.75rem" }}>
                  <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.80rem", color: "#d4a017", display: "block", fontWeight: 700 }}>PERSISTENCIA DE DATOS</span>
                  <span style={{ fontFamily: "Inter, system-ui, sans-serif", fontSize: "0.84rem", color: "rgba(245,241,232,0.85)" }}>Los repositorios no se pierden si se apaga la instancia EC2.</span>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === "workflow" && (
            <motion.div
              key="tab-workflow"
              initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.18 }}
              style={{ background: "#0c0c0c", border: "1.5px solid rgba(232,160,191,0.35)", padding: "0.9rem 1.15rem", display: "flex", flexDirection: "column", gap: "0.6rem" }}
            >
              {/* Stepper del Pipeline Interactivo */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.85rem", color: "#e8a0bf", fontWeight: 700 }}>
                  SIMULADOR EN VIVO: DE "LOCALHOST" AL STAGING EC2
                </span>
                {simStep === 4 ? (
                  <button
                    type="button"
                    onClick={resetSimulation}
                    style={{ background: "transparent", border: "1px solid rgba(245,241,232,0.2)", color: "#F5F1E8", padding: "0.28rem 0.7rem", fontFamily: "'JetBrains Mono', monospace", fontSize: "0.76rem", cursor: "pointer", display: "flex", alignItems: "center", gap: "0.35rem" }}
                  >
                    <RotateCcw size={13} /> Reiniciar
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={runStagingSimulation}
                    disabled={isSimulating}
                    style={{ background: "#d4a017", border: "none", color: "#0A0A0A", padding: "0.32rem 0.85rem", fontFamily: "'JetBrains Mono', monospace", fontSize: "0.78rem", fontWeight: 700, cursor: isSimulating ? "not-allowed" : "pointer", display: "flex", alignItems: "center", gap: "0.4rem" }}
                  >
                    <Play size={13} /> {isSimulating ? "Ejecutando..." : "Simular Deploy a Staging"}
                  </button>
                )}
              </div>

              {/* 4 Pasos del Flujo */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "0.45rem" }}>
                {[
                  { num: "01", title: "Git Push", desc: "Dev sube a rama" },
                  { num: "02", title: "Jest Tests", desc: "Pruebas unitarias" },
                  { num: "03", title: "Build EC2", desc: "Next.js compilado" },
                  { num: "04", title: "Staging OK", desc: "Verificación 100%" },
                ].map((step, idx) => {
                  const isCurrent = simStep === idx + 1;
                  const isDone = simStep > idx + 1;
                  return (
                    <div
                      key={step.num}
                      style={{
                        padding: "0.5rem 0.6rem",
                        background: isCurrent ? "rgba(212,160,23,0.18)" : isDone ? "rgba(122,155,92,0.15)" : "#141414",
                        border: isCurrent ? "1px solid #d4a017" : isDone ? "1px solid #7a9b5c" : "1px solid rgba(245,241,232,0.1)",
                        display: "flex",
                        flexDirection: "column",
                        gap: "0.15rem",
                      }}
                    >
                      <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.74rem", color: isCurrent ? "#d4a017" : isDone ? "#7a9b5c" : "rgba(245,241,232,0.6)", fontWeight: 700 }}>
                        {step.num} · {step.title}
                      </span>
                      <span style={{ fontFamily: "Inter, system-ui, sans-serif", fontSize: "0.76rem", color: "rgba(245,241,232,0.9)" }}>
                        {step.desc}
                      </span>
                    </div>
                  );
                })}
              </div>

              <div style={{ background: "rgba(122,155,92,0.08)", borderLeft: "3px solid #7a9b5c", padding: "0.55rem 0.85rem" }}>
                <span style={{ fontFamily: "Inter, system-ui, sans-serif", fontSize: "0.86rem", color: "#F5F1E8", lineHeight: 1.45, display: "block" }}>
                  {simStep === 0 && "El servidor de Staging en EC2 reemplaza las pruebas fragmentadas en laptops por un ambiente idéntico a producción."}
                  {simStep === 1 && "▶ Paso 1: Practicante envía cambios mediante Git sin tocar el servidor de producción."}
                  {simStep === 2 && "▶ Paso 2: Servidor EC2 ejecuta tests de Jest y TypeScript en memoria aislada."}
                  {simStep === 3 && "▶ Paso 3: Proceso de build ejecutado con 2 vCPUs y almacenamiento gp3 de 30 GB."}
                  {simStep === 4 && "✅ Staging superado: Entorno verificado en la nube sin el temido 'en mi máquina sí funciona'."}
                </span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Botonera de Telemetría e Interruptor del Servidor EC2 */}
        <motion.div variants={fadeUp(0.30)} initial="hidden" animate={entered ? "visible" : "hidden"}
          style={{ padding: "0.65rem 1.05rem", background: "#101010", border: "1.5px solid rgba(245,241,232,0.15)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.65rem" }}>
            <motion.div
              animate={{ opacity: serverState === "running" ? (pulse ? 1 : 0.3) : 0.2, scale: serverState === "running" ? (pulse ? 1.2 : 0.9) : 1 }}
              transition={{ duration: 0.5 }}
              style={{ width: 11, height: 11, borderRadius: "50%", background: serverState === "running" ? "#7a9b5c" : "#c6432b" }}
            />
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.84rem", color: "#F5F1E8", fontWeight: 500 }}>
              ESTADO DEL SERVIDOR: <strong style={{ color: serverState === "running" ? "#7a9b5c" : "#c6432b" }}>{serverState === "running" ? "ONLINE (STAGING EN EJECUCIÓN)" : "DETENIDO (COSTO $0/H CÓMPUTO)"}</strong>
            </span>
          </div>

          <button
            type="button"
            onClick={() => setServerState(s => s === "running" ? "stopped" : "running")}
            style={{
              background: serverState === "running" ? "rgba(198,67,43,0.15)" : "rgba(122,155,92,0.15)",
              color: serverState === "running" ? "#e8a0bf" : "#7a9b5c",
              border: `1px solid ${serverState === "running" ? "#c6432b" : "#7a9b5c"}`,
              padding: "0.4rem 0.85rem",
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: "0.78rem",
              fontWeight: 700,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "0.45rem",
              transition: "all 0.15s ease",
            }}
          >
            {serverState === "running" ? <Square size={13} /> : <Play size={13} />}
            <span>{serverState === "running" ? "APAGAR EC2" : "INICIAR EC2"}</span>
          </button>
        </motion.div>
      </div>

      {/* ══════════════ COLUMNA DERECHA (50%): Canvas 3D Staging ══════════════ */}
      <div style={{ flex: "0 0 50%", position: "relative", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", overflow: "hidden", borderLeft: "1px solid rgba(245,241,232,0.1)", background: "radial-gradient(ellipse at center, #141414 0%, #0a0a0a 85%)" }}>

        {/* Cabecera Técnica Flotante con Selector de Perspectiva de Cámara */}
        <div style={{ position: "absolute", top: "1.8rem", left: "2.5rem", right: "2.5rem", display: "flex", justifyContent: "space-between", alignItems: "center", zIndex: 10 }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.55rem" }}>
            <Cpu size={16} style={{ color: "#d4a017" }} />
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.84rem", letterSpacing: "0.14em", color: "rgba(245,241,232,0.9)", textTransform: "uppercase", fontWeight: 600 }}>
              TOPOLOGÍA 3D // 10 PRACTICANTES REMOTOS
            </span>
          </div>

          {/* Selector de Perspectiva de Cámara 3D */}
          <div style={{ display: "flex", gap: "0.35rem", background: "rgba(10,10,10,0.85)", border: "1px solid rgba(245,241,232,0.15)", padding: "0.25rem" }}>
            {[
              { id: "panoramic", label: "GLOBAL" },
              { id: "server", label: "EC2 RACK" },
              { id: "ebs", label: "DISCO EBS" },
              { id: "interns", label: "NODOS DEV" },
            ].map(cam => (
              <button
                key={cam.id}
                type="button"
                onClick={() => setFocusCamera(cam.id)}
                style={{
                  background: focusCamera === cam.id ? "#d4a017" : "transparent",
                  color: focusCamera === cam.id ? "#0A0A0A" : "rgba(245,241,232,0.75)",
                  border: "none",
                  padding: "0.22rem 0.55rem",
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: "0.72rem",
                  fontWeight: 600,
                  cursor: "pointer",
                  transition: "all 0.15s ease",
                }}
              >
                {cam.label}
              </button>
            ))}
          </div>
        </div>

        {/* Visualizador 3D interactivo */}
        <div style={{ width: "100%", height: "82%", position: "relative", zIndex: 5 }}>
          <StagingInstanceCanvas
            isActive={isActive}
            isOnline={serverState === "running"}
            instanceType={selectedInstance}
            focusMode={focusCamera}
          />
        </div>

        {/* HUD Inferior de Telemetría */}
        <div style={{ position: "absolute", bottom: "1.8rem", left: "2.5rem", right: "2.5rem", zIndex: 10, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0.6rem 1rem", background: "rgba(14,14,14,0.85)", border: "1px solid rgba(245,241,232,0.15)", backdropFilter: "blur(6px)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
            <CheckCircle2 size={16} style={{ color: "#7a9b5c" }} />
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.78rem", color: "#F5F1E8", fontWeight: 500 }}>
              REPOSITORIOS: WORKSPACE MTA (ERP) + STRATO STUDIO + VIISION
            </span>
          </div>
          <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.74rem", color: "#d4a017", fontWeight: 600 }}>
            SENATI · SEMANA 7 · ENTREGABLE 2
          </span>
        </div>
      </div>
    </section>
  );
}

export default S13_ComputoStaging;
