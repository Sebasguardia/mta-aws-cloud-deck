# ❓ Preguntas del Profesor — Etapa 2: Cómputo, Almacenamiento y Bases de Datos

> **Preparación para Q&A** — Respuestas técnicas y argumentadas para defender la selección de servicios de la Etapa 2 ante el docente Huapaya.

---

## ⚡ Bloque 1: Cómputo (EC2, Graviton, Lambda, Fargate)

### P1: ¿Por qué eligieron procesadores AWS Graviton (instancias `t4g`) en vez de procesadores tradicionales Intel/AMD (`t3`)?
> **Respuesta:**  
> Por la **relación costo-rendimiento (Price-Performance)**. Los chips Graviton (arquitectura ARM64 desarrollada por AWS) ofrecen hasta un **40% mejor rendimiento por dólar** y consumen menos energía que sus equivalentes x86 de Intel (`t3`).  
> Dado que el backend de MTA está desarrollado en **Node.js**, la compilación e interpretación en ARM64 es nativa y transparente; no requiere reescribir código. Para una startup con presupuesto ajustado, `t4g.micro` ($0.0084/h) en Staging y `t4g.small` ($0.0168/h) en Producción representan el máximo aprovechamiento del presupuesto.

### P2: ¿Por qué `t4g.micro` en Staging y `t4g.small` en Producción? ¿No se quedan cortas?
> **Respuesta:**  
> **Staging** es un entorno de pruebas funcionales para los practicantes remotos. Con 2 vCPU y 1 GB de RAM es más que suficiente para validar endpoints y lógica antes de desplegar.  
> **Producción** utiliza `t4g.small` (2 vCPU, 2 GB de RAM) combinada con **Auto Scaling y Elastic Load Balancing (ELB)**. No necesitamos una instancia gigante fija (`m5.xlarge`) porque la arquitectura es horizontalmente elástica: si la carga de usuarios sube, el Auto Scaling suma más instancias `t4g.small`. Así pagamos por lo que consumimos y no por capacidad ociosa.

### P3: ¿Por qué no migrar todo a Serverless (AWS Lambda) y olvidarse de EC2?
> **Respuesta:**  
> Porque el ERP Workspace de MTA cuenta con servicios monolíticos modulares y conexiones persistentes WebSocket para colaboración en tiempo real.  
> AWS Lambda tiene limitantes de **tiempo de ejecución máximo (15 minutos)**, **Cold Starts (arranque en frío)** y costos elevados si se ejecutan procesos continuos 24/7.  
> Adoptamos una **estrategia híbrida moderna**: EC2 para los servicios base continuos del ERP, y **AWS Lambda** para tareas asíncronas puntuales (como procesamiento de imágenes, envío masivo de correos de notificación o generación de PDFs contables bajo demanda).

### P4: ¿Qué ventaja tiene AWS Fargate frente a gestionar clusters de EC2 para contenedores Docker?
> **Respuesta:**  
> **Cero sobrecarga operativa (Zero Server Management)**. Con Fargate no tenemos que parchar sistemas operativos invitados, gestionar agentes de ECS ni provisionar capacidad anticipada para los nodos. Simplemente definimos los requerimientos de CPU/memoria a nivel de contenedor y AWS gestiona la infraestructura subyacente. Para el equipo reducido de MTA, esto libera horas de ingeniería de mantenimiento.

---

## 🗄️ Bloque 2: Almacenamiento (Amazon S3, EFS, Glacier)

### P5: ¿Por qué necesitan Amazon S3, EFS y EBS a la vez? ¿No es redundante?
> **Respuesta:**  
> No, porque cada servicio atiende un **patrón de acceso y un tipo de almacenamiento distinto**:
> 1. **Amazon EBS (Block Storage):** Es el disco rígido de arranque del sistema operativo de cada instancia EC2; ofrece latencia de sub-milisegundo para lectura/escritura de binarios del sistema.
> 2. **Amazon EFS (File Storage / NFS):** Sistema de archivos compartido que puede ser montado simultáneamente por múltiples instancias EC2 en diferentes AZs. Se usa para compartir recursos de configuración o archivos compartidos entre nodos del ERP.
> 3. **Amazon S3 (Object Storage):** Almacenamiento masivo de objetos vía HTTP/REST API con durabilidad del 99.999999999% (11 nueves). Aquí se guardan los assets estáticos del frontend, contratos, reportes y respaldos.

