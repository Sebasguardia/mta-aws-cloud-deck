// src/slides/S13_DiagramaRed.jsx
import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import {
  Globe,
  Server,
  Database,
  Shield,
  Zap,
  Lock,
  Play,
  RotateCcw,
  ArrowRight,
  Activity,
  Info,
  Radio,
  Network,
} from "lucide-react";
import { slidesContent } from "../data/content.es.js";
import { useSlideActive } from "../hooks/useSlideActive.js";
import { Button } from "../components/ui/Button.jsx";

const c = slidesContent.s13_diagramaRed;

/**
 * S13 — Diagrama de Arquitectura de Red Propuesto (Nivel Conceptual).
 *
 * Mantiene exactamente el mismo estilo, tamaño de fuentes, espaciados y
 * posición de subtítulos que los demás slides (S06 a S12):
 *  - Layout 50%/50% en pantalla completa (slide-fullscreen).
 *  - Header editorial idéntico: Badge, SEC_13, Yellowtail script tag arriba,
 *    H1 en Archivo Black y subtítulo descriptivo en system-ui.
 *  - Columna Izquierda: Editorial, controles de simulación, telemetría y desglose de capas.
 *  - Columna Derecha: Diagrama esquemático interactivo con VPC, subredes, SG, RDS e inspector táctico.
 */
