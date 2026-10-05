// src/slides/S19_ArquitecturaDinamica.jsx
import React, { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import {
  Zap,
  Activity,
  AlertTriangle,
  RotateCcw,
  CheckCircle2,
  TrendingUp,
  Server,
  Layers,
  ArrowRight,
  ShieldAlert,
} from "lucide-react";
import { useSlideActive } from "../hooks/useSlideActive.js";
import { AutoScalingArchitectureCanvas } from "../components/three/AutoScalingArchitectureCanvas.jsx";

/**
 * Slide 19 — Arquitectura Dinámica, Alta Disponibilidad y Tolerancia a Fallos
 *
 * Contenido fiel a:
 * - docs/etapa 3.txt (Punto 1: Infraestructura global AWS, Multi-AZ, Elastic Load Balancing y Auto Scaling)
 * - docs/etapa3_propuesta_slides.md (Eje 1: Resiliencia activa, RPO=0, SLA 99.99%)
 *
 * Dinámica Interactiva:
 * - Selector de escenario de tráfico en vivo:
 *   1. "Tráfico Normal" (10 usuarios, 1 nodo por AZ, cobertura Free Tier)
 *   2. "Pico de Asistencias" (150 alumnos, Auto Scaling despierta nodos dinámicamente)
 *   3. "Falla Zonal en us-east-1a" (Caída física simulada, ALB desvía el 100% a us-east-1b sin downtime)
 */
export function S19_ArquitecturaDinamica({ isActive: propActive } = {}) {
  const shouldReduceMotion = useReducedMotion();
  const hookActive = useSlideActive(18);
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

  // Estados interactivos del simulador
  const [trafficMode, setTrafficMode] = useState("normal"); // "normal" | "peak" | "fail_zone_a"

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
      {/* Retícula ambiental neutra y scanlines */}
      <div aria-hidden="true" style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(245,241,232,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(245,241,232,0.02) 1px, transparent 1px)", backgroundSize: "64px 64px", pointerEvents: "none", zIndex: 0 }} />
      <div aria-hidden="true" style={{ position: "absolute", inset: 0, background: "repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,0,0,0.07) 3px, rgba(0,0,0,0.07) 6px)", pointerEvents: "none", zIndex: 1 }} />

      {/* Línea vertical de acento Oro AWS */}
      <motion.div
        aria-hidden="true"
        initial={{ scaleY: 0, transformOrigin: "top" }}
        animate={entered ? { scaleY: 1 } : { scaleY: 0 }}
        transition={{ duration: shouldReduceMotion ? 0.1 : 0.65, ease: [0.83, 0, 0.17, 1], delay: 0.05 }}
        style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 4, background: "#d4a017", zIndex: 3 }}
      />

      {/* ══════════════ COLUMNA IZQUIERDA (58%): Arquitectura Completa, Decisión y Métricas ══════════════ */}
      <div style={{ flex: "0 0 58%", display: "flex", flexDirection: "column", justifyContent: "center", padding: "1.2rem 2rem 1.2rem 3.6rem", position: "relative", zIndex: 2, gap: "0.5rem", boxSizing: "border-box" }}>

        {/* Header Editorial */}
        <div style={{ display: "flex", flexDirection: "column", gap: "0.15rem" }}>
          <motion.div variants={fadeUp(0.04)} initial="hidden" animate={entered ? "visible" : "hidden"} style={{ display: "flex", alignItems: "center", gap: "0.6rem", flexWrap: "wrap" }}>
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.86rem", letterSpacing: "0.15em", textTransform: "uppercase", fontWeight: 700, color: "#d4a017", background: "rgba(212,160,23,0.12)", border: "1px solid rgba(212,160,23,0.4)", padding: "0.22rem 0.65rem" }}>
              [ ETAPA 3 · EJE 01 ]
            </span>
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.80rem", color: "#6e8e59", background: "rgba(110,142,89,0.15)", border: "1px solid rgba(110,142,89,0.4)", padding: "0.20rem 0.55rem", fontWeight: 700 }}>
              SLA 99.99% · RPO = 0 · RTO &lt; 30s
            </span>
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.78rem", color: "rgba(245,241,232,0.7)" }}>
              US-EAST-1 (N. VIRGINIA)
            </span>
          </motion.div>

          <motion.p variants={fadeUp(0.08)} initial="hidden" animate={entered ? "visible" : "hidden"}
            style={{ fontFamily: "Yellowtail, cursive", fontSize: "clamp(1.5rem, 2.2vw, 2rem)", color: "#e8a0bf", lineHeight: 1.1, margin: "0.1rem 0 0 0", fontWeight: 400 }}>
            Elasticidad y Resiliencia en la Nube
          </motion.p>

          <motion.h1 variants={fadeUp(0.12)} initial="hidden" animate={entered ? "visible" : "hidden"}
            style={{ fontFamily: "'Archivo Black', 'Arial Black', sans-serif", fontSize: "clamp(1.8rem, 2.5vw, 2.45rem)", color: "#F5F1E8", letterSpacing: "-0.025em", lineHeight: 1.05, textTransform: "uppercase", margin: 0, fontWeight: 400 }}>
            ARQUITECTURA DINÁMICA & MULTI-AZ
          </motion.h1>

          <motion.div
            initial={{ clipPath: "inset(0 100% 0 0)" }}
            animate={entered ? { clipPath: "inset(0 0% 0 0)" } : { clipPath: "inset(0 100% 0 0)" }}
            transition={{ duration: shouldReduceMotion ? 0.1 : 0.55, ease: [0.83, 0, 0.17, 1], delay: 0.18 }}
            style={{ height: 2, background: "#d4a017", width: "100%", maxWidth: 240, margin: "0.12rem 0" }}
          />

          <motion.p variants={fadeUp(0.16)} initial="hidden" animate={entered ? "visible" : "hidden"}
            style={{ fontFamily: "Inter, system-ui, sans-serif", fontSize: "clamp(0.92rem, 1.05vw, 1.02rem)", color: "rgba(245,241,232,0.85)", margin: 0, lineHeight: 1.4, fontWeight: 400 }}>
            Diseño basado en la infraestructura global de AWS y automatización de recursos: balanceo en Capa 7, cómputo escalable y distribución activa en múltiples Zonas de Disponibilidad.
          </motion.p>
        </div>

        {/* Grid de los 4 Componentes Clave de la Arquitectura (Estilo S11/S12 con fuentes más amplias) */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.65rem" }}>
          
          {/* Bloque 1: Multi-AZ Redundancy */}
          <motion.div
            variants={fadeUp(0.20)}
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
                DISTRIBUCIÓN MULTI-AZ
              </h4>
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.72rem", color: "#d4a017", fontWeight: 700 }}>
                CAPA 01
              </span>
            </div>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.78rem", color: "#d4a017", padding: "0.15rem 0", fontWeight: 600 }}>
              us-east-1a + us-east-1b (N. Virginia)
            </div>
            <p style={{ fontFamily: "Inter, system-ui, sans-serif", fontSize: "0.85rem", color: "rgba(245,241,232,0.88)", lineHeight: 1.45, margin: 0, fontWeight: 400 }}>
              Centros de datos físicamente aislados. Si una zona entera sufre un corte eléctrico o catástrofe, la otra asume el tráfico sin interrupción.
            </p>
          </motion.div>

          {/* Bloque 2: Elastic Load Balancing (ALB) */}
          <motion.div
            variants={fadeUp(0.23)}
            initial="hidden"
            animate={entered ? "visible" : "hidden"}
            style={{
              padding: "0.85rem 1.05rem",
              background: "rgba(255,255,255,0.02)",
              border: "1px solid rgba(245,241,232,0.12)",
              borderLeft: "3px solid #6e8e59",
              display: "flex",
              flexDirection: "column",
              gap: "0.32rem",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <h4 style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: "0.90rem", color: "#F5F1E8", textTransform: "uppercase", margin: 0, fontWeight: 400 }}>
                APPLICATION LOAD BALANCER
              </h4>
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.72rem", color: "#6e8e59", fontWeight: 700 }}>
                CAPA 02
              </span>
            </div>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.78rem", color: "#6e8e59", padding: "0.15rem 0", fontWeight: 600 }}>
              Health Checks L7 (30s) · SSL/TLS (ACM)
            </div>
            <p style={{ fontFamily: "Inter, system-ui, sans-serif", fontSize: "0.85rem", color: "rgba(245,241,232,0.88)", lineHeight: 1.45, margin: 0, fontWeight: 400 }}>
              Punto de entrada público único con alta disponibilidad nativa. Inspecciona rutas y redirige peticiones solo a instancias saludables (código 200).
            </p>
          </motion.div>

          {/* Bloque 3: Amazon EC2 Escalable */}
          <motion.div
            variants={fadeUp(0.26)}
            initial="hidden"
            animate={entered ? "visible" : "hidden"}
            style={{
              padding: "0.85rem 1.05rem",
              background: "rgba(255,255,255,0.02)",
              border: "1px solid rgba(245,241,232,0.12)",
              borderLeft: "3px solid #6e8e59",
              display: "flex",
              flexDirection: "column",
              gap: "0.32rem",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <h4 style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: "0.90rem", color: "#F5F1E8", textTransform: "uppercase", margin: 0, fontWeight: 400 }}>
                CÓMPUTO EC2 DINÁMICO
              </h4>
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.72rem", color: "#6e8e59", fontWeight: 700 }}>
                CAPA 03
              </span>
            </div>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.78rem", color: "#6e8e59", padding: "0.15rem 0", fontWeight: 600 }}>
              Graviton t4g.small · EBS gp3 20GB
            </div>
            <p style={{ fontFamily: "Inter, system-ui, sans-serif", fontSize: "0.85rem", color: "rgba(245,241,232,0.88)", lineHeight: 1.45, margin: 0, fontWeight: 400 }}>
              Servidores virtuales que ejecutan los sistemas de MTA (Workspace, Strato y VIISION). Permiten aprovisionar o reemplazar instancias en segundos.
            </p>
          </motion.div>

          {/* Bloque 4: Auto Scaling & Continuidad */}
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
                AMAZON EC2 AUTO SCALING
              </h4>
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.72rem", color: "#d4a017", fontWeight: 700 }}>
                CAPA 04
              </span>
            </div>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.78rem", color: "#d4a017", padding: "0.15rem 0", fontWeight: 600 }}>
              Mín: 1 · Deseado: 2 · Máx: 4 (CPU &gt; 70%)
            </div>
            <p style={{ fontFamily: "Inter, system-ui, sans-serif", fontSize: "0.85rem", color: "rgba(245,241,232,0.88)", lineHeight: 1.45, margin: 0, fontWeight: 400 }}>
              Garantiza elasticidad y continuidad: reacciona automáticamente ante picos de demanda y se contrae de noche para no exceder presupuesto.
            </p>
          </motion.div>

        </div>

        {/* Ficha Resumen de Continuidad y Justificación */}
        <motion.div
          variants={fadeUp(0.32)}
          initial="hidden"
          animate={entered ? "visible" : "hidden"}
          style={{
            background: "#0A0A0A",
            border: "1px solid rgba(245,241,232,0.15)",
            borderLeft: "4px solid #d4a017",
            padding: "0.85rem 1.2rem",
            display: "flex",
            flexDirection: "column",
            gap: "0.3rem",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.78rem", color: "#d4a017", fontWeight: 700 }}>
              DECISIÓN CLAVE: RESILIENCIA ACTIVA FRENTE A HOSTING MONOLÍTICO
            </span>
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.72rem", color: "#6e8e59", fontWeight: 700 }}>
              SLA 99.99% GARANTIZADO
            </span>
          </div>
          <span style={{ fontFamily: "Inter, system-ui, sans-serif", fontSize: "0.86rem", color: "rgba(245,241,232,0.92)", lineHeight: 1.45 }}>
            La infraestructura anterior dependía de un único servidor con riesgo crítico de SPOF. Al integrar <strong style={{ color: "#d4a017" }}>ALB + Auto Scaling Multi-AZ</strong>, MTA Software asegura continuidad de negocio sin intervención humana y con failover en menos de 5 segundos.
          </span>
        </motion.div>
      </div>

      {/* ══════════════ COLUMNA DERECHA (42%): Simulador 3D con Fondo Negro Puro y Centrado Elevado ══════════════ */}
      <div style={{ flex: "0 0 42%", position: "relative", display: "flex", flexDirection: "column", justifyContent: "space-between", padding: "1.2rem 1.6rem", boxSizing: "border-box", borderLeft: "1px solid rgba(245,241,232,0.1)", background: "#050505" }}>

        {/* Cabecera Técnica Flotante */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", zIndex: 10 }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <span style={{ width: 8, height: 8, borderRadius: "50%", background: trafficMode === "fail_zone_a" ? "#ef4444" : (trafficMode === "peak" ? "#00c853" : "#d4a017"), boxShadow: `0 0 10px ${trafficMode === "fail_zone_a" ? "#ef4444" : (trafficMode === "peak" ? "#00c853" : "#d4a017")}` }} />
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.76rem", color: "#F5F1E8", letterSpacing: "0.12em", textTransform: "uppercase", fontWeight: 700 }}>
              SIMULADOR DE RESILIENCIA MULTI-AZ
            </span>
          </div>
          <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.68rem", color: "rgba(245,241,232,0.6)", background: "rgba(0,0,0,0.5)", border: "1px solid rgba(245,241,232,0.15)", padding: "0.18rem 0.5rem", fontWeight: 600 }}>
            INTERACTIVE WEBGL 3D
          </span>
        </div>

        {/* Selector de Modos de Tráfico con estilo idéntico a S11 y S12 */}
        <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem", zIndex: 10, margin: "0.3rem 0" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "0.4rem" }}>
            <button
              type="button"
              onClick={() => setTrafficMode("normal")}
              style={{
                background: trafficMode === "normal" ? "#d4a017" : "rgba(255,255,255,0.03)",
                color: trafficMode === "normal" ? "#0A0A0A" : "rgba(245,241,232,0.85)",
                border: trafficMode === "normal" ? "1px solid #d4a017" : "1px solid rgba(245,241,232,0.12)",
                boxShadow: trafficMode === "normal" ? "2px 2px 0px #000" : "none",
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
                1. Tráfico Normal
              </span>
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.58rem", opacity: trafficMode === "normal" ? 0.9 : 0.6 }}>
                [Balanceo 50/50]
              </span>
            </button>

            <button
              type="button"
              onClick={() => setTrafficMode("peak")}
              style={{
                background: trafficMode === "peak" ? "#6e8e59" : "rgba(255,255,255,0.03)",
                color: trafficMode === "peak" ? "#FFFFFF" : "rgba(245,241,232,0.85)",
                border: trafficMode === "peak" ? "1px solid #6e8e59" : "1px solid rgba(245,241,232,0.12)",
                boxShadow: trafficMode === "peak" ? "2px 2px 0px #000" : "none",
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
                2. Pico de Carga
              </span>
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.58rem", opacity: trafficMode === "peak" ? 0.9 : 0.6 }}>
                [Auto Scaling]
              </span>
            </button>

            <button
              type="button"
              onClick={() => setTrafficMode("fail_zone_a")}
              style={{
                background: trafficMode === "fail_zone_a" ? "#c6432b" : "rgba(255,255,255,0.03)",
                color: trafficMode === "fail_zone_a" ? "#FFFFFF" : "rgba(245,241,232,0.85)",
                border: trafficMode === "fail_zone_a" ? "1px solid #c6432b" : "1px solid rgba(245,241,232,0.12)",
                boxShadow: trafficMode === "fail_zone_a" ? "2px 2px 0px #000" : "none",
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
                3. Caída Zona A
              </span>
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.58rem", opacity: trafficMode === "fail_zone_a" ? 0.9 : 0.6 }}>
                [Failover a B]
              </span>
            </button>
          </div>
        </div>

        {/* Contenedor del Canvas Three.js con Estrellas */}
        <div style={{ flex: 1, minHeight: "330px", position: "relative" }}>
          <AutoScalingArchitectureCanvas isActive={isActive} trafficMode={trafficMode} />
        </div>

        {/* Badge Inferior Explicativo en Vivo */}
        <div
          style={{
            zIndex: 10,
            background: "rgba(10,10,12,0.92)",
            backdropFilter: "blur(8px)",
            border: `1.5px solid ${trafficMode === "fail_zone_a" ? "#ef4444" : (trafficMode === "peak" ? "#00c853" : "#d4a017")}60`,
            padding: "0.55rem 0.9rem",
            display: "flex",
            alignItems: "center",
            gap: "0.55rem",
          }}
        >
          {trafficMode === "normal" && (
            <>
              <CheckCircle2 size={16} color="#d4a017" style={{ flexShrink: 0 }} />
              <span style={{ fontFamily: "Inter, system-ui, sans-serif", fontSize: "0.80rem", color: "rgba(245,241,232,0.9)" }}>
                <strong style={{ color: "#d4a017" }}>Operación Base:</strong> El ALB reparte 50/50 entre `us-east-1a` y `us-east-1b`. Carga estable y coste mínimo controlado.
              </span>
            </>
          )}

          {trafficMode === "peak" && (
            <>
              <TrendingUp size={16} color="#00c853" style={{ flexShrink: 0 }} />
              <span style={{ fontFamily: "Inter, system-ui, sans-serif", fontSize: "0.80rem", color: "rgba(245,241,232,0.9)" }}>
                <strong style={{ color: "#00c853" }}>Auto Scaling Activado:</strong> CPU &gt; 70% detectada. El grupo lanza automáticamente 2 servidores adicionales para tolerar la sobrecarga.
              </span>
            </>
          )}

          {trafficMode === "fail_zone_a" && (
            <>
              <ShieldAlert size={16} color="#ef4444" style={{ flexShrink: 0 }} />
              <span style={{ fontFamily: "Inter, system-ui, sans-serif", fontSize: "0.80rem", color: "rgba(245,241,232,0.9)" }}>
                <strong style={{ color: "#ef4444" }}>Falla física en us-east-1a:</strong> El ALB aísla la zona dañada en &lt;5s y deriva el 100% a us-east-1b. <strong style={{ color: "#00c853" }}>Sin caída para el usuario.</strong>
              </span>
            </>
          )}
        </div>
      </div>
    </section>
  );
}

export default S19_ArquitecturaDinamica;
