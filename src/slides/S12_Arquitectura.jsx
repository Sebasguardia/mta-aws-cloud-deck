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
} from "lucide-react";
import { slidesContent } from "../data/content.es.js";
import { awsServices } from "../data/awsServices.js";
import { useSlideActive } from "../hooks/useSlideActive.js";
import { CloudArchitectureHeroCanvas } from "../components/three/CloudArchitectureHeroCanvas.jsx";
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
  const timerRef = useRef(null);

  const nodes = [
    {
      id: 1,
      name: "Cliente / Browser",
      protocol: "HTTPS :443",
      icon: Globe,
      latency: "0ms",
      detail: "Petición originada desde el navegador web del practicante o cliente.",
      statusText: "DISPATCHED",
    },
    {
      id: 2,
      name: "CloudFront",
      protocol: "CDN Edge",
      icon: Zap,
      latency: "+14ms",
      detail: "Caché de contenido estático y frontend en puntos de presencia globales.",
      statusText: "EDGE HIT",
    },
    {
      id: 3,
      name: "Route 53",
      protocol: "DNS Routing",
      icon: Globe,
      latency: "+8ms",
      detail: "Resolución de dominios con chequeos de salud y enrutamiento por baja latencia.",
      statusText: "RESOLVED",
    },
    {
      id: 4,
      name: "Amazon VPC",
      protocol: "10.0.0.0/16",
      icon: Server,
      latency: "+3ms",
      detail: "Red virtual privada aislada donde residen los recursos protegidos.",
      statusText: "INSPECTION",
    },
    {
      id: 5,
      name: "Security Groups",
      protocol: "Stateful L4",
      icon: Shield,
      latency: "+1ms",
      detail: "Firewall perimetral que solo autoriza tráfico en puertos específicos.",
      statusText: "PORT 5432 OK",
    },
    {
      id: 6,
      name: "RDS Database",
      protocol: "Subred Privada",
      icon: Database,
      latency: "+4ms",
      detail: "Base de datos PostgreSQL de Workspace MTA completamente inaccesible desde internet.",
      statusText: "QUERY 200 OK",
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
    }, 850);
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

            {activeStep > nodes.length ? (
              <Button
                variant="outline"
                size="sm"
                icon={RotateCcw}
                onClick={handleReset}
                className="!py-1 !px-2.5 !text-xs !border-white/30 !text-white hover:!bg-white/10"
              >
                Reiniciar
              </Button>
            ) : (
              <Button
                variant="primary"
                size="sm"
                icon={Play}
                onClick={handleSimulateRequest}
                disabled={isSimulating}
                className="!py-1 !px-3 !text-xs"
              >
                {isSimulating ? "Trazando..." : "▶ Simular Petición"}
              </Button>
            )}
          </div>

          {/* Grid de los 6 Nodos del Recorrido */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: "0.35rem" }}>
            {nodes.map((node, index) => {
              const NodeIcon = node.icon;
              const isNodeActive = activeStep === node.id;
              const isNodePassed = activeStep > node.id;

              return (
                <div
                  key={node.id}
                  style={{
                    padding: "0.45rem 0.3rem",
                    border: isNodeActive
                      ? "1.5px solid #d4a017"
                      : isNodePassed
                      ? "1.5px solid #6e8e59"
                      : "1px solid rgba(245,241,232,0.12)",
                    background: isNodeActive
                      ? "rgba(212,160,23,0.18)"
                      : isNodePassed
                      ? "rgba(110,142,89,0.12)"
                      : "rgba(0,0,0,0.5)",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    textAlign: "center",
                    minHeight: 80,
                    justifyContent: "space-between",
                    transition: "all 0.2s ease",
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
                    En espera. Presiona "Simular Petición" para trazar la ruta perimetral.
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
                    ✅ 200 OK — CloudFront CDN Cache Hit + Amazon VPC Firewall Aprobado (30ms)
                  </motion.span>
                )}
              </AnimatePresence>
            </div>

            {activeStep > nodes.length && (
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.55rem", color: "#6e8e59", fontWeight: 800 }}>
                LATENCIA: 30ms
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
          COLUMNA DERECHA (50%): Hero Canvas 3D de Capas Perimetrales
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
            <Server size={14} style={{ color: "#d4a017" }} />
            <span
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: "0.65rem",
                letterSpacing: "0.15em",
                color: "rgba(245,241,232,0.7)",
                textTransform: "uppercase",
              }}
            >
              AWS NETWORK PERIMETER // 5-LAYER TOPOLOGY
            </span>
          </div>

          <div
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: "0.6rem",
              padding: "0.2rem 0.5rem",
              background: activeStep > nodes.length ? "rgba(110,142,89,0.2)" : "rgba(212,160,23,0.15)",
              border: activeStep > nodes.length ? "1px solid #6e8e59" : "1px solid #d4a017",
              color: activeStep > nodes.length ? "#6e8e59" : "#d4a017",
            }}
          >
            {activeStep > nodes.length ? "RESPONSE: 200 OK" : isSimulating ? `INSPECTING: STEP 0${activeStep}` : "TOPOLOGY: ISOLATED"}
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
          <CloudArchitectureHeroCanvas
            isActive={isActive}
            activeStep={activeStep}
          />
        </div>

        {/* HUD Inferior de los Servicios Perimetrales */}
        <div
          style={{
            position: "absolute",
            bottom: "2rem",
            left: "3rem",
            right: "3.5rem",
            zIndex: 10,
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: "0.55rem",
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