export function S13_DiagramaRed({ isActive: propActive } = {}) {
  const shouldReduceMotion = useReducedMotion();
  const hookActive = useSlideActive(12);
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

  // Estados interactivos
  const [selectedLayer, setSelectedLayer] = useState("all"); // 'all' | 'edge' | 'public' | 'security' | 'private'
  const [activeStep, setActiveStep] = useState(0); // 0 = reposo, 1..7 simulación, 8 = 200 OK
  const [isSimulating, setIsSimulating] = useState(false);
  const [selectedNodeKey, setSelectedNodeKey] = useState("vpc");
  const simulationTimerRef = useRef(null);

  // Nodos arquitectónicos detallados
  const nodesData = {
    client: {
      id: 1,
      key: "client",
      name: "Cliente & Practicante Remoto",
      category: "Origen de Tráfico",
      layer: "edge",
      protocol: "HTTPS / TLS 1.3",
      port: "Puerto 443",
      sla: "Disponibilidad Local",
      cidr: "IP Pública Dinámica",
      icon: Globe,
      color: "#d4a017",
      shortDesc: "Peticiones originadas desde navegadores de clientes o practicantes remotos.",
      impactMTA: "Permite a los 10 practicantes y clientes acceder desde cualquier punto geográfico de forma cifrada.",
      resolvesHostinger: "Descentraliza el tráfico eliminando las saturaciones directas del hosting compartido.",
    },
    route53: {
      id: 2,
      key: "route53",
      name: "Amazon Route 53",
      category: "Enrutamiento DNS Global",
      layer: "edge",
      protocol: "DNS Anycast",
      port: "Puerto 53 UDP/TCP",
      sla: "100% SLA Contractual",
      cidr: "Global Edge Network",
      icon: Radio,
      color: "#e8a0bf",
      shortDesc: "Resolución de dominios corporativos (mta.software, stratostudio.pe, viision.pe).",
      impactMTA: "Proporciona health-checks automáticos con balanceo de latencia para garantizar que los dominios nunca fallen.",
      resolvesHostinger: "Reemplaza el DNS básico y no redundante de Hostinger por infraestructura Anycast global respaldada por SLA del 100%.",
    },
    cloudfront: {
      id: 3,
      key: "cloudfront",
      name: "Amazon CloudFront",
      category: "CDN & Edge Caching",
      layer: "edge",
      protocol: "HTTP/3 & IPv6",
      port: "Edge Caching",
      sla: "99.9% Disponibilidad",
      cidr: "PoPs en Sudamérica",
      icon: Zap,
      color: "#d4a017",
      shortDesc: "Red de distribución de contenidos en el borde con puntos de presencia en Lima y São Paulo.",
      impactMTA: "Almacena en caché el frontend de Next.js, imágenes y catálogos de clientes, respondiendo en 15-30ms.",
      resolvesHostinger: "Descarga más del 80% de las peticiones estáticas que antes colapsaban la RAM y CPU del servidor compartido.",
    },
    igw: {
      id: 4,
      key: "igw",
      name: "Internet Gateway (IGW)",
      category: "Conectividad VPC",
      layer: "public",
      protocol: "VPC Ingress/Egress",
      port: "Bidireccional",
      sla: "Gestionado por AWS",
      cidr: "VPC Perimeter",
      icon: Network,
      color: "#4a5d3a",
      shortDesc: "Puerta de enlace gestionada y altamente disponible que comunica la VPC con Internet.",
      impactMTA: "Permite la entrada de peticiones públicas hacia la Subred Pública y enruta el tráfico saliente sin límite de ancho de banda.",
      resolvesHostinger: "No existe riesgo de cuello de botella por ancho de banda compartido con otros clientes de un hosting genérico.",
    },
    publicSubnet: {
      id: 5,
      key: "publicSubnet",
      name: "Subred Pública (DMZ)",
      category: "Capa Web / Presentación",
      layer: "public",
      protocol: "IPv4 Routing",
      port: "Puertos 80 / 443",
      sla: "Multi-AZ Redundante",
      cidr: "10.0.1.0/24 (AZ-a & AZ-b)",
      icon: Server,
      color: "#7a9b5c",
      shortDesc: "Aloja los servidores web frontend de Next.js y el NAT Gateway de salida segura.",
      impactMTA: "Aísla la capa web de la base de datos. Solo los servidores públicos tienen IP pública elástica.",
      resolvesHostinger: "En Hostinger, frontend, backend y base de datos vivían en la misma carpeta; aquí existe segmentación de red real.",
    },
    natGateway: {
      id: 6,
      key: "natGateway",
      name: "NAT Gateway",
      category: "Egress Seguro",
      layer: "public",
      protocol: "NAT Traversal",
      port: "Salida Segura",
      sla: "Alta Disponibilidad",
      cidr: "10.0.1.50 (Public AZ)",
      icon: ArrowRight,
      color: "#d4a017",
      shortDesc: "Permite a los servidores de la Subred Privada salir a Internet para instalar paquetes sin recibir conexiones externas.",
      impactMTA: "Permite a los 10 practicantes actualizar dependencias de Node.js (npm install) en staging sin abrir la base de datos.",
      resolvesHostinger: "En Hostinger la base de datos compartía IP pública; con NAT Gateway la base de datos permanece 100% privada.",
    },
    securityGroups: {
      id: 7,
      key: "securityGroups",
      name: "Security Groups (Firewalls L4)",
      category: "Seguridad Perimetral",
      layer: "security",
      protocol: "Stateful Firewall",
      port: "TCP 5432 / 3000",
      sla: "Reglas a Nivel de ENI",
      cidr: "Microsegmentación",
      icon: Shield,
      color: "#c6432b",
      shortDesc: "Firewalls virtuales con estado que controlan el tráfico entrante y saliente por puerto e IP/SG origen.",
      impactMTA: "Aplica regla estricta: la base de datos solo acepta tráfico en el puerto 5432 proveniente del SG del backend, bloqueando todo lo demás.",
      resolvesHostinger: "Elimina puertos expuestos a ataques de fuerza bruta en MySQL/PostgreSQL comunes en paneles cPanel de hosting compartido.",
    },
    privateSubnet: {
      id: 8,
      key: "privateSubnet",
      name: "Subred Privada (Aislada)",
      category: "Capa de Datos y Lógica Core",
      layer: "private",
      protocol: "Non-Routable IP",
      port: "Sin Salida Directa",
      sla: "Multi-AZ Blindado",
      cidr: "10.0.2.0/24 (AZ-a & AZ-b)",
      icon: Lock,
      color: "#4a5d3a",
      shortDesc: "Entorno completamente aislado del Internet público donde residen los microservicios core y la BD.",
      impactMTA: "Garantiza que nadie desde el exterior pueda conectarse directamente a los datos empresariales de MTA Software.",
      resolvesHostinger: "Aislamiento criptográfico y de red total, impidiendo fugas de datos de practicantes y clientes.",
    },
    database: {
      id: 9,
      key: "database",
      name: "Amazon RDS (PostgreSQL)",
      category: "Base de Datos Administrada",
      layer: "private",
      protocol: "PostgreSQL 16",
      port: "Puerto 5432 (Privado)",
      sla: "99.95% Multi-AZ SLA",
      cidr: "10.0.2.100 (No Public IP)",
      icon: Database,
      color: "#d4a017",
      shortDesc: "Base de datos del ERP Workspace MTA con replicación síncrona en dos Zonas de Disponibilidad y backups continuos.",
      impactMTA: "Soporta los picos matutinos de marcación de asistencia concurrente y consulta de proyectos con réplicas de lectura.",
      resolvesHostinger: "Hostinger limitaba la base de datos por cuotas de consultas concurrentes; RDS escala automáticamente el storage y cómputo.",
    },
    vpc: {
      id: 0,
      key: "vpc",
      name: "Amazon VPC (10.0.0.0/16)",
      category: "Nube Privada Virtual",
      layer: "all",
      protocol: "Software-Defined Network",
      port: "Red Aislada",
      sla: "Región us-east-1",
      cidr: "10.0.0.0/16 (65,536 IPs)",
      icon: Network,
      color: "#d4a017",
      shortDesc: "Perímetro general de red en la nube aislado de forma lógica de cualquier otro cliente de AWS.",
      impactMTA: "Es el cimiento donde conviven de forma segura Workspace MTA y todos los proyectos comerciales de clientes.",
      resolvesHostinger: "Sustituye el entorno compartido de Hostinger por un datacenter virtual privado gobernado íntegramente por MTA Software.",
    },
  };

  // Simulación paso a paso del paquete de petición
  const simulationFlow = [
    { step: 1, key: "client", latency: "0ms", status: "DISPATCH: HTTPS GET /api/v1/workspace" },
    { step: 2, key: "route53", latency: "+8ms", status: "DNS RESOLVE: mta.software.pe -> Anycast Edge" },
    { step: 3, key: "cloudfront", latency: "+14ms", status: "EDGE CHECK: Dynamic cache miss -> Origin VPC" },
    { step: 4, key: "igw", latency: "+2ms", status: "VPC INGRESS: Entrada por Internet Gateway" },
    { step: 5, key: "publicSubnet", latency: "+3ms", status: "WEB TIER: Nginx / Next.js valida sesión de usuario" },
    { step: 6, key: "securityGroups", latency: "+1ms", status: "FIREWALL L4: Puerto 5432 AUTORIZADO (SG-Database)" },
    { step: 7, key: "database", latency: "+4ms", status: "QUERY OK: SELECT * FROM asistencia WHERE id=p_04" },
  ];

  const handleStartSimulation = () => {
    if (isSimulating) return;
    setIsSimulating(true);
    setActiveStep(1);
    setSelectedNodeKey(simulationFlow[0].key);

    let current = 1;
    simulationTimerRef.current = setInterval(() => {
      current += 1;
      if (current <= simulationFlow.length) {
        setActiveStep(current);
        setSelectedNodeKey(simulationFlow[current - 1].key);
      } else {
        clearInterval(simulationTimerRef.current);
        setActiveStep(8); // Simulación completada 200 OK
        setIsSimulating(false);
      }
    }, 750);
  };

  const handleResetSimulation = () => {
    if (simulationTimerRef.current) clearInterval(simulationTimerRef.current);
    setIsSimulating(false);
    setActiveStep(0);
    setSelectedNodeKey("vpc");
  };

  useEffect(() => {
    if (!isActive) {
      if (simulationTimerRef.current) clearInterval(simulationTimerRef.current);
      return;
    }
    const t = setTimeout(() => setEntered(true), 40);
    return () => {
      clearTimeout(t);
      setEntered(false);
    };
  }, [isActive]);

  const selectedNode = nodesData[selectedNodeKey] || nodesData.vpc;

  const fadeUp = (delay = 0) => ({
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 16 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: shouldReduceMotion ? 0.1 : 0.5, ease: [0.16, 1, 0.3, 1], delay },
    },
  });

  // 4 Pilares de la Capa de Red
  const networkLayersList = [
    {
      id: "edge",
      title: "Perímetro Edge & DNS",
      subtitle: "Route 53 + CloudFront CDN + IGW",
      metric: "100% SLA / <30ms",
      desc: "Distribución en el borde con puntos de presencia en Sudamérica que cachea el frontend y resuelve nombres al instante.",
      color: "#d4a017",
      nodeRef: "cloudfront",
    },
    {
      id: "public",
      title: "Subred Pública (DMZ)",
      subtitle: "10.0.1.0/24 · AZ-a & AZ-b",
      metric: "Frontend Next.js + NAT",
      desc: "Aloja la capa de presentación accesible desde internet. Dispone de NAT Gateway para permitir salida segura sin exponer IPs.",
      color: "#7a9b5c",
      nodeRef: "publicSubnet",
    },
    {
      id: "security",
      title: "Seguridad Perimetral L4",
      subtitle: "Security Groups con Estado",
      metric: "Firewall Filtrado TCP 5432",
      desc: "Reglas a nivel de interfaz de red que bloquean cualquier acceso externo, permitiendo solo tráfico del backend a la base de datos.",
      color: "#c6432b",
      nodeRef: "securityGroups",
    },
    {
      id: "private",
      title: "Subred Privada (Aislada)",
      subtitle: "10.0.2.0/24 · Sin IP Pública",
      metric: "PostgreSQL Multi-AZ",
      desc: "Capa de persistencia 100% inaccesible desde internet donde reside la base de datos crítica del ERP Workspace MTA.",
      color: "#4a5d3a",
      nodeRef: "database",
    },
  ];

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
      {/* ── Retícula de fondo sutil (Idéntica a S06 a S12) ── */}
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

      {/* ── Resplandor perimetral de seguridad dorado ── */}
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
          COLUMNA IZQUIERDA (50%): Jerarquía Editorial & Capas de Red
          (Mismo tamaño, espaciados y posición que S06, S08, S10, S11, S12)
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
        {/* Header Editorial Idéntico */}
        <div style={{ display: "flex", flexDirection: "column", gap: "0.2rem" }}>
          {/* Badge + Código de Sección + Región */}
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
              SEC_13 // NETWORK_ARCHITECTURE_DIAGRAM
            </span>
            <span
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: "0.58rem",
                color: "#7a9b5c",
                background: "rgba(122,155,92,0.15)",
                border: "1px solid rgba(122,155,92,0.35)",
                padding: "0.15rem 0.45rem",
                fontWeight: 700,
              }}
            >
              REGION: US-EAST-1 (MULTI-AZ)
            </span>
          </motion.div>

          {/* Tagline Cursivo en Yellowtail (Arriba del H1, igual que los demás slides) */}
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

          {/* Título Principal en Archivo Black */}
          <motion.h1
            variants={fadeUp(0.12)}
            initial="hidden"
            animate={entered ? "visible" : "hidden"}
            style={{
              fontFamily: "'Archivo Black', 'Arial Black', sans-serif",
              fontSize: "clamp(1.6rem, 2.3vw, 2.2rem)",
              color: "#F5F1E8",
              letterSpacing: "-0.025em",
              lineHeight: 1.05,
              textTransform: "uppercase",
              margin: 0,
            }}
          >
            {c.title}
          </motion.h1>

          {/* Subtítulo en system-ui (Posición y estilo estándar) */}
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

        {/* Barra de Control Táctil: Simulación de Petición HTTP & Filtros */}
        <motion.div
          variants={fadeUp(0.20)}
          initial="hidden"
          animate={entered ? "visible" : "hidden"}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "0.45rem 0.65rem",
            background: "rgba(18,18,18,0.9)",
            border: "1.5px solid rgba(245,241,232,0.15)",
            boxShadow: "4px 4px 0px #000000",
            gap: "0.6rem",
          }}
        >
          {/* Botón de Simulación de Paquete */}
          {activeStep >= 8 ? (
            <Button
              variant="outline"
              size="sm"
              icon={RotateCcw}
              onClick={handleResetSimulation}
              className="!border-gold !text-gold hover:!bg-gold/10 !py-1 !text-[0.68rem]"
            >
              Reiniciar Simulación
            </Button>
          ) : (
            <Button
              variant="primary"
              size="sm"
              icon={Play}
              onClick={handleStartSimulation}
              disabled={isSimulating}
              className="!py-1 !text-[0.68rem]"
            >
              {isSimulating ? "Trazando Paquete..." : "▶ Simular Petición HTTP"}
            </Button>
          )}

          {/* Filtros de Capa Tácticos */}
          <div style={{ display: "flex", gap: "3px" }}>
            {[
              { id: "all", label: "TODOS" },
              { id: "edge", label: "EDGE" },
              { id: "public", label: "PÚBLICA" },
              { id: "security", label: "FIREWALL" },
              { id: "private", label: "PRIVADA (DB)" },
            ].map((f) => (
              <button
                key={f.id}
                type="button"
                onClick={() => setSelectedLayer(f.id)}
                style={{
                  background: selectedLayer === f.id ? "#d4a017" : "transparent",
                  color: selectedLayer === f.id ? "#0A0A0A" : "rgba(245,241,232,0.7)",
                  border: selectedLayer === f.id ? "1px solid #d4a017" : "1px solid rgba(245,241,232,0.15)",
                  padding: "0.22rem 0.45rem",
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: "0.58rem",
                  fontWeight: 700,
                  cursor: "pointer",
                  transition: "all 0.15s ease",
                }}
              >
                {f.label}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Consola de Telemetría en Tiempo Real */}
        <motion.div
          variants={fadeUp(0.24)}
          initial="hidden"
          animate={entered ? "visible" : "hidden"}
          style={{
            padding: "0.45rem 0.75rem",
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
                  En espera. Presiona "▶ Simular Petición HTTP" o haz click en los nodos.
                </motion.span>
              )}

              {activeStep > 0 && activeStep <= simulationFlow.length && (
                <motion.span
                  key={`step-${activeStep}`}
                  initial={{ opacity: 0, x: 4 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -4 }}
                  style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.62rem", color: "#F5F1E8" }}
                >
                  <span style={{ color: "#d4a017", fontWeight: 800 }}>[{simulationFlow[activeStep - 1].latency}]</span> {simulationFlow[activeStep - 1].status}
                </motion.span>
              )}

              {activeStep > simulationFlow.length && (
                <motion.span
                  key="completed"
                  initial={{ opacity: 0, y: 3 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.62rem", color: "#7a9b5c", fontWeight: 800 }}
                >
                  ✅ 200 OK — CloudFront Cache + Amazon VPC Multi-AZ + RDS PostgreSQL (28ms)
                </motion.span>
              )}
            </AnimatePresence>
          </div>

          {activeStep > simulationFlow.length && (
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.55rem", color: "#7a9b5c", fontWeight: 800 }}>
              LATENCIA: 28ms
            </span>
          )}
        </motion.div>

        {/* Las 4 Capas Arquitectónicas (Grid 2x2 interactivo) */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.65rem" }}>
          {networkLayersList.map((layer, idx) => {
            const isHighlighted = selectedLayer === "all" || selectedLayer === layer.id;
            return (
              <motion.div
                key={layer.id}
                variants={fadeUp(0.28 + idx * 0.04)}
                initial="hidden"
                animate={entered ? "visible" : "hidden"}
                onClick={() => {
                  setSelectedLayer(layer.id);
                  setSelectedNodeKey(layer.nodeRef);
                }}
                style={{
                  padding: "0.65rem 0.85rem",
                  background: isHighlighted ? "rgba(255,255,255,0.03)" : "rgba(255,255,255,0.01)",
                  border: "1px solid rgba(245,241,232,0.12)",
                  borderLeft: `3px solid ${layer.color}`,
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.2rem",
                  cursor: "pointer",
                  opacity: isHighlighted ? 1 : 0.4,
                  transition: "all 0.2s ease",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <h4
                    style={{
                      fontFamily: "'Archivo Black', sans-serif",
                      fontSize: "0.74rem",
                      color: "#F5F1E8",
                      textTransform: "uppercase",
                      margin: 0,
                    }}
                  >
                    {layer.title}
                  </h4>
                  <span
                    style={{
                      fontFamily: "'JetBrains Mono', monospace",
                      fontSize: "0.55rem",
                      color: layer.color,
                      fontWeight: 700,
                    }}
                  >
                    {layer.metric}
                  </span>
                </div>

                <div
                  style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: "0.58rem",
                    color: "rgba(245,241,232,0.5)",
                  }}
                >
                  {layer.subtitle}
                </div>

                <p
                  style={{
                    fontFamily: "system-ui, -apple-system, sans-serif",
                    fontSize: "0.68rem",
                    color: "rgba(245,241,232,0.7)",
                    margin: "0.2rem 0 0 0",
                    lineHeight: 1.3,
                  }}
                >
                  {layer.desc}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════
          COLUMNA DERECHA (50%): Diagrama Esquemático Interactivo
          & Inspector Táctico de Componentes de Red
      ══════════════════════════════════════════════════════════ */}
      <div
        style={{
          flex: "0 0 50%",
          position: "relative",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "2.5rem 4rem 2.5rem 1rem",
          zIndex: 2,
          gap: "0.75rem",
          overflow: "hidden",
        }}
      >
        {/* Cabecera Técnica Flotante Superior */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "0.3rem 0.6rem",
            background: "#101010",
            border: "1px solid rgba(245,241,232,0.12)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <Server size={13} style={{ color: "#d4a017" }} />
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
              AWS NETWORK TOPOLOGY // VPC & SUBREDES CONCEPTUAL
            </span>
          </div>

          <span
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: "0.55rem",
              color: "#7a9b5c",
              fontWeight: 700,
            }}
          >
            SLA: 99.99% MULTI-AZ
          </span>
        </div>

        {/* Contenedor Esquemático de la Red */}
        <div
          style={{
            background: "#0c0c0c",
            border: "2px solid rgba(245,241,232,0.12)",
            padding: "0.75rem",
            display: "flex",
            flexDirection: "column",
            gap: "0.55rem",
            position: "relative",
          }}
        >
          {/* 1. Capa Perimetral Externa: Cliente -> Route 53 -> CloudFront -> IGW */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1.3fr 1.3fr 1fr",
              gap: "0.45rem",
              opacity: selectedLayer === "all" || selectedLayer === "edge" ? 1 : 0.35,
              transition: "opacity 0.2s ease",
            }}
          >
            <MiniNode
              node={nodesData.client}
              isActive={activeStep === 1}
              isSelected={selectedNodeKey === "client"}
              onClick={() => setSelectedNodeKey("client")}
            />
            <MiniNode
              node={nodesData.route53}
              isActive={activeStep === 2}
              isSelected={selectedNodeKey === "route53"}
              onClick={() => setSelectedNodeKey("route53")}
            />
            <MiniNode
              node={nodesData.cloudfront}
              isActive={activeStep === 3}
              isSelected={selectedNodeKey === "cloudfront"}
              onClick={() => setSelectedNodeKey("cloudfront")}
            />
            <MiniNode
              node={nodesData.igw}
              isActive={activeStep === 4}
              isSelected={selectedNodeKey === "igw"}
              onClick={() => setSelectedNodeKey("igw")}
            />
          </div>

          {/* Línea de entrada a VPC */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "0.4rem",
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: "0.55rem",
              color: "rgba(245,241,232,0.4)",
            }}
          >
            <div style={{ height: "1px", flex: 1, background: "rgba(245,241,232,0.12)" }} />
            <span style={{ display: "flex", alignItems: "center", gap: "0.25rem", color: "#d4a017" }}>
              <Lock size={10} /> ENTRADA PRIVADA A AMAZON VPC (10.0.0.0/16)
            </span>
            <div style={{ height: "1px", flex: 1, background: "rgba(245,241,232,0.12)" }} />
          </div>

          {/* 2. Amazon VPC con Subred Pública y Subred Privada */}
          <div
            style={{
              border: "1.5px solid #d4a017",
              background: "rgba(212,160,23,0.02)",
              padding: "0.6rem",
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "0.6rem",
              position: "relative",
            }}
          >
            {/* Tag VPC */}
            <div
              style={{
                position: "absolute",
                top: "-9px",
                left: "10px",
                background: "#0c0c0c",
                padding: "0 0.4rem",
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: "0.55rem",
                fontWeight: 700,
                color: "#d4a017",
                border: "1px solid #d4a017",
                cursor: "pointer",
              }}
              onClick={() => setSelectedNodeKey("vpc")}
            >
              AMAZON VPC // 10.0.0.0/16
            </div>

            {/* Subred Pública (10.0.1.0/24) */}
            <div
              style={{
                border: "1px solid #7a9b5c",
                background: "rgba(122,155,92,0.04)",
                padding: "0.5rem",
                display: "flex",
                flexDirection: "column",
                gap: "0.4rem",
                opacity: selectedLayer === "all" || selectedLayer === "public" ? 1 : 0.3,
                transition: "opacity 0.2s ease",
              }}
            >
              <div
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: "0.55rem",
                  fontWeight: 700,
                  color: "#7a9b5c",
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
                <span>SUBRED PÚBLICA (10.0.1.0/24)</span>
                <span style={{ color: "rgba(245,241,232,0.4)" }}>DMZ</span>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.35rem" }}>
                <MiniNode
                  node={nodesData.publicSubnet}
                  isActive={activeStep === 5}
                  isSelected={selectedNodeKey === "publicSubnet"}
                  onClick={() => setSelectedNodeKey("publicSubnet")}
                />
                <MiniNode
                  node={nodesData.natGateway}
                  isActive={false}
                  isSelected={selectedNodeKey === "natGateway"}
                  onClick={() => setSelectedNodeKey("natGateway")}
                />
              </div>

              <div
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: "0.5rem",
                  color: "rgba(245,241,232,0.4)",
                  borderTop: "1px dashed rgba(122,155,92,0.25)",
                  paddingTop: "0.2rem",
                }}
              >
                Route: 0.0.0.0/0 → igw-xxxx
              </div>
            </div>

            {/* Subred Privada (10.0.2.0/24) con Security Group */}
            <div
              style={{
                border: "1px solid #c6432b",
                background: "rgba(198,67,43,0.04)",
                padding: "0.5rem",
                display: "flex",
                flexDirection: "column",
                gap: "0.4rem",
                opacity: selectedLayer === "all" || selectedLayer === "private" || selectedLayer === "security" ? 1 : 0.3,
                transition: "opacity 0.2s ease",
              }}
            >
              <div
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: "0.55rem",
                  fontWeight: 700,
                  color: "#c6432b",
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
                <span>SUBRED PRIVADA (10.0.2.0/24)</span>
                <span>SIN IP PÚBLICA</span>
              </div>

              {/* Security Group Firewall */}
              <div
                onClick={() => setSelectedNodeKey("securityGroups")}
                style={{
                  background: activeStep === 6 ? "rgba(212,160,23,0.2)" : "rgba(198,67,43,0.12)",
                  border: activeStep === 6 ? "1px solid #d4a017" : "1px solid rgba(198,67,43,0.35)",
                  padding: "0.25rem 0.4rem",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  cursor: "pointer",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "0.3rem" }}>
                  <Shield size={11} style={{ color: "#c6432b" }} />
                  <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.52rem", color: "#F5F1E8", fontWeight: 700 }}>
                    SG-DATABASE: TCP 5432
                  </span>
                </div>
                {activeStep === 6 ? (
                  <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.5rem", color: "#7a9b5c", fontWeight: 700 }}>
                    OK ✓
                  </span>
                ) : (
                  <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.48rem", color: "rgba(245,241,232,0.4)" }}>
                    INSPECT
                  </span>
                )}
              </div>

              {/* RDS Database */}
              <MiniNode
                node={nodesData.database}
                isActive={activeStep === 7}
                isSelected={selectedNodeKey === "database"}
                onClick={() => setSelectedNodeKey("database")}
              />

              <div
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: "0.5rem",
                  color: "rgba(245,241,232,0.4)",
                  borderTop: "1px dashed rgba(198,67,43,0.25)",
                  paddingTop: "0.2rem",
                }}
              >
                PostgreSQL Multi-AZ // Respaldo continuo
              </div>
            </div>
          </div>
        </div>

        {/* Panel Inspector Táctico de Nodos (Actualizado por click) */}
        <div
          style={{
            background: "#101010",
            border: "1px solid rgba(212,160,23,0.35)",
            padding: "0.75rem 0.9rem",
            display: "flex",
            flexDirection: "column",
            gap: "0.4rem",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
              <Info size={12} style={{ color: "#d4a017" }} />
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.62rem", color: "#d4a017", fontWeight: 700 }}>
                INSPECTOR DE NODO: {selectedNode.name.toUpperCase()}
              </span>
            </div>
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.55rem", color: "rgba(245,241,232,0.5)" }}>
              {selectedNode.port} // {selectedNode.sla}
            </span>
          </div>

          <p
            style={{
              fontFamily: "system-ui, -apple-system, sans-serif",
              fontSize: "0.72rem",
              color: "rgba(245,241,232,0.85)",
              lineHeight: 1.35,
              margin: 0,
            }}
          >
            {selectedNode.shortDesc}
          </p>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "0.5rem",
              background: "#080808",
              padding: "0.4rem 0.6rem",
              border: "1px solid rgba(245,241,232,0.08)",
            }}
          >
            <div>
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.52rem", color: "#d4a017", fontWeight: 700, display: "block" }}>
                IMPACTO EN MTA SOFTWARE:
              </span>
              <p style={{ fontFamily: "system-ui, -apple-system, sans-serif", fontSize: "0.65rem", color: "rgba(245,241,232,0.75)", margin: 0, lineHeight: 1.25 }}>
                {selectedNode.impactMTA}
              </p>
            </div>
            <div>
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.52rem", color: "#7a9b5c", fontWeight: 700, display: "block" }}>
                REEMPLAZO A HOSTINGER:
              </span>
              <p style={{ fontFamily: "system-ui, -apple-system, sans-serif", fontSize: "0.65rem", color: "rgba(245,241,232,0.75)", margin: 0, lineHeight: 1.25 }}>
                {selectedNode.resolvesHostinger}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/**
 * Tarjeta compacta para nodos del diagrama.
 */
function MiniNode({ node, isActive, isSelected, onClick }) {
  const Icon = node.icon;
  return (
    <div
      onClick={onClick}
      style={{
        background: isActive
          ? "rgba(122,155,92,0.25)"
          : isSelected
          ? "rgba(212,160,23,0.18)"
          : "#141414",
        border: isActive
          ? "1.5px solid #7a9b5c"
          : isSelected
          ? "1.5px solid #d4a017"
          : "1px solid rgba(245,241,232,0.12)",
        padding: "0.35rem 0.45rem",
        display: "flex",
        alignItems: "center",
        gap: "0.35rem",
        cursor: "pointer",
        position: "relative",
        transition: "all 0.15s ease",
      }}
    >
      <div
        style={{
          width: 20,
          height: 20,
          background: isSelected ? "#d4a017" : "rgba(245,241,232,0.08)",
          color: isSelected ? "#0A0A0A" : node.color || "#F5F1E8",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        <Icon size={12} />
      </div>

      <div style={{ minWidth: 0, flex: 1 }}>
        <div
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: "0.52rem",
            fontWeight: 700,
            color: isSelected ? "#d4a017" : "#F5F1E8",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {node.name}
        </div>
        <div
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: "0.46rem",
            color: "rgba(245,241,232,0.45)",
          }}
        >
          {node.port}
        </div>
      </div>

      {isActive && (
        <span
          style={{
            width: 6,
            height: 6,
            borderRadius: "50%",
            background: "#7a9b5c",
            boxShadow: "0 0 6px #7a9b5c",
            flexShrink: 0,
          }}
        />
      )}
    </div>
  );
}

export default S13_DiagramaRed;
