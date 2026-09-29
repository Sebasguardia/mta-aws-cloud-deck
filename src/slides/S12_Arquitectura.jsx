// src/slides/S12_Arquitectura.jsx
import React, { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import {
  Server,
  Shield,
  Globe,
  Zap,
  Play,
  RotateCcw,
  CheckCircle2,
  Database,
  Lock,
  ArrowRight,
  Activity,
  Layers,
  ChevronLeft,
  ChevronRight,
  User,
  Compass,
  Cpu,
  Radio,
  ShieldCheck,
  Sparkles,
  Maximize2,
  Minimize2,
  Terminal,
  Key,
  Network,
  Wifi,
  Laptop,
  HardDrive,
  ShieldAlert,
  Binary,
  Split,
  Box,
  Workflow,
  Send,
  CloudLightning,
  CornerDownRight,
  ShieldCheck as ShieldCheckIcon,
} from "lucide-react";
import { slidesContent } from "../data/content.es.js";
import { awsServices } from "../data/awsServices.js";
import { useSlideActive } from "../hooks/useSlideActive.js";
import { CloudArchitectureHeroCanvas } from "../components/three/CloudArchitectureHeroCanvas.jsx";
import { CanvasTransitionWrapper } from "../components/motion/CanvasTransitionWrapper.jsx";
import { Button } from "../components/ui/Button.jsx";
import { Badge } from "../components/ui/Badge.jsx";
import { Tooltip } from "../components/ui/Tooltip.jsx";
import { easings } from "../lib/easings.js";

const c = slidesContent.s12_arquitectura;

/**
 * S12 — Arquitectura de Red Propuesta (Hero Slide Técnico).
 *
 * Directivas de diseño:
 *  - /industrial-brutalist-ui:
 *    Estética de blueprint CAD y terminal de control de tráfico AWS (#0A0A0A),
 *    rejilla técnica militar, bordes nítidos de 1px/2px, etiquetas monospace y
 *    distribución panorámica de pantalla completa 50%/50% sin scrollbars ni desbordes.
 *  - /impeccable:
 *    Los 4 pilares fundamentales de la arquitectura: Amazon VPC, Security Groups,
 *    Amazon Route 53 y Amazon CloudFront explicados con concisión y precisión técnica.
 *  - /threejs-geometry + /threejs-animation + /threejs-interaction:
 *    `CloudArchitectureHeroCanvas`: Renderizado 3D concéntrico de las capas espaciales de la arquitectura
 *    (CloudFront Torus → Route 53 Sphere → VPC Cube → Security Groups Octahedron → RDS Cylinder).
 *  - /emil-design-eng + /animate:
 *    Simulador interactivo hero "▶ Simular Petición HTTP":
 *    Un paquete de datos viaja nodo a nodo en tiempo real, iluminando cada capa en el 3D
 *    y emitiendo telemetría de latencia milimétrica hasta culminar en `200 OK (30ms)`.
 */
export function S12_Arquitectura({ isActive: propActive } = {}) {
  const shouldReduceMotion = useReducedMotion();
  const hookActive = useSlideActive(11);
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

  // Estado del simulador de trazado HTTP
  const [activeStep, setActiveStep] = useState(0); // 0 = Reposo, 1..6 = Nodos, 7 = 200 OK
  const [isSimulating, setIsSimulating] = useState(false);
  const [activeTelemetry, setActiveTelemetry] = useState(null);
  const [isExpanded3D, setIsExpanded3D] = useState(false); // Modo pantalla completa / cine 3D
  const timerRef = useRef(null);

  const nodes = [
    {
      id: 1,
      name: "Cliente / Browser",
      protocol: "HTTPS :443 (TLS 1.3)",
      icon: Globe,
      latency: "0ms",
      detail: "El usuario o practicante inicia una transacción en Workspace MTA mediante navegador web cifrado con TLS 1.3.",
      statusText: "DISPATCHED",
      actionStep: "Generación de paquete HTTP POST /api/mta/v1/auth con Payload JSON firmado.",
      securityRule: "Cifrado en tránsito forzado HSTS (Strict-Transport-Security), previniendo ataques Man-in-the-Middle.",
      telemetryDetails: {
        sourceIp: "190.235.12.84 (Lima, Perú)",
        targetDns: "app.senati-mta.com",
        tlsCipher: "TLS_AES_256_GCM_SHA384",
        packetSize: "1.42 KB",
      },
    },
    {
      id: 2,
      name: "Amazon CloudFront",
      protocol: "CDN Edge Location",
      icon: Zap,
      latency: "+14ms",
      detail: "Punto de presencia perimetral (PoP) en Lima que absorbe peticiones estáticas y optimiza la ruta hacia Virginia (us-east-1).",
      statusText: "EDGE CACHE HIT",
      actionStep: "Terminación SSL en el borde y entrega de bundle JS/CSS sin tocar servidores de cómputo.",
      securityRule: "AWS Shield Standard integrado para mitigación automática de DDoS en Capas 3 y 4 (Syn Flood, UDP reflection).",
      telemetryDetails: {
        popLocation: "LIM50-C1 (Lima, PE)",
        cacheStatus: "HIT from cloudfront",
        shieldStatus: "PROTECTED (DDoS Auto-Mitigation)",
        compression: "Brotli (br)",
      },
    },
    {
      id: 3,
      name: "Amazon Route 53",
      protocol: "Anycast DNS Routing",
      icon: Globe,
      latency: "+8ms",
      detail: "Servicio DNS autoritativo global con resolución basada en latencia y health checks automatizados.",
      statusText: "DNS RESOLVED",
      actionStep: "Traduce app.senati-mta.com a la dirección IP privada del backend en us-east-1 con failover multi-AZ.",
      securityRule: "DNSSEC activado con claves criptográficas para impedir DNS Spoofing o envenenamiento de caché.",
      telemetryDetails: {
        queryType: "A Record (Alias CloudFront)",
        ttl: "60 seconds",
        dnssec: "VALIDATED (SHA-256 RRSIG)",
        slaAvailable: "100.0% Uptime SLA",
      },
    },
    {
      id: 4,
      name: "Amazon VPC (Virtual Private Cloud)",
      protocol: "CIDR 10.0.0.0/16",
      icon: Server,
      latency: "+3ms",
      detail: "Red virtual privada totalmente aislada donde residen los recursos centrales protegidos contra acceso público.",
      statusText: "VPC ISOLATION",
      actionStep: "El paquete ingresa por la interfaz de red elástica (ENI) y es segmentado en una subred privada 10.0.2.0/24.",
      securityRule: "NACLs (Network Access Control Lists) sin estado inspeccionando subredes a nivel de capa 3.",
      telemetryDetails: {
        vpcId: "vpc-0a8b9f71c4d",
        subnetId: "subnet-priv-db-az1 (10.0.2.0/24)",
        internetGateway: "BLOCKED (No IGW Route)",
        flowLogs: "ENI Flow Logs ACCEPT 10.0.1.15 -> 10.0.2.40",
      },
    },
    {
      id: 5,
      name: "Security Groups (Firewall L4)",
      protocol: "Stateful L4 Inspection",
      icon: Shield,
      latency: "+1ms",
      detail: "Firewall con seguimiento de estado que únicamente permite tráfico entrante en el puerto 5432 desde la IP del backend.",
      statusText: "PORT 5432 OK",
      actionStep: "Evaluación perimétrica instantánea: permite puerto TCP 5432 y descarta inmediatamente escaneos SSH (22) o HTTP (80).",
      securityRule: "Zero-Trust Ingress: Solo acepta conexiones si el grupo de origen coincide con sg-backend-app.",
      telemetryDetails: {
        evaluatedPort: "TCP :5432 (PostgreSQL)",
        actionTaken: "PERMIT (Ingress Rule 01)",
        statefulMemory: "Connection tracked established",
        unauthorizedDrops: "0 DROPPED PACKETS",
      },
    },
    {
      id: 6,
      name: "Amazon RDS (PostgreSQL Engine)",
      protocol: "PostgreSQL 16 Multi-AZ",
      icon: Database,
      latency: "+4ms",
      detail: "Motor de base de datos relacional de alta concurrencia con replicación síncrona en zona de disponibilidad secundaria.",
      statusText: "QUERY EXECUTED",
      actionStep: "Ejecución de SELECT en tabla institucional de Workspace MTA y escritura en búfer de almacenamiento SSD GP3 cifrado.",
      securityRule: "Cifrado en reposo AES-256 gestionado con AWS KMS (Key Management Service) y copias automáticas snapshot.",
      telemetryDetails: {
        instanceType: "db.t4g.medium (Multi-AZ)",
        kmsKey: "arn:aws:kms:us-east-1:alias/mta-db-key",
        iopsCapacity: "3,000 IOPS Baseline",
        storageStatus: "AES-256 ENCRYPTED AT REST",
      },
    },
  ];

  // Activar entrada escalonada
  useEffect(() => {
    if (isActive) {
      const timer = setTimeout(() => setEntered(true), 40);
      return () => clearTimeout(timer);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
      setEntered(false);
      setIsSimulating(false);
      setActiveStep(0);
      setActiveTelemetry(null);
    }
  }, [isActive]);

  // Manejador del Simulador de Petición
  const handleSimulateRequest = () => {
    if (isSimulating) return;
    setIsSimulating(true);
    setActiveStep(1);
    setActiveTelemetry(nodes[0]);

    let current = 1;
    timerRef.current = setInterval(() => {
      current += 1;
      if (current <= nodes.length) {
        setActiveStep(current);
        setActiveTelemetry(nodes[current - 1]);
      } else {
        clearInterval(timerRef.current);
        setActiveStep(nodes.length + 1); // 7: 200 OK completado
        setIsSimulating(false);
      }
    }, 2000); // 2 segundos por nodo para que se aprecie la cinemática de zoom y el modal animado
  };

  const handleNextStep = () => {
    if (isSimulating) {
      clearInterval(timerRef.current);
      setIsSimulating(false);
    }
    const next = activeStep < nodes.length + 1 ? activeStep + 1 : 1;
    setActiveStep(next);
    if (next >= 1 && next <= nodes.length) {
      setActiveTelemetry(nodes[next - 1]);
    } else {
      setActiveTelemetry(null);
    }
  };

  const handlePrevStep = () => {
    if (isSimulating) {
      clearInterval(timerRef.current);
      setIsSimulating(false);
    }
    const prev = activeStep > 1 ? activeStep - 1 : (activeStep === 0 ? nodes.length + 1 : 0);
    setActiveStep(prev);
    if (prev >= 1 && prev <= nodes.length) {
      setActiveTelemetry(nodes[prev - 1]);
    } else {
      setActiveTelemetry(null);
    }
  };

  const handleReset = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setIsSimulating(false);
    setActiveStep(0);
    setActiveTelemetry(null);
  };

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

      {/* ── Resplandor perimetral de seguridad ── */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          background: "radial-gradient(circle at 75% 50%, rgba(212,160,23,0.18) 0%, transparent 65%)",
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
          background: "#d4a017",
          zIndex: 3,
        }}
      />

      {/* ══════════════════════════════════════════════════════════
          COLUMNA IZQUIERDA (50%): Arquitectura de Red & Trazado
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
          gap: "0.85rem",
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
              SEC_12 // RESILIENT_NETWORK_ARCHITECTURE
            </span>
            <span
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: "0.58rem",
                color: "#d4a017",
                background: "rgba(212,160,23,0.15)",
                border: "1px solid rgba(212,160,23,0.4)",
                padding: "0.15rem 0.45rem",
                fontWeight: 700,
              }}
            >
              REGION: us-east-1 // MULTI-AZ (AZ-a & AZ-b)
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

        {/* Simulador de Trazado de Red (Hero Component) */}
        <motion.div
          variants={fadeUp(0.22)}
          initial="hidden"
          animate={entered ? "visible" : "hidden"}
          style={{
            padding: "0.9rem 1.15rem",
            background: "rgba(18,18,18,0.9)",
            border: "1.5px solid rgba(245,241,232,0.15)",
            boxShadow: "4px 4px 0px #000000",
            display: "flex",
            flexDirection: "column",
            gap: "0.75rem",
          }}
        >
          {/* Barra superior de simulación */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <span
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  backgroundColor: isSimulating ? "#d4a017" : activeStep > nodes.length ? "#6e8e59" : "rgba(245,241,232,0.4)",
                  animation: isSimulating ? "ping 1s cubic-bezier(0, 0, 0.2, 1) infinite" : "none",
                }}
              />
              <span
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: "0.65rem",
                  letterSpacing: "0.15em",
                  color: "#d4a017",
                  fontWeight: 700,
                  textTransform: "uppercase",
                }}
              >
                SIMULADOR DE FLUJO HTTP PERIMETRAL
              </span>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "0.35rem" }}>
              {/* Controles de avance paso a paso */}
              <button
                type="button"
                onClick={handlePrevStep}
                title="Paso Anterior"
                style={{
                  background: "rgba(255,255,255,0.06)",
                  border: "1px solid rgba(245,241,232,0.2)",
                  color: "#F5F1E8",
                  padding: "0.25rem 0.4rem",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <ChevronLeft size={13} />
              </button>
              <button
                type="button"
                onClick={handleNextStep}
                title="Siguiente Paso"
                style={{
                  background: "rgba(255,255,255,0.06)",
                  border: "1px solid rgba(245,241,232,0.2)",
                  color: "#F5F1E8",
                  padding: "0.25rem 0.4rem",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <ChevronRight size={13} />
              </button>

              {activeStep > 0 && (
                <Button
                  variant="outline"
                  size="sm"
                  icon={RotateCcw}
                  onClick={handleReset}
                  className="!py-1 !px-2.5 !text-xs !border-white/30 !text-white hover:!bg-white/10"
                >
                  Reset
                </Button>
              )}

              <Button
                variant="primary"
                size="sm"
                icon={Play}
                onClick={handleSimulateRequest}
                disabled={isSimulating}
                className="!py-1 !px-3 !text-xs"
              >
                {isSimulating ? "Trazando..." : "▶ Simular"}
              </Button>
            </div>
          </div>

          {/* Grid de los 6 Nodos del Recorrido */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: "0.35rem" }}>
            {nodes.map((node) => {
              const NodeIcon = node.icon;
              const isNodeActive = activeStep === node.id;
              const isNodePassed = activeStep > node.id;

              return (
                <div
                  key={node.id}
                  onClick={() => {
                    if (!isSimulating) {
                      setActiveStep(node.id);
                      setActiveTelemetry(node);
                    }
                  }}
                  title="Haz click para auditar este salto perimetral"
                  style={{
                    padding: "0.45rem 0.3rem",
                    border: isNodeActive
                      ? "1.5px solid #d4a017"
                      : isNodePassed
                      ? "1.5px solid #6e8e59"
                      : "1px solid rgba(245,241,232,0.12)",
                    background: isNodeActive
                      ? "rgba(212,160,23,0.22)"
                      : isNodePassed
                      ? "rgba(110,142,89,0.12)"
                      : "rgba(0,0,0,0.5)",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    textAlign: "center",
                    minHeight: 80,
                    justifyContent: "space-between",
                    cursor: isSimulating ? "default" : "pointer",
                    boxShadow: isNodeActive ? "2px 2px 0px #d4a017" : "none",
                    transition: "all 0.15s ease",
                  }}
                >
                  <div style={{ width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.52rem", color: isNodeActive ? "#d4a017" : "rgba(245,241,232,0.5)", fontWeight: 800 }}>
                      0{node.id}
                    </span>
                    {isNodePassed ? (
                      <CheckCircle2 size={10} style={{ color: "#6e8e59" }} />
                    ) : isNodeActive ? (
                      <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#d4a017" }} />
                    ) : (
                      <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.48rem", color: "rgba(245,241,232,0.3)" }}>
                        {node.latency}
                      </span>
                    )}
                  </div>

                  <NodeIcon size={14} style={{ color: isNodeActive ? "#d4a017" : isNodePassed ? "#6e8e59" : "rgba(245,241,232,0.6)", margin: "0.15rem 0" }} />

                  <div style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: "0.55rem", color: "#F5F1E8", textTransform: "uppercase", lineHeight: 1.1 }}>
                    {node.name.split(" ")[0]}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Consola de Telemetría Inferior */}
          <div
            style={{
              padding: "0.5rem 0.75rem",
              background: "#0A0A0A",
              border: "1px solid rgba(245,241,232,0.12)",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <Activity size={13} style={{ color: "#d4a017", flexShrink: 0 }} />
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.62rem", color: "#d4a017", fontWeight: 700 }}>
                TELEMETRY:
              </span>

              <AnimatePresence mode="wait">
                {activeStep === 0 && (
                  <motion.span
                    key="idle"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.62rem", color: "rgba(245,241,232,0.6)" }}
                  >
                    En espera. Presiona "Simular Petición" o haz click en cualquier nodo para trazar.
                  </motion.span>
                )}

                {activeStep > 0 && activeStep <= nodes.length && activeTelemetry && (
                  <motion.span
                    key={`step-${activeStep}`}
                    initial={{ opacity: 0, x: 4 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -4 }}
                    style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.62rem", color: "#F5F1E8" }}
                  >
                    <span style={{ color: "#d4a017", fontWeight: 800 }}>[{activeTelemetry.statusText}]</span> {activeTelemetry.name} ({activeTelemetry.protocol})
                  </motion.span>
                )}

                {activeStep > nodes.length && (
                  <motion.span
                    key="completed"
                    initial={{ opacity: 0, y: 3 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.62rem", color: "#6e8e59", fontWeight: 800 }}
                  >
                    [HTTP 200 OK] — CloudFront CDN Cache Hit + Amazon VPC Firewall Aprobado (30ms)
                  </motion.span>
                )}
              </AnimatePresence>
            </div>

            {activeStep > nodes.length && (
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.55rem", color: "#6e8e59", fontWeight: 800 }}>
                LATENCIA TOTAL: 30ms
              </span>
            )}
          </div>
        </motion.div>

        {/* Los 4 Pilares de la Arquitectura */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.65rem" }}>
          {c.pillars.map((pillar, idx) => (
            <motion.div
              key={pillar.service}
              variants={fadeUp(0.3 + idx * 0.05)}
              initial="hidden"
              animate={entered ? "visible" : "hidden"}
              style={{
                padding: "0.75rem 0.95rem",
                background: "rgba(255,255,255,0.02)",
                border: "1px solid rgba(245,241,232,0.12)",
                borderLeft: idx === 0 || idx === 3 ? "3px solid #d4a017" : "3px solid #6e8e59",
                display: "flex",
                flexDirection: "column",
                gap: "0.25rem",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <h4 style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: "0.78rem", color: "#F5F1E8", textTransform: "uppercase", margin: 0 }}>
                  {pillar.service}
                </h4>
                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.52rem", color: "rgba(245,241,232,0.4)" }}>
                  CAPA 0{idx + 1}
                </span>
              </div>
              <p style={{ fontFamily: "system-ui, sans-serif", fontSize: "0.68rem", color: "rgba(245,241,232,0.7)", lineHeight: 1.35, margin: 0 }}>
                {pillar.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════
          COLUMNA DERECHA: Hero Canvas 3D de Capas Perimetrales
          (Modo pantalla completa expansible con cielo estrellado inmersivo)
      ══════════════════════════════════════════════════════════ */}
      <div
        style={{
          position: isExpanded3D ? "absolute" : "relative",
          inset: isExpanded3D ? 0 : "auto",
          width: isExpanded3D ? "100%" : "auto",
          height: isExpanded3D ? "100%" : "100%",
          flex: isExpanded3D ? "none" : "0 0 50%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          overflow: "hidden",
          borderLeft: isExpanded3D ? "none" : "1px solid rgba(245,241,232,0.1)",
          background: "#0A0A0A",
          zIndex: isExpanded3D ? 50 : 5,
          transition: "all 0.35s cubic-bezier(0.16, 1, 0.3, 1)",
        }}
      >
        {/* Cabecera Técnica Flotante + Título del Diagrama de Flujo + Botones */}
        <div
          style={{
            position: "absolute",
            top: isExpanded3D ? "1.5rem" : "1.0rem",
            left: isExpanded3D ? "2.5rem" : "1.2rem",
            right: isExpanded3D ? "2.5rem" : "1.2rem",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            zIndex: 40,
            pointerEvents: "auto",
            gap: "0.5rem",
          }}
        >
          {/* Título de la Arquitectura & Badges (Solo visible en pantalla expandida) */}
          {isExpanded3D ? (
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", minWidth: 0 }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", whiteSpace: "nowrap" }}>
                <Server size={14} style={{ color: "#d4a017", flexShrink: 0 }} />
                <span
                  style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: "0.68rem",
                    letterSpacing: "0.15em",
                    color: "#F5F1E8",
                    textTransform: "uppercase",
                    fontWeight: 800,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  DIAGRAMA DE FLUJO PERIMETRAL AWS // TOPOLOGÍA 5 CAPAS
                </span>
              </div>

              <span
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: "0.52rem",
                  color: "#0A0A0A",
                  background: "#d4a017",
                  padding: "0.15rem 0.45rem",
                  fontWeight: 900,
                  whiteSpace: "nowrap",
                  flexShrink: 0,
                }}
              >
                {activeStep === 0
                  ? "LISTO"
                  : activeStep <= nodes.length
                  ? `PASO 0${activeStep}`
                  : "200 OK"}
              </span>
            </div>
          ) : (
            <div />
          )}

          {/* Botones de Acción en Cabecera (Compactos en vista normal, completos en expandida) */}
          <div style={{ display: "flex", alignItems: "center", gap: isExpanded3D ? "0.5rem" : "0.3rem", flexShrink: 0 }}>
            {/* Botón de Inicio de Simulación */}
            <Button
              variant="primary"
              size="sm"
              icon={Play}
              onClick={handleSimulateRequest}
              disabled={isSimulating}
              className={isExpanded3D ? "!py-1 !px-3 !text-xs !font-bold" : "!py-0.5 !px-2 !text-[0.62rem] !font-bold"}
            >
              {isSimulating ? (isExpanded3D ? "Simulando..." : "Simulando") : (isExpanded3D ? "▶ Iniciar Simulación" : "▶ Simular")}
            </Button>

            {/* Botón de Reset si ya se simuló */}
            {activeStep > 0 && (
              <Button
                variant="outline"
                size="sm"
                icon={RotateCcw}
                onClick={handleReset}
                className={isExpanded3D ? "!py-1 !px-2.5 !text-xs !border-white/30 !text-white hover:!bg-white/10" : "!py-0.5 !px-1.5 !text-[0.6rem] !border-white/30 !text-white hover:!bg-white/10"}
              >
                {isExpanded3D ? "Reiniciar" : "Reset"}
              </Button>
            )}

            {/* Botón de Pantalla Completa / Expandir */}
            <button
              type="button"
              onClick={() => setIsExpanded3D(!isExpanded3D)}
              title={isExpanded3D ? "Restaurar vista dual" : "Agrandar a Pantalla Completa"}
              style={{
                background: isExpanded3D ? "#d4a017" : "rgba(255,255,255,0.08)",
                border: isExpanded3D ? "1px solid #d4a017" : "1px solid rgba(245,241,232,0.25)",
                color: isExpanded3D ? "#0A0A0A" : "#F5F1E8",
                padding: isExpanded3D ? "0.25rem 0.55rem" : "0.2rem 0.4rem",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "0.25rem",
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: isExpanded3D ? "0.55rem" : "0.5rem",
                fontWeight: 800,
                transition: "all 0.15s ease",
              }}
            >
              {isExpanded3D ? (
                <>
                  <Minimize2 size={12} />
                  <span>REDUCIR</span>
                </>
              ) : (
                <>
                  <Maximize2 size={10} />
                  <span>EXPANDIR</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* ── HEADER FLOTANTE DE NAVEGACIÓN ENTRE PASOS (SOLO EN MODO EXPANDIDO / PANTALLA COMPLETA) ── */}
        {isExpanded3D && activeStep > 0 && (
          <div
            style={{
              position: "absolute",
              top: "4.2rem",
              left: "2.5rem",
              zIndex: 40,
              display: "flex",
              alignItems: "center",
              gap: "0.35rem",
              background: "rgba(10,10,10,0.85)",
              border: "1px solid rgba(212,160,23,0.3)",
              padding: "0.3rem 0.6rem",
              backdropFilter: "blur(10px)",
              boxShadow: "4px 4px 0px rgba(0,0,0,0.8)",
            }}
          >
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.52rem", color: "#d4a017", fontWeight: 800, marginRight: "0.3rem" }}>
              NAVEGAR PASOS:
            </span>

            <button
              type="button"
              onClick={handlePrevStep}
              title="Paso Anterior"
              style={{
                background: "rgba(255,255,255,0.08)",
                border: "1px solid rgba(245,241,232,0.2)",
                color: "#F5F1E8",
                padding: "0.15rem 0.35rem",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
              }}
            >
              <ChevronLeft size={11} />
            </button>

            {nodes.map((n) => {
              const isCur = activeStep === n.id;
              const isPassed = activeStep > n.id;
              return (
                <button
                  key={n.id}
                  type="button"
                  onClick={() => {
                    if (isSimulating) {
                      clearInterval(timerRef.current);
                      setIsSimulating(false);
                    }
                    setActiveStep(n.id);
                    setActiveTelemetry(n);
                  }}
                  style={{
                    background: isCur ? "#d4a017" : isPassed ? "rgba(110,142,89,0.25)" : "rgba(255,255,255,0.05)",
                    border: isCur ? "1px solid #d4a017" : isPassed ? "1px solid #6e8e59" : "1px solid rgba(245,241,232,0.15)",
                    color: isCur ? "#0A0A0A" : isPassed ? "#6e8e59" : "rgba(245,241,232,0.6)",
                    padding: "0.2rem 0.45rem",
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: "0.55rem",
                    fontWeight: 800,
                    cursor: "pointer",
                    transition: "all 0.15s ease",
                  }}
                >
                  0{n.id} {n.name.split(" ")[0]}
                </button>
              );
            })}

            <button
              type="button"
              onClick={handleNextStep}
              title="Siguiente Paso"
              style={{
                background: "rgba(255,255,255,0.08)",
                border: "1px solid rgba(245,241,232,0.2)",
                color: "#F5F1E8",
                padding: "0.15rem 0.35rem",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
              }}
            >
              <ChevronRight size={11} />
            </button>
          </div>
        )}

        {/* ── MODAL ANIMADO FLOTANTE DE ALTO IMPACTO (FLOTANDO ENCIMA DE LA FORMA 3D CON TRANSPARENCIA Y BLUR) ── */}
        <div
          style={{
            position: "absolute",
            top: isExpanded3D ? (activeStep > 0 ? "7.2rem" : "5.0rem") : (activeStep > 0 ? "4.8rem" : "3.8rem"),
            right: isExpanded3D ? "2.5rem" : "1.0rem",
            zIndex: 45,
            width: isExpanded3D ? "520px" : "345px",
            maxWidth: "calc(100% - 2rem)",
            transition: "all 0.3s ease",
            pointerEvents: "auto",
          }}
        >
          <AnimatePresence mode="wait">
            {activeStep === 0 ? (
              <motion.div
                key="flow-idle"
                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8, scale: 0.95 }}
                transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                style={{
                  padding: isExpanded3D ? "1.1rem 1.25rem" : "0.75rem 0.9rem",
                  background: "rgba(10,10,10,0.78)",
                  border: "1.5px solid rgba(212,160,23,0.4)",
                  boxShadow: "0 16px 40px rgba(0,0,0,0.8), 4px 4px 0px rgba(212,160,23,0.4)",
                  backdropFilter: "blur(16px)",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.3rem" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                    <Globe size={13} style={{ color: "#d4a017" }} />
                    <span style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: isExpanded3D ? "0.72rem" : "0.62rem", color: "#F5F1E8", textTransform: "uppercase" }}>
                      FLUJO PERIMETRAL END-TO-END
                    </span>
                  </div>
                  <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.48rem", color: "rgba(245,241,232,0.5)", border: "1px solid rgba(245,241,232,0.15)", padding: "0.1rem 0.3rem" }}>
                    INTERACTIVO
                  </span>
                </div>
                <p style={{ fontFamily: "system-ui, sans-serif", fontSize: isExpanded3D ? "0.7rem" : "0.62rem", color: "rgba(245,241,232,0.8)", lineHeight: 1.35, margin: 0 }}>
                  Observa la trayectoria en 3D: cada paquete atraviesa 5 anillos perimetrales hasta la subred privada de la base de datos.
                </p>
                <div style={{ marginTop: "0.5rem", display: "flex", alignItems: "center", gap: "0.4rem" }}>
                  <Button
                    variant="primary"
                    size="sm"
                    icon={Play}
                    onClick={handleSimulateRequest}
                    className="!py-0.5 !px-2 !text-xs !w-full !justify-center"
                  >
                    Iniciar Simulación 3D
                  </Button>
                </div>
              </motion.div>
            ) : activeStep <= nodes.length && activeTelemetry ? (
              <motion.div
                key={`flow-step-${activeStep}`}
                initial={{ opacity: 0, y: -12, scale: 0.92 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.92 }}
                transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
                style={{
                  padding: isExpanded3D ? "1.1rem 1.25rem" : "0.75rem 0.85rem",
                  background: "rgba(10,10,10,0.86)",
                  border: "2px solid #d4a017",
                  boxShadow: "0 20px 50px rgba(0,0,0,0.85), 5px 5px 0px #d4a017",
                  backdropFilter: "blur(20px)",
                  display: "flex",
                  flexDirection: "column",
                  gap: isExpanded3D ? "0.65rem" : "0.45rem",
                }}
              >
                {/* ════════════════════════════════════════════════════════
                    MODAL DIVIDIDO EN 2:
                    PARTE SUPERIOR: Dibujo Técnico Animado (Hero Visual)
                    PARTE INFERIOR: Explicación Clara y Resumida en Dual View
                ════════════════════════════════════════════════════════ */}

                {/* ── PARTE SUPERIOR: DIBUJO TÉCNICO ANIMADO GRANDE (HERO VISUAL SIN EMOJIS) ── */}
                <div
                  style={{
                    background: "radial-gradient(ellipse at 50% 30%, rgba(20,24,30,0.9) 0%, rgba(6,8,10,0.95) 100%)",
                    border: "1.5px solid rgba(212,160,23,0.4)",
                    padding: isExpanded3D ? "1.2rem 1.4rem" : "0.85rem 1rem",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    minHeight: isExpanded3D ? 185 : 145,
                    position: "relative",
                    overflow: "hidden",
                    boxShadow: "inset 0 0 25px rgba(0,0,0,0.8)",
                  }}
                >
                  {/* Rejilla técnica de fondo en el dibujo */}
                  <div
                    aria-hidden="true"
                    style={{
                      position: "absolute",
                      inset: 0,
                      backgroundImage: "linear-gradient(rgba(212,160,23,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(212,160,23,0.06) 1px, transparent 1px)",
                      backgroundSize: "20px 20px",
                      pointerEvents: "none",
                    }}
                  />

                  {/* Header superior del dibujo técnico */}
                  <div style={{ position: "absolute", top: isExpanded3D ? "0.6rem" : "0.4rem", left: isExpanded3D ? "0.9rem" : "0.6rem", display: "flex", alignItems: "center", gap: "0.35rem", zIndex: 2 }}>
                    <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#d4a017", boxShadow: "0 0 8px #d4a017" }} />
                    <span style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: isExpanded3D ? "0.72rem" : "0.6rem", color: "#F5F1E8", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                      {activeTelemetry.name}
                    </span>
                  </div>

                  <div style={{ position: "absolute", top: isExpanded3D ? "0.6rem" : "0.4rem", right: isExpanded3D ? "0.9rem" : "0.6rem", zIndex: 2 }}>
                    <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: isExpanded3D ? "0.56rem" : "0.48rem", color: "#0A0A0A", background: "#d4a017", padding: "0.15rem 0.4rem", fontWeight: 900, letterSpacing: "0.05em" }}>
                      {activeTelemetry.statusText}
                    </span>
                  </div>

                  {/* ─────────────────────────────────────────────────────────────
                      PASO 1: CLIENTE / BROWSER -> TRANSMISIÓN HTTPS TLS 1.3
                  ───────────────────────────────────────────────────────────── */}
                  {activeStep === 1 && (
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%", marginTop: isExpanded3D ? "1.4rem" : "0.9rem", zIndex: 2 }}>
                      {/* Nodo Origen: Usuario en Terminal */}
                      <motion.div
                        animate={{ y: [0, -2, 0] }}
                        transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                        style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0.25rem" }}
                      >
                        <div style={{ position: "relative" }}>
                          <div style={{ padding: isExpanded3D ? "0.65rem" : "0.45rem", background: "rgba(212,160,23,0.15)", borderRadius: "10px", border: "1.5px solid #d4a017", boxShadow: "0 0 15px rgba(212,160,23,0.3)" }}>
                            <Laptop size={isExpanded3D ? 34 : 24} style={{ color: "#d4a017" }} />
                          </div>
                          <motion.div
                            animate={{ scale: [1, 1.35, 1], opacity: [0.6, 0.1, 0.6] }}
                            transition={{ repeat: Infinity, duration: 1.8 }}
                            style={{ position: "absolute", inset: -3, borderRadius: "12px", border: "1.5px solid #d4a017", pointerEvents: "none" }}
                          />
                        </div>
                        <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: isExpanded3D ? "0.62rem" : "0.54rem", color: "#F5F1E8", fontWeight: 700 }}>
                          Cliente MTA
                        </span>
                        <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: isExpanded3D ? "0.52rem" : "0.46rem", color: "rgba(245,241,232,0.5)" }}>
                          IP 190.235.12.84
                        </span>
                      </motion.div>

                      {/* Canal de Transmisión con Paquete Cifrado en Viaje */}
                      <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: "0.3rem", padding: isExpanded3D ? "0 1.2rem" : "0 0.6rem" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "0.3rem", background: "rgba(110,142,89,0.18)", padding: "0.15rem 0.45rem", border: "1px solid rgba(110,142,89,0.5)", borderRadius: "15px" }}>
                          <Lock size={10} style={{ color: "#6e8e59" }} />
                          <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: isExpanded3D ? "0.58rem" : "0.5rem", color: "#6e8e59", fontWeight: 800 }}>
                            TLS 1.3 AES
                          </span>
                        </div>

                        {/* Pista de Fibra Óptica con Pulso */}
                        <div style={{ width: "100%", height: 4, background: "rgba(245,241,232,0.15)", borderRadius: 2, position: "relative", overflow: "hidden" }}>
                          <motion.div
                            animate={{ x: ["-100%", "220%"] }}
                            transition={{ repeat: Infinity, duration: 1.2, ease: "easeInOut" }}
                            style={{ width: "35%", height: "100%", background: "linear-gradient(90deg, transparent, #d4a017, #F5F1E8)", borderRadius: 2 }}
                          />
                        </div>

                        <div style={{ display: "flex", alignItems: "center", gap: "0.25rem" }}>
                          <Send size={10} style={{ color: "#d4a017" }} />
                          <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: isExpanded3D ? "0.54rem" : "0.48rem", color: "#d4a017", fontWeight: 700 }}>
                            POST /api/auth
                          </span>
                        </div>
                      </div>

                      {/* Nodo Destino: Internet Gateway */}
                      <motion.div
                        animate={{ scale: [1, 1.05, 1] }}
                        transition={{ repeat: Infinity, duration: 2.4 }}
                        style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0.25rem" }}
                      >
                        <div style={{ padding: isExpanded3D ? "0.65rem" : "0.45rem", background: "rgba(255,255,255,0.06)", borderRadius: "10px", border: "1.5px solid rgba(245,241,232,0.35)" }}>
                          <Globe size={isExpanded3D ? 34 : 24} style={{ color: "#F5F1E8" }} />
                        </div>
                        <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: isExpanded3D ? "0.62rem" : "0.54rem", color: "rgba(245,241,232,0.9)", fontWeight: 700 }}>
                          Internet
                        </span>
                        <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: isExpanded3D ? "0.52rem" : "0.46rem", color: "rgba(245,241,232,0.5)" }}>
                          Puerto :443
                        </span>
                      </motion.div>
                    </div>
                  )}

                  {/* ─────────────────────────────────────────────────────────────
                      PASO 2: AMAZON CLOUDFRONT -> CDN EDGE POP LIMA (CACHE HIT)
                  ───────────────────────────────────────────────────────────── */}
                  {activeStep === 2 && (
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%", marginTop: isExpanded3D ? "1.4rem" : "0.9rem", zIndex: 2 }}>
                      {/* Nodo Izquierda: PoP Lima LIM50 */}
                      <motion.div
                        animate={{ scale: [1, 1.08, 1] }}
                        transition={{ repeat: Infinity, duration: 2 }}
                        style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0.25rem" }}
                      >
                        <div style={{ position: "relative" }}>
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ repeat: Infinity, duration: 8, ease: "linear" }}
                            style={{ position: "absolute", inset: -4, borderRadius: "50%", border: "2px dashed #d4a017" }}
                          />
                          <div style={{ padding: isExpanded3D ? "0.65rem" : "0.45rem", background: "rgba(212,160,23,0.18)", borderRadius: "50%", border: "2px solid #d4a017" }}>
                            <Zap size={isExpanded3D ? 34 : 24} style={{ color: "#d4a017" }} />
                          </div>
                        </div>
                        <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: isExpanded3D ? "0.62rem" : "0.54rem", color: "#F5F1E8", fontWeight: 700 }}>
                          PoP Lima
                        </span>
                        <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: isExpanded3D ? "0.52rem" : "0.46rem", color: "#6e8e59", fontWeight: 700 }}>
                          14ms
                        </span>
                      </motion.div>

                      {/* Animación central: Rayos de Aceleración y Absorción DDoS */}
                      <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: "0.25rem", padding: isExpanded3D ? "0 1.2rem" : "0 0.6rem" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "0.3rem", background: "rgba(110,142,89,0.18)", padding: "0.2rem 0.5rem", border: "1px solid #6e8e59" }}>
                          <CheckCircle2 size={12} style={{ color: "#6e8e59" }} />
                          <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: isExpanded3D ? "0.6rem" : "0.52rem", color: "#6e8e59", fontWeight: 900 }}>
                            EDGE CACHE HIT
                          </span>
                        </div>

                        {/* Flechas dinámicas de respuesta */}
                        <div style={{ width: "100%", display: "flex", justifyContent: "center", gap: "0.3rem", alignItems: "center" }}>
                          <motion.div animate={{ opacity: [0.2, 1, 0.2] }} transition={{ repeat: Infinity, duration: 0.8 }}>
                            <ArrowRight size={12} style={{ color: "#d4a017" }} />
                          </motion.div>
                          <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: isExpanded3D ? "0.54rem" : "0.48rem", color: "#F5F1E8" }}>
                            Entrega bundle JS
                          </span>
                          <motion.div animate={{ opacity: [0.2, 1, 0.2] }} transition={{ repeat: Infinity, duration: 0.8, delay: 0.3 }}>
                            <ArrowRight size={12} style={{ color: "#d4a017" }} />
                          </motion.div>
                        </div>

                        <div style={{ display: "flex", alignItems: "center", gap: "0.25rem" }}>
                          <Shield size={10} style={{ color: "#6e8e59" }} />
                          <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: isExpanded3D ? "0.52rem" : "0.46rem", color: "rgba(245,241,232,0.6)" }}>
                            AWS Shield L3/L4
                          </span>
                        </div>
                      </div>

                      {/* Nodo Derecha: Origen Cómputo No Impactado */}
                      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0.25rem" }}>
                        <div style={{ padding: isExpanded3D ? "0.65rem" : "0.45rem", background: "rgba(110,142,89,0.12)", borderRadius: "10px", border: "1.5px solid #6e8e59" }}>
                          <Server size={isExpanded3D ? 34 : 24} style={{ color: "#6e8e59" }} />
                        </div>
                        <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: isExpanded3D ? "0.62rem" : "0.54rem", color: "#F5F1E8", fontWeight: 700 }}>
                          us-east-1
                        </span>
                        <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: isExpanded3D ? "0.52rem" : "0.46rem", color: "rgba(245,241,232,0.5)" }}>
                          0% Carga
                        </span>
                      </div>
                    </div>
                  )}

                  {/* ─────────────────────────────────────────────────────────────
                      PASO 3: AMAZON ROUTE 53 -> RESOLUCIÓN DNS ANYCAST CON FAILOVER
                  ───────────────────────────────────────────────────────────── */}
                  {activeStep === 3 && (
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%", marginTop: isExpanded3D ? "1.4rem" : "0.9rem", zIndex: 2 }}>
                      {/* Nodo Consulta DNS */}
                      <motion.div
                        animate={{ y: [0, -2, 0] }}
                        transition={{ repeat: Infinity, duration: 1.8 }}
                        style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0.25rem" }}
                      >
                        <div style={{ padding: isExpanded3D ? "0.65rem" : "0.45rem", background: "rgba(255,255,255,0.06)", borderRadius: "10px", border: "1.5px solid rgba(245,241,232,0.3)" }}>
                          <Terminal size={isExpanded3D ? 34 : 24} style={{ color: "#F5F1E8" }} />
                        </div>
                        <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: isExpanded3D ? "0.62rem" : "0.54rem", color: "#F5F1E8", fontWeight: 700 }}>
                          DNS Query
                        </span>
                        <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: isExpanded3D ? "0.52rem" : "0.46rem", color: "#d4a017" }}>
                          senati-mta
                        </span>
                      </motion.div>

                      {/* Nodo Central: Anycast Routing Tower */}
                      <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: "0.25rem", padding: isExpanded3D ? "0 1rem" : "0 0.5rem" }}>
                        <motion.div
                          animate={{ scale: [1, 1.15, 1] }}
                          transition={{ repeat: Infinity, duration: 1.4 }}
                          style={{ padding: isExpanded3D ? "0.6rem" : "0.4rem", background: "rgba(110,142,89,0.18)", borderRadius: "50%", border: "2px solid #6e8e59", boxShadow: "0 0 15px rgba(110,142,89,0.3)" }}
                        >
                          <Radio size={isExpanded3D ? 30 : 22} style={{ color: "#6e8e59" }} />
                        </motion.div>

                        <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: isExpanded3D ? "0.58rem" : "0.5rem", color: "#6e8e59", fontWeight: 800, background: "rgba(0,0,0,0.6)", padding: "0.1rem 0.4rem", border: "1px solid #6e8e59" }}>
                          ROUTE 53 ANYCAST
                        </div>

                        <div style={{ display: "flex", alignItems: "center", gap: "0.25rem" }}>
                          <CheckCircle2 size={10} style={{ color: "#6e8e59" }} />
                          <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: isExpanded3D ? "0.52rem" : "0.46rem", color: "#F5F1E8" }}>
                            DNSSEC (TTL 60s)
                          </span>
                        </div>
                      </div>

                      {/* Nodo IP Resuelta en Subred Privada */}
                      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0.25rem" }}>
                        <div style={{ padding: isExpanded3D ? "0.65rem" : "0.45rem", background: "rgba(212,160,23,0.15)", borderRadius: "10px", border: "1.5px solid #d4a017" }}>
                          <Network size={isExpanded3D ? 34 : 24} style={{ color: "#d4a017" }} />
                        </div>
                        <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: isExpanded3D ? "0.62rem" : "0.54rem", color: "#F5F1E8", fontWeight: 700 }}>
                          Alias IP
                        </span>
                        <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: isExpanded3D ? "0.52rem" : "0.46rem", color: "#6e8e59", fontWeight: 700 }}>
                          10.0.1.24
                        </span>
                      </div>
                    </div>
                  )}

                  {/* ─────────────────────────────────────────────────────────────
                      PASO 4: AMAZON VPC -> ENI Y SEGMENTACIÓN DE SUBRED PRIVADA
                  ───────────────────────────────────────────────────────────── */}
                  {activeStep === 4 && (
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%", marginTop: isExpanded3D ? "1.4rem" : "0.9rem", zIndex: 2 }}>
                      {/* Límite Público: Bloqueo de Gateway */}
                      <motion.div
                        animate={{ scale: [1, 1.05, 1] }}
                        transition={{ repeat: Infinity, duration: 2 }}
                        style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0.25rem" }}
                      >
                        <div style={{ padding: isExpanded3D ? "0.65rem" : "0.45rem", background: "rgba(198,67,43,0.15)", borderRadius: "10px", border: "1.5px solid #c6432b" }}>
                          <ShieldAlert size={isExpanded3D ? 34 : 24} style={{ color: "#c6432b" }} />
                        </div>
                        <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: isExpanded3D ? "0.62rem" : "0.54rem", color: "#c6432b", fontWeight: 700 }}>
                          Internet GW
                        </span>
                        <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: isExpanded3D ? "0.52rem" : "0.46rem", color: "rgba(245,241,232,0.5)" }}>
                          Bloqueado
                        </span>
                      </motion.div>

                      {/* Muro Perimetral VPC: ENI y Subred */}
                      <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: "0.25rem", padding: isExpanded3D ? "0 1.2rem" : "0 0.6rem" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "0.3rem", background: "rgba(212,160,23,0.15)", padding: "0.2rem 0.5rem", border: "1.5px solid #d4a017" }}>
                          <Layers size={11} style={{ color: "#d4a017" }} />
                          <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: isExpanded3D ? "0.62rem" : "0.52rem", color: "#d4a017", fontWeight: 800 }}>
                            VPC 10.0.0.0/16
                          </span>
                        </div>

                        <div style={{ width: "100%", height: 4, background: "rgba(245,241,232,0.15)", borderRadius: 2, position: "relative", overflow: "hidden" }}>
                          <motion.div
                            animate={{ x: ["-100%", "220%"] }}
                            transition={{ repeat: Infinity, duration: 1.1, ease: "linear" }}
                            style={{ width: "40%", height: "100%", background: "#6e8e59" }}
                          />
                        </div>

                        <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: isExpanded3D ? "0.54rem" : "0.48rem", color: "rgba(245,241,232,0.7)" }}>
                          Segmentación ENI
                        </span>
                      </div>

                      {/* Subred Privada Aislada */}
                      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0.25rem" }}>
                        <div style={{ padding: isExpanded3D ? "0.65rem" : "0.45rem", background: "rgba(110,142,89,0.15)", borderRadius: "10px", border: "1.5px solid #6e8e59" }}>
                          <Box size={isExpanded3D ? 34 : 24} style={{ color: "#6e8e59" }} />
                        </div>
                        <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: isExpanded3D ? "0.62rem" : "0.54rem", color: "#F5F1E8", fontWeight: 700 }}>
                          Subred Privada
                        </span>
                        <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: isExpanded3D ? "0.52rem" : "0.46rem", color: "#6e8e59", fontWeight: 700 }}>
                          10.0.2.0/24
                        </span>
                      </div>
                    </div>
                  )}

                  {/* ─────────────────────────────────────────────────────────────
                      PASO 5: SECURITY GROUPS -> INSPECCIÓN STATEFUL PUERTO 5432
                  ───────────────────────────────────────────────────────────── */}
                  {activeStep === 5 && (
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%", marginTop: isExpanded3D ? "1.4rem" : "0.9rem", zIndex: 2 }}>
                      {/* Paquetes Entrantes Varios */}
                      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0.25rem" }}>
                        <div style={{ padding: isExpanded3D ? "0.65rem" : "0.45rem", background: "rgba(255,255,255,0.06)", borderRadius: "10px", border: "1.5px solid rgba(245,241,232,0.3)" }}>
                          <Binary size={isExpanded3D ? 34 : 24} style={{ color: "#F5F1E8" }} />
                        </div>
                        <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: isExpanded3D ? "0.62rem" : "0.54rem", color: "#F5F1E8", fontWeight: 700 }}>
                          Puertos
                        </span>
                        <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: isExpanded3D ? "0.52rem" : "0.46rem", color: "rgba(245,241,232,0.5)" }}>
                          22, 80, 5432
                        </span>
                      </div>

                      {/* Escudo Giratorio de Inspección L4 */}
                      <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: "0.25rem", padding: isExpanded3D ? "0 1rem" : "0 0.5rem" }}>
                        <motion.div
                          animate={{ rotateY: [0, 180, 360] }}
                          transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
                          style={{ padding: isExpanded3D ? "0.6rem" : "0.4rem", background: "rgba(110,142,89,0.2)", borderRadius: "50%", border: "2px solid #6e8e59", boxShadow: "0 0 20px rgba(110,142,89,0.4)" }}
                        >
                          <ShieldCheck size={isExpanded3D ? 32 : 22} style={{ color: "#6e8e59" }} />
                        </motion.div>

                        <div style={{ display: "flex", gap: "0.3rem" }}>
                          <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: isExpanded3D ? "0.56rem" : "0.48rem", color: "#6e8e59", background: "rgba(110,142,89,0.15)", border: "1px solid #6e8e59", padding: "0.1rem 0.35rem", fontWeight: 800 }}>
                            5432 OK
                          </span>
                          <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: isExpanded3D ? "0.56rem" : "0.48rem", color: "#c6432b", background: "rgba(198,67,43,0.15)", border: "1px solid #c6432b", padding: "0.1rem 0.35rem", fontWeight: 800 }}>
                            DROP
                          </span>
                        </div>

                        <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: isExpanded3D ? "0.52rem" : "0.46rem", color: "rgba(245,241,232,0.6)" }}>
                          Zero-Trust L4
                        </span>
                      </div>

                      {/* Backend App Autorizado */}
                      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0.25rem" }}>
                        <div style={{ padding: isExpanded3D ? "0.65rem" : "0.45rem", background: "rgba(110,142,89,0.15)", borderRadius: "10px", border: "1.5px solid #6e8e59" }}>
                          <Key size={isExpanded3D ? 34 : 24} style={{ color: "#6e8e59" }} />
                        </div>
                        <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: isExpanded3D ? "0.62rem" : "0.54rem", color: "#F5F1E8", fontWeight: 700 }}>
                          sg-backend
                        </span>
                        <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: isExpanded3D ? "0.52rem" : "0.46rem", color: "#6e8e59", fontWeight: 700 }}>
                          Permitido
                        </span>
                      </div>
                    </div>
                  )}

                  {/* ─────────────────────────────────────────────────────────────
                      PASO 6: AMAZON RDS -> ESCRITURA/LECTURA SQL CIFRADA KMS
                  ───────────────────────────────────────────────────────────── */}
                  {activeStep === 6 && (
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%", marginTop: isExpanded3D ? "1.4rem" : "0.9rem", zIndex: 2 }}>
                      {/* Nodo Instancia Primaria */}
                      <motion.div
                        animate={{ y: [0, -2, 0] }}
                        transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
                        style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0.25rem" }}
                      >
                        <div style={{ position: "relative" }}>
                          <div style={{ padding: isExpanded3D ? "0.65rem" : "0.45rem", background: "rgba(212,160,23,0.2)", borderRadius: "10px", border: "2px solid #d4a017", boxShadow: "0 0 20px rgba(212,160,23,0.35)" }}>
                            <Database size={isExpanded3D ? 34 : 24} style={{ color: "#d4a017" }} />
                          </div>
                          <motion.div
                            animate={{ scale: [1, 1.3, 1], opacity: [0.8, 0.2, 0.8] }}
                            transition={{ repeat: Infinity, duration: 1.5 }}
                            style={{ position: "absolute", inset: -3, borderRadius: "12px", border: "1.5px solid #d4a017", pointerEvents: "none" }}
                          />
                        </div>
                        <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: isExpanded3D ? "0.62rem" : "0.54rem", color: "#F5F1E8", fontWeight: 700 }}>
                          RDS Primario
                        </span>
                        <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: isExpanded3D ? "0.52rem" : "0.46rem", color: "#d4a017", fontWeight: 700 }}>
                          db.t4g.medium
                        </span>
                      </motion.div>

                      {/* Replicación Síncrona Multi-AZ y Cifrado KMS */}
                      <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: "0.25rem", padding: isExpanded3D ? "0 1.2rem" : "0 0.6rem" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "0.3rem", background: "rgba(110,142,89,0.18)", padding: "0.15rem 0.45rem", border: "1px solid #6e8e59" }}>
                          <Lock size={10} style={{ color: "#6e8e59" }} />
                          <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: isExpanded3D ? "0.58rem" : "0.5rem", color: "#6e8e59", fontWeight: 800 }}>
                            KMS AES-256
                          </span>
                        </div>

                        {/* Canal de Replicación Síncrona */}
                        <div style={{ width: "100%", height: 4, background: "rgba(245,241,232,0.15)", borderRadius: 2, position: "relative", overflow: "hidden" }}>
                          <motion.div
                            animate={{ x: ["-100%", "220%"] }}
                            transition={{ repeat: Infinity, duration: 1.3, ease: "linear" }}
                            style={{ width: "35%", height: "100%", background: "#d4a017" }}
                          />
                        </div>

                        <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: isExpanded3D ? "0.54rem" : "0.48rem", color: "#6e8e59", fontWeight: 700 }}>
                          Multi-AZ Sync
                        </span>
                      </div>

                      {/* Nodo Standby en AZ-2 */}
                      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0.25rem" }}>
                        <div style={{ padding: isExpanded3D ? "0.65rem" : "0.45rem", background: "rgba(110,142,89,0.15)", borderRadius: "10px", border: "1.5px solid #6e8e59" }}>
                          <HardDrive size={isExpanded3D ? 34 : 24} style={{ color: "#6e8e59" }} />
                        </div>
                        <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: isExpanded3D ? "0.62rem" : "0.54rem", color: "#F5F1E8", fontWeight: 700 }}>
                          RDS Standby
                        </span>
                        <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: isExpanded3D ? "0.52rem" : "0.46rem", color: "rgba(245,241,232,0.5)" }}>
                          Failover Auto
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                {/* ── PARTE INFERIOR: EXPLICACIÓN TÉCNICA (SOLO VISIBLE EN PANTALLA EXPANDIDA) ── */}
                {isExpanded3D && (
                  <>
                    <div style={{ display: "flex", flexDirection: "column", gap: "0.45rem" }}>
                      <div>
                        <h3 style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: "0.86rem", color: "#F5F1E8", margin: "0 0 0.15rem 0", textTransform: "uppercase" }}>
                          {activeTelemetry.name} ({activeTelemetry.protocol})
                        </h3>
                        <p style={{ fontFamily: "system-ui, sans-serif", fontSize: "0.78rem", color: "rgba(245,241,232,0.9)", lineHeight: 1.45, margin: 0 }}>
                          {activeTelemetry.detail}
                        </p>
                      </div>

                      {/* Acción Concreta */}
                      <div style={{ padding: "0.45rem 0.65rem", background: "rgba(255,255,255,0.03)", borderLeft: "3.5px solid #d4a017" }}>
                        <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.56rem", color: "#d4a017", fontWeight: 800 }}>
                          ACCIÓN EN ESTE NODO:
                        </div>
                        <div style={{ fontFamily: "system-ui, sans-serif", fontSize: "0.72rem", color: "#F5F1E8", marginTop: "0.15rem", lineHeight: 1.35 }}>
                          {activeTelemetry.actionStep}
                        </div>
                      </div>

                      {/* Blindaje de Seguridad */}
                      <div style={{ padding: "0.45rem 0.65rem", background: "rgba(255,255,255,0.03)", borderLeft: "3.5px solid #6e8e59" }}>
                        <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.56rem", color: "#6e8e59", fontWeight: 800 }}>
                          BLINDAJE DE SEGURIDAD:
                        </div>
                        <div style={{ fontFamily: "system-ui, sans-serif", fontSize: "0.72rem", color: "#F5F1E8", marginTop: "0.15rem", lineHeight: 1.35 }}>
                          {activeTelemetry.securityRule}
                        </div>
                      </div>
                    </div>

                    {/* Telemetría y Latencia Acumulada */}
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        borderTop: "1px solid rgba(245,241,232,0.12)",
                        paddingTop: "0.4rem",
                        fontFamily: "'JetBrains Mono', monospace",
                        fontSize: "0.58rem",
                      }}
                    >
                      <span style={{ color: "rgba(245,241,232,0.6)" }}>
                        Latencia salto: <strong style={{ color: "#d4a017" }}>{activeTelemetry.latency}</strong>
                      </span>
                      <span style={{ color: "#6e8e59", fontWeight: 700 }}>
                        {isSimulating ? "TRANSICIÓN AUTOMÁTICA..." : "PAUSA DE INSPECCIÓN"}
                      </span>
                    </div>
                  </>
                )}
              </motion.div>
            ) : (
              <motion.div
                key="flow-finished"
                initial={{ opacity: 0, y: -12, scale: 0.92 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.92 }}
                transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
                style={{
                  padding: "1.1rem 1.25rem",
                  background: "rgba(10,18,10,0.85)",
                  border: "2px solid #6e8e59",
                  boxShadow: "0 20px 50px rgba(0,0,0,0.85), 6px 6px 0px #6e8e59",
                  backdropFilter: "blur(20px)",
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.6rem",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.45rem" }}>
                    <CheckCircle2 size={18} style={{ color: "#6e8e59" }} />
                    <span style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: "0.78rem", color: "#F5F1E8", textTransform: "uppercase" }}>
                      PETICIÓN HTTP EXITOSA // 200 OK
                    </span>
                  </div>
                  <span
                    style={{
                      fontFamily: "'JetBrains Mono', monospace",
                      fontSize: "0.55rem",
                      color: "#6e8e59",
                      background: "rgba(110,142,89,0.2)",
                      border: "1px solid #6e8e59",
                      padding: "0.15rem 0.45rem",
                      fontWeight: 800,
                    }}
                  >
                    30ms TOTAL
                  </span>
                </div>

                <div
                  style={{
                    background: "rgba(110,142,89,0.08)",
                    border: "1px solid rgba(110,142,89,0.3)",
                    padding: "0.5rem 0.75rem",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.6rem",
                  }}
                >
                  <Sparkles size={20} style={{ color: "#6e8e59", flexShrink: 0 }} />
                  <div style={{ fontFamily: "system-ui, sans-serif", fontSize: "0.68rem", color: "rgba(245,241,232,0.9)", lineHeight: 1.35 }}>
                    Ciclo completado con éxito. Respuesta devuelta al navegador con cifrado TLS 1.3 sin vulnerar la red privada.
                  </div>
                </div>

                <div style={{ display: "flex", gap: "0.5rem", marginTop: "0.2rem" }}>
                  <Button
                    variant="outline"
                    size="sm"
                    icon={RotateCcw}
                    onClick={handleReset}
                    className="!py-1 !px-2.5 !text-xs !border-white/30 !text-white hover:!bg-white/10 !flex-1"
                  >
                    Reiniciar Vista
                  </Button>
                  <Button
                    variant="primary"
                    size="sm"
                    icon={Play}
                    onClick={handleSimulateRequest}
                    className="!py-1 !px-2.5 !text-xs !flex-1"
                  >
                    Repetir Flujo
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Canvas 3D Three.js (Ocupa el 100% del espacio para que las estrellas cubran toda la pantalla) */}
        <div
          style={{
            width: "100%",
            height: isExpanded3D ? "100%" : "75%",
            position: isExpanded3D ? "absolute" : "relative",
            inset: isExpanded3D ? 0 : "auto",
            zIndex: 5,
            transition: "all 0.3s ease",
          }}
        >
          <CanvasTransitionWrapper isActive={isActive}>
            <CloudArchitectureHeroCanvas
              isActive={isActive}
              activeStep={activeStep}
            />
          </CanvasTransitionWrapper>
        </div>

        {/* HUD Inferior de los Servicios Perimetrales */}
        <div
          style={{
            position: "absolute",
            bottom: "1.5rem",
            left: "2.5rem",
            right: isExpanded3D ? "calc(460px + 4.5rem)" : "3.5rem",
            zIndex: 35,
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: "0.55rem",
            transition: "all 0.3s ease",
          }}
        >
          <div style={{ padding: "0.5rem 0.65rem", background: "rgba(14,14,14,0.75)", border: "1px solid rgba(245,241,232,0.15)", backdropFilter: "blur(6px)" }}>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.5rem", color: "rgba(245,241,232,0.5)" }}>
              AMAZON VPC
            </div>
            <div style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: "0.68rem", color: "#F5F1E8", marginTop: "0.1rem" }}>
              10.0.0.0/16
            </div>
          </div>

          <div style={{ padding: "0.5rem 0.65rem", background: "rgba(14,14,14,0.75)", border: "1px solid rgba(245,241,232,0.15)", backdropFilter: "blur(6px)" }}>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.5rem", color: "rgba(245,241,232,0.5)" }}>
              SECURITY GROUPS
            </div>
            <div style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: "0.68rem", color: "#6e8e59", marginTop: "0.1rem" }}>
              L4 STATEFUL
            </div>
          </div>

          <div style={{ padding: "0.5rem 0.65rem", background: "rgba(14,14,14,0.75)", border: "1px solid rgba(245,241,232,0.15)", backdropFilter: "blur(6px)" }}>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.5rem", color: "rgba(245,241,232,0.5)" }}>
              ROUTE 53
            </div>
            <div style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: "0.68rem", color: "#F5F1E8", marginTop: "0.1rem" }}>
              GLOBAL DNS
            </div>
          </div>

          <div style={{ padding: "0.5rem 0.65rem", background: "rgba(14,14,14,0.75)", border: "1px solid rgba(245,241,232,0.15)", backdropFilter: "blur(6px)" }}>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.5rem", color: "rgba(245,241,232,0.5)" }}>
              CLOUDFRONT
            </div>
            <div style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: "0.68rem", color: "#d4a017", marginTop: "0.1rem" }}>
              CDN CACHE
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default S12_Arquitectura;