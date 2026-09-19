// src/components/motion/RevealText.jsx
import React from "react";
import { motion } from "framer-motion";
import { easings } from "../../lib/easings";

/**
 * Split-word text cinematic reveal.
 * Despliega cada palabra con física ponderada, desenfoque de película y desplazamiento vertical suave.
 */
export function RevealText({
  text,
  active = true,
  className = "",
  delay = 0,
  as: Component = "p",
}) {
  if (!text) return null;

  const words = text.split(" ");

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.035,
        delayChildren: delay,
      },
    },
  };

  const wordVariants = {
    hidden: {
      opacity: 0,
      y: 18,
      filter: "blur(5px)",
      scale: 0.98,
    },
    visible: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      scale: 1,
      transition: {
        duration: 0.45,
        ease: easings.cinematic,
      },
    },
  };

  return (
    <Component className={`${className}`}>
      <motion.span
        variants={containerVariants}
        initial="hidden"
        animate={active ? "visible" : "hidden"}
        className="inline"
      >
        {words.map((word, idx) => (
          <motion.span
            key={`${word}-${idx}`}
            variants={wordVariants}
            className="inline-block mr-[0.26em] whitespace-nowrap will-change-transform"
          >
            {word}
          </motion.span>
        ))}
      </motion.span>
    </Component>
  );
}

export default RevealText;
