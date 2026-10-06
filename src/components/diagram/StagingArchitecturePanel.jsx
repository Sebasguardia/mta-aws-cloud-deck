// src/components/diagram/StagingArchitecturePanel.jsx
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Server,
  HardDrive,
  Cpu,
  Terminal,
  ShieldCheck,
  CheckCircle2,
  Play,
  Square,
  Activity,
  Layers,
  Zap,
  Lock,
  ArrowRight,
  GitBranch,
} from "lucide-react";

export function StagingArchitecturePanel({
  serverState,
  setServerState,
  selectedTech,
  setSelectedTech,
}) {
  const [activeTab, setActiveTab] = useState("pipeline"); // pipeline | security | console

  const logs = [
    "[INFO] 22:15:01 ssh_connect: Connected to ec2-54-210-88-14.compute-1.amazonaws.com",
    "[INFO] 22:15:03 git_pull: Fetching latest commits from origin/staging...",
    "[PASS] 22:15:06 jest_tests: 14 test suites passed (100% code coverage)",
    "[BUILD] 22:15:10 next_build: Compiled /workspace-mta in 3.4s (30 GB EBS gp3 SSD)",
    "[OK] 22:15:12 pm2_restart: Process 'mta-staging-app' online on port 3000",
  ];

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
      {/* HUD Header Bar */}
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
          <Server size={18} color="#d4a017" />
          <div style={{ display: "flex", flexDirection: "column" }}>
            <span
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: "0.82rem",
                color: "#F5F1E8",
                fontWeight: 700,
                letterSpacing: "0.05em",
              }}
            >
              ENTORNO DE STAGING EC2 (t3.micro)
            </span>
            <span
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: "0.68rem",
                color: "#7a9b5c",
              }}
            >
              IP: 54.210.88.14 · US-EAST-1A · FREE TIER $0.00/MES
            </span>
          </div>
        </div>

        {/* Tab Navigation Controls */}
        <div style={{ display: "flex", gap: "0.35rem" }}>
          {[
            { id: "pipeline", label: "PIPELINE CI/CD" },
            { id: "security", label: "SEGURIDAD VPC" },
            { id: "console", label: "TERMINAL" },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              style={{
                background:
                  activeTab === tab.id
                    ? "rgba(212,160,23,0.2)"
                    : "rgba(255,255,255,0.04)",
                color: activeTab === tab.id ? "#d4a017" : "rgba(245,241,232,0.6)",
                border:
                  activeTab === tab.id
                    ? "1px solid #d4a017"
                    : "1px solid rgba(245,241,232,0.1)",
                padding: "0.25rem 0.6rem",
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: "0.68rem",
                fontWeight: 700,
                cursor: "pointer",
                transition: "all 0.2s ease",
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Tab Contents */}
      {activeTab === "pipeline" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          {/* SVG CI/CD Flow Diagram */}
          <div
            style={{
              padding: "1rem",
              background: "rgba(8,8,10,0.8)",
              border: "1px solid rgba(212,160,23,0.2)",
              borderRadius: "4px",
            }}
          >
            <span
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: "0.72rem",
                color: "#d4a017",
                fontWeight: 700,
                display: "block",
                marginBottom: "0.75rem",
              }}
            >
              FLUJO AUTOMÁTICO DE DEPLOY PARA 10 PRACTICANTES:
            </span>

            <svg viewBox="0 0 700 120" style={{ width: "100%", height: "auto" }}>
              {/* Lines connecting nodes */}
              <line x1="110" y1="60" x2="160" y2="60" stroke="#d4a017" strokeWidth="2" strokeDasharray="4 4" />
              <line x1="270" y1="60" x2="320" y2="60" stroke="#7a9b5c" strokeWidth="2" />
              <line x1="430" y1="60" x2="480" y2="60" stroke="#e8a0bf" strokeWidth="2" />
              <line x1="590" y1="60" x2="630" y2="60" stroke="#7a9b5c" strokeWidth="2" />

              {/* Node 1: Dev Laptops */}
              <rect x="10" y="25" width="100" height="70" rx="4" fill="#141418" stroke="#e8a0bf" strokeWidth="1.5" />
              <text x="60" y="55" textAnchor="middle" fill="#F5F1E8" fontSize="10" fontFamily="JetBrains Mono" fontWeight="bold">10 PRACTICANTES</text>
              <text x="60" y="72" textAnchor="middle" fill="#e8a0bf" fontSize="8" fontFamily="JetBrains Mono">Git Push staging</text>

              {/* Node 2: GitHub Actions */}
              <rect x="160" y="25" width="110" height="70" rx="4" fill="#141418" stroke="#d4a017" strokeWidth="1.5" />
              <text x="215" y="52" textAnchor="middle" fill="#F5F1E8" fontSize="10" fontFamily="JetBrains Mono" fontWeight="bold">GITHUB ACTIONS</text>
              <text x="215" y="68" textAnchor="middle" fill="#7a9b5c" fontSize="8" fontFamily="JetBrains Mono">Jest Tests Pass</text>

              {/* Node 3: Amazon EC2 Staging */}
              <rect x="320" y="25" width="110" height="70" rx="4" fill="#141418" stroke="#7a9b5c" strokeWidth="1.5" />
              <text x="375" y="52" textAnchor="middle" fill="#F5F1E8" fontSize="10" fontFamily="JetBrains Mono" fontWeight="bold">EC2 t3.micro</text>
              <text x="375" y="68" textAnchor="middle" fill="#d4a017" fontSize="8" fontFamily="JetBrains Mono">Build Next.js</text>

              {/* Node 4: Amazon EBS gp3 */}
              <rect x="480" y="25" width="110" height="70" rx="4" fill="#141418" stroke="#7a9b5c" strokeWidth="1.5" />
              <text x="535" y="52" textAnchor="middle" fill="#F5F1E8" fontSize="10" fontFamily="JetBrains Mono" fontWeight="bold">EBS 30 GB gp3</text>
              <text x="535" y="68" textAnchor="middle" fill="#7a9b5c" fontSize="8" fontFamily="JetBrains Mono">3000 IOPS SSD</text>

              {/* Node 5: Staging Ready */}
              <circle cx="655" cy="60" r="22" fill="rgba(122,155,92,0.2)" stroke="#7a9b5c" strokeWidth="2" />
              <text x="655" y="64" textAnchor="middle" fill="#7a9b5c" fontSize="9" fontFamily="JetBrains Mono" fontWeight="bold">OK 200</text>
            </svg>
          </div>

          {/* Cards Grid: Hardware Specs & Burstable Performance */}
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
              <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                <Cpu size={14} color="#d4a017" />
                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.72rem", color: "#d4a017", fontWeight: 700 }}>
                  CPU BURSTABLE (T3 CREDIT BALANCE)
                </span>
              </div>
              <p style={{ fontFamily: "Inter, sans-serif", fontSize: "0.74rem", color: "rgba(245,241,232,0.8)", margin: 0 }}>
                Permite ráfagas del 100% de CPU durante la compilación pesada de Next.js sin costo extra gracias al crédito de ráfaga acumulado.
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
              <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                <HardDrive size={14} color="#7a9b5c" />
                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.72rem", color: "#7a9b5c", fontWeight: 700 }}>
                  EBS GP3 PERSISTENTE (30 GB)
                </span>
              </div>
              <p style={{ fontFamily: "Inter, sans-serif", fontSize: "0.74rem", color: "rgba(245,241,232,0.8)", margin: 0 }}>
                3,000 IOPS base y 125 MB/s de velocidad de transferencia dedicada para evitar embotellamientos I/O en builds concurrentes.
              </p>
            </div>
          </div>
        </div>
      )}

      {activeTab === "security" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "0.85rem" }}>
          <div
            style={{
              padding: "0.75rem",
              background: "rgba(8,8,10,0.8)",
              border: "1px solid rgba(212,160,23,0.2)",
            }}
          >
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.72rem", color: "#d4a017", fontWeight: 700, display: "block", marginBottom: "0.5rem" }}>
              SECURITY GROUP STAGING (sg-0a8f9c12):
            </span>

            <table style={{ width: "100%", borderCollapse: "collapse", fontFamily: "'JetBrains Mono', monospace", fontSize: "0.68rem" }}>
              <thead>
                <tr style={{ borderBottom: "1px solid rgba(245,241,232,0.15)", textTransform: "uppercase", color: "rgba(245,241,232,0.5)" }}>
                  <th style={{ textAlign: "left", padding: "0.3rem" }}>TIPO</th>
                  <th style={{ textAlign: "left", padding: "0.3rem" }}>PUERTO</th>
                  <th style={{ textAlign: "left", padding: "0.3rem" }}>ORIGEN / CIDR</th>
                  <th style={{ textAlign: "left", padding: "0.3rem" }}>PROPÓSITO MTA</th>
                </tr>
              </thead>
              <tbody>
                <tr style={{ borderBottom: "1px solid rgba(245,241,232,0.06)" }}>
                  <td style={{ padding: "0.35rem", color: "#7a9b5c" }}>SSH</td>
                  <td style={{ padding: "0.35rem", color: "#F5F1E8" }}>TCP 22</td>
                  <td style={{ padding: "0.35rem", color: "#d4a017" }}>VPN MTA / Admin IP</td>
                  <td style={{ padding: "0.35rem", color: "rgba(245,241,232,0.7)" }}>Acceso remoto seguro</td>
                </tr>
                <tr style={{ borderBottom: "1px solid rgba(245,241,232,0.06)" }}>
                  <td style={{ padding: "0.35rem", color: "#7a9b5c" }}>HTTP</td>
                  <td style={{ padding: "0.35rem", color: "#F5F1E8" }}>TCP 80</td>
                  <td style={{ padding: "0.35rem", color: "#d4a017" }}>0.0.0.0/0</td>
                  <td style={{ padding: "0.35rem", color: "rgba(245,241,232,0.7)" }}>Redirección Web Staging</td>
                </tr>
                <tr>
                  <td style={{ padding: "0.35rem", color: "#e8a0bf" }}>CUSTOM TCP</td>
                  <td style={{ padding: "0.35rem", color: "#F5F1E8" }}>TCP 3000</td>
                  <td style={{ padding: "0.35rem", color: "#d4a017" }}>10.0.0.0/16 (VPC)</td>
                  <td style={{ padding: "0.35rem", color: "rgba(245,241,232,0.7)" }}>App Next.js ERP Staging</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === "console" && (
        <div
          style={{
            background: "#08080a",
            border: "1px solid rgba(122,155,92,0.3)",
            padding: "0.85rem",
            borderRadius: "4px",
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: "0.72rem",
            display: "flex",
            flexDirection: "column",
            gap: "0.4rem",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", borderBottom: "1px solid rgba(245,241,232,0.1)", paddingBottom: "0.4rem" }}>
            <Terminal size={14} color="#7a9b5c" />
            <span style={{ color: "#7a9b5c", fontWeight: 700 }}>ubuntu@ec2-staging-mta:~$ pm2 logs mta-staging</span>
          </div>

          {logs.map((log, i) => (
            <div key={i} style={{ color: log.includes("PASS") || log.includes("OK") ? "#7a9b5c" : "#d4a017" }}>
              {log}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default StagingArchitecturePanel;
