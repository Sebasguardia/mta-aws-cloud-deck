# 🎤 Guión de Exposición — Gonzales Ramirez Alfredo Valentino
## Etapa 2: Servicios Core, Almacenamiento y Bases de Datos

> **Slides asignadas:** S15 (Bases de Datos — Amazon RDS Multi-AZ) y S15b (Bases de Datos — Servicios en Detalle y Resiliencia)  
> **Rol en la etapa:** 🛢️ **Bases de Datos Relacionales de Misión Crítica y Alta Disponibilidad**  
> **Dificultad:** 🔴 Alta  
> **Tiempo estimado:** ~5 minutos  
> **Objetivo:** Justificar la adopción del servicio gestionado Amazon RDS con motor PostgreSQL frente a un servidor autogestionado, explicar el mecanismo síncrono de conmutación Multi-AZ ante catástrofes y diferenciarlo formalmente de las Réplicas de Lectura.

---

### 🏷️ Etiquetas de Orientación Rápida
- `[RIGOR TÉCNICO EN BASES DE DATOS]` ➔ Enfatizar integridad ACID, latencia de replicación y RPO/RTO.
- `[DEFENSA DEL SERVICIO GESTIONADO]` ➔ Demostrar por qué instalar PostgreSQL en una máquina virtual es un error de TCO.
- `[EXPLICACIÓN DEL FAILOVER SÍNCRONO]` ➔ Trazar el cambio automático del endpoint DNS de la Zona A a la Zona B.
- `[DIFERENCIACIÓN TÉCNICA CRUCIAL]` ➔ Dejar meridianamente clara la diferencia entre Multi-AZ (Standby) y Read Replicas.
- `[PASE AL CIERRE FINANCIERO]` ➔ Ceder la palabra a Jean Pierre Suclupe para el balance de costos y cierre de la Etapa 2.

---

### 📑 Guión Paso a Paso

#### 1. S15 — El Dilema: ¿RDS Administrado o EC2 Autogestionado? (1.5 minutos)
`[RIGOR TÉCNICO EN BASES DE DATOS]`  
*"Buenas noches, profesor Huapaya, compañeros.  
La base de datos es el activo más sagrado de cualquier empresa. Si un servidor web se cae, se reinicia; pero si se corrompe la base de datos de facturación o asistencias, el daño comercial puede ser irreversible.  

En el **Slide 15**, presentamos la arquitectura de datos con **Amazon Relational Database Service (Amazon RDS)**.  
`[DEFENSA DEL SERVICIO GESTIONADO]`  
La primera gran decisión fue: *¿Por qué pagar por Amazon RDS y no simplemente instalar PostgreSQL gratis en una instancia EC2?*  
La respuesta es el **Costo Total de Propiedad (TCO) y la fiabilidad**:
- Si instalamos PostgreSQL en EC2, el equipo de MTA tendría que asumir manualmente: parches de seguridad del sistema operativo, scripts de respaldos nocturnos, configuración artesanal de clusters de replicación y resolver caídas a las 3:00 AM.
- **Amazon RDS gestiona todo esto de forma nativa**: automatiza el mantenimiento, provisiona almacenamiento elástico, cifra la data con KMS y nos permite enfocarnos al 100% en el modelo de datos de nuestro ERP.

Elegimos **PostgreSQL versión 15+** por su riguroso cumplimiento **ACID**, su extraordinario rendimiento con tipos de datos **JSONB** (que nos otorga flexibilidad no relacional dentro de un motor relacional estricto) y su soporte para consultas analíticas complejas."*

---

#### 2. S15b — Arquitectura Multi-AZ y Mecanismo de Failover (2 minutos)
`[EXPLICACIÓN DEL FAILOVER SÍNCRONO]`  
*"Pasamos al **Slide 15b: Despliegue Multi-AZ y Recuperación ante Desastres**.  
Para eliminar el punto único de falla, desplegamos RDS en configuración **Multi-AZ**:
- En la Zona de Disponibilidad Primaria (`us-east-1a`), se encuentra la instancia maestra de base de datos activa que atiende todas las lecturas y escrituras del ERP.
- Simultáneamente, AWS aprovisiona de forma transparente una instancia **Standby secundaria idéntica** en la Zona B (`us-east-1b`).
- La replicación entre ambas zonas es **estrictamente síncrona**: una transacción solo se confirma al cliente cuando se ha grabado en los discos físicos de ambos centros de datos.

`[ESCENARIO DE DESASTRE]`  
¿Qué ocurre si el centro de datos de `us-east-1a` sufre un corte de energía masivo o un fallo de hardware catastrófico?  
RDS detecta la anomalía de inmediato y ejecuta un **Failover Automático**:
1. Conmuta el registro CNAME del endpoint DNS interno de la base de datos hacia la instancia en `us-east-1b`.
2. La instancia Standby asume el rol de primaria activa.
3. El proceso toma entre **60 y 120 segundos**, de forma totalmente transparente para el backend de Node.js, **sin pérdida de una sola transacción (RPO = 0)** y sin requerir que un administrador intervenga manualmente."*

---

#### 3. Diferenciación Crítica: Multi-AZ vs Read Replicas (1 minuto)
`[DIFERENCIACIÓN TÉCNICA CRUCIAL]`  
*"Es fundamental que no confundamos Multi-AZ con Réplicas de Lectura (Read Replicas):
- **RDS Multi-AZ está diseñado para Alta Disponibilidad y Resiliencia:** La réplica Standby no atiende tráfico; está en modo pasivo a la espera de un fallo. La replicación es síncrona.
- **Las Read Replicas están diseñadas para Escalabilidad de Rendimiento:** Atienden consultas de lectura activas de forma asíncrona para descargar trabajo a la base de datos primaria (por ejemplo, reportes contables masivos o dashboards).  
En MTA implementamos **Multi-AZ** para garantizar la continuidad ininterrumpida del negocio."*

---

#### 4. Conclusión y Pase a Jean Pierre Suclupe (0.5 minutos)
`[PASE AL CIERRE FINANCIERO]`  
*"Complementamos esta base de datos con respaldos automatizados continuos (*Automated Snapshots*) con retención de 7 días y restauración a cualquier segundo específico en el tiempo (*Point-In-Time Restore*).  
Habiendo cubierto cómputo, almacenamiento y base de datos, debemos consolidar el impacto presupuestario de la etapa.  
Para presentar el balance financiero y el cierre de la Etapa 2, le cedo la palabra a mi compañero **Jean Pierre Suclupe López**."*

---

### 🛡️ Respuestas Rápidas para Alfredo (Preguntas del Profesor)
- **Si el profesor pregunta: ¿Por qué no MySQL en lugar de PostgreSQL?**  
  *Respuesta:* "PostgreSQL maneja de manera muy superior los tipos de datos JSONB, transacciones concurrentes complejas y estándares ANSI SQL avanzados que requiere un ERP empresarial como el de MTA. MySQL históricamente es ideal para CMS y blogs sencillos, pero para sistemas contables y empresariales, PostgreSQL es el estándar de oro de la industria."
- **Si el profesor pregunta: ¿Dónde se ubica la base de datos en la red?**  
  *Respuesta:* "Está ubicada exclusivamente en la **Subred Privada de Datos**. No tiene IP pública ni asignación de Internet Gateway. Solo acepta conexiones entrantes en el puerto 5432 desde el Security Group de las instancias backend de EC2, garantizando aislamiento perimetral total."
