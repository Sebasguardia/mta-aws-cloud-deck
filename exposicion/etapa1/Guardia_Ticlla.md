# 🎤 Guión de Exposición — Guardia Ticlla Sebastián Jesús
## Etapa 1: Diagnóstico, Auditoría y Fundamentos de Red y Seguridad

> **Slides asignadas:** S10 (Modelo Económico y TCO), S13 (Roadmap de Continuidad), S14 (Conclusión y Preguntas)  
> **Rol en la etapa:** 💰 **Finanzas Cloud (TCO), Estrategia y Cierre de Etapa 1**  
> **Dificultad:** 🟡 Media  
> **Tiempo estimado:** ~4.5 minutos  
> **Objetivo:** Demostrar la viabilidad financiera de la migración a AWS frente a Hostinger (ahorro del 98.5%), explicar el control presupuestario con AWS Budgets, presentar la hoja de ruta hacia la Etapa 2 y abrir la ronda de preguntas técnicas ante el profesor Huapaya.

---

### 🏷️ Etiquetas de Orientación Rápida
- `[CONTROL FINANCIERO Y LIDERAZGO]` ➔ Demostrar que la ingeniería en la nube debe ser rentable y sostenible.
- `[SEÑALAR TABLA DE COSTOS S10]` ➔ Desglosar los servicios aprovechados mediante la capa gratuita (Free Tier).
- `[COMPARATIVA CONTUNDENTE]` ➔ Contrastar los $35 USD fijos de Hostinger frente a los $0.50 USD de AWS.
- `[CONTROL DE RIESGO]` ➔ Explicar las alarmas de AWS Budgets para evitar facturas imprevistas.
- `[CIERRE Y PREGUNTAS]` ➔ Sintetizar los logros de la Etapa 1 y abrir formalmente el espacio de preguntas.

---

### 📑 Guión Paso a Paso

#### 1. S10 — Modelo Económico: Transición a Pay-As-You-Go (1.5 minutos)
`[CONTROL FINANCIERO Y LIDERAZGO]`  
*"Muchas gracias, Alfredo. Buenas noches profesor Huapaya, compañeros.  
Un gran mito entre las pequeñas empresas es que 'la nube de AWS es cara e inaccesible'. En el **Slide 10**, demostramos matemáticamente que para MTA Software migrar a AWS representa una reducción radical de costos operativos.

MTA venía pagando una tarifa plana obligatoria de **$35 USD mensuales en Hostinger**, independientemente de si usaban o no el servidor al 100%.  
En AWS adoptamos el modelo **Pay-As-You-Go (Pago por Uso)** y la conversión de gastos de capital (CapEx) a gastos operativos flexibles (OpEx).

`[SEÑALAR TABLA DE COSTOS S10]`  
Diseñamos la arquitectura para maximizar los beneficios de la **Capa Gratuita de AWS (AWS Free Tier)** durante el primer año:
- **Amazon S3:** Hasta 5 GB de almacenamiento y 20,000 peticiones GET gratis. MTA solo consume ~1.2 GB ➔ **$0.00 USD**.
- **Amazon CloudFront:** 1 TB mensual de transferencia saliente gratuita. Consumimos ~20 GB ➔ **$0.00 USD**.
- **Amazon RDS PostgreSQL:** 750 horas mensuales de una instancia `db.t3.micro` gratis (equivalente a operar 24/7 sin parar) ➔ **$0.00 USD**.
- **Amazon EC2:** 750 horas de cómputo en instancias micro ➔ **$0.00 USD**.
- **AWS IAM y CloudTrail:** Servicios de seguridad y auditoría sin costo de gestión ➔ **$0.00 USD**.
- **Amazon Route 53:** Gestión de la zona DNS alojada corporativa ➔ **$0.50 USD**.

`[COMPARATIVA CONTUNDENTE]`  
**El balance final es contundente:**  
Pasamos de pagar **$35.00 USD mensuales** a un costo proyectado en AWS de apenas **$0.50 USD al mes**. Esto representa un **ahorro real del 98.5% en la factura de infraestructura**, obteniendo al mismo tiempo una disponibilidad infinitamente superior."*

---

#### 2. Gobernanza de Costos con AWS Budgets (1 minuto)
`[CONTROL DE RIESGO]`  
*"Para evitar cualquier sorpresa en la facturación y garantizar un estricto gobierno de FinOps, no dejamos el presupuesto al azar:
Configuramos **AWS Budgets** con un techo máximo mensual de **$10 USD**:
- **Alerta 1 (80% del presupuesto - $8 USD):** Envía automáticamente una notificación por correo electrónico y SMS a través de Amazon SNS al Lead Técnico de MTA si el gasto proyectado se desvía.
- **Alerta 2 (100% del presupuesto - $10 USD):** Notificación de emergencia a la dirección general para auditar cualquier recurso anómalo.  
Esto le otorga a la gerencia de MTA tranquilidad absoluta: no hay riesgo de cobros descontrolados."*

---

#### 3. S13 — Roadmap de Continuidad hacia Etapa 2 (1 minuto)
`[SEÑALAR DIAPOSITIVA]`  
*"En el **Slide 13**, presentamos la hoja de ruta evolutiva de nuestro proyecto.  
Lo que hemos expuesto hoy en la **Etapa 1** sienta las bases esenciales:
- Hemos ordenado los accesos y la seguridad perimetral con IAM y el sellado Root.
- Hemos creado una red privada virtual Multi-AZ aislada de Internet con Amazon VPC.
- Y hemos demostrado la sostenibilidad financiera del proyecto.

Esto nos deja el terreno preparado para la **Etapa 2**, donde profundizaremos en el aprovisionamiento de los servicios centrales: el cómputo elástico con procesadores Graviton ARM64, el almacenamiento desacoplado multi-capa con S3, EFS y Glacier, y la tolerancia a fallos transaccional con Amazon RDS Multi-AZ."*

---

#### 4. S14 — Conclusión y Apertura de Preguntas (1 minuto)
`[CIERRE Y PREGUNTAS]`  
*"Para concluir en el **Slide 14**:  
MTA Software ha dejado atrás la fragilidad de un hosting compartido tradicional para convertirse en una organización con cimientos tecnológicos modernos, resilientes, auditables y altamente económicos.  

Profesor Huapaya y compañeros de clase, a nombre del equipo agradecemos su atención y quedamos a su entera disposición para responder a todas sus preguntas técnicas sobre esta primera etapa del proyecto. Muchas gracias."*

---

### 🛡️ Respuestas Rápidas para Sebastián (Preguntas del Profesor)
- **Si el profesor pregunta: ¿Qué ocurre cuando finalice el año del Free Tier de AWS?**  
  *Respuesta:* "Excelente pregunta, profesor. Después de los 12 meses de Free Tier, servicios como la instancia micro de RDS o EC2 pasarían a costar aproximadamente entre $15 y $18 USD mensuales. Aún así, sigue siendo un costo 50% menor que el de Hostinger ($35), pero con la ventaja de que MTA ya contará con alta disponibilidad Multi-AZ, respaldos automáticos y una red virtual privada profesional."
- **Si el profesor pregunta: ¿Por qué Route 53 sí tiene costo ($0.50) si casi todo lo demás es gratis?**  
  *Respuesta:* "Porque Amazon Route 53 cobra $0.50 mensual por cada 'Hosted Zone' (zona alojada de dominio público) que gestiona. Es el único servicio base que no incluye una zona alojada permanente en el Free Tier, pero nos entrega a cambio un SLA de resolución DNS del 100% respaldado contractualmente por AWS."
