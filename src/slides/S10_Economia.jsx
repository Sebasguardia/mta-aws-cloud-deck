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
          padding: "2.1rem 3rem 2.1rem 4.5rem",
          position: "relative",
          zIndex: 2,
          gap: "0.85rem",
        }}
      >
        {/* Header Editorial */}
        <div style={{ display: "flex", flexDirection: "column", gap: "0.2rem" }}>
          <motion.div
            variants={fadeUp(0.04)}
            initial="hidden"
            animate={entered ? "visible" : "hidden"}
            style={{ display: "flex", alignItems: "center", gap: "0.75rem", flexWrap: "wrap" }}
          >
            <span
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: "0.80rem",
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                fontWeight: 500,
                color: "#d4a017",
                background: "rgba(212,160,23,0.12)",
                border: "1px solid rgba(212,160,23,0.4)",
                padding: "0.28rem 0.75rem",
              }}
            >
              [ {c.badge} ]
            </span>
            <span
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: "0.76rem",
                letterSpacing: "0.12em",
                color: "rgba(245,241,232,0.48)",
                fontWeight: 400,
              }}
            >
              SEC_10 // FINANCIAL_OPTIMIZATION_TCO
            </span>
            <span
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: "0.72rem",
                color: "#6e8e59",
                background: "rgba(110,142,89,0.15)",
                border: "1px solid rgba(110,142,89,0.35)",
                padding: "0.2rem 0.55rem",
                fontWeight: 500,
              }}
            >
              us-east-1 (N. VIRGINIA)
            </span>
          </motion.div>

          <motion.p
            variants={fadeUp(0.08)}
            initial="hidden"
            animate={entered ? "visible" : "hidden"}
            style={{
              fontFamily: "Yellowtail, cursive",
              fontSize: "clamp(1.4rem, 2.3vw, 2.05rem)",
              color: "#e8a0bf",
              lineHeight: 1.1,
              margin: "0.15rem 0 0 0",
              fontWeight: 400,
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
              fontWeight: 400,
            }}
          >
            {c.title}
          </motion.h1>

          <motion.p
            variants={fadeUp(0.16)}
            initial="hidden"
            animate={entered ? "visible" : "hidden"}
            style={{
              fontFamily: "Inter, sans-serif",
              fontSize: "clamp(0.94rem, 1.1vw, 1.02rem)",
              color: "rgba(245,241,232,0.76)",
              margin: "0.2rem 0 0 0",
              lineHeight: 1.5,
              fontWeight: 400,
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
            padding: "0.5rem 0.65rem",
            background: "rgba(18,18,18,0.9)",
            border: "1.5px solid rgba(245,241,232,0.15)",
            boxShadow: "4px 4px 0px #000000",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", paddingLeft: "0.4rem" }}>
            <DollarSign size={15} style={{ color: "#d4a017" }} />
            <span
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: "0.76rem",
                letterSpacing: "0.12em",
                color: "rgba(245,241,232,0.8)",
                textTransform: "uppercase",
                fontWeight: 500,
              }}
            >
              PANEL ECONÓMICO
            </span>
          </div>

          <div style={{ display: "flex", gap: "0.35rem" }}>
            <button
              type="button"
              onClick={() => setViewMode("simulator")}
              style={{
                fontFamily: "'Archivo Black', sans-serif",
                fontSize: "0.76rem",
                textTransform: "uppercase",
                padding: "0.45rem 0.95rem",
                letterSpacing: "0.04em",
                cursor: "pointer",
                border: "1px solid",
                borderColor: viewMode === "simulator" ? "#d4a017" : "rgba(245,241,232,0.1)",
                background: viewMode === "simulator" ? "#d4a017" : "transparent",
                color: viewMode === "simulator" ? "#0A0A0A" : "rgba(245,241,232,0.5)",
                transition: "all 0.15s ease",
                fontWeight: 400,
              }}
            >
              ⚡ SIMULADOR DE TRÁFICO
            </button>

            <button
              type="button"
              onClick={() => setViewMode("table")}
              style={{
                fontFamily: "'Archivo Black', sans-serif",
                fontSize: "0.76rem",
                textTransform: "uppercase",
                padding: "0.45rem 0.95rem",
                letterSpacing: "0.04em",
                cursor: "pointer",
                border: "1px solid",
                borderColor: viewMode === "table" ? "#6e8e59" : "rgba(245,241,232,0.1)",
                background: viewMode === "table" ? "#6e8e59" : "transparent",
                color: viewMode === "table" ? "#0A0A0A" : "rgba(245,241,232,0.5)",
                transition: "all 0.15s ease",
                fontWeight: 400,
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
                padding: "0.85rem 1.15rem",
                background: "rgba(18,18,18,0.9)",
                border: isBudgetAlert ? "1.5px solid #c6432b" : "1.5px solid rgba(245,241,232,0.15)",
                boxShadow: isBudgetAlert ? "4px 4px 0px #c6432b" : "4px 4px 0px #000000",
                display: "flex",
                flexDirection: "column",
                gap: "0.55rem",
                transition: "border-color 0.3s ease, box-shadow 0.3s ease",
              }}
            >
              {/* Header del Slider */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <TrendingUp size={16} style={{ color: "#d4a017" }} />
                  <label
                    htmlFor="traffic-slider-s10"
                    style={{
                      fontFamily: "'Archivo Black', sans-serif",
                      fontSize: "0.84rem",
                      color: "#F5F1E8",
                      textTransform: "uppercase",
                      letterSpacing: "0.04em",
                      fontWeight: 400,
                    }}
                  >
                    Tráfico Simulado (Peticiones ERP / Mes):
                  </label>
                </div>

                <div
                  style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: "0.95rem",
                    fontWeight: 600,
                    color: "#d4a017",
                    background: "#0A0A0A",
                    padding: "0.22rem 0.65rem",
                    border: "1px solid rgba(212,160,23,0.4)",
                  }}
                >
                  {simulatedUsers.toLocaleString()} <span style={{ fontSize: "0.68rem", color: "rgba(245,241,232,0.65)", fontWeight: 400 }}>PETICIONES</span>
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
                  fontSize: "0.70rem",
                  color: "rgba(245,241,232,0.55)",
                  fontWeight: 400,
                }}
              >
                <span>200 (Pruebas iniciales)</span>
                <span style={{ color: "#6e8e59", fontWeight: 500 }}>▲ 1,000 (Free Tier: $0.00 USD)</span>
                <span>5,000 (Carga máxima)</span>
              </div>

              {/* Comparativa en 2 Columnas de Costo */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.65rem", marginTop: "0.1rem" }}>
                {/* Hostinger Fijo */}
                <div
                  style={{
                    padding: "0.65rem 0.85rem",
                    background: "rgba(255,255,255,0.03)",
                    border: "1px solid rgba(245,241,232,0.12)",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                  }}
                >
                  <div>
                    <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.70rem", color: "rgba(245,241,232,0.55)", textTransform: "uppercase", fontWeight: 400 }}>
                      HOSTINGER COMPARTIDO
                    </span>
                    <div style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: "0.84rem", color: "#F5F1E8", marginTop: "0.1rem", fontWeight: 400 }}>
                      PLAN EMPRESARIAL FIJO
                    </div>
                  </div>
                  <div style={{ marginTop: "0.45rem", display: "flex", alignItems: "baseline", justifyContent: "space-between" }}>
                    <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.68rem", color: "rgba(245,241,232,0.55)" }}>
                      COSTO MENSUAL:
                    </span>
                    <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "1.15rem", fontWeight: 600, color: "#F5F1E8" }}>
                      ${hostingerFixedCost.toFixed(2)} <span style={{ fontSize: "0.70rem", fontWeight: 400, color: "rgba(245,241,232,0.6)" }}>USD</span>
                    </span>
                  </div>
                </div>

                {/* AWS Pay-As-You-Go */}
                <div
                  style={{
                    padding: "0.65rem 0.85rem",
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
                      <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.70rem", color: "#d4a017", fontWeight: 500, textTransform: "uppercase" }}>
                        AWS FOUNDATIONS
                      </span>
                      <span
                        style={{
                          fontFamily: "'JetBrains Mono', monospace",
                          fontSize: "0.68rem",
                          padding: "0.12rem 0.45rem",
                          background: awsEstimatedCost === 0 ? "rgba(110,142,89,0.25)" : isBudgetAlert ? "rgba(198,67,43,0.25)" : "rgba(212,160,23,0.2)",
                          color: awsEstimatedCost === 0 ? "#6e8e59" : isBudgetAlert ? "#c6432b" : "#d4a017",
                          fontWeight: 500,
                        }}
                      >
                        {awsEstimatedCost === 0 ? "FREE TIER" : isBudgetAlert ? "ALERTA $10" : "PAY-AS-YOU-GO"}
                      </span>
                    </div>
                    <div style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: "0.84rem", color: "#F5F1E8", marginTop: "0.1rem", fontWeight: 400 }}>
                      INFRAESTRUCTURA ELÁSTICA
                    </div>
                  </div>
                  <div style={{ marginTop: "0.45rem", display: "flex", alignItems: "baseline", justifyContent: "space-between" }}>
                    <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.68rem", color: "rgba(245,241,232,0.55)" }}>
                      COSTO CALCULADO:
                    </span>
                    <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "1.15rem", fontWeight: 600, color: isBudgetAlert ? "#c6432b" : "#d4a017" }}>
                      ${awsEstimatedCost.toFixed(2)} <span style={{ fontSize: "0.70rem", fontWeight: 400, color: "rgba(245,241,232,0.6)" }}>USD</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Banner de Monitoreo / Alerta de AWS Budgets */}
              {isBudgetAlert ? (
                <div
                  style={{
                    padding: "0.5rem 0.85rem",
                    background: "rgba(198,67,43,0.25)",
                    border: "1px solid #c6432b",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    <AlertTriangle size={15} style={{ color: "#c6432b", flexShrink: 0 }} />
                    <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.76rem", color: "#F5F1E8", fontWeight: 400 }}>
                      ⚠️ AWS Budgets disparó notificación preventiva: umbral de $10.00 USD superado.
                    </span>
                  </div>
                  <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.72rem", color: "#c6432b", fontWeight: 500 }}>
                    ALERTA_SNS
                  </span>
                </div>
              ) : (
                <div
                  style={{
                    padding: "0.5rem 0.85rem",
                    background: "rgba(110,142,89,0.12)",
                    border: "1px solid rgba(110,142,89,0.35)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    <ShieldCheck size={15} style={{ color: "#6e8e59", flexShrink: 0 }} />
                    <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.76rem", color: "rgba(245,241,232,0.85)", fontWeight: 400 }}>
                      AWS Budgets en monitoreo activo. Límite preventivo configurado en $10.00 USD.
                    </span>
                  </div>
                  <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.72rem", color: "#6e8e59", fontWeight: 500 }}>
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
                gap: "0.55rem",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <span style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: "0.88rem", color: "#F5F1E8", textTransform: "uppercase", fontWeight: 400 }}>
                    // MATRIZ ECONÓMICA DETALLADA (us-east-1)
                  </span>
                  <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.70rem", color: "#d4a017", marginTop: "0.1rem", fontWeight: 400 }}>
                    Haz click en cualquier servicio para ver su auditoría técnica completa
                  </div>
                </div>
                <span
                  style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: "0.76rem",
                    color: "#6e8e59",
                    background: "rgba(110,142,89,0.2)",
                    border: "1.5px solid #6e8e59",
                    padding: "0.25rem 0.65rem",
                    fontWeight: 500,
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
                          <div style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: "0.84rem", color: "#F5F1E8", fontWeight: 400 }}>
                            {item.name}
                          </div>
                          <div style={{ fontFamily: "Inter, sans-serif", fontSize: "0.70rem", color: "rgba(245,241,232,0.65)", fontWeight: 400 }}>
                            {item.category}
                          </div>
                        </div>
                      </div>

                      <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.72rem", color: "rgba(245,241,232,0.85)", flex: 1, textAlign: "left", lineHeight: 1.35, fontWeight: 400 }}>
                        <span style={{ color: "rgba(245,241,232,0.5)" }}>Free Tier: </span>{item.freeTier}
                        <br />
                        <span style={{ color: isSelected ? "#d4a017" : "#6e8e59", fontWeight: 500 }}>MTA: </span>{item.mtaUsage}
                      </div>

                      <div style={{ textAlign: "right", minWidth: 80 }}>
                        <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "1.05rem", fontWeight: 600, color: item.color }}>
                          {item.monthlyCost}
                        </div>
                        <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.66rem", color: item.color, fontWeight: 500 }}>
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
                  fontSize: "0.72rem",
                  color: "rgba(245,241,232,0.8)",
                  borderTop: "1px dashed rgba(245,241,232,0.2)",
                  paddingTop: "0.45rem",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <span>Ahorro directo vs Hostinger: <strong style={{ color: "#6e8e59", fontSize: "0.80rem", fontWeight: 600 }}>$34.50 USD / mes (98.5%)</strong></span>
                <span style={{ color: "#d4a017", fontWeight: 500 }}>Techo de seguridad: AWS Budgets $10.00 USD</span>
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
                padding: "0.7rem 0.85rem",
                background: "rgba(255,255,255,0.02)",
                border: "1px solid rgba(245,241,232,0.12)",
                borderTop: idx === 1 ? "2px solid #6e8e59" : "2px solid #d4a017",
                display: "flex",
                flexDirection: "column",
                gap: "0.25rem",
              }}
            >
              <span
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: "0.70rem",
                  color: idx === 1 ? "#6e8e59" : "#d4a017",
                  fontWeight: 500,
                  letterSpacing: "0.08em",
                }}
              >
                0{idx + 1} // PILAR
              </span>
              <h4
                style={{
                  fontFamily: "'Archivo Black', sans-serif",
                  fontSize: "0.84rem",
                  color: "#F5F1E8",
                  textTransform: "uppercase",
                  margin: 0,
                  lineHeight: 1.2,
                  fontWeight: 400,
                }}
              >
                {pt.title}
              </h4>
              <p
                style={{
                  fontFamily: "Inter, sans-serif",
                  fontSize: "0.76rem",
                  color: "rgba(245,241,232,0.72)",
                  lineHeight: 1.45,
                  margin: 0,
                  fontWeight: 400,
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
            <DollarSign size={16} style={{ color: isBudgetAlert ? "#c6432b" : "#d4a017" }} />
            <span
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: "0.78rem",
                letterSpacing: "0.15em",
                color: isBudgetAlert ? "#c6432b" : "rgba(245,241,232,0.65)",
                textTransform: "uppercase",
                fontWeight: 400,
              }}
            >
              FINANCIAL ARCHITECTURE // TCO BALANCE
            </span>
          </div>

          <div
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: "0.74rem",
              padding: "0.25rem 0.65rem",
              background: isBudgetAlert ? "rgba(198,67,43,0.15)" : "rgba(0,0,0,0.6)",
              border: isBudgetAlert ? "1px solid #c6432b" : "1px solid rgba(245,241,232,0.15)",
              color: isBudgetAlert ? "#c6432b" : "#d4a017",
              fontWeight: 500,
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
                  <selectedService.icon size={20} style={{ color: "#d4a017" }} />
                  <div>
                    <h3 style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: "1.05rem", color: "#F5F1E8", margin: 0, textTransform: "uppercase", fontWeight: 400 }}>
                      {selectedService.name}
                    </h3>
                    <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.72rem", color: "rgba(245,241,232,0.6)", fontWeight: 400 }}>
                      {selectedService.code} // {selectedService.category}
                    </span>
                  </div>
                </div>

                <div style={{ textAlign: "right" }}>
                  <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "1.15rem", fontWeight: 600, color: "#6e8e59" }}>
                    {selectedService.monthlyCost} USD
                  </div>
                  <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.66rem", color: "#6e8e59", fontWeight: 500 }}>
                    {selectedService.status}
                  </span>
                </div>
              </div>

              <p style={{ fontFamily: "Inter, sans-serif", fontSize: "0.88rem", color: "rgba(245,241,232,0.9)", lineHeight: 1.48, margin: "0.2rem 0", fontWeight: 400 }}>
                {selectedService.summary}
              </p>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.5rem", background: "rgba(0,0,0,0.4)", padding: "0.55rem 0.85rem", border: "1px solid rgba(245,241,232,0.1)" }}>
                <div>
                  <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.68rem", color: "rgba(245,241,232,0.55)", fontWeight: 400 }}>
                    SLA & DISPONIBILIDAD
                  </div>
                  <div style={{ fontFamily: "Inter, sans-serif", fontSize: "0.80rem", color: "#F5F1E8", fontWeight: 500, marginTop: "0.1rem" }}>
                    {selectedService.sla}
                  </div>
                </div>
                <div>
                  <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.68rem", color: "rgba(245,241,232,0.55)", fontWeight: 400 }}>
                    COSTO POST-FREE TIER
                  </div>
                  <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.80rem", color: "#d4a017", fontWeight: 500, marginTop: "0.1rem" }}>
                    {selectedService.postFreeTier}
                  </div>
                </div>
              </div>

              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.74rem", color: "rgba(245,241,232,0.7)", borderTop: "1px solid rgba(245,241,232,0.1)", paddingTop: "0.35rem", fontWeight: 400 }}>
                💡 <span style={{ color: "#d4a017", fontWeight: 500 }}>Justificación us-east-1: </span>{selectedService.regionNote}
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
              padding: "0.65rem 0.95rem",
              background: "rgba(14,14,14,0.75)",
              border: "1px solid rgba(245,241,232,0.15)",
              backdropFilter: "blur(6px)",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div>
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.70rem", color: "rgba(245,241,232,0.55)", fontWeight: 400 }}>
                HOSTINGER FIJO ANUAL
              </div>
              <div style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: "0.98rem", color: "#F5F1E8", marginTop: "0.15rem", fontWeight: 400 }}>
                $420.00 <span style={{ fontSize: "0.72rem", fontWeight: 400, color: "rgba(245,241,232,0.6)" }}>USD/AÑO</span>
              </div>
            </div>
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.72rem", color: "rgba(245,241,232,0.45)", fontWeight: 400 }}>
              RECURSOS OCIOSOS
            </span>
          </div>

          <div
            style={{
              padding: "0.65rem 0.95rem",
              background: isBudgetAlert ? "rgba(198,67,43,0.15)" : "rgba(212,160,23,0.08)",
              border: isBudgetAlert ? "1px solid #c6432b" : "1px solid rgba(212,160,23,0.4)",
              backdropFilter: "blur(6px)",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div>
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.70rem", color: isBudgetAlert ? "#c6432b" : "#d4a017", fontWeight: 400 }}>
                AWS CLOUD FOUNDATIONS
              </div>
              <div style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: "0.98rem", color: isBudgetAlert ? "#c6432b" : "#d4a017", marginTop: "0.15rem", fontWeight: 400 }}>
                {awsEstimatedCost === 0 ? "CAPA GRATUITA ($0)" : `$${(awsEstimatedCost * 12).toFixed(2)} USD/AÑO PROY.`}
              </div>
            </div>
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.72rem", color: isBudgetAlert ? "#c6432b" : "#6e8e59", fontWeight: 500 }}>
              {isBudgetAlert ? "NOTIFICACIÓN ACTIVA" : "AHORRO OPERATIVO"}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}

export default S10_Economia;