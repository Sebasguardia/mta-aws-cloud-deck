// src/slides/S12b_Etapa2Intro.jsx
import React, { useEffect, useState, useRef } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Cpu, HardDrive, Database, ArrowRight } from "lucide-react";
import { useSlideActive } from "../hooks/useSlideActive.js";

/**
 * Slide 12b / S12b_Etapa2Intro — Separador minimalista y directo: ETAPA 2
 * Solo el título y los 3 puntos clave que se van a tocar, limpio, centrado, sin 3D.
 */
export function S12b_Etapa2Intro({ isActive: propActive } = {}) {
  const shouldReduceMotion = useReducedMotion();
  const hookActive = useSlideActive(12);
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

  const puntos = [
    {
      num: "01",
      title: "CÓMPUTO",
      desc: "Amazon EC2 & AWS Lambda",
      color: "#d4a017",
      icon: Cpu,
    },
    {
      num: "02",
      title: "ALMACENAMIENTO",
      desc: "Amazon S3 & Amazon EFS",
      color: "#7a9b5c",
      icon: HardDrive,
    },
    {
      num: "03",
      title: "BASES DE DATOS",
      desc: "Amazon RDS Multi-AZ",
      color: "#e8a0bf",
      icon: Database,
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
        background: "#0A0A0A",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        padding: "2rem",
        boxSizing: "border-box",
      }}
    >
      {/* Retícula ambiental sutil */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "linear-gradient(rgba(245,241,232,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(245,241,232,0.02) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
          pointerEvents: "none",
        }}
      />

      <div
        style={{
          maxWidth: "1050px",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
          gap: "2.2rem",
          position: "relative",
          zIndex: 2,
        }}
      >
        {/* Cabecera / Título */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0.5rem" }}>
          <motion.div
            variants={fadeUp(0.04)}
            initial="hidden"
            animate={entered ? "visible" : "hidden"}
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: "0.95rem",
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              fontWeight: 700,
              color: "#d4a017",
              background: "rgba(212,160,23,0.1)",
              border: "1px solid rgba(212,160,23,0.35)",
              padding: "0.35rem 1rem",
            }}
          >
            [ ENTREGABLE 2 ]
          </motion.div>

          <motion.h1
            variants={fadeUp(0.1)}
            initial="hidden"
            animate={entered ? "visible" : "hidden"}
            style={{
              fontFamily: "'Archivo Black', 'Arial Black', sans-serif",
              fontSize: "clamp(3rem, 5.5vw, 4.8rem)",
              color: "#F5F1E8",
              letterSpacing: "-0.02em",
              textTransform: "uppercase",
              margin: 0,
              lineHeight: 1,
            }}
          >
            ETAPA 2
          </motion.h1>

          <motion.div
            initial={{ scaleX: 0 }}
            animate={entered ? { scaleX: 1 } : { scaleX: 0 }}
            transition={{ duration: 0.5, delay: 0.18 }}
            style={{
              height: 3,
              width: "120px",
              background: "#d4a017",
              margin: "0.3rem auto 0.2rem auto",
            }}
          />

          <motion.p
            variants={fadeUp(0.16)}
            initial="hidden"
            animate={entered ? "visible" : "hidden"}
            style={{
              fontFamily: "Inter, system-ui, sans-serif",
              fontSize: "clamp(1.15rem, 1.4vw, 1.35rem)",
              color: "rgba(245,241,232,0.75)",
              margin: 0,
              fontWeight: 400,
            }}
          >
            Servicios Core de Infraestructura en AWS
          </motion.p>
        </div>

        {/* Los 3 Puntos a tocar */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "1.6rem",
            width: "100%",
          }}
        >
          {puntos.map((punto, idx) => (
            <motion.div
              key={punto.num}
              variants={fadeUp(0.22 + idx * 0.08)}
              initial="hidden"
              animate={entered ? "visible" : "hidden"}
              style={{
                background: "#0d0d0d",
                border: `1.5px solid rgba(245,241,232,0.12)`,
                borderTop: `4px solid ${punto.color}`,
                padding: "2rem 1.6rem",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                textAlign: "center",
                gap: "0.85rem",
                boxShadow: "0 10px 30px rgba(0,0,0,0.5)",
              }}
            >
              <div
                style={{
                  width: 52,
                  height: 52,
                  borderRadius: "50%",
                  background: `${punto.color}15`,
                  border: `1px solid ${punto.color}40`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <punto.icon size={26} color={punto.color} />
              </div>

              <span
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: "0.82rem",
                  color: punto.color,
                  fontWeight: 700,
                  letterSpacing: "0.1em",
                }}
              >
                PUNTO {punto.num}
              </span>

              <h2
                style={{
                  fontFamily: "'Archivo Black', sans-serif",
                  fontSize: "1.35rem",
                  color: "#F5F1E8",
                  margin: 0,
                  letterSpacing: "-0.01em",
                }}
              >
                {punto.title}
              </h2>

              <p
                style={{
                  fontFamily: "Inter, system-ui, sans-serif",
                  fontSize: "1rem",
                  color: "rgba(245,241,232,0.7)",
                  margin: 0,
                  fontWeight: 500,
                }}
              >
                {punto.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default S12b_Etapa2Intro;
