# 📘 ETAPA 1 — Diagnóstico de la Empresa y Fundamentos Cloud

> **Curso:** Tecnología Cloud con AWS · SENATI  
> **Docente:** Huapaya Huapaya Arturo Florencio  
> **Semana:** 6  
> **Estado:** ✅ Completada

---

## 🎯 Objetivo General de la Etapa

Realizar un **diagnóstico completo** de la empresa MTA Software, identificar las limitaciones de su infraestructura actual (Hostinger) y presentar una **propuesta conceptual fundamentada** para migrar a AWS, cubriendo los pilares de economía, seguridad, identidad y arquitectura de red.

---

## 📋 Estructura de Slides (15 Slides / 3 Bloques + Cierre)

| Bloque | Slides | Tema |
|--------|--------|------|
| **Bloque 0** | S00 – S02 | Preliminares (Preloader, Portada, Agenda) |
| **Bloque 1** | S03 – S05 | La Empresa y Contexto Operativo |
| **Bloque 2** | S06 – S08 | Diagnóstico y Auditoría |
| **Bloque 3** | S09 – S12 | Propuesta Cloud AWS |
| **Cierre** | S13 – S14 | Roadmap y Conclusiones |

---

## 📖 Contenido Detallado por Slide

### 🔷 BLOQUE 0: Preliminares

#### S00 — Preloader
- Animación de carga inicial del deck.
- Solo visual, sin contenido expositivo.

#### S01 — Portada
- Nombre del proyecto: **Migración Arquitectural Cloud AWS — MTA Software**
- Nombre de la institución: SENATI
- Nombre del docente y los 5 integrantes del equipo.
- Semestre y fecha de presentación.

#### S02 — Agenda General
- Índice visual de los 3 bloques temáticos de la etapa.
- Navegación conceptual de lo que se cubrirá.

---

### 🔷 BLOQUE 1: La Empresa y Contexto Operativo (S03 – S05)

#### S03 — La Empresa (MTA Software)

**Contenido clave:**
- **Razón Social:** Multiservicios Tecnoindustrial Acosta S.A.C.
- **Nombre Comercial:** MTA Software
- **Modelo de Negocio:** Híbrido con dos sectores:
  - 🔩 **Sector Metalmecánico:** Servicios industriales tradicionales (matricería, soldadura, torneado).
  - 💻 **División de TI (MTA Software):** Ingeniería de software B2B — desarrollo de plataformas web, apps y sistemas ERP a medida para clientes que buscan automatizar y escalar.

> **Palabras clave:** B2B (Business-to-Business), modelo híbrido, soluciones a medida, automatización empresarial.

#### S04 — Área de TI y Equipo

**Contenido clave:**
- **Modalidad:** 100% remota, equipo distribuido geográficamente.
- **Composición:** 14 colaboradores técnicos:
  - **4 Leads (Supervisores):**
    - LEAD-01: Arquitectura Cloud (AWS e infraestructura)
    - LEAD-02: Backend (Node.js, APIs, BD)
    - LEAD-03: Frontend (React, Next.js, UX)
    - LEAD-04: QA & DevOps (Git, pipelines, control de calidad)
  - **10 Practicantes (P01–P10):**
    - P01-P02: Frontend (React, Vite, Next.js)
    - P03: Fullstack (TypeScript, cloud)
    - P04-P05: Backend (Node.js, APIs)
    - P06: UI/UX Designer (Figma, Tailwind)
    - P07: QA Engineer (Jest, validación Staging)
    - P08: DBA (PostgreSQL, diseño relacional)
    - P09: DevOps Junior (Git, CI/CD)
    - P10: Cloud Operator (monitoreo, presupuestos)
- **Stack tecnológico:** React, Next.js, TypeScript, Node.js

> **Palabras clave:** equipo ágil, remoto, Leads, Practicantes, stack moderno.

#### S05 — Portafolio de Proyectos

**Contenido clave:**
- **Proyectos Externos (Clientes B2B):**
  - 🎨 **Strato Studio:** Plataforma corporativa y portafolio interactivo para agencia de growth marketing. *(En producción)*
  - 🌐 **VIISION:** Web corporativa con landing pages de alta conversión + módulo ERP básico. *(En producción)*
- **Proyecto Interno (Core Crítico):**
  - 🏢 **Workspace MTA:** ERP interno centralizado — controla asistencias, calificaciones de practicantes y seguimiento de proyectos en tiempo real.
  - ⚠️ **Nivel de criticidad: SISTEMA NÚCLEO** — su caída paraliza toda la administración interna.

> **Palabras clave:** portafolio B2B, sistema núcleo, ERP, misión crítica.

---

### 🔷 BLOQUE 2: Diagnóstico y Auditoría (S06 – S08)

#### S06 — Infraestructura Actual

