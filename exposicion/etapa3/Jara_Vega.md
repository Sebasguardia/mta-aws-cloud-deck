# 🎤 Guión de Exposición — Jara Vega Analí
## Etapa 3: Seguridad Avanzada, Monitoreo y Automatización (IaC)

> **Slide asignada:** S22 (Cierre Estratégico Integral de las 3 Etapas y Síntesis Ejecutiva)  
> **Rol en la etapa:** 🏆 **Cierre Magistral del Proyecto, Retorno de Inversión (ROI) y Sustentación Final**  
> **Dificultad:** 🟡 Media – Liderazgo Ejecutivo  
> **Tiempo estimado:** ~4.5 minutos  
> **Objetivo:** Brindar el cierre final e integrador de toda la sustentación, sintetizando los hitos alcanzados en las Etapas 1, 2 y 3, demostrando el impacto empresarial real para MTA Software y abriendo formalmente la sesión de preguntas con el docente Huapaya.

---

### 🏷️ Etiquetas de Orientación Rápida
- `[LIDERAZGO Y TONO RESOLUTIVO]` ➔ Voz elocuente, firme, segura y con gran presencia de cierre de proyecto.
- `[SEÑALAR EL ANTES Y EL DESPUÉS]` ➔ Contrastar visualmente el punto de partida (Hostinger) con el destino final (AWS).
- `[INTEGRAR LAS 3 ETAPAS]` ➔ Recorrer los hitos clave presentados por los cinco integrantes del equipo.
- `[MÉTRICAS DE NEGOCIO Y ROI]` ➔ Presentar las cifras de disponibilidad (99.95%), inversión ($110-$145 USD) y agilidad.
- `[INVITACIÓN FORMAL AL JURADO]` ➔ Ceder la palabra con elegancia al profesor Huapaya para la ronda de evaluación.

---

### 📑 Guión Paso a Paso

#### 1. S22 — La Gran Transformación de MTA Software (1 minuto)
`[LIDERAZGO Y TONO RESOLUTIVO]`  
*"Muchas gracias, Alfredo. Estimado profesor Huapaya, compañeros:  
Para concluir esta sustentación en el **Slide 22**, es momento de alejarnos del código y contemplar la fotografía completa de lo que este equipo de SENATI ha logrado diseñar para **MTA Software**.  

`[SEÑALAR EL ANTES Y EL DESPUÉS]`  
Recordemos de dónde partimos al inicio de esta exposición:
- Partimos de una empresa que dependía de un hosting compartido vulnerable en Hostinger.
- Con un único servidor que representaba un punto único de fallo (SPOF).
- Con credenciales root compartidas sin control en cPanel.
- Con 10 practicantes remotos desarrollando en sus laptops locales sin entorno de homologación, sufriendo caídas y errores 500 continuos en producción."*

---

#### 2. La Síntesis de los Hitos en las 3 Etapas (1.5 minutos)
`[INTEGRAR LAS 3 ETAPAS]`  
*"Frente a ese diagnóstico crítico, el equipo estructuró y ejecutó una solución metódica basada en las mejores prácticas de la industria:

1. **En la Etapa 1 — Cimentamos la Red y la Identidad:**  
   Bajo el marco AWS CAF, levantamos una red virtual aislada (Amazon VPC) distribuida en dos Zonas de Disponibilidad en `us-east-1`. Sellamos la cuenta Root con MFA obligatorio y aprovisionamos 10 identidades individuales con AWS IAM bajo la doctrina de menor privilegio, demostrando además un ahorro inicial del 98.5% en la factura.
2. **En la Etapa 2 — Aprovisionamos los Servicios Core:**  
   Creamos un entorno unificado de Staging con instancias EC2 y volúmenes EBS gp3 que erradicó las discrepancias locales. Desplegamos cómputo de producción de alto rendimiento impulsado por procesadores **AWS Graviton (ARM64)** y funciones serverless con Lambda. Desacoplamos el almacenamiento con Amazon S3 y Glacier ahorrando hasta un 84% en retención histórica, y blindamos los datos transaccionales con un cluster de **PostgreSQL en Amazon RDS Multi-AZ** con failover automático síncrono.
