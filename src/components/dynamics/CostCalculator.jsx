// src/components/dynamics/CostCalculator.jsx
import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { DollarSign, AlertTriangle, TrendingUp, ShieldCheck, Check } from "lucide-react";
import { useSharedDeckState } from "../../hooks/useSharedDeckState";
import { CountUp } from "../motion/CountUp";
import { Badge } from "../ui/Badge";
import { easings } from "../../lib/easings";

/**
 * Calculadora Interactiva de Costos y Alertas de AWS Budgets (Slide 10).
 * Diseñada con cuadrícula de alta precisión, sliders de instrumentación y alerta modal emergente.
 */
export function CostCalculator({ active = true }) {
  const { simulatedUsers, setSimulatedUsers, budgetLimit } = useSharedDeckState();

  const hostingerFixedCost = 35.0;

  // Primeros 1,000 usuarios cubiertos al 100% por AWS Free Tier
  const awsEstimatedCost =
    simulatedUsers <= 1000
      ? 0.0
      : parseFloat(((simulatedUsers - 1000) * 0.0068).toFixed(2));

  const isBudgetAlert = awsEstimatedCost >= budgetLimit;

  return (
    <div className="w-full max-w-4xl mx-auto p-6 bg-paper border-3 border-ink shadow-brutal text-ink relative">
      {/* Marcadores de plano arquitectónico */}
      <span className="absolute -top-1.5 -left-1.5 text-gold font-mono text-xs font-bold pointer-events-none">+</span>
      <span className="absolute -bottom-1.5 -right-1.5 text-gold font-mono text-xs font-bold pointer-events-none">+</span>

      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 mb-6 border-b-2 border-ink/20">
        <div>
          <div className="flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-gold" />
            <span className="font-mono text-[11px] font-bold uppercase tracking-tech text-ink/70">
              AUDITORÍA DE COSTOS // MODELO TCO & CAPA GRATUITA
            </span>
          </div>
          <h3 className="font-display text-xl uppercase mt-1 tracking-tight">
            Costo Fijo Anual vs Pago por Uso (Pay-As-You-Go)
          </h3>
        </div>

        <Badge variant={isBudgetAlert ? "risk" : "safe"} size="md" pulse={isBudgetAlert}>
          {isBudgetAlert ? "⚠️ UMBRAL $10 EXCEDIDO" : "PRESUPUESTO BAJO CONTROL"}
        </Badge>
      </div>

      {/* Control Slider de Instrumentación */}
      <div className="mb-6 p-4 bg-ink/5 border-2 border-ink">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
          <label htmlFor="traffic-slider" className="font-display text-xs md:text-sm uppercase flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-gold" />
            <span>Simulador de Usuarios Concurrentes (Peticiones ERP / Mes):</span>
          </label>
          <div className="font-mono text-base font-extrabold text-gold bg-ink px-3 py-1 border border-ink">
            {simulatedUsers.toLocaleString()}{" "}
            <span className="text-[10px] text-paper/70 font-normal uppercase">usuarios</span>
          </div>
        </div>

        <input
          id="traffic-slider"
          type="range"
          min="200"
          max="5000"
          step="100"
          value={simulatedUsers}
          onChange={(e) => setSimulatedUsers(Number(e.target.value))}
          className="w-full h-3 bg-ink/20 accent-gold cursor-pointer"
        />

        <div className="flex justify-between font-mono text-[10px] text-ink/60 mt-2">
          <span>200 (Pruebas iniciales)</span>
          <span className="text-safe font-bold">▲ 1,000 (Límite Free Tier: $0.00)</span>
          <span>5,000 (Carga máxima)</span>
        </div>
      </div>

      {/* Comparativa Visual en Fichas Técnicas */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
        {/* Opción A: Hostinger Fijo */}
        <div className="p-5 border-2 border-ink bg-white shadow-[4px_4px_0px_#0A0A0A] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="font-mono text-[10px] font-bold uppercase tracking-tech text-ink/60">
                HOSTINGER COMPARTIDO
              </span>
              <Badge variant="mono" size="sm">INVARIABLE</Badge>
            </div>
            <h4 className="font-display text-sm uppercase">Plan Empresarial Fijo</h4>
            <p className="text-[11px] text-ink/70 mt-1 leading-relaxed">
              Monto fijo debitado cada mes. Si los practicantes están inactivos, pagas exactamente lo mismo por recursos ociosos.
            </p>
          </div>

          <div className="mt-5 pt-3 border-t border-ink/10 flex items-baseline justify-between">
            <span className="font-mono text-[11px] text-ink/60 uppercase">Costo Mensual Fijo:</span>
            <div className="font-mono text-2xl font-extrabold text-ink tabular-nums">
              ${hostingerFixedCost.toFixed(2)}{" "}
              <span className="text-xs font-normal text-ink/60">USD</span>
            </div>
          </div>
        </div>

        {/* Opción B: AWS Pay-As-You-Go */}
        <div
          className={`p-5 border-2 border-ink transition-colors shadow-[4px_4px_0px_#0A0A0A] flex flex-col justify-between ${
            isBudgetAlert ? "bg-risk/10 border-risk" : "bg-gold/10 border-gold"
          }`}
        >
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="font-mono text-[10px] font-bold uppercase tracking-tech text-gold">
                AWS FOUNDATIONS
              </span>
              {awsEstimatedCost === 0 ? (
                <Badge variant="safe" size="sm" icon={Check}>FREE TIER ($0)</Badge>
              ) : (
                <Badge variant={isBudgetAlert ? "risk" : "gold"} size="sm">PAY-AS-YOU-GO</Badge>
              )}
            </div>
            <h4 className="font-display text-sm uppercase">Infraestructura Elástica</h4>
            <p className="text-[11px] text-ink/70 mt-1 leading-relaxed">
              Solo pagas por CPU, tráfico y almacenamiento consumido por peticiones reales. Primeros 1,000 usuarios sin coste.
            </p>
          </div>

          <div className="mt-5 pt-3 border-t border-ink/10 flex items-baseline justify-between">
            <span className="font-mono text-[11px] text-ink/60 uppercase">Costo Calculado:</span>
            <div className="font-mono text-2xl font-extrabold text-ink tracking-tight flex items-baseline gap-1">
              <span>$</span>
              <CountUp value={awsEstimatedCost} active={active} className="text-2xl font-extrabold" />
              <span className="text-xs font-normal text-ink/60">USD</span>
            </div>
          </div>
        </div>
      </div>

      {/* Alerta de AWS Budgets */}
      <AnimatePresence>
        {isBudgetAlert ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.2, ease: easings.snappy }}
            className="p-4 bg-risk text-white border-2 border-ink shadow-brutal-sm flex flex-wrap items-center justify-between gap-4"
          >
            <div className="flex items-center gap-3">
              <AlertTriangle className="w-6 h-6 text-gold animate-bounce shrink-0" />
              <div>
                <h5 className="font-display text-xs md:text-sm uppercase tracking-wider">
                  ⚠️ NOTIFICACIÓN DISPARADA POR AWS BUDGETS
                </h5>
                <p className="text-[11px] opacity-90 mt-0.5 font-sans">
                  El gasto proyectado superó el umbral configurado de ${budgetLimit}.00 USD. Se emite aviso preventivo al equipo de liderazgo.
                </p>
              </div>
            </div>
            <div className="font-mono text-xs text-gold bg-black px-3 py-1 border border-gold font-bold">
              SNS EMAIL ENVIADO
            </div>
          </motion.div>
        ) : (
          <div className="p-3 bg-safe/10 border border-safe/40 text-safe font-mono text-[11px] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 shrink-0" />
              <span>AWS Budgets en monitoreo continuo (Alerta calibrada en $10.00 USD).</span>
            </div>
            <span className="font-bold">STATUS: OK</span>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default CostCalculator;