### P6: ¿Cómo aseguran que los costos de Amazon S3 no se disparen con el tiempo?
> **Respuesta:**  
> Implementamos **Políticas de Ciclo de Vida (S3 Lifecycle Policies)**:
> - **Día 0 a 30:** Los documentos activos residen en **S3 Standard** (acceso frecuente e instantáneo).
> - **Día 31 a 90:** Se mueven automáticamente a **S3 Standard-Infrequent Access (IA)**, reduciendo el costo de almacenamiento en un ~50%.
> - **A partir del Día 91:** Los backups y registros históricos pasan a **S3 Glacier Flexible Retrieval**, reduciendo el costo de $0.023 a $0.0036 por GB/mes (un ahorro del 84%).
> - Además, activamos **S3 Intelligent-Tiering** para datos con patrones de acceso impredecibles.

### P7: ¿Qué garantiza que los datos en S3 no sean borrados accidentalmente o atacados por ransomware?
> **Respuesta:**  
> Tres controles clave:
> 1. **S3 Versioning (Control de Versiones):** Si un archivo es sobrescrito o eliminado, se crea una marca de eliminación pero las versiones previas quedan intactas.
> 2. **S3 Object Lock / MFA Delete:** Requiere autenticación multifactor física para eliminar versiones permanentemente.
> 3. **Políticas de Bucket IAM de Mínimo Privilegio y Cifrado SSE-S3 / SSE-KMS:** Toda la data se cifra en reposo de forma predeterminada.

---

## 🛢️ Bloque 3: Bases de Datos Relacionales (Amazon RDS Multi-AZ)

### P8: ¿Por qué contrataron Amazon RDS en lugar de instalar PostgreSQL manualmente en una instancia EC2?
> **Respuesta:**  
> Por el **TCO (Costo Total de Propiedad) y la fiabilidad**:
> Instalar PostgreSQL en EC2 exigiría que el equipo de MTA asuma la responsabilidad de:
> - Configuración manual de replicación y clusters.
> - Parcheo del motor de base de datos y del sistema operativo.
> - Scripts manuales de copias de seguridad (snapshots).
> - Gestión manual de tolerancia a fallos (failover).  
> **Amazon RDS gestiona todo esto de forma nativa**. Nos entrega backups automáticos con retención configurable, parches automáticos en ventanas de mantenimiento y monitorización integrada, permitiendo que el equipo se enfoque en el desarrollo del producto y no en la administración de DBAs.

### P9: ¿Cómo funciona exactamente el despliegue Multi-AZ en RDS y en qué se diferencia de una Read Replica?
> **Respuesta:**  
> Esta distinción es fundamental:
> - **RDS Multi-AZ (Alta Disponibilidad / DR):** Crea una réplica **síncrona** en una Zona de Disponibilidad secundaria. La instancia secundaria **no atiende tráfico de lectura ni escritura**; está en modo standby. Si la zona primaria sufre una catástrofe, RDS conmuta automáticamente el registro DNS (failover transparente en 60-120 segundos) sin pérdida de datos.
> - **Read Replica (Escalabilidad de Lectura):** Utiliza replicación **asíncrona** para descargar consultas de lectura intensivas (reportes, analítica). Atiende tráfico activo de lectura, pero no ofrece failover síncrono inmediato contra caídas críticas.
> En MTA adoptamos **RDS Multi-AZ** para garantizar la continuidad del negocio y el RPO = 0 del ERP.

### P10: ¿Qué motor de base de datos seleccionaron y por qué?
> **Respuesta:**  
> **PostgreSQL (v15+)**. MTA gestiona transacciones contables, inventarios de clientes y facturación electrónica, lo que exige estricto cumplimiento **ACID**. PostgreSQL ofrece soporte avanzado para tipos de datos JSONB (lo que nos da flexibilidad documental dentro de un modelo relacional estricto), extensiones de indexación avanzadas (GIN, GiST) y una compatibilidad de estándares superior frente a MySQL.

---

## 💰 Bloque 4: Gestión Financiera de la Etapa 2

### P11: ¿Cuál es el presupuesto aproximado mensual de la Etapa 2 y cómo lo justifican?
> **Respuesta:**  
> El gasto estimado de la Etapa 2 ronda entre **$110 y $145 USD mensuales**:
> - Cómputo EC2 (Staging + Prod elástico): ~$28 - $35 USD.
> - Amazon RDS Multi-AZ PostgreSQL (db.t4g.small): ~$60 - $75 USD (es el componente de mayor valor pero garantiza cero pérdida de datos).
> - Almacenamiento (EBS + S3 + Transferencia de datos): ~$15 - $25 USD.  
> Se justifica plenamente porque un solo incidente de caída de base de datos o pérdida de datos contables de clientes le costaría a MTA miles de dólares en reputación, horas hombre de recuperación y posibles sanciones contractuales. Además, se aplican los **AWS Free Tier** y descuentos de **Savings Plans a 1 año** que reducen estos costos hasta en un 30%.
