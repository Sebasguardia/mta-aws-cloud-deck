<div align="center">

# 🚀 MTA Software × AWS Cloud Foundations

### ETAPA 1 — Diagnóstico de la Empresa y Fundamentos Cloud

_Presentación interactiva construida con React + reveal.js, con animaciones cinematográficas y un diseño Neo-Brutalist._

![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![Vite](https://img.shields.io/badge/Vite-5-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![Reveal.js](https://img.shields.io/badge/Reveal.js-5.x-FF0043?style=for-the-badge&logo=revealdotjs&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)
![GSAP](https://img.shields.io/badge/GSAP-3-88CE02?style=for-the-badge&logo=greensock&logoColor=black)
![Framer Motion](https://img.shields.io/badge/Framer_Motion-11-0055FF?style=for-the-badge&logo=framer&logoColor=white)

![Status](https://img.shields.io/badge/status-en%20desarrollo-FFB800?style=flat-square)
![License](https://img.shields.io/badge/license-MIT-black?style=flat-square)
![Slides](https://img.shields.io/badge/slides-15-111111?style=flat-square)
![Language](https://img.shields.io/badge/español-PE-D4A017?style=flat-square)

</div>

---

## 📖 Sobre el proyecto

Presentación (deck) de la **Etapa 1** del curso de AWS: el diagnóstico tecnológico de **MTA Software**, una empresa con modelo híbrido (metalmecánica + desarrollo de software B2B) que hoy opera sobre hosting compartido tradicional y busca migrar a una arquitectura en la nube centrada en **VPC, IAM, Route 53 y CloudFront**.

En vez de un PowerPoint estático, el deck es una **web app interactiva**: cada slide tiene animaciones de entrada con propósito, transiciones cinematográficas entre bloques temáticos, y **dinámicas simuladas** (caída de servidor, calculadora de costos, arquitectura de red en vivo) para que el jurado _entienda_ el problema, no solo lo lea.

> 🎓 Curso: AWS Cloud Practitioner Essentials · Etapa 1
> 🏢 Empresa base: Multiservicios Tecnoindustrial Acosta S.A.C. (MTA Software)

---

## 📚 Documentación del proyecto

Este repo se documenta en 4 archivos, pensados para leerse en este orden:

| Doc                                                           | Contenido                                                                                                                 |
| ------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------- |
| 📖 [`README.md`](./README.md)                                 | Este archivo — visión general                                                                                             |
| 🎬 [`logica.md`](./logica.md)                                 | Guion slide por slide: contenido, animación de entrada, transición y dinámica interactiva de cada una de las 15 pantallas |
| 🏗️ [`arquitectura.md`](./arquitectura.md)                     | Estructura completa de carpetas/archivos, stack técnico y cómo React convive con reveal.js                                |
| 🎨 [`diseño-stilo-animacion.md`](./diseño-stilo-animacion.md) | Sistema de diseño "Neo-Brutalist Cinematic": tipografía, paleta, curvas de easing y catálogo de transiciones              |

---

## ✨ Highlights

- 🎥 **Transiciones cinematográficas** — cada bloque temático cierra con un "corte de capítulo" (`convex`/`zoom`), dentro de un bloque las transiciones son fluidas (`slide`).
- 🧨 **Simulador de caída de servidor** — visualiza en vivo por qué el único punto de fallo de Hostinger es un riesgo real.
- 💸 **Calculadora de costos interactiva** — compara costo fijo (Hostinger) vs. pay-as-you-go (AWS), con alerta simulada de AWS Budgets al superar $10 USD.
- 🔐 **Grid de IAM interactivo** — morph animado entre "10 practicantes" y "10 usuarios IAM individuales" con permisos mínimos.
- 🌐 **Arquitectura de red en vivo** — un paquete de datos viaja animado por CloudFront → Route 53 → VPC → Security Groups → Base de datos.
- 🖤 **Diseño Neo-Brutalist**: tipografía display enorme + acento en script (inspirado en identidad de marca), bordes gruesos, sombras sólidas offset, sin nada "genérico de IA".

---

## 🧰 Stack técnico

| Capa                      | Tecnología                  |
| ------------------------- | --------------------------- |
| Framework UI              | React 18 + Vite             |
| Motor de presentación     | reveal.js                   |
| Estilos                   | TailwindCSS + CSS Variables |
| Animación (layout/gestos) | Framer Motion               |
| Animación (timeline/SVG)  | GSAP + ScrollTrigger        |
| Texto animado             | SplitType                   |
| Estado global             | Zustand                     |
| Gráficos                  | Recharts                    |
| Iconos                    | lucide-react                |

Detalle completo de por qué cada librería → [`arquitectura.md`](./arquitectura.md#-stack-completo).

---

## 🗂️ Estructura resumida

```
mta-aws-cloud-deck/
├── src/
│   ├── reveal/          # integración reveal.js ⇄ React
│   ├── slides/          # 1 archivo por slide (S00 → S14)
│   ├── components/
│   │   ├── ui/           # átomos de diseño
│   │   ├── motion/       # primitivas de animación
│   │   └── dynamics/     # simuladores interactivos ⭐
│   ├── hooks/ · store/ · lib/ · data/ · styles/
├── docs/                 # logica.md · arquitectura.md · diseño-stilo-animacion.md
└── package.json
```

📄 Ver árbol completo y explicación de cada archivo en [`arquitectura.md`](./arquitectura.md).

---

## 🚀 Quick start

```bash
git clone <este-repo>
cd mta-aws-cloud-deck
npm install
npm run dev
```

Abre `http://localhost:5173`. Navegación: flechas del teclado, swipe (mobile) o `Esc` para vista general de reveal.js.

---

## 🎞️ Los 15 slides

| #   | Slide                         | Bloque                |
| --- | ----------------------------- | --------------------- |
| 00  | Preloader cinematográfico     | —                     |
| 01  | Portada                       | —                     |
| 02  | Agenda                        | —                     |
| 03  | Quiénes somos: MTA Software   | 🟦 La Empresa         |
| 04  | El equipo de TI               | 🟦 La Empresa         |
| 05  | Portafolio actual             | 🟦 La Empresa         |
| 06  | Infraestructura actual        | 🟧 El Diagnóstico     |
| 07  | Flujo de trabajo              | 🟧 El Diagnóstico     |
| 08  | Los 3 problemas críticos      | 🟧 El Diagnóstico     |
| 09  | Framework CAF                 | 🟩 La Propuesta Cloud |
| 10  | Modelo económico              | 🟩 La Propuesta Cloud |
| 11  | Seguridad y gobierno (IAM)    | 🟩 La Propuesta Cloud |
| 12  | Arquitectura de red propuesta | 🟩 La Propuesta Cloud |
| 13  | Roadmap                       | —                     |
| 14  | Cierre                        | —                     |

Guion completo de cada una → [`logica.md`](./logica.md).

---

## 🙏 Créditos e inspiración

Sistema de diseño y animación guiado por principios de:

- **[Emil Kowalski](https://emilkowal.ski/skill)** — framework de decisión de animación, easing y "taste as trained instinct"
- **[Impeccable](https://impeccable.style/)** — estándares de acabado visual
- **[Taste](https://www.tasteskill.dev/)** — criterio de diseño aplicado

Motor de slides: **[reveal.js](https://revealjs.com/)** de Hakim El Hattab.

---

<div align="center">

**MTA Software** · Etapa 1 · Curso AWS Cloud Foundations

</div>
