// src/slides/S11_IAM.jsx
import React, { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import {
  Key,
  Shield,
  ShieldAlert,
  ShieldCheck,
  Lock,
  Unlock,
  UserCheck,
  Users,
  Check,
  AlertTriangle,
  Layers,
  ArrowRight,
} from "lucide-react";
import { slidesContent } from "../data/content.es.js";
import { projectMeta } from "../data/team.js";
import { useSlideActive } from "../hooks/useSlideActive.js";
import { useSharedDeckState } from "../hooks/useSharedDeckState.js";
import { IamSecurityCanvas } from "../components/three/IamSecurityCanvas.jsx";
import { CanvasTransitionWrapper } from "../components/motion/CanvasTransitionWrapper.jsx";
import { Badge } from "../components/ui/Badge.jsx";
import { easings } from "../lib/easings.js";

const c = slidesContent.s11_iam;

/**
 * S11 — Seguridad y Gobierno con AWS IAM.
 *
 * Directivas de diseño:
 *  - /industrial-brutalist-ui:
 *    Estética de terminal de ciberseguridad y control de acceso (#0A0A0A),
 *    rejilla técnica militar, bordes nítidos de 1px/2px, etiquetas monospace y
 *    distribución panorámica de pantalla completa 50%/50% sin barras de scroll ni recortes.
 *  - /impeccable:
 *    El Modelo de Responsabilidad Compartida de AWS y las 3 políticas de gobierno explicadas con rigor.
 *    Selector interactivo de los 10 practicantes con inspección perimetral de roles IAM y políticas de acceso.
 *  - /threejs-geometry + /threejs-animation + /threejs-interaction:
 *    `IamSecurityCanvas`: Escudo 3D criptográfico con los 10 nodos de practicantes que realizan morphing
 *    entre estar amontonados tras un candado root vulnerable vs una constelación de permisos mínimos individuales.
 *  - /emil-design-eng + /animate:
 *    Switch toggle brutalista interactivo: "1 Cuenta Root Compartida" ↔ "10 Usuarios IAM Segmentados",
 *    con interacción click en cada avatar para auditar su privilegio asignado.
 */
export function S11_IAM({ isActive: propActive } = {}) {
  const shouldReduceMotion = useReducedMotion();
  const hookActive = useSlideActive(10);
  const sectionRef = useRef(null);
  const [domActive, setDomActive] = useState(false);

  // Observador de mutación para Reveal.js .present
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const checkPresent = () => {
      setDomActive(el.classList.contains("present"));
    };
    checkPresent();
    const observer = new MutationObserver(checkPresent);
    observer.observe(el, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, []);

  const isActive = propActive !== undefined ? (propActive || domActive) : (hookActive || domActive);
  const [entered, setEntered] = useState(false);

  // Estado compartido de IAM
  const {
    iamMode,
    setIamMode,
    selectedUserForInspection,
    setSelectedUserForInspection,
  } = useSharedDeckState();

  const isRoot = iamMode === "root";

  // Activar entrada escalonada al montarse el slide
  useEffect(() => {
    if (isActive) {
      const timer = setTimeout(() => setEntered(true), 40);
      return () => clearTimeout(timer);
    } else {
      setEntered(false);
    }
  }, [isActive]);

  const fadeUp = (delay = 0) => ({
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 16 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: shouldReduceMotion ? 0.1 : 0.5, ease: [0.16, 1, 0.3, 1], delay },
    },
  });

  return (
    <section
      ref={sectionRef}
      className="slide-fullscreen"
      style={{
        width: "100%",
        height: "100%",
        position: "relative",
        background: "#0A0A0A",
        overflow: "hidden",
        display: "flex",
        flexDirection: "row",
      }}
    >
      {/* ── Retícula de fondo sutil ── */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "linear-gradient(rgba(245,241,232,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(245,241,232,0.025) 1px, transparent 1px)",
          backgroundSize: "64px 64px",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />

      {/* ── Scanlines analógicas tenues ── */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          background:
            "repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,0,0,0.07) 3px, rgba(0,0,0,0.07) 6px)",
          pointerEvents: "none",
          zIndex: 1,
        }}
      />

      {/* ── Luz ambiental según modo de seguridad ── */}
      <motion.div
        aria-hidden="true"
        animate={{
          opacity: isRoot ? 0.25 : 0.12,
        }}
        transition={{ duration: 0.5 }}
        style={{
          position: "absolute",
          inset: 0,
          background: isRoot
            ? "radial-gradient(circle at 75% 50%, rgba(198,67,43,0.25) 0%, transparent 65%)"
            : "radial-gradient(circle at 75% 50%, rgba(110,142,89,0.2) 0%, transparent 65%)",
          pointerEvents: "none",
          zIndex: 1,
        }}
      />

      {/* ── Barra de acento vertical izquierda según modo ── */}
      <motion.div
        aria-hidden="true"
        initial={{ transform: "scaleY(0)", transformOrigin: "top" }}
        animate={entered ? { transform: "scaleY(1)" } : { transform: "scaleY(0)" }}
        transition={{ duration: shouldReduceMotion ? 0.1 : 0.65, ease: [0.83, 0, 0.17, 1], delay: 0.05 }}
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          bottom: 0,
          width: 4,
          background: isRoot ? "#c6432b" : "#6e8e59",
          transition: "background 0.3s ease",
          zIndex: 3,
        }}
      />

      {/* ══════════════════════════════════════════════════════════
          COLUMNA IZQUIERDA (50%): Gobernanza IAM & Grid de Practicantes
      ══════════════════════════════════════════════════════════ */}
      <div
        style={{
          flex: "0 0 50%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "2.5rem 3rem 2.5rem 4.8rem",
          position: "relative",
          zIndex: 2,
          gap: "0.85rem",
        }}
      >
        {/* Header Editorial */}
        <div style={{ display: "flex", flexDirection: "column", gap: "0.2rem" }}>
          <motion.div
            variants={fadeUp(0.04)}
            initial="hidden"
            animate={entered ? "visible" : "hidden"}
            style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}
          >
            <span
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: "0.65rem",
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                fontWeight: 700,
                color: isRoot ? "#c6432b" : "#6e8e59",
                background: isRoot ? "rgba(198,67,43,0.12)" : "rgba(110,142,89,0.12)",
                border: isRoot ? "1px solid rgba(198,67,43,0.4)" : "1px solid rgba(110,142,89,0.4)",
                padding: "0.25rem 0.65rem",
                transition: "all 0.3s ease",
              }}
            >
              [ {c.badge} ]
            </span>
            <span
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: "0.62rem",
                letterSpacing: "0.15em",
                color: "rgba(245,241,232,0.45)",
              }}
            >
              SEC_11 // IDENTITY_AND_ACCESS_MANAGEMENT
            </span>
          </motion.div>

          <motion.p
            variants={fadeUp(0.08)}
            initial="hidden"
            animate={entered ? "visible" : "hidden"}
            style={{
              fontFamily: "Yellowtail, cursive",
              fontSize: "clamp(1.3rem, 2vw, 1.8rem)",
              color: "#e8a0bf",
              lineHeight: 1.1,
              margin: "0.15rem 0 0 0",
            }}
          >
            {c.scriptTag}
          </motion.p>

          <motion.h1
            variants={fadeUp(0.12)}
            initial="hidden"
            animate={entered ? "visible" : "hidden"}
            style={{
              fontFamily: "'Archivo Black', 'Arial Black', sans-serif",
              fontSize: "clamp(1.7rem, 2.5vw, 2.4rem)",
              color: "#F5F1E8",
              letterSpacing: "-0.025em",
              lineHeight: 1.05,
              textTransform: "uppercase",
              margin: 0,
            }}
          >
            {c.title}
          </motion.h1>

          <motion.p
            variants={fadeUp(0.16)}
            initial="hidden"
            animate={entered ? "visible" : "hidden"}
            style={{
              fontFamily: "system-ui, -apple-system, sans-serif",
              fontSize: "clamp(0.85rem, 1.05vw, 0.95rem)",
              color: "rgba(245,241,232,0.65)",
              margin: "0.2rem 0 0 0",
              lineHeight: 1.4,
            }}
          >
            {c.subtitle}
          </motion.p>
        </div>

        {/* Switch Táctil de Control de Acceso: Root vs IAM */}
        <motion.div
          variants={fadeUp(0.20)}
          initial="hidden"
          animate={entered ? "visible" : "hidden"}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "0.45rem 0.6rem",
            background: "rgba(18,18,18,0.9)",
            border: "1.5px solid rgba(245,241,232,0.15)",
            boxShadow: "4px 4px 0px #000000",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", paddingLeft: "0.4rem" }}>
            <Key size={14} style={{ color: isRoot ? "#c6432b" : "#6e8e59" }} />
            <span
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: "0.62rem",
                letterSpacing: "0.15em",
                color: "rgba(245,241,232,0.7)",
                textTransform: "uppercase",
                fontWeight: 700,
              }}
            >
              POLÍTICA DE GOBIERNO
            </span>
          </div>

          <div style={{ display: "flex", gap: "0.3rem" }}>
            <button
              type="button"
              onClick={() => {
                setIamMode("root");
                setSelectedUserForInspection(null);
              }}
              style={{
                fontFamily: "'Archivo Black', sans-serif",
                fontSize: "0.65rem",
                textTransform: "uppercase",
                padding: "0.4rem 0.85rem",
                letterSpacing: "0.05em",
                cursor: "pointer",
                border: "1px solid",
                borderColor: isRoot ? "#c6432b" : "rgba(245,241,232,0.1)",
                background: isRoot ? "#c6432b" : "transparent",
                color: isRoot ? "#FFFFFF" : "rgba(245,241,232,0.5)",
                transition: "all 0.15s ease",
              }}
            >
              HOSTINGER: ACCESO CENTRALIZADO
            </button>

            <button
              type="button"
              onClick={() => {
                setIamMode("iam");
                if (!selectedUserForInspection) {
                  setSelectedUserForInspection(projectMeta.teamMembers[0]);
                }
              }}
              style={{
                fontFamily: "'Archivo Black', sans-serif",
                fontSize: "0.65rem",
                textTransform: "uppercase",
                padding: "0.4rem 0.85rem",
                letterSpacing: "0.05em",
                cursor: "pointer",
                border: "1px solid",
                borderColor: !isRoot ? "#6e8e59" : "rgba(245,241,232,0.1)",
                background: !isRoot ? "#6e8e59" : "transparent",
                color: !isRoot ? "#0A0A0A" : "rgba(245,241,232,0.5)",
                transition: "all 0.15s ease",
              }}
            >
              AWS IAM: 10 USUARIOS INDIVIDUALES
            </button>
          </div>
        </motion.div>

        {/* ── 2 PILARES DE LA SOLUCIÓN AWS IAM (Requerimiento Técnico Central) ── */}
        <motion.div
          variants={fadeUp(0.24)}
          initial="hidden"
          animate={entered ? "visible" : "hidden"}
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "0.55rem",
          }}
        >
          {/* Pilar 1: Bloqueo de Cuenta Root */}
          <div
            style={{
              padding: "0.6rem 0.75rem",
              background: "rgba(198,67,43,0.06)",
              border: "1px solid rgba(198,67,43,0.35)",
              borderTop: "2px solid #c6432b",
              display: "flex",
              flexDirection: "column",
              gap: "0.25rem",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
              <Lock size={12} style={{ color: "#c6432b" }} />
              <span
                style={{
                  fontFamily: "'Archivo Black', sans-serif",
                  fontSize: "0.66rem",
                  color: "#F5F1E8",
                  textTransform: "uppercase",
                  letterSpacing: "0.02em",
                }}
              >
                1. BLOQUEO CUENTA ROOT
              </span>
            </div>
            <p
              style={{
                fontFamily: "system-ui, sans-serif",
                fontSize: "0.68rem",
                color: "rgba(245,241,232,0.75)",
                lineHeight: 1.35,
                margin: 0,
              }}
            >
              La cuenta raíz de AWS se sella con autenticación multifactor (MFA) física y se almacena bajo custodia estricta; prohibida para despliegues diarios.
            </p>
          </div>

          {/* Pilar 2: Principio de Mínimo Privilegio */}
          <div
            style={{
              padding: "0.6rem 0.75rem",
              background: "rgba(110,142,89,0.06)",
              border: "1px solid rgba(110,142,89,0.35)",
              borderTop: "2px solid #6e8e59",
              display: "flex",
              flexDirection: "column",
              gap: "0.25rem",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
              <ShieldCheck size={13} style={{ color: "#6e8e59" }} />
              <span
                style={{
                  fontFamily: "'Archivo Black', sans-serif",
                  fontSize: "0.66rem",
                  color: "#F5F1E8",
                  textTransform: "uppercase",
                  letterSpacing: "0.02em",
                }}
              >
                2. MÍNIMO PRIVILEGIO (ZERO TRUST)
              </span>
            </div>
            <p
              style={{
                fontFamily: "system-ui, sans-serif",
                fontSize: "0.68rem",
                color: "rgba(245,241,232,0.75)",
                lineHeight: 1.35,
                margin: 0,
              }}
            >
              Los 10 practicantes reciben identidades IAM individuales con permisos exactos a su rol (ej: Frontend solo buckets S3 y CloudFront; sin acceso a BD ni redes).
            </p>
          </div>
        </motion.div>

        {/* Selector de Entidades de Identidad: Botón Cuenta Root + Matriz de Practicantes */}
        <div style={{ position: "relative" }}>
          {/* Barra de Acceso Rápido a Cuenta Root */}
          <motion.div
            variants={fadeUp(0.28)}
            initial="hidden"
            animate={entered ? "visible" : "hidden"}
            style={{
              marginBottom: "0.5rem",
            }}
          >
            <button
              type="button"
              onClick={() => {
                setIamMode("root");
                setSelectedUserForInspection(null);
              }}
              style={{
                width: "100%",
                padding: "0.45rem 0.75rem",
                background: isRoot ? "rgba(198,67,43,0.22)" : "rgba(20,20,20,0.8)",
                border: isRoot ? "1.5px solid #c6432b" : "1px dashed rgba(198,67,43,0.4)",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                boxShadow: isRoot ? "3px 3px 0px #c6432b" : "none",
                transition: "all 0.15s ease",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <ShieldAlert size={14} style={{ color: "#c6432b" }} />
                <span
                  style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: "0.65rem",
                    fontWeight: 800,
                    color: isRoot ? "#FFFFFF" : "#c6432b",
                    letterSpacing: "0.05em",
                  }}
                >
                  AUDITAR CUELLO DE BOTELLA HOSTINGER (CUENTA ROOT CENTRALIZADA)
                </span>
              </div>
              <span
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: "0.56rem",
                  color: isRoot ? "#FFFFFF" : "rgba(245,241,232,0.6)",
                  background: isRoot ? "#c6432b" : "rgba(198,67,43,0.15)",
                  padding: "0.15rem 0.45rem",
                  fontWeight: 700,
                }}
              >
                {isRoot ? "CUELLO DE BOTELLA OPERATIVO" : "VER RIESGO DE CENTRALIZACIÓN"}
              </span>
            </button>
          </motion.div>

          <AnimatePresence mode="wait">
            {isRoot ? (
              /* Modo Root Compartido: Alarma y Vulnerabilidad */
              <motion.div
                key="root-state"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.2 }}
                style={{
                  padding: "0.85rem 1.1rem",
                  background: "rgba(198,67,43,0.08)",
                  border: "1.5px solid #c6432b",
                  boxShadow: "4px 4px 0px #c6432b",
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.45rem",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    <AlertTriangle size={15} style={{ color: "#c6432b" }} />
                    <span style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: "0.78rem", color: "#F5F1E8", textTransform: "uppercase" }}>
                      CUELLO DE BOTELLA // CREDENCIALES CENTRALIZADAS EN 4 ENCARGADOS
                    </span>
                  </div>
                  <span
                    style={{
                      fontFamily: "'JetBrains Mono', monospace",
                      fontSize: "0.55rem",
                      color: "#c6432b",
                      background: "rgba(198,67,43,0.2)",
                      border: "1px solid #c6432b",
                      padding: "0.15rem 0.4rem",
                      fontWeight: 700,
                    }}
                  >
                    10 SIN ACCESO DIRECTO
                  </span>
                </div>

                <p style={{ fontFamily: "system-ui, -apple-system, sans-serif", fontSize: "0.74rem", color: "rgba(245,241,232,0.85)", lineHeight: 1.4, margin: 0 }}>
                  En Hostinger, solo los 4 encargados poseen credenciales maestras y las comparten entre sí. Los 10 practicantes carecen de accesos al servidor, generando dependencia, retrasos para desplegar y nula auditoría individual.
                </p>

                {/* Fila de 10 Avatares Apilados en Riesgo */}
                <div style={{ display: "flex", alignItems: "center", gap: "0.25rem", marginTop: "0.15rem" }}>
                  {projectMeta.teamMembers.map((member) => (
                    <div
                      key={member.id}
                      style={{
                        flex: 1,
                        padding: "0.25rem 0",
                        textAlign: "center",
                        fontFamily: "'JetBrains Mono', monospace",
                        fontSize: "0.6rem",
                        fontWeight: 800,
                        color: "#c6432b",
                        background: "rgba(0,0,0,0.6)",
                        border: "1px solid rgba(198,67,43,0.4)",
                      }}
                    >
                      P0{member.id}
                    </div>
                  ))}
                </div>
              </motion.div>
            ) : (
              /* Modo AWS IAM: Cuadrícula de los 10 Practicantes */
              <motion.div
                key="iam-state"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.2 }}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.45rem",
                }}
              >
                {/* Cuadrícula compacta de los 10 practicantes */}
                <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: "0.4rem" }}>
                  {projectMeta.teamMembers.map((member) => {
                    const isSelected = selectedUserForInspection?.id === member.id && !isRoot;

                    return (
                      <motion.div
                        key={member.id}
                        whileHover={{ y: -2 }}
                        whileTap={{ scale: 0.96 }}
                        onClick={() => {
                          setIamMode("iam");
                          setSelectedUserForInspection(member);
                        }}
                        style={{
                          padding: "0.45rem 0.5rem",
                          background: isSelected ? "rgba(212,160,23,0.22)" : "rgba(255,255,255,0.03)",
                          border: isSelected ? "1.5px solid #d4a017" : "1px solid rgba(245,241,232,0.15)",
                          cursor: "pointer",
                          display: "flex",
                          flexDirection: "column",
                          justifyContent: "space-between",
                          minHeight: 64,
                          boxShadow: isSelected ? "2px 2px 0px #d4a017" : "none",
                          transition: "background 0.15s ease, border-color 0.15s ease",
                        }}
                      >
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                          <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.62rem", color: isSelected ? "#d4a017" : "rgba(245,241,232,0.5)", fontWeight: 800 }}>
                            P{member.id < 10 ? `0${member.id}` : member.id}
                          </span>
                          <ShieldCheck size={11} style={{ color: isSelected ? "#d4a017" : "#6e8e59" }} />
                        </div>

                        <div>
                          <div style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: "0.63rem", color: "#F5F1E8", textTransform: "uppercase", lineHeight: 1.1 }}>
                            {member.role.split(" ")[0]}
                          </div>
                          <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.5rem", color: "rgba(245,241,232,0.5)", display: "block", marginTop: "0.1rem" }}>
                            {member.iamRole.split("-")[1] || member.iamRole}
                          </span>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Resumen del Modelo de Responsabilidad Compartida */}
        <motion.div
          variants={fadeUp(0.34)}
          initial="hidden"
          animate={entered ? "visible" : "hidden"}
          style={{
            padding: "0.65rem 0.9rem",
            background: "rgba(0,0,0,0.6)",
            border: "1px solid rgba(245,241,232,0.12)",
            borderLeft: "3px solid #d4a017",
            display: "flex",
            alignItems: "center",
            gap: "0.65rem",
          }}
        >
          <Shield size={18} style={{ color: "#d4a017", flexShrink: 0 }} />
          <p
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: "0.62rem",
              color: "rgba(245,241,232,0.7)",
              lineHeight: 1.4,
              margin: 0,
            }}
          >
            {c.sharedResponsibility}
          </p>
        </motion.div>
      </div>

      {/* ══════════════════════════════════════════════════════════
          COLUMNA DERECHA (50%): Visualizador 3D IAM & Escudo Criptográfico
      ══════════════════════════════════════════════════════════ */}
      <div
        style={{
          flex: "0 0 50%",
          position: "relative",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          overflow: "hidden",
          borderLeft: "1px solid rgba(245,241,232,0.1)",
          background: "radial-gradient(ellipse at center, #141414 0%, #0a0a0a 85%)",
        }}
      >
        {/* Cabecera Técnica Flotante */}
        <div
          style={{
            position: "absolute",
            top: "2rem",
            left: "2.5rem",
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            zIndex: 10,
            pointerEvents: "none",
          }}
        >
          <Key size={13} style={{ color: isRoot ? "#c6432b" : "#6e8e59" }} />
          <span
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: "0.62rem",
              letterSpacing: "0.15em",
              color: isRoot ? "#c6432b" : "rgba(245,241,232,0.6)",
              textTransform: "uppercase",
              fontWeight: 700,
            }}
          >
            AWS IAM IDENTITY ARCHITECTURE
          </span>
        </div>

        {/* ── CUADRO FLOTANTE ARRIBA A LA DERECHA: INSPECTOR DE ACCESOS Y PERMISOS ── */}
        <div
          style={{
            position: "absolute",
            top: "1.8rem",
            right: "2.5rem",
            zIndex: 20,
            maxWidth: 290,
          }}
        >
          <AnimatePresence mode="wait">
            {isRoot ? (
              /* Tarjeta Flotante: Inspección de Cuenta Root */
              <motion.div
                key="root-inspect"
                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                style={{
                  padding: "0.75rem 0.9rem",
                  background: "rgba(18,10,10,0.92)",
                  border: "1.5px solid #c6432b",
                  boxShadow: "4px 4px 0px #c6432b",
                  backdropFilter: "blur(8px)",
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.35rem",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                    <ShieldAlert size={14} style={{ color: "#c6432b" }} />
                    <span style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: "0.7rem", color: "#F5F1E8", textTransform: "uppercase" }}>
                      CUENTA ROOT // RAÍZ AWS
                    </span>
                  </div>
                  <span
                    style={{
                      fontFamily: "'JetBrains Mono', monospace",
                      fontSize: "0.52rem",
                      color: "#c6432b",
                      background: "rgba(198,67,43,0.2)",
                      border: "1px solid #c6432b",
                      padding: "0.15rem 0.4rem",
                      fontWeight: 700,
                    }}
                  >
                    RIESGO_ROOT
                  </span>
                </div>

                <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.62rem", color: "#F5F1E8" }}>
                  root@mta-software.com
                </div>

                <div style={{ fontFamily: "system-ui, sans-serif", fontSize: "0.68rem", color: "rgba(245,241,232,0.8)", lineHeight: 1.35 }}>
                  <strong style={{ color: "#c6432b" }}>Permiso asignado:</strong> AdministratorAccess (Total).
                  <div style={{ marginTop: "0.25rem", color: "rgba(245,241,232,0.65)", fontStyle: "italic" }}>
                    Directiva: Bloqueada con MFA Físico en caja fuerte. No se usa para tareas operativas diarias.
                  </div>
                </div>
              </motion.div>
            ) : selectedUserForInspection ? (
              /* Tarjeta Flotante: Inspección de Practicante Seleccionado */
              <motion.div
                key={`user-${selectedUserForInspection.id}`}
                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                style={{
                  padding: "0.75rem 0.9rem",
                  background: "rgba(14,14,14,0.92)",
                  border: "1.5px solid #d4a017",
                  boxShadow: "4px 4px 0px #d4a017",
                  backdropFilter: "blur(8px)",
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.35rem",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                    <UserCheck size={14} style={{ color: "#d4a017" }} />
                    <span style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: "0.72rem", color: "#F5F1E8", textTransform: "uppercase" }}>
                      P{selectedUserForInspection.id < 10 ? `0${selectedUserForInspection.id}` : selectedUserForInspection.id} // {selectedUserForInspection.role}
                    </span>
                  </div>
                  <span
                    style={{
                      fontFamily: "'JetBrains Mono', monospace",
                      fontSize: "0.52rem",
                      color: "#6e8e59",
                      background: "rgba(110,142,89,0.18)",
                      border: "1px solid rgba(110,142,89,0.45)",
                      padding: "0.15rem 0.4rem",
                      fontWeight: 700,
                    }}
                  >
                    MÍNIMO_PRIVILEGIO_OK
                  </span>
                </div>

                <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.62rem", color: "#d4a017" }}>
                  IAM Role: {selectedUserForInspection.iamRole}
                </div>

                <div style={{ fontFamily: "system-ui, sans-serif", fontSize: "0.7rem", color: "rgba(245,241,232,0.9)", lineHeight: 1.35 }}>
                  <strong style={{ color: "#F5F1E8" }}>Acceso asignado:</strong>{" "}
                  <span style={{ fontFamily: "'JetBrains Mono', monospace", color: "#6e8e59", fontWeight: 700 }}>
                    {selectedUserForInspection.accessLevel}
                  </span>
                </div>

                <div
                  style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: "0.55rem",
                    color: "rgba(245,241,232,0.5)",
                    borderTop: "1px solid rgba(245,241,232,0.1)",
                    paddingTop: "0.3rem",
                    marginTop: "0.1rem",
                  }}
                >
                  Restricción: Sin acceso a bases de datos de producción ni VPC.
                </div>
              </motion.div>
            ) : (
              /* Indicador Inicial para interactuar */
              <motion.div
                key="empty-inspect"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                style={{
                  padding: "0.5rem 0.75rem",
                  background: "rgba(14,14,14,0.8)",
                  border: "1px dashed rgba(245,241,232,0.25)",
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: "0.58rem",
                  color: "rgba(245,241,232,0.6)",
                  backdropFilter: "blur(6px)",
                }}
              >
                👆 Selecciona un practicante para inspeccionar sus permisos IAM.
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Canvas 3D Three.js */}
        <div
          style={{
            width: "100%",
            height: "75%",
            position: "relative",
            zIndex: 5,
          }}
        >
          <CanvasTransitionWrapper isActive={isActive}>
            <IamSecurityCanvas
              isActive={isActive}
              isRoot={isRoot}
              selectedUserId={selectedUserForInspection?.id}
            />
          </CanvasTransitionWrapper>
        </div>

        {/* HUD Inferior de Ciberseguridad */}
        <div
          style={{
            position: "absolute",
            bottom: "2rem",
            left: "3rem",
            right: "3.5rem",
            zIndex: 10,
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "0.75rem",
          }}
        >
          <div
            style={{
              padding: "0.6rem 0.9rem",
              background: "rgba(14,14,14,0.75)",
              border: "1px solid rgba(245,241,232,0.15)",
              backdropFilter: "blur(6px)",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div>
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.55rem", color: "rgba(245,241,232,0.5)" }}>
                SEGURIDAD DE LA NUBE (AWS)
              </div>
              <div style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: "0.78rem", color: "#F5F1E8", marginTop: "0.15rem" }}>
                INFRAESTRUCTURA FÍSICA
              </div>
            </div>
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.58rem", color: "#6e8e59", fontWeight: 700 }}>
              GARANTIZADA 100%
            </span>
          </div>

          <div
            style={{
              padding: "0.6rem 0.9rem",
              background: isRoot ? "rgba(198,67,43,0.15)" : "rgba(110,142,89,0.12)",
              border: isRoot ? "1px solid #c6432b" : "1px solid rgba(110,142,89,0.4)",
              backdropFilter: "blur(6px)",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div>
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.55rem", color: isRoot ? "#c6432b" : "#6e8e59" }}>
                SEGURIDAD EN LA NUBE (MTA)
              </div>
              <div style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: "0.78rem", color: isRoot ? "#c6432b" : "#F5F1E8", marginTop: "0.15rem" }}>
                {isRoot ? "VULNERABILIDAD ROOT" : "POLÍTICAS DE IAM AUDITADAS"}
              </div>
            </div>
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.58rem", color: isRoot ? "#c6432b" : "#6e8e59", fontWeight: 700 }}>
              {isRoot ? "ALTO RIESGO" : "CERO CONFIANZA OK"}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}

export default S11_IAM;