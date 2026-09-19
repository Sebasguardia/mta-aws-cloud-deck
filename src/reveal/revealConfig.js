// src/reveal/revealConfig.js
// Configuración de reveal.js optimizada para integración SPA con React

export const revealConfig = {
  // Hash URL para compartir/recargar slides (#/2)
  hash: true,

  // Controles de navegación
  controls: true,
  controlsTutorial: false,
  controlsLayout: "bottom-right",
  controlsBackArrows: "faded",

  // Barra de progreso
  progress: true,

  // Sin centrado vertical automático — el flexbox de React lo maneja
  center: false,

  // Transición default entre slides — manejada por nuestro motor cinemático CSS en reveal-overrides.css
  transition: "none",
  transitionSpeed: "default",
  backgroundTransition: "fade",

  // Navegación
  keyboard: true,
  touch: true,
  overview: true,

  /*
   * DIMENSIONES: "100%" le dice a Reveal que use el tamaño real del contenedor.
   * minScale/maxScale = 1 desactiva el zoom/scaling de Reveal — nuestros
   * componentes usan clamp() + flexbox para ser responsivos por su cuenta.
   *
   * NOTA CRÍTICA: El CSS de reveal-overrides.css NO debe poner
   * "transform: none !important" en .reveal .slides, porque Reveal usa
   * transform: translateX(-N×100%) para navegar entre slides.
   */
  width: "100%",
  height: "100%",
  margin: 0,
  minScale: 1,
  maxScale: 1,

  // Plugins (se cargan async en plugins.js)
  plugins: [],
};
