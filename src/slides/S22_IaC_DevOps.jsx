// src/slides/S22_IaC_DevOps.jsx
import React, { useEffect, useState, useRef } from "react";
import { motion, useReducedMotion } from "framer-motion";
import {
  Terminal,
  Layers,
  GitBranch,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Code2,
  Rocket,
  ShieldCheck,
} from "lucide-react";
import { useSlideActive } from "../hooks/useSlideActive.js";
import { CloudFormationPipelineCanvas } from "../components/three/CloudFormationPipelineCanvas.jsx";

/**
 * Slide 22 — Automatización e Infraestructura como Código (AWS CloudFormation & CI/CD)
 *
 * Contenido fiel a:
 * - docs/etapa 3.txt (Punto 4: AWS CloudFormation como herramienta principal de modelado IaC, plantillas de texto como código, despliegues repetibles y estandarizados para dev/test/prod, integración con AWS CodePipeline / CodeDeploy para CI/CD continuo).
 * - docs/etapa3_propuesta_slides.md (Eje 4: Plantillas reproducibles en minutos, Drift Detection y cero errores manuales).
 *
 * Diseño e Interactividad:
 * - Layout 50/50 exacto al estándar institucional (acento violeta/púrpura vertical, tipografía editorial, Yellowtail y fichas técnicas).
 * - Controles interactivos:
 *   1. "Plantilla CloudFormation (IaC)" -> Despliegue en 8 minutos con 0% de discrepancia y pipeline verde continuo.
 *   2. "Configuración Manual en Consola" -> Caos tradicional: 45 pasos manuales, 30% de riesgo de fallo y deriva de configuración (Drift).
 */
