// src/components/dynamics/OutageSimulator.jsx
import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, Server, RefreshCw, CheckCircle2, XCircle, Activity } from "lucide-react";
import { useSharedDeckState } from "../../hooks/useSharedDeckState";
import { Button } from "../ui/Button";
import { Badge } from "../ui/Badge";
import { easings } from "../../lib/easings";

/**
 * Simulador de Caída de Servidor Único en Hostinger (Slide 08).
 * Diseñado con física de materiales industriales, sacudida analógica, efecto dominó y telemetría en tiempo real.
 */
export function OutageSimulator({ active = true }) {
  const {
    isServerDown,
    outageSeconds,
    triggerServerCrash,
    restoreServer,
    incrementOutageSeconds,
  } = useSharedDeckState();

  useEffect(() => {
    let interval = null;
    if (isServerDown && active) {
      interval = setInterval(() => {
        incrementOutageSeconds();
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isServerDown, active, incrementOutageSeconds]);

  const formatTime = (totalSec) => {
    const mins = Math.floor(totalSec / 60).toString().padStart(2, "0");
    const secs = (totalSec % 60).toString().padStart(2, "0");
    return `${mins}:${secs}`;
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-6 bg-[#0E0E0E] text-paper border-3 border-ink shadow-[8px_8px_0px_#0A0A0A] relative overflow-hidden">
      {/* Luz de advertencia ambiental cuando el sistema colapsa */}
      <AnimatePresence>
        {isServerDown && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: [0.15, 0.45, 0.15] }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            className="absolute inset-0 bg-risk/20 pointer-events-none z-0"
          />
        )}
      </AnimatePresence>

      {/* Encabezado con medidor de telemetría */}
      <div className="relative z-10 flex flex-wrap items-center justify-between gap-4 pb-4 mb-6 border-b border-white/15">
        <div>
          <div className="flex items-center gap-2">
            <span
              className={`w-2 h-2 rounded-full transition-colors ${
                isServerDown ? "bg-risk animate-ping" : "bg-safe"
              }`}
            />
            <span className="font-mono text-[11px] font-bold uppercase tracking-tech text-gold">
              TEST DE RESILIENCIA EN VIVO // SPOF AUDIT
            </span>
          </div>
          <h3 className="font-display text-xl uppercase mt-1 tracking-tight text-white">
            Punto Único de Fallo: Servidor Compartido
          </h3>
        </div>

        <div className="flex items-center gap-3">
          {isServerDown ? (
            <Button
              variant="safe"
              size="sm"
              icon={RefreshCw}
              onClick={restoreServer}
              className="animate-pulse"
            >
              Restaurar Servidor
            </Button>
          ) : (
            <Button
              variant="risk"
              size="sm"
              icon={AlertTriangle}
              onClick={triggerServerCrash}
            >
              Simular Caída de Servidor
            </Button>
          )}
        </div>
      </div>

      {/* Grid de Hardware: Servidor Hostinger y Sistemas Dependientes */}
      <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Nodo Crítico: Servidor Único Hostinger */}
        <motion.div
          animate={
            isServerDown
              ? {
                  x: [-3, 3, -3, 3, 0],
                  borderColor: "var(--risk)",
                  backgroundColor: "#200A0A",
                }
              : {
                  x: 0,
                  borderColor: "rgba(212,160,23,0.4)",
                  backgroundColor: "#151515",
                }
          }
          transition={{ duration: 0.25, ease: easings.snappy }}
          className="p-5 border-2 relative flex flex-col justify-between min-h-[220px] shadow-[4px_4px_0px_#000000]"
        >
          {/* Marcadores de chasis industrial */}
          <span className="w-1.5 h-1.5 bg-current opacity-30 absolute top-1.5 left-1.5" />
          <span className="w-1.5 h-1.5 bg-current opacity-30 absolute top-1.5 right-1.5" />

          <div>
            <div className="flex items-center justify-between mb-3">
              <Badge variant={isServerDown ? "risk" : "safe"} size="sm" pulse={!isServerDown}>
                {isServerDown ? "503 SERVICE DOWN" : "100% CARGA CPU"}
              </Badge>
              <Server className={`w-5 h-5 ${isServerDown ? "text-risk" : "text-gold"}`} />
            </div>

            <h4 className="font-display text-base uppercase text-white tracking-wide">
              Hostinger Business
            </h4>
            <p className="font-mono text-[11px] text-white/60 mt-0.5">CPU/RAM Compartidos</p>

            <div className="mt-3 space-y-1.5 font-mono text-[11px] bg-black/50 p-2.5 border border-white/10">
              <div className="flex justify-between">
                <span className="text-white/50">ESTADO CPU:</span>
                <span className={isServerDown ? "text-risk font-bold" : "text-gold"}>
                  {isServerDown ? "SOBRECARGADO" : "89% ACTIVO"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/50">MEMORIA RAM:</span>
                <span className={isServerDown ? "text-risk font-bold" : "text-white"}>
                  {isServerDown ? "OUT OF MEMORY" : "1.8 / 2.0 GB"}
                </span>
              </div>
            </div>
          </div>

          <div className="mt-3 text-[10px] font-mono text-center uppercase tracking-wider text-white/40">
            {isServerDown ? "CONEXIÓN PERDIDA" : "UN SOLO HOST FÍSICO"}
          </div>
        </motion.div>

        {/* Nodos dependientes afectados en cascada */}
        <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Dependencia 1: ERP Workspace MTA */}
          <motion.div
            animate={{
              opacity: isServerDown ? 0.7 : 1,
              scale: isServerDown ? 0.98 : 1,
              borderColor: isServerDown ? "var(--risk)" : "rgba(255,255,255,0.2)",
            }}
            transition={{ duration: 0.2, ease: easings.snappy }}
            className={`p-4 border-2 flex flex-col justify-between ${
              isServerDown ? "bg-[#180808]" : "bg-[#161616]"
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="font-mono text-[10px] uppercase font-bold tracking-tech text-white/50">
                  SISTEMA INTERNO PROPIO
                </span>
                <Badge variant={isServerDown ? "risk" : "safe"} size="sm">
                  {isServerDown ? "INACCESIBLE" : "OPERATIVO"}
                </Badge>
              </div>

              <h5 className="font-display text-sm uppercase text-white">
                Workspace MTA (ERP)
              </h5>
              <p className="text-[11px] text-white/70 mt-1 leading-relaxed">
                Control de asistencia, notas de los 10 practicantes y estadísticas de proyectos.
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-white/10 flex items-center gap-2 font-mono text-[11px]">
              {isServerDown ? (
                <>
                  <XCircle className="w-4 h-4 text-risk shrink-0" />
                  <span className="text-risk font-bold">Registro de horas congelado</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4 text-safe shrink-0" />
                  <span className="text-white/80">Sincronizando 10 practicantes</span>
                </>
              )}
            </div>
          </motion.div>

          {/* Dependencia 2: Demos de Clientes B2B */}
          <motion.div
            animate={{
              opacity: isServerDown ? 0.7 : 1,
              scale: isServerDown ? 0.98 : 1,
              borderColor: isServerDown ? "var(--risk)" : "rgba(255,255,255,0.2)",
            }}
            transition={{ duration: 0.2, ease: easings.snappy }}
            className={`p-4 border-2 flex flex-col justify-between ${
              isServerDown ? "bg-[#180808]" : "bg-[#161616]"
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="font-mono text-[10px] uppercase font-bold tracking-tech text-white/50">
                  SOFTWARE COMERCIAL
                </span>
                <Badge variant={isServerDown ? "risk" : "safe"} size="sm">
                  {isServerDown ? "INACCESIBLE" : "OPERATIVO"}
                </Badge>
              </div>

              <h5 className="font-display text-sm uppercase text-white">
                Strato Studio & VIISION
              </h5>
              <p className="text-[11px] text-white/70 mt-1 leading-relaxed">
                Landing pages y demos comerciales activas para prospectos y clientes de MTA.
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-white/10 flex items-center gap-2 font-mono text-[11px]">
              {isServerDown ? (
                <>
                  <XCircle className="w-4 h-4 text-risk shrink-0" />
                  <span className="text-risk font-bold">Pérdida de credibilidad B2B</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4 text-safe shrink-0" />
                  <span className="text-white/80">Demos disponibles en línea</span>
                </>
              )}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Banner de Impacto Operativo con cronómetro militar */}
      <AnimatePresence>
        {isServerDown && (
          <motion.div
            initial={{ opacity: 0, height: 0, marginTop: 0 }}
            animate={{ opacity: 1, height: "auto", marginTop: 20 }}
            exit={{ opacity: 0, height: 0, marginTop: 0 }}
            transition={{ duration: 0.25, ease: easings.cinematic }}
            className="relative z-10 p-4 bg-risk text-white border-2 border-ink shadow-[4px_4px_0px_#0A0A0A] overflow-hidden"
          >
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <Activity className="w-6 h-6 text-gold animate-bounce shrink-0" />
                <div>
                  <h5 className="font-display text-xs md:text-sm uppercase tracking-wider">
                    PARÁLISIS OPERATIVA EN CURSO
                  </h5>
                  <p className="text-[11px] opacity-90 font-sans mt-0.5">
                    Un fallo de hardware en el único host ha bloqueado tanto la operativa interna como las ventas.
                  </p>
                </div>
              </div>

              <div className="bg-ink text-gold px-4 py-2 border border-gold font-mono text-center shadow-inner">
                <div className="text-[9px] text-white/70 uppercase font-bold tracking-tech">
                  TIEMPO DE INDISPONIBILIDAD
                </div>
                <div
                  className="text-xl font-extrabold tracking-widest tabular-nums"
                  style={{ fontFeatureSettings: "'tnum' 1, 'zero' 1" }}
                >
                  {formatTime(outageSeconds)}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default OutageSimulator;
