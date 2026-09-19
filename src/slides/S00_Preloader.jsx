// src/slides/S00_Preloader.jsx
import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { slidesContent } from "../data/content.es.js";

const c = slidesContent.s00_preloader;

/**
 * S00 — Preloader cinemático.
 * - Draw-on del logotipo MTA con SVG dashoffset.
 * - Cortina de clip-path que asciende para revelar el Slide 01.
 * - Tecla SPACE / click = skip inmediato.
 * Purpose: Explanation + Delight (first-time, rare event).
 * Tool: Framer Motion + CSS @keyframes para el texto ticker.
 * Props: opacity + transform (GPU-safe). No scale(0). No transition:all.
 */
export function S00_Preloader({ onComplete }) {
  const [phase, setPhase] = useState("intro"); // intro | exit
  const timerRef = useRef(null);

  const skip = () => {
    if (phase === "exit") return;
    clearTimeout(timerRef.current);
    setPhase("exit");
    setTimeout(() => onComplete?.(), 600);
  };

  useEffect(() => {
    // Auto-advance after 2.6s
    timerRef.current = setTimeout(() => {
      setPhase("exit");
      setTimeout(() => onComplete?.(), 700);
    }, 2600);
    return () => clearTimeout(timerRef.current);
  }, [onComplete]);

  useEffect(() => {
    const handler = (e) => {
      if (e.code === "Space" || e.code === "Enter") skip();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [phase]);

  return (
    <AnimatePresence>
      {phase !== "done" && (
        <motion.div
          key="preloader"
          initial={{ opacity: 1 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          onClick={skip}
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center cursor-pointer select-none overflow-hidden"
          style={{ background: "#0a0a0a" }}
          aria-label="Preloader — click para saltar"
        >
          {/* Blueprint grid tenue */}
          <div
            className="absolute inset-0 opacity-10 pointer-events-none"
            style={{
              backgroundImage:
                "linear-gradient(#d4a017 1px, transparent 1px), linear-gradient(90deg, #d4a017 1px, transparent 1px)",
              backgroundSize: "40px 40px",
            }}
          />

          {/* CRT scanlines */}
          <div
            className="absolute inset-0 pointer-events-none z-10"
            style={{
              background:
                "repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(0,0,0,0.18) 2px,rgba(0,0,0,0.18) 4px)",
            }}
          />

          {/* Centro del contenido */}
          <div className="relative z-20 flex flex-col items-center gap-6">
            {/* Logo SVG draw-on */}
            <motion.div
              initial={{ opacity: 0, transform: "translateY(12px)" }}
              animate={{ opacity: 1, transform: "translateY(0px)" }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
              className="relative"
            >
              {/* SVG logotipo "MTA" con stroke dashoffset draw-on */}
              <svg
                width="220"
                height="120"
                viewBox="0 0 220 120"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
              >
                {/* Borde exterior brutalista */}
                <motion.rect
                  x="2" y="2" width="216" height="116"
                  stroke="#D4A017" strokeWidth="2" fill="none"
                  strokeDasharray="664"
                  initial={{ strokeDashoffset: 664 }}
                  animate={{ strokeDashoffset: 0 }}
                  transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
                />
                {/* Letras MTA */}
                <motion.text
                  x="50%" y="74"
                  textAnchor="middle"
                  fontFamily="'Archivo Black', sans-serif"
                  fontWeight="900"
                  fontSize="72"
                  letterSpacing="-3"
                  fill="none"
                  stroke="#F5F1E8"
                  strokeWidth="1.5"
                  strokeDasharray="800"
                  initial={{ strokeDashoffset: 800 }}
                  animate={{ strokeDashoffset: 0 }}
                  transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1], delay: 0.35 }}
                >
                  MTA
                </motion.text>
                {/* Fill fill que sigue al stroke */}
                <motion.text
                  x="50%" y="74"
                  textAnchor="middle"
                  fontFamily="'Archivo Black', sans-serif"
                  fontWeight="900"
                  fontSize="72"
                  letterSpacing="-3"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.4, delay: 1.3 }}
                  fill="#F5F1E8"
                >
                  MTA
                </motion.text>
              </svg>

              {/* Etiqueta técnica mono debajo del logo */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4, delay: 1.1 }}
                className="text-center mt-1"
              >
                <span
                  className="font-mono text-[11px] uppercase tracking-[0.22em] text-gold font-bold"
                  style={{ color: "#D4A017" }}
                >
                  SOFTWARE
                </span>
              </motion.div>
            </motion.div>

            {/* Texto de estadio */}
            <motion.div
              initial={{ opacity: 0, transform: "translateY(8px)" }}
              animate={{ opacity: 1, transform: "translateY(0px)" }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1], delay: 1.3 }}
              className="text-center px-6"
            >
              <p
                className="font-mono text-[11px] uppercase tracking-[0.18em] font-bold"
                style={{ color: "rgba(245,241,232,0.5)" }}
              >
                {c.stage}
              </p>
            </motion.div>

            {/* Barra de progreso brutalista */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.4, duration: 0.3 }}
              className="w-48 h-[3px] relative overflow-hidden"
              style={{ background: "rgba(245,241,232,0.1)" }}
            >
              <motion.div
                initial={{ transform: "translateX(-100%)" }}
                animate={{ transform: "translateX(0%)" }}
                transition={{ duration: 1.2, ease: "linear", delay: 1.4 }}
                className="absolute inset-0"
                style={{ background: "#D4A017" }}
              />
            </motion.div>

            {/* Skip hint */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.45 }}
              transition={{ delay: 1.8, duration: 0.4 }}
              className="font-mono text-[10px] uppercase tracking-widest"
              style={{ color: "#F5F1E8" }}
            >
              {c.skipNotice}
            </motion.p>
          </div>

          {/* Etiqueta de esquina */}
          <div
            className="absolute bottom-6 right-6 font-mono text-[10px] uppercase tracking-tech"
            style={{ color: "rgba(212,160,23,0.5)" }}
          >
            REV 1.0 // ETAPA 01
          </div>
          <div
            className="absolute top-6 left-6 font-mono text-[10px] uppercase tracking-tech"
            style={{ color: "rgba(212,160,23,0.5)" }}
          >
            AWS CLOUD PRACTITIONER ESSENTIALS
          </div>
          {/* Crosshairs */}
          <span className="absolute top-3 left-3 text-gold font-mono text-xs opacity-30 select-none" style={{ color: "#D4A017" }}>＋</span>
          <span className="absolute top-3 right-3 text-gold font-mono text-xs opacity-30 select-none" style={{ color: "#D4A017" }}>＋</span>
          <span className="absolute bottom-3 left-3 text-gold font-mono text-xs opacity-30 select-none" style={{ color: "#D4A017" }}>＋</span>
          <span className="absolute bottom-3 right-3 text-gold font-mono text-xs opacity-30 select-none" style={{ color: "#D4A017" }}>＋</span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default S00_Preloader;
