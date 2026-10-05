// src/slides/S20_SeguridadRed.jsx
import React, { useEffect, useState, useRef } from "react";
import { motion, useReducedMotion } from "framer-motion";
import {
  ShieldCheck,
  Lock,
  Terminal,
  ShieldAlert,
  CheckCircle2,
  Key,
  Database,
  Server,
  Globe,
} from "lucide-react";
import { useSlideActive } from "../hooks/useSlideActive.js";
import { NetworkSecurityCanvas } from "../components/three/NetworkSecurityCanvas.jsx";

/**
 * Slide 20 — Seguridad Avanzada de Red y Protección en Capas (Defense in Depth)
 *
 * Contenido fiel a:
 * - docs/etapa 3.txt (Punto 2: VPC segmentada en subredes públicas y privadas, Security Groups a nivel de instancia, Network ACLs a nivel de subred, y Bastion Hosts para acceso seguro).
 * - docs/etapa3_propuesta_slides.md (Eje 2: Defensa en 3 capas, comparación SG vs NACL, justificación Bastion + SSM).
 *
 * Diseño e Interactividad:
 * - Layout panorámico 50/50 exacto al estándar (acento oro vertical, tipografía editorial y Yellowtail).
 * - Simulador interactivo:
 *   1. "Intento de Ataque Directo a BD" (Puerto 5432 bloqueado en el perímetro).
 *   2. "Acceso Seguro por Bastion Host" (Túnel SSH/SSM autorizado para los 10 practicantes).
 *   3. "Tráfico Web Legítimo" (HTTPS al backend).
 */