**Contenido clave:**
- **Hosting actual:** Hostinger (Plan Business) — servidor compartido único.
- Todas las apps (clientes + ERP) conviven en el mismo servidor monolítico.
- **Centro de datos único** — sin redundancia geográfica.
- **Control de versiones:** GitHub con Git, pero **sin CI/CD** (sin pipelines).
- **Pruebas:** Cada practicante ejecuta pruebas en su **localhost** (fragmentación total).

> **Palabras clave:** hosting compartido, servidor monolítico, centro de datos único, sin CI/CD, localhost.

#### S07 — Flujo de Trabajo Actual (Workflow)

**Contenido clave — Flujo manual en 5 pasos:**
1. Clonar repositorio en laptop personal
2. Crear rama de trabajo local
3. Testing en localhost con datos simulados
4. Push directo a GitHub
5. Despliegue manual a Hostinger por los encargados

**Problema sistémico:** *"En mi máquina funciona, pero en producción colapsa"* (Error 500) — discrepancias de entorno entre localhost y servidor compartido.

> **Palabras clave:** flujo manual, despliegue directo, error 500, discrepancias de entorno.

#### S08 — Los 3 Problemas Críticos (Limitaciones)

**Contenido clave:**

| # | Problema | Detalle |
|---|----------|---------|
| 1 | **Falta de Escalabilidad** | CPU/RAM fijos y compartidos con otros clientes de Hostinger. Imposible absorber picos (asistencia simultánea, dashboards). |
| 2 | **Sin Tolerancia a Fallos (SPOF)** | Único servidor = único punto de fallo. Si cae Hostinger, cae TODO: ERP + demos de clientes. Parálisis total. |
| 3 | **Brechas de Seguridad** | Credenciales root centralizadas en 4 encargados. Practicantes sin accesos directos → cuello de botella. Sin staging → se expone producción. |

> **Palabras clave:** SPOF (Single Point of Failure), escalabilidad vertical, credenciales centralizadas, cuello de botella.

---

### 🔷 BLOQUE 3: Propuesta Cloud AWS (S09 – S12)

#### S09 — Marco de Adopción Cloud (AWS CAF)

**Contenido clave:**
- **Framework utilizado:** AWS Cloud Adoption Framework (CAF)
- **Dos perspectivas clave transformadas:**

| Perspectiva | Antes (Hostinger) | Después (AWS) |
|-------------|-------------------|---------------|
| **Tecnología** | 10 entornos localhost fragmentados + 1 servidor compartido vulnerable | Ecosistema unificado con infraestructura administrada, red aislada y alta disponibilidad |
| **Procesos** | Pases manuales sin homologación previa | Flujos estandarizados con Staging en la nube y despliegues controlados |

> **Palabras clave:** CAF, Cloud Adoption Framework, perspectiva de tecnología, perspectiva de procesos, migración estructurada.

#### S10 — Modelo Económico y TCO

**Contenido clave:**
- **Transición:** De costo fijo (Hostinger $35/mes) a **Pay-As-You-Go** (pago por uso).
- **Región elegida:** `us-east-1` (Norte de Virginia) — tarifas más bajas de AWS.
  - Descartada: `sa-east-1` (São Paulo) — 40-60% más cara por impuestos locales.
  - Latencia a Lima: ~80-90ms, reducida con CDN.

**Matriz de costos por servicio:**

| Servicio | Free Tier | Uso MTA | Costo/mes |
|----------|-----------|---------|-----------|
| Amazon S3 | 5 GB + 20K GET | ~1.2 GB (3 proyectos) | **$0.00** |
| CloudFront | 1 TB salida | ~20 GB | **$0.00** |
| RDS PostgreSQL | 750 hrs db.t3.micro | 720 hrs 24/7 | **$0.00** |
| EC2 | 750 hrs t2.micro | 720 hrs backend | **$0.00** |
| Route 53 | — | 1 Hosted Zone | **$0.50** |
| IAM + CloudTrail | Ilimitado gratis | 10 usuarios | **$0.00** |
| Budgets + CloudWatch | 2 presupuestos gratis | 1 a $10 USD | **$0.00** |

**Resumen:**
- **Costo AWS:** $0.50 USD/mes
- **Costo anterior (Hostinger):** $35.00 USD/mes
- **Ahorro:** $34.50 USD/mes (98.5% de reducción)
- **AWS Budgets:** Alerta automática al 80% ($8) y 100% ($10) del presupuesto.

> **Palabras clave:** TCO, Pay-As-You-Go, CapEx vs OpEx, Free Tier, us-east-1, AWS Budgets.

#### S11 — Seguridad e Identidad (AWS IAM)

**Contenido clave:**
- **Modelo de Responsabilidad Compartida:**
  - AWS protege la infraestructura física ("seguridad DE la nube")
  - MTA protege datos, apps y accesos ("seguridad EN la nube")
- **Sellado de cuenta Root:** MFA obligatorio, prohibida para uso operativo.
- **10 usuarios IAM individuales** (uno por practicante) con **Mínimo Privilegio:**
  - Frontend → S3 + CloudFront (sin acceso a BD)
  - Backend → Staging + microservicios (sin producción)
  - DBA → Solo Amazon RDS con túneles cifrados
