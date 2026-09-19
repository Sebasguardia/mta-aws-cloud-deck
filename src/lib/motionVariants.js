// src/lib/motionVariants.js
// Variantes reutilizables para Framer Motion con principios de diseño anti-slop
import { easings } from "./easings";

// Contenedor con escalonamiento (stagger) de hijos
export const staggerContainer = (staggerTime = 0.1, delayChildren = 0.05) => ({
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: staggerTime,
      delayChildren: delayChildren,
    },
  },
});

// Entrada suave sin escala artificial (nunca scale: 0)
export const fadeIn = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.35,
      ease: easings.cinematic,
    },
  },
  exit: {
    opacity: 0,
    transition: {
      duration: 0.2,
      ease: easings.snappy,
    },
  },
};

// Entrada vertical con peso visual
export const slideUp = {
  hidden: {
    opacity: 0,
    y: 28,
    scale: 0.98,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.45,
      ease: easings.cinematic,
    },
  },
  exit: {
    opacity: 0,
    y: -16,
    scale: 0.98,
    transition: {
      duration: 0.25,
      ease: easings.snappy,
    },
  },
};

// Entrada lateral izquierda
export const slideInLeft = {
  hidden: {
    opacity: 0,
    x: -32,
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.4,
      ease: easings.cinematic,
    },
  },
};

// Entrada lateral derecha
export const slideInRight = {
  hidden: {
    opacity: 0,
    x: 32,
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.4,
      ease: easings.cinematic,
    },
  },
};

// Revelación tipo cortina cinematográfica (clip-path)
export const curtainReveal = {
  hidden: {
    clipPath: "inset(0% 100% 0% 0%)",
  },
  visible: {
    clipPath: "inset(0% 0% 0% 0%)",
    transition: {
      duration: 0.65,
      ease: easings.wipe,
    },
  },
};

// Efecto táctil brutalista para hover y click en tarjetas
export const cardBrutalMotion = {
  rest: {
    x: 0,
    y: 0,
    boxShadow: "6px 6px 0px var(--ink)",
  },
  hover: {
    x: -3,
    y: -3,
    boxShadow: "10px 10px 0px var(--ink)",
    transition: {
      duration: 0.15,
      ease: easings.snappy,
    },
  },
  tap: {
    x: 2,
    y: 2,
    boxShadow: "2px 2px 0px var(--ink)",
    transition: {
      duration: 0.08,
      ease: easings.snappy,
    },
  },
};

// Tarjetas oscuras para Bloque 3 (acento dorado)
export const cardBrutalGoldMotion = {
  rest: {
    x: 0,
    y: 0,
    boxShadow: "6px 6px 0px var(--gold)",
  },
  hover: {
    x: -3,
    y: -3,
    boxShadow: "10px 10px 0px var(--gold)",
    transition: {
      duration: 0.15,
      ease: easings.snappy,
    },
  },
};

// Animación de popovers y tooltips que nacen desde su disparador
export const popoverMotion = {
  hidden: {
    opacity: 0,
    scale: 0.95,
    y: 6,
  },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: easings.spring,
  },
  exit: {
    opacity: 0,
    scale: 0.96,
    transition: {
      duration: 0.15,
      ease: easings.snappy,
    },
  },
};
