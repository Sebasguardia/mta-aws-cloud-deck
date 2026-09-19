// src/components/dynamics/BeforeAfterToggle.jsx
import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeftRight, Check, X, Server, ShieldAlert, Zap, Layers } from "lucide-react";
import { useSharedDeckState } from "../../hooks/useSharedDeckState";
import { Badge } from "../ui/Badge";
import { easings } from "../../lib/easings";

/**
 * Switch Toggle Comparativo CAF "Antes vs Después" (Slide 09).
 * Diseñado con física brutalista táctil, diferenciación cromática inmediata y desglose por perspectivas de Tecnología y Procesos.
 */
export function BeforeAfterToggle({ active = true }) {
  const { cafPerspective, setCafPerspective } = useSharedDeckState();
  const isAfter = cafPerspective === "after";

  return (
    <div className="w-full max-w-4xl mx-auto p-6 md:p-8 bg-paper border-3 border-ink shadow-brutal text-ink relative">
      {/* Marcadores de plano arquitectónico */}
      <span className="absolute -top-1.5 -left-1.5 text-gold font-mono text-xs font-bold pointer-events-none select-none">+</span>
      <span className="absolute -top-1.5 -right-1.5 text-gold font-mono text-xs font-bold pointer-events-none select-none">+</span>
      <span className="absolute -bottom-1.5 -left-1.5 text-gold font-mono text-xs font-bold pointer-events-none select-none">+</span>
      <span className="absolute -bottom-1.5 -right-1.5 text-gold font-mono text-xs font-bold pointer-events-none select-none">+</span>

      {/* Switch Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-5 mb-6 border-b-2 border-ink/20">
        <div>
          <div className="flex items-center gap-2">
            <ArrowLeftRight className="w-4 h-4 text-gold" />
            <span className="font-mono text-[11px] font-bold uppercase tracking-tech text-ink/70">
              FRAMEWORK CAF // EVALUACIÓN DE MADUREZ CLOUD
            </span>
          </div>
          <h3 className="font-display text-xl md:text-2xl uppercase mt-1 tracking-tight">
            Transformación del Ecosistema de MTA Software
          </h3>
        </div>

        {/* Toggle Switch Analógico */}
        <div className="flex items-center bg-ink p-1 border-2 border-ink shadow-[3px_3px_0px_#0A0A0A]">
          <button
            type="button"
            onClick={() => setCafPerspective("before")}
            className={`px-4 py-2 font-display text-xs uppercase tracking-wider transition-colors cursor-pointer ${
              !isAfter
                ? "bg-risk text-white font-bold shadow-inner"
                : "text-paper/60 hover:text-paper"
            }`}
          >
            Antes (Hostinger / Localhost)
          </button>
          <button
            type="button"
            onClick={() => setCafPerspective("after")}
            className={`px-4 py-2 font-display text-xs uppercase tracking-wider transition-colors cursor-pointer ${
              isAfter
                ? "bg-gold text-ink font-bold shadow-inner"
                : "text-paper/60 hover:text-paper"
            }`}
          >
            Después (Ecosistema AWS)
          </button>
        </div>
      </div>

      {/* Contenido Dinámico con AnimatePresence */}
      <AnimatePresence mode="wait">
        {!isAfter ? (
          /* Estado Antes: Grayscale / Fragmentado / Alerta */
          <motion.div
            key="caf-before"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.25, ease: easings.cinematic }}
            className="p-6 bg-black/5 border-2 border-ink"
          >
            <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
              <div className="flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-risk" />
                <Badge variant="risk" size="md">
                  MODELO FRAGMENTADO & ALTO RIESGO OPERATIVO
                </Badge>
              </div>
              <span className="font-mono text-xs text-ink/60 font-bold uppercase tracking-tech">
                ESTADO ACTUAL // DIAGNÓSTICO HOSTINGER
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Tarjeta Perspectiva Tecnológica Antes */}
              <div className="p-5 bg-white border-2 border-ink shadow-[3px_3px_0px_#0A0A0A] flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-mono text-[10px] font-bold text-risk uppercase tracking-tech">
                      01 // ARQUITECTURA FÍSICA
                    </span>
                    <X className="w-4 h-4 text-risk" />
                  </div>
                  <h4 className="font-display text-sm uppercase text-ink mb-1.5 flex items-center gap-2">
                    <Server className="w-4 h-4 text-risk" />
                    <span>Perspectiva de Tecnología</span>
                  </h4>
                  <p className="text-xs text-ink/80 leading-relaxed font-sans">
                    Infraestructura fragmentada en 10 laptops individuales con pruebas aisladas en localhost. Dependencia total de un único host compartido con CPU y memoria RAM fijos.
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-ink/10 font-mono text-[10px] text-risk font-bold">
                  ⚠️ Puntos Únicos de Fallo (SPOF) en ERP y Demos comerciales.
                </div>
              </div>

              {/* Tarjeta Perspectiva de Procesos Antes */}
              <div className="p-5 bg-white border-2 border-ink shadow-[3px_3px_0px_#0A0A0A] flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-mono text-[10px] font-bold text-risk uppercase tracking-tech">
                      02 // GOBIERNO & FLUJOS
                    </span>
                    <X className="w-4 h-4 text-risk" />
                  </div>
                  <h4 className="font-display text-sm uppercase text-ink mb-1.5 flex items-center gap-2">
                    <Layers className="w-4 h-4 text-risk" />
                    <span>Perspectiva de Procesos</span>
                  </h4>
                  <p className="text-xs text-ink/80 leading-relaxed font-sans">
                    Pases manuales a producción por FTP/panel sin validación en Staging. El software "funciona en la laptop del practicante", pero colapsa ante clientes por inconsistencias del host.
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-ink/10 font-mono text-[10px] text-risk font-bold">
                  ⚠️ Despliegues imprevistos y credenciales maestras compartidas.
                </div>
              </div>
            </div>
          </motion.div>
        ) : (
          /* Estado Después: Dorado / AWS Centralizado / Resiliente */
          <motion.div
            key="caf-after"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.25, ease: easings.cinematic }}
            className="p-6 bg-gold/10 border-2 border-gold"
          >
            <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
              <div className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-gold" />
                <Badge variant="safe" size="md">
                  ECOSISTEMA AWS CENTRALIZADO & AUDITABLE
                </Badge>
              </div>
              <span className="font-mono text-xs text-gold font-bold uppercase tracking-tech">
                ESTADO PROPUESTO // MODERNIZACIÓN CLOUD
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Tarjeta Perspectiva Tecnológica Después */}
              <div className="p-5 bg-white border-2 border-ink shadow-[4px_4px_0px_#0A0A0A] flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-mono text-[10px] font-bold text-safe uppercase tracking-tech">
                      01 // ARQUITECTURA CLOUD
                    </span>
                    <Check className="w-4 h-4 text-safe" />
                  </div>
                  <h4 className="font-display text-sm uppercase text-ink mb-1.5 flex items-center gap-2">
                    <Server className="w-4 h-4 text-safe" />
                    <span>Perspectiva de Tecnología</span>
                  </h4>
                  <p className="text-xs text-ink/80 leading-relaxed font-sans">
                    Infraestructura redundante en Amazon VPC. Base de datos del ERP protegida por Security Groups, enrutamiento con Amazon Route 53 y CDN global CloudFront para respuesta instantánea.
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-ink/10 font-mono text-[10px] text-safe font-bold">
                  ✅ Alta disponibilidad y elasticidad automática ante picos de demanda.
                </div>
              </div>

              {/* Tarjeta Perspectiva de Procesos Después */}
              <div className="p-5 bg-white border-2 border-ink shadow-[4px_4px_0px_#0A0A0A] flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-mono text-[10px] font-bold text-safe uppercase tracking-tech">
                      02 // METODOLOGÍA ÁGIL
                    </span>
                    <Check className="w-4 h-4 text-safe" />
                  </div>
                  <h4 className="font-display text-sm uppercase text-ink mb-1.5 flex items-center gap-2">
                    <Layers className="w-4 h-4 text-safe" />
                    <span>Perspectiva de Procesos</span>
                  </h4>
                  <p className="text-xs text-ink/80 leading-relaxed font-sans">
                    Flujo estandarizado para los 10 practicantes con entorno de Staging seguro, pipeline CI/CD automatizado, 10 identidades IAM con privilegios mínimos y alertas tempranas a $10 USD.
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-ink/10 font-mono text-[10px] text-safe font-bold">
                  ✅ Despliegues continuos sin tiempo de inactividad ni fallos sorpresa.
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default BeforeAfterToggle;
