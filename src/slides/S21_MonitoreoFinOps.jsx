// src/slides/S21_MonitoreoFinOps.jsx
import React, { useEffect, useState, useRef } from "react";
import { motion, useReducedMotion } from "framer-motion";
import {
  Activity,
  Tag,
  DollarSign,
  AlertTriangle,
  CheckCircle2,
  Bell,
  Search,
  Check,
  TrendingDown,
  Cpu,
} from "lucide-react";
import { useSlideActive } from "../hooks/useSlideActive.js";
import { CloudWatchRadarCanvas } from "../components/three/CloudWatchRadarCanvas.jsx";

/**
 * Slide 21 — Monitoreo, Auditoría y FinOps (CloudWatch + Tagging + Trusted Advisor)
 *
 * Contenido fiel a:
 * - docs/etapa 3.txt (Punto 3: Supervisión constante con CloudWatch, métricas EC2 tiempo real, alarmas automatizadas, logs centralizados, estrategia de etiquetado Cost Allocation Tags y recomendaciones de AWS Trusted Advisor).
 * - docs/etapa3_propuesta_slides.md (Eje 3: Observabilidad proactiva, gobernanza de presupuesto con alerta $10 USD).
 *
 * Diseño e Interactividad:
 * - Layout 50/50 exacto al estándar institucional (acento cian vertical, tipografía editorial, Yellowtail y fichas técnicas).
 * - Controles interactivos:
 *   1. Filtro por Cost Allocation Tag: "[Todos]", "[Project: Workspace-MTA]", "[Project: Strato-Studio]", "[Project: VIISION]".
 *   2. Botón toggle de Alarma: "Disparar Alarma de Consumo (>85%)".
 */
