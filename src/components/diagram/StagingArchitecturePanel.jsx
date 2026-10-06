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
  const [isDeploying, setIsDeploying] = useState(false);
  const [deployStep, setDeployStep] = useState(0); // 0: Idle, 1: Git Push, 2: GitHub Actions, 3: EC2 Build, 4: EBS Storage, 5: OK 200
  const [deployFailed, setDeployFailed] = useState(false);
  const [dynamicLogs, setDynamicLogs] = useState([
    "[INFO] 22:15:01 ssh_connect: Connected to ec2-54-210-88-14.compute-1.amazonaws.com",
    "[INFO] 22:15:03 git_pull: Fetching latest commits from origin/staging...",
    "[PASS] 22:15:06 jest_tests: 14 test suites passed (100% code coverage)",
    "[BUILD] 22:15:10 next_build: Compiled /workspace-mta in 3.4s (30 GB EBS gp3 SSD)",
    "[OK] 22:15:12 pm2_restart: Process 'mta-staging-app' online on port 3000",
  ]);

  const runDeploySimulation = () => {
    setIsDeploying(true);
    setDeployFailed(false);
    setActiveTab("pipeline");
    setDeployStep(1);

    const now = new Date().toLocaleTimeString();

    setDynamicLogs((prev) => [
      ...prev.slice(-3),
      `[TRIGGER] ${now} git_push: 10 Practicantes enviaron cambios a origin/staging...`,
    ]);

    setTimeout(() => {
      setDeployStep(2);
      setDynamicLogs((prev) => [
        ...prev,
        `[BUILD] ${now} github_actions: Ejecutando Jest test suite en entorno runner...`,
        `[PASS] ${now} jest_tests: 14 test suites pasaron con 100% cobertura`,
      ]);
    }, 1000);

    setTimeout(() => {
      setDeployStep(3);
      if (serverState === "stopped") {
        setDeployFailed(true);
        setIsDeploying(false);
        setDynamicLogs((prev) => [
          ...prev,
          `[FAIL] ${now} ssh_connect: Connection refused to 54.210.88.14 (EC2 DETENIDO $0/H)`,
          `[ERROR] ${now} deploy_aborted: Enciende la instancia EC2 primero antes de realizar el deploy.`,
        ]);
        return;
      }

      setDynamicLogs((prev) => [
        ...prev,
        `[SSH] ${now} ec2_deploy: Desplegando en t3.micro (IP 54.210.88.14)...`,
        `[BUILD] ${now} next_build: Compilando Next.js en 3.2s con ráfaga CPU...`,
      ]);

      setTimeout(() => {
        setDeployStep(4);
        setDynamicLogs((prev) => [
          ...prev,
          `[STORAGE] ${now} ebs_write: Persistiendo artifact en 30 GB EBS gp3 (3000 IOPS)...`,
        ]);
      }, 1000);

      setTimeout(() => {
        setDeployStep(5);
        setDynamicLogs((prev) => [
          ...prev,
          `[OK] ${now} pm2_restart: 'mta-staging-app' online en puerto 3000 (HTTP 200 OK)`,
        ]);
        setIsDeploying(false);
      }, 2000);
    }, 2200);
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

        {/* Action Button & Tab Navigation Controls */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <button
            type="button"
            onClick={runDeploySimulation}
            disabled={isDeploying}
            style={{
              background: deployFailed ? "rgba(198,67,43,0.25)" : isDeploying ? "rgba(212,160,23,0.3)" : "rgba(212,160,23,0.2)",
              color: deployFailed ? "#e8a0bf" : "#d4a017",
              border: `1px solid ${deployFailed ? "#c6432b" : "#d4a017"}`,
              padding: "0.25rem 0.65rem",
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: "0.68rem",
              fontWeight: 700,
              cursor: isDeploying ? "default" : "pointer",
              display: "flex",
              alignItems: "center",
              gap: "0.35rem",
            }}
          >
            <Play size={12} />
            <span>{isDeploying ? `PROCESANDO (${deployStep}/5)...` : deployFailed ? "REINTENTAR DEPLOY (EC2 DETENIDO)" : "EJECUTAR DEPLOY CI/CD"}</span>
          </button>

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
              <line x1="110" y1="60" x2="160" y2="60" stroke={deployStep >= 1 ? "#d4a017" : "rgba(212,160,23,0.3)"} strokeWidth="2" strokeDasharray="4 4" />
              <line x1="270" y1="60" x2="320" y2="60" stroke={deployStep >= 2 ? "#7a9b5c" : "rgba(122,155,92,0.3)"} strokeWidth="2" />
              <line x1="430" y1="60" x2="480" y2="60" stroke={deployStep >= 3 ? "#e8a0bf" : "rgba(232,160,191,0.3)"} strokeWidth="2" />
              <line x1="590" y1="60" x2="630" y2="60" stroke={deployStep >= 4 ? "#7a9b5c" : "rgba(122,155,92,0.3)"} strokeWidth="2" />

              {/* Animated data packet during deploy */}
              {isDeploying && (
                <circle
                  cx={
                    deployStep === 1 ? 135 :
                    deployStep === 2 ? 295 :
                    deployStep === 3 ? 455 :
                    deployStep === 4 ? 610 : 655
                  }
                  cy="60"
                  r="5"
                  fill="#d4a017"
                />
              )}

              {/* Node 1: Dev Laptops */}
              <rect x="10" y="25" width="100" height="70" rx="4" fill="#141418" stroke={deployStep === 1 ? "#F5F1E8" : "#e8a0bf"} strokeWidth={deployStep === 1 ? "2.5" : "1.5"} />
              <text x="60" y="55" textAnchor="middle" fill="#F5F1E8" fontSize="10" fontFamily="JetBrains Mono" fontWeight="bold">10 PRACTICANTES</text>
              <text x="60" y="72" textAnchor="middle" fill="#e8a0bf" fontSize="8" fontFamily="JetBrains Mono">Git Push staging</text>

              {/* Node 2: GitHub Actions */}
              <rect x="160" y="25" width="110" height="70" rx="4" fill="#141418" stroke={deployStep === 2 ? "#F5F1E8" : "#d4a017"} strokeWidth={deployStep === 2 ? "2.5" : "1.5"} />
              <text x="215" y="52" textAnchor="middle" fill="#F5F1E8" fontSize="10" fontFamily="JetBrains Mono" fontWeight="bold">GITHUB ACTIONS</text>
              <text x="215" y="68" textAnchor="middle" fill="#7a9b5c" fontSize="8" fontFamily="JetBrains Mono">Jest Tests Pass</text>

              {/* Node 3: Amazon EC2 Staging */}
              <rect x="320" y="25" width="110" height="70" rx="4" fill="#141418" stroke={serverState === "stopped" || deployFailed ? "#c6432b" : deployStep === 3 ? "#F5F1E8" : "#7a9b5c"} strokeWidth={deployStep === 3 ? "2.5" : "1.5"} />
              <text x="375" y="52" textAnchor="middle" fill="#F5F1E8" fontSize="10" fontFamily="JetBrains Mono" fontWeight="bold">EC2 t3.micro</text>
              <text x="375" y="68" textAnchor="middle" fill={serverState === "stopped" || deployFailed ? "#c6432b" : "#d4a017"} fontSize="8" fontFamily="JetBrains Mono">
                {serverState === "stopped" ? "SERVID DETENIDO" : deployFailed ? "DEPLOY FALLIDO" : "Build Next.js"}
              </text>

              {/* Node 4: Amazon EBS gp3 */}
              <rect x="480" y="25" width="110" height="70" rx="4" fill="#141418" stroke={deployStep === 4 ? "#F5F1E8" : "#7a9b5c"} strokeWidth={deployStep === 4 ? "2.5" : "1.5"} />
              <text x="535" y="52" textAnchor="middle" fill="#F5F1E8" fontSize="10" fontFamily="JetBrains Mono" fontWeight="bold">EBS 30 GB gp3</text>
              <text x="535" y="68" textAnchor="middle" fill="#7a9b5c" fontSize="8" fontFamily="JetBrains Mono">3000 IOPS SSD</text>

              {/* Node 5: Staging Status */}
              <circle
                cx="655"
                cy="60"
                r="22"
                fill={serverState === "stopped" || deployFailed ? "rgba(198,67,43,0.2)" : deployStep === 5 ? "rgba(122,155,92,0.4)" : "rgba(122,155,92,0.2)"}
                stroke={serverState === "stopped" || deployFailed ? "#c6432b" : deployStep === 5 ? "#F5F1E8" : "#7a9b5c"}
                strokeWidth={deployStep === 5 ? "3" : "2"}
              />
              <text x="655" y="64" textAnchor="middle" fill={serverState === "stopped" || deployFailed ? "#c6432b" : "#7a9b5c"} fontSize="9" fontFamily="JetBrains Mono" fontWeight="bold">
                {serverState === "stopped" || deployFailed ? "503 ERR" : "OK 200"}
              </text>
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

          {/* Bloque de Justificación Arquitectónica del Entorno de Staging */}
          <div
            style={{
              padding: "0.75rem 0.95rem",
              background: "linear-gradient(135deg, rgba(212,160,23,0.08) 0%, rgba(12,12,14,0.95) 100%)",
              border: "1px solid rgba(212,160,23,0.35)",
              borderLeft: "4px solid #d4a017",
              display: "flex",
              flexDirection: "column",
              gap: "0.4rem",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <Activity size={15} color="#d4a017" />
                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.74rem", color: "#d4a017", fontWeight: 700, letterSpacing: "0.06em" }}>
                  JUSTIFICACIÓN ARQUITECTÓNICA DE STAGING · MTA SOFTWARE
                </span>
              </div>
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.66rem", color: "#7a9b5c", fontWeight: 600 }}>
                100% FREE TIER · FIN AL LOCALHOST
              </span>
            </div>
            <p style={{ fontFamily: "Inter, sans-serif", fontSize: "0.75rem", color: "rgba(245,241,232,0.92)", margin: 0, lineHeight: 1.45 }}>
              <strong>Fundamento de adopción (EC2 t3.micro + EBS gp3):</strong> Se implementa esta arquitectura porque erradica de raíz la fragmentación en 10 laptops dispares de los practicantes, garantizando un entorno canónico en Amazon Linux 2023 LTS con 2 vCPUs y créditos de ráfaga para compilar Next.js en 3.2 segundos. Además, el volumen desacoplado de 30 GB gp3 ofrece 3,000 IOPS base fijos para retener módulos y cachés, operando <strong>750 horas al mes a costo $0.00 USD</strong> dentro de la capa gratuita sin comprometer el presupuesto.
            </p>
            <p style={{ fontFamily: "Inter, sans-serif", fontSize: "0.73rem", color: "rgba(245,241,232,0.78)", margin: 0, lineHeight: 1.4 }}>
              <strong>Descarte de almacenamiento efímero y servidores sobredimensionados:</strong> Se descartaron los discos efímeros de instancia (Instance Store) porque destruirían los artefactos compilados tras cada reinicio, obligando a re-descargas lentas de dependencias. Asimismo, se descartaron instancias dedicadas de mayor calibre (como t3.medium o c5.large) porque incurrirían en costos innecesarios de más de $30 USD mensuales para cargas de prueba no continuas.
            </p>
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
            maxHeight: "220px",
            overflowY: "auto",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", borderBottom: "1px solid rgba(245,241,232,0.1)", paddingBottom: "0.4rem" }}>
            <Terminal size={14} color="#7a9b5c" />
            <span style={{ color: "#7a9b5c", fontWeight: 700 }}>ubuntu@ec2-staging-mta:~$ pm2 logs mta-staging</span>
          </div>

          {dynamicLogs.map((log, i) => (
            <div key={i} style={{ color: log.includes("PASS") || log.includes("OK") ? "#7a9b5c" : log.includes("TRIGGER") || log.includes("BUILD") ? "#d4a017" : "#F5F1E8" }}>
              {log}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default StagingArchitecturePanel;
