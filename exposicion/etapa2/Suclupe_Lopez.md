# 🎤 Guión de Exposición — Suclupe López Jean Pierre
## Etapa 2: Servicios Core, Almacenamiento y Bases de Datos

> **Slide asignada:** S16 (Cierre Etapa 2 y Resumen Financiero Consolidado)  
> **Rol en la etapa:** 💰 **Cierre de Etapa 2 y Balance Financiero de Servicios Core**  
> **Dificultad:** 🟡 Media  
> **Tiempo estimado:** ~4.5 minutos  
> **Objetivo:** Sintetizar la arquitectura de los tres pilares de servicios core (Cómputo, Almacenamiento y BD), presentar la matriz financiera mensual consolidada de la Etapa 2 (~$110 a $145 USD) y preparar la transición hacia la Etapa 3.

---

### 🏷️ Etiquetas de Orientación Rápida
- `[CIERRE SÓLIDO Y SÍNTESIS]` ➔ Tono integrador, seguro y de dominio del impacto de negocio.
- `[SEÑALAR MATRIZ FINANCIERA S16]` ➔ Desglosar los tres componentes principales en la diapositiva.
- `[JUSTIFICACIÓN DE LA INVERSIÓN]` ➔ Explicar por qué RDS Multi-AZ representa el 50% del gasto y por qué vale cada dólar.
- `[ESTRATEGIA SAVINGS PLANS]` ➔ Mencionar el ahorro adicional del 30% con compromisos flexibles.
- `[APERTURA HACIA ETAPA 3]` ➔ Conectar con la necesidad de elasticidad dinámica y automatización.

---

### 📑 Guión Paso a Paso

#### 1. S16 — Síntesis Arquitectural de la Etapa 2 (1.5 minutos)
`[CIERRE SÓLIDO Y SÍNTESIS]`  
*"Muchas gracias, Alfredo. Buenas noches, profesor Huapaya y compañeros.  
Para cerrar esta **Etapa 2**, hagamos una pausa estratégica en el **Slide 16** para observar la madurez que ha alcanzado la infraestructura de MTA Software.  

En tan solo dos etapas, hemos transformado un hosting compartido artesanal en una plataforma con tres pilares de clase empresarial:
1. **Cómputo Homologado y Eficiente:** Un entorno de Staging con `t4g.micro` y EBS gp3 que erradicó el clásico desorden de los entornos locales, sumado a un backend elástico en producción impulsado por procesadores AWS Graviton de arquitectura ARM64 y tareas asíncronas en Serverless.
2. **Almacenamiento Desacoplado:** Assets distribuidos en Amazon S3 con durabilidad de 11 nueves, volúmenes elásticos compartidos en EFS y políticas de ciclo de vida que migran backups fríos a Glacier con un 84% de descuento.
3. **Persistencia Resiliente:** Una base de datos relacional PostgreSQL en Amazon RDS con réplica síncrona Multi-AZ, capaz de sobrevivir al colapso de un centro de datos entero con failover automático en menos de 2 minutos."*

---

#### 2. Matriz Financiera Consolidada de la Etapa 2 (1.5 minutos)
`[SEÑALAR MATRIZ FINANCIERA S16]`  
*"Ahora bien, ¿cuánto le cuesta esta arquitectura de alta disponibilidad a una empresa en crecimiento como MTA Software?  
El análisis de Costo Total de Propiedad (TCO) proyecta un gasto mensual consolidado de entre **$110 y $145 USD al mes**:

- **Cómputo EC2 (Staging + Prod Graviton):** ~$28 a $35 USD/mes. (Staging cubierto por Free Tier; solo pagamos por la capacidad productiva neta).
- **Amazon RDS PostgreSQL Multi-AZ (`db.t4g.small`):** ~$60 a $75 USD/mes.  
  `[JUSTIFICACIÓN DE LA INVERSIÓN]`  
  Este servicio representa aproximadamente el 50% del presupuesto de la etapa. ¿Por qué invertimos tanto aquí? Porque un solo incidente de corrupción de datos contables o caída prolongada del ERP le costaría a MTA miles de dólares en multas contractuales y horas de desarrollo perdidas. La continuidad de negocio no es un gasto; es un seguro de vida.
- **Almacenamiento y Transferencia de Datos (EBS + EFS + S3 + Glacier):** ~$15 a $25 USD/mes, optimizado por las transiciones automáticas de Lifecycle.
- **Servicios de Red y Dominio (Route 53):** ~$1 a $2 USD/mes."*

---

#### 3. Optimización con AWS Savings Plans y Transición (1.5 minutos)
`[ESTRATEGIA SAVINGS PLANS]`  
*"Además, implementamos la estrategia de **Compute Savings Plans a 1 año**, la cual nos permite obtener hasta un **30% de descuento adicional** sobre las tarifas bajo demanda de EC2 y Fargate, manteniendo la flexibilidad de cambiar de tipo de instancia o región si las necesidades de MTA evolucionan.

`[APERTURA HACIA ETAPA 3]`  
Con esto, MTA Software cuenta con una base tecnológica y financiera sumamente sólida.  
Sin embargo, un sistema verdaderamente empresarial no puede depender de que un humano esté monitoreando servidores un domingo por la tarde ni de despliegues manuales propensos a errores.  
Necesitamos que la infraestructura escale sola ante picos de demanda, que se audite a sí misma 24/7 y que se defina completamente mediante código automatizado.  

Es por eso que en la siguiente fase ingresaremos a la **Etapa 3: Alta Disponibilidad Dinámica, Blindaje de Red, FinOps e Infraestructura como Código (IaC)**. Muchas gracias por su atención en esta segunda etapa."*

---

### 🛡️ Respuestas Rápidas para Jean Pierre (Preguntas del Profesor)
- **Si el profesor pregunta: ¿Por qué la Etapa 2 pasó de $0.50 en la Etapa 1 a más de $100 USD?**  
  *Respuesta:* "Porque en la Etapa 1 solo configuramos redes y servicios cubiertos 100% por el Free Tier de prueba. En la Etapa 2 estamos aprovisionando la infraestructura productiva real de alta disponibilidad con RDS Multi-AZ (dos servidores de BD síncronos) y cómputo de producción continuo. Es una inversión de $110-$145 que sostiene la totalidad de la operación de una software factory con clientes comerciales."
- **Si el profesor pregunta: ¿Qué pasa si el presupuesto de MTA se reduce temporalmente?**  
  *Respuesta:* "La nube nos otorga elasticidad financiera: podemos reducir la instancia de producción a demanda, apagar el servidor de Staging fuera de horarios de oficina (ahorrando hasta 60% de su costo) o pausar temporalmente servicios secundarios sin perder configuraciones."
