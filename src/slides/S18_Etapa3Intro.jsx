// src/slides/S18_Etapa3Intro.jsx
import React, { useEffect, useState, useRef } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Zap, ShieldCheck, Activity, Terminal } from "lucide-react";
import { useSlideActive } from "../hooks/useSlideActive.js";

/**
 * Slide 18 / S18_Etapa3Intro — Separador y Entrada Oficial a la ETAPA 3
 * Arquitectura Dinámica, Resiliencia, Seguridad en Profundidad, Monitoreo y DevOps.
 *
 * Diseño:
 * - Anti-slop / Industrial-brutalist refinado sin 3D invasivo
 * - Muestra los 4 ejes cardinales de la Etapa 3 (Semana 8)
 * - Tarjetas interactivas con hover, micro-glow y argumentos clave de valor
 */
export function S18_Etapa3Intro({ isActive: propActive } = {}) {
  const shouldReduceMotion = useReducedMotion();
  const hookActive = useSlideActive(17);
  const sectionRef = useRef(null);
  const [domActive, setDomActive] = useState(false);
  const [hoveredIdx, setHoveredIdx] = useState(null);

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

  useEffect(() => {
    if (!isActive) {
      setEntered(false);
      setHoveredIdx(null);
      return;
    }
    const t = setTimeout(() => setEntered(true), 40);
    return () => clearTimeout(t);
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

  const ejes = [
    {
      num: "01",
      tag: "ALTA DISPONIBILIDAD",
      title: "ARQUITECTURA DINÁMICA",
      tech: "ALB + Auto Scaling Multi-AZ",
      desc: "Distribución elástica en us-east-1a y us-east-1b con absorción automática de picos y tolerancia a fallos.",
      color: "#d4a017",
      icon: Zap,
    },
    {
      num: "02",
      tag: "PROTECCIÓN PERIMETRAL",
      title: "SEGURIDAD EN CAPAS",
      tech: "Security Groups + NACLs + Bastion",
      desc: "Defensa en profundidad en 3 niveles (Pública, App, Datos) y acceso seguro para los 10 practicantes remotos.",
      color: "#00c853",
      icon: ShieldCheck,
    },
    {
      num: "03",
      tag: "OBSERVABILIDAD Y FINOPS",
      title: "MONITOREO Y COSTOS",
      tech: "CloudWatch + Tagging + Trusted Advisor",
      desc: "Supervisión proactiva en tiempo real, trazabilidad por cliente/proyecto y resguardo estricto del presupuesto de $10 USD.",
      color: "#38bdf8",
      icon: Activity,
    },
    {
      num: "04",
      tag: "AUTOMATIZACIÓN DEVSECOPS",
      title: "INFRAESTRUCTURA COMO CÓDIGO",
      tech: "AWS CloudFormation + CI/CD",
      desc: "Modelado declarativo en plantillas repetibles sin errores manuales y pipelines automatizados de despliegue.",
      color: "#a78bfa",
      icon: Terminal,
    },
  ];

  return (
    <section
      ref={sectionRef}
      className="slide-fullscreen"
      style={{
        width: "100%",
        height: "100%",
        position: "relative",
        background: "#080808",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        padding: "clamp(1.5rem, 3vw, 2.8rem)",
        boxSizing: "border-box",
      }}
    >
      {/* Retícula ambiental sutil estilo blueprint */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "linear-gradient(rgba(245,241,232,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(245,241,232,0.025) 1px, transparent 1px)",
          backgroundSize: "50px 50px",
          pointerEvents: "none",
        }}
      />


      <div
        style={{
          maxWidth: "1280px",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
          gap: "clamp(1.5rem, 2.5vh, 2.4rem)",
          position: "relative",
          zIndex: 2,
        }}
      >
        {/* Cabecera / Título */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0.45rem" }}>
          <motion.div
            variants={fadeUp(0.04)}
            initial="hidden"
            animate={entered ? "visible" : "hidden"}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.6rem",
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: "0.85rem",
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              fontWeight: 700,
              color: "#d4a017",
              background: "rgba(212,160,23,0.08)",
              border: "1px solid rgba(212,160,23,0.35)",
              padding: "0.35rem 1.1rem",
              borderRadius: "2px",
            }}
          >
            <span>[ ENTREGABLE FINAL · SEMANA 8 ]</span>
          </motion.div>

          <motion.h1
            variants={fadeUp(0.09)}
            initial="hidden"
            animate={entered ? "visible" : "hidden"}
            style={{
              fontFamily: "'Archivo Black', 'Arial Black', sans-serif",
              fontSize: "clamp(2.8rem, 4.8vw, 4.4rem)",
              color: "#F5F1E8",
              letterSpacing: "-0.025em",
              textTransform: "uppercase",
              margin: 0,
              lineHeight: 1.05,
            }}
          >
            ETAPA 3: MADUREZ Y AUTOMATIZACIÓN
          </motion.h1>

          <motion.div
            initial={{ scaleX: 0 }}
            animate={entered ? { scaleX: 1 } : { scaleX: 0 }}
            transition={{ duration: 0.55, delay: 0.16 }}
            style={{
              height: 3,
              width: "140px",
              background: "linear-gradient(90deg, transparent, #d4a017, transparent)",
              margin: "0.2rem auto",
            }}
          />

          <motion.p
            variants={fadeUp(0.14)}
            initial="hidden"
            animate={entered ? "visible" : "hidden"}
            style={{
              fontFamily: "Inter, system-ui, sans-serif",
              fontSize: "clamp(1.05rem, 1.3vw, 1.25rem)",
              color: "rgba(245,241,232,0.72)",
              margin: 0,
              fontWeight: 400,
              maxWidth: "780px",
            }}
          >
            Resiliencia elástica, defensa en profundidad, observabilidad proactiva y despliegues declarativos como código
          </motion.p>
        </div>

        {/* Grilla de los 4 Ejes Cardinales */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: "1.2rem",
            width: "100%",
          }}
        >
          {ejes.map((eje, idx) => {
            const isHovered = hoveredIdx === idx;
            return (
              <motion.div
                key={eje.num}
                variants={fadeUp(0.2 + idx * 0.07)}
                initial="hidden"
                animate={entered ? "visible" : "hidden"}
                onMouseEnter={() => setHoveredIdx(idx)}
                onMouseLeave={() => setHoveredIdx(null)}
                style={{
                  background: isHovered ? "rgba(18,18,18,0.98)" : "rgba(12,12,12,0.9)",
                  border: isHovered
                    ? `1.5px solid ${eje.color}`
                    : "1.5px solid rgba(245,241,232,0.1)",
                  borderTop: `4px solid ${eje.color}`,
                  padding: "1.6rem 1.3rem",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  textAlign: "center",
                  gap: "0.75rem",
                  boxShadow: isHovered
                    ? `0 14px 34px -8px ${eje.color}35, 0 8px 24px rgba(0,0,0,0.6)`
                    : "0 8px 20px rgba(0,0,0,0.45)",
                  transition: "all 0.28s ease",
                  cursor: "default",
                  borderRadius: "2px",
                  position: "relative",
                  transform: isHovered ? "translateY(-4px)" : "translateY(0)",
                }}
              >
                {/* Badge de número y tag */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                  }}
                >
                  <span
                    style={{
                      fontFamily: "'JetBrains Mono', monospace",
                      fontSize: "0.75rem",
                      color: eje.color,
                      fontWeight: 800,
                      letterSpacing: "0.08em",
                      background: `${eje.color}18`,
                      padding: "0.2rem 0.55rem",
                      borderRadius: "2px",
                    }}
                  >
                    EJE {eje.num}
                  </span>
                </div>

                {/* Ícono centrado con halo suave */}
                <div
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: "50%",
                    background: `${eje.color}15`,
                    border: `1px solid ${eje.color}45`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    margin: "0.2rem 0",
                  }}
                >
                  <eje.icon size={24} color={eje.color} />
                </div>

                <h2
                  style={{
                    fontFamily: "'Archivo Black', sans-serif",
                    fontSize: "1.1rem",
                    color: "#F5F1E8",
                    margin: 0,
                    letterSpacing: "-0.01em",
                    lineHeight: 1.15,
                  }}
                >
                  {eje.title}
                </h2>

                {/* Badge técnico del servicio */}
                <span
                  style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: "0.76rem",
                    color: eje.color,
                    fontWeight: 600,
                    letterSpacing: "0.02em",
                  }}
                >
                  {eje.tech}
                </span>

                <p
                  style={{
                    fontFamily: "Inter, system-ui, sans-serif",
                    fontSize: "0.88rem",
                    color: "rgba(245,241,232,0.68)",
                    margin: 0,
                    lineHeight: 1.45,
                    fontWeight: 400,
                  }}
                >
                  {eje.desc}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default S18_Etapa3Intro;
