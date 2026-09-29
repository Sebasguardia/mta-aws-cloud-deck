// src/slides/S15_Almacenamiento.jsx
import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import {
  HardDrive,
  FolderArchive,
  Share2,
  Clock,
  Activity,
  Archive,
  TrendingDown,
} from "lucide-react";
import { slidesContent } from "../data/content.es.js";
import { useSlideActive } from "../hooks/useSlideActive.js";

const c = slidesContent.s15_almacenamiento;

export function S15_Almacenamiento({ isActive: propActive } = {}) {
  const shouldReduceMotion = useReducedMotion();
  const hookActive = useSlideActive(13);
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
  const [selectedStorage, setSelectedStorage] = useState("s3");
  const [lifecycleDay, setLifecycleDay] = useState(90);
  const [pulse, setPulse] = useState(false);
  // Animated savings counter
  const [displaySavings, setDisplaySavings] = useState(0);

  useEffect(() => {
    if (!isActive) return;
    const t = setTimeout(() => setEntered(true), 40);
    return () => { clearTimeout(t); setEntered(false); };
  }, [isActive]);

  useEffect(() => {
    if (!entered) return;
    const interval = setInterval(() => setPulse(p => !p), 1100);
    return () => clearInterval(interval);
  }, [entered]);

  // Animate savings number when lifecycleDay changes
  const targetSavings = lifecycleDay < 30 ? 0 : lifecycleDay < 90 ? 46 : 84;
  useEffect(() => {
    if (shouldReduceMotion) { setDisplaySavings(targetSavings); return; }
    let start = displaySavings;
    const step = (targetSavings - start) / 20;
    if (Math.abs(step) < 0.5) { setDisplaySavings(targetSavings); return; }
    let frame = 0;
    const id = setInterval(() => {
      frame++;
      start += step;
      setDisplaySavings(Math.round(start));
      if (frame >= 20) { setDisplaySavings(targetSavings); clearInterval(id); }
    }, 25);
    return () => clearInterval(id);
  }, [targetSavings]); // eslint-disable-line react-hooks/exhaustive-deps

  const fadeUp = (delay = 0) => ({
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 18 },
    visible: {
      opacity: 1, y: 0,
      transition: { duration: shouldReduceMotion ? 0.1 : 0.52, ease: [0.16, 1, 0.3, 1], delay },
    },
  });

  const storageServices = {
    s3: {
      id: "s3", name: "Amazon S3 (Simple Storage Service)", category: "Almacenamiento de Objetos",
      icon: FolderArchive, color: "#d4a017",
      title: "Almacenamiento de Objetos con 11 Nueves de Durabilidad",
      pricing: "$0.023 / GB al mes (5 GB gratis en Free Tier)",
      mtaPurpose: "Assets estáticos de clientes (Strato Studio, VIISION), builds Next.js y fotos de practicantes.",
      desc: "Servicio de almacenamiento ilimitado y de ultra alta durabilidad (99.999999999%). Los archivos se sirven mediante URLs seguras o integrados con Amazon CloudFront para distribución global.",
      retentionPolicy: "Bucket 'mta-production-backups' configurado con versionado activo y cifrado en reposo SSE-S3.",
      advantageHostinger: "En Hostinger las imágenes competían por espacio del servidor; en S3 el almacenamiento es independiente y virtualmente infinito.",
    },
    efs: {
      id: "efs", name: "Amazon EFS (Elastic File System)", category: "Sistema de Archivos Compartido (NFSv4)",
      icon: Share2, color: "#7a9b5c",
      title: "Almacenamiento Concurrente para los 10 Practicantes Remotos",
      pricing: "$0.30 / GB al mes (Escalado elástico automático)",
      mtaPurpose: "Workspace compartido de desarrollo remoto, sincronización de repositorios y volumen persistente para contenedores ECS.",
      desc: "Sistema de archivos de red administrado (NFSv4) que se monta de manera concurrente en múltiples instancias EC2 y contenedores a través de diferentes Zonas de Disponibilidad.",
      retentionPolicy: "Montaje POSIX estándar en '/mnt/mta-shared-workspace' accesible por los 10 desarrolladores remotos.",
      advantageHostinger: "Permite a los 10 practicantes compartir librerías pesadas y datasets de staging sin duplicar archivos en 10 laptops individuales.",
    },
    glacier: {
      id: "glacier", name: "Amazon S3 Glacier Flexible Retrieval", category: "Archivado Histórico de Largo Plazo",
      icon: Archive, color: "#e8a0bf",
      title: "Archivado en Frío con Reducción de Costos del 84%",
      pricing: "$0.0036 / GB al mes (Ahorro masivo vs Standard)",
      mtaPurpose: "Respaldos históricos de bases de datos, logs de auditoría CloudTrail y registros de asistencia de Workspace MTA.",
      desc: "Almacenamiento seguro, duradero y de bajísimo costo para datos que deben retenerse por normativas legales y académicas pero a los que se accede esporádicamente.",
      retentionPolicy: "Regla de transición automática: backups > 90 días se transfieren a Glacier y se eliminan a los 365 días.",
      advantageHostinger: "Hostinger cobraba la misma tarifa por gigabyte sin importar si el archivo era una web activa o un backup de hace dos años.",
    },
  };

  const lifecycleSteps = [
    { day: 0,  label: "Día 1–30",   tier: "S3 Standard",    cost: "$23.00/TB",  savings: 0  },
    { day: 30, label: "Día 31–90",  tier: "S3 Standard-IA", cost: "$12.50/TB",  savings: 46 },
    { day: 90, label: "Día 91+",    tier: "S3 Glacier",     cost: "$3.60/TB",   savings: 84 },
  ];

  const current = storageServices[selectedStorage] || storageServices.s3;
  const currentLifecycle = lifecycleSteps.find(s => s.day === lifecycleDay) || lifecycleSteps[2];

  return (
    <section
      ref={sectionRef}
      className="slide-fullscreen"
      style={{ width: "100%", height: "100%", position: "relative", background: "#0A0A0A", overflow: "hidden", display: "flex", flexDirection: "row" }}
    >
      <div aria-hidden="true" style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(245,241,232,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(245,241,232,0.025) 1px, transparent 1px)", backgroundSize: "64px 64px", pointerEvents: "none", zIndex: 0 }} />
      <div aria-hidden="true" style={{ position: "absolute", inset: 0, background: "repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,0,0,0.07) 3px, rgba(0,0,0,0.07) 6px)", pointerEvents: "none", zIndex: 1 }} />
      <div aria-hidden="true" style={{ position: "absolute", inset: 0, background: "radial-gradient(circle at 75% 50%, rgba(212,160,23,0.18) 0%, transparent 65%)", pointerEvents: "none", zIndex: 1 }} />

      <motion.div aria-hidden="true"
        initial={{ scaleY: 0, transformOrigin: "top" }}
        animate={entered ? { scaleY: 1 } : { scaleY: 0 }}
        transition={{ duration: shouldReduceMotion ? 0.1 : 0.65, ease: [0.83, 0, 0.17, 1], delay: 0.05 }}
        style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 4, background: "#d4a017", zIndex: 3 }}
      />

      {/* ══════════════ COLUMNA IZQUIERDA ══════════════ */}
      <div style={{ flex: "0 0 50%", display: "flex", flexDirection: "column", justifyContent: "center", padding: "2.1rem 2.8rem 2.1rem 4.5rem", position: "relative", zIndex: 2, gap: "0.85rem" }}>

        <div style={{ display: "flex", flexDirection: "column", gap: "0.2rem" }}>
          <motion.div variants={fadeUp(0.04)} initial="hidden" animate={entered ? "visible" : "hidden"} style={{ display: "flex", alignItems: "center", gap: "0.75rem", flexWrap: "wrap" }}>
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.80rem", letterSpacing: "0.15em", textTransform: "uppercase", fontWeight: 500, color: "#d4a017", background: "rgba(212,160,23,0.12)", border: "1px solid rgba(212,160,23,0.4)", padding: "0.28rem 0.75rem" }}>
              [ {c.badge} ]
            </span>
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.76rem", letterSpacing: "0.12em", color: "rgba(245,241,232,0.65)", fontWeight: 400 }}>
              SEC_15 // STORAGE_AND_ARCHIVE
            </span>
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.74rem", color: "#7a9b5c", background: "rgba(122,155,92,0.15)", border: "1px solid rgba(122,155,92,0.35)", padding: "0.24rem 0.6rem", fontWeight: 500 }}>
              S3 · EFS · GLACIER
            </span>
          </motion.div>

          <motion.p variants={fadeUp(0.08)} initial="hidden" animate={entered ? "visible" : "hidden"}
            style={{ fontFamily: "Yellowtail, cursive", fontSize: "clamp(1.4rem, 2.3vw, 2.05rem)", color: "#e8a0bf", lineHeight: 1.1, margin: "0.15rem 0 0 0", fontWeight: 400 }}>
            {c.scriptTag}
          </motion.p>

          <motion.h1 variants={fadeUp(0.12)} initial="hidden" animate={entered ? "visible" : "hidden"}
            style={{ fontFamily: "'Archivo Black', 'Arial Black', sans-serif", fontSize: "clamp(1.7rem, 2.6vw, 2.5rem)", color: "#F5F1E8", letterSpacing: "-0.025em", lineHeight: 1.05, textTransform: "uppercase", margin: 0, fontWeight: 400 }}>
            {c.title}
          </motion.h1>

          <motion.div
            initial={{ clipPath: "inset(0 100% 0 0)" }}
            animate={entered ? { clipPath: "inset(0 0% 0 0)" } : { clipPath: "inset(0 100% 0 0)" }}
            transition={{ duration: shouldReduceMotion ? 0.1 : 0.55, ease: [0.83, 0, 0.17, 1], delay: 0.18 }}
            style={{ height: 2, background: "#d4a017", width: "100%", maxWidth: 220, margin: "0.2rem 0" }}
          />

          <motion.p variants={fadeUp(0.16)} initial="hidden" animate={entered ? "visible" : "hidden"}
            style={{ fontFamily: "Inter, system-ui, -apple-system, sans-serif", fontSize: "clamp(0.94rem, 1.1vw, 1.02rem)", color: "rgba(245,241,232,0.78)", margin: 0, lineHeight: 1.5, fontWeight: 400 }}>
            {c.subtitle}
          </motion.p>
        </div>

        {/* Selector de 3 servicios */}
        <motion.div variants={fadeUp(0.22)} initial="hidden" animate={entered ? "visible" : "hidden"}
          style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "0.45rem", background: "rgba(18,18,18,0.9)", border: "1.5px solid rgba(245,241,232,0.15)", padding: "0.45rem" }}>
          {Object.values(storageServices).map((s) => {
            const isSelected = selectedStorage === s.id;
            return (
              <button key={s.id} type="button" onClick={() => setSelectedStorage(s.id)}
                style={{ background: isSelected ? "#d4a017" : "transparent", color: isSelected ? "#0A0A0A" : "rgba(245,241,232,0.85)", border: isSelected ? "1px solid #d4a017" : "1px solid rgba(245,241,232,0.12)", padding: "0.55rem 0.4rem", fontFamily: "'JetBrains Mono', monospace", fontSize: "0.76rem", fontWeight: isSelected ? 600 : 500, cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: "0.28rem", transition: "all 0.18s ease", position: "relative", overflow: "hidden" }}>
                {isSelected && (
                  <motion.div layoutId="storage-selector-glow"
                    style={{ position: "absolute", inset: 0, background: "rgba(212,160,23,0.15)" }}
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
                <s.icon size={17} style={{ position: "relative", zIndex: 1 }} />
                <span style={{ position: "relative", zIndex: 1, letterSpacing: "0.04em" }}>{s.id.toUpperCase()}</span>
              </button>
            );
          })}
        </motion.div>

        {/* Simulador de Ciclo de Vida con contador animado */}
        <motion.div variants={fadeUp(0.28)} initial="hidden" animate={entered ? "visible" : "hidden"}
          style={{ padding: "0.85rem 1rem", background: "#0c0c0c", border: "1.5px solid rgba(212,160,23,0.35)", display: "flex", flexDirection: "column", gap: "0.55rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.76rem", color: "#d4a017", fontWeight: 600 }}>
              POLÍTICA DE CICLO DE VIDA (S3 LIFECYCLE RULE):
            </span>
            {/* Animated savings counter */}
            <div style={{ display: "flex", alignItems: "baseline", gap: "0.25rem" }}>
              <motion.span
                key={targetSavings}
                style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "1.1rem", color: targetSavings > 0 ? "#7a9b5c" : "rgba(245,241,232,0.4)", fontWeight: 600 }}>
                {displaySavings}%
              </motion.span>
              {targetSavings > 0 && (
                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.68rem", color: "#7a9b5c", fontWeight: 600 }}>AHORRO</span>
              )}
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "0.45rem" }}>
            {lifecycleSteps.map((p) => {
              const isActive2 = lifecycleDay >= p.day;
              const isCurrent = lifecycleDay === p.day;
              return (
                <motion.button key={p.day} type="button" onClick={() => setLifecycleDay(p.day)}
                  whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                  style={{ flex: 1, background: isActive2 ? "rgba(212,160,23,0.15)" : "#141414", border: isCurrent ? "1.5px solid #d4a017" : isActive2 ? "1px solid rgba(212,160,23,0.5)" : "1px solid rgba(245,241,232,0.12)", color: isActive2 ? "#d4a017" : "rgba(245,241,232,0.65)", padding: "0.5rem 0.35rem", fontFamily: "'JetBrains Mono', monospace", fontSize: "0.72rem", fontWeight: 500, cursor: "pointer", transition: "all 0.2s ease" }}>
                  <div>{p.label}</div>
                  <div style={{ fontSize: "0.66rem", opacity: 0.85, marginTop: "0.15rem", fontWeight: 400 }}>{p.tier}</div>
                </motion.button>
              );
            })}
          </div>

          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.72rem", color: "rgba(245,241,232,0.8)", display: "flex", justifyContent: "space-between", borderTop: "1px dashed rgba(245,241,232,0.15)", paddingTop: "0.4rem", fontWeight: 400 }}>
            <span>NIVEL ACTIVO: <strong style={{ color: "#F5F1E8", fontWeight: 600 }}>{currentLifecycle.tier}</strong></span>
            <span>COSTO ESTIMADO: <strong style={{ color: "#7a9b5c", fontWeight: 600 }}>{currentLifecycle.cost}</strong></span>
          </div>
        </motion.div>

        {/* Summary cards */}
        <motion.div variants={fadeUp(0.36)} initial="hidden" animate={entered ? "visible" : "hidden"}
          style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.65rem" }}>
          {[
            { title: "OBJETOS Y ASSETS: S3", color: "#d4a017", desc: "Imágenes y builds servidos con latencia milimétrica mediante CloudFront desde PoPs en Sudamérica." },
            { title: "SISTEMA COMPARTIDO: EFS", color: "#7a9b5c", desc: "Disco NFS montado simultáneo para los 10 practicantes remotos sin duplicar archivos." },
          ].map((item, i) => (
            <motion.div key={i} whileHover={{ scale: 1.02, borderColor: item.color }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
              style={{ padding: "0.75rem 0.9rem", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(245,241,232,0.12)", borderLeft: `3px solid ${item.color}`, cursor: "default" }}>
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.78rem", color: item.color, fontWeight: 600, display: "block" }}>{item.title}</span>
              <p style={{ fontFamily: "Inter, system-ui, sans-serif", fontSize: "0.82rem", color: "rgba(245,241,232,0.85)", margin: "0.25rem 0 0 0", lineHeight: 1.4, fontWeight: 400 }}>{item.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* ══════════════ COLUMNA DERECHA ══════════════ */}
      <div style={{ flex: "0 0 50%", position: "relative", display: "flex", flexDirection: "column", justifyContent: "center", padding: "2.1rem 3.5rem 2.1rem 1rem", zIndex: 2, gap: "0.75rem" }}>

        <motion.div variants={fadeUp(0.1)} initial="hidden" animate={entered ? "visible" : "hidden"}
          style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0.45rem 0.85rem", background: "#101010", border: "1px solid rgba(245,241,232,0.12)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.55rem" }}>
            <motion.div animate={{ opacity: pulse ? 1 : 0.3, scale: pulse ? 1.2 : 0.9 }} transition={{ duration: 0.5 }}
              style={{ width: 8, height: 8, borderRadius: "50%", background: "#7a9b5c" }} />
            <HardDrive size={16} style={{ color: "#d4a017" }} />
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.78rem", letterSpacing: "0.14em", color: "rgba(245,241,232,0.85)", textTransform: "uppercase", fontWeight: 500 }}>
              DATA RETENTION & STORAGE MATRIX // SEMANA 7
            </span>
          </div>
          <AnimatePresence mode="wait">
            <motion.span key={selectedStorage + "-price"}
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}
              style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.72rem", color: "#7a9b5c", fontWeight: 600 }}>
              {current.pricing}
            </motion.span>
          </AnimatePresence>
        </motion.div>

        {/* Detail Card — AnimatePresence swap */}
        <AnimatePresence mode="wait">
          <motion.div key={selectedStorage}
            initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 20, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: shouldReduceMotion ? 0 : -16, scale: 0.97 }}
            transition={{ duration: shouldReduceMotion ? 0.1 : 0.38, ease: [0.16, 1, 0.3, 1] }}
            style={{ background: "#0c0c0c", border: `2px solid ${current.color}55`, padding: "1.1rem 1.15rem", display: "flex", flexDirection: "column", gap: "0.8rem" }}>

            <div style={{ display: "flex", alignItems: "center", gap: "0.85rem" }}>
              <motion.div
                initial={{ scale: 0, rotate: -20 }} animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", stiffness: 400, damping: 20, delay: 0.05 }}
                style={{ width: 44, height: 44, background: `${current.color}22`, border: `1px solid ${current.color}`, display: "flex", alignItems: "center", justifyContent: "center", color: current.color, flexShrink: 0 }}>
                <current.icon size={23} />
              </motion.div>
              <div>
                <h3 style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: "1.1rem", color: "#F5F1E8", margin: 0, textTransform: "uppercase", fontWeight: 400 }}>{current.name}</h3>
                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.74rem", color: current.color, fontWeight: 500 }}>{current.category}</span>
              </div>
            </div>

            <p style={{ fontFamily: "Inter, system-ui, sans-serif", fontSize: "0.88rem", color: "rgba(245,241,232,0.9)", lineHeight: 1.5, margin: 0, fontWeight: 400 }}>
              {current.desc}
            </p>

            <motion.div initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.3, delay: 0.1 }}
              style={{ borderLeft: "3.5px solid #d4a017", background: "rgba(212,160,23,0.06)", padding: "0.6rem 0.85rem" }}>
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.72rem", color: "#d4a017", fontWeight: 600, display: "block", marginBottom: "0.22rem" }}>
                PROPUESTA DE USO EN MTA SOFTWARE:
              </span>
              <p style={{ fontFamily: "Inter, system-ui, sans-serif", fontSize: "0.82rem", color: "#F5F1E8", margin: 0, lineHeight: 1.44, fontWeight: 400 }}>{current.mtaPurpose}</p>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.3, delay: 0.18 }}
              style={{ background: "#121212", border: "1px solid rgba(245,241,232,0.1)", padding: "0.65rem 0.85rem", display: "flex", flexDirection: "column", gap: "0.28rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <Clock size={15} style={{ color: "#d4a017" }} />
                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.74rem", color: "#d4a017", fontWeight: 600 }}>POLÍTICA DE RETENCIÓN Y ARCHIVADO:</span>
              </div>
              <p style={{ fontFamily: "Inter, system-ui, sans-serif", fontSize: "0.82rem", color: "rgba(245,241,232,0.88)", margin: 0, lineHeight: 1.44, fontWeight: 400 }}>{current.retentionPolicy}</p>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.3, delay: 0.26 }}
              style={{ borderLeft: "3.5px solid #7a9b5c", background: "rgba(122,155,92,0.06)", padding: "0.6rem 0.85rem" }}>
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.72rem", color: "#7a9b5c", fontWeight: 600, display: "block", marginBottom: "0.22rem" }}>
                SUPERACIÓN DEL HOSPEDAJE TRADICIONAL:
              </span>
              <p style={{ fontFamily: "Inter, system-ui, sans-serif", fontSize: "0.82rem", color: "#F5F1E8", margin: 0, lineHeight: 1.44, fontWeight: 400 }}>{current.advantageHostinger}</p>
            </motion.div>
          </motion.div>
        </AnimatePresence>

        <motion.div variants={fadeUp(0.45)} initial="hidden" animate={entered ? "visible" : "hidden"}
          style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.70rem", color: "rgba(245,241,232,0.6)", display: "flex", justifyContent: "space-between", fontWeight: 400 }}>
          <span>ENTREGABLE 2 · ESTRATEGIA DE STORAGE</span>
          <span style={{ color: "#d4a017", fontWeight: 500 }}>SEMANA 7 · SENATI</span>
        </motion.div>
      </div>
    </section>
  );
}

export default S15_Almacenamiento;
