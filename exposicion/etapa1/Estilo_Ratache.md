# 🎤 Guión de Exposición — Estilo Ratache Diego Rafael
## Etapa 1: Diagnóstico, Auditoría y Fundamentos de Red y Seguridad

> **Slides asignadas:** S01 (Portada), S02 (Agenda General), S03 (La Empresa - MTA Software), S04 (Área de TI y Equipo)  
> **Rol en la etapa:** 🚀 **Apertura de la Sustentación**  
> **Dificultad:** 🟢 Baja – 🟡 Media  
> **Tiempo estimado:** ~4.5 minutos  
> **Objetivo:** Iniciar formalmente la sustentación del proyecto, presentar al equipo de trabajo ante el docente Huapaya, exponer la identidad corporativa de MTA Software y describir la estructura del área de TI remota.

---

### 🏷️ Etiquetas de Orientación Rápida
- `[APERTURA FORMAL Y BIENVENIDA]` ➔ Tono seguro, educado, modulado y profesional hacia el profesor y la clase.
- `[SEÑALAR PORTADA Y AGENDA]` ➔ Dar contexto del curso de SENATI y mostrar la hoja de ruta de los 3 bloques.
- `[ÉNFASIS EN EL NEGOCIO]` ➔ Destacar el modelo híbrido (metalmecánica + software B2B).
- `[ESTRUCTURA DE EQUIPO]` ➔ Explicar cómo se distribuyen los 4 Leads y los 10 practicantes remotos.
- `[PASE AL SIGUIENTE EXPOSITOR]` ➔ Ceder fluidamente la palabra a Jean Pierre Suclupe para el diagnóstico de infraestructura.

---

### 📑 Guión Paso a Paso

#### 1. Saludo Inicial y Presentación del Deck (1 minuto)
`[APERTURA FORMAL Y BIENVENIDA]`  
*"Buenas noches, estimado profesor Huapaya Huapaya Arturo Florencio y compañeros.  
A nombre de nuestro grupo de trabajo de SENATI, tenemos el agrado de presentar la sustentación de nuestro proyecto final para el curso de **Tecnología Cloud con AWS**:  
**'Migración y Modernización Arquitectural Cloud en AWS para MTA Software'**.  

`[SEÑALAR PORTADA Y AGENDA]`  
Nuestro equipo está conformado por:
- Analí Jara Vega
- Jean Pierre Suclupe López
- Alfredo Gonzales Ramirez
- Sebastián Guardia Ticlla
- y quien les habla, Diego Estilo Ratache.

Para esta primera etapa, abordaremos tres grandes bloques:
1. El contexto de la empresa y la estructura operativa de su división tecnológica.
2. El diagnóstico y auditoría técnica de las severas limitaciones que enfrentan actualmente en su hosting compartido.
3. Nuestra propuesta de adopción Cloud en AWS, fundamentada en gobernanza de identidades (IAM), topología de red virtual (VPC) y viabilidad económica (TCO)."*

---

#### 2. S03 — La Empresa: Multiservicios Tecnoindustrial Acosta (1.5 minutos)
`[ÉNFASIS EN EL NEGOCIO]`  
*"Iniciamos con el **Slide 03: La Empresa**.  
MTA Software es el nombre comercial de la división de tecnología de **Multiservicios Tecnoindustrial Acosta S.A.C.**, una empresa peruana con un modelo de negocio híbrido:
- Por un lado, mantiene su división tradicional del **sector metalmecánico**, especializada en matricería, soldadura de precisión y torneado industrial.
- Y por otro lado, ha consolidado su **división de TI (MTA Software)**, una software factory especializada en ingeniería de software B2B (Business-to-Business). Desarrollan plataformas web a medida, aplicaciones móviles y soluciones empresariales para compañías que buscan digitalizar y optimizar sus procesos.

Esta dualidad es clave: MTA no es un proyecto de laboratorio; es una empresa activa con operaciones comerciales reales y clientes que dependen de la disponibilidad continua de sus plataformas."*

---

#### 3. S04 — Área de TI y Equipo Distribuido (1.5 minutos)
`[ESTRUCTURA DE EQUIPO]`  
*"Pasamos al **Slide 04: Área de TI y Equipo Humano**.  
La división de software opera bajo una **modalidad 100% remota**, con un equipo distribuido geográficamente de **14 colaboradores técnicos**, estructurados en dos niveles:

1. **4 Supervisores Técnicos (Leads):**
   - **LEAD-01 (Cloud Architecture):** Diseña y supervisa la infraestructura en la nube.
   - **LEAD-02 (Backend):** Lidera las APIs en Node.js y la persistencia de datos.
   - **LEAD-03 (Frontend):** Supervisa el ecosistema de React, Next.js y experiencia de usuario.
   - **LEAD-04 (QA & DevOps):** Garantiza los estándares de calidad de código y gestión de Git.

2. **10 Practicantes Técnicos (P01 al P10):**
   - Divididos estratégicamente en especialidades: dos desarrolladores frontend, un fullstack, dos backend, un diseñador UI/UX, un analista QA de testing, un DBA para modelado de base de datos, un devops junior y un operador cloud.

El stack tecnológico corporativo se fundamenta en **Node.js, TypeScript, React y Next.js**.  
Sin embargo, tener a 10 practicantes remotos programando todos los días sobre una infraestructura precaria sin un entorno de pruebas centralizado generaba fricciones operativas críticas."*

---

#### 4. Cierre del Bloque y Pase a Jean Pierre Suclupe (0.5 minutos)
`[PASE AL SIGUIENTE EXPOSITOR]`  
*"Para comprender a fondo qué problemas enfrentaba este equipo y cómo su servidor actual ponía en riesgo el portafolio de proyectos, le doy la palabra a mi compañero **Jean Pierre Suclupe López**, quien expondrá el diagnóstico y auditoría de la infraestructura actual."*

---

### 🛡️ Respuestas Rápidas para Diego (Preguntas del Profesor)
- **Si el profesor pregunta: ¿Por qué es relevante que el equipo sea 100% remoto?**  
  *Respuesta:* "Porque un equipo remoto no comparte una red local de oficina ni hardware común. Cada practicante trabaja desde su propia computadora en su casa. Si no existe una nube centralizada con accesos IAM y entornos de staging idénticos, es imposible controlar la consistencia de las versiones y la seguridad de las credenciales."
- **Si el profesor pregunta: ¿Cuál es el producto principal de MTA Software?**  
  *Respuesta:* "MTA gestiona proyectos para clientes externos, pero su producto más crítico es el **Workspace MTA**, su ERP interno que gestiona asistencias, evaluaciones de practicantes y proyectos en curso. Su caída paraliza toda la gestión de la empresa."
