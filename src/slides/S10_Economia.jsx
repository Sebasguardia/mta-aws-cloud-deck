// src/slides/S10_Economia.jsx
import React, { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import {
  DollarSign,
  TrendingUp,
  AlertTriangle,
  ShieldCheck,
  Zap,
  CheckCircle2,
  Calendar,
  Layers,
  ArrowRight,
  Sliders,
} from "lucide-react";
import { slidesContent } from "../data/content.es.js";
import { useSlideActive } from "../hooks/useSlideActive.js";
import { useSharedDeckState } from "../hooks/useSharedDeckState.js";
import { CostOptimizationCanvas } from "../components/three/CostOptimizationCanvas.jsx";
import { CountUp } from "../components/motion/CountUp.jsx";
import { Badge } from "../components/ui/Badge.jsx";
import { easings } from "../lib/easings.js";

const c = slidesContent.s10_economia;

/**
 * S10 — Modelo Económico y Optimización Financiera.
 *
 * Directivas de diseño:
 *  - /industrial-brutalist-ui:
 *    Estética de terminal financiera / auditoría analítica (#0A0A0A),
 *    rejilla técnica militar, bordes nítidos de 1px/2px, etiquetas monospace y
 *    distribución panorámica de pantalla completa 50%/50% sin scroll ni recortes.
 *  - /impeccable:
 *    Presentación estructurada de los 3 pilares económicos (Pay-as-you-go, Free Tier, AWS Budgets a $10 USD).
 *    Tipografía con formato numérico tabular estricto para evitar saltos de línea.
 *  - /threejs-geometry + /threejs-animation + /threejs-interaction:
 *    `CostOptimizationCanvas`: Modelo 3D con pilar fijo (Hostinger $35) vs pilar elástico (AWS)
 *    que se expande o contrae en tiempo real al manipular el slider, con anillo de umbral de $10 USD.
 *  - /emil-design-eng + /animate:
 *    Calculadora interactiva reactiva conectada al slider de usuarios concurrentes (peticiones ERP/mes),
 *    con notificación automática de alerta emitida por AWS Budgets cuando se rebasa el umbral de $10 USD.
 */
export function S10_Economia({ isActive: propActive } = {}) {
  const shouldReduceMotion = useReducedMotion();
  const hookActive = useSlideActive(9);
  const sectionRef = useRef(null);
  const [domActive, setDomActive] = useState(false);

  // Observador de mutación para Reveal.js .present
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const checkPresent = () => {
      setDomActive(el.classList.contains("present"));
    };
    checkPresent();
    const observer = new MutationObserver(checkPresent);
    observer.observe(el, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, []);

  const isActive = propActive !== undefined ? (propActive || domActive) : (hookActive || domActive);
  const [entered, setEntered] = useState(false);

  // Estado compartido de la calculadora
  const { simulatedUsers, setSimulatedUsers, budgetLimit } = useSharedDeckState();

  const hostingerFixedCost = 35.0;

  // Primeros 1,000 usuarios cubiertos al 100% por AWS Free Tier
  const awsEstimatedCost =
    simulatedUsers <= 1000
      ? 0.0
      : parseFloat(((simulatedUsers - 1000) * 0.0068).toFixed(2));

  const isBudgetAlert = awsEstimatedCost >= budgetLimit;

  // Activar entrada escalonada al montarse el slide
  useEffect(() => {
    if (isActive) {
      const timer = setTimeout(() => setEntered(true), 40);
      return () => clearTimeout(timer);
    } else {
      setEntered(false);
    }
  }, [isActive]);

  const fadeUp = (delay = 0) => ({
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 16 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: shouldReduceMotion ? 0.1 : 0.5, ease: [0.16, 1, 0.3, 1], delay },
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
      {/* ── Retícula de fondo sutil ── */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "linear-gradient(rgba(245,241,232,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(245,241,232,0.025) 1px, transparent 1px)",
          backgroundSize: "64px 64px",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />

      {/* ── Scanlines analógicas tenues ── */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          background:
            "repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,0,0,0.07) 3px, rgba(0,0,0,0.07) 6px)",
          pointerEvents: "none",
          zIndex: 1,
        }}
      />

      {/* ── Luz ambiental según estado presupuestario ── */}
      <motion.div
        aria-hidden="true"
        animate={{
          opacity: isBudgetAlert ? 0.25 : 0.1,
        }}
        transition={{ duration: 0.5 }}
        style={{
          position: "absolute",
          inset: 0,
          background: isBudgetAlert
            ? "radial-gradient(circle at 75% 50%, rgba(198,67,43,0.25) 0%, transparent 65%)"
            : "radial-gradient(circle at 75% 50%, rgba(212,160,23,0.18) 0%, transparent 65%)",
          pointerEvents: "none",
          zIndex: 1,
        }}
      />

      {/* ── Barra de acento vertical izquierda Oro AWS ── */}
      <motion.div
        aria-hidden="true"
        initial={{ transform: "scaleY(0)", transformOrigin: "top" }}
        animate={entered ? { transform: "scaleY(1)" } : { transform: "scaleY(0)" }}
        transition={{ duration: shouldReduceMotion ? 0.1 : 0.65, ease: [0.83, 0, 0.17, 1], delay: 0.05 }}
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          bottom: 0,
          width: 4,
          background: isBudgetAlert ? "#c6432b" : "#d4a017",
          transition: "background 0.3s ease",
          zIndex: 3,
        }}
      />

      {/* ══════════════════════════════════════════════════════════
          COLUMNA IZQUIERDA (50%): Análisis Económico & Calculadora
      ══════════════════════════════════════════════════════════ */}
      <div
        style={{
          flex: "0 0 50%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "2.5rem 3rem 2.5rem 4.8rem",
          position: "relative",
          zIndex: 2,
          gap: "0.9rem",
        }}
      >
        {/* Header Editorial */}
        <div style={{ display: "flex", flexDirection: "column", gap: "0.2rem" }}>
          <motion.div
            variants={fadeUp(0.04)}
            initial="hidden"
            animate={entered ? "visible" : "hidden"}
            style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}
          >
            <span
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: "0.65rem",
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                fontWeight: 700,
                color: "#d4a017",
                background: "rgba(212,160,23,0.12)",
                border: "1px solid rgba(212,160,23,0.4)",
                padding: "0.25rem 0.65rem",
              }}
            >
              [ {c.badge} ]
            </span>
            <span
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: "0.62rem",
                letterSpacing: "0.15em",
                color: "rgba(245,241,232,0.45)",
              }}
            >
              SEC_10 // FINANCIAL_OPTIMIZATION_TCO
            </span>
          </motion.div>

          <motion.p
            variants={fadeUp(0.08)}
            initial="hidden"
            animate={entered ? "visible" : "hidden"}
            style={{
              fontFamily: "Yellowtail, cursive",
              fontSize: "clamp(1.3rem, 2vw, 1.8rem)",
              color: "#e8a0bf",
              lineHeight: 1.1,
              margin: "0.15rem 0 0 0",
            }}
          >
            {c.scriptTag}
          </motion.p>

          <motion.h1
            variants={fadeUp(0.12)}
            initial="hidden"
            animate={entered ? "visible" : "hidden"}
            style={{
              fontFamily: "'Archivo Black', 'Arial Black', sans-serif",
              fontSize: "clamp(1.7rem, 2.5vw, 2.4rem)",
              color: "#F5F1E8",
              letterSpacing: "-0.025em",
              lineHeight: 1.05,
              textTransform: "uppercase",
              margin: 0,
            }}
          >
            {c.title}
          </motion.h1>

          <motion.p
            variants={fadeUp(0.16)}
            initial="hidden"
            animate={entered ? "visible" : "hidden"}
            style={{
              fontFamily: "system-ui, -apple-system, sans-serif",
              fontSize: "clamp(0.85rem, 1.05vw, 0.95rem)",
              color: "rgba(245,241,232,0.65)",
              margin: "0.2rem 0 0 0",
              lineHeight: 1.4,
            }}
          >
            {c.subtitle}
          </motion.p>
        </div>

        {/* ── Calculadora Interactiva de Dinámica Financiera ── */}
        <motion.div
          variants={fadeUp(0.22)}
          initial="hidden"
          animate={entered ? "visible" : "hidden"}
          style={{
            padding: "1rem 1.25rem",
            background: "rgba(18,18,18,0.9)",
            border: isBudgetAlert ? "1.5px solid #c6432b" : "1.5px solid rgba(245,241,232,0.15)",
            boxShadow: isBudgetAlert ? "4px 4px 0px #c6432b" : "4px 4px 0px #000000",
            display: "flex",
            flexDirection: "column",
            gap: "0.75rem",
            transition: "border-color 0.3s ease, box-shadow 0.3s ease",
          }}
        >
          {/* Header del Slider */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <TrendingUp size={15} style={{ color: "#d4a017" }} />
              <label
                htmlFor="traffic-slider-s10"
                style={{
                  fontFamily: "'Archivo Black', sans-serif",
                  fontSize: "0.75rem",
                  color: "#F5F1E8",
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                }}
              >
                Tráfico Simulado (Peticiones ERP / Mes):
              </label>
            </div>

            <div
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: "0.85rem",
                fontWeight: 800,
                color: "#d4a017",
                background: "#0A0A0A",
                padding: "0.25rem 0.65rem",
                border: "1px solid rgba(212,160,23,0.4)",
              }}
            >
              {simulatedUsers.toLocaleString()} <span style={{ fontSize: "0.6rem", color: "rgba(245,241,232,0.6)" }}>PETICIONES</span>
            </div>
          </div>

          {/* Slider Input */}
          <input
            id="traffic-slider-s10"
            type="range"
            min="200"
            max="5000"
            step="100"
            value={simulatedUsers}
            onChange={(e) => setSimulatedUsers(Number(e.target.value))}
            style={{
              width: "100%",
              height: 6,
              accentColor: "#d4a017",
              background: "rgba(245,241,232,0.15)",
              cursor: "pointer",
            }}
          />

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: "0.6rem",
              color: "rgba(245,241,232,0.5)",
            }}
          >
            <span>200 (Pruebas iniciales)</span>
            <span style={{ color: "#6e8e59", fontWeight: 700 }}>▲ 1,000 (Free Tier: $0.00 USD)</span>
            <span>5,000 (Carga máxima)</span>
          </div>

          {/* Comparativa en 2 Columnas de Costo */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem", marginTop: "0.2rem" }}>
            {/* Hostinger Fijo */}
            <div
              style={{
                padding: "0.75rem 0.9rem",
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(245,241,232,0.12)",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
              }}
            >
              <div>
                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.58rem", color: "rgba(245,241,232,0.5)", textTransform: "uppercase" }}>
                  HOSTINGER COMPARTIDO
                </span>
                <div style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: "0.75rem", color: "#F5F1E8", marginTop: "0.15rem" }}>
                  PLAN EMPRESARIAL FIJO
                </div>
              </div>
              <div style={{ marginTop: "0.6rem", display: "flex", alignItems: "baseline", justifyContent: "space-between" }}>
                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.58rem", color: "rgba(245,241,232,0.5)" }}>
                  COSTO MENSUAL:
                </span>
                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "1.1rem", fontWeight: 800, color: "#F5F1E8" }}>
                  ${hostingerFixedCost.toFixed(2)} <span style={{ fontSize: "0.65rem", fontWeight: 400, color: "rgba(245,241,232,0.6)" }}>USD</span>
                </span>
              </div>
            </div>

            {/* AWS Pay-As-You-Go */}
            <div
              style={{
                padding: "0.75rem 0.9rem",
                background: isBudgetAlert ? "rgba(198,67,43,0.12)" : "rgba(212,160,23,0.08)",
                border: isBudgetAlert ? "1.5px solid #c6432b" : "1.5px solid rgba(212,160,23,0.5)",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                transition: "all 0.3s ease",
              }}
            >
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.58rem", color: "#d4a017", fontWeight: 700, textTransform: "uppercase" }}>
                    AWS FOUNDATIONS
                  </span>
                  <span
                    style={{
                      fontFamily: "'JetBrains Mono', monospace",
                      fontSize: "0.55rem",
                      padding: "0.1rem 0.4rem",
                      background: awsEstimatedCost === 0 ? "rgba(110,142,89,0.25)" : isBudgetAlert ? "rgba(198,67,43,0.25)" : "rgba(212,160,23,0.2)",
                      color: awsEstimatedCost === 0 ? "#6e8e59" : isBudgetAlert ? "#c6432b" : "#d4a017",
                      fontWeight: 700,
                    }}
                  >
                    {awsEstimatedCost === 0 ? "FREE TIER" : isBudgetAlert ? "ALERTA $10" : "PAY-AS-YOU-GO"}
                  </span>
                </div>
                <div style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: "0.75rem", color: "#F5F1E8", marginTop: "0.15rem" }}>
                  INFRAESTRUCTURA ELÁSTICA
                </div>
              </div>
              <div style={{ marginTop: "0.6rem", display: "flex", alignItems: "baseline", justifyContent: "space-between" }}>
                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.58rem", color: "rgba(245,241,232,0.5)" }}>
                  COSTO CALCULADO:
                </span>
                <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "1.1rem", fontWeight: 800, color: isBudgetAlert ? "#c6432b" : "#d4a017" }}>
                  ${awsEstimatedCost.toFixed(2)} <span style={{ fontSize: "0.65rem", fontWeight: 400, color: "rgba(245,241,232,0.6)" }}>USD</span>
                </div>
              </div>
            </div>
          </div>

          {/* Banner de Monitoreo / Alerta de AWS Budgets */}
          <AnimatePresence mode="wait">
            {isBudgetAlert ? (
              <motion.div
                key="alert-on"
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.2 }}
                style={{
                  padding: "0.55rem 0.8rem",
                  background: "rgba(198,67,43,0.25)",
                  border: "1px solid #c6432b",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <AlertTriangle size={15} style={{ color: "#c6432b", flexShrink: 0 }} />
                  <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.65rem", color: "#F5F1E8" }}>
                    ⚠️ AWS Budgets disparó notificación preventiva: umbral de $10.00 USD superado.
                  </span>
                </div>
                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.58rem", color: "#c6432b", fontWeight: 800 }}>
                  ALERTA_SNS
                </span>
              </motion.div>
            ) : (
              <motion.div
                key="alert-off"
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.2 }}
                style={{
                  padding: "0.55rem 0.8rem",
                  background: "rgba(110,142,89,0.12)",
                  border: "1px solid rgba(110,142,89,0.35)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <ShieldCheck size={15} style={{ color: "#6e8e59", flexShrink: 0 }} />
                  <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.65rem", color: "rgba(245,241,232,0.8)" }}>
                    AWS Budgets en monitoreo activo. Límite preventivo configurado en $10.00 USD.
                  </span>
                </div>
                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.58rem", color: "#6e8e59", fontWeight: 800 }}>
                  STATUS_OK
                </span>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* ── 3 Pilares Metodológicos Resumidos ── */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "0.6rem" }}>
          {c.points.map((pt, idx) => (
            <motion.div
              key={pt.title}
              variants={fadeUp(0.32 + idx * 0.06)}
              initial="hidden"
              animate={entered ? "visible" : "hidden"}
              style={{
                padding: "0.75rem 0.85rem",
                background: "rgba(255,255,255,0.02)",
                border: "1px solid rgba(245,241,232,0.12)",
                borderTop: idx === 1 ? "2px solid #6e8e59" : "2px solid #d4a017",
                display: "flex",
                flexDirection: "column",
                gap: "0.3rem",
              }}
            >
              <span
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: "0.55rem",
                  color: idx === 1 ? "#6e8e59" : "#d4a017",
                  fontWeight: 700,
                  letterSpacing: "0.1em",
                }}
              >
                0{idx + 1} // PILAR
              </span>
              <h4
                style={{
                  fontFamily: "'Archivo Black', sans-serif",
                  fontSize: "0.72rem",
                  color: "#F5F1E8",
                  textTransform: "uppercase",
                  margin: 0,
                  lineHeight: 1.2,
                }}
              >
                {pt.title}
              </h4>
              <p
                style={{
                  fontFamily: "system-ui, -apple-system, sans-serif",
                  fontSize: "0.65rem",
                  color: "rgba(245,241,232,0.65)",
                  lineHeight: 1.35,
                  margin: 0,
                }}
              >
                {pt.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════
          COLUMNA DERECHA (50%): Visualizador 3D de Costo & Balance
      ══════════════════════════════════════════════════════════ */}
      <div
        style={{
          flex: "0 0 50%",
          position: "relative",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          overflow: "hidden",
          borderLeft: "1px solid rgba(245,241,232,0.1)",
          background: "radial-gradient(ellipse at center, #141414 0%, #0a0a0a 85%)",
        }}
      >
        {/* Cabecera Técnica Flotante */}
        <div
          style={{
            position: "absolute",
            top: "2.5rem",
            right: "3.5rem",
            left: "3rem",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            zIndex: 10,
            pointerEvents: "none",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
            <DollarSign size={14} style={{ color: isBudgetAlert ? "#c6432b" : "#d4a017" }} />
            <span
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: "0.65rem",
                letterSpacing: "0.15em",
                color: isBudgetAlert ? "#c6432b" : "rgba(245,241,232,0.6)",
                textTransform: "uppercase",
              }}
            >
              FINANCIAL ARCHITECTURE // TCO BALANCE
            </span>
          </div>

          <div
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: "0.6rem",
              padding: "0.2rem 0.5rem",
              background: isBudgetAlert ? "rgba(198,67,43,0.15)" : "rgba(0,0,0,0.6)",
              border: isBudgetAlert ? "1px solid #c6432b" : "1px solid rgba(245,241,232,0.15)",
              color: isBudgetAlert ? "#c6432b" : "#d4a017",
            }}
          >
            {isBudgetAlert ? "BUDGET: EXCEEDED (> $10 USD)" : "BUDGET: SAFE (< $10 USD)"}
          </div>
        </div>

        {/* Canvas 3D Three.js */}
        <div
          style={{
            width: "100%",
            height: "75%",
            position: "relative",
            zIndex: 5,
          }}
        >
          <CostOptimizationCanvas
            isActive={isActive}
            simulatedUsers={simulatedUsers}
            isAlert={isBudgetAlert}
          />
        </div>

        {/* HUD Inferior con Métricas de Costo y Ahorro */}
        <div
          style={{
            position: "absolute",
            bottom: "2rem",
            left: "3rem",
            right: "3.5rem",
            zIndex: 10,
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "0.75rem",
          }}
        >
          <div
            style={{
              padding: "0.6rem 0.9rem",
              background: "rgba(14,14,14,0.75)",
              border: "1px solid rgba(245,241,232,0.15)",
              backdropFilter: "blur(6px)",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div>
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.55rem", color: "rgba(245,241,232,0.5)" }}>
                HOSTINGER FIJO ANUAL
              </div>
              <div style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: "0.85rem", color: "#F5F1E8", marginTop: "0.15rem" }}>
                $420.00 <span style={{ fontSize: "0.6rem", fontWeight: 400, color: "rgba(245,241,232,0.6)" }}>USD/AÑO</span>
              </div>
            </div>
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.58rem", color: "rgba(245,241,232,0.4)" }}>
              RECURSOS OCIOSOS
            </span>
          </div>

          <div
            style={{
              padding: "0.6rem 0.9rem",
              background: isBudgetAlert ? "rgba(198,67,43,0.15)" : "rgba(212,160,23,0.08)",
              border: isBudgetAlert ? "1px solid #c6432b" : "1px solid rgba(212,160,23,0.4)",
              backdropFilter: "blur(6px)",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div>
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.55rem", color: isBudgetAlert ? "#c6432b" : "#d4a017" }}>
                AWS CLOUD FOUNDATIONS
              </div>
              <div style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: "0.85rem", color: isBudgetAlert ? "#c6432b" : "#d4a017", marginTop: "0.15rem" }}>
                {awsEstimatedCost === 0 ? "CAPA GRATUITA ($0)" : `$${(awsEstimatedCost * 12).toFixed(2)} USD/AÑO PROY.`}
              </div>
            </div>
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.58rem", color: isBudgetAlert ? "#c6432b" : "#6e8e59", fontWeight: 700 }}>
              {isBudgetAlert ? "NOTIFICACIÓN ACTIVA" : "AHORRO OPERATIVO"}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}

export default S10_Economia;