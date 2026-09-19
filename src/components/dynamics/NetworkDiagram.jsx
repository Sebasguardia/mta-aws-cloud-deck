// src/components/dynamics/NetworkDiagram.jsx
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Play,
  RotateCcw,
  Shield,
  Globe,
  Server,
  Database,
  CheckCircle2,
  Zap,
  Activity,
  Lock,
  ArrowRight,
} from "lucide-react";
import { awsServices } from "../../data/awsServices";
import { Button } from "../ui/Button";
import { Badge } from "../ui/Badge";
import { Tooltip } from "../ui/Tooltip";
import { easings } from "../../lib/easings";

/**
 * Diagrama de Arquitectura de Red Propuesto (Slide 12 Hero Slide).
 * Simula el recorrido de un paquete HTTP/HTTPS en tiempo real a través del perímetro AWS:
 * Usuario -> CloudFront (CDN Edge) -> Route 53 (DNS) -> Amazon VPC (Red Aislada) -> Security Groups (Firewall L4) -> ERP Database (Subred Privada).
 */
export function NetworkDiagram({ active = true }) {
  const [activeStep, setActiveStep] = useState(0); // 0 = Reposo, 1..6 = Enrutando por nodo, 7 = 200 OK
  const [isSimulating, setIsSimulating] = useState(false);
  const [activeTelemetry, setActiveTelemetry] = useState(null);

  const nodes = [
    {
      id: 1,
      key: "user",
      name: "Cliente / Browser",
      protocol: "HTTPS :443",
      icon: Globe,
      type: "Origen",
      latency: "0ms",
      detail: "Petición originada desde navegador web de un practicante o cliente.",
      statusText: "DISPATCHED",
    },
    {
      id: 2,
      key: "cloudfront",
      name: awsServices.cloudfront.name,
      protocol: "Edge Location",
      icon: Zap,
      type: "CDN Cache",
      latency: "+14ms",
      detail: awsServices.cloudfront.description,
      statusText: "EDGE HIT",
    },
    {
      id: 3,
      key: "route53",
      name: awsServices.route53.name,
      protocol: "DNS Latency Routing",
      icon: Globe,
      type: "DNS Global",
      latency: "+8ms",
      detail: awsServices.route53.description,
      statusText: "RESOLVED",
    },
    {
      id: 4,
      key: "vpc",
      name: awsServices.vpc.name,
      protocol: "10.0.0.0/16 CIDR",
      icon: Server,
      type: "Red Aislada",
      latency: "+3ms",
      detail: awsServices.vpc.description,
      statusText: "INSPECTION",
    },
    {
      id: 5,
      key: "securityGroups",
      name: awsServices.securityGroups.name,
      protocol: "Stateful Firewall",
      icon: Shield,
      type: "Seguridad L4",
      latency: "+1ms",
      detail: awsServices.securityGroups.description,
      statusText: "PORT ALLOWED",
    },
    {
      id: 6,
      key: "database",
      name: "ERP Database",
      protocol: "RDS Private Subnet",
      icon: Database,
      type: "Subred Privada",
      latency: "+4ms",
      detail: "Base de Datos de Workspace MTA totalmente aislada del internet público.",
      statusText: "QUERY 200 OK",
    },
  ];

  const handleSimulateRequest = () => {
    if (isSimulating) return;
    setIsSimulating(true);
    setActiveStep(1);
    setActiveTelemetry(nodes[0]);

    let current = 1;
    const timer = setInterval(() => {
      current += 1;
      if (current <= nodes.length) {
        setActiveStep(current);
        setActiveTelemetry(nodes[current - 1]);
      } else {
        clearInterval(timer);
        setActiveStep(nodes.length + 1); // Estado completado
        setIsSimulating(false);
      }
    }, 850);
  };

  const handleReset = () => {
    setIsSimulating(false);
    setActiveStep(0);
    setActiveTelemetry(null);
  };

  const totalCalculatedLatency = "30ms";

  return (
    <div className="w-full max-w-5xl mx-auto p-6 md:p-8 bg-[#0B0B0B] text-paper border-3 border-ink shadow-[8px_8px_0px_#0A0A0A] relative overflow-hidden">
      {/* Fondo técnico de cuadrícula tenue */}
      <div
        className="absolute inset-0 opacity-10 pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(#d4a017 1px, transparent 1px), linear-gradient(90deg, #d4a017 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }}
      />

      {/* Crosshairs de esquina brutalistas */}
      <span className="absolute top-2 left-2 font-mono text-[10px] text-gold/40 select-none">＋</span>
      <span className="absolute top-2 right-2 font-mono text-[10px] text-gold/40 select-none">＋</span>
      <span className="absolute bottom-2 left-2 font-mono text-[10px] text-gold/40 select-none">＋</span>
      <span className="absolute bottom-2 right-2 font-mono text-[10px] text-gold/40 select-none">＋</span>

      {/* Header Superior */}
      <div className="relative z-10 flex flex-wrap items-center justify-between gap-4 pb-5 mb-6 border-b border-white/15">
        <div>
          <div className="flex items-center gap-2">
            <span
              className={`w-2 h-2 rounded-full ${
                isSimulating ? "bg-gold animate-ping" : activeStep > nodes.length ? "bg-safe" : "bg-white/40"
              }`}
            />
            <span className="font-mono text-[11px] font-bold uppercase tracking-tech text-gold">
              ARQUITECTURA HERO // FLUJO RESILIENTE DE PETICIÓN
            </span>
          </div>
          <h3 className="font-display text-xl md:text-2xl uppercase mt-1 text-white tracking-wide">
            Recorrido Perimetral de Seguridad y Enrutamiento AWS
          </h3>
        </div>

        <div className="flex items-center gap-3">
          {activeStep > nodes.length ? (
            <Button
              variant="outline"
              size="sm"
              icon={RotateCcw}
              onClick={handleReset}
              className="!border-white/40 !text-white hover:!bg-white/10"
            >
              Reiniciar Simulación
            </Button>
          ) : (
            <Button
              variant="gold"
              size="sm"
              icon={Play}
              onClick={handleSimulateRequest}
              disabled={isSimulating}
            >
              {isSimulating ? "Trazando Paquete HTTP..." : "▶ Simular Petición"}
            </Button>
          )}
        </div>
      </div>

      {/* Grid Interactivo de 6 Nodos Arquitectónicos con Flowlines */}
      <div className="relative z-10 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-6">
        {nodes.map((node, index) => {
          const NodeIcon = node.icon;
          const isNodeActive = activeStep === node.id;
          const isNodePassed = activeStep > node.id;
          const isTarget = isNodeActive || isNodePassed;

          return (
            <Tooltip
              key={node.key}
              title={node.name}
              content={`${node.protocol} — ${node.detail}`}
              position="top"
            >
              <motion.div
                animate={{
                  scale: isNodeActive ? 1.04 : 1,
                  borderColor: isNodeActive
                    ? "var(--gold)"
                    : isNodePassed
                    ? "var(--safe)"
                    : "rgba(255,255,255,0.15)",
                  backgroundColor: isNodeActive
                    ? "rgba(212,160,23,0.15)"
                    : isNodePassed
                    ? "rgba(122,155,92,0.1)"
                    : "#141414",
                }}
                transition={{ duration: 0.2, ease: easings.snappy }}
                className={`p-3.5 border-2 flex flex-col justify-between items-center text-center min-h-[160px] relative transition-shadow ${
                  isNodeActive
                    ? "shadow-[0_0_18px_rgba(212,160,23,0.35)]"
                    : isNodePassed
                    ? "shadow-[3px_3px_0px_#0A0A0A]"
                    : "opacity-80"
                }`}
              >
                {/* Header de la ficha */}
                <div className="w-full flex items-center justify-between font-mono text-[10px]">
                  <span className="font-bold text-gold">0{node.id} //</span>
                  {isNodePassed ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-safe" />
                  ) : isNodeActive ? (
                    <span className="w-2 h-2 rounded-full bg-gold animate-ping" />
                  ) : (
                    <span className="text-white/30">{node.latency}</span>
                  )}
                </div>

                {/* Icono y Título */}
                <div className="my-2 flex flex-col items-center">
                  <div
                    className={`w-10 h-10 border flex items-center justify-center mb-1.5 transition-colors ${
                      isNodeActive
                        ? "bg-gold text-ink border-black"
                        : isNodePassed
                        ? "bg-safe/20 text-safe border-safe"
                        : "bg-white/5 text-white/70 border-white/15"
                    }`}
                  >
                    <NodeIcon className="w-5 h-5" />
                  </div>
                  <h5 className="font-display text-xs uppercase text-white line-clamp-1 leading-tight">
                    {node.name}
                  </h5>
                  <span className="font-mono text-[9px] text-white/50 block truncate max-w-[110px] mt-0.5">
                    {node.protocol}
                  </span>
                </div>

                {/* Badge de Estado Operativo */}
                <Badge
                  variant={isNodeActive ? "gold" : isNodePassed ? "safe" : "mono"}
                  size="sm"
                >
                  {isNodeActive ? "INSPECTION" : isNodePassed ? "VERIFIED" : "IDLE"}
                </Badge>

                {/* Indicador de flecha para conectar nodos en desktop */}
                {index < nodes.length - 1 && (
                  <div className="hidden lg:block absolute -right-2.5 top-1/2 -translate-y-1/2 z-20 pointer-events-none">
                    <ArrowRight
                      className={`w-3.5 h-3.5 transition-colors ${
                        isNodePassed ? "text-safe" : "text-white/20"
                      }`}
                    />
                  </div>
                )}
              </motion.div>
            </Tooltip>
          );
        })}
      </div>

      {/* Consola de Telemetría Perimetral */}
      <div className="relative z-10 p-4 bg-black border-2 border-white/20 font-mono text-xs text-paper flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2.5">
          <Activity className="w-4 h-4 text-gold shrink-0" />
          <span className="text-gold font-bold">$ AWS ROUTE TELEMETRY:</span>

          <AnimatePresence mode="wait">
            {activeStep === 0 && (
              <motion.span
                key="idle"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-white/60"
              >
                Petición en espera. Presiona "Simular Petición" para iniciar el recorrido de seguridad.
              </motion.span>
            )}

            {activeStep > 0 && activeStep <= nodes.length && activeTelemetry && (
              <motion.span
                key={`step-${activeStep}`}
                initial={{ opacity: 0, x: 4 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -4 }}
                className="text-white flex items-center gap-2"
              >
                <span className="text-gold font-bold">[{activeTelemetry.statusText}]</span>
                <span>
                  {activeTelemetry.name} ({activeTelemetry.protocol}) — {activeTelemetry.detail}
                </span>
              </motion.span>
            )}

            {activeStep > nodes.length && (
              <motion.span
                key="completed"
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="text-safe font-bold"
              >
                ✅ RESPUESTA 200 OK — CloudFront CDN Cache Hit | Amazon VPC Firewall Aprobado | Latencia total: {totalCalculatedLatency}
              </motion.span>
            )}
          </AnimatePresence>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {activeStep > nodes.length && (
            <Badge variant="safe" size="sm">
              LATENCIA: {totalCalculatedLatency}
            </Badge>
          )}
          <span className="font-mono text-[10px] text-white/40 uppercase">
            {activeStep > nodes.length ? "TRAZADO AUDITABLE OK" : "MODO DIAGNÓSTICO"}
          </span>
        </div>
      </div>
    </div>
  );
}

export default NetworkDiagram;
