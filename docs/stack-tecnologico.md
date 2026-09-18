<div align="center">

# ⚙️ `stack-tecnologico.md`

### Stack tecnológico detallado + guía paso a paso de creación del proyecto

![Node](https://img.shields.io/badge/Node.js-18%2B-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![npm](https://img.shields.io/badge/npm-10%2B-CB3837?style=for-the-badge&logo=npm&logoColor=white)
![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![Vite](https://img.shields.io/badge/Vite-5-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![Reveal.js](https://img.shields.io/badge/Reveal.js-5.x-FF0043?style=for-the-badge&logo=revealdotjs&logoColor=white)

_De cero a `npm run dev` funcionando. Sin saltos, sin dar nada por sabido._

</div>

---

## 🧭 Índice

1. [Stack tecnológico completo](#1-stack-tecnológico-completo)
2. [Requisitos previos](#2-requisitos-previos)
3. [Paso a paso: crear el proyecto](#3-paso-a-paso-crear-el-proyecto)
4. [Configuración de cada herramienta](#4-configuración-de-cada-herramienta)
5. [Scripts del `package.json`](#5-scripts-del-packagejson)
6. [Checklist final](#6-checklist-final)

---

## 1. Stack tecnológico completo

### 🧱 Capa base

| Herramienta   | Versión         | Rol                     | Por qué esta y no otra                                                                            |
| ------------- | --------------- | ----------------------- | ------------------------------------------------------------------------------------------------- |
| **Node.js**   | 18 LTS o 20 LTS | Runtime                 | Requisito de Vite 5 (mínimo Node 18)                                                              |
| **Vite**      | ^5.4            | Build tool / dev server | Arranque instantáneo (esbuild), HMR real para React, build final optimizado                       |
| **React**     | ^18.3           | Librería de UI          | Islas de componentes interactivos dentro del deck                                                 |
| **reveal.js** | ^5.1            | Motor de presentación   | Navegación entre slides, transiciones nativas, modo overview, soporte de teclado/touch/PDF export |

### 🎨 Estilos y diseño

| Herramienta                                                               | Versión      | Rol                                                           |
| ------------------------------------------------------------------------- | ------------ | ------------------------------------------------------------- |
| **TailwindCSS**                                                           | ^3.4         | Utilidades de estilo (spacing, layout, color tokens)          |
| **PostCSS** + **Autoprefixer**                                            | ^8.4 / ^10.4 | Procesamiento y compatibilidad cross-browser del CSS          |
| **@fontsource/archivo-black**                                             | ^5.0         | Fuente display self-hosted (sin depender de Google Fonts CDN) |
| **@fontsource/inter**                                                     | ^5.0         | Fuente de cuerpo                                              |
| **@fontsource/yellowtail** o **beau-rivage** (vía npm o self-host manual) | —            | Fuente script/acento                                          |

### 🎬 Animación

| Herramienta       | Versión | Rol                                                                                                             |
| ----------------- | ------- | --------------------------------------------------------------------------------------------------------------- |
| **Framer Motion** | ^11     | Animación de componentes React: layout, gestos, `AnimatePresence`, shared elements (`layoutId`)                 |
| **GSAP**          | ^3.12   | Timelines complejos, `ScrollTrigger`, animación de SVG (draw-on, motion path)                                   |
| **SplitType**     | ^0.3    | División de texto en palabras/caracteres para animaciones cinematográficas (alternativa libre a GSAP SplitText) |

### 🗃️ Estado y datos

| Herramienta  | Versión | Rol                                                                           |
| ------------ | ------- | ----------------------------------------------------------------------------- |
| **Zustand**  | ^4.5    | Estado global ligero (sin boilerplate de Redux) — comparte datos entre slides |
| **Recharts** | ^2.12   | Gráfico de barras animado (comparación de costos)                             |

### 🧩 UI / utilidades

| Herramienta         | Versión | Rol                                      |
| ------------------- | ------- | ---------------------------------------- |
| **lucide-react**    | ^0.400  | Set de íconos SVG consistente y liviano  |
| **clsx**            | ^2.1    | Composición condicional de clases CSS    |
| **canvas-confetti** | ^1.9    | Efecto sutil de cierre en el slide final |

### 🛠️ Calidad de código (dev)

| Herramienta              | Rol                                   |
| ------------------------ | ------------------------------------- |
| **ESLint**               | Linting de JS/JSX                     |
| **Prettier**             | Formateo consistente                  |
| **@vitejs/plugin-react** | Soporte de JSX + Fast Refresh en Vite |

---

## 2. Requisitos previos

Antes de crear el proyecto, verifica que tengas instalado:

```bash
node -v     # debe mostrar v18.x o v20.x (o superior)
npm -v      # debe mostrar 9.x o 10.x
git --version
```

Si no tienes Node.js instalado:

- **Windows/Mac**: descarga el instalador LTS desde [nodejs.org](https://nodejs.org/)
- **Mac (con Homebrew)**: `brew install node`
- **Linux (con nvm, recomendado)**:
  ```bash
  curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
  nvm install 20
  nvm use 20
  ```

---

## 3. Paso a paso: crear el proyecto

### Paso 1 — Crear la carpeta del proyecto en tu PC

```bash
mkdir mta-aws-cloud-deck
cd mta-aws-cloud-deck
```

### Paso 2 — Inicializar el proyecto con Vite + React

```bash
npm create vite@latest . -- --template react
```

> El `.` le dice a Vite que use la carpeta actual (la que acabas de crear) en vez de pedirte un nombre nuevo. Si te pregunta "¿la carpeta no está vacía, continuar?", confirma con `y` (está vacía, es solo la primera vez que npm pregunta).

Esto genera automáticamente:

```
mta-aws-cloud-deck/
├── public/
├── src/
│   ├── App.jsx
│   ├── main.jsx
│   └── ...
├── index.html
├── package.json
└── vite.config.js
```

### Paso 3 — Instalar las dependencias base

```bash
npm install
```

Esto instala `react` y `react-dom` que Vite ya dejó configurados en el `package.json`.

### Paso 4 — Instalar reveal.js (el motor del deck)

```bash
npm install reveal.js
```

### Paso 5 — Instalar las librerías de animación

```bash
npm install framer-motion gsap split-type
```

### Paso 6 — Instalar estado, gráficos e íconos

```bash
npm install zustand recharts lucide-react clsx canvas-confetti
```

### Paso 7 — Instalar y configurar TailwindCSS

```bash
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

Esto crea `tailwind.config.js` y `postcss.config.js`. Edita `tailwind.config.js` para que Tailwind sepa dónde buscar tus clases:

```js
// tailwind.config.js
/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#0A0A0A",
        paper: "#F5F1E8",
        gold: "#D4A017",
        olive: "#4A5D3A",
        blush: "#E8A0BF",
        risk: "#C6432B",
        safe: "#7A9B5C",
      },
    },
  },
  plugins: [],
};
```

### Paso 8 — Instalar las fuentes (self-hosted)

```bash
npm install @fontsource/archivo-black @fontsource/inter
```

> La fuente script (ej. Yellowtail o Beau Rivage) puede instalarse igual si existe en `@fontsource`, o descargarse manualmente y colocarse en `public/assets/fonts/` con su `@font-face` declarado en `src/styles/fonts.css` (detalle completo en `diseño-stilo-animacion.md`).

### Paso 9 — Crear la estructura de carpetas del proyecto

```bash
cd src
mkdir reveal slides components components/ui components/motion components/dynamics hooks store lib data styles
cd ..
mkdir docs
```

> Esta es la estructura descrita a detalle en `arquitectura.md`. Ahora mismo solo estás creando las carpetas vacías; los archivos `.jsx` de cada slide y componente se van llenando en las siguientes fases del proyecto.

### Paso 10 — Mover la documentación al repo

Copia dentro de `docs/` los 4 archivos que ya generamos:

- `logica.md`
- `arquitectura.md`
- `diseño-stilo-animacion.md`
- `stack-tecnologico.md` (este archivo)

Y deja `README.md` en la **raíz** del proyecto (no dentro de `docs/`), para que GitHub lo muestre automáticamente en la página principal del repo.

### Paso 11 — Primer arranque de verificación

```bash
npm run dev
```

Abre el navegador en `http://localhost:5173`. Si ves la página default de Vite + React (el logo girando), **todo el setup base está correcto** ✅. A partir de aquí se reemplaza `App.jsx` por el `RevealDeck` real (ver `arquitectura.md`).

### Paso 12 — Primer commit

```bash
git init
git add .
git commit -m "chore: setup inicial — Vite + React + reveal.js + Tailwind + stack de animación"
```

Antes de este paso, asegúrate de tener un `.gitignore` que excluya `node_modules/` y `dist/` (Vite ya lo genera por defecto).

---

## 4. Configuración de cada herramienta

### `vite.config.js`

```js
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
});
```

### `src/styles/index.css` (entrada de Tailwind)

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@import "./fonts.css";
@import "./theme.css";
@import "./reveal-overrides.css";
```

### `src/main.jsx` (import de reveal.js CSS base + tu CSS)

```jsx
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";

import "reveal.js/dist/reveal.css";
// El tema default de reveal.js NO se importa — se reescribe todo en reveal-overrides.css
// para que no se vea "plantilla" (ver diseño-stilo-animacion.md)
import "./styles/index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
```

### GSAP — registro de plugins (una sola vez)

```js
// src/lib/gsap.js
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);
export { gsap, ScrollTrigger };
```

---

## 5. Scripts del `package.json`

Vite ya deja configurados los básicos; quedan así:

```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "lint": "eslint src --ext js,jsx --report-unused-disable-directives --max-warnings 0"
  }
}
```

| Comando           | Qué hace                                                                 |
| ----------------- | ------------------------------------------------------------------------ |
| `npm run dev`     | Levanta el servidor de desarrollo con hot-reload                         |
| `npm run build`   | Genera la versión de producción optimizada en `dist/`                    |
| `npm run preview` | Sirve localmente el build de producción, para probarlo antes de publicar |
| `npm run lint`    | Revisa errores de código con ESLint                                      |

---

## 6. Checklist final

Antes de empezar a construir slides, verifica:

- [ ] `node -v` muestra 18+ y `npm -v` corre sin errores
- [ ] `npm run dev` levanta el proyecto sin errores en consola
- [ ] `tailwind.config.js` tiene el `content` apuntando a `./src/**/*.{js,jsx}`
- [ ] `reveal.js` está instalado (`node_modules/reveal.js` existe)
- [ ] Carpetas de `src/` creadas según `arquitectura.md`
- [ ] `docs/` contiene los 4 `.md` de este proyecto
- [ ] `README.md` está en la raíz, no dentro de `docs/`
- [ ] Primer commit hecho con `.gitignore` excluyendo `node_modules/`

Con esto, el siguiente paso es construir `src/reveal/RevealDeck.jsx` y el primer slide (`S00_Preloader.jsx`) siguiendo la lógica descrita en `logica.md`.
