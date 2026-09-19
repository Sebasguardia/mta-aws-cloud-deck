// src/components/dynamics/ClosingEvaluation.jsx
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  HelpCircle,
  Sparkles,
  Award,
  Users,
  CheckCircle2,
  ChevronRight,
  ShieldCheck,
  TrendingDown,
  Layers,
  Zap,
} from "lucide-react";
import { Button } from "../ui/Button";
import { Badge } from "../ui/Badge";
import { projectMeta } from "../../data/team";

/**
 * Componente dinámico interactivo para Slide 14:
 * /industrial-brutalist-ui + /emil-design-eng + /impeccable
 *
 * Permite al jurado / expositor alternar entre:
 * 1. "PUNTOS CLAVE" (Síntesis de logros de la Etapa 01: Hostinger vs AWS, TCO $0 Free Tier, VPC & IAM).
 * 2. "EQUIPO DE INGENIERÍA" (Lista interactiva de los 10 practicantes y sus roles de especialidad).
 * 3. "PREGUNTAS FRECUENTES" (3 preguntas técnicas clave con respuestas inmediatas para el jurado).
 */
export function ClosingEvaluation({ onCelebrate }) {
  const [activeTab, setActiveTab] = useState("summary"); // 'summary' | 'team' | 'faq'
  const [selectedFaq, setSelectedFaq] = useState(0);

  const keyAchievements = [
    {
      icon: TrendingDown,
      title: "Optimización TCO",
      desc: "De $35/mes fijos en Hostinger a $0 en AWS Free Tier con límite de alerta a $10.",
      color: "#6e8e59",
      code: "COST_SAVINGS: 100%",
    },
    {
      icon: ShieldCheck,
      title: "Gobierno Zero Trust",
      desc: "Eliminación de la cuenta Root compartida con 10 usuarios IAM con privilegios mínimos.",
      color: "#d4a017",
      code: "SECURITY: ROOT_LOCKED",
    },
    {
      icon: Layers,
      title: "Topología Segura",
      desc: "Diseño de Amazon VPC con subredes privadas para bases de datos y CDN CloudFront.",
      color: "#e8a0bf",
      code: "ISOLATION: VPC_PRIVATE",
    },
  ];

  const faqs = [
    {
      q: "¿Por qué migrar a AWS si actualmente pagan $35 en Hostinger?",
      a: "Hostinger es un hosting compartido que mezcla bases de datos y aplicaciones de los 3 productos en un único punto de fallo (SPOF). En AWS, con la capa gratuita y el modelo Pay-As-You-Go, MTA operará con costo $0 en tráfico actual, obteniendo aislamiento por VPC y alta disponibilidad.",
    },
    {
      q: "¿Cómo garantizan que 10 practicantes no generen sobrecostos?",
      a: "Implementando AWS Budgets con alertas automatizadas vía SNS al alcanzar $10, limitando credenciales IAM a servicios específicos sin permisos para levantar instancias costosas sin aprobación del líder.",
    },
    {
      q: "¿Cuál es el siguiente paso en la Etapa 02?",
      a: "Aprovisionamiento real de la infraestructura en la consola AWS: creación de VPC con CloudFormation, configuración de Security Groups y despliegue del entorno de staging para Strato Studio.",
    },
  ];

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "0.75rem",
        background: "rgba(18,18,18,0.92)",
        border: "1.5px solid rgba(245,241,232,0.15)",
        boxShadow: "4px 4px 0px #000000",
        padding: "1rem 1.15rem",
      }}
    >
      {/* Selector de pestañas técnico */}
      <div
        style={{
          display: "flex",
          borderBottom: "1px solid rgba(245,241,232,0.12)",
          paddingBottom: "0.5rem",
          gap: "0.4rem",
        }}
      >
        <button
          onClick={() => setActiveTab("summary")}
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: "0.62rem",
            fontWeight: 700,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            padding: "0.3rem 0.65rem",
            border: activeTab === "summary" ? "1px solid #d4a017" : "1px solid transparent",
            background: activeTab === "summary" ? "rgba(212,160,23,0.15)" : "transparent",
            color: activeTab === "summary" ? "#d4a017" : "rgba(245,241,232,0.5)",
            cursor: "pointer",
            transition: "all 0.15s ease",
          }}
        >
          [ SÍNTESIS ETAPA 01 ]
        </button>

        <button
          onClick={() => setActiveTab("team")}
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: "0.62rem",
            fontWeight: 700,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            padding: "0.3rem 0.65rem",
            border: activeTab === "team" ? "1px solid #6e8e59" : "1px solid transparent",
            background: activeTab === "team" ? "rgba(110,142,89,0.15)" : "transparent",
            color: activeTab === "team" ? "#6e8e59" : "rgba(245,241,232,0.5)",
            cursor: "pointer",
            transition: "all 0.15s ease",
          }}
        >
          [ 10 PRACTICANTES ]
        </button>

        <button
          onClick={() => setActiveTab("faq")}
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: "0.62rem",
            fontWeight: 700,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            padding: "0.3rem 0.65rem",
            border: activeTab === "faq" ? "1px solid #e8a0bf" : "1px solid transparent",
            background: activeTab === "faq" ? "rgba(232,160,191,0.15)" : "transparent",
            color: activeTab === "faq" ? "#e8a0bf" : "rgba(245,241,232,0.5)",
            cursor: "pointer",
            transition: "all 0.15s ease",
          }}
        >
          [ FAQ JURADO ]
        </button>
      </div>

      {/* Contenido dinámico */}
      <AnimatePresence mode="wait">
        {activeTab === "summary" && (
          <motion.div
            key="summary"
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.18 }}
            style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}
          >
            {keyAchievements.map((item, idx) => {
              const IconComp = item.icon;
              return (
                <div
                  key={idx}
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: "0.65rem",
                    padding: "0.45rem 0.6rem",
                    background: "rgba(255,255,255,0.02)",
                    border: "1px solid rgba(245,241,232,0.08)",
                  }}
                >
                  <div
                    style={{
                      marginTop: "0.15rem",
                      padding: "0.25rem",
                      background: "rgba(0,0,0,0.4)",
                      border: `1px solid ${item.color}`,
                    }}
                  >
                    <IconComp size={13} style={{ color: item.color }} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span
                        style={{
                          fontFamily: "'Archivo Black', sans-serif",
                          fontSize: "0.72rem",
                          color: "#F5F1E8",
                        }}
                      >
                        {item.title}
                      </span>
                      <span
                        style={{
                          fontFamily: "'JetBrains Mono', monospace",
                          fontSize: "0.55rem",
                          color: item.color,
                          fontWeight: 700,
                        }}
                      >
                        {item.code}
                      </span>
                    </div>
                    <p
                      style={{
                        fontFamily: "system-ui, sans-serif",
                        fontSize: "0.68rem",
                        color: "rgba(245,241,232,0.65)",
                        margin: "0.15rem 0 0 0",
                        lineHeight: 1.35,
                      }}
                    >
                      {item.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </motion.div>
        )}

        {activeTab === "team" && (
          <motion.div
            key="team"
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.18 }}
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "0.35rem",
              maxHeight: "140px",
              overflowY: "auto",
              paddingRight: "0.25rem",
            }}
          >
            {projectMeta.teamMembers.map((m) => (
              <div
                key={m.id}
                style={{
                  padding: "0.35rem 0.5rem",
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(245,241,232,0.08)",
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.1rem",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                  <span
                    style={{
                      fontFamily: "'JetBrains Mono', monospace",
                      fontSize: "0.6rem",
                      fontWeight: 700,
                      color: "#F5F1E8",
                    }}
                  >
                    #{String(m.id).padStart(2, "0")} {m.name}
                  </span>
                  <span
                    style={{
                      fontFamily: "'JetBrains Mono', monospace",
                      fontSize: "0.52rem",
                      color: "#6e8e59",
                    }}
                  >
                    {m.role}
                  </span>
                </div>
                <span
                  style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: "0.52rem",
                    color: "rgba(245,241,232,0.45)",
                  }}
                >
                  IAM: {m.iamRole}
                </span>
              </div>
            ))}
          </motion.div>
        )}

        {activeTab === "faq" && (
          <motion.div
            key="faq"
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.18 }}
            style={{ display: "flex", flexDirection: "column", gap: "0.45rem" }}
          >
            <div style={{ display: "flex", gap: "0.3rem" }}>
              {faqs.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedFaq(i)}
                  style={{
                    flex: 1,
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: "0.58rem",
                    padding: "0.25rem 0",
                    background: selectedFaq === i ? "#e8a0bf" : "rgba(232,160,191,0.1)",
                    color: selectedFaq === i ? "#000000" : "#e8a0bf",
                    border: "1px solid #e8a0bf",
                    fontWeight: 700,
                    cursor: "pointer",
                  }}
                >
                  Q{i + 1}
                </button>
              ))}
            </div>

            <div
              style={{
                padding: "0.5rem 0.65rem",
                background: "rgba(232,160,191,0.05)",
                border: "1px solid rgba(232,160,191,0.3)",
              }}
            >
              <div
                style={{
                  fontFamily: "'Archivo Black', sans-serif",
                  fontSize: "0.68rem",
                  color: "#F5F1E8",
                  marginBottom: "0.25rem",
                }}
              >
                {faqs[selectedFaq].q}
              </div>
              <div
                style={{
                  fontFamily: "system-ui, sans-serif",
                  fontSize: "0.68rem",
                  color: "rgba(245,241,232,0.7)",
                  lineHeight: 1.4,
                }}
              >
                {faqs[selectedFaq].a}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default ClosingEvaluation;
