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
  Terminal,
  Code2,
  Clock,
  Coins,
  ArrowRight,
} from "lucide-react";
import { slidesContent } from "../data/content.es.js";
import { useSlideActive } from "../hooks/useSlideActive.js";
import { ComputeArchitecturesCanvas } from "../components/three/ComputeArchitecturesCanvas.jsx";

const c = slidesContent.s14_computo || {
  sectionNum: "04",
  badge: "BLOQUE 4 · ENTREGABLE 2",
  scriptTag: "Capa de Computación",
  title: "CÓMPUTO ELÁSTICO Y SERVERLESS EN AWS",
  subtitle: "Despliegue de instancias Amazon EC2 con volúmenes EBS optimizados y evaluación de funciones serverless con AWS Lambda para tareas asíncronas",
};

/**
 * Slide 14 — Cómputo Elástico y Serverless (Etapa 2 - Semana 7)
 * Fiel a docs/informacion.txt:
 *  1. Amazon EC2 + EBS gp3: Instancias elásticas para el backend Node.js / ERP Workspace MTA.
 *  2. AWS Lambda (Serverless): Tareas asíncronas, cron jobs nocturnos, cálculo automatizado de notas a costo $0 en reposo.
 *  3. Docker + ECS: Estandarización de imágenes inmutables para los 10 practicantes de MTA Software.
 *
 * Visualización 3D: ComputeArchitecturesCanvas (Three.js WebGL sin bloqueos, cámara interactiva hacia el servicio activo).
 * Simulador Interactivo: Simulador de Invocación Asíncrona (Lambda vs EC2) con métricas en tiempo real.
 */
