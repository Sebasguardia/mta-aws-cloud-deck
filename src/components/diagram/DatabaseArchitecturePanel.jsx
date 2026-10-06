// src/components/diagram/DatabaseArchitecturePanel.jsx
import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Database,
  Table2,
  ShieldCheck,
  Zap,
  Activity,
  Play,
  RotateCcw,
  CheckCircle2,
  Sparkles,
} from "lucide-react";

export function DatabaseArchitecturePanel({
  selectedEngine = "rds",
  setSelectedEngine,
}) {
  const [isFailoverSim, setIsFailoverSim] = useState(false);
  const [activePrimary, setActivePrimary] = useState("AZ-A");

  const triggerFailover = () => {
    setIsFailoverSim(true);
    setTimeout(() => {
      setActivePrimary((prev) => (prev === "AZ-A" ? "AZ-B" : "AZ-A"));
      setIsFailoverSim(false);
    }, 1200);
  };

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        gap: "1.0rem",
        background: "rgba(12,12,14,0.92)",
        backdropFilter: "blur(16px)",
        border: "1px solid rgba(245,241,232,0.12)",
        padding: "1.25rem",
        boxSizing: "border-box",
        overflowY: "auto",
      }}
    >
      {/* Top HUD Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          paddingBottom: "0.75rem",
          borderBottom: "1px solid rgba(245,241,232,0.1)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
          <Database size={18} color="#d4a017" />
          <span
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: "0.82rem",
              color: "#F5F1E8",
              fontWeight: 700,
              letterSpacing: "0.05em",
            }}
          >
            PERSISTENCIA ADMINISTRADA Y RESILIENCIA MULTI-AZ
          </span>
        </div>

        <button
          type="button"
          onClick={triggerFailover}
          disabled={isFailoverSim}
          style={{
            background: isFailoverSim ? "rgba(245,241,232,0.1)" : "rgba(212,160,23,0.2)",
            color: "#d4a017",
            border: "1px solid #d4a017",
            padding: "0.3rem 0.75rem",
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: "0.70rem",
            fontWeight: 700,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "0.4rem",
          }}
        >
          <RotateCcw size={12} />
          <span>{isFailoverSim ? "CONMUTANDO..." : "SIMULAR FAILOVER MULTI-AZ"}</span>
        </button>
      </div>

      {/* SVG Topology & Replication Diagram */}
      <div
        style={{
          padding: "1rem",
          background: "rgba(8,8,10,0.8)",
          border: "1px solid rgba(212,160,23,0.2)",
          borderRadius: "4px",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.75rem" }}>
          <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.72rem", color: "#d4a017", fontWeight: 700 }}>
            TOPOLOGÍA MULTI-AZ DE BASE DE DATOS (REPLICACIÓN SÍNCRONA):
          </span>
          <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.68rem", color: "#7a9b5c", fontWeight: 700 }}>
            NODO PRIMARIO ACTIVO: {activePrimary}
          </span>
        </div>

        <svg viewBox="0 0 680 110" style={{ width: "100%", height: "auto" }}>
          {/* AZ-A Primary Node */}
          <rect
            x="20"
            y="15"
            width="280"
            height="80"
            rx="4"
            fill="#141418"
            stroke={activePrimary === "AZ-A" ? "#7a9b5c" : "rgba(245,241,232,0.2)"}
            strokeWidth={activePrimary === "AZ-A" ? "2" : "1"}
          />
          <text x="160" y="42" textAnchor="middle" fill="#F5F1E8" fontSize="10" fontFamily="JetBrains Mono" fontWeight="bold">US-EAST-1A (PRIMARY DB)</text>
          <text x="160" y="58" textAnchor="middle" fill="#7a9b5c" fontSize="8" fontFamily="JetBrains Mono">Amazon RDS PostgreSQL / Aurora</text>
          <text x="160" y="74" textAnchor="middle" fill={activePrimary === "AZ-A" ? "#7a9b5c" : "rgba(245,241,232,0.5)"} fontSize="8" fontFamily="JetBrains Mono" fontWeight="bold">
            {activePrimary === "AZ-A" ? "● LECTURA / ESCRITURA ACTIVA" : "○ STANDBY PASIVO"}
          </text>

          {/* Synchronous Replication Line */}
          <line x1="300" y1="55" x2="380" y2="55" stroke="#d4a017" strokeWidth="2" strokeDasharray="4 4" />

          {/* AZ-B Standby Node */}
          <rect
            x="380"
            y="15"
            width="280"
            height="80"
            rx="4"
            fill="#141418"
            stroke={activePrimary === "AZ-B" ? "#7a9b5c" : "rgba(245,241,232,0.2)"}
            strokeWidth={activePrimary === "AZ-B" ? "2" : "1"}
          />
          <text x="520" y="42" textAnchor="middle" fill="#F5F1E8" fontSize="10" fontFamily="JetBrains Mono" fontWeight="bold">US-EAST-1B (STANDBY REPLICA)</text>
          <text x="520" y="58" textAnchor="middle" fill="#d4a017" fontSize="8" fontFamily="JetBrains Mono">Replicación síncrona automática</text>
          <text x="520" y="74" textAnchor="middle" fill={activePrimary === "AZ-B" ? "#7a9b5c" : "rgba(245,241,232,0.5)"} fontSize="8" fontFamily="JetBrains Mono" fontWeight="bold">
            {activePrimary === "AZ-B" ? "● LECTURA / ESCRITURA ACTIVA" : "○ STANDBY PASIVO"}
          </text>
        </svg>
      </div>

      {/* RTO / RPO Resiliency Metrics Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
        <div
          style={{
            padding: "0.75rem",
            background: "rgba(15,15,18,0.8)",
            border: "1px solid rgba(245,241,232,0.1)",
            display: "flex",
            flexDirection: "column",
            gap: "0.3rem",
          }}
        >
          <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.68rem", color: "#d4a017", fontWeight: 700 }}>
            RTO (RECOVERY TIME OBJECTIVE)
          </span>
          <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "1.0rem", color: "#F5F1E8", fontWeight: 700 }}>
            &lt; 30 SEGUNDOS
          </span>
          <p style={{ fontFamily: "Inter, sans-serif", fontSize: "0.74rem", color: "rgba(245,241,232,0.8)", margin: 0 }}>
            Conmutación por error automática sin intervención humana si la zona us-east-1a sufre una falla eléctrica o de red.
          </p>
        </div>

        <div
          style={{
            padding: "0.75rem",
            background: "rgba(15,15,18,0.8)",
            border: "1px solid rgba(245,241,232,0.1)",
            display: "flex",
            flexDirection: "column",
            gap: "0.3rem",
          }}
        >
          <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.68rem", color: "#7a9b5c", fontWeight: 700 }}>
            RPO (RECOVERY POINT OBJECTIVE)
          </span>
          <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "1.0rem", color: "#7a9b5c", fontWeight: 700 }}>
            0 SEGUNDOS (CERO PÉRDIDA)
          </span>
          <p style={{ fontFamily: "Inter, sans-serif", fontSize: "0.74rem", color: "rgba(245,241,232,0.8)", margin: 0 }}>
            Replicación de transacciones en tiempo real entre subredes privadas. Ningún comprobante ni usuario se pierde durante la falla.
          </p>
        </div>
      </div>

      {/* SQL vs NoSQL Comparison Table */}
      <div
        style={{
          padding: "0.75rem",
          background: "rgba(8,8,10,0.8)",
          border: "1px solid rgba(245,241,232,0.12)",
        }}
      >
        <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.72rem", color: "#d4a017", fontWeight: 700, display: "block", marginBottom: "0.4rem" }}>
          MATRIZ DE ELECCIÓN DE MOTOR DE BASE DE DATOS:
        </span>

        <table style={{ width: "100%", borderCollapse: "collapse", fontFamily: "'JetBrains Mono', monospace", fontSize: "0.68rem" }}>
          <thead>
            <tr style={{ borderBottom: "1px solid rgba(245,241,232,0.15)", color: "rgba(245,241,232,0.5)" }}>
              <th style={{ textAlign: "left", padding: "0.3rem" }}>REQUERIMIENTO MTA</th>
              <th style={{ textAlign: "left", padding: "0.3rem", color: "#7a9b5c" }}>RDS POSTGRESQL</th>
              <th style={{ textAlign: "left", padding: "0.3rem", color: "#d4a017" }}>AURORA</th>
              <th style={{ textAlign: "left", padding: "0.3rem", color: "#e8a0bf" }}>DYNAMODB</th>
            </tr>
          </thead>
          <tbody>
            <tr style={{ borderBottom: "1px solid rgba(245,241,232,0.06)" }}>
              <td style={{ padding: "0.35rem", color: "#F5F1E8" }}>Transacciones ACID</td>
              <td style={{ padding: "0.35rem", color: "#7a9b5c" }}>Nativo (Estricto)</td>
              <td style={{ padding: "0.35rem", color: "#7a9b5c" }}>Nativo (Estricto)</td>
              <td style={{ padding: "0.35rem", color: "#e8a0bf" }}>Eventual (Opt-in)</td>
            </tr>
            <tr style={{ borderBottom: "1px solid rgba(245,241,232,0.06)" }}>
              <td style={{ padding: "0.35rem", color: "#F5F1E8" }}>Relaciones Complejas</td>
              <td style={{ padding: "0.35rem", color: "#7a9b5c" }}>Sí (FKs / JOINs)</td>
              <td style={{ padding: "0.35rem", color: "#7a9b5c" }}>Sí (FKs / JOINs)</td>
              <td style={{ padding: "0.35rem", color: "#e8a0bf" }}>No (Single-Table)</td>
            </tr>
            <tr>
              <td style={{ padding: "0.35rem", color: "#F5F1E8" }}>VERDICTO FINAL</td>
              <td style={{ padding: "0.35rem", color: "#7a9b5c", fontWeight: 700 }}>SELECCIONADO</td>
              <td style={{ padding: "0.35rem", color: "#d4a017", fontWeight: 700 }}>FUTURO ESCALADO</td>
              <td style={{ padding: "0.35rem", color: "rgba(245,241,232,0.4)" }}>DESCARTADO CORE</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default DatabaseArchitecturePanel;
