// src/slides/S09_CAF.jsx
import React, { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import {
  ArrowLeftRight,
  Server,
  Layers,
  Check,
  X,
  Zap,
  ShieldAlert,
  Compass,
  Cpu,
  Workflow,
  ArrowRight,
} from "lucide-react";
import { slidesContent } from "../data/content.es.js";
import { useSlideActive } from "../hooks/useSlideActive.js";
import { useSharedDeckState } from "../hooks/useSharedDeckState.js";
import { CafTransformationCanvas } from "../components/three/CafTransformationCanvas.jsx";
import { CanvasTransitionWrapper } from "../components/motion/CanvasTransitionWrapper.jsx";
import { Badge } from "../components/ui/Badge.jsx";
import { easings } from "../lib/easings.js";

const c = slidesContent.s09_caf;

/**
 * S09 — Framework CAF (Cloud Adoption Framework de AWS).
 * Inicio del BLOQUE 3: LA PROPUESTA CLOUD.
 *
 * Directivas de diseño:
 *  - /industrial-brutalist-ui:
 *    Apertura del nuevo capítulo con acento dorado cálido (#D4A017) y verde oliva (#6E8E59).
 *    División de pantalla completa 50%/50% sin barras de scroll ni marcos restrictivos.
 *  - /impeccable:
 *    Editorial potente con tipografía Archivo Black y subtítulos en monospace JetBrains.
 *    Transición cromática desde la escala de grises y rojo de alerta hacia el oro cloud.
 *  - /threejs-geometry + /threejs-animation + /threejs-interaction:
 *    `CafTransformationCanvas`: Animación 3D en Three.js que interpola con lerp suave
 *    las 10 laptops fragmentadas hacia una constelación de usuarios coordinados con el VPC.
 *  - /emil-design-eng + /animate:
 *    Switch toggle táctil "Antes (Hostinger/Localhost)" vs "Después (Ecosistema AWS)"
 *    con micro-animaciones físicas y sincronización con `useSharedDeckState`.
 */
export function S09_CAF({ isActive: propActive } = {}) {
  const shouldReduceMotion = useReducedMotion();
  const hookActive = useSlideActive(8);
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

  // Estado compartido para el Toggle Antes vs Después
  const { cafPerspective, setCafPerspective } = useSharedDeckState();
  const isAfter = cafPerspective === "after";

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

      {/* ── Resplandor ambiental de iluminación Cloud (Renacimiento visual) ── */}
      <motion.div
        aria-hidden="true"
        animate={{
          opacity: isAfter ? 0.25 : 0.08,
          scale: isAfter ? 1.05 : 0.95,
        }}
        transition={{ duration: 0.8, ease: "easeInOut" }}
        style={{
          position: "absolute",
          inset: 0,
          background: isAfter
            ? "radial-gradient(circle at 75% 50%, rgba(212,160,23,0.2) 0%, transparent 65%)"
            : "radial-gradient(circle at 75% 50%, rgba(100,100,100,0.12) 0%, transparent 65%)",
          pointerEvents: "none",
          zIndex: 1,
        }}
      />

      {/* ── Barra de acento vertical izquierda Oro AWS ── */}
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
          background: isAfter ? "#d4a017" : "rgba(245,241,232,0.4)",
          transition: "background 0.4s ease",
          zIndex: 3,
        }}
      />

      {/* ══════════════════════════════════════════════════════════
          COLUMNA IZQUIERDA (50%): Metodología CAF & Comparativa
      ══════════════════════════════════════════════════════════ */}
      <div
        style={{
          flex: "0 0 50%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "2.1rem 3rem 2.1rem 4.5rem",
          position: "relative",
          zIndex: 2,
          gap: "0.95rem",
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
                fontSize: "0.80rem",
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                fontWeight: 500,
                color: "#d4a017",
                background: "rgba(212,160,23,0.12)",
                border: "1px solid rgba(212,160,23,0.4)",
                padding: "0.28rem 0.75rem",
              }}
            >
              [ {c.badge} ]
            </span>
            <span
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: "0.76rem",
                letterSpacing: "0.12em",
                color: "rgba(245,241,232,0.48)",
                fontWeight: 400,
              }}
            >
              SEC_09 // CLOUD_ADOPTION_FRAMEWORK
            </span>
          </motion.div>

          <motion.p
            variants={fadeUp(0.08)}
            initial="hidden"
            animate={entered ? "visible" : "hidden"}
            style={{
              fontFamily: "Yellowtail, cursive",
              fontSize: "clamp(1.4rem, 2.3vw, 2.05rem)",
              color: "#e8a0bf",
              lineHeight: 1.1,
              margin: "0.15rem 0 0 0",
              fontWeight: 400,
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
              fontWeight: 400,
            }}
          >
            {c.title}
          </motion.h1>

          <motion.p
            variants={fadeUp(0.16)}
            initial="hidden"
            animate={entered ? "visible" : "hidden"}
            style={{
              fontFamily: "Inter, sans-serif",
              fontSize: "clamp(0.94rem, 1.1vw, 1.02rem)",
              color: "rgba(245,241,232,0.76)",
              margin: "0.2rem 0 0 0",
              lineHeight: 1.5,
              fontWeight: 400,
            }}
          >
            {c.subtitle}
          </motion.p>
        </div>

        {/* Switch Toggle Brutalista "Antes vs Después" */}
        <motion.div
          variants={fadeUp(0.22)}
          initial="hidden"
          animate={entered ? "visible" : "hidden"}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "0.55rem 0.7rem",
            background: "rgba(18,18,18,0.9)",
            border: "1.5px solid rgba(245,241,232,0.15)",
            boxShadow: "4px 4px 0px #000000",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", paddingLeft: "0.5rem" }}>
            <ArrowLeftRight size={15} style={{ color: isAfter ? "#d4a017" : "rgba(245,241,232,0.5)" }} />
            <span
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: "0.76rem",
                letterSpacing: "0.12em",
                color: "rgba(245,241,232,0.8)",
                textTransform: "uppercase",
                fontWeight: 500,
              }}
            >
              TRANSFORMACIÓN CAF
            </span>
          </div>

          <div style={{ display: "flex", gap: "0.4rem" }}>
            <button
              type="button"
              onClick={() => setCafPerspective("before")}
              style={{
                fontFamily: "'Archivo Black', sans-serif",
                fontSize: "0.78rem",
                textTransform: "uppercase",
                padding: "0.45rem 1.0rem",
                letterSpacing: "0.04em",
                cursor: "pointer",
                border: "1px solid",
                borderColor: !isAfter ? "#c6432b" : "rgba(245,241,232,0.1)",
                background: !isAfter ? "#c6432b" : "transparent",
                color: !isAfter ? "#FFFFFF" : "rgba(245,241,232,0.5)",
                transition: "all 0.15s ease",
                fontWeight: 400,
              }}
            >
              ANTES // HOSTINGER
            </button>

            <button
              type="button"
              onClick={() => setCafPerspective("after")}
              style={{
                fontFamily: "'Archivo Black', sans-serif",
                fontSize: "0.78rem",
                textTransform: "uppercase",
                padding: "0.45rem 1.0rem",
                letterSpacing: "0.04em",
                cursor: "pointer",
                border: "1px solid",
                borderColor: isAfter ? "#d4a017" : "rgba(245,241,232,0.1)",
                background: isAfter ? "#d4a017" : "transparent",
                color: isAfter ? "#0A0A0A" : "rgba(245,241,232,0.5)",
                transition: "all 0.15s ease",
                fontWeight: 400,
              }}
            >
              DESPUÉS // AWS CLOUD
            </button>
          </div>
        </motion.div>

        {/* Las 2 Perspectivas CAF Clave: Tecnología & Procesos */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.85rem" }}>
          {/* Perspectiva 1: Tecnología */}
          <motion.div
            variants={fadeUp(0.28)}
            initial="hidden"
            animate={entered ? "visible" : "hidden"}
            style={{
              padding: "0.95rem 1.15rem",
              background: isAfter ? "rgba(212,160,23,0.06)" : "rgba(255,255,255,0.02)",
              border: isAfter ? "1.5px solid rgba(212,160,23,0.5)" : "1px solid rgba(245,241,232,0.12)",
              borderTop: isAfter ? "3px solid #d4a017" : "3px solid #c6432b",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              minHeight: 180,
              boxShadow: "4px 4px 0px rgba(0,0,0,0.6)",
              transition: "all 0.3s ease",
            }}
          >
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.45rem" }}>
                <span
                  style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: "0.72rem",
                    letterSpacing: "0.12em",
                    color: isAfter ? "#d4a017" : "#c6432b",
                    fontWeight: 500,
                  }}
                >
                  01 // TECNOLOGÍA
                </span>
                <Cpu size={15} style={{ color: isAfter ? "#d4a017" : "#c6432b" }} />
              </div>

              <h3
                style={{
                  fontFamily: "'Archivo Black', sans-serif",
                  fontSize: "0.98rem",
                  color: "#F5F1E8",
                  textTransform: "uppercase",
                  margin: "0 0 0.45rem 0",
                  letterSpacing: "0.01em",
                  fontWeight: 400,
                }}
              >
                {c.perspectiveTech.name}
              </h3>

              <p
                style={{
                  fontFamily: "Inter, sans-serif",
                  fontSize: "0.88rem",
                  color: "rgba(245,241,232,0.76)",
                  lineHeight: 1.48,
                  margin: 0,
                  fontWeight: 400,
                }}
              >
                {isAfter ? c.perspectiveTech.after : c.perspectiveTech.before}
              </p>
            </div>

            <div
              style={{
                marginTop: "0.75rem",
                paddingTop: "0.45rem",
                borderTop: "1px solid rgba(245,241,232,0.1)",
                display: "flex",
                alignItems: "center",
                gap: "0.45rem",
              }}
            >
              {isAfter ? (
                <>
                  <Check size={14} style={{ color: "#6e8e59" }} />
                  <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.74rem", color: "#6e8e59", fontWeight: 500 }}>
                    Alta disponibilidad & VPC
                  </span>
                </>
              ) : (
                <>
                  <X size={14} style={{ color: "#c6432b" }} />
                  <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.74rem", color: "#c6432b", fontWeight: 500 }}>
                    Cuello de botella en host
                  </span>
                </>
              )}
            </div>
          </motion.div>

          {/* Perspectiva 2: Procesos */}
          <motion.div
            variants={fadeUp(0.34)}
            initial="hidden"
            animate={entered ? "visible" : "hidden"}
            style={{
              padding: "0.95rem 1.15rem",
              background: isAfter ? "rgba(110,142,89,0.06)" : "rgba(255,255,255,0.02)",
              border: isAfter ? "1.5px solid rgba(110,142,89,0.5)" : "1px solid rgba(245,241,232,0.12)",
              borderTop: isAfter ? "3px solid #6e8e59" : "3px solid #c6432b",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              minHeight: 180,
              boxShadow: "4px 4px 0px rgba(0,0,0,0.6)",
              transition: "all 0.3s ease",
            }}
          >
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.45rem" }}>
                <span
                  style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: "0.72rem",
                    letterSpacing: "0.12em",
                    color: isAfter ? "#6e8e59" : "#c6432b",
                    fontWeight: 500,
                  }}
                >
                  02 // PROCESOS
                </span>
                <Workflow size={15} style={{ color: isAfter ? "#6e8e59" : "#c6432b" }} />
              </div>

              <h3
                style={{
                  fontFamily: "'Archivo Black', sans-serif",
                  fontSize: "0.98rem",
                  color: "#F5F1E8",
                  textTransform: "uppercase",
                  margin: "0 0 0.45rem 0",
                  letterSpacing: "0.01em",
                  fontWeight: 400,
                }}
              >
                {c.perspectiveProc.name}
              </h3>

              <p
                style={{
                  fontFamily: "Inter, sans-serif",
                  fontSize: "0.88rem",
                  color: "rgba(245,241,232,0.76)",
                  lineHeight: 1.48,
                  margin: 0,
                  fontWeight: 400,
                }}
              >
                {isAfter ? c.perspectiveProc.after : c.perspectiveProc.before}
              </p>
            </div>

            <div
              style={{
                marginTop: "0.75rem",
                paddingTop: "0.45rem",
                borderTop: "1px solid rgba(245,241,232,0.1)",
                display: "flex",
                alignItems: "center",
                gap: "0.45rem",
              }}
            >
              {isAfter ? (
                <>
                  <Check size={14} style={{ color: "#6e8e59" }} />
                  <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.74rem", color: "#6e8e59", fontWeight: 500 }}>
                    Staging real & CI/CD ágil
                  </span>
                </>
              ) : (
                <>
                  <X size={14} style={{ color: "#c6432b" }} />
                  <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.74rem", color: "#c6432b", fontWeight: 500 }}>
                    Pases manuales e inseguros
                  </span>
                </>
              )}
            </div>
          </motion.div>
        </div>

        {/* Cita Metodológica CAF */}
        <motion.div
          variants={fadeUp(0.4)}
          initial="hidden"
          animate={entered ? "visible" : "hidden"}
          style={{
            padding: "0.75rem 1.15rem",
            background: "rgba(0,0,0,0.55)",
            border: "1px solid rgba(245,241,232,0.15)",
            borderLeft: "3px solid #d4a017",
            display: "flex",
            alignItems: "center",
            gap: "0.85rem",
          }}
        >
          <Compass size={22} style={{ color: "#d4a017", flexShrink: 0 }} />
          <p
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: "0.80rem",
              color: "rgba(245,241,232,0.78)",
              lineHeight: 1.48,
              margin: 0,
              fontWeight: 400,
            }}
          >
            {c.concept}
          </p>
        </motion.div>
      </div>

      {/* ══════════════════════════════════════════════════════════
          COLUMNA DERECHA (50%): Visualizador 3D CAF & Telemetría
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
            <Server size={16} style={{ color: isAfter ? "#d4a017" : "rgba(245,241,232,0.5)" }} />
            <span
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: "0.78rem",
                letterSpacing: "0.15em",
                color: isAfter ? "#d4a017" : "rgba(245,241,232,0.65)",
                textTransform: "uppercase",
                fontWeight: 400,
              }}
            >
              {isAfter ? "AWS CLOUD ECOSYSTEM // RESILIENT MESH" : "LEGACY SHARED HOST // FRAGMENTED"}
            </span>
          </div>

          <div
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: "0.74rem",
              padding: "0.25rem 0.65rem",
              background: isAfter ? "rgba(212,160,23,0.15)" : "rgba(0,0,0,0.6)",
              border: isAfter ? "1px solid #d4a017" : "1px solid rgba(245,241,232,0.15)",
              color: isAfter ? "#d4a017" : "rgba(245,241,232,0.5)",
              fontWeight: 500,
            }}
          >
            {isAfter ? "CAF: STAGE_03 ADOPTED" : "CAF: STAGE_01 DIAGNOSED"}
          </div>
        </div>

        {/* Canvas 3D Three.js (Desmontado condicional GPU) */}
        <div
          style={{
            width: "100%",
            height: "75%",
            position: "relative",
            zIndex: 5,
          }}
        >
          <CanvasTransitionWrapper isActive={isActive}>
            <CafTransformationCanvas
              isActive={isActive}
              isAfter={isAfter}
            />
          </CanvasTransitionWrapper>
        </div>

        {/* HUD Inferior de los 10 Practicantes Coordinados */}
        <div
          style={{
            position: "absolute",
            bottom: "2rem",
            left: "3rem",
            right: "3.5rem",
            zIndex: 10,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "0.7rem 1.15rem",
            background: isAfter ? "rgba(212,160,23,0.08)" : "rgba(14,14,14,0.75)",
            border: isAfter ? "1px solid rgba(212,160,23,0.4)" : "1px solid rgba(245,241,232,0.15)",
            backdropFilter: "blur(6px)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
            <span
              style={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                backgroundColor: isAfter ? "#d4a017" : "#888888",
              }}
            />
            <span
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: "0.76rem",
                color: isAfter ? "#d4a017" : "rgba(245,241,232,0.65)",
                textTransform: "uppercase",
                fontWeight: 500,
              }}
            >
              {isAfter ? "10 IDENTIDADES IAM AISLADAS EN MALLA" : "10 LOCALHOSTS AISLADOS SIN STAGING"}
            </span>
          </div>

          <span
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: "0.74rem",
              color: isAfter ? "#6e8e59" : "rgba(245,241,232,0.45)",
              fontWeight: 500,
            }}
          >
            {isAfter ? "GOBIERNO CENTRALIZADO: 100%" : "RIESGO OPERATIVO: ALTO"}
          </span>
        </div>
      </div>
    </section>
  );
}

export default S09_CAF;