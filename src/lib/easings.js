// src/lib/easings.js
// Curvas calibradas según diseño-stilo-animacion.md y principios de Emil Kowalski

export const easings = {
  // Entradas de texto, modales y headers principales — "desaceleración cinematográfica con peso"
  cinematic: [0.22, 1, 0.36, 1],

  // Botones, switches, toggles y feedback de interacción táctil
  snappy: [0.16, 1, 0.3, 1],

  // Cortinas y wipes cinematográficos de clip-path
  wipe: [0.83, 0, 0.17, 1],

  // Spring estándar para hover de tarjetas, chips y botones
  spring: {
    type: "spring",
    stiffness: 260,
    damping: 22,
    mass: 0.8,
  },

  // Spring más vivo para badges de alerta y contadores
  springBouncy: {
    type: "spring",
    stiffness: 320,
    damping: 18,
    mass: 0.6,
  },

  // Spring suave y pesado para transiciones de layouts compartidos (layoutId)
  springGentle: {
    type: "spring",
    stiffness: 180,
    damping: 24,
    mass: 1.2,
  },
};

// Formato CSS string para uso en inline styles o animaciones de vanilla CSS
export const cssEasings = {
  cinematic: "cubic-bezier(0.22, 1, 0.36, 1)",
  snappy: "cubic-bezier(0.16, 1, 0.3, 1)",
  wipe: "cubic-bezier(0.83, 0, 0.17, 1)",
};
