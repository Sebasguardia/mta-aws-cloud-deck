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
          variants={fadeUp(0.22)}
          initial="hidden"
          animate={entered ? "visible" : "hidden"}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "0.5rem 0.6rem",
            background: "rgba(18,18,18,0.9)",
            border: "1.5px solid rgba(245,241,232,0.15)",
            boxShadow: "4px 4px 0px #000000",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", paddingLeft: "0.5rem" }}>
            <Key size={14} style={{ color: isRoot ? "#c6432b" : "#6e8e59" }} />
            <span
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: "0.65rem",
                letterSpacing: "0.15em",
                color: "rgba(245,241,232,0.7)",
                textTransform: "uppercase",
                fontWeight: 700,
              }}
            >
              POLÍTICA DE IDENTIDAD
            </span>
          </div>

          <div style={{ display: "flex", gap: "0.3rem" }}>
            <button
              type="button"
              onClick={() => setIamMode("root")}
              style={{
                fontFamily: "'Archivo Black', sans-serif",
                fontSize: "0.68rem",
                textTransform: "uppercase",
                padding: "0.45rem 0.9rem",
                letterSpacing: "0.05em",
                cursor: "pointer",
                border: "1px solid",
                borderColor: isRoot ? "#c6432b" : "rgba(245,241,232,0.1)",
                background: isRoot ? "#c6432b" : "transparent",
                color: isRoot ? "#FFFFFF" : "rgba(245,241,232,0.5)",
                transition: "all 0.15s ease",
              }}
            >
              1 CUENTA ROOT COMPARTIDA
            </button>

            <button
              type="button"
              onClick={() => setIamMode("iam")}
              style={{
                fontFamily: "'Archivo Black', sans-serif",
                fontSize: "0.68rem",
                textTransform: "uppercase",
                padding: "0.45rem 0.9rem",
                letterSpacing: "0.05em",
                cursor: "pointer",
                border: "1px solid",
                borderColor: !isRoot ? "#6e8e59" : "rgba(245,241,232,0.1)",
                background: !isRoot ? "#6e8e59" : "transparent",
                color: !isRoot ? "#0A0A0A" : "rgba(245,241,232,0.5)",
                transition: "all 0.15s ease",
              }}
            >
              10 USUARIOS IAM INDIVIDUALES
            </button>
          </div>
        </motion.div>

        {/* Contenido Dinámico de la Matriz de Practicantes */}
        <div style={{ position: "relative" }}>
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
                  padding: "1rem 1.25rem",
                  background: "rgba(198,67,43,0.08)",
                  border: "1.5px solid #c6432b",
                  boxShadow: "4px 4px 0px #c6432b",
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.6rem",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
                  <ShieldAlert size={18} style={{ color: "#c6432b" }} />
                  <span style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: "0.85rem", color: "#F5F1E8", textTransform: "uppercase" }}>
                    VULNERABILIDAD CRÍTICA DE GOBIERNO
                  </span>
                </div>

                <p style={{ fontFamily: "system-ui, -apple-system, sans-serif", fontSize: "0.78rem", color: "rgba(245,241,232,0.8)", lineHeight: 1.45, margin: 0 }}>
                  El Jefe de Desarrollo y los 10 practicantes comparten la misma contraseña maestra en el servidor Hostinger.
                  Sin trazabilidad de auditoría en caso de borrado accidental o fuga de datos.
                </p>

                {/* Fila de 10 Avatares Apilados en Riesgo */}
                <div style={{ display: "flex", alignItems: "center", gap: "0.25rem", marginTop: "0.3rem" }}>
                  {projectMeta.teamMembers.map((member) => (
                    <div
                      key={member.id}
                      style={{
                        flex: 1,
                        padding: "0.3rem 0",
                        textAlign: "center",
                        fontFamily: "'JetBrains Mono', monospace",
                        fontSize: "0.62rem",
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

                <div
                  style={{
                    padding: "0.45rem 0.65rem",
                    background: "#0A0A0A",
                    border: "1px solid rgba(198,67,43,0.3)",
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: "0.65rem",
                    color: "#c6432b",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.4rem",
                  }}
                >
                  <Lock size={12} />
                  <span>root@mta-software.com // Credenciales compartidas por WhatsApp o Slack</span>
                </div>
              </motion.div>
            ) : (
              /* Modo AWS IAM: 10 Identidades con Privilegios Mínimos */
              <motion.div
                key="iam-state"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.2 }}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.6rem",
                }}
              >
                {/* Cuadrícula compacta de los 10 practicantes */}
                <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: "0.45rem" }}>
                  {projectMeta.teamMembers.map((member) => {
                    const isSelected = selectedUserForInspection?.id === member.id;

                    return (
                      <motion.div
                        key={member.id}
                        whileHover={{ y: -2 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={() => setSelectedUserForInspection(member)}
                        style={{
                          padding: "0.5rem 0.6rem",
                          background: isSelected ? "rgba(212,160,23,0.2)" : "rgba(255,255,255,0.03)",
                          border: isSelected ? "1.5px solid #d4a017" : "1px solid rgba(245,241,232,0.15)",
                          cursor: "pointer",
                          display: "flex",
                          flexDirection: "column",
                          justifyContent: "space-between",
                          minHeight: 70,
                          boxShadow: isSelected ? "2px 2px 0px #d4a017" : "none",
                          transition: "all 0.15s ease",
                        }}
                      >
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                          <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.6rem", color: isSelected ? "#d4a017" : "rgba(245,241,232,0.5)", fontWeight: 800 }}>
                            P{member.id < 10 ? `0${member.id}` : member.id}
                          </span>
                          <ShieldCheck size={12} style={{ color: isSelected ? "#d4a017" : "#6e8e59" }} />
                        </div>

                        <div>
                          <div style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: "0.65rem", color: "#F5F1E8", textTransform: "uppercase", lineHeight: 1.1 }}>
                            {member.role.split(" ")[0]}
                          </div>
                          <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.52rem", color: "rgba(245,241,232,0.5)", display: "block", marginTop: "0.15rem" }}>
                            {member.iamRole.split("-")[1] || member.iamRole}
                          </span>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>

                {/* Inspeccionador de Políticas Perimetrales */}
                <div
                  style={{
                    padding: "0.65rem 0.9rem",
                    background: "rgba(10,10,10,0.9)",
                    border: "1px solid rgba(212,160,23,0.4)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  {selectedUserForInspection ? (
                    <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                      <UserCheck size={16} style={{ color: "#d4a017", flexShrink: 0 }} />
                      <div>
                        <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.65rem", color: "#d4a017", fontWeight: 700 }}>
                          {selectedUserForInspection.name} // {selectedUserForInspection.role}
                        </div>
                        <div style={{ fontFamily: "system-ui, sans-serif", fontSize: "0.72rem", color: "rgba(245,241,232,0.85)", marginTop: "0.1rem" }}>
                          Acceso asignado: <span style={{ fontFamily: "'JetBrains Mono', monospace", color: "#6e8e59", fontWeight: 700 }}>{selectedUserForInspection.accessLevel}</span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.62rem", color: "rgba(245,241,232,0.6)" }}>
                      👆 Haz click en cualquier practicante para auditar su política de permisos IAM individual.
                    </div>
                  )}

                  <span
                    style={{
                      fontFamily: "'JetBrains Mono', monospace",
                      fontSize: "0.58rem",
                      color: "#6e8e59",
                      background: "rgba(110,142,89,0.15)",
                      border: "1px solid rgba(110,142,89,0.4)",
                      padding: "0.2rem 0.5rem",
                      fontWeight: 700,
                      flexShrink: 0,
                    }}
                  >
                    PRIVILEGIOS_MÍNIMOS_OK
                  </span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Resumen del Modelo de Responsabilidad Compartida */}
        <motion.div
          variants={fadeUp(0.38)}
          initial="hidden"
          animate={entered ? "visible" : "hidden"}
          style={{
            padding: "0.75rem 1rem",
            background: "rgba(0,0,0,0.6)",
            border: "1px solid rgba(245,241,232,0.12)",
            borderLeft: "3px solid #d4a017",
            display: "flex",
            alignItems: "center",
            gap: "0.75rem",
          }}
        >
          <Shield size={20} style={{ color: "#d4a017", flexShrink: 0 }} />
          <p
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: "0.63rem",
              color: "rgba(245,241,232,0.7)",
              lineHeight: 1.45,
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
            top: "2.5rem",
            right: "3.5rem",
            left: "3rem",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            zIndex: 10,
            pointerEvents: "none",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
            <Key size={14} style={{ color: isRoot ? "#c6432b" : "#6e8e59" }} />
            <span
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: "0.65rem",
                letterSpacing: "0.15em",
                color: isRoot ? "#c6432b" : "rgba(245,241,232,0.6)",
                textTransform: "uppercase",
              }}
            >
              AWS IAM IDENTITY ARCHITECTURE // ZERO_TRUST
            </span>
          </div>

          <div
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: "0.6rem",
              padding: "0.2rem 0.5rem",
              background: isRoot ? "rgba(198,67,43,0.15)" : "rgba(110,142,89,0.15)",
              border: isRoot ? "1px solid #c6432b" : "1px solid #6e8e59",
              color: isRoot ? "#c6432b" : "#6e8e59",
            }}
          >
            {isRoot ? "ROOT: SINGLE_POINT_CREDENTIAL" : "IAM: 10_ISOLATED_IDENTITIES"}
          </div>
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