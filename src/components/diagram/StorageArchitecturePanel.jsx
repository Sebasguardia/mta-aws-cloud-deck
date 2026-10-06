// src/components/diagram/StorageArchitecturePanel.jsx
import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  FolderArchive,
  Share2,
  Archive,
  HardDrive,
  Database,
  Layers,
  Sparkles,
  ShieldCheck,
  TrendingDown,
  Clock,
  CheckCircle2,
} from "lucide-react";

export function StorageArchitecturePanel({
  selectedStorage = "s3",
  setSelectedStorage,
}) {
  const [lifecycleDay, setLifecycleDay] = useState(0);

  const getTierInfo = () => {
    if (lifecycleDay >= 90) {
      return { name: "S3 Glacier Deep Archive", costGB: 0.00099, savings: "-95.6%", latency: "3 - 12 Horas" };
    }
    if (lifecycleDay >= 30) {
      return { name: "S3 Standard-Infrequent Access", costGB: 0.0125, savings: "-45.6%", latency: "Milisegundos" };
    }
    return { name: "S3 Standard", costGB: 0.023, savings: "Base", latency: "Milisegundos" };
  };

  const tier = getTierInfo();

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
      {/* HUD Header */}
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
          <FolderArchive size={18} color="#7a9b5c" />
          <span
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: "0.82rem",
              color: "#F5F1E8",
              fontWeight: 700,
              letterSpacing: "0.05em",
            }}
          >
            ARQUITECTURA DE ALMACENAMIENTO Y RETENCIÓN DIVERSA
          </span>
        </div>

        <span
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: "0.68rem",
            color: "#7a9b5c",
            background: "rgba(122,155,92,0.15)",
            border: "1px solid rgba(122,155,92,0.35)",
            padding: "0.2rem 0.55rem",
            fontWeight: 600,
          }}
        >
          DURABILIDAD 99.999999999% (11 NUEVES)
        </span>
      </div>

      {/* SVG Storage Architecture Flow */}
      <div
        style={{
          padding: "1rem",
          background: "rgba(8,8,10,0.8)",
          border: "1px solid rgba(122,155,92,0.2)",
          borderRadius: "4px",
        }}
      >
        <span
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: "0.72rem",
            color: "#7a9b5c",
            fontWeight: 700,
            display: "block",
            marginBottom: "0.75rem",
          }}
        >
          FLUJO DE ARCHIVADO Y CLASIFICACIÓN DE DATOS MTA:
        </span>

        <svg viewBox="0 0 680 110" style={{ width: "100%", height: "auto" }}>
          {/* Node 1: S3 Standard */}
          <rect x="20" y="20" width="180" height="70" rx="4" fill="#141418" stroke="#d4a017" strokeWidth="1.5" />
          <text x="110" y="48" textAnchor="middle" fill="#F5F1E8" fontSize="10" fontFamily="JetBrains Mono" fontWeight="bold">AMAZON S3 STANDARD</text>
          <text x="110" y="62" textAnchor="middle" fill="#d4a017" fontSize="8" fontFamily="JetBrains Mono">Assets Next.js &amp; Facturas PDF</text>
          <text x="110" y="75" textAnchor="middle" fill="#7a9b5c" fontSize="8" fontFamily="JetBrains Mono">$0.023 / GB · Acceso caliente</text>

          <line x1="200" y1="55" x2="250" y2="55" stroke="#d4a017" strokeWidth="2" strokeDasharray="4 4" />

          {/* Node 2: Amazon EFS */}
          <rect x="250" y="20" width="180" height="70" rx="4" fill="#141418" stroke="#7a9b5c" strokeWidth="1.5" />
          <text x="340" y="48" textAnchor="middle" fill="#F5F1E8" fontSize="10" fontFamily="JetBrains Mono" fontWeight="bold">AMAZON EFS (POSIX)</text>
          <text x="340" y="62" textAnchor="middle" fill="#7a9b5c" fontSize="8" fontFamily="JetBrains Mono">Código 10 Practicantes (NFSv4)</text>
          <text x="340" y="75" textAnchor="middle" fill="#d4a017" fontSize="8" fontFamily="JetBrains Mono">Lectura/Escritura concurrente</text>

          <line x1="430" y1="55" x2="480" y2="55" stroke="#e8a0bf" strokeWidth="2" strokeDasharray="4 4" />

          {/* Node 3: S3 Glacier */}
          <rect x="480" y="20" width="180" height="70" rx="4" fill="#141418" stroke="#e8a0bf" strokeWidth="1.5" />
          <text x="570" y="48" textAnchor="middle" fill="#F5F1E8" fontSize="10" fontFamily="JetBrains Mono" fontWeight="bold">S3 GLACIER ARCHIVE</text>
          <text x="570" y="62" textAnchor="middle" fill="#e8a0bf" fontSize="8" fontFamily="JetBrains Mono">Auditoría SUNAT (5-10 años)</text>
          <text x="570" y="75" textAnchor="middle" fill="#7a9b5c" fontSize="8" fontFamily="JetBrains Mono">$0.00099 / GB · -95.6% ahorro</text>
        </svg>
      </div>

      {/* S3 Lifecycle Interactive Tiering Calculator */}
      <div
        style={{
          padding: "0.85rem",
          background: "rgba(15,15,18,0.8)",
          border: "1px solid rgba(245,241,232,0.1)",
          display: "flex",
          flexDirection: "column",
          gap: "0.6rem",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.72rem", color: "#d4a017", fontWeight: 700 }}>
            SIMULADOR DE REGLAS DE CICLO DE VIDA (S3 LIFECYCLE):
          </span>
          <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.72rem", color: "#7a9b5c", fontWeight: 700 }}>
            AHORRO ESTIMADO: {tier.savings}
          </span>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "0.5rem" }}>
          {[
            { day: 0, label: "DÍAS 1–30 (S3 Standard)" },
            { day: 30, label: "DÍAS 30–90 (S3 IA)" },
            { day: 90, label: "DÍAS 90+ (Glacier)" },
          ].map((item) => (
            <button
              key={item.day}
              type="button"
              onClick={() => setLifecycleDay(item.day)}
              style={{
                background: lifecycleDay === item.day ? "rgba(122,155,92,0.25)" : "rgba(255,255,255,0.04)",
                color: lifecycleDay === item.day ? "#7a9b5c" : "rgba(245,241,232,0.6)",
                border: lifecycleDay === item.day ? "1px solid #7a9b5c" : "1px solid rgba(245,241,232,0.1)",
                padding: "0.4rem 0.5rem",
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: "0.68rem",
                fontWeight: 700,
                cursor: "pointer",
                transition: "all 0.2s ease",
              }}
            >
              {item.label}
            </button>
          ))}
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", background: "#08080a", padding: "0.5rem 0.75rem", fontFamily: "'JetBrains Mono', monospace", fontSize: "0.70rem" }}>
          <span style={{ color: "rgba(245,241,232,0.7)" }}>CAPA ACTIVA: <strong style={{ color: "#F5F1E8" }}>{tier.name}</strong></span>
          <span style={{ color: "rgba(245,241,232,0.7)" }}>COSTO / GB: <strong style={{ color: "#7a9b5c" }}>${tier.costGB} USD</strong></span>
          <span style={{ color: "rgba(245,241,232,0.7)" }}>LATENCIA: <strong style={{ color: "#d4a017" }}>{tier.latency}</strong></span>
        </div>
      </div>

      {/* Protocol & SLA Matrix */}
      <div
        style={{
          padding: "0.75rem",
          background: "rgba(8,8,10,0.8)",
          border: "1px solid rgba(245,241,232,0.12)",
        }}
      >
        <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.72rem", color: "#d4a017", fontWeight: 700, display: "block", marginBottom: "0.4rem" }}>
          COMPARATIVA DE PROTOCOLOS Y RESILIENCIA:
        </span>

        <table style={{ width: "100%", borderCollapse: "collapse", fontFamily: "'JetBrains Mono', monospace", fontSize: "0.68rem" }}>
          <thead>
            <tr style={{ borderBottom: "1px solid rgba(245,241,232,0.15)", color: "rgba(245,241,232,0.5)" }}>
              <th style={{ textAlign: "left", padding: "0.3rem" }}>SERVICIO</th>
              <th style={{ textAlign: "left", padding: "0.3rem" }}>PROTOCOLO</th>
              <th style={{ textAlign: "left", padding: "0.3rem" }}>ACCESO CONCURRENTE</th>
              <th style={{ textAlign: "left", padding: "0.3rem" }}>CASO DE USO MTA</th>
            </tr>
          </thead>
          <tbody>
            <tr style={{ borderBottom: "1px solid rgba(245,241,232,0.06)" }}>
              <td style={{ padding: "0.35rem", color: "#d4a017" }}>Amazon S3</td>
              <td style={{ padding: "0.35rem", color: "#F5F1E8" }}>REST HTTPS / Object API</td>
              <td style={{ padding: "0.35rem", color: "#7a9b5c" }}>Ilimitado (Escala Masiva)</td>
              <td style={{ padding: "0.35rem", color: "rgba(245,241,232,0.8)" }}>Assets Web &amp; Facturas PDF</td>
            </tr>
            <tr style={{ borderBottom: "1px solid rgba(245,241,232,0.06)" }}>
              <td style={{ padding: "0.35rem", color: "#7a9b5c" }}>Amazon EFS</td>
              <td style={{ padding: "0.35rem", color: "#F5F1E8" }}>NFSv4.1 POSIX File System</td>
              <td style={{ padding: "0.35rem", color: "#7a9b5c" }}>10 Practicantes en paralelo</td>
              <td style={{ padding: "0.35rem", color: "rgba(245,241,232,0.8)" }}>Repositorios &amp; Nodos compartidos</td>
            </tr>
            <tr>
              <td style={{ padding: "0.35rem", color: "#e8a0bf" }}>S3 Glacier</td>
              <td style={{ padding: "0.35rem", color: "#F5F1E8" }}>Vault Lock / Batch API</td>
              <td style={{ padding: "0.35rem", color: "rgba(245,241,232,0.6)" }}>Recuperación bajo demanda</td>
              <td style={{ padding: "0.35rem", color: "rgba(245,241,232,0.8)" }}>Archivado Tributario SUNAT</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default StorageArchitecturePanel;
