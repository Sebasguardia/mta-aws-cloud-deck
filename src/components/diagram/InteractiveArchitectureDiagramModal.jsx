// src/components/diagram/InteractiveArchitectureDiagramModal.jsx
import React, { useState } from "react";
import {
  X,
  Laptop,
  Smartphone,
  Users,
  Radio,
  Globe,
  Shield,
  Layers,
  Network,
  Server,
  Lock,
  Cpu,
  Database,
  ArrowRight,
  Activity,
  Wallet,
  UserCheck,
  RotateCcw
} from "lucide-react";

export function InteractiveArchitectureDiagramModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  // Estado para resaltar cada paso al hacer clic abajo
  const [highlightStep, setHighlightStep] = useState(0);

  // Icono oficial AWS con fondo nítido
  const AwsServiceIcon = ({ icon: Icon, color, size = 46, iconSize = 26, badge }) => (
    <div style={{ position: "relative", display: "inline-block" }}>
      <div
        style={{
          width: size,
          height: size,
          borderRadius: "7px",
          background: color,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#FFFFFF",
          boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
          flexShrink: 0,
        }}
      >
        <Icon size={iconSize} strokeWidth={1.8} />
      </div>
      {badge && (
        <div
          style={{
            position: "absolute",
            top: -6,
            left: -6,
            width: 20,
            height: 20,
            borderRadius: "50%",
            background: "#16191F",
            border: "2px solid #FFFFFF",
            color: "#FFFFFF",
            fontSize: "0.72rem",
            fontWeight: 600,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 2px 4px rgba(0,0,0,0.3)",
          }}
        >
          {badge}
        </div>
      )}
    </div>
  );

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 99999,
        background: "rgba(10, 15, 25, 0.88)",
        backdropFilter: "blur(12px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "0.5rem",
        overflow: "hidden",
      }}
    >
      {/* ── CONTENEDOR MODAL BLANCO (100% PANTALLA COMPLETA // CERO SCROLL) ── */}
      <div
        style={{
          width: "100%",
          maxWidth: "1540px",
          height: "98vh",
          maxHeight: "940px",
          background: "#FFFFFF",
          borderRadius: "8px",
          boxShadow: "0 30px 80px rgba(0,0,0,0.45)",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          border: "1px solid #D5DBDB",
        }}
      >
        {/* ── CABECERA SUPERIOR (Estilo exacto AWS + MTA SOFTWARE) ── */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "0.6rem 1.4rem",
            background: "#FFFFFF",
            borderBottom: "1.5px solid #EAEDED",
            flexShrink: 0,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "1.2rem" }}>
            {/* Logo AWS */}
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
              <span
                style={{
                  fontFamily: "system-ui, -apple-system, sans-serif",
                  fontSize: "1.6rem",
                  fontWeight: 700,
                  color: "#232F3E",
                  lineHeight: 1,
                  letterSpacing: "-0.04em",
                }}
              >
                aws
              </span>
              <div
                style={{
                  width: "30px",
                  height: "3.5px",
                  background: "#FF9900",
                  borderRadius: "2px",
                  marginTop: "2px",
                }}
              />
            </div>

            {/* Separador vertical */}
            <div style={{ width: "1.5px", height: "36px", background: "#D5DBDB" }} />

            <div>
              <h2
                style={{
                  fontFamily: "system-ui, -apple-system, sans-serif",
                  fontSize: "1.3rem",
                  fontWeight: 600,
                  color: "#16191F",
                  margin: 0,
                  letterSpacing: "-0.01em",
                }}
              >
                Arquitectura de Red en AWS - MTA SOFTWARE
              </h2>
              <div
                style={{
                  fontFamily: "system-ui, sans-serif",
                  fontSize: "0.88rem",
                  fontWeight: 400,
                  color: "#5C6B73",
                  marginTop: "0.1rem",
                }}
              >
                Alta disponibilidad Multi-AZ, seguridad perimetral L7/L4 y flujo continuo de paquetes
              </div>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "0.8rem" }}>
            {/* Botón reset / interactivo */}
            <button
              type="button"
              onClick={() => setHighlightStep(0)}
              style={{
                background: highlightStep !== 0 ? "#F2F3F3" : "#FFFFFF",
                border: "1px solid #D5DBDB",
                color: "#16191F",
                padding: "0.4rem 0.85rem",
                borderRadius: "4px",
                cursor: "pointer",
                fontFamily: "system-ui, sans-serif",
                fontSize: "0.82rem",
                fontWeight: 500,
                display: "flex",
                alignItems: "center",
                gap: "0.4rem",
                transition: "all 0.15s ease",
              }}
            >
              <RotateCcw size={15} />
              <span>Ver Todo</span>
            </button>

            {/* Botón de cerrar */}
            <button
              type="button"
              onClick={onClose}
              style={{
                background: "#DD344C",
                border: "none",
                color: "#FFFFFF",
                padding: "0.45rem 1.1rem",
                borderRadius: "4px",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "0.45rem",
                fontFamily: "system-ui, sans-serif",
                fontSize: "0.82rem",
                fontWeight: 600,
                boxShadow: "0 2px 6px rgba(221, 52, 76, 0.3)",
                transition: "all 0.15s ease",
              }}
            >
              <X size={17} />
              <span>CERRAR VISTA</span>
            </button>
          </div>
        </div>

        {/* ── CUERPO PRINCIPAL DEL DIAGRAMA ── */}
        <div
          style={{
            flex: 1,
            padding: "0.65rem 1.2rem 0.55rem 1.2rem",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            background: "#FFFFFF",
            overflow: "hidden",
            position: "relative",
          }}
        >
          {/* ════════════════════════════════════════════════════════════
              ÁREA SUPERIOR DE LAS 4 COLUMNAS DEL DIAGRAMA
          ════════════════════════════════════════════════════════════ */}
          <div
            style={{
              flex: 1,
              display: "grid",
              gridTemplateColumns: "145px 285px 1fr 205px",
              gap: "1.1rem",
              alignItems: "stretch",
              position: "relative",
              minHeight: 0,
            }}
          >
            {/* ──────────────────────────────────────────────────────
                CAJA 1: USUARIOS / CLIENTES
            ────────────────────────────────────────────────────── */}
            <div
              style={{
                border: highlightStep === 1 ? "2px solid #0073BB" : "1.5px solid #232F3E",
                borderRadius: "5px",
                background: highlightStep === 1 ? "rgba(0, 115, 187, 0.04)" : "#FFFFFF",
                padding: "0.6rem 0.5rem",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                alignItems: "center",
                textAlign: "center",
                position: "relative",
                transition: "all 0.2s ease",
              }}
            >
              <div>
                <div style={{ fontFamily: "system-ui, sans-serif", fontSize: "0.92rem", fontWeight: 600, color: "#16191F" }}>
                  Usuarios / Clientes
                </div>
                <div style={{ fontFamily: "system-ui, sans-serif", fontSize: "0.75rem", fontWeight: 400, color: "#5C6B73", marginTop: "0.15rem" }}>
                  Navegadores Web / Apps
                </div>
                <div style={{ fontFamily: "system-ui, sans-serif", fontSize: "0.72rem", fontWeight: 400, color: "#5C6B73" }}>
                  + 10 Practicantes
                </div>
              </div>

              {/* Icono Laptop */}
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                <Laptop size={40} strokeWidth={1.5} style={{ color: "#232F3E" }} />
                <span style={{ fontFamily: "system-ui, sans-serif", fontSize: "0.82rem", color: "#16191F", fontWeight: 500, marginTop: "0.2rem" }}>
                  Usuarios Web
                </span>
                <span style={{ fontFamily: "system-ui, sans-serif", fontSize: "0.72rem", fontWeight: 400, color: "#68737D" }}>
                  (Lima / Perú)
                </span>
              </div>

              {/* Icono Smartphone */}
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                <Smartphone size={36} strokeWidth={1.5} style={{ color: "#232F3E" }} />
                <span style={{ fontFamily: "system-ui, sans-serif", fontSize: "0.82rem", color: "#16191F", fontWeight: 500, marginTop: "0.2rem" }}>
                  Apps Móviles
                </span>
              </div>

              {/* Icono Practicantes Remotos */}
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                <Users size={36} strokeWidth={1.5} style={{ color: "#232F3E" }} />
                <span style={{ fontFamily: "system-ui, sans-serif", fontSize: "0.82rem", color: "#16191F", fontWeight: 500, marginTop: "0.2rem" }}>
                  Practicantes
                </span>
                <span style={{ fontFamily: "system-ui, sans-serif", fontSize: "0.72rem", fontWeight: 400, color: "#68737D" }}>
                  (10 Remotos)
                </span>
              </div>
            </div>

            {/* ──────────────────────────────────────────────────────
                CAJA 2: AWS CLOUD (GLOBAL)
            ────────────────────────────────────────────────────── */}
            <div
              style={{
                border: "1.5px solid #232F3E",
                borderRadius: "5px",
                background: "#FFFFFF",
                padding: "0.6rem 0.75rem",
                display: "flex",
                flexDirection: "column",
                position: "relative",
              }}
            >
              {/* Header AWS Cloud (Global) */}
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.45rem" }}>
                <div style={{ background: "#232F3E", color: "#FFFFFF", padding: "0.15rem 0.38rem", borderRadius: "3px", fontFamily: "system-ui, sans-serif", fontSize: "0.7rem", fontWeight: 700 }}>
                  aws
                </div>
                <span style={{ fontFamily: "system-ui, sans-serif", fontSize: "0.92rem", fontWeight: 600, color: "#16191F" }}>
                  AWS Cloud (Global)
                </span>
              </div>

              {/* Caja morada punteada: Servicios Globales */}
              <div
                style={{
                  flex: 1,
                  border: "1.5px dashed #8C4FFF",
                  borderRadius: "4px",
                  padding: "0.5rem 0.65rem",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  position: "relative",
                  background: "rgba(140, 79, 255, 0.02)",
                }}
              >
                <div style={{ fontFamily: "system-ui, sans-serif", fontSize: "0.82rem", fontWeight: 600, color: "#8C4FFF", marginBottom: "0.2rem" }}>
                  Servicios Globales
                </div>

                {/* Grid interno: Route 53, CloudFront, WAF y S3 a la derecha */}
                <div style={{ display: "grid", gridTemplateColumns: "1.2fr 0.95fr", gap: "0.5rem", alignItems: "center", flex: 1 }}>
                  
                  {/* Columna Izquierda: Route 53 -> CloudFront -> WAF */}
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "space-around", height: "100%" }}>
                    
                    {/* Route 53 (Paso 3) */}
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center" }}>
                      <AwsServiceIcon icon={Radio} color="#8C4FFF" size={46} iconSize={24} badge="3" />
                      <div style={{ fontFamily: "system-ui, sans-serif", fontSize: "0.82rem", fontWeight: 500, color: "#16191F", marginTop: "0.2rem" }}>
                        Amazon Route 53
                      </div>
                      <div style={{ fontFamily: "system-ui, sans-serif", fontSize: "0.72rem", fontWeight: 400, color: "#5C6B73" }}>
                        DNS Global · SLA 100%
                      </div>
                    </div>

                    {/* Conector limpio */}
                    <div style={{ width: "2px", height: "14px", background: "#8C4FFF", margin: "0.1rem 0" }} />

                    {/* CloudFront (Paso 2) */}
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center" }}>
                      <AwsServiceIcon icon={Globe} color="#E7157B" size={46} iconSize={24} badge="2" />
                      <div style={{ fontFamily: "system-ui, sans-serif", fontSize: "0.82rem", fontWeight: 500, color: "#16191F", marginTop: "0.2rem" }}>
                        Amazon CloudFront
                      </div>
                      <div style={{ fontFamily: "system-ui, sans-serif", fontSize: "0.72rem", fontWeight: 400, color: "#5C6B73" }}>
                        Edge PoP Lima (SLA 99.9%)
                      </div>
                    </div>

                    {/* Conector limpio */}
                    <div style={{ width: "2px", height: "14px", background: "#DD344C", margin: "0.1rem 0" }} />

                    {/* AWS WAF / Shield */}
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center" }}>
                      <AwsServiceIcon icon={Shield} color="#DD344C" size={44} iconSize={22} />
                      <div style={{ fontFamily: "system-ui, sans-serif", fontSize: "0.8rem", fontWeight: 500, color: "#16191F", marginTop: "0.2rem" }}>
                        AWS WAF / Shield
                      </div>
                      <div style={{ fontFamily: "system-ui, sans-serif", fontSize: "0.7rem", fontWeight: 400, color: "#5C6B73" }}>
                        Protección DDoS · Capa 7
                      </div>
                    </div>
                  </div>

                  {/* Columna Derecha: Amazon S3 conectado a CloudFront */}
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", height: "100%", borderLeft: "1.5px dashed #D5DBDB", paddingLeft: "0.4rem" }}>
                    
                    <div style={{ width: "20px", height: "2px", background: "#7AA116", marginBottom: "0.3rem" }} />

                    <AwsServiceIcon icon={Layers} color="#7AA116" size={46} iconSize={24} />
                    <div style={{ fontFamily: "system-ui, sans-serif", fontSize: "0.82rem", fontWeight: 500, color: "#16191F", marginTop: "0.25rem" }}>
                      Amazon S3
                    </div>
                    <div style={{ fontFamily: "system-ui, sans-serif", fontSize: "0.72rem", fontWeight: 400, color: "#5C6B73", lineHeight: 1.25 }}>
                      Frontend estático<br />(React / Vite / Next)
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* ──────────────────────────────────────────────────────
                CAJA 3: REGIÓN us-east-1 // AMAZON VPC (10.0.0.0/16)
            ────────────────────────────────────────────────────── */}
            <div
              style={{
                border: "2px dashed #00A4A6",
                borderRadius: "5px",
                background: "#FFFFFF",
                padding: "0.6rem 0.85rem",
                display: "flex",
                flexDirection: "column",
                position: "relative",
              }}
            >
              {/* Header Región */}
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.45rem" }}>
                <div style={{ background: "#00A4A6", color: "#FFFFFF", padding: "0.15rem 0.38rem", borderRadius: "3px", display: "flex", alignItems: "center" }}>
                  <Server size={14} />
                </div>
                <span style={{ fontFamily: "system-ui, sans-serif", fontSize: "0.94rem", fontWeight: 600, color: "#16191F" }}>
                  Región: us-east-1 (N. Virginia)
                </span>
              </div>

              {/* CAJA MORADA SÓLIDA: VPC (10.0.0.0/16) */}
              <div
                style={{
                  flex: 1,
                  border: "1.5px solid #8C4FFF",
                  borderRadius: "5px",
                  background: "#FFFFFF",
                  padding: "0.55rem 0.85rem",
                  display: "flex",
                  flexDirection: "column",
                  position: "relative",
                }}
              >
                {/* Header VPC + Internet Gateway (IGW) */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.4rem" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.45rem" }}>
                    <div style={{ background: "#8C4FFF", color: "#FFFFFF", padding: "0.15rem 0.38rem", borderRadius: "3px", fontSize: "0.72rem", fontWeight: 700 }}>
                      VPC
                    </div>
                    <span style={{ fontFamily: "system-ui, sans-serif", fontSize: "0.9rem", fontWeight: 600, color: "#16191F" }}>
                      VPC (10.0.0.0/16)
                    </span>
                  </div>

                  {/* Internet Gateway (IGW) */}
                  <div style={{ display: "flex", alignItems: "center", gap: "0.45rem", background: "rgba(140, 79, 255, 0.06)", padding: "0.2rem 0.6rem", borderRadius: "4px", border: "1px solid #D5DBDB" }}>
                    <AwsServiceIcon icon={Network} color="#8C4FFF" size={34} iconSize={18} />
                    <span style={{ fontFamily: "system-ui, sans-serif", fontSize: "0.82rem", fontWeight: 500, color: "#16191F" }}>
                      Internet Gateway (IGW)
                    </span>
                  </div>
                </div>

                {/* Application Load Balancer (ALB) Multi-AZ */}
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", margin: "0.1rem 0 0.5rem 0" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.65rem", background: "rgba(140, 79, 255, 0.06)", border: "1.5px solid #8C4FFF", padding: "0.3rem 1.1rem", borderRadius: "5px", boxShadow: "0 2px 6px rgba(140,79,255,0.12)" }}>
                    <AwsServiceIcon icon={Network} color="#8C4FFF" size={36} iconSize={20} />
                    <div style={{ textAlign: "left" }}>
                      <div style={{ fontFamily: "system-ui, sans-serif", fontSize: "0.86rem", fontWeight: 600, color: "#16191F" }}>
                        Application Load Balancer (ALB)
                      </div>
                      <div style={{ fontFamily: "system-ui, sans-serif", fontSize: "0.74rem", fontWeight: 400, color: "#5C6B73" }}>
                        Multi-AZ Balanceo Activo / Pasivo
                      </div>
                    </div>
                  </div>
                </div>

                {/* ── LAS DOS ZONAS DE DISPONIBILIDAD (AZ-A & AZ-B) ── */}
                <div style={{ flex: 1, display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.85rem", position: "relative" }}>
                  
                  {/* ══════════════════════════════
                      ZONA DE DISPONIBILIDAD A (us-east-1a)
                  ══════════════════════════════ */}
                  <div
                    style={{
                      border: "1.5px dashed #00A4A6",
                      borderRadius: "5px",
                      background: "#FFFFFF",
                      padding: "0.5rem 0.65rem",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between",
                    }}
                  >
                    <div style={{ fontFamily: "system-ui, sans-serif", fontSize: "0.84rem", fontWeight: 600, color: "#00A4A6", marginBottom: "0.3rem" }}>
                      Zona de Disponibilidad A (us-east-1a)
                    </div>

                    {/* Subred Pública A */}
                    <div style={{ border: "1px solid #6E8E59", borderRadius: "4px", background: "rgba(110, 142, 89, 0.06)", padding: "0.45rem 0.55rem" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.35rem", marginBottom: "0.3rem" }}>
                        <div style={{ background: "#6E8E59", color: "#FFF", width: 16, height: 16, borderRadius: "2px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                          <Lock size={10} />
                        </div>
                        <span style={{ fontFamily: "system-ui, sans-serif", fontSize: "0.78rem", fontWeight: 500, color: "#16191F" }}>
                          Subred Pública (10.0.1.0/24)
                        </span>
                      </div>
                      <div style={{ display: "flex", justifyContent: "space-around", alignItems: "center" }}>
                        <div style={{ textAlign: "center" }}>
                          <AwsServiceIcon icon={Network} color="#E7157B" size={36} iconSize={18} />
                          <div style={{ fontFamily: "system-ui, sans-serif", fontSize: "0.74rem", fontWeight: 500, color: "#16191F", marginTop: "0.15rem" }}>
                            NAT Gateway A
                          </div>
                        </div>
                        <div style={{ textAlign: "center" }}>
                          <AwsServiceIcon icon={Cpu} color="#FF9900" size={36} iconSize={18} />
                          <div style={{ fontFamily: "system-ui, sans-serif", fontSize: "0.74rem", fontWeight: 500, color: "#16191F", marginTop: "0.15rem" }}>
                            EC2 Frontend
                          </div>
                          <div style={{ fontFamily: "system-ui, sans-serif", fontSize: "0.66rem", fontWeight: 400, color: "#5C6B73" }}>
                            (Bastion / Web)
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Subred Privada A */}
                    <div style={{ border: "1px solid #0073BB", borderRadius: "4px", background: "rgba(0, 115, 187, 0.05)", padding: "0.45rem 0.55rem", marginTop: "0.35rem" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.35rem", marginBottom: "0.3rem" }}>
                        <div style={{ background: "#0073BB", color: "#FFF", width: 16, height: 16, borderRadius: "2px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                          <Lock size={10} />
                        </div>
                        <span style={{ fontFamily: "system-ui, sans-serif", fontSize: "0.78rem", fontWeight: 500, color: "#16191F" }}>
                          Subred Privada (10.0.10.0/24)
                        </span>
                      </div>
                      <div style={{ display: "flex", flexDirection: "column", gap: "0.35rem", alignItems: "center" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "0.55rem" }}>
                          <AwsServiceIcon icon={Cpu} color="#FF9900" size={36} iconSize={18} />
                          <div>
                            <div style={{ fontFamily: "system-ui, sans-serif", fontSize: "0.78rem", fontWeight: 500, color: "#16191F" }}>
                              EC2 Backend
                            </div>
                            <div style={{ fontFamily: "system-ui, sans-serif", fontSize: "0.68rem", fontWeight: 400, color: "#5C6B73" }}>
                              (Node.js / Express / NestJS)
                            </div>
                          </div>
                        </div>

                        {/* Security Group Port 5432 */}
                        <div style={{ border: "1.5px dashed #DD344C", padding: "0.2rem 0.65rem", borderRadius: "3px", background: "#FFFFFF", display: "flex", alignItems: "center", gap: "0.35rem" }}>
                          <Shield size={14} style={{ color: "#DD344C" }} />
                          <span style={{ fontFamily: "system-ui, sans-serif", fontSize: "0.72rem", fontWeight: 500, color: "#16191F" }}>
                            Security Group (Solo puerto 5432)
                          </span>
                        </div>

                        {/* RDS PostgreSQL Primaria */}
                        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center" }}>
                          <AwsServiceIcon icon={Database} color="#3399FF" size={38} iconSize={20} />
                          <div style={{ fontFamily: "system-ui, sans-serif", fontSize: "0.78rem", fontWeight: 500, color: "#16191F", marginTop: "0.15rem" }}>
                            RDS PostgreSQL
                          </div>
                          <div style={{ fontFamily: "system-ui, sans-serif", fontSize: "0.68rem", fontWeight: 400, color: "#5C6B73" }}>
                            (Master / Primaria)
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* ══════════════════════════════
                      ZONA DE DISPONIBILIDAD B (us-east-1b)
                  ══════════════════════════════ */}
                  <div
                    style={{
                      border: "1.5px dashed #00A4A6",
                      borderRadius: "5px",
                      background: "#FFFFFF",
                      padding: "0.5rem 0.65rem",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between",
                    }}
                  >
                    <div style={{ fontFamily: "system-ui, sans-serif", fontSize: "0.84rem", fontWeight: 600, color: "#00A4A6", marginBottom: "0.3rem" }}>
                      Zona de Disponibilidad B (us-east-1b)
                    </div>

                    {/* Subred Pública B */}
                    <div style={{ border: "1px solid #6E8E59", borderRadius: "4px", background: "rgba(110, 142, 89, 0.06)", padding: "0.45rem 0.55rem" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.35rem", marginBottom: "0.3rem" }}>
                        <div style={{ background: "#6E8E59", color: "#FFF", width: 16, height: 16, borderRadius: "2px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                          <Lock size={10} />
                        </div>
                        <span style={{ fontFamily: "system-ui, sans-serif", fontSize: "0.78rem", fontWeight: 500, color: "#16191F" }}>
                          Subred Pública (10.0.2.0/24)
                        </span>
                      </div>
                      <div style={{ display: "flex", justifyContent: "space-around", alignItems: "center" }}>
                        <div style={{ textAlign: "center" }}>
                          <AwsServiceIcon icon={Network} color="#E7157B" size={36} iconSize={18} />
                          <div style={{ fontFamily: "system-ui, sans-serif", fontSize: "0.74rem", fontWeight: 500, color: "#16191F", marginTop: "0.15rem" }}>
                            NAT Gateway B
                          </div>
                        </div>
                        <div style={{ textAlign: "center" }}>
                          <AwsServiceIcon icon={Network} color="#8C4FFF" size={36} iconSize={18} />
                          <div style={{ fontFamily: "system-ui, sans-serif", fontSize: "0.74rem", fontWeight: 500, color: "#16191F", marginTop: "0.15rem" }}>
                            ALB Standby
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Subred Privada B */}
                    <div style={{ border: "1px solid #0073BB", borderRadius: "4px", background: "rgba(0, 115, 187, 0.05)", padding: "0.45rem 0.55rem", marginTop: "0.35rem" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.35rem", marginBottom: "0.3rem" }}>
                        <div style={{ background: "#0073BB", color: "#FFF", width: 16, height: 16, borderRadius: "2px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                          <Lock size={10} />
                        </div>
                        <span style={{ fontFamily: "system-ui, sans-serif", fontSize: "0.78rem", fontWeight: 500, color: "#16191F" }}>
                          Subred Privada (10.0.20.0/24)
                        </span>
                      </div>
                      <div style={{ display: "flex", flexDirection: "column", gap: "0.55rem", alignItems: "center" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "0.55rem" }}>
                          <AwsServiceIcon icon={Cpu} color="#FF9900" size={36} iconSize={18} />
                          <div>
                            <div style={{ fontFamily: "system-ui, sans-serif", fontSize: "0.78rem", fontWeight: 500, color: "#16191F" }}>
                              EC2 Backend
                            </div>
                            <div style={{ fontFamily: "system-ui, sans-serif", fontSize: "0.68rem", fontWeight: 400, color: "#5C6B73" }}>
                              (Standby / Réplica)
                            </div>
                          </div>
                        </div>

                        {/* Espaciador para alinear con el Security Group de A */}
                        <div style={{ height: "24px" }} />

                        {/* RDS PostgreSQL Réplica Multi-AZ */}
                        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center" }}>
                          <AwsServiceIcon icon={Database} color="#3399FF" size={38} iconSize={20} />
                          <div style={{ fontFamily: "system-ui, sans-serif", fontSize: "0.78rem", fontWeight: 500, color: "#16191F", marginTop: "0.15rem" }}>
                            RDS PostgreSQL
                          </div>
                          <div style={{ fontFamily: "system-ui, sans-serif", fontSize: "0.68rem", fontWeight: 400, color: "#5C6B73" }}>
                            (Réplica Multi-AZ)
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Línea limpia de Replicación Continua de datos entre RDS Master y Standby */}
                <div
                  style={{
                    position: "absolute",
                    bottom: 20,
                    left: "26%",
                    right: "26%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "0.35rem",
                    borderTop: "1.5px dashed #232F3E",
                    paddingTop: "0.15rem",
                  }}
                >
                  <span style={{ fontFamily: "system-ui, sans-serif", fontSize: "0.7rem", fontWeight: 500, color: "#232F3E", background: "#FFFFFF", padding: "0 0.4rem" }}>
                    Replicación continua de datos
                  </span>
                  <ArrowRight size={14} strokeWidth={1.8} style={{ color: "#232F3E" }} />
                </div>
              </div>
            </div>

            {/* ──────────────────────────────────────────────────────
                CAJA 4: VPC ENDPOINTS / SERVICIOS COMPLEMENTARIOS
            ────────────────────────────────────────────────────── */}
            <div
              style={{
                border: "1.5px solid #232F3E",
                borderRadius: "5px",
                background: "#FFFFFF",
                padding: "0.6rem 0.65rem",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                textAlign: "center",
              }}
            >
              <div>
                <div style={{ fontFamily: "system-ui, sans-serif", fontSize: "0.88rem", fontWeight: 600, color: "#16191F" }}>
                  VPC Endpoints /
                </div>
                <div style={{ fontFamily: "system-ui, sans-serif", fontSize: "0.84rem", fontWeight: 600, color: "#16191F" }}>
                  Servicios Complementarios
                </div>
              </div>

              {/* Amazon S3 Backups */}
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                <AwsServiceIcon icon={Layers} color="#7AA116" size={44} iconSize={22} />
                <div style={{ fontFamily: "system-ui, sans-serif", fontSize: "0.82rem", fontWeight: 500, color: "#16191F", marginTop: "0.2rem" }}>
                  Amazon S3
                </div>
                <div style={{ fontFamily: "system-ui, sans-serif", fontSize: "0.72rem", fontWeight: 400, color: "#5C6B73" }}>
                  Backups y multimedia
                </div>
              </div>

              {/* Amazon CloudWatch */}
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                <AwsServiceIcon icon={Activity} color="#E7157B" size={44} iconSize={22} />
                <div style={{ fontFamily: "system-ui, sans-serif", fontSize: "0.82rem", fontWeight: 500, color: "#16191F", marginTop: "0.2rem" }}>
                  Amazon CloudWatch
                </div>
                <div style={{ fontFamily: "system-ui, sans-serif", fontSize: "0.72rem", fontWeight: 400, color: "#5C6B73" }}>
                  Métricas (CPU, RAM)
                </div>
              </div>

              {/* AWS Budgets + SNS */}
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                <AwsServiceIcon icon={Wallet} color="#FF9900" size={44} iconSize={22} />
                <div style={{ fontFamily: "system-ui, sans-serif", fontSize: "0.82rem", fontWeight: 500, color: "#16191F", marginTop: "0.2rem" }}>
                  AWS Budgets + SNS
                </div>
                <div style={{ fontFamily: "system-ui, sans-serif", fontSize: "0.72rem", fontWeight: 400, color: "#5C6B73" }}>
                  Alarma a $10.00 USD
                </div>
              </div>

              {/* AWS IAM */}
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                <AwsServiceIcon icon={UserCheck} color="#FF9900" size={44} iconSize={22} />
                <div style={{ fontFamily: "system-ui, sans-serif", fontSize: "0.82rem", fontWeight: 500, color: "#16191F", marginTop: "0.2rem" }}>
                  AWS IAM
                </div>
                <div style={{ fontFamily: "system-ui, sans-serif", fontSize: "0.72rem", fontWeight: 400, color: "#5C6B73" }}>
                  10 practicantes Zero Trust
                </div>
              </div>
            </div>
          </div>

          {/* ════════════════════════════════════════════════════════════
              ÁREA INFERIOR: FLUJO DE DATOS (6 PASOS // 30ms TOTAL)
          ════════════════════════════════════════════════════════════ */}
          <div
            style={{
              marginTop: "0.6rem",
              borderTop: "1.5px solid #EAEDED",
              paddingTop: "0.55rem",
              display: "flex",
              flexDirection: "column",
              gap: "0.4rem",
              flexShrink: 0,
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ fontFamily: "system-ui, sans-serif", fontSize: "0.92rem", fontWeight: 600, color: "#16191F" }}>
                Flujo de Datos (6 pasos)
              </div>
              <div style={{ fontFamily: "system-ui, sans-serif", fontSize: "0.76rem", fontWeight: 400, color: "#5C6B73" }}>
                Haz clic en cada paso para resaltar su etapa en el diagrama
              </div>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(6, 1fr) 155px",
                gap: "0.65rem",
                alignItems: "center",
              }}
            >
              {/* PASO 1 */}
              <div
                onClick={() => setHighlightStep(1)}
                style={{
                  border: highlightStep === 1 ? "2px solid #0073BB" : "1.5px solid #D5DBDB",
                  borderRadius: "5px",
                  padding: "0.45rem 0.5rem",
                  textAlign: "center",
                  background: highlightStep === 1 ? "#EBF4FB" : "#FFFFFF",
                  cursor: "pointer",
                  transition: "all 0.15s ease",
                }}
              >
                <div style={{ width: 22, height: 22, borderRadius: "50%", background: "#0073BB", color: "#FFF", fontSize: "0.74rem", fontWeight: 600, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 0.2rem auto" }}>
                  1
                </div>
                <div style={{ fontFamily: "system-ui, sans-serif", fontSize: "0.82rem", fontWeight: 500, color: "#16191F" }}>
                  Cliente / Usuario
                </div>
                <div style={{ fontFamily: "system-ui, sans-serif", fontSize: "0.72rem", fontWeight: 400, color: "#5C6B73" }}>
                  HTTPS :443
                </div>
                <div style={{ fontFamily: "system-ui, sans-serif", fontSize: "0.68rem", fontWeight: 400, color: "#879596" }}>
                  (0 ms)
                </div>
              </div>

              {/* PASO 2 */}
              <div
                onClick={() => setHighlightStep(2)}
                style={{
                  border: highlightStep === 2 ? "2px solid #E7157B" : "1.5px solid #D5DBDB",
                  borderRadius: "5px",
                  padding: "0.45rem 0.5rem",
                  textAlign: "center",
                  background: highlightStep === 2 ? "#FDEEF5" : "#FFFFFF",
                  cursor: "pointer",
                  transition: "all 0.15s ease",
                }}
              >
                <div style={{ width: 22, height: 22, borderRadius: "50%", background: "#E7157B", color: "#FFF", fontSize: "0.74rem", fontWeight: 600, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 0.2rem auto" }}>
                  2
                </div>
                <div style={{ fontFamily: "system-ui, sans-serif", fontSize: "0.82rem", fontWeight: 500, color: "#16191F" }}>
                  CloudFront
                </div>
                <div style={{ fontFamily: "system-ui, sans-serif", fontSize: "0.72rem", fontWeight: 400, color: "#5C6B73" }}>
                  Edge PoP Sudamérica
                </div>
                <div style={{ fontFamily: "system-ui, sans-serif", fontSize: "0.68rem", fontWeight: 400, color: "#879596" }}>
                  (+14 ms)
                </div>
              </div>

              {/* PASO 3 */}
              <div
                onClick={() => setHighlightStep(3)}
                style={{
                  border: highlightStep === 3 ? "2px solid #8C4FFF" : "1.5px solid #D5DBDB",
                  borderRadius: "5px",
                  padding: "0.45rem 0.5rem",
                  textAlign: "center",
                  background: highlightStep === 3 ? "#F5EFFF" : "#FFFFFF",
                  cursor: "pointer",
                  transition: "all 0.15s ease",
                }}
              >
                <div style={{ width: 22, height: 22, borderRadius: "50%", background: "#8C4FFF", color: "#FFF", fontSize: "0.74rem", fontWeight: 600, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 0.2rem auto" }}>
                  3
                </div>
                <div style={{ fontFamily: "system-ui, sans-serif", fontSize: "0.82rem", fontWeight: 500, color: "#16191F" }}>
                  Route 53
                </div>
                <div style={{ fontFamily: "system-ui, sans-serif", fontSize: "0.72rem", fontWeight: 400, color: "#5C6B73" }}>
                  DNS Routing
                </div>
                <div style={{ fontFamily: "system-ui, sans-serif", fontSize: "0.68rem", fontWeight: 400, color: "#879596" }}>
                  (+8 ms)
                </div>
              </div>

              {/* PASO 4 */}
              <div
                onClick={() => setHighlightStep(4)}
                style={{
                  border: highlightStep === 4 ? "2px solid #00A4A6" : "1.5px solid #D5DBDB",
                  borderRadius: "5px",
                  padding: "0.45rem 0.5rem",
                  textAlign: "center",
                  background: highlightStep === 4 ? "#EEFAFA" : "#FFFFFF",
                  cursor: "pointer",
                  transition: "all 0.15s ease",
                }}
              >
                <div style={{ width: 22, height: 22, borderRadius: "50%", background: "#00A4A6", color: "#FFF", fontSize: "0.74rem", fontWeight: 600, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 0.2rem auto" }}>
                  4
                </div>
                <div style={{ fontFamily: "system-ui, sans-serif", fontSize: "0.82rem", fontWeight: 500, color: "#16191F" }}>
                  IGW → ALB
                </div>
                <div style={{ fontFamily: "system-ui, sans-serif", fontSize: "0.72rem", fontWeight: 400, color: "#5C6B73" }}>
                  Entrada a VPC
                </div>
                <div style={{ fontFamily: "system-ui, sans-serif", fontSize: "0.68rem", fontWeight: 400, color: "#879596" }}>
                  (+3 ms)
                </div>
              </div>

              {/* PASO 5 */}
              <div
                onClick={() => setHighlightStep(5)}
                style={{
                  border: highlightStep === 5 ? "2px solid #DD344C" : "1.5px solid #D5DBDB",
                  borderRadius: "5px",
                  padding: "0.45rem 0.5rem",
                  textAlign: "center",
                  background: highlightStep === 5 ? "#FDF0F2" : "#FFFFFF",
                  cursor: "pointer",
                  transition: "all 0.15s ease",
                }}
              >
                <div style={{ width: 22, height: 22, borderRadius: "50%", background: "#DD344C", color: "#FFF", fontSize: "0.74rem", fontWeight: 600, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 0.2rem auto" }}>
                  5
                </div>
                <div style={{ fontFamily: "system-ui, sans-serif", fontSize: "0.82rem", fontWeight: 500, color: "#16191F" }}>
                  Security Groups
                </div>
                <div style={{ fontFamily: "system-ui, sans-serif", fontSize: "0.72rem", fontWeight: 400, color: "#5C6B73" }}>
                  Puerto 5432
                </div>
                <div style={{ fontFamily: "system-ui, sans-serif", fontSize: "0.68rem", fontWeight: 400, color: "#879596" }}>
                  (+1 ms)
                </div>
              </div>

              {/* PASO 6 */}
              <div
                onClick={() => setHighlightStep(6)}
                style={{
                  border: highlightStep === 6 ? "2px solid #3399FF" : "1.5px solid #D5DBDB",
                  borderRadius: "5px",
                  padding: "0.45rem 0.5rem",
                  textAlign: "center",
                  background: highlightStep === 6 ? "#EFF6FF" : "#FFFFFF",
                  cursor: "pointer",
                  transition: "all 0.15s ease",
                }}
              >
                <div style={{ width: 22, height: 22, borderRadius: "50%", background: "#3399FF", color: "#FFF", fontSize: "0.74rem", fontWeight: 600, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 0.2rem auto" }}>
                  6
                </div>
                <div style={{ fontFamily: "system-ui, sans-serif", fontSize: "0.82rem", fontWeight: 500, color: "#16191F" }}>
                  RDS PostgreSQL
                </div>
                <div style={{ fontFamily: "system-ui, sans-serif", fontSize: "0.72rem", fontWeight: 400, color: "#5C6B73" }}>
                  Base de Datos
                </div>
                <div style={{ fontFamily: "system-ui, sans-serif", fontSize: "0.68rem", fontWeight: 400, color: "#879596" }}>
                  (+4 ms)
                </div>
              </div>

              {/* LATENCIA TOTAL */}
              <div
                style={{
                  border: "1.5px solid #0073BB",
                  borderRadius: "5px",
                  background: "#F2F8FD",
                  padding: "0.45rem 0.6rem",
                  textAlign: "center",
                }}
              >
                <div style={{ fontFamily: "system-ui, sans-serif", fontSize: "0.72rem", fontWeight: 500, color: "#5C6B73" }}>
                  Latencia total
                </div>
                <div
                  style={{
                    fontFamily: "system-ui, -apple-system, sans-serif",
                    fontSize: "1.45rem",
                    fontWeight: 700,
                    color: "#0073BB",
                    lineHeight: 1.1,
                    margin: "0.1rem 0",
                  }}
                >
                  ~30 ms
                </div>
                <div style={{ fontFamily: "system-ui, sans-serif", fontSize: "0.72rem", fontWeight: 500, color: "#16191F" }}>
                  Respuesta: 200 OK
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