export function S20_SeguridadRed({ isActive: propActive } = {}) {
  const shouldReduceMotion = useReducedMotion();
  const hookActive = useSlideActive(19);
  const sectionRef = useRef(null);
  const [domActive, setDomActive] = useState(false);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const checkPresent = () => setDomActive(el.classList.contains("present"));
    checkPresent();
    const observer = new MutationObserver(checkPresent);
    observer.observe(el, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, []);

  const isActive = propActive !== undefined ? (propActive || domActive) : (hookActive || domActive);
  const [entered, setEntered] = useState(false);

  // Selector interactivo de simulación
  const [securityMode, setSecurityMode] = useState("blocked_attack"); // "blocked_attack" | "authorized_bastion" | "normal_web"

  useEffect(() => {
    if (!isActive) return;
    const t = setTimeout(() => setEntered(true), 40);
    return () => {
      clearTimeout(t);
      setEntered(false);
    };
  }, [isActive]);

  const fadeUp = (delay = 0) => ({
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 16 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: shouldReduceMotion ? 0.1 : 0.45,
        ease: [0.16, 1, 0.3, 1],
        delay: entered ? delay : 0,
      },
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
      {/* Retícula ambiental */}
      <div aria-hidden="true" style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(245,241,232,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(245,241,232,0.025) 1px, transparent 1px)", backgroundSize: "64px 64px", pointerEvents: "none", zIndex: 0 }} />
      <div aria-hidden="true" style={{ position: "absolute", inset: 0, background: "repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,0,0,0.07) 3px, rgba(0,0,0,0.07) 6px)", pointerEvents: "none", zIndex: 1 }} />

      {/* Línea vertical de acento Esmeralda Seguridad */}
      <motion.div
        aria-hidden="true"
        initial={{ scaleY: 0, transformOrigin: "top" }}
        animate={entered ? { scaleY: 1 } : { scaleY: 0 }}
        transition={{ duration: shouldReduceMotion ? 0.1 : 0.65, ease: [0.83, 0, 0.17, 1], delay: 0.05 }}
        style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 4, background: "#00c853", zIndex: 3 }}
      />

      {/* ══════════════ COLUMNA IZQUIERDA (58%): Arquitectura de Seguridad en Capas ══════════════ */}
      <div style={{ flex: "0 0 58%", display: "flex", flexDirection: "column", justifyContent: "center", padding: "1.2rem 2rem 1.2rem 3.6rem", position: "relative", zIndex: 2, gap: "0.5rem", boxSizing: "border-box" }}>

        {/* Header Editorial idéntico al estándar del deck */}
        <div style={{ display: "flex", flexDirection: "column", gap: "0.15rem" }}>
          <motion.div variants={fadeUp(0.04)} initial="hidden" animate={entered ? "visible" : "hidden"} style={{ display: "flex", alignItems: "center", gap: "0.6rem", flexWrap: "wrap" }}>
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.86rem", letterSpacing: "0.15em", textTransform: "uppercase", fontWeight: 700, color: "#00c853", background: "rgba(0,200,83,0.12)", border: "1px solid rgba(0,200,83,0.4)", padding: "0.22rem 0.65rem" }}>
              [ ETAPA 3 · EJE 02 ]
            </span>
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.80rem", color: "#38bdf8", background: "rgba(56,189,248,0.12)", border: "1px solid rgba(56,189,248,0.35)", padding: "0.20rem 0.55rem", fontWeight: 700 }}>
              DEFENSE IN DEPTH
            </span>
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.78rem", color: "rgba(245,241,232,0.7)" }}>
              ZERO EXPOSURE · AUDITED JUMP BOX
            </span>
          </motion.div>

          <motion.p variants={fadeUp(0.08)} initial="hidden" animate={entered ? "visible" : "hidden"}
            style={{ fontFamily: "Yellowtail, cursive", fontSize: "clamp(1.5rem, 2.2vw, 2rem)", color: "#00c853", lineHeight: 1.1, margin: "0.1rem 0 0 0", fontWeight: 400 }}>
            Protección Perimetral y Aislamiento en Capas
          </motion.p>

          <motion.h1 variants={fadeUp(0.12)} initial="hidden" animate={entered ? "visible" : "hidden"}
            style={{ fontFamily: "'Archivo Black', 'Arial Black', sans-serif", fontSize: "clamp(1.8rem, 2.5vw, 2.45rem)", color: "#F5F1E8", letterSpacing: "-0.025em", lineHeight: 1.05, textTransform: "uppercase", margin: 0, fontWeight: 400 }}>
            SEGURIDAD AVANZADA DE RED & VPC
          </motion.h1>

          <motion.div
            initial={{ clipPath: "inset(0 100% 0 0)" }}
            animate={entered ? { clipPath: "inset(0 0% 0 0)" } : { clipPath: "inset(0 100% 0 0)" }}
            transition={{ duration: shouldReduceMotion ? 0.1 : 0.55, ease: [0.83, 0, 0.17, 1], delay: 0.18 }}
            style={{ height: 2, background: "#00c853", width: "100%", maxWidth: 240, margin: "0.12rem 0" }}
          />

          <motion.p variants={fadeUp(0.16)} initial="hidden" animate={entered ? "visible" : "hidden"}
            style={{ fontFamily: "Inter, system-ui, sans-serif", fontSize: "clamp(0.92rem, 1.05vw, 1.02rem)", color: "rgba(245,241,232,0.85)", margin: 0, lineHeight: 1.4, fontWeight: 400 }}>
            Arquitectura de red aislada en Amazon VPC con segmentación estricta en tres niveles (Pública, Aplicación y Datos), filtrado dual (SG + NACL) y acceso operacional seguro.
          </motion.p>
        </div>

        {/* Grid de las 4 Capas Clave de Seguridad (Estilo S11/S12/S19) */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.65rem" }}>
          
          {/* Capa 1: Amazon VPC & Subnet Isolation */}
          <motion.div
            variants={fadeUp(0.20)}
            initial="hidden"
            animate={entered ? "visible" : "hidden"}
            style={{
              padding: "0.85rem 1.05rem",
              background: "rgba(255,255,255,0.02)",
              border: "1px solid rgba(245,241,232,0.12)",
              borderLeft: "3px solid #00c853",
              display: "flex",
              flexDirection: "column",
              gap: "0.32rem",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <h4 style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: "0.90rem", color: "#F5F1E8", textTransform: "uppercase", margin: 0, fontWeight: 400 }}>
                AMAZON VPC & SUBREDES
              </h4>
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.72rem", color: "#00c853", fontWeight: 700 }}>
                CAPA 01
              </span>
            </div>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.78rem", color: "#00c853", padding: "0.15rem 0", fontWeight: 600 }}>
              CIDR /16 · Internet Gateway · Rutas
            </div>
            <p style={{ fontFamily: "Inter, system-ui, sans-serif", fontSize: "0.85rem", color: "rgba(245,241,232,0.88)", lineHeight: 1.45, margin: 0, fontWeight: 400 }}>
              Entorno virtual 100% aislado. Subredes públicas con IGW solo para balanceador y bastion; subredes privadas sin IP pública para apps y bases de datos.
            </p>
          </motion.div>

          {/* Capa 2: Security Groups */}
          <motion.div
            variants={fadeUp(0.23)}
            initial="hidden"
            animate={entered ? "visible" : "hidden"}
            style={{
              padding: "0.85rem 1.05rem",
              background: "rgba(255,255,255,0.02)",
              border: "1px solid rgba(245,241,232,0.12)",
              borderLeft: "3px solid #38bdf8",
              display: "flex",
              flexDirection: "column",
              gap: "0.32rem",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <h4 style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: "0.90rem", color: "#F5F1E8", textTransform: "uppercase", margin: 0, fontWeight: 400 }}>
                SECURITY GROUPS (ENI)
              </h4>
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.72rem", color: "#38bdf8", fontWeight: 700 }}>
                CAPA 02
              </span>
            </div>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.78rem", color: "#38bdf8", padding: "0.15rem 0", fontWeight: 600 }}>
              Stateful · Nivel Instancia · Solo Allow
            </div>
            <p style={{ fontFamily: "Inter, system-ui, sans-serif", fontSize: "0.85rem", color: "rgba(245,241,232,0.88)", lineHeight: 1.45, margin: 0, fontWeight: 400 }}>
              Cortafuegos virtual con estado. El SG de la base de datos solo autoriza tráfico en puerto 5432 proveniente exclusivamente del SG de las instancias backend.
            </p>
          </motion.div>

          {/* Capa 3: Network ACLs */}
          <motion.div
            variants={fadeUp(0.26)}
            initial="hidden"
            animate={entered ? "visible" : "hidden"}
            style={{
              padding: "0.85rem 1.05rem",
              background: "rgba(255,255,255,0.02)",
              border: "1px solid rgba(245,241,232,0.12)",
              borderLeft: "3px solid #38bdf8",
              display: "flex",
              flexDirection: "column",
              gap: "0.32rem",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <h4 style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: "0.90rem", color: "#F5F1E8", textTransform: "uppercase", margin: 0, fontWeight: 400 }}>
                NETWORK ACLS (SUBNET)
              </h4>
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.72rem", color: "#38bdf8", fontWeight: 700 }}>
                CAPA 03
              </span>
            </div>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.78rem", color: "#38bdf8", padding: "0.15rem 0", fontWeight: 600 }}>
              Stateless · Nivel Subred · Allow & Deny
            </div>
            <p style={{ fontFamily: "Inter, system-ui, sans-serif", fontSize: "0.85rem", color: "rgba(245,241,232,0.88)", lineHeight: 1.45, margin: 0, fontWeight: 400 }}>
              Primera línea de defensa perimetral evaluada por reglas numeradas. Filtra y bloquea intentos de escaneo antes de que toquen las interfaces virtuales de los servidores.
            </p>
          </motion.div>

          {/* Capa 4: Bastion Host / Jump Server */}
          <motion.div
            variants={fadeUp(0.29)}
            initial="hidden"
            animate={entered ? "visible" : "hidden"}
            style={{
              padding: "0.85rem 1.05rem",
              background: "rgba(255,255,255,0.02)",
              border: "1px solid rgba(245,241,232,0.12)",
              borderLeft: "3px solid #d4a017",
              display: "flex",
              flexDirection: "column",
              gap: "0.32rem",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <h4 style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: "0.90rem", color: "#F5F1E8", textTransform: "uppercase", margin: 0, fontWeight: 400 }}>
                BASTION HOST (JUMP BOX)
              </h4>
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.72rem", color: "#d4a017", fontWeight: 700 }}>
                CAPA 04
              </span>
            </div>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.78rem", color: "#d4a017", padding: "0.15rem 0", fontWeight: 600 }}>
              Túnel SSH/SSM · 10 Practicantes · Endurecido
            </div>
            <p style={{ fontFamily: "Inter, system-ui, sans-serif", fontSize: "0.85rem", color: "rgba(245,241,232,0.88)", lineHeight: 1.45, margin: 0, fontWeight: 400 }}>
              Punto de entrada único y controlado para el equipo de desarrollo de MTA. Permite soporte administrativo a subredes privadas sin abrir puertos hacia internet.
            </p>
          </motion.div>

        </div>

        {/* Ficha Resumen de Justificación de Decisión Cloud */}
        <motion.div
          variants={fadeUp(0.32)}
          initial="hidden"
          animate={entered ? "visible" : "hidden"}
          style={{
            background: "#0A0A0A",
            border: "1px solid rgba(245,241,232,0.15)",
            borderLeft: "4px solid #00c853",
            padding: "0.85rem 1.2rem",
            display: "flex",
            flexDirection: "column",
            gap: "0.3rem",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.78rem", color: "#00c853", fontWeight: 700 }}>
              DECISIÓN CLAVE: DEFENSA EN PROFUNDIDAD (SG + NACL + BASTION)
            </span>
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.72rem", color: "#38bdf8", fontWeight: 700 }}>
              SUPERFICIE DE ATAQUE = 0
            </span>
          </div>
          <span style={{ fontFamily: "Inter, system-ui, sans-serif", fontSize: "0.86rem", color: "rgba(245,241,232,0.92)", lineHeight: 1.45 }}>
            <strong style={{ color: "#F5F1E8" }}>¿Por qué Bastion Host y no acceso directo a cada practicante?</strong> Los 10 practicantes cuentan con conexiones residenciales de IP dinámica. Abrir el puerto 22 a <code style={{ color: "#00c853", background: "rgba(0,200,83,0.12)", padding: "0.1rem 0.35rem" }}>0.0.0.0/0</code> expondría los servidores a ataques de fuerza bruta continuos. El Bastion Host canaliza, autentica y audita cada sesión de forma segura.
          </span>
        </motion.div>
      </div>

      {/* ══════════════ COLUMNA DERECHA (42%): Simulador 3D con Fondo Negro Puro y Centrado Elevado ══════════════ */}
      <div style={{ flex: "0 0 42%", position: "relative", display: "flex", flexDirection: "column", justifyContent: "space-between", padding: "1.2rem 1.6rem", boxSizing: "border-box", borderLeft: "1px solid rgba(245,241,232,0.1)", background: "#050505" }}>

        {/* Cabecera Técnica Flotante */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", zIndex: 10 }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <span style={{ width: 8, height: 8, borderRadius: "50%", background: securityMode === "blocked_attack" ? "#ef4444" : (securityMode === "authorized_bastion" ? "#00c853" : "#38bdf8"), boxShadow: `0 0 10px ${securityMode === "blocked_attack" ? "#ef4444" : (securityMode === "authorized_bastion" ? "#00c853" : "#38bdf8")}` }} />
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.76rem", color: "#F5F1E8", letterSpacing: "0.12em", textTransform: "uppercase", fontWeight: 700 }}>
              INSPECTOR DE CAPAS DE SEGURIDAD (3D)
            </span>
          </div>
          <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.68rem", color: "rgba(245,241,232,0.6)", background: "rgba(0,0,0,0.5)", border: "1px solid rgba(245,241,232,0.15)", padding: "0.18rem 0.5rem", fontWeight: 600 }}>
            INTERACTIVE WEBGL 3D
          </span>
        </div>

        {/* Selector de Modos de Simulación con estilo idéntico a S11, S12 y S19 */}
        <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem", zIndex: 10, margin: "0.3rem 0" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "0.4rem" }}>
            <button
              type="button"
              onClick={() => setSecurityMode("blocked_attack")}
              style={{
                background: securityMode === "blocked_attack" ? "#ef4444" : "rgba(255,255,255,0.03)",
                color: securityMode === "blocked_attack" ? "#FFFFFF" : "rgba(245,241,232,0.85)",
                border: securityMode === "blocked_attack" ? "1px solid #ef4444" : "1px solid rgba(245,241,232,0.12)",
                boxShadow: securityMode === "blocked_attack" ? "2px 2px 0px #000" : "none",
                padding: "0.45rem 0.35rem",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "0.15rem",
                cursor: "pointer",
                transition: "all 0.15s ease",
              }}
            >
              <span style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: "0.72rem", textTransform: "uppercase" }}>
                1. Intento a BD
              </span>
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.58rem", opacity: securityMode === "blocked_attack" ? 0.95 : 0.6 }}>
                PUERTO 5432 RECHAZADO
              </span>
            </button>

            <button
              type="button"
              onClick={() => setSecurityMode("authorized_bastion")}
              style={{
                background: securityMode === "authorized_bastion" ? "#00c853" : "rgba(255,255,255,0.03)",
                color: securityMode === "authorized_bastion" ? "#0A0A0A" : "rgba(245,241,232,0.85)",
                border: securityMode === "authorized_bastion" ? "1px solid #00c853" : "1px solid rgba(245,241,232,0.12)",
                boxShadow: securityMode === "authorized_bastion" ? "2px 2px 0px #000" : "none",
                padding: "0.45rem 0.35rem",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "0.15rem",
                cursor: "pointer",
                transition: "all 0.15s ease",
              }}
            >
              <span style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: "0.72rem", textTransform: "uppercase" }}>
                2. Bastion Jump
              </span>
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.58rem", opacity: securityMode === "authorized_bastion" ? 0.95 : 0.6 }}>
                SSH/SSM TUNNEL AUTORIZADO
              </span>
            </button>

            <button
              type="button"
              onClick={() => setSecurityMode("normal_web")}
              style={{
                background: securityMode === "normal_web" ? "#38bdf8" : "rgba(255,255,255,0.03)",
                color: securityMode === "normal_web" ? "#0A0A0A" : "rgba(245,241,232,0.85)",
                border: securityMode === "normal_web" ? "1px solid #38bdf8" : "1px solid rgba(245,241,232,0.12)",
                boxShadow: securityMode === "normal_web" ? "2px 2px 0px #000" : "none",
                padding: "0.45rem 0.35rem",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "0.15rem",
                cursor: "pointer",
                transition: "all 0.15s ease",
              }}
            >
              <span style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: "0.72rem", textTransform: "uppercase" }}>
                3. Tráfico HTTPS
              </span>
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.58rem", opacity: securityMode === "normal_web" ? 0.95 : 0.6 }}>
                PUERTO 443 A BALANCEADOR
              </span>
            </button>
          </div>
        </div>

        {/* Contenedor del Canvas Three.js con Estrellas Delicadas y Escudo Centrado */}
        <div style={{ flex: 1, minHeight: "360px", position: "relative" }}>
          <NetworkSecurityCanvas isActive={isActive} securityMode={securityMode} />
        </div>

        {/* Badge Inferior Explicativo en Vivo */}
        <div
          style={{
            zIndex: 10,
            background: "rgba(10,10,12,0.92)",
            backdropFilter: "blur(8px)",
            border: `1.5px solid ${securityMode === "blocked_attack" ? "#ef4444" : (securityMode === "authorized_bastion" ? "#00c853" : "#38bdf8")}60`,
            padding: "0.6rem 1rem",
            display: "flex",
            alignItems: "center",
            gap: "0.6rem",
          }}
        >
          {securityMode === "blocked_attack" && (
            <>
              <ShieldAlert size={16} color="#ef4444" style={{ flexShrink: 0 }} />
              <span style={{ fontFamily: "Inter, system-ui, sans-serif", fontSize: "0.82rem", color: "rgba(245,241,232,0.9)" }}>
                <strong style={{ color: "#ef4444" }}>Intento de Inyección Directa:</strong> Paquete bloqueado en el perímetro (NACL + SG). El puerto 5432 es inaccesible desde el exterior.
              </span>
            </>
          )}

          {securityMode === "authorized_bastion" && (
            <>
              <CheckCircle2 size={16} color="#00c853" style={{ flexShrink: 0 }} />
              <span style={{ fontFamily: "Inter, system-ui, sans-serif", fontSize: "0.82rem", color: "rgba(245,241,232,0.9)" }}>
                <strong style={{ color: "#00c853" }}>Túnel de Administración:</strong> El practicante autentica mediante par de llaves en Bastion Host y conecta internamente a la BD con auditoría total.
              </span>
            </>
          )}

          {securityMode === "normal_web" && (
            <>
              <Globe size={16} color="#38bdf8" style={{ flexShrink: 0 }} />
              <span style={{ fontFamily: "Inter, system-ui, sans-serif", fontSize: "0.82rem", color: "rgba(245,241,232,0.9)" }}>
                <strong style={{ color: "#38bdf8" }}>Petición HTTP/S:</strong> Usuarios externos acceden solo al frontend/ALB (Puerto 443) y el backend atiende de forma aislada.
              </span>
            </>
          )}
        </div>
      </div>
    </section>
  );
}

export default S20_SeguridadRed;
