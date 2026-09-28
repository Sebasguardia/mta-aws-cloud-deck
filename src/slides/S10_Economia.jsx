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
  Table,
  Server,
  Database,
  HardDrive,
  Network,
} from "lucide-react";
import { slidesContent } from "../data/content.es.js";
import { useSlideActive } from "../hooks/useSlideActive.js";
import { useSharedDeckState } from "../hooks/useSharedDeckState.js";
import { CostOptimizationCanvas } from "../components/three/CostOptimizationCanvas.jsx";
import { CanvasTransitionWrapper } from "../components/motion/CanvasTransitionWrapper.jsx";
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
  // Modo de vista: 'simulator' (Simulador de Tráfico) o 'table' (Desglose de Servicios)
  const [viewMode, setViewMode] = useState("simulator");
  // Servicio seleccionado para auditoría detallada en el panel derecho / inspector
  const [selectedServiceId, setSelectedServiceId] = useState("s3");

  // Estado compartido de la calculadora
  const { simulatedUsers, setSimulatedUsers, budgetLimit } = useSharedDeckState();

  const hostingerFixedCost = 35.0;

  // Desglose exhaustivo de servicios de AWS en us-east-1 con Free Tier y costo real
  const awsServicesBreakdown = [
    {
      id: "s3",
      name: "Amazon S3",
      code: "AWS-STORAGE",
      category: "Almacenamiento Frontend & Assets Estáticos",
      freeTier: "5 GB estándar · 20,000 GETs · 2,000 PUTs al mes",
      mtaUsage: "~1.2 GB en 3 proyectos (Strato, VIISION, Workspace)",
      monthlyCost: "$0.00",
      postFreeTier: "$0.023 / GB (~$0.05 / mes)",
      status: "100% FREE TIER",
      color: "#6e8e59",
      icon: HardDrive,
      summary: "Aloja las Single Page Applications de React/Next.js y el ERP interno. Al no requerir un servidor Apache o Nginx corriendo 24/7 para servir HTML/JS, el costo se reduce a cero.",
      sla: "99.99% Disponibilidad · 11 Nueves de Durabilidad",
      regionNote: "En us-east-1 cuesta $0.023/GB vs $0.040/GB en São Paulo (sa-east-1).",
    },
    {
      id: "cloudfront",
      name: "Amazon CloudFront",
      code: "AWS-CDN-EDGE",
      category: "Red Global CDN con Puntos de Presencia en Lima",
      freeTier: "1 TB (1,000 GB) transferencia · 10,000,000 peticiones HTTP/S",
      mtaUsage: "~20 GB / mes transferidos (MTA usa < 2.5% del cupo)",
      monthlyCost: "$0.00",
      postFreeTier: "GRATIS DE POR VIDA (Nivel permanente)",
      status: "GRATIS PERMANENTE",
      color: "#6e8e59",
      icon: Network,
      summary: "Resuelve el problema de la distancia con Virginia: almacena el frontend en caché en Sudamérica (Lima, Bogotá, Santiago). Los clientes cargan la web en 15 a 30 ms.",
      sla: "99.9% Disponibilidad respaldada",
      regionNote: "El Free Tier de 1 TB mensual no expira a los 12 meses; es permanente.",
    },
    {
      id: "rds",
      name: "Amazon RDS (PostgreSQL)",
      code: "AWS-DATABASE",
      category: "Base de Datos Relacional Administrada (Workspace MTA)",
      freeTier: "750 hrs instancia db.t3.micro + 20 GB SSD GP2/GP3",
      mtaUsage: "720 hrs continuas (1 mes 24/7 sin interrupciones)",
      monthlyCost: "$0.00",
      postFreeTier: "~$14.50 / mes (db.t3.micro bajo demanda)",
      status: "100% FREE TIER",
      color: "#6e8e59",
      icon: Database,
      summary: "Motor relacional del ERP Workspace MTA para registro de horas, notas de los 10 practicantes y proyectos. AWS gestiona copias de seguridad automáticas, parches de seguridad y Multi-AZ failover.",
      sla: "99.95% Disponibilidad en Multi-AZ",
      regionNote: "En us-east-1 cuesta $0.017/hora vs $0.027/hora en sa-east-1.",
    },
    {
      id: "ec2",
      name: "Amazon EC2 (Backend / Staging)",
      code: "AWS-COMPUTE",
      category: "Servidor de Cómputo Elástico para APIs Node.js",
      freeTier: "750 hrs t2.micro / t3.micro + 30 GB almacenamiento EBS",
      mtaUsage: "720 hrs (1 servidor activo 24/7 para desarrollo y Staging)",
      monthlyCost: "$0.00",
      postFreeTier: "~$8.50 / mes (t3.micro en us-east-1)",
      status: "100% FREE TIER",
      color: "#6e8e59",
      icon: Server,
      summary: "Aloja los microservicios backend de Node.js y el entorno de Staging unificado. Reemplaza el caos de probar en laptops individuales por un entorno idéntico a producción.",
      sla: "99.99% Disponibilidad",
      regionNote: "Permite apagar instancias los fines de semana para maximizar el crédito.",
    },
    {
      id: "route53",
      name: "Amazon Route 53",
      code: "AWS-DNS",
      category: "Enrutamiento DNS Global con Chequeos de Salud",
      freeTier: "Sin capa gratuita general (Tarifa base corporativa)",
      mtaUsage: "1 Zona Alojada (Hosted Zone) para dominios MTA",
      monthlyCost: "$0.50",
      postFreeTier: "$0.50 / mes + $0.40 por millón de consultas",
      status: "TARIFA FIJA BASE",
      color: "#d4a017",
      icon: Network,
      summary: "Servicio de nombres de dominio con garantía contractual de 100% SLA (cero caídas toleradas). Deriva las solicitudes de clientes al Punto de Presencia más cercano.",
      sla: "100% SLA CONTRACTUAL (Cero caídas)",
      regionNote: "Servicio global sin dependencia de centros de datos locales.",
    },
    {
      id: "iam",
      name: "AWS IAM & Security",
      code: "AWS-GOVERNANCE",
      category: "Gestión de Identidad: 10 Cuentas Individuales Zero Trust",
      freeTier: "Totalmente gratuito e ilimitado de por vida",
      mtaUsage: "10 usuarios de practicantes + MFA en cuenta root + CloudTrail",
      monthlyCost: "$0.00",
      postFreeTier: "$0.00 (Servicio gratuito central)",
      status: "GRATIS TOTAL",
      color: "#6e8e59",
      icon: ShieldCheck,
      summary: "Elimina el cuello de botella de los 4 encargados en Hostinger. Provee a cada practicante una identidad propia con políticas JSON de Mínimo Privilegio y auditoría en CloudTrail.",
      sla: "99.99% Disponibilidad global",
      regionNote: "Gobierno unificado sin costo adicional para empresas emergentes.",
    },
    {
      id: "budgets",
      name: "AWS Budgets & Alarms",
      code: "AWS-FINANCE",
      category: "Gobernanza Financiera: Alarma Preventiva Límite $10 USD",
      freeTier: "2 presupuestos activos gratuitos + Métricas CloudWatch básicas",
      mtaUsage: "1 presupuesto configurado a $10.00 USD + Notificaciones SNS",
      monthlyCost: "$0.00",
      postFreeTier: "$0.00 (Dentro del cupo de 2 presupuestos)",
      status: "GRATIS TOTAL",
      color: "#6e8e59",
      icon: AlertTriangle,
      summary: "Protección contra sobrecostos: si el consumo acumulado o proyectado alcanza el 80% ($8 USD) o 100% ($10 USD), envía notificaciones por correo y SMS a gerencia.",
      sla: "Monitoreo continuo 24/7",
      regionNote: "Garantiza que MTA jamás pague más de $10 USD sin autorización.",
    },
  ];

  const selectedService = awsServicesBreakdown.find((s) => s.id === selectedServiceId) || awsServicesBreakdown[0];

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
            <span
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: "0.58rem",
                color: "#6e8e59",
                background: "rgba(110,142,89,0.15)",
                border: "1px solid rgba(110,142,89,0.35)",
                padding: "0.15rem 0.45rem",
                fontWeight: 700,
              }}
            >
              REGIÓN BASE: us-east-1 (N. VIRGINIA)
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

        {/* ── Switch Táctil de Modo: Simulador de Tráfico vs Desglose de Servicios ── */}
        <motion.div
          variants={fadeUp(0.19)}
          initial="hidden"
          animate={entered ? "visible" : "hidden"}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "0.45rem 0.6rem",
            background: "rgba(18,18,18,0.9)",
            border: "1.5px solid rgba(245,241,232,0.15)",
            boxShadow: "4px 4px 0px #000000",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", paddingLeft: "0.4rem" }}>
            <DollarSign size={14} style={{ color: "#d4a017" }} />
            <span
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: "0.62rem",
                letterSpacing: "0.15em",
                color: "rgba(245,241,232,0.7)",
                textTransform: "uppercase",
                fontWeight: 700,
              }}
            >
              PANEL ECONÓMICO
            </span>
          </div>

          <div style={{ display: "flex", gap: "0.3rem" }}>
            <button
              type="button"
              onClick={() => setViewMode("simulator")}
              style={{
                fontFamily: "'Archivo Black', sans-serif",
                fontSize: "0.65rem",
                textTransform: "uppercase",
                padding: "0.4rem 0.85rem",
                letterSpacing: "0.05em",
                cursor: "pointer",
                border: "1px solid",
                borderColor: viewMode === "simulator" ? "#d4a017" : "rgba(245,241,232,0.1)",
                background: viewMode === "simulator" ? "#d4a017" : "transparent",
                color: viewMode === "simulator" ? "#0A0A0A" : "rgba(245,241,232,0.5)",
                transition: "all 0.15s ease",
              }}
            >
              ⚡ SIMULADOR DE TRÁFICO
            </button>

            <button
              type="button"
              onClick={() => setViewMode("table")}
              style={{
                fontFamily: "'Archivo Black', sans-serif",
                fontSize: "0.65rem",
                textTransform: "uppercase",
                padding: "0.4rem 0.85rem",
                letterSpacing: "0.05em",
                cursor: "pointer",
                border: "1px solid",
                borderColor: viewMode === "table" ? "#6e8e59" : "rgba(245,241,232,0.1)",
                background: viewMode === "table" ? "#6e8e59" : "transparent",
                color: viewMode === "table" ? "#0A0A0A" : "rgba(245,241,232,0.5)",
                transition: "all 0.15s ease",
              }}
            >
              📊 DESGLOSE DE SERVICIOS
            </button>
          </div>
        </motion.div>

        {/* ── Contenido Dinámico: Simulador vs Tabla de Servicios ── */}
        <AnimatePresence mode="wait">
          {viewMode === "simulator" ? (
            /* Vista 1: Calculadora Interactiva de Dinámica Financiera */
            <motion.div
              key="view-sim"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              style={{
                padding: "0.9rem 1.15rem",
                background: "rgba(18,18,18,0.9)",
                border: isBudgetAlert ? "1.5px solid #c6432b" : "1.5px solid rgba(245,241,232,0.15)",
                boxShadow: isBudgetAlert ? "4px 4px 0px #c6432b" : "4px 4px 0px #000000",
                display: "flex",
                flexDirection: "column",
                gap: "0.65rem",
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
                      fontSize: "0.72rem",
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
                    padding: "0.2rem 0.55rem",
                    border: "1px solid rgba(212,160,23,0.4)",
                  }}
                >
                  {simulatedUsers.toLocaleString()} <span style={{ fontSize: "0.58rem", color: "rgba(245,241,232,0.6)" }}>PETICIONES</span>
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
                  fontSize: "0.58rem",
                  color: "rgba(245,241,232,0.5)",
                }}
              >
                <span>200 (Pruebas iniciales)</span>
                <span style={{ color: "#6e8e59", fontWeight: 700 }}>▲ 1,000 (Free Tier: $0.00 USD)</span>
                <span>5,000 (Carga máxima)</span>
              </div>

              {/* Comparativa en 2 Columnas de Costo */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.65rem", marginTop: "0.1rem" }}>
                {/* Hostinger Fijo */}
                <div
                  style={{
                    padding: "0.65rem 0.8rem",
                    background: "rgba(255,255,255,0.03)",
                    border: "1px solid rgba(245,241,232,0.12)",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                  }}
                >
                  <div>
                    <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.55rem", color: "rgba(245,241,232,0.5)", textTransform: "uppercase" }}>
                      HOSTINGER COMPARTIDO
                    </span>
                    <div style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: "0.72rem", color: "#F5F1E8", marginTop: "0.1rem" }}>
                      PLAN EMPRESARIAL FIJO
                    </div>
                  </div>
                  <div style={{ marginTop: "0.5rem", display: "flex", alignItems: "baseline", justifyContent: "space-between" }}>
                    <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.55rem", color: "rgba(245,241,232,0.5)" }}>
                      COSTO MENSUAL:
                    </span>
                    <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "1.05rem", fontWeight: 800, color: "#F5F1E8" }}>
                      ${hostingerFixedCost.toFixed(2)} <span style={{ fontSize: "0.6rem", fontWeight: 400, color: "rgba(245,241,232,0.6)" }}>USD</span>
                    </span>
                  </div>
                </div>

                {/* AWS Pay-As-You-Go */}
                <div
                  style={{
                    padding: "0.65rem 0.8rem",
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
                      <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.55rem", color: "#d4a017", fontWeight: 700, textTransform: "uppercase" }}>
                        AWS FOUNDATIONS
                      </span>
                      <span
                        style={{
                          fontFamily: "'JetBrains Mono', monospace",
                          fontSize: "0.52rem",
                          padding: "0.1rem 0.35rem",
                          background: awsEstimatedCost === 0 ? "rgba(110,142,89,0.25)" : isBudgetAlert ? "rgba(198,67,43,0.25)" : "rgba(212,160,23,0.2)",
                          color: awsEstimatedCost === 0 ? "#6e8e59" : isBudgetAlert ? "#c6432b" : "#d4a017",
                          fontWeight: 700,
                        }}
                      >
                        {awsEstimatedCost === 0 ? "FREE TIER" : isBudgetAlert ? "ALERTA $10" : "PAY-AS-YOU-GO"}
                      </span>
                    </div>
                    <div style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: "0.72rem", color: "#F5F1E8", marginTop: "0.1rem" }}>
                      INFRAESTRUCTURA ELÁSTICA
                    </div>
                  </div>
                  <div style={{ marginTop: "0.5rem", display: "flex", alignItems: "baseline", justifyContent: "space-between" }}>
                    <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.55rem", color: "rgba(245,241,232,0.5)" }}>
                      COSTO CALCULADO:
                    </span>
                    <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "1.05rem", fontWeight: 800, color: isBudgetAlert ? "#c6432b" : "#d4a017" }}>
                      ${awsEstimatedCost.toFixed(2)} <span style={{ fontSize: "0.6rem", fontWeight: 400, color: "rgba(245,241,232,0.6)" }}>USD</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Banner de Monitoreo / Alerta de AWS Budgets */}
              {isBudgetAlert ? (
                <div
                  style={{
                    padding: "0.45rem 0.75rem",
                    background: "rgba(198,67,43,0.25)",
                    border: "1px solid #c6432b",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "0.45rem" }}>
                    <AlertTriangle size={14} style={{ color: "#c6432b", flexShrink: 0 }} />
                    <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.62rem", color: "#F5F1E8" }}>
                      ⚠️ AWS Budgets disparó notificación preventiva: umbral de $10.00 USD superado.
                    </span>
                  </div>
                  <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.55rem", color: "#c6432b", fontWeight: 800 }}>
                    ALERTA_SNS
                  </span>
                </div>
              ) : (
                <div
                  style={{
                    padding: "0.45rem 0.75rem",
                    background: "rgba(110,142,89,0.12)",
                    border: "1px solid rgba(110,142,89,0.35)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "0.45rem" }}>
                    <ShieldCheck size={14} style={{ color: "#6e8e59", flexShrink: 0 }} />
                    <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.62rem", color: "rgba(245,241,232,0.8)" }}>
                      AWS Budgets en monitoreo activo. Límite preventivo configurado en $10.00 USD.
                    </span>
                  </div>
                  <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.55rem", color: "#6e8e59", fontWeight: 800 }}>
                    STATUS_OK
                  </span>
                </div>
              )}
            </motion.div>
          ) : (
            /* Vista 2: Tabla Técnica de Desglose de Servicios & Costos Reales */
            <motion.div
              key="view-table"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              style={{
                padding: "0.85rem 1rem",
                background: "rgba(18,18,18,0.96)",
                border: "1.5px solid rgba(110,142,89,0.45)",
                boxShadow: "4px 4px 0px #000000",
                display: "flex",
                flexDirection: "column",
                gap: "0.6rem",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <span style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: "0.78rem", color: "#F5F1E8", textTransform: "uppercase" }}>
                    // MATRIZ ECONÓMICA DETALLADA (REGIÓN us-east-1)
                  </span>
                  <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.58rem", color: "#d4a017", marginTop: "0.1rem" }}>
                    Haz click en cualquier servicio para ver su auditoría técnica completa
                  </div>
                </div>
                <span
                  style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: "0.65rem",
                    color: "#6e8e59",
                    background: "rgba(110,142,89,0.2)",
                    border: "1.5px solid #6e8e59",
                    padding: "0.25rem 0.6rem",
                    fontWeight: 800,
                  }}
                >
                  TOTAL INICIAL: $0.50 USD / MES
                </span>
              </div>

              {/* Contenedor expandido con mayor altura y tipografía legible */}
              <div
                style={{
                  maxHeight: "220px",
                  overflowY: "auto",
                  paddingRight: "0.35rem",
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.45rem",
                }}
              >
                {awsServicesBreakdown.map((item) => {
                  const ItemIcon = item.icon;
                  const isSelected = selectedServiceId === item.id;
                  return (
                    <div
                      key={item.id}
                      onClick={() => setSelectedServiceId(item.id)}
                      style={{
                        padding: "0.5rem 0.75rem",
                        background: isSelected ? "rgba(212,160,23,0.18)" : "rgba(255,255,255,0.03)",
                        border: isSelected ? "1.5px solid #d4a017" : "1px solid rgba(245,241,232,0.12)",
                        borderLeft: isSelected ? "4px solid #d4a017" : `4px solid ${item.color}`,
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        gap: "0.75rem",
                        transition: "all 0.15s ease",
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", minWidth: 175 }}>
                        <ItemIcon size={16} style={{ color: isSelected ? "#d4a017" : item.color, flexShrink: 0 }} />
                        <div>
                          <div style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: "0.74rem", color: "#F5F1E8" }}>
                            {item.name}
                          </div>
                          <div style={{ fontFamily: "Inter, sans-serif", fontSize: "0.62rem", color: "rgba(245,241,232,0.6)" }}>
                            {item.category}
                          </div>
                        </div>
                      </div>

                      <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.62rem", color: "rgba(245,241,232,0.8)", flex: 1, textAlign: "left", lineHeight: 1.3 }}>
                        <span style={{ color: "rgba(245,241,232,0.45)" }}>Free Tier: </span>{item.freeTier}
                        <br />
                        <span style={{ color: isSelected ? "#d4a017" : "#6e8e59", fontWeight: 700 }}>MTA: </span>{item.mtaUsage}
                      </div>

                      <div style={{ textAlign: "right", minWidth: 80 }}>
                        <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.95rem", fontWeight: 800, color: item.color }}>
                          {item.monthlyCost}
                        </div>
                        <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.54rem", color: item.color, fontWeight: 700 }}>
                          {item.status}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: "0.62rem",
                  color: "rgba(245,241,232,0.75)",
                  borderTop: "1px dashed rgba(245,241,232,0.2)",
                  paddingTop: "0.45rem",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <span>Ahorro directo vs Hostinger: <strong style={{ color: "#6e8e59", fontSize: "0.72rem" }}>$34.50 USD / mes (98.5%)</strong></span>
                <span style={{ color: "#d4a017", fontWeight: 700 }}>Techo de seguridad: AWS Budgets $10.00 USD</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

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

        {/* ── CUADRO FLOTANTE ARRIBA A LA DERECHA: INSPECTOR DE SERVICIO SELECCIONADO (Si viewMode === 'table') ── */}
        <AnimatePresence>
          {viewMode === "table" && selectedService && (
            <motion.div
              key={`inspector-${selectedService.id}`}
              initial={{ opacity: 0, y: -10, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.96 }}
              transition={{ duration: 0.2 }}
              style={{
                position: "absolute",
                top: "5rem",
                left: "3rem",
                right: "3.5rem",
                zIndex: 25,
                padding: "1rem 1.25rem",
                background: "rgba(14,14,14,0.96)",
                border: "1.5px solid #d4a017",
                boxShadow: "6px 6px 0px rgba(0,0,0,0.9)",
                backdropFilter: "blur(10px)",
                display: "flex",
                flexDirection: "column",
                gap: "0.5rem",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
                  <selectedService.icon size={18} style={{ color: "#d4a017" }} />
                  <div>
                    <h3 style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: "0.95rem", color: "#F5F1E8", margin: 0, textTransform: "uppercase" }}>
                      {selectedService.name}
                    </h3>
                    <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.6rem", color: "rgba(245,241,232,0.55)" }}>
                      {selectedService.code} // {selectedService.category}
                    </span>
                  </div>
                </div>

                <div style={{ textAlign: "right" }}>
                  <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "1.1rem", fontWeight: 800, color: "#6e8e59" }}>
                    {selectedService.monthlyCost} USD
                  </div>
                  <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.55rem", color: "#6e8e59", fontWeight: 700 }}>
                    {selectedService.status}
                  </span>
                </div>
              </div>

              <p style={{ fontFamily: "system-ui, sans-serif", fontSize: "0.78rem", color: "rgba(245,241,232,0.9)", lineHeight: 1.45, margin: "0.2rem 0" }}>
                {selectedService.summary}
              </p>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.5rem", background: "rgba(0,0,0,0.4)", padding: "0.5rem 0.75rem", border: "1px solid rgba(245,241,232,0.1)" }}>
                <div>
                  <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.55rem", color: "rgba(245,241,232,0.5)" }}>
                    SLA & DISPONIBILIDAD
                  </div>
                  <div style={{ fontFamily: "system-ui, sans-serif", fontSize: "0.7rem", color: "#F5F1E8", fontWeight: 600, marginTop: "0.1rem" }}>
                    {selectedService.sla}
                  </div>
                </div>
                <div>
                  <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.55rem", color: "rgba(245,241,232,0.5)" }}>
                    COSTO POST-FREE TIER
                  </div>
                  <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.7rem", color: "#d4a017", fontWeight: 700, marginTop: "0.1rem" }}>
                    {selectedService.postFreeTier}
                  </div>
                </div>
              </div>

              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.6rem", color: "rgba(245,241,232,0.6)", borderTop: "1px solid rgba(245,241,232,0.1)", paddingTop: "0.35rem" }}>
                💡 <span style={{ color: "#d4a017" }}>Justificación us-east-1: </span>{selectedService.regionNote}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Canvas 3D Three.js */}
        <div
          style={{
            width: "100%",
            height: "75%",
            position: "relative",
            zIndex: 5,
          }}
        >
          <CanvasTransitionWrapper isActive={isActive}>
            <CostOptimizationCanvas
              isActive={isActive}
              simulatedUsers={simulatedUsers}
              isAlert={isBudgetAlert}
            />
          </CanvasTransitionWrapper>
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