export function S22_IaC_DevOps({ isActive: propActive } = {}) {
  const shouldReduceMotion = useReducedMotion();
  const hookActive = useSlideActive(21);
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

  // Estados interactivos: "automated" vs "manual_chaos"
  const [pipelineMode, setPipelineMode] = useState("automated");

  useEffect(() => {
    if (!isActive) return;
    const t = setTimeout(() => setEntered(true), 40);
    return () => {
      clearTimeout(t);
      setEntered(false);
    };
  }, [isActive]);

  const fadeUp = (delay = 0) => ({
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 16 },
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

      {/* Línea vertical de acento Violeta DevOps */}
      <motion.div
        aria-hidden="true"
        initial={{ scaleY: 0, transformOrigin: "top" }}
        animate={entered ? { scaleY: 1 } : { scaleY: 0 }}
        transition={{ duration: shouldReduceMotion ? 0.1 : 0.65, ease: [0.83, 0, 0.17, 1], delay: 0.05 }}
        style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 4, background: "#a78bfa", zIndex: 3 }}
      />

      {/* ══════════════ COLUMNA IZQUIERDA (58%): Automatización, IaC y CI/CD ══════════════ */}
      <div style={{ flex: "0 0 58%", display: "flex", flexDirection: "column", justifyContent: "center", padding: "1.2rem 2rem 1.2rem 3.6rem", position: "relative", zIndex: 2, gap: "0.5rem", boxSizing: "border-box" }}>

        {/* Header Editorial idéntico al estándar del deck */}
        <div style={{ display: "flex", flexDirection: "column", gap: "0.15rem" }}>
          <motion.div variants={fadeUp(0.04)} initial="hidden" animate={entered ? "visible" : "hidden"} style={{ display: "flex", alignItems: "center", gap: "0.6rem", flexWrap: "wrap" }}>
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.86rem", letterSpacing: "0.15em", textTransform: "uppercase", fontWeight: 700, color: "#a78bfa", background: "rgba(167,139,250,0.12)", border: "1px solid rgba(167,139,250,0.4)", padding: "0.22rem 0.65rem" }}>
              [ ETAPA 3 · EJE 04 ]
            </span>
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.80rem", color: "#00c853", background: "rgba(0,200,83,0.12)", border: "1px solid rgba(0,200,83,0.35)", padding: "0.20rem 0.55rem", fontWeight: 700 }}>
              DESPLIEGUES &lt; 8 MIN · DRIFT ZERO
            </span>
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.78rem", color: "rgba(245,241,232,0.7)" }}>
              GIT VERSIONED · ROLLING UPDATES
            </span>
          </motion.div>

          <motion.p variants={fadeUp(0.08)} initial="hidden" animate={entered ? "visible" : "hidden"}
            style={{ fontFamily: "Yellowtail, cursive", fontSize: "clamp(1.5rem, 2.2vw, 2rem)", color: "#a78bfa", lineHeight: 1.1, margin: "0.1rem 0 0 0", fontWeight: 400 }}>
            Automatización y Entrega Continua
          </motion.p>

          <motion.h1 variants={fadeUp(0.12)} initial="hidden" animate={entered ? "visible" : "hidden"}
            style={{ fontFamily: "'Archivo Black', 'Arial Black', sans-serif", fontSize: "clamp(1.8rem, 2.5vw, 2.45rem)", color: "#F5F1E8", letterSpacing: "-0.025em", lineHeight: 1.05, textTransform: "uppercase", margin: 0, fontWeight: 400 }}>
            INFRAESTRUCTURA COMO CÓDIGO & CI/CD
          </motion.h1>

          <motion.div
            initial={{ clipPath: "inset(0 100% 0 0)" }}
            animate={entered ? { clipPath: "inset(0 0% 0 0)" } : { clipPath: "inset(0 100% 0 0)" }}
            transition={{ duration: shouldReduceMotion ? 0.1 : 0.55, ease: [0.83, 0, 0.17, 1], delay: 0.18 }}
            style={{ height: 2, background: "#a78bfa", width: "100%", maxWidth: 240, margin: "0.12rem 0" }}
          />

          <motion.p variants={fadeUp(0.16)} initial="hidden" animate={entered ? "visible" : "hidden"}
            style={{ fontFamily: "Inter, system-ui, sans-serif", fontSize: "clamp(0.92rem, 1.05vw, 1.02rem)", color: "rgba(245,241,232,0.85)", margin: 0, lineHeight: 1.4, fontWeight: 400 }}>
            Estandarización de entornos mediante plantillas declarativas en AWS CloudFormation y canalizaciones automatizadas con AWS CodePipeline para los 10 practicantes de MTA Software.
          </motion.p>
        </div>

        {/* Grid de los 4 Pilares Clave de IaC y CI/CD */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.65rem" }}>
          
          {/* Pilar 1: AWS CloudFormation */}
          <motion.div
            variants={fadeUp(0.20)}
            initial="hidden"
            animate={entered ? "visible" : "hidden"}
            style={{
              padding: "0.85rem 1.05rem",
              background: "rgba(255,255,255,0.02)",
              border: "1px solid rgba(245,241,232,0.12)",
              borderLeft: "3px solid #a78bfa",
              display: "flex",
              flexDirection: "column",
              gap: "0.32rem",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <h4 style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: "0.90rem", color: "#F5F1E8", textTransform: "uppercase", margin: 0, fontWeight: 400 }}>
                AWS CLOUDFORMATION
              </h4>
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.72rem", color: "#a78bfa", fontWeight: 700 }}>
                FASE 01
              </span>
            </div>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.78rem", color: "#a78bfa", padding: "0.15rem 0", fontWeight: 600 }}>
              Plantillas YAML · Modelado Integral en Texto
            </div>
            <p style={{ fontFamily: "Inter, system-ui, sans-serif", fontSize: "0.85rem", color: "rgba(245,241,232,0.88)", lineHeight: 1.45, margin: 0, fontWeight: 400 }}>
              Modela toda la infraestructura (VPC, subredes, EC2, ALB, RDS) en archivos declarativos tratados como código fuente versionado en repositorios Git.
            </p>
          </motion.div>

          {/* Pilar 2: Despliegues Repetibles & Ambientes */}
          <motion.div
            variants={fadeUp(0.23)}
            initial="hidden"
            animate={entered ? "visible" : "hidden"}
            style={{
              padding: "0.85rem 1.05rem",
              background: "rgba(255,255,255,0.02)",
              border: "1px solid rgba(245,241,232,0.12)",
              borderLeft: "3px solid #38bdf8",
              display: "flex",
              flexDirection: "column",
              gap: "0.32rem",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <h4 style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: "0.90rem", color: "#F5F1E8", textTransform: "uppercase", margin: 0, fontWeight: 400 }}>
                DESPLIEGUES REPETIBLES
              </h4>
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.72rem", color: "#38bdf8", fontWeight: 700 }}>
                FASE 02
              </span>
            </div>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.78rem", color: "#38bdf8", padding: "0.15rem 0", fontWeight: 600 }}>
              Dev · Test · Prod Idénticos · Drift Detection
            </div>
            <p style={{ fontFamily: "Inter, system-ui, sans-serif", fontSize: "0.85rem", color: "rgba(245,241,232,0.88)", lineHeight: 1.45, margin: 0, fontWeight: 400 }}>
              Estandariza la réplica de stacks completos para nuevos clientes o pruebas de staging en menos de 8 minutos, eliminando inconsistencias entre ambientes.
            </p>
          </motion.div>

          {/* Pilar 3: AWS CodePipeline (CI/CD) */}
          <motion.div
            variants={fadeUp(0.26)}
            initial="hidden"
            animate={entered ? "visible" : "hidden"}
            style={{
              padding: "0.85rem 1.05rem",
              background: "rgba(255,255,255,0.02)",
              border: "1px solid rgba(245,241,232,0.12)",
              borderLeft: "3px solid #00c853",
              display: "flex",
              flexDirection: "column",
              gap: "0.32rem",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <h4 style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: "0.90rem", color: "#F5F1E8", textTransform: "uppercase", margin: 0, fontWeight: 400 }}>
                AWS CODEPIPELINE
              </h4>
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.72rem", color: "#00c853", fontWeight: 700 }}>
                FASE 03
              </span>
            </div>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.78rem", color: "#00c853", padding: "0.15rem 0", fontWeight: 600 }}>
              Orquestación Continua · Disparo por Git Push
            </div>
            <p style={{ fontFamily: "Inter, system-ui, sans-serif", fontSize: "0.85rem", color: "rgba(245,241,232,0.88)", lineHeight: 1.45, margin: 0, fontWeight: 400 }}>
              Flujo automatizado de entrega: ante cada commit o PR aprobado a la rama principal, compila, ejecuta pruebas y valida la sintaxis antes del pase a producción.
            </p>
          </motion.div>

          {/* Pilar 4: AWS CodeDeploy & Rolling Updates */}
          <motion.div
            variants={fadeUp(0.29)}
            initial="hidden"
            animate={entered ? "visible" : "hidden"}
            style={{
              padding: "0.85rem 1.05rem",
              background: "rgba(255,255,255,0.02)",
              border: "1px solid rgba(245,241,232,0.12)",
              borderLeft: "3px solid #d4a017",
              display: "flex",
              flexDirection: "column",
              gap: "0.32rem",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <h4 style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: "0.90rem", color: "#F5F1E8", textTransform: "uppercase", margin: 0, fontWeight: 400 }}>
                AWS CODEDEPLOY
              </h4>
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.72rem", color: "#d4a017", fontWeight: 700 }}>
                FASE 04
              </span>
            </div>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.78rem", color: "#d4a017", padding: "0.15rem 0", fontWeight: 600 }}>
              Rolling Update · Zero-Downtime · Auto-Rollback
            </div>
            <p style={{ fontFamily: "Inter, system-ui, sans-serif", fontSize: "0.85rem", color: "rgba(245,241,232,0.88)", lineHeight: 1.45, margin: 0, fontWeight: 400 }}>
              Despliega versiones actualizadas en las instancias EC2 sin cortar el servicio a los usuarios finales; revierte de forma automática si detecta errores.
            </p>
          </motion.div>

        </div>

        {/* Ficha Resumen de Justificación de Decisión Cloud */}
        <motion.div
          variants={fadeUp(0.32)}
          initial="hidden"
          animate={entered ? "visible" : "hidden"}
          style={{
            background: "#0A0A0A",
            border: "1px solid rgba(245,241,232,0.15)",
            borderLeft: "4px solid #a78bfa",
            padding: "0.85rem 1.2rem",
            display: "flex",
            flexDirection: "column",
            gap: "0.3rem",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.78rem", color: "#a78bfa", fontWeight: 700 }}>
              DECISIÓN CLAVE: INFRAESTRUCTURA DECLARATIVA FRENTE A GESTIÓN MANUAL
            </span>
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.72rem", color: "#00c853", fontWeight: 700 }}>
              ERROR HUMANO = 0%
            </span>
          </div>
          <span style={{ fontFamily: "Inter, system-ui, sans-serif", fontSize: "0.86rem", color: "rgba(245,241,232,0.92)", lineHeight: 1.45 }}>
            <strong style={{ color: "#F5F1E8" }}>¿Por qué CloudFormation y no clics manuales en consola?</strong> Configurar 10 servidores, balanceadores y reglas a mano tomaba días, no tenía trazabilidad ni se podía revertir limpiamente. Con CloudFormation, MTA Software garantiza auditoría de cambios en Git, ambientes 100% reproducibles y despliegues confiables en minutos.
          </span>
        </motion.div>
      </div>

      {/* ══════════════ COLUMNA DERECHA (42%): Simulador 3D de Pipeline con Fondo Negro Puro ══════════════ */}
      <div style={{ flex: "0 0 42%", position: "relative", display: "flex", flexDirection: "column", justifyContent: "space-between", padding: "1.2rem 1.6rem", boxSizing: "border-box", borderLeft: "1px solid rgba(245,241,232,0.1)", background: "#050505" }}>

        {/* Cabecera Técnica Flotante */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", zIndex: 10 }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <span style={{ width: 8, height: 8, borderRadius: "50%", background: pipelineMode === "automated" ? "#00c853" : "#ef4444", boxShadow: `0 0 10px ${pipelineMode === "automated" ? "#00c853" : "#ef4444"}` }} />
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.76rem", color: "#F5F1E8", letterSpacing: "0.12em", textTransform: "uppercase", fontWeight: 700 }}>
              SIMULADOR DE PIPELINE CI/CD (3D)
            </span>
          </div>
          <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.68rem", color: "rgba(245,241,232,0.6)", background: "rgba(0,0,0,0.5)", border: "1px solid rgba(245,241,232,0.15)", padding: "0.18rem 0.5rem", fontWeight: 600 }}>
            INTERACTIVE WEBGL 3D
          </span>
        </div>

        {/* Selector de Comparación: IaC Automatizado vs Manual estilo botones táctiles */}
        <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem", zIndex: 10, margin: "0.3rem 0" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.45rem" }}>
            <button
              type="button"
              onClick={() => setPipelineMode("automated")}
              style={{
                background: pipelineMode === "automated" ? "#00c853" : "rgba(255,255,255,0.03)",
                color: pipelineMode === "automated" ? "#0A0A0A" : "rgba(245,241,232,0.85)",
                border: pipelineMode === "automated" ? "1px solid #00c853" : "1px solid rgba(245,241,232,0.12)",
                boxShadow: pipelineMode === "automated" ? "2px 2px 0px #000" : "none",
                padding: "0.45rem 0.35rem",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "0.15rem",
                cursor: "pointer",
                transition: "all 0.15s ease",
              }}
            >
              <span style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: "0.72rem", textTransform: "uppercase" }}>
                1. CloudFormation (IaC)
              </span>
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.58rem", opacity: pipelineMode === "automated" ? 0.95 : 0.6 }}>
                AUTOMATIZADO · 0% DISCREPANCIA
              </span>
            </button>

            <button
              type="button"
              onClick={() => setPipelineMode("manual_chaos")}
              style={{
                background: pipelineMode === "manual_chaos" ? "#ef4444" : "rgba(255,255,255,0.03)",
                color: pipelineMode === "manual_chaos" ? "#FFFFFF" : "rgba(245,241,232,0.85)",
                border: pipelineMode === "manual_chaos" ? "1px solid #ef4444" : "1px solid rgba(245,241,232,0.12)",
                boxShadow: pipelineMode === "manual_chaos" ? "2px 2px 0px #000" : "none",
                padding: "0.45rem 0.35rem",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "0.15rem",
                cursor: "pointer",
                transition: "all 0.15s ease",
              }}
            >
              <span style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: "0.72rem", textTransform: "uppercase" }}>
                2. Clics en Consola
              </span>
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.58rem", opacity: pipelineMode === "manual_chaos" ? 0.95 : 0.6 }}>
                MANUAL · DERIVA Y FALLOS
              </span>
            </button>
          </div>
        </div>

        {/* Contenedor del Canvas Three.js con Estrellas Delicadas y Pipeline Centrado */}
        <div style={{ flex: 1, minHeight: "360px", position: "relative" }}>
          <CloudFormationPipelineCanvas isActive={isActive} pipelineMode={pipelineMode} />
        </div>

        {/* Badge Inferior Explicativo en Vivo */}
        <div
          style={{
            zIndex: 10,
            background: "rgba(10,10,12,0.92)",
            backdropFilter: "blur(8px)",
            border: `1.5px solid ${pipelineMode === "automated" ? "#00c853" : "#ef4444"}60`,
            padding: "0.6rem 1rem",
            display: "flex",
            alignItems: "center",
            gap: "0.6rem",
          }}
        >
          {pipelineMode === "automated" ? (
            <>
              <CheckCircle2 size={16} color="#00c853" style={{ flexShrink: 0 }} />
              <span style={{ fontFamily: "Inter, system-ui, sans-serif", fontSize: "0.82rem", color: "rgba(245,241,232,0.9)" }}>
                <strong style={{ color: "#00c853" }}>Despliegue Declarativo:</strong> Git Push activa CodePipeline. Se valida plantilla YAML y levanta el Stack completo en &lt;8 min con 0% de discrepancia.
              </span>
            </>
          ) : (
            <>
              <AlertTriangle size={16} color="#ef4444" style={{ flexShrink: 0 }} />
              <span style={{ fontFamily: "Inter, system-ui, sans-serif", fontSize: "0.82rem", color: "rgba(245,241,232,0.9)" }}>
                <strong style={{ color: "#ef4444" }}>Caos Manual:</strong> Más de 40 clics en consola, fallos de configuración humana y tiempo de despliegue superior a 5 horas.
              </span>
            </>
          )}
        </div>
      </div>
    </section>
  );
}

export default S22_IaC_DevOps;