- **Auditoría total:** AWS CloudTrail registra cada acción API.

> **Palabras clave:** IAM, Modelo de Responsabilidad Compartida, MFA, Mínimo Privilegio, Zero Trust, CloudTrail.

#### S12 — Arquitectura de Red (VPC)

**Contenido clave:**
- **Amazon VPC Multi-AZ** en `us-east-1`:
  - CIDR: `10.0.0.0/16`
  - **us-east-1a:** Subred pública A + Subred privada A (backend + BD primaria)
  - **us-east-1b:** Subred pública B + Subred privada B (standby + réplica)
- **Subredes públicas:** Con Internet Gateway para tráfico web.
- **Subredes privadas:** Aisladas — BD PostgreSQL inaccesible desde internet.
- **Security Groups:** Cortafuegos stateful L4 — solo puerto 5432 desde backend.
- **Route 53:** DNS con SLA 100% + health checks.
- **CloudFront:** CDN con Edge Locations en Sudamérica (Lima, Bogotá, Santiago). Latencia: 15-30ms.

**Flujo perimetral End-to-End:**
1. Navegador → HTTPS 443
2. CloudFront → responde desde caché (+14ms)
3. Route 53 → resuelve DNS (+8ms)
4. VPC → segmenta tráfico (+3ms)
5. Security Group → valida puerto (+1ms)
6. RDS → consulta cifrada (+4ms)
7. **Resultado:** 200 OK en **~30ms** con alta disponibilidad.

> **Palabras clave:** VPC, Multi-AZ, subredes públicas/privadas, Security Groups, Internet Gateway, CDN, Edge Locations.

---

### 🔷 CIERRE (S13 – S14)

#### S13 — Roadmap de Continuidad
- Resumen de hitos alcanzados en Etapa 1.
- Adelanto de lo que viene en Etapa 2 (servicios core, almacenamiento, BD).

#### S14 — Conclusión y Preguntas
- Síntesis final del diagnóstico y la propuesta.
- Espacio para preguntas del docente.

---

## 🔑 Glosario de Términos Clave

| Término | Definición |
|---------|-----------|
| **B2B** | Business-to-Business — modelo de negocio entre empresas |
| **ERP** | Enterprise Resource Planning — sistema de gestión empresarial |
| **SPOF** | Single Point of Failure — punto único de fallo |
| **TCO** | Total Cost of Ownership — costo total de propiedad |
| **Pay-As-You-Go** | Modelo de pago por uso, sin costos fijos |
| **CapEx** | Capital Expenditure — gasto de capital (inversión inicial) |
| **OpEx** | Operational Expenditure — gasto operativo (recurrente) |
| **Free Tier** | Capa gratuita de AWS con recursos limitados gratis |
| **IAM** | Identity and Access Management — gestión de identidades |
| **MFA** | Multi-Factor Authentication — autenticación multifactor |
| **VPC** | Virtual Private Cloud — red privada virtual |
| **Multi-AZ** | Multiple Availability Zones — distribución en múltiples zonas |
| **CDN** | Content Delivery Network — red de distribución de contenido |
| **CAF** | Cloud Adoption Framework — marco de adopción de la nube |
| **Security Groups** | Cortafuegos virtuales a nivel de instancia en AWS |
| **CloudTrail** | Servicio de auditoría que registra cada acción en AWS |
| **Route 53** | Servicio DNS administrado de AWS con SLA 100% |
| **CloudFront** | CDN global de AWS con Edge Locations |

---

## 💡 Argumentaciones Clave (Para el Profesor)

### ¿Por qué migrar a AWS y no quedarse en Hostinger?
> Hostinger presenta 3 limitaciones irreconciliables: no escala, tiene un único punto de fallo y centraliza credenciales en 4 personas. AWS resuelve las tres con Auto Scaling, Multi-AZ y IAM granular.

### ¿Por qué `us-east-1` y no `sa-east-1`?
> São Paulo cobra entre 40-60% más por impuestos locales (ICMS). us-east-1 tiene las tarifas base más bajas del mundo y se conecta a Lima por cables submarinos del Pacífico con ~80ms, latencia reducida a 15-30ms con CloudFront CDN.

### ¿Por qué PostgreSQL y no MySQL?
> PostgreSQL ofrece mejor soporte para transacciones ACID complejas, tipos de datos avanzados (JSON nativo), y es el estándar de la industria para ERPs modernos. Es una decisión estratégica de migración del motor anterior (MySQL en Hostinger) hacia uno más robusto.

### ¿Cómo se asegura que no haya sorpresas en la factura?
> AWS Budgets con alerta automática al 80% ($8) y 100% ($10). Notificación vía SNS (correo + SMS) + monitoreo CloudWatch. El costo real proyectado es $0.50/mes.
