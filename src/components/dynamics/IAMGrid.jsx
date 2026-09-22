// src/components/dynamics/IAMGrid.jsx
import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Lock, ShieldAlert, ShieldCheck, UserCheck, Key, Shield } from "lucide-react";
import { useSharedDeckState } from "../../hooks/useSharedDeckState";
import { projectMeta } from "../../data/team";
import { Badge } from "../ui/Badge";
import { easings } from "../../lib/easings";

/**
 * Grid de Identidad, Ciberseguridad y Gobierno AWS IAM (Slides 04 y 11).
 * Implementado con morphing visual, estados de riesgo analógicos y cajón de inspección perimetral.
 */
export function IAMGrid() {
  const {
    iamMode,
    setIamMode,
    selectedUserForInspection,
    setSelectedUserForInspection,
  } = useSharedDeckState();

  const isRoot = iamMode === "root";

  return (
    <div className="w-full max-w-4xl mx-auto p-6 bg-[#0E0E0E] text-paper border-3 border-ink shadow-[8px_8px_0px_#0A0A0A] relative overflow-hidden">
      {/* Header con Switch de Control de Acceso */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 mb-6 border-b border-white/15">
        <div>
          <div className="flex items-center gap-2">
            <Key className="w-4 h-4 text-gold" />
            <span className="font-mono text-[11px] font-bold uppercase tracking-tech text-gold">
              POLÍTICA DE PRIVILEGIOS MÍNIMOS // SEGURIDAD EN LA NUBE
            </span>
          </div>
          <h3 className="font-display text-xl uppercase mt-1 tracking-tight text-white">
            {isRoot ? "1 Cuenta Root Compartida (Vulnerabilidad)" : "10 Usuarios IAM Segmentados (Alineado a AWS)"}
          </h3>
        </div>

        {/* Switch táctil analógico */}
        <div className="flex items-center bg-black p-1 border-2 border-white/20">
          <button
            type="button"
            onClick={() => setIamMode("root")}
            className={`px-3.5 py-1.5 font-mono text-xs font-bold uppercase transition-colors cursor-pointer ${
              isRoot ? "bg-risk text-white shadow-[2px_2px_0px_#000000]" : "text-white/50 hover:text-white"
            }`}
          >
            Modo Root Compartido
          </button>
          <button
            type="button"
            onClick={() => setIamMode("iam")}
            className={`px-3.5 py-1.5 font-mono text-xs font-bold uppercase transition-colors cursor-pointer ${
              !isRoot ? "bg-safe text-white shadow-[2px_2px_0px_#000000]" : "text-white/50 hover:text-white"
            }`}
          >
            Modo AWS IAM (10 Usuarios)
          </button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {isRoot ? (
          /* Estado de Riesgo Crítico */
          <motion.div
            key="root-view"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.25, ease: easings.cinematic }}
            className="p-8 bg-[#1B0A0A] border-2 border-risk text-center relative overflow-hidden"
          >
            <div className="max-w-md mx-auto flex flex-col items-center">
              <div className="w-14 h-14 bg-risk text-white border-2 border-black flex items-center justify-center mb-3 shadow-[4px_4px_0px_#000000]">
                <ShieldAlert className="w-7 h-7 animate-pulse" />
              </div>

              <Badge variant="risk" size="md" className="mb-2">
                FALLA CRÍTICA DE GOBIERNO
              </Badge>

              <h4 className="font-display text-base uppercase text-white tracking-wide">
                Contraseña Maestra en Servidor Compartido
              </h4>
              <p className="text-[11px] text-white/70 mt-1.5 leading-relaxed font-sans">
                Tanto los 4 Encargados como los 10 practicantes de MTA Software utilizan las mismas credenciales de acceso global. Cero trazabilidad en caso de borrado accidental de bases de datos.
              </p>

              {/* Stack de avatares superpuestos en riesgo */}
              <div className="flex items-center justify-center -space-x-2.5 my-5">
                {projectMeta.teamMembers.map((member) => (
                  <div
                    key={member.id}
                    className="w-9 h-9 rounded-none bg-black border-2 border-risk flex items-center justify-center text-[10px] font-mono font-bold text-gold shadow-sm"
                  >
                    P{member.id < 10 ? `0${member.id}` : member.id}
                  </div>
                ))}
              </div>

              <div className="w-full bg-black/90 p-2.5 border border-risk/60 font-mono text-[11px] text-risk text-left flex items-center gap-2">
                <Lock className="w-4 h-4 shrink-0 text-risk" />
                <span className="truncate">root@mta-software.com // Clave compartida por canales no auditados</span>
              </div>
            </div>
          </motion.div>
        ) : (
          /* Estado Seguro IAM Segmentado */
          <motion.div
            key="iam-view"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.25, ease: easings.cinematic }}
          >
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5 mb-4">
              {projectMeta.teamMembers.map((member) => {
                const isSelected = selectedUserForInspection?.id === member.id;

                return (
                  <motion.div
                    key={member.id}
                    whileHover={{ y: -2 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => setSelectedUserForInspection(member)}
                    className={`p-3 border-2 cursor-pointer transition-colors flex flex-col justify-between min-h-[115px] select-none ${
                      isSelected
                        ? "bg-gold text-ink border-gold shadow-[3px_3px_0px_#FFFFFF]"
                        : "bg-[#141414] text-paper border-white/15 hover:border-gold/60"
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-mono text-[10px] font-bold text-gold">
                          USER-0{member.id}
                        </span>
                        <ShieldCheck className={`w-3.5 h-3.5 ${isSelected ? "text-ink" : "text-safe"}`} />
                      </div>
                      <h5 className="font-display text-[11px] uppercase line-clamp-1">{member.role}</h5>
                    </div>

                    <div className="mt-2 pt-1.5 border-t border-current/15">
                      <span className="font-mono text-[9px] block truncate opacity-70">
                        {member.iamRole}
                      </span>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Inspeccionador de políticas en tiempo real */}
            <AnimatePresence mode="wait">
              {selectedUserForInspection ? (
                <motion.div
                  key={selectedUserForInspection.id}
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  className="p-4 bg-black border-2 border-gold font-mono text-xs flex flex-wrap items-center justify-between gap-3 shadow-[4px_4px_0px_#000000]"
                >
                  <div>
                    <div className="flex items-center gap-2 text-gold font-bold">
                      <UserCheck className="w-4 h-4" />
                      <span>{selectedUserForInspection.name} // {selectedUserForInspection.role}</span>
                    </div>
                    <p className="text-white/80 text-[11px] mt-1 font-sans">
                      Permiso asignado: <span className="text-safe font-mono font-bold">{selectedUserForInspection.accessLevel}</span>
                    </p>
                  </div>
                  <Badge variant="safe" size="sm" icon={Shield}>
                    PRIVILEGIOS MÍNIMOS OK
                  </Badge>
                </motion.div>
              ) : (
                <div className="p-3 bg-white/5 border border-white/10 text-center font-mono text-[11px] text-white/50">
                  👆 Haz click en cualquiera de los 10 practicantes para auditar su política de permisos IAM individual.
                </div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default IAMGrid;
