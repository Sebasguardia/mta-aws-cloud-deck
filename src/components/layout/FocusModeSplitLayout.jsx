// src/components/layout/FocusModeSplitLayout.jsx
import React from "react";
import { motion, AnimatePresence } from "framer-motion";

/**
 * FocusModeSplitLayout Component
 * Reusable container for slide layouts that toggle between HUD split view and 100% 3D Focus view.
 * Uses GPU-accelerated motion properties, AnimatePresence, and smooth blur/opacity easing
 * to ensure silky 60 FPS transitions without layout thrashing or lag.
 */
export function FocusModeSplitLayout({
  isFocusMode,
  leftPanel,
  rightPanel,
  leftWidth = "46%",
  rightWidth = "54%",
}) {
  const easeCurve = [0.16, 1, 0.3, 1];

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        position: "relative",
        display: "flex",
        flexDirection: "row",
        overflow: "hidden",
      }}
    >
      {/* ══════════════ COLUMNA IZQUIERDA (PANEL HUD) ══════════════ */}
      <AnimatePresence mode="sync">
        {!isFocusMode && (
          <motion.div
            key="focus-left-panel"
            initial={{ opacity: 0, x: -12, filter: "blur(4px)" }}
            animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, x: -12, filter: "blur(4px)" }}
            transition={{ duration: 0.28, ease: easeCurve }}
            style={{
              width: leftWidth,
              height: "100%",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              padding: "1.8rem 1.8rem 1.8rem 4.2rem",
              position: "relative",
              zIndex: 8,
              gap: "1.35rem",
              boxSizing: "border-box",
              overflow: "hidden",
              borderRight: "1px solid rgba(245,241,232,0.08)",
              flexShrink: 0,
            }}
          >
            {leftPanel}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ══════════════ COLUMNA DERECHA (LIENZO 3D) ══════════════ */}
      <motion.div
        key="focus-right-panel"
        animate={{
          width: isFocusMode ? "100%" : rightWidth,
          paddingLeft: isFocusMode ? "2.5rem" : "1rem",
          position: isFocusMode ? "absolute" : "relative",
          inset: isFocusMode ? 0 : "auto",
          zIndex: isFocusMode ? 30 : 5,
        }}
        transition={{ duration: 0.32, ease: easeCurve }}
        style={{
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          paddingTop: "1.8rem",
          paddingBottom: "1.8rem",
          paddingRight: "2.5rem",
          boxSizing: "border-box",
        }}
      >
        {rightPanel}
      </motion.div>
    </div>
  );
}

export default FocusModeSplitLayout;
