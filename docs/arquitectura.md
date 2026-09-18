<div align="center">

# 🏗️ `arquitectura.md`

### Arquitectura técnica del proyecto — MTA Software × AWS Cloud Foundations

![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![Vite](https://img.shields.io/badge/Vite-5-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![Reveal.js](https://img.shields.io/badge/Reveal.js-5.x-FF0043?style=for-the-badge&logo=revealdotjs&logoColor=white)
![Tailwind](https://img.shields.io/badge/TailwindCSS-3-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)
![GSAP](https://img.shields.io/badge/GSAP-3-88CE02?style=for-the-badge&logo=greensock&logoColor=black)

</div>

---

## 🧩 Filosofía de arquitectura

`reveal.js` es un **framework de presentación** (maneja navegación, teclado, overview, fragmentos, transiciones), no un framework de UI. React es un **framework de UI** (maneja estado, componentes, interactividad). No compiten — se combinan así:

- **reveal.js controla el "contenedor" del deck**: la estructura `.reveal > .slides > section`, el sistema de navegación y las transiciones entre slides.
- **React vive _dentro_ de cada `<section>`** como "islas" de UI: cada slide es un componente React que se monta una sola vez al iniciar la app (SPA), y reveal.js simplemente muestra/oculta esas secciones ya montadas — así el estado de React (ej. un slider a medio mover) **no se pierde** al navegar entre slides.
- Esto se logra inicializando `Reveal.initialize()` en un `useEffect` **después** de que React terminó de renderizar todos los `<section>` (con `Reveal.sync()` si se agregan slides dinámicamente).

```
┌───────────────────────────────────────────────┐
│  reveal.js (navegación, transiciones, teclado) │
│  ┌───────────────────────────────────────────┐ │
│  │  React SPA (estado, componentes, motion)   │ │
│  │  ┌────────┐ ┌────────┐ ┌────────┐          │ │
│  │  │ Slide 1│ │ Slide 2│ │ Slide N│  ...      │ │
│  │  └────────┘ └────────┘ └────────┘          │ │
│  └───────────────────────────────────────────┘ │
└───────────────────────────────────────────────┘
```

---

## 📦 Stack completo

| Categoría                    | Librería                      | Para qué                                                                                          |
| ---------------------------- | ----------------------------- | ------------------------------------------------------------------------------------------------- |
| Build                        | **Vite**                      | Dev server instantáneo + bundling                                                                 |
| UI                           | **React 18**                  | Componentes, estado, islas interactivas                                                           |
| Deck engine                  | **reveal.js**                 | Motor de slides, transiciones nativas, overview, fragments                                        |
| Estilos                      | **TailwindCSS** + CSS Vars    | Utilidades + theming brutalista                                                                   |
| Animación de layout/gestos   | **Framer Motion**             | Toggles, drag, layout animations, `AnimatePresence`                                               |
| Animación de scroll/timeline | **GSAP** + `ScrollTrigger`    | Animaciones complejas por slide (draw-SVG, parallax, pin)                                         |
| División de texto            | **SplitType**                 | Split por palabra/carácter para animaciones cinematográficas (alternativa libre a GSAP SplitText) |
| Estado global ligero         | **Zustand**                   | Estado compartido entre slides (ej. resultado del `CostCalculator` visible luego en el resumen)   |
| Iconos                       | **lucide-react**              | Set de íconos consistente, sin genérico de stock                                                  |
| Gráficos                     | **Recharts**                  | Barra de costos (slide 10)                                                                        |
| Utilidades                   | **clsx**, **canvas-confetti** | Clases condicionales / cierre festivo sutil                                                       |
| Fuentes                      | **@fontsource** (self-hosted) | Performance — nada de Google Fonts CDN bloqueante                                                 |

> ❌ No se usa `localStorage`/`sessionStorage` en ningún componente — todo el estado vive en memoria (React/Zustand), según buenas prácticas de la app.

---

## 🗂️ Estructura de carpetas completa

```
mta-aws-cloud-deck/
├── public/
│   ├── favicon.svg
│   ├── og-image.png
│   └── assets/
│       ├── images/
│       │   ├── hero-texture.jpg          # imagen ancla (paleta cálida/oliva)
│       │   └── noise.png                 # grano de película, para overlays
│       └── icons/
│           └── aws/                      # sprites SVG de servicios (VPC, Route53, CloudFront...)
│
├── src/
│   ├── main.jsx                          # entry point, monta <App/>
│   ├── App.jsx                           # layout raíz: <RevealDeck>{slides}</RevealDeck>
│   │
│   ├── reveal/
│   │   ├── RevealDeck.jsx                # init/destroy de Reveal.js sobre children ya montados
│   │   ├── revealConfig.js               # opciones: transition, controls, hash, plugins
│   │   └── plugins.js                    # registro de plugins (Notes, Markdown si aplica, Zoom)
│   │
│   ├── slides/                           # 1 archivo = 1 <section> de reveal.js
│   │   ├── index.js                      # exporta el arreglo ordenado de slides
│   │   ├── S00_Preloader.jsx
│   │   ├── S01_Cover.jsx
│   │   ├── S02_Agenda.jsx
│   │   ├── S03_Empresa.jsx
│   │   ├── S04_EquipoTI.jsx
│   │   ├── S05_Portafolio.jsx
│   │   ├── S06_Infraestructura.jsx
│   │   ├── S07_Workflow.jsx
│   │   ├── S08_Limitaciones.jsx
│   │   ├── S09_CAF.jsx
│   │   ├── S10_Economia.jsx
│   │   ├── S11_IAM.jsx
│   │   ├── S12_Arquitectura.jsx
│   │   ├── S13_Roadmap.jsx
│   │   └── S14_Cierre.jsx
│   │
│   ├── components/
│   │   ├── ui/                           # átomos de diseño reutilizables
│   │   │   ├── Badge.jsx
│   │   │   ├── Button.jsx                # variantes: primary/outline/ghost (ver diseño-stilo-animacion.md)
│   │   │   ├── Card.jsx
│   │   │   ├── SectionLabel.jsx          # el "01 —" tipo brutalista
│   │   │   ├── Divider.jsx
│   │   │   ├── Tooltip.jsx
│   │   │   └── Chip.jsx
│   │   │
│   │   ├── motion/                       # primitivas de animación reutilizables
│   │   │   ├── RevealText.jsx            # split-by-word con SplitType + Framer stagger
│   │   │   ├── CountUp.jsx               # animación numérica
│   │   │   ├── DrawSVG.jsx               # animación stroke-dashoffset genérica
│   │   │   ├── ParallaxLayer.jsx         # capas con distinto scroll-speed (GSAP)
│   │   │   └── ClipReveal.jsx            # wipes tipo cortina de cine
│   │   │
│   │   └── dynamics/                     # los "componentes estrella" — la interactividad real
│   │       ├── OutageSimulator.jsx       # slide 08
│   │       ├── DeploySimulator.jsx       # slides 07 y 12 (props: mode="before"|"after")
│   │       ├── CostCalculator.jsx        # slide 10
│   │       ├── IAMGrid.jsx               # slides 04 y 11 (shared element)
│   │       ├── NetworkDiagram.jsx        # slide 12
│   │       └── BeforeAfterToggle.jsx     # slide 09
│   │
│   ├── hooks/
│   │   ├── useRevealSlideActive.js       # sabe si ESTE slide está activo (para disparar animaciones on-enter)
│   │   ├── useCountUp.js
│   │   ├── useSplitText.js
│   │   ├── useReducedMotion.js           # respeta prefers-reduced-motion en toda la app
│   │   └── useSharedDeckState.js         # wrapper sobre el store de Zustand
│   │
│   ├── store/
│   │   └── deckStore.js                  # Zustand: costos calculados, estado IAM, progreso del deck
│   │
│   ├── lib/
│   │   ├── gsap.js                       # registro de plugins GSAP (ScrollTrigger) una sola vez
│   │   ├── motionVariants.js             # variants de Framer Motion reutilizadas (fadeUp, staggerContainer...)
│   │   └── easings.js                    # curvas cubic-bezier custom (ver diseño-stilo-animacion.md)
│   │
│   ├── data/
│   │   ├── team.js                       # integrantes, instructor
│   │   ├── content.es.js                 # todos los textos del deck (fácil de editar sin tocar JSX)
│   │   └── awsServices.js                # definiciones cortas de VPC/Route53/CloudFront/IAM para tooltips
│   │
│   └── styles/
│       ├── index.css                     # @tailwind base/components/utilities + imports
│       ├── fonts.css                     # @font-face (Avenir Next Bold alt + script accent)
│       ├── theme.css                     # CSS custom properties (colores, spacing, radii)
│       └── reveal-overrides.css          # pisa estilos default de reveal.js (que no se vea "template")
│
├── docs/                                  # este set de documentos
│   ├── logica.md
│   ├── arquitectura.md
│   ├── diseño-stilo-animacion.md
│   └── README.md → (raíz del repo, no aquí)
│
├── index.html
├── tailwind.config.js
├── postcss.config.js
├── vite.config.js
├── package.json
├── .eslintrc.cjs
└── .gitignore
```

---

## 🔑 Archivos clave explicados

### `src/reveal/RevealDeck.jsx`

Componente contenedor. Responsabilidades:

1. Recibe `children` (las 15 `<section>` ya renderizadas por React).
2. En `useEffect` (una sola vez, `[]`), importa `reveal.js` dinámicamente y llama `Reveal.initialize(revealConfig)`.
3. Expone el evento `slidechanged` de reveal.js hacia un **listener global** que actualiza `useRevealSlideActive` — así cualquier slide sabe "soy yo el visible ahora mismo" y dispara sus animaciones de entrada (evita que todo se anime al cargar la página).
4. En el `return` de cleanup, llama `Reveal.destroy()` (relevante en dev con Fast Refresh).

### `src/reveal/revealConfig.js`

```js
export const revealConfig = {
  hash: true,
  controls: true,
  progress: true,
  center: false,
  transition: "slide", // default; cada <section> puede sobreescribir con data-transition
  transitionSpeed: "default",
  backgroundTransition: "fade",
  plugins: [], // Notes/Zoom si se necesitan
};
```

### `src/components/dynamics/*`

Cada componente de dinámica sigue el mismo contrato:

- Recibe `active` (boolean, viene de `useRevealSlideActive`) para no correr timers/animaciones cuando el slide no está en pantalla.
- Expone su propio estado local con `useState`/`useReducer` (no todo va a Zustand — solo lo que otro slide necesita leer).
- Usa **Framer Motion `AnimatePresence`** para las transiciones de "antes/después" (mount/unmount limpio).

### `src/data/content.es.js`

Todo el copy del deck vive aquí, no hardcodeado en JSX — así el diseño y el contenido están desacoplados (se puede iterar el texto sin tocar componentes, y facilita una futura versión `content.en.js`).

---

## ⚙️ package.json (dependencias núcleo)

```json
{
  "dependencies": {
    "react": "^18.3.0",
    "react-dom": "^18.3.0",
    "reveal.js": "^5.1.0",
    "framer-motion": "^11.0.0",
    "gsap": "^3.12.0",
    "split-type": "^0.3.4",
    "zustand": "^4.5.0",
    "lucide-react": "^0.400.0",
    "recharts": "^2.12.0",
    "clsx": "^2.1.0",
    "canvas-confetti": "^1.9.0"
  },
  "devDependencies": {
    "vite": "^5.4.0",
    "@vitejs/plugin-react": "^4.3.0",
    "tailwindcss": "^3.4.0",
    "postcss": "^8.4.0",
    "autoprefixer": "^10.4.0",
    "@fontsource/archivo-black": "^5.0.0"
  }
}
```

---

## 🚀 Setup / comandos

```bash
# 1. Clonar reveal.js como referencia de estructura (opcional, solo consulta)
git clone https://github.com/hakimel/reveal.js.git reference/reveal.js

# 2. Crear el proyecto real con Vite + React
npm create vite@latest mta-aws-cloud-deck -- --template react
cd mta-aws-cloud-deck

# 3. Instalar dependencias del stack
npm install reveal.js framer-motion gsap split-type zustand lucide-react recharts clsx canvas-confetti
npm install -D tailwindcss postcss autoprefixer @fontsource/archivo-black
npx tailwindcss init -p

# 4. Correr en desarrollo
npm run dev
```

> El repo de `hakimel/reveal.js` se clona **solo como referencia** de su estructura interna (temas, plugins) — el proyecto final **no** usa el HTML estático de reveal.js, sino su motor JS importado como dependencia npm dentro de la SPA de React.

---

## 🧱 Principios de la arquitectura

- ✅ **Escalable**: agregar un slide nuevo = crear `SXX_Nombre.jsx` + agregarlo a `slides/index.js`. Nada más se toca.
- ✅ **Flexible**: las dinámicas (`components/dynamics`) son independientes del slide que las usa — por eso `DeploySimulator` se reutiliza en el 07 y el 12 solo cambiando la prop `mode`.
- ✅ **Performante**: todos los slides se montan una vez (no hay remount al navegar), animaciones pesadas (GSAP/SVG) solo corren cuando `active === true`.
- ✅ **Mantenible**: contenido (`data/`), diseño (`styles/`, `lib/easings.js`) y lógica (`components/`, `hooks/`) están en carpetas separadas — se puede editar el copy sin riesgo de romper una animación.
- ✅ **Accesible**: `useReducedMotion` desactiva/reduce animaciones complejas si el usuario tiene la preferencia del sistema activada.
