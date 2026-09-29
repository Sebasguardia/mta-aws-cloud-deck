// src/slides/S14_Computo.jsx
import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import {
  Cpu,
  Server,
  HardDrive,
  Zap,
  Box,
  Layers,
  Activity,
} from "lucide-react";
import { slidesContent } from "../data/content.es.js";
import { useSlideActive } from "../hooks/useSlideActive.js";

const c = slidesContent.s14_computo;

export function S14_Computo({ isActive: propActive } = {}) {
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
  const [selectedTech, setSelectedTech] = useState("ec2");
  const [instanceSize, setInstanceSize] = useState("t4g.small");
  const [pulse, setPulse] = useState(false);

  useEffect(() => {
    if (!isActive) return;
    const t = setTimeout(() => setEntered(true), 40);
    return () => { clearTimeout(t); setEntered(false); };
  }, [isActive]);

  // Pulsing live indicator
  useEffect(() => {
    if (!entered) return;
    const interval = setInterval(() => setPulse(p => !p), 1200);
    return () => clearInterval(interval);
  }, [entered]);

  const fadeUp = (delay = 0) => ({
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 18 },
    visible: {
      opacity: 1, y: 0,
      transition: { duration: shouldReduceMotion ? 0.1 : 0.52, ease: [0.16, 1, 0.3, 1], delay },
    },
  });

  const computeOptions = {
    ec2: {
      id: "ec2", name: "Amazon EC2 + EBS gp3", category: "Infraestructura Base (IaaS)",
      icon: Server, color: "#d4a017",
      title: "Instancias Elásticas con Almacenamiento SSD gp3",
      specs: "2 vCPU Graviton2 · 2 GB RAM · 30 GB SSD gp3 (3 000 IOPS / 125 MB/s)",
      cost: "~$12.50 USD / mes",
      suitability: "ÓPTIMO PARA BACKEND PRINCIPAL Y STAGING",
      desc: "Instancias EC2 t4g.small basadas en procesadores AWS Graviton2 ARM de 64 bits. Ofrecen un 40 % mejor relación precio/rendimiento frente a arquitecturas x86 tradicionales.",
      ebsDetail: "Volúmenes Amazon EBS gp3 independientes con 3 000 IOPS y 125 MB/s de rendimiento base sin costo adicional por aprovisionamiento.",
      mtaCase: "Alojamiento del backend Node.js de Workspace MTA y entornos de prueba para los 10 practicantes con capacidad de escalado vertical instantáneo.",
      hostingerAdvantage: "Reemplaza los recursos compartidos saturados de Hostinger por CPU dedicada garantizada con métricas CloudWatch en tiempo real.",
    },
    containers: {
      id: "containers", name: "Contenedores Docker + ECS", category: "Empaquetamiento Ágil (CaaS)",
      icon: Box, color: "#7a9b5c",
      title: "Microservicios Containerizados en Amazon ECS",
      specs: "AWS Fargate / EC2 Launch Type · Docker Containers",
      cost: "Pago por vCPU·s y memoria",
      suitability: "ESTANDARIZACIÓN DE PRÁCTICAS REMOTAS",
      desc: "Empaquetamiento del frontend Next.js y APIs Node.js en imágenes Docker inmutables gestionadas por Amazon Elastic Container Service (ECS).",
      ebsDetail: "Persistencia compartida mediante Amazon EFS montado en los contenedores para sincronización de código y assets temporales.",
      mtaCase: "Elimina de raíz el problema 'en mi máquina funciona': los 10 practicantes despliegan la misma imagen en AWS.",
      hostingerAdvantage: "Cero discrepancias entre entornos locales y producción; deploys atómicos sin caída de servicio (Blue/Green).",
    },
    lambda: {
      id: "lambda", name: "AWS Lambda (Serverless)", category: "Arquitectura Sin Servidor (FaaS)",
      icon: Zap, color: "#e8a0bf",
      title: "Cómputo Serverless Impulsado por Eventos",
      specs: "1 M peticiones gratis/mes · 3.2 M segundos de cómputo Free Tier",
      cost: "$0.00 USD (Free Tier)",
      suitability: "TAREAS ASÍNCRONAS Y AUTOMATIZACIONES",
      desc: "Ejecución de código en milisegundos en respuesta a eventos de S3, API Gateway o cron jobs de EventBridge sin mantener servidores encendidos.",
      ebsDetail: "Almacenamiento efímero /tmp configurable de 512 MB a 10 GB para procesamiento de archivos y PDFs.",
      mtaCase: "Generación automática nocturna de reportes de asistencia de practicantes, alertas de vencimiento de proyectos y procesamiento de imágenes.",
      hostingerAdvantage: "Costo cero en reposo: cuando los practicantes no usan las funciones, MTA Software no paga un centavo.",
    },
    beanstalk: {
      id: "beanstalk", name: "AWS Elastic Beanstalk", category: "Plataforma de Despliegue Rápido (PaaS)",
      icon: Layers, color: "#4a5d3a",
      title: "Despliegue Automatizado y Gestión de Entornos",
      specs: "Aprovisiona automáticamente EC2, ELB, Auto Scaling y CloudWatch",
      cost: "Sin costo adicional (solo recursos)",
      suitability: "DESPLIEGUES SIMPLES PARA PRACTICANTES",
      desc: "Plataforma administrada que permite a los practicantes subir código Node.js o React con 'eb deploy', delegando el aprovisionamiento de red y balanceo a AWS.",
      ebsDetail: "Configuración automatizada de volúmenes EBS y balanceadores de carga con certificados SSL administrados vía ACM.",
      mtaCase: "Ideal para proyectos de clientes externos (Strato Studio, VIISION) permitiendo despliegues sin tocar consolas complejas.",
      hostingerAdvantage: "Automatiza parches de seguridad, balanceo de carga y reinicios que en Hostinger requerían intervención manual.",
    },
  };

  const instanceProfiles = {
    "t4g.nano":  { vCPU: "2", ram: "0.5 GB", iops: "3 000", cost: "$3.10/mes",  role: "Dev / Pruebas unitarias" },
    "t4g.small": { vCPU: "2", ram: "2.0 GB", iops: "3 000", cost: "$12.40/mes", role: "Staging + Backend ERP ✓" },
    "t3.medium": { vCPU: "2", ram: "4.0 GB", iops: "3 000", cost: "$30.50/mes", role: "Producción concurrente" },
  };

  const current = computeOptions[selectedTech] || computeOptions.ec2;

  return (
    <section
      ref={sectionRef}
      className="slide-fullscreen"
      style={{ width: "100%", height: "100%", position: "relative", background: "#0A0A0A", overflow: "hidden", display: "flex", flexDirection: "row" }}
    >
      {/* ── Retícula de fondo ── */}
      <div aria-hidden="true" style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(245,241,232,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(245,241,232,0.025) 1px, transparent 1px)", backgroundSize: "64px 64px", pointerEvents: "none", zIndex: 0 }} />
      <div aria-hidden="true" style={{ position: "absolute", inset: 0, background: "repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,0,0,0.07) 3px, rgba(0,0,0,0.07) 6px)", pointerEvents: "none", zIndex: 1 }} />
      <div aria-hidden="true" style={{ position: "absolute", inset: 0, background: "radial-gradient(circle at 75% 50%, rgba(212,160,23,0.18) 0%, transparent 65%)", pointerEvents: "none", zIndex: 1 }} />

      {/* ── Barra de acento wipe-in ── */}
      <motion.div
        aria-hidden="true"
        initial={{ scaleY: 0, transformOrigin: "top" }}
        animate={entered ? { scaleY: 1 } : { scaleY: 0 }}
        transition={{ duration: shouldReduceMotion ? 0.1 : 0.65, ease: [0.83, 0, 0.17, 1], delay: 0.05 }}
        style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 4, background: "#d4a017", zIndex: 3 }}
      />

      {/* ══════════════ COLUMNA IZQUIERDA (50%) ══════════════ */}
      <div style={{ flex: "0 0 50%", display: "flex", flexDirection: "column", justifyContent: "center", padding: "2.5rem 3rem 2.5rem 4.8rem", position: "relative", zIndex: 2, gap: "0.85rem" }}>

        {/* Header editorial */}
        <div style={{ display: "flex", flexDirection: "column", gap: "0.2rem" }}>
          <motion.div variants={fadeUp(0.04)} initial="hidden" animate={entered ? "visible" : "hidden"} style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.65rem", letterSpacing: "0.2em", textTransform: "uppercase", fontWeight: 700, color: "#d4a017", background: "rgba(212,160,23,0.12)", border: "1px solid rgba(212,160,23,0.4)", padding: "0.25rem 0.65rem" }}>
              [ {c.badge} ]
            </span>
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.62rem", letterSpacing: "0.15em", color: "rgba(245,241,232,0.45)" }}>
              SEC_14 // CLOUD_COMPUTE_SERVERS
            </span>
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.58rem", color: "#7a9b5c", background: "rgba(122,155,92,0.15)", border: "1px solid rgba(122,155,92,0.35)", padding: "0.15rem 0.45rem", fontWeight: 700 }}>
              EC2 · EBS · DOCKER · LAMBDA
            </span>
          </motion.div>

          <motion.p variants={fadeUp(0.08)} initial="hidden" animate={entered ? "visible" : "hidden"}
            style={{ fontFamily: "Yellowtail, cursive", fontSize: "clamp(1.3rem, 2vw, 1.8rem)", color: "#e8a0bf", lineHeight: 1.1, margin: "0.15rem 0 0 0" }}>
            {c.scriptTag}
          </motion.p>

          <motion.h1 variants={fadeUp(0.12)} initial="hidden" animate={entered ? "visible" : "hidden"}
            style={{ fontFamily: "'Archivo Black', 'Arial Black', sans-serif", fontSize: "clamp(1.6rem, 2.3vw, 2.2rem)", color: "#F5F1E8", letterSpacing: "-0.025em", lineHeight: 1.05, textTransform: "uppercase", margin: 0 }}>
            {c.title}
          </motion.h1>

          {/* Wipe-in divider */}
          <motion.div
            initial={{ clipPath: "inset(0 100% 0 0)" }}
            animate={entered ? { clipPath: "inset(0 0% 0 0)" } : { clipPath: "inset(0 100% 0 0)" }}
            transition={{ duration: shouldReduceMotion ? 0.1 : 0.55, ease: [0.83, 0, 0.17, 1], delay: 0.18 }}
            style={{ height: 2, background: "#d4a017", width: "100%", maxWidth: 220, margin: "0.2rem 0" }}
          />

          <motion.p variants={fadeUp(0.16)} initial="hidden" animate={entered ? "visible" : "hidden"}
            style={{ fontFamily: "system-ui, -apple-system, sans-serif", fontSize: "clamp(0.85rem, 1.05vw, 0.95rem)", color: "rgba(245,241,232,0.65)", margin: 0, lineHeight: 1.4 }}>
            {c.subtitle}
          </motion.p>
        </div>

        {/* Selector de 4 Opciones */}
        <motion.div variants={fadeUp(0.22)} initial="hidden" animate={entered ? "visible" : "hidden"}
          style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "0.4rem", background: "rgba(18,18,18,0.9)", border: "1.5px solid rgba(245,241,232,0.15)", padding: "0.35rem" }}>
          {Object.values(computeOptions).map((tech) => {
            const isSelected = selectedTech === tech.id;
            return (
              <button key={tech.id} type="button" onClick={() => setSelectedTech(tech.id)}
                style={{ background: isSelected ? "#d4a017" : "transparent", color: isSelected ? "#0A0A0A" : "rgba(245,241,232,0.7)", border: isSelected ? "1px solid #d4a017" : "1px solid rgba(245,241,232,0.1)", padding: "0.4rem 0.3rem", fontFamily: "'JetBrains Mono', monospace", fontSize: "0.58rem", fontWeight: 700, cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: "0.2rem", transition: "all 0.18s ease", position: "relative", overflow: "hidden" }}>
                {/* Animated selection glow */}
                {isSelected && (
                  <motion.div
                    layoutId="tech-selector-glow"
                    style={{ position: "absolute", inset: 0, background: "rgba(212,160,23,0.15)" }}
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
                <tech.icon size={13} style={{ position: "relative", zIndex: 1 }} />
                <span style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", position: "relative", zIndex: 1 }}>
                  {tech.id.toUpperCase()}
                </span>
              </button>
            );
          })}
        </motion.div>

        {/* Telemetría live */}
        <motion.div variants={fadeUp(0.28)} initial="hidden" animate={entered ? "visible" : "hidden"}
          style={{ padding: "0.45rem 0.75rem", background: "#0A0A0A", border: "1px solid rgba(245,241,232,0.12)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            {/* Pulsing dot */}
            <motion.div
              animate={{ opacity: pulse ? 1 : 0.3, scale: pulse ? 1.2 : 0.9 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
              style={{ width: 7, height: 7, borderRadius: "50%", background: "#7a9b5c", flexShrink: 0 }}
            />
            <Activity size={13} style={{ color: "#d4a017", flexShrink: 0 }} />
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.62rem", color: "#d4a017", fontWeight: 700 }}>COMPUTE STATUS:</span>
            <AnimatePresence mode="wait">
              <motion.span
                key={selectedTech + "-spec"}
                initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.2 }}
                style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.58rem", color: "#F5F1E8" }}>
                {current.specs}
              </motion.span>
            </AnimatePresence>
          </div>
          <AnimatePresence mode="wait">
            <motion.span
              key={selectedTech + "-cost"}
              initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -8 }}
              transition={{ duration: 0.2 }}
              style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.55rem", color: "#7a9b5c", fontWeight: 800 }}>
              {current.cost}
            </motion.span>
          </AnimatePresence>
        </motion.div>

        {/* Matriz de Instancias EC2 */}
        <motion.div variants={fadeUp(0.34)} initial="hidden" animate={entered ? "visible" : "hidden"} style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
          <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.58rem", color: "#d4a017", letterSpacing: "0.1em", fontWeight: 700 }}>
            CONFIGURACIÓN PROPUESTA PARA MTA SOFTWARE:
          </span>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "0.45rem" }}>
            {Object.entries(instanceProfiles).map(([key, inst], idx) => {
              const isSelectedInst = instanceSize === key;
              return (
                <motion.div key={key} onClick={() => setInstanceSize(key)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  transition={{ type: "spring", stiffness: 400, damping: 25 }}
                  style={{ padding: "0.55rem 0.65rem", background: isSelectedInst ? "rgba(212,160,23,0.12)" : "rgba(255,255,255,0.02)", border: isSelectedInst ? "1.5px solid #d4a017" : "1px solid rgba(245,241,232,0.12)", cursor: "pointer", display: "flex", flexDirection: "column", gap: "0.2rem" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.6rem", fontWeight: 700, color: isSelectedInst ? "#d4a017" : "#F5F1E8" }}>{key}</span>
                    <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.55rem", color: "#7a9b5c", fontWeight: 700 }}>{inst.cost}</span>
                  </div>
                  <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.52rem", color: "rgba(245,241,232,0.55)" }}>
                    {inst.vCPU} vCPU · {inst.ram} · {inst.iops} IOPS
                  </div>
                  <div style={{ fontFamily: "system-ui, sans-serif", fontSize: "0.62rem", color: isSelectedInst ? "#F5F1E8" : "rgba(245,241,232,0.4)" }}>
                    {inst.role}
                  </div>
                  {/* Animated selection bar */}
                  {isSelectedInst && (
                    <motion.div
                      layoutId="instance-bar"
                      style={{ height: 2, background: "#d4a017", borderRadius: 1, marginTop: "0.15rem" }}
                      transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    />
                  )}
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </div>

      {/* ══════════════ COLUMNA DERECHA (50%) ══════════════ */}
      <div style={{ flex: "0 0 50%", position: "relative", display: "flex", flexDirection: "column", justifyContent: "center", padding: "2.5rem 4rem 2.5rem 1rem", zIndex: 2, gap: "0.75rem" }}>

        {/* Cabecera técnica */}
        <motion.div variants={fadeUp(0.1)} initial="hidden" animate={entered ? "visible" : "hidden"}
          style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0.3rem 0.6rem", background: "#101010", border: "1px solid rgba(245,241,232,0.12)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <Cpu size={13} style={{ color: "#d4a017" }} />
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.62rem", letterSpacing: "0.15em", color: "rgba(245,241,232,0.7)", textTransform: "uppercase", fontWeight: 700 }}>
              EVALUACIÓN DE ARQUITECTURAS MODERNAS // SEMANA 7
            </span>
          </div>
          <AnimatePresence mode="wait">
            <motion.span key={selectedTech + "-suit"}
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.55rem", color: "#7a9b5c", fontWeight: 700 }}>
              {current.suitability}
            </motion.span>
          </AnimatePresence>
        </motion.div>

        {/* Tarjeta de Detalle — AnimatePresence swap */}
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedTech}
            initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 20, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: shouldReduceMotion ? 0 : -16, scale: 0.97 }}
            transition={{ duration: shouldReduceMotion ? 0.1 : 0.38, ease: [0.16, 1, 0.3, 1] }}
            style={{ background: "#0c0c0c", border: `2px solid ${current.color}55`, padding: "0.9rem", display: "flex", flexDirection: "column", gap: "0.65rem" }}>

            {/* Icon + Name */}
            <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
              <motion.div
                initial={{ scale: 0, rotate: -20 }} animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", stiffness: 400, damping: 20, delay: 0.05 }}
                style={{ width: 36, height: 36, background: `${current.color}22`, border: `1px solid ${current.color}`, display: "flex", alignItems: "center", justifyContent: "center", color: current.color }}>
                <current.icon size={20} />
              </motion.div>
              <div>
                <h3 style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: "0.95rem", color: "#F5F1E8", margin: 0, textTransform: "uppercase" }}>
                  {current.name}
                </h3>
                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.58rem", color: current.color, fontWeight: 700 }}>
                  {current.category}
                </span>
              </div>
            </div>

            <p style={{ fontFamily: "system-ui, sans-serif", fontSize: "0.74rem", color: "rgba(245,241,232,0.85)", lineHeight: 1.4, margin: 0 }}>
              {current.desc}
            </p>

            {/* EBS Block */}
            <motion.div
              initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
              style={{ background: "#121212", border: "1px solid rgba(245,241,232,0.1)", padding: "0.5rem 0.65rem", display: "flex", flexDirection: "column", gap: "0.2rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                <HardDrive size={12} style={{ color: "#d4a017" }} />
                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.58rem", color: "#d4a017", fontWeight: 700 }}>
                  ALMACENAMIENTO DE BLOQUES (AMAZON EBS GP3):
                </span>
              </div>
              <p style={{ fontFamily: "system-ui, sans-serif", fontSize: "0.68rem", color: "rgba(245,241,232,0.75)", margin: 0, lineHeight: 1.3 }}>
                {current.ebsDetail}
              </p>
            </motion.div>

            {/* MTA Case */}
            <motion.div
              initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.18 }}
              style={{ borderLeft: "3px solid #d4a017", background: "rgba(212,160,23,0.06)", padding: "0.45rem 0.65rem" }}>
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.55rem", color: "#d4a017", fontWeight: 700, display: "block", marginBottom: "0.15rem" }}>
                CASO DE APLICACIÓN EN MTA SOFTWARE:
              </span>
              <p style={{ fontFamily: "system-ui, sans-serif", fontSize: "0.68rem", color: "#F5F1E8", margin: 0, lineHeight: 1.35 }}>
                {current.mtaCase}
              </p>
            </motion.div>

            {/* Hostinger Advantage */}
            <motion.div
              initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.26 }}
              style={{ borderLeft: "3px solid #7a9b5c", background: "rgba(122,155,92,0.06)", padding: "0.45rem 0.65rem" }}>
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.55rem", color: "#7a9b5c", fontWeight: 700, display: "block", marginBottom: "0.15rem" }}>
                SUPERACIÓN DE LA LIMITACIÓN ACTUAL:
              </span>
              <p style={{ fontFamily: "system-ui, sans-serif", fontSize: "0.68rem", color: "#F5F1E8", margin: 0, lineHeight: 1.35 }}>
                {current.hostingerAdvantage}
              </p>
            </motion.div>
          </motion.div>
        </AnimatePresence>

        {/* Footer */}
        <motion.div variants={fadeUp(0.45)} initial="hidden" animate={entered ? "visible" : "hidden"}
          style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.55rem", color: "rgba(245,241,232,0.45)", display: "flex", justifyContent: "space-between" }}>
          <span>ENTREGABLE 2 · CAPA DE CÓMPUTO</span>
          <span style={{ color: "#d4a017" }}>SEMANA 7 · SENATI</span>
        </motion.div>
      </div>
    </section>
  );
}

export default S14_Computo;