3. **Y en esta Etapa 3 — Alcanzamos la Madurez y Resiliencia Empresarial:**  
   Implementamos balanceadores de carga inteligentes (ALB) y autoescalado dinámico (ASG) que responde autónomamente a la demanda real. Blindamos el perímetro en 5 capas con Security Groups stateful y Network ACLs stateless. Establecimos observabilidad total 24/7 con Amazon CloudWatch y FinOps. Y finalmente, convertimos toda la arquitectura en software versionable y repetible mediante **Infraestructura como Código con AWS CloudFormation y pipelines continuos de CI/CD** sin tiempo de inactividad."*

---

#### 3. Impacto de Negocio y Retorno de Inversión (ROI) (1.5 minutos)
`[MÉTRICAS DE NEGOCIO Y ROI]`  
*"¿Cuál es el balance tangible para MTA Software en términos de negocio?
- **Disponibilidad Operativa:** Elevamos la disponibilidad de un sistema frágil a un SLA proyectado superior al **99.95%**, garantizando que el ERP Workspace y las plataformas de los clientes estén siempre operativas.
- **Sostenibilidad Financiera:** Logramos una arquitectura de clase mundial por un presupuesto controlado de entre **$110 y $145 USD mensuales**, optimizado mediante Savings Plans, capas gratuitas y políticas de ciclo de vida, donde cada centavo está plenamente identificado por etiquetas de asignación de costos.
- **Velocidad e Innovación:** Los 10 practicantes de MTA ahora cuentan con un flujo automatizado de integración y entrega continua que les permite lanzar nuevas funcionalidades en menos de 10 minutos con cero downtime y total trazabilidad.

MTA Software ha dejado de ser una empresa con limitaciones de infraestructura local; hoy cuenta con una arquitectura de nivel internacional preparada para escalar y competir sólidamente en el mercado."*

---

#### 4. Invitación Formal a Preguntas y Evaluación (0.5 minutos)
`[INVITACIÓN FORMAL AL JURADO]`  
*"Profesor Huapaya Huapaya Arturo Florencio y compañeros presentes:  
A nombre de Diego Estilo, Jean Pierre Suclupe, Alfredo Gonzales, Sebastián Guardia y quien les habla, Analí Jara, agradecemos profundamente su atención.  

Dejamos formalmente abierto el espacio de preguntas técnicas y sustentación para atender cualquiera de sus consultas sobre las decisiones arquitecturales, operativas y financieras tomadas a lo largo de este proyecto. Muchas gracias."*

---

### 🛡️ Respuestas Rápidas para Analí (Preguntas del Profesor)
- **Si el profesor pregunta: ¿Cuál es el principal valor de negocio que entrega esta migración a MTA?**  
  *Respuesta:* "El principal valor es la **confianza y la continuidad operativa**. Antes, una caída del servidor paralizaba a los 14 colaboradores de la empresa y deterioraba la relación con los clientes comerciales. Con esta arquitectura tolerante a fallos, Auto Scaling y Multi-AZ, el negocio no se detiene ante fallos de hardware y puede asumir contratos de mayor escala con un costo predecible y optimizado."
- **Si el profesor pregunta: Si tuvieran que destacar una sola decisión arquitectural clave de todo el proyecto, ¿cuál sería?**  
  *Respuesta:* "La decisión más transformadora fue la **Defensa en Profundidad combinada con Infraestructura como Código (IaC)**. No solo construimos una red segura con subredes privadas, IAM y cortafuegos, sino que al codificarla en CloudFormation garantizamos que dev, staging y producción sean idénticos, erradicando el error humano y permitiendo que la empresa crezca con total orden técnico."