export function S14_ComputoServicios({ isActive: propActive } = {}) {
  const shouldReduceMotion = useReducedMotion();
  const hookActive = useSlideActive(13);
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

  // Selector de tecnología activa: "ec2" | "lambda" | "containers"
  const [selectedTech, setSelectedTech] = useState("ec2");

  // Simulador de invocación de cómputo en vivo
  const [isSimulating, setIsSimulating] = useState(false);
  const [simResults, setSimResults] = useState(null);
  const [simStep, setSimStep] = useState(0);

  useEffect(() => {
    if (!isActive) return;
    const t = setTimeout(() => setEntered(true), 40);
    return () => {
      clearTimeout(t);
      setEntered(false);
    };
  }, [isActive]);

  const technologies = {
    ec2: {
      id: "ec2",
      name: "Amazon EC2 + EBS gp3",
      category: "Infraestructura (IaaS)",
      icon: Server,
      color: "#d4a017",
      title: "Backend Core & APIs REST",
      specs: "t4g.small (Graviton2 ARM) · 2 vCPU · 2 GB RAM · 30 GB SSD gp3",
      costEst: "~$12.50 USD / mes (24/7)",
      roleMta: "Backend Node.js y APIs críticas con recursos dedicados.",
      ebsFeature: "SSD gp3 persistente (3 000 IOPS base) y backups diarios.",
      whyChosen: "Latencia < 30ms y soporte de WebSockets que Serverless no mantiene.",
    },
    lambda: {
      id: "lambda",
      name: "AWS Lambda (Serverless)",
      category: "Eventos (FaaS)",
      icon: Zap,
      color: "#e8a0bf",
      title: "Automatización & Tareas Asíncronas",
      specs: "1M peticiones/mes gratis · Auto-escalado de 0 a 1 000+ instancias",
      costEst: "$0.00 USD en reposo (Free Tier)",
      roleMta: "Cálculo de notas, reportes nocturnos y compresión de archivos.",
      ebsFeature: "Almacenamiento efímero /tmp para PDFs sin costo de disco.",
      whyChosen: "Desacopla cargas pesadas: un reporte de 40s no congela el ERP.",
    },
    containers: {
      id: "containers",
      name: "Docker + Amazon ECS",
      category: "Contenedores (CaaS)",
      icon: Box,
      color: "#7a9b5c",
      title: "Entornos Inmutables para Practicantes",
      specs: "AWS Fargate / EC2 · Registro privado en Amazon ECR",
      costEst: "Facturación por segundo",
      roleMta: "Mismo entorno Node.js / Next.js para los 10 practicantes.",
      ebsFeature: "Amazon EFS multi-zona para cachear node_modules compartidos.",
      whyChosen: "Elimina el 'en mi máquina sí funciona' con imágenes idénticas.",
    },
  };

  const activeData = technologies[selectedTech];

  // Ejecución del simulador de eventos
  const handleRunSimulation = (techKey) => {
    setIsSimulating(true);
    setSimStep(1);
    setSimResults(null);

    setTimeout(() => {
      setSimStep(2);
    }, 650);

    setTimeout(() => {
      setSimStep(3);
      if (techKey === "lambda") {
        setSimResults({
          tech: "AWS Lambda (Serverless)",
          trigger: "Cron EventBridge / Reporte nocturno",
          executionTime: "142 ms",
          cost: "$0.00 USD (Free Tier)",
          impact: "Cero impacto en producción. Cómputo apagado al terminar.",
        });
      } else if (techKey === "ec2") {
        setSimResults({
          tech: "Amazon EC2 (t4g.small)",
          trigger: "HTTP GET /api/v1/workspace/erp",
          executionTime: "18 ms",
          cost: "Cómputo 24/7 predecible",
          impact: "Respuesta inmediata con socket TCP persistente.",
        });
      } else {
        setSimResults({
          tech: "Docker + Amazon ECS",
          trigger: "git push origin feature (P04)",
          executionTime: "1.2 s (Build & Deploy)",
          cost: "Micro-centavos / build",
          impact: "Despliegue atómico sin caída de servicio.",
        });
      }
      setIsSimulating(false);
    }, 1400);
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
              US-EAST-1 · FREE TIER
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

        {/* Selector de 3 Pestañas Técnicas de Cómputo */}
        <motion.div variants={fadeUp(0.20)} initial="hidden" animate={entered ? "visible" : "hidden"}
          style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "0.5rem", background: "rgba(18,18,18,0.9)", border: "1.5px solid rgba(245,241,232,0.15)", padding: "0.45rem" }}>
          {[
            { id: "ec2", label: "EC2 + EBS GP3", icon: Server, color: "#d4a017" },
            { id: "lambda", label: "AWS LAMBDA (FaaS)", icon: Zap, color: "#e8a0bf" },
            { id: "containers", label: "DOCKER + ECS", icon: Box, color: "#7a9b5c" },
          ].map((tab) => {
            const isSel = selectedTech === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setSelectedTech(tab.id)}
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
            key={selectedTech}
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
                {activeData.costEst}
              </span>
            </div>

            {/* Especificaciones clave */}
            <div style={{ background: "#141414", border: "1px solid rgba(245,241,232,0.1)", padding: "0.45rem 0.75rem", display: "flex", alignItems: "center", gap: "0.6rem" }}>
              <Cpu size={16} color={activeData.color} style={{ flexShrink: 0 }} />
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.80rem", color: "#F5F1E8", fontWeight: 500 }}>
                {activeData.specs}
              </span>
            </div>

            {/* Rol en Workspace MTA y Disco/Almacenamiento */}
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
                  CARACTERÍSTICA DE DISCO / RAM
                </span>
                <span style={{ fontFamily: "Inter, system-ui, sans-serif", fontSize: "0.84rem", color: "rgba(245,241,232,0.9)", lineHeight: 1.4, display: "block" }}>
                  {activeData.ebsFeature}
                </span>
              </div>
            </div>

            {/* Veredicto de superación técnica */}
            <div style={{ borderLeft: `3px solid ${activeData.color}`, background: "rgba(255,255,255,0.02)", padding: "0.45rem 0.75rem", marginTop: "0.1rem" }}>
              <span style={{ fontFamily: "Inter, system-ui, sans-serif", fontSize: "0.84rem", color: "rgba(245,241,232,0.92)", lineHeight: 1.4, display: "block" }}>
                <strong>Superación de Hostinger:</strong> {activeData.whyChosen}
              </span>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Panel Interactivo del Simulador de Invocación */}
        <motion.div variants={fadeUp(0.30)} initial="hidden" animate={entered ? "visible" : "hidden"}
          style={{ background: "#0c0c0c", border: "1.5px solid rgba(212,160,23,0.35)", padding: "0.75rem 1.05rem", display: "flex", flexDirection: "column", gap: "0.45rem" }}>
          
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.55rem" }}>
              <Terminal size={16} color="#d4a017" />
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.82rem", color: "#d4a017", fontWeight: 700 }}>
                SIMULADOR DE TELEMETRÍA EN VIVO (AWS CLOUD)
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
                onClick={() => handleRunSimulation(selectedTech)}
                disabled={isSimulating}
                style={{ background: "#d4a017", border: "none", color: "#0A0A0A", padding: "0.32rem 0.85rem", fontFamily: "'JetBrains Mono', monospace", fontSize: "0.78rem", fontWeight: 700, cursor: isSimulating ? "not-allowed" : "pointer", display: "flex", alignItems: "center", gap: "0.4rem" }}
              >
                <Play size={12} fill="#0A0A0A" /> {isSimulating ? "Ejecutando..." : `Disparar Invocación ${selectedTech.toUpperCase()}`}
              </button>
            )}
          </div>

          {/* Consola de Salida del Simulador */}
          <div style={{ background: "#050506", border: "1px solid rgba(255,255,255,0.08)", padding: "0.55rem 0.80rem", minHeight: "48px", display: "flex", flexDirection: "column", justifyContent: "center" }}>
            {isSimulating && (
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.76rem", color: "#d4a017" }}>
                {simStep === 1 && "➜ [EVENT_BUS] Evento detectado por Amazon EventBridge en us-east-1a..."}
                {simStep === 2 && "➜ [SCHEDULER] Aprovisionando micro-hilo de cómputo en memoria aislada..."}
                {simStep === 3 && "➜ [DONE] Código 200 OK ejecutado con telemetría CloudWatch registrada."}
              </div>
            )}

            {!isSimulating && !simResults && (
              <span style={{ fontFamily: "Inter, system-ui, sans-serif", fontSize: "0.82rem", color: "rgba(245,241,232,0.65)" }}>
                Click en "Disparar Invocación" para medir latencia de arranque, consumo de memoria y costo exacto en AWS.
              </span>
            )}

            {!isSimulating && simResults && (
              <div style={{ display: "grid", gridTemplateColumns: "1.3fr 1fr", gap: "0.6rem", alignItems: "center" }}>
                <div>
                  <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.78rem", color: "#7a9b5c", fontWeight: 700 }}>
                    ✔ {simResults.tech}
                  </span>
                  <div style={{ fontFamily: "Inter, system-ui, sans-serif", fontSize: "0.78rem", color: "rgba(245,241,232,0.9)", marginTop: "0.1rem" }}>
                    {simResults.trigger}
                  </div>
                  <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.72rem", color: "#d4a017", marginTop: "0.1rem" }}>
                    {simResults.impact}
                  </div>
                </div>
                <div style={{ borderLeft: "1px solid rgba(255,255,255,0.1)", paddingLeft: "0.65rem", display: "flex", flexDirection: "column", gap: "0.2rem" }}>
                  <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.74rem", color: "rgba(245,241,232,0.75)" }}>
                    LATENCIA: <strong style={{ color: "#F5F1E8" }}>{simResults.executionTime}</strong>
                  </span>
                  <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.74rem", color: "rgba(245,241,232,0.75)" }}>
                    COSTO: <strong style={{ color: "#e8a0bf" }}>{simResults.cost}</strong>
                  </span>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>

      {/* ══════════════ COLUMNA DERECHA (50%): Canvas 3D de Cómputo ══════════════ */}
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
          <ComputeArchitecturesCanvas
            selectedCompute={selectedTech}
            isExecuting={isSimulating}
          />
        </div>

        {/* Badge inferior con los 3 paradigmas de cómputo */}
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
          <div style={{ color: selectedTech === "ec2" ? "#d4a017" : "rgba(245,241,232,0.5)" }}>
            <div style={{ fontWeight: 700 }}>1. EC2 + EBS gp3</div>
            <div style={{ fontSize: "0.68rem" }}>Backend 24/7 & ERP</div>
          </div>
          <div style={{ color: selectedTech === "lambda" ? "#e8a0bf" : "rgba(245,241,232,0.5)" }}>
            <div style={{ fontWeight: 700 }}>2. AWS LAMBDA</div>
            <div style={{ fontSize: "0.68rem" }}>Cron Jobs & FaaS $0</div>
          </div>
          <div style={{ color: selectedTech === "containers" ? "#7a9b5c" : "rgba(245,241,232,0.5)" }}>
            <div style={{ fontWeight: 700 }}>3. DOCKER / ECS</div>
            <div style={{ fontSize: "0.68rem" }}>10 Practicantes Sync</div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default S14_ComputoServicios;
