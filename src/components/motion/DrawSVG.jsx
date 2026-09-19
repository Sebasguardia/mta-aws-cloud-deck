// src/components/motion/DrawSVG.jsx
import React from "react";
import { motion } from "framer-motion";
import { easings } from "../../lib/easings";

/**
 * Componente SVG trazado (draw-on effect) usando stroke-dashoffset animado.
 */
export function DrawSVG({
  path,
  width = 100,
  height = 100,
  stroke = "currentColor",
  strokeWidth = 2,
  active = true,
  duration = 1.2,
  delay = 0,
  className = "",
  fill = "none",
  viewBox,
}) {
  const pathVariants = {
    hidden: { pathLength: 0, opacity: 0 },
    visible: {
      pathLength: 1,
      opacity: 1,
      transition: {
        pathLength: { duration, ease: easings.cinematic, delay },
        opacity: { duration: 0.2, delay },
      },
    },
  };

  return (
    <svg
      width={width}
      height={height}
      viewBox={viewBox || `0 0 ${width} ${height}`}
      className={`overflow-visible ${className}`}
    >
      <motion.path
        d={path}
        fill={fill}
        stroke={stroke}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        variants={pathVariants}
        initial="hidden"
        animate={active ? "visible" : "hidden"}
      />
    </svg>
  );
}

export default DrawSVG;
