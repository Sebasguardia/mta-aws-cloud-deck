<div align="center">

# 🎨 `diseño-stilo-animacion.md`

### Sistema de diseño, tipografía y animación — "Neo-Brutalist Cinematic"

![Style](https://img.shields.io/badge/Estilo-Neo--Brutalist_Cinematic-111111?style=for-the-badge)
![Fonts](https://img.shields.io/badge/Tipografía-Display%20%2B%20Script-D4A017?style=for-the-badge)
![Motion](https://img.shields.io/badge/Motion-GSAP%20%2B%20Framer-88CE02?style=for-the-badge)
![Inspiración](https://img.shields.io/badge/Inspirado_en-Emil%20Kowalski%20%C2%B7%20Impeccable%20%C2%B7%20Taste-CC3366?style=for-the-badge)

</div>

---

## 🧠 Filosofía del sistema

**Neo-Brutalist Cinematic**: tipografía enorme y cruda (brutalismo) + movimiento suave, con propósito y con restricción (principios de Emil Kowalski / craft-focused design). La regla de oro:

> _"El brutalismo da la estructura y el carácter. La animación da la sensación de que un humano con gusto lo construyó, no una IA genérica."_

Reglas heredadas de las skills de referencia (Impeccable / Taste / Emil Kowalski) aplicadas a este deck:

- 🚫 **Nunca** `transition: all`. Cada propiedad animada se declara explícita.
- 🚫 **Nunca** duraciones default de librería (150ms/300ms porque sí) — cada timing está justificado abajo.
- ✅ Los elementos entran desde `scale(0.95)`, **nunca** desde `scale(0)` — nada aparece "de la nada".
- ✅ Los popovers/tooltips escalan **desde su disparador**, no desde el centro de la pantalla (mantiene el vínculo espacial).
- ✅ Acciones de alta frecuencia (navegar slides con flechas) **no** llevan animación extra sobre la transición nativa de reveal.js — evita sensación de lag.
- ✅ `prefers-reduced-motion` se respeta en el 100% de los componentes (`useReducedMotion`).

---

## 🔤 Sistema tipográfico

Basado en la referencia de marca subida (logotipo "BAYSIDE"): un **script elegante** como firma/acento + un **sans display ultra bold** como protagonista.

| Rol                 | Fuente de referencia (marca)  | Alternativa web (self-hosted, licencia libre)         | Uso                                                                                            |
| ------------------- | ----------------------------- | ----------------------------------------------------- | ---------------------------------------------------------------------------------------------- |
| **Display / Héroe** | Avenir Next Bold              | **Archivo Black** / **General Sans (Bold/ExtraBold)** | Títulos de slide, números gigantes ("10 practicantes", "01 02 03")                             |
| **Firma / Acento**  | Photograph Signature (script) | **Beau Rivage** / **Yellowtail**                      | Taglines, la palabra clave de cada bloque ("La Empresa", "El Diagnóstico"), firma en el cierre |
| **Cuerpo**          | —                             | **Inter** (variable)                                  | Párrafos, descripciones, listas                                                                |
| **Mono / técnico**  | —                             | **JetBrains Mono**                                    | Código, terminal del `DeploySimulator`, badges técnicos, labels de servicios AWS               |

### Jerarquía y escala (mobile-first, `clamp()`)

```css
--fs-hero: clamp(3.5rem, 10vw, 9rem); /* título de portada */
--fs-h1: clamp(2.5rem, 6vw, 5.5rem); /* título de slide */
--fs-h2: clamp(1.5rem, 3vw, 2.5rem); /* subtítulo */
--fs-script: clamp(1.75rem, 4vw, 3.5rem); /* tagline en script */
--fs-body: clamp(1rem, 1.2vw, 1.25rem);
--fs-mono: clamp(0.8rem, 1vw, 0.95rem);
```

**Regla brutalista clave:** los títulos display van en **mayúsculas, tracking negativo** (`letter-spacing: -0.03em`), a veces con `-webkit-text-stroke` (solo contorno, sin relleno) para los números de sección — igual que el "BAYSIDE" de la referencia, que domina el layout sin miedo al tamaño.

---

## 🎨 Paleta de color

Extraída y estilizada a partir de la imagen de referencia (tonos cálidos de campo/tierra) + acento de marca AWS.

| Token         | Hex              | Uso                                                                                  |
| ------------- | ---------------- | ------------------------------------------------------------------------------------ |
| 🟫 `--ink`    | `#0A0A0A`        | Fondo base, texto sobre claro, bloques brutalistas                                   |
| ⬜ `--paper`  | `#F5F1E8`        | Fondo alterno (cream), texto sobre oscuro                                            |
| 🟨 `--gold`   | `#D4A017`        | Acento primario — CTAs, subrayados, el "pulso" de datos vivos                        |
| 🫒 `--olive`  | `#4A5D3A`        | Acento secundario — bloque "Empresa", tags neutros                                   |
| 🩷 `--blush`  | `#E8A0BF`        | Acento terciario — detalles muy puntuales (dinámicas, hover states), nunca dominante |
| 🟥 `--risk`   | `#C6432B`        | Estados de error/riesgo (OutageSimulator, root compartido)                           |
| 🟩 `--safe`   | `#7A9B5C`        | Estados de éxito/seguro (después de IAM, deploy exitoso)                             |
| ⬛ `--stroke` | `#0A0A0A` @ 100% | Bordes gruesos brutalistas (2–4px, nunca `box-shadow` suave)                         |

```css
:root {
  --ink: #0a0a0a;
  --paper: #f5f1e8;
  --gold: #d4a017;
  --olive: #4a5d3a;
  --blush: #e8a0bf;
  --risk: #c6432b;
  --safe: #7a9b5c;
}
```

> Contraste verificado AA+ para texto sobre `--ink` y `--paper`. `--blush` solo se usa en superficies grandes o iconografía, nunca en texto de cuerpo (falla contraste).

---

## 🧱 Lenguaje visual brutalista

- **Bordes**: `2–4px solid var(--ink)`, esquinas rectas (`border-radius: 0` en tarjetas grandes; `radius: 2px` solo en chips pequeños — nunca `rounded-2xl` genérico).
- **Sombras**: nada de `box-shadow` difuso. Se usa **sombra sólida offset** (`box-shadow: 8px 8px 0 var(--ink)`), típica del brutalismo — se anima el offset, no el blur.
- **Grid visible**: líneas de grid sutiles (`1px`, 8% opacity) de fondo en slides de datos, reforzando la estructura "de diseñador", no de plantilla.
- **Texturas**: grano de película (`noise.png`, blend `overlay`, 3–5%) sobre fondos oscuros para dar textura cinematográfica sin ensuciar el brutalismo.

---

## 🎬 Sistema de animación

### Curvas de easing (custom, no defaults)

```js
// src/lib/easings.js
export const easings = {
  cinematic: "cubic-bezier(0.22, 1, 0.36, 1)", // entradas de texto/hero — "desacelera con intención"
  snappy: "cubic-bezier(0.16, 1, 0.3, 1)", // botones, toggles, feedback inmediato
  spring: { type: "spring", stiffness: 260, damping: 22 }, // chips, tarjetas, hover bounce
  wipe: "cubic-bezier(0.83, 0, 0.17, 1)", // clip-path curtain reveals
};
```

### Duraciones (justificadas, no arbitrarias)

| Duración       | Uso                                                                  | Por qué                                                                      |
| -------------- | -------------------------------------------------------------------- | ---------------------------------------------------------------------------- |
| **120ms**      | Micro-feedback (hover, press de botón)                               | Bajo el umbral de "lag perceptible"                                          |
| **220ms**      | Toggles, tooltips, popovers                                          | Suficiente para leerse como intencional, no instantáneo ni lento             |
| **400–600ms**  | Entrada de texto/tarjetas por slide (`RevealText`, stagger)          | Da tiempo a leer la jerarquía sin aburrir                                    |
| **900ms–1.2s** | Wipes de capítulo, `CountUp`, diagramas complejos (`NetworkDiagram`) | Eventos "hero", ocurren pocas veces por slide, se puede justificar el tiempo |
| **1.8s**       | Preloader                                                            | Único momento con licencia cinematográfica larga                             |

> Ninguna transición de UI recurrente (navegación, hover) supera **300ms** — alineado a la checklist de revisión de Emil Kowalski (`transition: all` y >300ms = señal de alerta).

### Catálogo de transiciones por tipo

| Efecto                         | Técnica                                              | Dónde se usa                                     |
| ------------------------------ | ---------------------------------------------------- | ------------------------------------------------ |
| **Clip-path curtain**          | `clip-path: inset()` animado 0%→100%                 | Preloader, aperturas de capítulo (slides 01, 09) |
| **Split-text cinematográfico** | SplitType (palabra) + Framer stagger + `blur(4px)→0` | Bloques de texto largo (03, 06)                  |
| **Draw-SVG**                   | `stroke-dasharray/-dashoffset`                       | Diagramas (06, 12, 13)                           |
| **Shared element morph**       | Framer Motion `layoutId`                             | Avatares practicantes → usuarios IAM (04 → 11)   |
| **Motion path**                | SVG `<mpath>` + GSAP                                 | Paquete de red viajando por la arquitectura (12) |
| **Spring bounce**              | Framer `spring`                                      | Chips, badges, hover de tarjetas                 |
| **Shake + shrink**             | GSAP timeline (`x`, `scale`)                         | Servidor "cayendo" en `OutageSimulator`          |
| **Crossfade + slide**          | Framer `AnimatePresence mode="wait"`                 | Toggles antes/después (09, 11)                   |

### Transiciones nativas de reveal.js por bloque

```
Preloader → Portada:      (fade interno, sin data-transition — es pre-deck)
Portada → Agenda:          data-transition="zoom"
Dentro de Bloque 1 (03-05): data-transition="slide"
Cierre Bloque 1 (05 → 06):  data-transition="convex"   ← "corte de capítulo"
Dentro de Bloque 2 (06-07): data-transition="slide"
07 → 08:                    data-transition="fade"      ← pausa dramática (climax)
08 → 09:                    data-transition="convex"    ← "corte de capítulo"
Dentro de Bloque 3 (09-12): data-transition="slide"
12 → 13:                    data-transition="zoom"
13 → 14:                    data-transition="fade"
```

---

## 🖼️ Referencia tipográfica (del brief)

La imagen de marca subida ("BAYSIDE") define el patrón que replicamos a nivel de composición, no de fuente literal:

- Palabra clave en **script fino**, tamaño intermedio, ligera rotación → funciona como "etiqueta emocional" del bloque.
- Debajo, el nombre/título en **sans ultra bold**, mayúsculas, ocupando casi todo el ancho del contenedor, sin miedo al tamaño.
- Etiqueta técnica pequeña (mono/caps, tracking amplio) con línea punteada apuntando al elemento — este patrón se reutiliza como **sistema de anotación** para los diagramas técnicos (12) y tooltips de servicios AWS.

```
     Photograph Signature (script, acento)
BAYSIDE   ← Avenir Next Bold (display, protagonista)
     · · · Avenir Next Bold  (mono label + leader line)
```

Aplicado al deck:

```
     La Empresa   (script, acento — slide 03)
MTA SOFTWARE       (display bold — protagonista)
     · · · B2B · METALMECÁNICA + SOFTWARE (mono label)
```

---

## ♿ Accesibilidad y performance

- Contraste mínimo AA en todo texto de cuerpo.
- `prefers-reduced-motion: reduce` → se desactivan wipes/parallax/motion-path, se mantienen solo fades cortos (≤150ms).
- Todas las animaciones usan `transform`/`opacity`/`clip-path` (propiedades compositables en GPU) — nunca `width`/`top`/`left` animados directamente.
- Fuentes self-hosted vía `@fontsource` con `font-display: swap`.
- Imágenes pesadas (`hero-texture.jpg`) en formato `webp` + `loading="eager"` solo en Portada; el resto `lazy`.
