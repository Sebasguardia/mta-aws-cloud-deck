// src/App.jsx
import React, { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { RevealDeck } from "./reveal/RevealDeck.jsx";
import { S01_Cover } from "./slides/S01_Cover.jsx";
import { S02_Agenda } from "./slides/S02_Agenda.jsx";
import { S03_Empresa } from "./slides/S03_Empresa.jsx";
import { S04_Equipo } from "./slides/S04_Equipo.jsx";
import { S05_Portafolio } from "./slides/S05_Portafolio.jsx";
import { S06_Infra } from "./slides/S06_Infra.jsx";
import { S07_Workflow } from "./slides/S07_Workflow.jsx";
import { S08_Limitaciones } from "./slides/S08_Limitaciones.jsx";
import { S09_CAF } from "./slides/S09_CAF.jsx";
import { S10_Economia } from "./slides/S10_Economia.jsx";
import { S11_IAM } from "./slides/S11_IAM.jsx";
import { S12_Arquitectura } from "./slides/S12_Arquitectura.jsx";
import { S13_Roadmap } from "./slides/S13_Roadmap.jsx";
import { S14_Cierre } from "./slides/S14_Cierre.jsx";

/**
 * App — punto de ensamblado del deck.
 *
 * Flujo de transición Preloader → Slide 01:
 *   1. Preloader (fullscreen fixed) hace su intro (1.6s).
 *   2. onComplete() sube el estado: preloaderDone = true.
 *   3. AnimatePresence anima el preloader saliendo con clip-path
 *      "cortina sube" (wipe de abajo hacia arriba, 650ms ease wipe).
 *   4. Al mismo tiempo S01_Cover recibe isActive=true y dispara su stagger.
 *
 * Para agregar slides:
 *   - Importar el slide.
 *   - Añadirlo dentro de <RevealDeck>.
 *   - Pasar isActive={activeSlide === N}.
 */
function App() {
  const [preloaderDone, setPreloaderDone] = useState(false);
  const [activeSlide, setActiveSlide] = useState(0);
  const [skipActivate, setSkipActivate] = useState(false);

  const handleSlideChange = useCallback((index) => {
    setActiveSlide(index);
  }, []);

  const handlePreloaderComplete = useCallback(() => {
    setPreloaderDone(true);
  }, []);

  // Activar isActive del primer slide justo después de que la cortina desaparece
  useEffect(() => {
    if (preloaderDone) {
      const t = setTimeout(() => setSkipActivate(true), 100);
      return () => clearTimeout(t);
    }
  }, [preloaderDone]);

  return (
    <div style={{ width: "100vw", height: "100vh", overflow: "hidden", background: "#0a0a0a" }}>
      {/* ── RevealDeck siempre montado (para que Reveal inicialice) ── */}
      <RevealDeck onSlideChange={handleSlideChange}>
        {/* Slide 01 — Portada */}
        <S01_Cover isActive={skipActivate && activeSlide === 0} />

        {/* Slide 02 — Agenda */}
        <S02_Agenda isActive={activeSlide === 1} />

        {/* Slide 03 — La Empresa */}
        <S03_Empresa isActive={activeSlide === 2} />

        {/* Slide 04 — El Equipo de TI */}
        <S04_Equipo isActive={activeSlide === 3} />

        {/* Slide 05 — Portafolio de Proyectos */}
        <S05_Portafolio isActive={activeSlide === 4} />

        {/* Slide 06 — Infraestructura Actual */}
        <S06_Infra isActive={activeSlide === 5} />

        {/* Slide 07 — Flujo de Trabajo */}
        <S07_Workflow isActive={activeSlide === 6} />

        {/* Slide 08 — Los 3 Problemas Críticos */}
        <S08_Limitaciones isActive={activeSlide === 7} />

        {/* Slide 09 — Framework CAF */}
        <S09_CAF isActive={activeSlide === 8} />

        {/* Slide 10 — Modelo Económico */}
        <S10_Economia isActive={activeSlide === 9} />

        {/* Slide 11 — Seguridad y Gobierno IAM */}
        <S11_IAM isActive={activeSlide === 10} />

        {/* Slide 12 — Arquitectura de Red Propuesta (Hero) */}
        <S12_Arquitectura isActive={activeSlide === 11} />

        {/* Slide 13 — Roadmap de Adopción Cloud */}
        <S13_Roadmap isActive={activeSlide === 12} />

        {/* Slide 14 — Cierre del Deck y Preguntas */}
        <S14_Cierre isActive={activeSlide === 13} />
      </RevealDeck>

      {/* ── Preloader: cortina cinematográfica encima del deck ── */}
      <AnimatePresence>
        {!preloaderDone && (
          <PreloaderCurtain onComplete={handlePreloaderComplete} />
        )}
      </AnimatePresence>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════
   PreloaderCurtain — Overlay de carga con salida wipe clip-path
   ════════════════════════════════════════════════════════════════ */
function PreloaderCurtain({ onComplete }) {
  const [phase, setPhase] = useState("intro"); // intro | exit
  const timerRef = React.useRef(null);

  const skip = React.useCallback(() => {
    if (phase === "exit") return;
    clearTimeout(timerRef.current);
    setPhase("exit");
    // Dejar que la animación exit de AnimatePresence (600ms) termine
    setTimeout(() => onComplete?.(), 700);
  }, [phase, onComplete]);

  useEffect(() => {
    // Auto-skip tras 2.4s de intro
    timerRef.current = setTimeout(skip, 2400);
    return () => clearTimeout(timerRef.current);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const handler = (e) => {
      if (e.code === "Space" || e.code === "Enter" || e.type === "click") skip();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [skip]);

  return (
    <motion.div
      key="preloader-curtain"
      initial={{ clipPath: "inset(0 0 0% 0)" }}
      exit={{
        clipPath: "inset(0 0 100% 0)",
        transition: {
          duration: 0.65,
          ease: [0.83, 0, 0.17, 1], // ease-wipe fuerte
        },
      }}
      onClick={skip}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        background: "#0a0a0a",
        cursor: "pointer",
        userSelect: "none",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
      }}
      aria-label="Cargando — click o ESPACIO para saltar"
    >
      {/* Blueprint grid */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "linear-gradient(rgba(212,160,23,0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(212,160,23,0.07) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
          pointerEvents: "none",
        }}
      />

      {/* CRT scanlines */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "repeating-linear-gradient(0deg,transparent,transparent 3px,rgba(0,0,0,0.12) 3px,rgba(0,0,0,0.12) 6px)",
          pointerEvents: "none",
          zIndex: 1,
        }}
      />

      {/* Contenido centrado */}
      <div style={{ position: "relative", zIndex: 2, display: "flex", flexDirection: "column", alignItems: "center", gap: 24 }}>
        {/* SVG Logo draw-on */}
        <motion.div
          initial={{ opacity: 0, transform: "translateY(14px)" }}
          animate={{ opacity: 1, transform: "translateY(0px)" }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
        >
          <svg width="200" height="110" viewBox="0 0 200 110" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            {/* Marco exterior */}
            <motion.rect
              x="2" y="2" width="196" height="106"
              stroke="#D4A017" strokeWidth="1.5" fill="none"
              strokeDasharray="600"
              initial={{ strokeDashoffset: 600 }}
              animate={{ strokeDashoffset: 0 }}
              transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
            />
            {/* Stroke draw */}
            <motion.text
              x="50%" y="72"
              textAnchor="middle"
              style={{ fontFamily: "'Archivo Black', 'Arial Black', sans-serif", fontWeight: 900, fontSize: 64, letterSpacing: -3 }}
              fill="none"
              stroke="#F5F1E8"
              strokeWidth="1.5"
              strokeDasharray="750"
              initial={{ strokeDashoffset: 750 }}
              animate={{ strokeDashoffset: 0 }}
              transition={{ duration: 1.3, ease: [0.22, 1, 0.36, 1], delay: 0.35 }}
            >
              MTA
            </motion.text>
            {/* Fill que aparece al final */}
            <motion.text
              x="50%" y="72"
              textAnchor="middle"
              style={{ fontFamily: "'Archivo Black', 'Arial Black', sans-serif", fontWeight: 900, fontSize: 64, letterSpacing: -3 }}
              fill="#F5F1E8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.35, delay: 1.25 }}
            >
              MTA
            </motion.text>
          </svg>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.1, duration: 0.4 }}
            style={{
              textAlign: "center",
              fontFamily: "'JetBrains Mono', 'Courier New', monospace",
              fontSize: "0.65rem",
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              color: "#D4A017",
              fontWeight: 700,
              marginTop: 4,
            }}
          >
            SOFTWARE
          </motion.p>
        </motion.div>

        {/* Etiqueta de etapa */}
        <motion.p
          initial={{ opacity: 0, transform: "translateY(6px)" }}
          animate={{ opacity: 0.5, transform: "translateY(0px)" }}
          transition={{ delay: 1.3, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          style={{
            fontFamily: "'JetBrains Mono', 'Courier New', monospace",
            fontSize: "0.65rem",
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            color: "#F5F1E8",
            textAlign: "center",
          }}
        >
          AWS CLOUD PRACTITIONER ESSENTIALS · ETAPA 01
        </motion.p>

        {/* Barra de progreso */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4, duration: 0.3 }}
          style={{ width: 180, height: 2, background: "rgba(245,241,232,0.1)", overflow: "hidden" }}
        >
          <motion.div
            initial={{ transform: "translateX(-100%)" }}
            animate={{ transform: "translateX(0%)" }}
            transition={{ duration: 1.0, ease: "linear", delay: 1.4 }}
            style={{ width: "100%", height: "100%", background: "#D4A017" }}
          />
        </motion.div>

        {/* Skip hint */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.35 }}
          transition={{ delay: 1.8, duration: 0.4 }}
          style={{
            fontFamily: "'JetBrains Mono', 'Courier New', monospace",
            fontSize: "0.6rem",
            letterSpacing: "0.16em",
            textTransform: "uppercase",
            color: "#F5F1E8",
            textAlign: "center",
          }}
        >
          ESPACIO / CLICK PARA INICIAR
        </motion.p>
      </div>

      {/* Corner labels */}
      <div
        style={{
          position: "absolute", top: 20, left: 20, zIndex: 3,
          fontFamily: "monospace", fontSize: "0.62rem", letterSpacing: "0.14em",
          textTransform: "uppercase", color: "rgba(212,160,23,0.45)",
        }}
      >
        AWS CLOUD PRACTITIONER ESSENTIALS
      </div>
      <div
        style={{
          position: "absolute", bottom: 20, right: 20, zIndex: 3,
          fontFamily: "monospace", fontSize: "0.62rem", letterSpacing: "0.14em",
          textTransform: "uppercase", color: "rgba(212,160,23,0.45)",
        }}
      >
        REV 1.0 // ETAPA 01
      </div>

      {/* Crosshairs */}
      {["top-left","top-right","bottom-left","bottom-right"].map((p) => (
        <span
          key={p}
          aria-hidden="true"
          style={{
            position: "absolute",
            top: p.includes("top") ? 10 : "auto",
            bottom: p.includes("bottom") ? 10 : "auto",
            left: p.includes("left") ? 12 : "auto",
            right: p.includes("right") ? 12 : "auto",
            color: "rgba(212,160,23,0.2)",
            fontSize: "0.8rem",
            fontFamily: "monospace",
            userSelect: "none",
            zIndex: 3,
          }}
        >＋</span>
      ))}
    </motion.div>
  );
}

export default App;