export function S21_MonitoreoFinOps({ isActive: propActive } = {}) {
  const shouldReduceMotion = useReducedMotion();
  const hookActive = useSlideActive(20);
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
  const [selectedTag, setSelectedTag] = useState("all"); // "all" | "workspace" | "strato" | "viision"
  const [alarmTriggered, setAlarmTriggered] = useState(false);

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

      {/* Línea vertical de acento Cian Observabilidad */}
      <motion.div
        aria-hidden="true"
        initial={{ scaleY: 0, transformOrigin: "top" }}
        animate={entered ? { scaleY: 1 } : { scaleY: 0 }}
        transition={{ duration: shouldReduceMotion ? 0.1 : 0.65, ease: [0.83, 0, 0.17, 1], delay: 0.05 }}
        style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 4, background: "#38bdf8", zIndex: 3 }}
      />

      {/* ══════════════ COLUMNA IZQUIERDA (58%): Observabilidad, Gobernanza y FinOps ══════════════ */}
      <div style={{ flex: "0 0 58%", display: "flex", flexDirection: "column", justifyContent: "center", padding: "1.2rem 2rem 1.2rem 3.6rem", position: "relative", zIndex: 2, gap: "0.5rem", boxSizing: "border-box" }}>

        {/* Header Editorial idéntico al estándar del deck */}
        <div style={{ display: "flex", flexDirection: "column", gap: "0.15rem" }}>
          <motion.div variants={fadeUp(0.04)} initial="hidden" animate={entered ? "visible" : "hidden"} style={{ display: "flex", alignItems: "center", gap: "0.6rem", flexWrap: "wrap" }}>
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.86rem", letterSpacing: "0.15em", textTransform: "uppercase", fontWeight: 700, color: "#38bdf8", background: "rgba(56,189,248,0.12)", border: "1px solid rgba(56,189,248,0.4)", padding: "0.22rem 0.65rem" }}>
              [ ETAPA 3 · EJE 03 ]
            </span>
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.80rem", color: "#d4a017", background: "rgba(212,160,23,0.12)", border: "1px solid rgba(212,160,23,0.35)", padding: "0.20rem 0.55rem", fontWeight: 700 }}>
              PRESUPUESTO CAP $10 USD
            </span>
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.78rem", color: "rgba(245,241,232,0.7)" }}>
              TELEMETRÍA 24/7 · COST ALLOCATION
            </span>
          </motion.div>

          <motion.p variants={fadeUp(0.08)} initial="hidden" animate={entered ? "visible" : "hidden"}
            style={{ fontFamily: "Yellowtail, cursive", fontSize: "clamp(1.5rem, 2.2vw, 2rem)", color: "#38bdf8", lineHeight: 1.1, margin: "0.1rem 0 0 0", fontWeight: 400 }}>
            Visibilidad en Tiempo Real y FinOps
          </motion.p>

          <motion.h1 variants={fadeUp(0.12)} initial="hidden" animate={entered ? "visible" : "hidden"}
            style={{ fontFamily: "'Archivo Black', 'Arial Black', sans-serif", fontSize: "clamp(1.8rem, 2.5vw, 2.45rem)", color: "#F5F1E8", letterSpacing: "-0.025em", lineHeight: 1.05, textTransform: "uppercase", margin: 0, fontWeight: 400 }}>
            MONITOREO, AUDITORÍA & FINOPS
          </motion.h1>

          <motion.div
            initial={{ clipPath: "inset(0 100% 0 0)" }}
            animate={entered ? { clipPath: "inset(0 0% 0 0)" } : { clipPath: "inset(0 100% 0 0)" }}
            transition={{ duration: shouldReduceMotion ? 0.1 : 0.55, ease: [0.83, 0, 0.17, 1], delay: 0.18 }}
            style={{ height: 2, background: "#38bdf8", width: "100%", maxWidth: 240, margin: "0.12rem 0" }}
          />

          <motion.p variants={fadeUp(0.16)} initial="hidden" animate={entered ? "visible" : "hidden"}
            style={{ fontFamily: "Inter, system-ui, sans-serif", fontSize: "clamp(0.92rem, 1.05vw, 1.02rem)", color: "rgba(245,241,232,0.85)", margin: 0, lineHeight: 1.4, fontWeight: 400 }}>
            Supervisión integral de infraestructura con métricas en tiempo real, alarmas automatizadas contra desbordes presupuestarios y trazabilidad exacta de costos por cliente mediante Tagging.
          </motion.p>
        </div>

        {/* Grid de los 4 Componentes Clave de FinOps y Monitoreo */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.65rem" }}>
          
          {/* Capa 1: CloudWatch Metrics & Logs */}
          <motion.div
            variants={fadeUp(0.20)}
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
                CLOUDWATCH METRICS & LOGS
              </h4>
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.72rem", color: "#38bdf8", fontWeight: 700 }}>
                PILAR 01
              </span>
            </div>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.78rem", color: "#38bdf8", padding: "0.15rem 0", fontWeight: 600 }}>
              CPU · IOPS Disco · Red · StatusCheck
            </div>
            <p style={{ fontFamily: "Inter, system-ui, sans-serif", fontSize: "0.85rem", color: "rgba(245,241,232,0.88)", lineHeight: 1.45, margin: 0, fontWeight: 400 }}>
              Captura métricas nativas cada 60s sin agentes invasivos. Agrupa registros en Log Groups centralizados para auditar errores y fallos de software al instante.
            </p>
          </motion.div>

          {/* Capa 2: Alarmas SNS & Presupuesto */}
          <motion.div
            variants={fadeUp(0.23)}
            initial="hidden"
            animate={entered ? "visible" : "hidden"}
            style={{
              padding: "0.85rem 1.05rem",
              background: "rgba(255,255,255,0.02)",
              border: "1px solid rgba(245,241,232,0.12)",
              borderLeft: "3px solid #ef4444",
              display: "flex",
              flexDirection: "column",
              gap: "0.32rem",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <h4 style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: "0.90rem", color: "#F5F1E8", textTransform: "uppercase", margin: 0, fontWeight: 400 }}>
                ALARMAS SNS & UMBRALES
              </h4>
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.72rem", color: "#ef4444", fontWeight: 700 }}>
                PILAR 02
              </span>
            </div>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.78rem", color: "#ef4444", padding: "0.15rem 0", fontWeight: 600 }}>
              CPU &gt; 75% · Umbral Presupuesto $8.50 (85%)
            </div>
            <p style={{ fontFamily: "Inter, system-ui, sans-serif", fontSize: "0.85rem", color: "rgba(245,241,232,0.88)", lineHeight: 1.45, margin: 0, fontWeight: 400 }}>
              Notificaciones automáticas por correo y SMS al Lead Técnico. Si el cómputo o facturación supera el 85%, el sistema avisa de inmediato antes de cualquier sobrecosto.
            </p>
          </motion.div>

          {/* Capa 3: Cost Allocation Tagging */}
          <motion.div
            variants={fadeUp(0.26)}
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
                COST ALLOCATION TAGS
              </h4>
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.72rem", color: "#d4a017", fontWeight: 700 }}>
                PILAR 03
              </span>
            </div>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.78rem", color: "#d4a017", padding: "0.15rem 0", fontWeight: 600 }}>
              Project · Environment · Owner · CostCenter
            </div>
            <p style={{ fontFamily: "Inter, system-ui, sans-serif", fontSize: "0.85rem", color: "rgba(245,241,232,0.88)", lineHeight: 1.45, margin: 0, fontWeight: 400 }}>
              Etiquetado estricto por metadatos. Permite segregar en AWS Cost Explorer el gasto exacto imputable a Workspace MTA, Strato Studio y VIISION de forma transparente.
            </p>
          </motion.div>

          {/* Capa 4: AWS Trusted Advisor */}
          <motion.div
            variants={fadeUp(0.29)}
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
                AWS TRUSTED ADVISOR
              </h4>
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.72rem", color: "#00c853", fontWeight: 700 }}>
                PILAR 04
              </span>
            </div>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.78rem", color: "#00c853", padding: "0.15rem 0", fontWeight: 600 }}>
              5 Pilares Well-Architected · Costos & Seguridad
            </div>
            <p style={{ fontFamily: "Inter, system-ui, sans-serif", fontSize: "0.85rem", color: "rgba(245,241,232,0.88)", lineHeight: 1.45, margin: 0, fontWeight: 400 }}>
              Motor de auditoría continua en la nube: alerta sobre volúmenes EBS ociosos, puertos de seguridad abiertos o límites de cuota antes de que impacten la operación.
            </p>
          </motion.div>

        </div>

        {/* Ficha Resumen de Justificación de Gobernanza FinOps */}
        <motion.div
          variants={fadeUp(0.32)}
          initial="hidden"
          animate={entered ? "visible" : "hidden"}
          style={{
            background: "#0A0A0A",
            border: "1px solid rgba(245,241,232,0.15)",
            borderLeft: "4px solid #38bdf8",
            padding: "0.85rem 1.2rem",
            display: "flex",
            flexDirection: "column",
            gap: "0.3rem",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.78rem", color: "#38bdf8", fontWeight: 700 }}>
              DECISIÓN CLAVE: GOBERNANZA ACTIVA FRENTE A CAJA NEGRA
            </span>
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.72rem", color: "#d4a017", fontWeight: 700 }}>
              PRESUPUESTO $10 USD CUBIERTO AL 100%
            </span>
          </div>
          <span style={{ fontFamily: "Inter, system-ui, sans-serif", fontSize: "0.86rem", color: "rgba(245,241,232,0.92)", lineHeight: 1.45 }}>
            <strong style={{ color: "#F5F1E8" }}>¿Por qué CloudWatch + Tagging y no monitoreo tradicional?</strong> En Hostinger los costos eran un solo cobro indivisible y los fallos se detectaban cuando el usuario se quejaba. Con CloudWatch y Cost Allocation Tags, MTA Software obtiene trazabilidad por cliente, diagnóstico en segundos y alertas predictivas antes de cualquier gasto no planificado.
          </span>
        </motion.div>
      </div>

      {/* ══════════════ COLUMNA DERECHA (42%): Simulador 3D con Radar CloudWatch y Fondo Negro Puro ══════════════ */}
      <div style={{ flex: "0 0 42%", position: "relative", display: "flex", flexDirection: "column", justifyContent: "space-between", padding: "1.2rem 1.6rem", boxSizing: "border-box", borderLeft: "1px solid rgba(245,241,232,0.1)", background: "#050505" }}>

        {/* Cabecera Técnica Flotante */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", zIndex: 10 }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <span style={{ width: 8, height: 8, borderRadius: "50%", background: alarmTriggered ? "#ef4444" : "#38bdf8", boxShadow: `0 0 10px ${alarmTriggered ? "#ef4444" : "#38bdf8"}` }} />
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.76rem", color: "#F5F1E8", letterSpacing: "0.12em", textTransform: "uppercase", fontWeight: 700 }}>
              DASHBOARD FINOPS Y RADAR TELEMETRÍA (3D)
            </span>
          </div>
          <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.68rem", color: "rgba(245,241,232,0.6)", background: "rgba(0,0,0,0.5)", border: "1px solid rgba(245,241,232,0.15)", padding: "0.18rem 0.5rem", fontWeight: 600 }}>
            INTERACTIVE WEBGL 3D
          </span>
        </div>

        {/* Selector de Etiquetas de Costos + Botón de Alarma */}
        <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem", zIndex: 10, margin: "0.3rem 0" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "0.35rem" }}>
            {[
              { id: "all", label: "TODOS", sub: "3 CLIENTES" },
              { id: "workspace", label: "WORKSPACE", sub: "FREE TIER" },
              { id: "strato", label: "STRATO", sub: "S3 + EFS" },
              { id: "viision", label: "VIISION", sub: "WEB APPS" },
            ].map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setSelectedTag(t.id)}
                style={{
                  background: selectedTag === t.id ? "#38bdf8" : "rgba(255,255,255,0.03)",
                  color: selectedTag === t.id ? "#0A0A0A" : "rgba(245,241,232,0.85)",
                  border: selectedTag === t.id ? "1px solid #38bdf8" : "1px solid rgba(245,241,232,0.12)",
                  boxShadow: selectedTag === t.id ? "2px 2px 0px #000" : "none",
                  padding: "0.45rem 0.25rem",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "0.15rem",
                  cursor: "pointer",
                  transition: "all 0.15s ease",
                }}
              >
                <span style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: "0.70rem", textTransform: "uppercase" }}>
                  {t.label}
                </span>
                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.55rem", opacity: selectedTag === t.id ? 0.95 : 0.6 }}>
                  {t.sub}
                </span>
              </button>
            ))}
          </div>

          {/* Toggle de Alarma de Presupuesto táctil */}
          <button
            type="button"
            onClick={() => setAlarmTriggered((prev) => !prev)}
            style={{
              background: alarmTriggered ? "#ef4444" : "rgba(255,255,255,0.03)",
              color: alarmTriggered ? "#FFFFFF" : "#ef4444",
              border: alarmTriggered ? "1px solid #ef4444" : "1px solid rgba(239,68,68,0.4)",
              boxShadow: alarmTriggered ? "2px 2px 0px #000" : "none",
              padding: "0.42rem 0.8rem",
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: "0.72rem",
              fontWeight: 700,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "0.5rem",
              transition: "all 0.18s ease",
            }}
          >
            <Bell size={13} />
            <span>{alarmTriggered ? "ALARMA SNS DISPARADA (>85% CONSUMO / $8.50 USD)" : "SIMULAR ALARMA EN CLOUDWATCH (CONSUMO > 85%)"}</span>
          </button>
        </div>

        {/* Contenedor del Canvas Three.js con Radar CloudWatch Centrado */}
        <div style={{ flex: 1, minHeight: "340px", position: "relative" }}>
          <CloudWatchRadarCanvas isActive={isActive} selectedTag={selectedTag} alarmTriggered={alarmTriggered} />
        </div>

        {/* Badge Inferior Explicativo en Vivo */}
        <div
          style={{
            zIndex: 10,
            background: "rgba(10,10,12,0.92)",
            backdropFilter: "blur(8px)",
            border: `1.5px solid ${alarmTriggered ? "#ef4444" : "#38bdf8"}60`,
            padding: "0.6rem 1rem",
            display: "flex",
            alignItems: "center",
            gap: "0.6rem",
          }}
        >
          {alarmTriggered ? (
            <>
              <AlertTriangle size={16} color="#ef4444" style={{ flexShrink: 0 }} />
              <span style={{ fontFamily: "Inter, system-ui, sans-serif", fontSize: "0.82rem", color: "rgba(245,241,232,0.9)" }}>
                <strong style={{ color: "#ef4444" }}>Alerta Disparada:</strong> Consumo de $8.50 USD alcanzado. SNS envía notificación push al Lead Técnico y Auto Scaling contrae instancias ociosas.
              </span>
            </>
          ) : (
            <>
              <CheckCircle2 size={16} color="#38bdf8" style={{ flexShrink: 0 }} />
              <span style={{ fontFamily: "Inter, system-ui, sans-serif", fontSize: "0.82rem", color: "rgba(245,241,232,0.9)" }}>
                {selectedTag === "all" && "Monitoreo integral: CloudWatch captura métricas en us-east-1 y Cost Allocation Tags asignan costos por cliente."}
                {selectedTag === "workspace" && "Filtrado [Project: Workspace-MTA]: Consumo de ERP interno y practicantes cubierto al 100% por Free Tier."}
                {selectedTag === "strato" && "Filtrado [Project: Strato-Studio]: Assets multimedia en S3 y EFS computados y facturados de forma independiente."}
                {selectedTag === "viision" && "Filtrado [Project: VIISION]: Tráfico web servido por CloudFront y ALB con gasto proyectado < $2.00 USD/mes."}
              </span>
            </>
          )}
        </div>
      </div>
    </section>
  );
}

export default S21_MonitoreoFinOps;
