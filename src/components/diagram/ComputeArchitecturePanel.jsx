// src/components/diagram/ComputeArchitecturePanel.jsx
import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Cpu,
  Zap,
  Box,
  Activity,
  Play,
  CheckCircle2,
  Server,
  Layers,
  ArrowRight,
  Sparkles,
} from "lucide-react";

export function ComputeArchitecturePanel({
  selectedTech = "ec2",
  setSelectedTech,
  isSimulating = false,
  handleRunSimulation,
}) {
  const [telemetry, setTelemetry] = useState({
    executionTime: 42,
    memoryUsed: 256,
    coldStart: 0,
    costPerMillion: 10.4,
  });

  const runTest = (e) => {
    if (handleRunSimulation) handleRunSimulation(e, selectedTech);
    if (selectedTech === "lambda") {
      setTelemetry({ executionTime: 12, memoryUsed: 128, coldStart: 180, costPerMillion: 0.2 });
    } else if (selectedTech === "containers" || selectedTech === "fargate") {
      setTelemetry({ executionTime: 35, memoryUsed: 512, coldStart: 0, costPerMillion: 14.5 });
    } else if (selectedTech === "beanstalk") {
      setTelemetry({ executionTime: 48, memoryUsed: 384, coldStart: 0, costPerMillion: 18.2 });
    } else {
      setTelemetry({ executionTime: 42, memoryUsed: 256, coldStart: 0, costPerMillion: 10.4 });
    }
  };

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        gap: "1rem",
        background: "rgba(12,12,14,0.92)",
        backdropFilter: "blur(16px)",
        border: "1px solid rgba(245,241,232,0.12)",
        padding: "1.25rem",
        boxSizing: "border-box",
        overflowY: "auto",
      }}
    >
      {/* Top Controls Header */}
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
          <Sparkles size={18} color="#d4a017" />
          <span
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: "0.82rem",
              color: "#F5F1E8",
              fontWeight: 700,
              letterSpacing: "0.05em",
            }}
          >
            PANEL DE ARQUITECTURA Y MODELADO DE CÓMPUTO AWS
          </span>
        </div>

        <button
          type="button"
          onClick={runTest}
          disabled={isSimulating}
          style={{
            background: isSimulating ? "rgba(245,241,232,0.1)" : "rgba(212,160,23,0.2)",
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
          <Play size={12} />
          <span>{isSimulating ? "SIMULANDO..." : "PROBAR INVOCACIÓN"}</span>
        </button>
      </div>

      {/* Dynamic Interactive SVG Topology Diagram */}
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
            TOPOLOGÍA DE FLUJO: {selectedTech.toUpperCase()}
          </span>
          <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.68rem", color: "rgba(245,241,232,0.6)" }}>
            SELECCIÓN ACTIVA
          </span>
        </div>

        <svg viewBox="0 0 680 110" style={{ width: "100%", height: "auto" }}>
          {isSimulating && (
            <circle cx="180" cy="55" r="5" fill="#d4a017">
              <animate attributeName="cx" values="140;440;630" dur="0.8s" repeatCount="1" />
            </circle>
          )}

          {selectedTech === "ec2" && (
            <g>
              <rect x="20" y="20" width="120" height="70" rx="4" fill="#141418" stroke={isSimulating ? "#F5F1E8" : "#d4a017"} strokeWidth="1.5" />
              <text x="80" y="50" textAnchor="middle" fill="#F5F1E8" fontSize="10" fontFamily="JetBrains Mono" fontWeight="bold">USUARIOS MTA</text>
              <text x="80" y="65" textAnchor="middle" fill="#d4a017" fontSize="8" fontFamily="JetBrains Mono">HTTP Port 80/443</text>

              <line x1="140" y1="55" x2="220" y2="55" stroke="#d4a017" strokeWidth="2" strokeDasharray="4 4" />

              <rect x="220" y="20" width="140" height="70" rx="4" fill="#141418" stroke={isSimulating ? "#7a9b5c" : "#d4a017"} strokeWidth={isSimulating ? "2.5" : "1.5"} />
              <text x="290" y="48" textAnchor="middle" fill="#F5F1E8" fontSize="10" fontFamily="JetBrains Mono" fontWeight="bold">INSTANCIA EC2</text>
              <text x="290" y="62" textAnchor="middle" fill="#7a9b5c" fontSize="8" fontFamily="JetBrains Mono">t4g.small / Ubuntu</text>
              <text x="290" y="75" textAnchor="middle" fill="#d4a017" fontSize="8" fontFamily="JetBrains Mono">Next.js / Node.js ERP</text>

              <line x1="360" y1="55" x2="440" y2="55" stroke="#7a9b5c" strokeWidth="2" />

              <rect x="440" y="20" width="130" height="70" rx="4" fill="#141418" stroke="#7a9b5c" strokeWidth="1.5" />
              <text x="505" y="48" textAnchor="middle" fill="#F5F1E8" fontSize="10" fontFamily="JetBrains Mono" fontWeight="bold">AMAZON EBS gp3</text>
              <text x="505" y="65" textAnchor="middle" fill="#7a9b5c" fontSize="8" fontFamily="JetBrains Mono">Almacenamiento SSD</text>

              <circle cx="630" cy="55" r="22" fill={isSimulating ? "rgba(212,160,23,0.4)" : "rgba(212,160,23,0.2)"} stroke="#d4a017" strokeWidth="2" />
              <text x="630" y="59" textAnchor="middle" fill="#d4a017" fontSize="9" fontFamily="JetBrains Mono" fontWeight="bold">IaaS</text>
            </g>
          )}

          {selectedTech === "lambda" && (
            <g>
              <rect x="20" y="20" width="120" height="70" rx="4" fill="#141418" stroke={isSimulating ? "#F5F1E8" : "#e8a0bf"} strokeWidth="1.5" />
              <text x="80" y="50" textAnchor="middle" fill="#F5F1E8" fontSize="10" fontFamily="JetBrains Mono" fontWeight="bold">API GATEWAY / S3</text>
              <text x="80" y="65" textAnchor="middle" fill="#e8a0bf" fontSize="8" fontFamily="JetBrains Mono">Trigger Evento</text>

              <line x1="140" y1="55" x2="220" y2="55" stroke="#e8a0bf" strokeWidth="2" strokeDasharray="4 4" />

              <rect x="220" y="20" width="140" height="70" rx="4" fill="#141418" stroke={isSimulating ? "#7a9b5c" : "#e8a0bf"} strokeWidth={isSimulating ? "2.5" : "1.5"} />
              <text x="290" y="48" textAnchor="middle" fill="#F5F1E8" fontSize="10" fontFamily="JetBrains Mono" fontWeight="bold">AWS LAMBDA</text>
              <text x="290" y="62" textAnchor="middle" fill="#e8a0bf" fontSize="8" fontFamily="JetBrains Mono">Función FaaS Ephemere</text>
              <text x="290" y="75" textAnchor="middle" fill="#d4a017" fontSize="8" fontFamily="JetBrains Mono">Ejecución &lt; 15 min</text>

              <line x1="360" y1="55" x2="440" y2="55" stroke="#e8a0bf" strokeWidth="2" />

              <rect x="440" y="20" width="130" height="70" rx="4" fill="#141418" stroke="#7a9b5c" strokeWidth="1.5" />
              <text x="505" y="48" textAnchor="middle" fill="#F5F1E8" fontSize="10" fontFamily="JetBrains Mono" fontWeight="bold">AMAZON DYNAMODB</text>
              <text x="505" y="65" textAnchor="middle" fill="#7a9b5c" fontSize="8" fontFamily="JetBrains Mono">Escritura NoSQL</text>

              <circle cx="630" cy="55" r="22" fill={isSimulating ? "rgba(232,160,191,0.4)" : "rgba(232,160,191,0.2)"} stroke="#e8a0bf" strokeWidth="2" />
              <text x="630" y="59" textAnchor="middle" fill="#e8a0bf" fontSize="8" fontFamily="JetBrains Mono" fontWeight="bold">Serverless</text>
            </g>
          )}

          {(selectedTech === "containers" || selectedTech === "fargate") && (
            <g>
              <rect x="20" y="20" width="120" height="70" rx="4" fill="#141418" stroke={isSimulating ? "#F5F1E8" : "#7a9b5c"} strokeWidth="1.5" />
              <text x="80" y="50" textAnchor="middle" fill="#F5F1E8" fontSize="10" fontFamily="JetBrains Mono" fontWeight="bold">AMAZON ECR</text>
              <text x="80" y="65" textAnchor="middle" fill="#7a9b5c" fontSize="8" fontFamily="JetBrains Mono">Docker Images</text>

              <line x1="140" y1="55" x2="220" y2="55" stroke="#7a9b5c" strokeWidth="2" strokeDasharray="4 4" />

              <rect x="220" y="20" width="140" height="70" rx="4" fill="#141418" stroke={isSimulating ? "#d4a017" : "#7a9b5c"} strokeWidth={isSimulating ? "2.5" : "1.5"} />
              <text x="290" y="48" textAnchor="middle" fill="#F5F1E8" fontSize="10" fontFamily="JetBrains Mono" fontWeight="bold">AWS FARGATE / ECS</text>
              <text x="290" y="62" textAnchor="middle" fill="#7a9b5c" fontSize="8" fontFamily="JetBrains Mono">Contenedor Serverless</text>
              <text x="290" y="75" textAnchor="middle" fill="#d4a017" fontSize="8" fontFamily="JetBrains Mono">Task Definition Inmutable</text>

              <line x1="360" y1="55" x2="440" y2="55" stroke="#7a9b5c" strokeWidth="2" />

              <rect x="440" y="20" width="130" height="70" rx="4" fill="#141418" stroke="#d4a017" strokeWidth="1.5" />
              <text x="505" y="48" textAnchor="middle" fill="#F5F1E8" fontSize="10" fontFamily="JetBrains Mono" fontWeight="bold">APPLICATION LOAD BALANCER</text>
              <text x="505" y="65" textAnchor="middle" fill="#d4a017" fontSize="8" fontFamily="JetBrains Mono">Autoscaling por CPU</text>

              <circle cx="630" cy="55" r="22" fill={isSimulating ? "rgba(122,155,92,0.4)" : "rgba(122,155,92,0.2)"} stroke="#7a9b5c" strokeWidth="2" />
              <text x="630" y="59" textAnchor="middle" fill="#7a9b5c" fontSize="9" fontFamily="JetBrains Mono" fontWeight="bold">CaaS</text>
            </g>
          )}

          {selectedTech === "beanstalk" && (
            <g>
              <rect x="20" y="20" width="120" height="70" rx="4" fill="#141418" stroke={isSimulating ? "#F5F1E8" : "#60a5fa"} strokeWidth="1.5" />
              <text x="80" y="50" textAnchor="middle" fill="#F5F1E8" fontSize="10" fontFamily="JetBrains Mono" fontWeight="bold">ZIP / GIT PUSH</text>
              <text x="80" y="65" textAnchor="middle" fill="#60a5fa" fontSize="8" fontFamily="JetBrains Mono">Capa Abstraída</text>

              <line x1="140" y1="55" x2="220" y2="55" stroke="#60a5fa" strokeWidth="2" strokeDasharray="4 4" />

              <rect x="220" y="20" width="140" height="70" rx="4" fill="#141418" stroke={isSimulating ? "#ef4444" : "#60a5fa"} strokeWidth={isSimulating ? "2.5" : "1.5"} />
              <text x="290" y="48" textAnchor="middle" fill="#F5F1E8" fontSize="10" fontFamily="JetBrains Mono" fontWeight="bold">ELASTIC BEANSTALK</text>
              <text x="290" y="62" textAnchor="middle" fill="#ef4444" fontSize="8" fontFamily="JetBrains Mono">Control Red Oculto</text>
              <text x="290" y="75" textAnchor="middle" fill="#60a5fa" fontSize="8" fontFamily="JetBrains Mono">PaaS Automatizado</text>

              <line x1="360" y1="55" x2="440" y2="55" stroke="#60a5fa" strokeWidth="2" />

              <rect x="440" y="20" width="130" height="70" rx="4" fill="#141418" stroke="#ef4444" strokeWidth="1.5" />
              <text x="505" y="48" textAnchor="middle" fill="#F5F1E8" fontSize="10" fontFamily="JetBrains Mono" fontWeight="bold">SUBREDES RÍGIDAS</text>
              <text x="505" y="65" textAnchor="middle" fill="#ef4444" fontSize="8" fontFamily="JetBrains Mono">Sin Fine-Grained IaC</text>

              <circle cx="630" cy="55" r="22" fill={isSimulating ? "rgba(96,165,250,0.4)" : "rgba(96,165,250,0.2)"} stroke="#60a5fa" strokeWidth="2" />
              <text x="630" y="59" textAnchor="middle" fill="#60a5fa" fontSize="9" fontFamily="JetBrains Mono" fontWeight="bold">PaaS</text>
            </g>
          )}
        </svg>
      </div>

      {/* Live Telemetry Display Panel */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: "0.5rem",
          background: "rgba(15,15,18,0.8)",
          padding: "0.75rem",
          border: "1px solid rgba(245,241,232,0.1)",
        }}
      >
        <div>
          <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.65rem", color: "rgba(245,241,232,0.5)", display: "block" }}>LATENCIA (MS)</span>
          <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.9rem", color: "#7a9b5c", fontWeight: 700 }}>{telemetry.executionTime} ms</span>
        </div>

        <div>
          <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.65rem", color: "rgba(245,241,232,0.5)", display: "block" }}>RAM PEAK</span>
          <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.9rem", color: "#d4a017", fontWeight: 700 }}>{telemetry.memoryUsed} MB</span>
        </div>

        <div>
          <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.65rem", color: "rgba(245,241,232,0.5)", display: "block" }}>COLD START</span>
          <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.9rem", color: telemetry.coldStart > 0 ? "#e8a0bf" : "#7a9b5c", fontWeight: 700 }}>
            {telemetry.coldStart} ms
          </span>
        </div>

        <div>
          <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.65rem", color: "rgba(245,241,232,0.5)", display: "block" }}>COSTO / 1M PETICIONES</span>
          <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.9rem", color: "#F5F1E8", fontWeight: 700 }}>${telemetry.costPerMillion} USD</span>
        </div>
      </div>

      {/* Bloque de Justificación Arquitectónica del Modelo Seleccionado */}
      <div
        style={{
          padding: "0.75rem 0.95rem",
          background: "linear-gradient(135deg, rgba(212,160,23,0.08) 0%, rgba(12,12,14,0.95) 100%)",
          border: "1px solid rgba(212,160,23,0.35)",
          borderLeft: "4px solid #d4a017",
          display: "flex",
          flexDirection: "column",
          gap: "0.35rem",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <Activity size={15} color="#d4a017" />
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.74rem", color: "#d4a017", fontWeight: 700, letterSpacing: "0.06em" }}>
              JUSTIFICACIÓN ARQUITECTÓNICA DEL MODELO HÍBRIDO (MTA)
            </span>
          </div>
          <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.66rem", color: "#7a9b5c", fontWeight: 600 }}>
            SLA 99.95% · CERO SPOF
          </span>
        </div>
        <p style={{ fontFamily: "Inter, sans-serif", fontSize: "0.75rem", color: "rgba(245,241,232,0.92)", margin: 0, lineHeight: 1.45 }}>
          <strong>Adopción del modelo híbrido (Graviton + Lambda + ECS):</strong> Combina instancias <strong>EC2 <code>t4g.small</code> (ARM64)</strong> para el backend del ERP con WebSockets continuos y latencia &lt; 30 ms sin Cold Starts, <strong>AWS Lambda</strong> para tareas batch nocturnas a costo $0 en reposo, y <strong>AWS Fargate</strong> para microservicios inmutables de los practicantes.
        </p>
        <p style={{ fontFamily: "Inter, sans-serif", fontSize: "0.73rem", color: "rgba(245,241,232,0.78)", margin: 0, lineHeight: 1.4 }}>
          <strong>Descarte de Elastic Beanstalk (PaaS) y Serverless puro:</strong> Se descarta Beanstalk porque su caja negra impide el control granular de subredes privadas VPC, Security Groups e IaC con CloudFormation. Se descarta Serverless puro por el límite de 15 min de Lambda y la latencia en conexiones continuas a PostgreSQL.
        </p>
      </div>

      {/* Technical Comparison Matrix */}
      <div
        style={{
          padding: "0.75rem",
          background: "rgba(8,8,10,0.8)",
          border: "1px solid rgba(245,241,232,0.12)",
        }}
      >
        <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.72rem", color: "#d4a017", fontWeight: 700, display: "block", marginBottom: "0.4rem" }}>
          MATRIZ DE CAPACIDADES Y TRADE-OFFS:
        </span>

        <table style={{ width: "100%", borderCollapse: "collapse", fontFamily: "'JetBrains Mono', monospace", fontSize: "0.68rem" }}>
          <thead>
            <tr style={{ borderBottom: "1px solid rgba(245,241,232,0.15)", color: "rgba(245,241,232,0.5)" }}>
              <th style={{ textAlign: "left", padding: "0.3rem" }}>CRITERIO</th>
              <th style={{ textAlign: "left", padding: "0.3rem", color: "#d4a017" }}>AMAZON EC2</th>
              <th style={{ textAlign: "left", padding: "0.3rem", color: "#e8a0bf" }}>AWS LAMBDA</th>
              <th style={{ textAlign: "left", padding: "0.3rem", color: "#7a9b5c" }}>AWS FARGATE</th>
              <th style={{ textAlign: "left", padding: "0.3rem", color: "#60a5fa" }}>ELASTIC BEANSTALK</th>
            </tr>
          </thead>
          <tbody>
            <tr style={{ borderBottom: "1px solid rgba(245,241,232,0.06)" }}>
              <td style={{ padding: "0.35rem", color: "#F5F1E8" }}>Modelo</td>
              <td style={{ padding: "0.35rem", color: "#d4a017" }}>IaaS (Virtual Machines)</td>
              <td style={{ padding: "0.35rem", color: "#e8a0bf" }}>FaaS (Serverless)</td>
              <td style={{ padding: "0.35rem", color: "#7a9b5c" }}>CaaS (Serverless Containers)</td>
              <td style={{ padding: "0.35rem", color: "#60a5fa" }}>PaaS (Plataforma Gestionada)</td>
            </tr>
            <tr style={{ borderBottom: "1px solid rgba(245,241,232,0.06)" }}>
              <td style={{ padding: "0.35rem", color: "#F5F1E8" }}>Escalado</td>
              <td style={{ padding: "0.35rem", color: "rgba(245,241,232,0.8)" }}>Auto Scaling Group (minutos)</td>
              <td style={{ padding: "0.35rem", color: "rgba(245,241,232,0.8)" }}>Instantáneo (milisegundos)</td>
              <td style={{ padding: "0.35rem", color: "rgba(245,241,232,0.8)" }}>Automático por vCPU / RAM</td>
              <td style={{ padding: "0.35rem", color: "rgba(245,241,232,0.8)" }}>Automático (Caja negra)</td>
            </tr>
            <tr style={{ borderBottom: "1px solid rgba(245,241,232,0.06)" }}>
              <td style={{ padding: "0.35rem", color: "#F5F1E8" }}>Control Red</td>
              <td style={{ padding: "0.35rem", color: "#7a9b5c" }}>100% Granular (VPC/SG)</td>
              <td style={{ padding: "0.35rem", color: "#e8a0bf" }}>VPC Eni opcional</td>
              <td style={{ padding: "0.35rem", color: "#7a9b5c" }}>100% Granular en Subredes</td>
              <td style={{ padding: "0.35rem", color: "#ef4444" }}>Opaco y Restringido</td>
            </tr>
            <tr>
              <td style={{ padding: "0.35rem", color: "#F5F1E8" }}>Uso en MTA</td>
              <td style={{ padding: "0.35rem", color: "#d4a017" }}>Staging &amp; Dev envs</td>
              <td style={{ padding: "0.35rem", color: "#e8a0bf" }}>Tareas asíncronas / Webhooks</td>
              <td style={{ padding: "0.35rem", color: "#7a9b5c" }}>Producción ERP Workspace</td>
              <td style={{ padding: "0.35rem", color: "#ef4444" }}>Descartado por falta de control</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ComputeArchitecturePanel;
