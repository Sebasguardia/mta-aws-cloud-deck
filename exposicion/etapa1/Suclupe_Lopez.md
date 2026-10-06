# 🎤 Guión de Exposición — Suclupe López Jean Pierre
## Etapa 1: Diagnóstico, Auditoría y Fundamentos de Red y Seguridad

> **Slides asignadas:** S05 (Portafolio de Proyectos), S06 (Infraestructura Actual), S07 (Flujo de Trabajo Actual), S08 (Los 3 Problemas Críticos)  
> **Rol en la etapa:** 🔍 **Auditoría y Diagnóstico Crítico de la Infraestructura**  
> **Dificultad:** 🟡 Media – 🔴 Alta  
> **Tiempo estimado:** ~5 minutos  
> **Objetivo:** Demostrar la auditoría técnica profunda realizada sobre MTA Software, exhibiendo el portafolio de sistemas en riesgo, el flujo de desarrollo caótico en localhost y las tres limitantes insostenibles del hosting compartido tradicional.

---

### 🏷️ Etiquetas de Orientación Rápida
- `[VOZ ANALÍTICA Y FIRME]` ➔ Demostrar rigor técnico en la identificación de fallas estructurales.
- `[SEÑALAR IMPACTO DE NEGOCIO]` ➔ Destacar la criticidad del ERP Workspace frente a los proyectos de clientes.
- `[DENUNCIAR EL PROBLEMA TÉCNICO]` ➔ Explicar con claridad el clásico error "en mi máquina funciona" y las caídas con Error 500.
- `[LOS 3 PUNTOS DE DOLOR]` ➔ Enfatizar con fuerza: SPOF, falta de escala y credenciales root compartidas.
- `[PASE AL SIGUIENTE EXPOSITOR]` ➔ Ceder la palabra a Analí Jara para presentar la propuesta de gobernanza e IAM.

---

### 📑 Guión Paso a Paso

#### 1. S05 — Portafolio de Proyectos de MTA Software (1 minuto)
`[VOZ ANALÍTICA Y FIRME]`  
*"Buenas noches, profesor Huapaya, compañeros.  
Continuando con la exposición de Diego, en el **Slide 05** presentamos el **Portafolio de Proyectos** que sostiene la operación diaria de MTA Software. Este portafolio se divide en dos categorías:

`[SEÑALAR IMPACTO DE NEGOCIO]`  
1. **Proyectos Externos (Clientes B2B):**
   - **Strato Studio:** Una plataforma corporativa y portafolio interactivo para una agencia de growth marketing.
   - **VIISION:** Web corporativa con landing pages de alta conversión y un módulo básico de cotizaciones.
2. **Proyecto Interno de Misión Crítica:**
   - **Workspace MTA:** Este es el **Sistema Núcleo (Core)** de la empresa. Es un ERP modular que gestiona el control de asistencia de los practicantes, la calificación de entregables y el seguimiento operativo de los contratos en tiempo real.  
   Si el Workspace MTA colapsa, la dirección ejecutiva queda a ciegas y la administración interna se paraliza por completo."*

---

#### 2. S06 — La Infraestructura Actual: Hosting Compartido (1.5 minutos)
`[DENUNCIAR EL PROBLEMA TÉCNICO]`  
*"En el **Slide 06**, auditamos la infraestructura donde residen actualmente estos sistemas:  
MTA opera sobre un **hosting compartido tradicional en Hostinger (Plan Business)**.  
¿Qué implica esto desde la perspectiva de la ingeniería de software?
- Todos los proyectos (los sitios de los clientes y el ERP interno) conviven en el **mismo servidor monolítico**.
- Los recursos de CPU, memoria RAM y ancho de banda son compartidos con cientos de otros clientes ajenos a MTA en el mismo servidor físico.
- La empresa depende de un **único centro de datos físico**, sin ninguna redundancia geográfica ni mecanismo de recuperación ante desastres.
- Los practicantes no cuentan con un entorno de staging en la nube: cada uno programa y prueba en su propio **localhost** personal."*

---

#### 3. S07 — El Flujo de Trabajo Caótico (Workflow) (1 minuto)
`[DENUNCIAR EL PROBLEMA TÉCNICO]`  
*"En el **Slide 07**, mapeamos el flujo de trabajo manual en 5 pasos que seguía el equipo:
1. El practicante clona el repositorio en su laptop personal (Windows, Mac o Linux).
2. Desarrolla sobre su rama local.
3. Realiza pruebas en su localhost con versiones de Node.js o bases de datos SQLite locales simuladas.
4. Hace push directo a GitHub sin pipelines de integración continua (sin CI/CD).
5. Un supervisor toma manualmente los archivos y los sube por FTP/cPanel al servidor de Hostinger.

¿Cuál es el resultado inevitable de este flujo artesanal?  
El infame síndrome de **'En mi máquina funciona, pero en producción colapsa'**.  
Al pasar a producción aparecían incompatibilidades de librerías, dependencias no instaladas y caídas repentinas con **Error 500**, afectando la experiencia de los clientes."*

---

#### 4. S08 — Las 3 Limitantes Críticas (1 minuto)
`[LOS 3 PUNTOS DE DOLOR]`  
*"En el **Slide 08**, sintetizamos esta auditoría en los **Tres Problemas Críticos Irreconciliables** de la infraestructura actual:

1. **Falta Total de Escalabilidad:** Los recursos de CPU y RAM están topados. Cuando todos los practicantes registraban asistencia a las 9:00 AM o cuando un cliente lanzaba una campaña de marketing, el servidor se asfixiaba.
2. **Punto Único de Falla (SPOF - Single Point of Failure):** Si el servidor de Hostinger sufría una falla de hardware, corte de energía o mantenimiento imprevisto, **se caía absolutamente todo**. No existía respaldo activo en otra ubicación.
3. **Brechas Graves de Seguridad y Accesos:** No existían cuentas de usuario con roles de mínimo privilegio. La contraseña root de cPanel estaba en manos de los encargados, creando un cuello de botella constante y un riesgo enorme de filtración o sabotaje accidental por falta de trazabilidad.

Este diagnóstico demostró que MTA no podía seguir operando así si pretendía crecer como software factory."*

---

#### 5. Conclusión y Pase a Analí Jara (0.5 minutos)
`[PASE AL SIGUIENTE EXPOSITOR]`  
*"Habiendo demostrado la urgencia de la migración, la solución requería un marco metódico y un cambio radical en la seguridad de accesos.  
Para explicar nuestra propuesta de adopción Cloud mediante el marco AWS CAF y el diseño seguro de identidades con AWS IAM, le cedo la palabra a mi compañera **Analí Jara Vega**."*

---

### 🛡️ Respuestas Rápidas para Jean Pierre (Preguntas del Profesor)
- **Si el profesor pregunta: ¿Por qué Hostinger no es suficiente si solo son páginas web?**  
  *Respuesta:* "Porque no son solo páginas web estáticas, profesor. Estamos gestionando el ERP Workspace MTA, que maneja transacciones contables, asistencias en tiempo real y persistencia relacional. Un hosting compartido no ofrece aislamiento de procesos, no tiene SLAs de disponibilidad empresarial ni permite configurar cortafuegos de red avanzados."
- **Si el profesor pregunta: ¿Qué significa exactamente SPOF en este contexto?**  
  *Respuesta:* "Single Point of Failure (Punto Único de Falla). Significa que existe un único componente físico cuya falla compromete la totalidad del sistema. Al tener todas las aplicaciones en una sola máquina física en un solo centro de datos, cualquier avería de disco o corte eléctrico deja a MTA completamente inoperativa."
