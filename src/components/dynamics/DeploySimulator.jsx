// src/components/dynamics/DeploySimulator.jsx
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, CheckCircle, AlertOctagon, Terminal, RefreshCcw, GitBranch, CloudUpload } from "lucide-react";
import { Button } from "../ui/Button";
import { Badge } from "../ui/Badge";
import { easings } from "../../lib/easings";

/**
 * Simulador de Flujo de Trabajo y Despliegue (Slides 07 y 12).
 * Modos:
 *  - "before" (Slide 07): Flujo manual local en localhost terminado en error en producción.
 *  - "after" (Slide 12): Pipeline CI/CD automatizado en AWS terminado en verde.
 */
export function DeploySimulator({ mode = "before" }) {
  const isBefore = mode === "before";
  const [isRunning, setIsRunning] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [isDone, setIsDone] = useState(false);

  const beforeSteps = [
    { name: "Git Clone & Branch", detail: "Dev trabaja en su laptop personal (localhost:3000)", code: "git checkout -b fix/auth" },
    { name: "Testing Local", detail: "Pruebas en Windows sin staging idéntico a producción", code: "npm run test:local" },
    { name: "Push a GitHub", detail: "Sube a main sin pipeline de verificación en la nube", code: "git push origin main" },
    { name: "Despliegue Manual FTP", detail: "Subida directa por panel sustituyendo archivos PHP/Node", code: "ftp upload dist/*" },
  ];

  const afterSteps = [
    { name: "Git Push Feature", detail: "Dev envía cambios protegidos con pull request", code: "git push origin feat/auth" },
    { name: "GitHub Actions CI", detail: "Tests y análisis estático en contenedor Docker seguro", code: "npm run test:ci" },
    { name: "AWS Staging Deploy", detail: "Despliegue automático en entorno aislado de prueba", code: "aws codepipeline run" },
    { name: "CloudFront & VPC Prod", detail: "Despliegue sin caída con invalidación de CDN", code: "cloudfront invalidate" },
  ];

  const steps = isBefore ? beforeSteps : afterSteps;

  const handleRun = () => {
    setIsRunning(true);
    setCurrentStep(1);
    setIsDone(false);

    let stepTimer = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev < steps.length) {
          return prev + 1;
        } else {
          clearInterval(stepTimer);
          setIsRunning(false);
          setIsDone(true);
          return prev;
        }
      });
    }, 850);
  };

  const handleReset = () => {
    setIsRunning(false);
    setCurrentStep(0);
    setIsDone(false);
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-6 bg-[#0B0B0B] text-paper border-3 border-ink shadow-[8px_8px_0px_#0A0A0A]">
      {/* Header del simulador */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 mb-6 border-b border-white/15">
        <div>
          <div className="flex items-center gap-2">
            <Terminal className="w-4 h-4 text-gold" />
            <span className="font-mono text-[11px] font-bold uppercase tracking-tech text-gold">
              {isBefore ? "PIPELINE LEGACY // PASO MANUAL" : "PIPELINE CLOUD // AWS CI/CD"}
            </span>
          </div>
          <h4 className="font-display text-lg uppercase mt-1 text-white tracking-wide">
            {isBefore ? "Flujo de Despliegue Actual (Manual)" : "Flujo de Despliegue Propuesto (AWS)"}
          </h4>
        </div>

        <div>
          {isDone ? (
            <Button variant="outline" size="sm" icon={RefreshCcw} onClick={handleReset} className="!text-paper !border-paper">
              Reiniciar Simulación
            </Button>
          ) : (
            <Button
              variant={isBefore ? "risk" : "safe"}
              size="sm"
              icon={isBefore ? GitBranch : CloudUpload}
              onClick={handleRun}
              disabled={isRunning}
            >
              {isRunning ? "Compilando..." : isBefore ? "Simular Despliegue Actual" : "Ejecutar Pipeline AWS"}
            </Button>
          )}
        </div>
      </div>

      {/* Stepper horizontal con estilo terminal de ingeniería */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        {steps.map((step, idx) => {
          const stepNum = idx + 1;
          const isPassed = currentStep > stepNum || (isDone && currentStep === stepNum);
          const isCurrent = currentStep === stepNum && isRunning;

          return (
            <motion.div
              key={step.name}
              animate={{
                scale: isCurrent ? 1.02 : 1,
                borderColor: isCurrent ? "var(--gold)" : isPassed ? "var(--safe)" : "rgba(255,255,255,0.15)",
              }}
              transition={{ duration: 0.18, ease: easings.snappy }}
              className={`p-3.5 border-2 relative flex flex-col justify-between min-h-[140px] transition-colors ${
                isCurrent
                  ? "bg-gold/10 border-gold shadow-[3px_3px_0px_#D4A017]"
                  : isPassed
                  ? isBefore && idx === steps.length - 1 && isDone
                    ? "bg-risk/20 border-risk shadow-[3px_3px_0px_#C6432B]"
                    : "bg-white/5 border-safe"
                  : "bg-white/5 opacity-50"
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-mono text-[10px] font-bold tracking-tech text-gold">
                    0{stepNum} //
                  </span>
                  {isPassed ? (
                    isBefore && idx === steps.length - 1 && isDone ? (
                      <AlertOctagon className="w-4 h-4 text-risk" />
                    ) : (
                      <CheckCircle className="w-4 h-4 text-safe" />
                    )
                  ) : (
                    <span className="w-1.5 h-1.5 rounded-full bg-white/30" />
                  )}
                </div>

                <h5 className="font-display text-xs uppercase text-white">{step.name}</h5>
              </div>

              <div>
                <div className="bg-black/60 px-2 py-1 border border-white/10 font-mono text-[9px] text-gold/80 mb-2 truncate">
                  $ {step.code}
                </div>
                <p className="font-mono text-[10px] text-white/70 leading-tight">
                  {step.detail}
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Terminal Output Log con fuente fija y retroalimentación auditable */}
      <div className="bg-black p-4 border border-white/20 font-mono text-xs relative overflow-hidden min-h-[85px] flex items-center">
        <AnimatePresence mode="wait">
          {!isRunning && !isDone && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-white/40">
              $ Ready. Presiona el botón para auditar el ciclo de vida del código...
            </motion.div>
          )}

          {isRunning && (
            <motion.div key="running" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-gold flex items-center gap-2">
              <span className="w-2 h-2 rounded-none bg-gold animate-ping" />
              <span>[ETAPA {currentStep}/4] Ejecutando: {steps[currentStep - 1]?.code}</span>
            </motion.div>
          )}

          {isDone && isBefore && (
            <motion.div
              key="error-done"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-risk font-bold flex items-center gap-3 w-full justify-between"
            >
              <div className="flex items-center gap-2.5">
                <AlertOctagon className="w-5 h-5 shrink-0" />
                <span className="text-xs">
                  ❌ ERROR 500 EN PRODUCCIÓN: "Funciona en mi máquina, pero el host de Hostinger no tiene las dependencias ni la segmentación adecuada"
                </span>
              </div>
              <Badge variant="risk" size="sm">FALLO</Badge>
            </motion.div>
          )}

          {isDone && !isBefore && (
            <motion.div
              key="success-done"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-safe font-bold flex items-center gap-3 w-full justify-between"
            >
              <div className="flex items-center gap-2.5">
                <CheckCircle className="w-5 h-5 shrink-0" />
                <span className="text-xs">
                  ✅ DESPLIEGUE EXITOSO: "Pase a Staging validado en VPC de pruebas. Despliegue en producción completado con 0 tiempo de inactividad"
                </span>
              </div>
              <Badge variant="safe" size="sm">RESILIENTE</Badge>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default DeploySimulator;
