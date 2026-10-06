# 📘 ETAPA 2 — Servicios Core, Almacenamiento y Bases de Datos

> **Curso:** Tecnología Cloud con AWS · SENATI  
> **Docente:** Huapaya Huapaya Arturo Florencio  
> **Semana:** 7  
> **Estado:** ✅ Completada

---

## 🎯 Objetivo General de la Etapa

Trasladar el diagnóstico y las bases conceptuales de la Etapa 1 (IAM, VPC, CAF) hacia la **implementación práctica y aprovisionamiento real** de servicios de infraestructura en AWS, resolviendo los tres cuellos de botella críticos: punto único de falla (SPOF), fragmentación de desarrollo (localhost) y carencia de almacenamiento de alta durabilidad.

---

## 📋 Estructura de Slides

| Slide | Tema | Complejidad |
|-------|------|-------------|
| **S12b** | Intro Etapa 2 (transición) | 🟢 Baja |
| **S13** | Cómputo — Staging Unificado (EC2 + EBS) | 🟡 Media |
| **S13b** | Cómputo — Servicios Elásticos y Serverless | 🔴 Alta |
| **S14** | Almacenamiento — S3, EFS, Glacier | 🟡 Media |
| **S14b** | Almacenamiento — Servicios en Detalle | 🟡 Media |
| **S15** | Bases de Datos — RDS Multi-AZ | 🔴 Alta |
| **S15b** | Bases de Datos — Servicios en Detalle | 🟡 Media |
| **S16** | Cierre Etapa 2 + Resumen Financiero | 🟢 Baja |

---

## 📖 Contenido Detallado por Pilar

### 🔷 PILAR 1: Entorno de Pruebas y Staging Unificado (EC2 + EBS gp3)

**Problema que resuelve:**
Los 10 practicantes ejecutan pruebas en sus ambientes locales (localhost Windows/Mac/Linux), generando incompatibilidades de versionamiento, discrepancias de librerías de Node.js y fallos imprevistos al pasar a producción.

**Solución aprovisionada:**
- **Servicio:** Instancia Amazon EC2 Staging dedicada
- **Tipo:** t2.micro / t3.micro (100% Free Tier: 750 hrs/mes)
- **Capacidad:** 1-2 vCPUs burstable, 1 GiB RAM
- **SO:** Amazon Linux 2023 / Ubuntu Server 22.04 LTS
- **Almacenamiento:** Amazon EBS gp3 de 30 GB (Free Tier)
  - 3,000 IOPS base sostenidos
  - 125 MB/s de rendimiento

**Pipeline de validación (5 pasos):**
1. Practicante empuja código a rama `staging`
2. Ejecución automática de pruebas (Jest / Supertest)
3. Construcción y despliegue en EC2 Staging
4. Validación por QA y Lead Técnico en entorno idéntico al real
5. Merge autorizado a rama de producción con cero discrepancias

> **Palabras clave:** Staging, EC2, EBS gp3, IOPS, burstable, pipeline de validación, entorno unificado.

---

### 🔷 PILAR 2: Cómputo Elástico y Serverless (EC2, Lambda, Contenedores)

**Modelo híbrido para equilibrar cargas continuas con tareas esporádicas:**

#### A) Amazon EC2 para Backend y APIs Continuas
- **Instancia recomendada:** t4g.small (AWS Graviton2, ARM 64-bit)
- **Ventaja:** Hasta **40% mejor relación precio/rendimiento** vs x86 (t3)
- **Resiliencia:** Auto Scaling Group (ASG) entre us-east-1a y us-east-1b
  - Política de escalamiento: CPU > 70%

#### B) AWS Lambda para Procesamiento Asíncrono
- **Cargas delegadas:**
  - Cálculo automático de notas y ponderados semanales
  - Generación de reportes PDF a fin de mes
  - Procesamiento y compresión de imágenes (perfiles y contratos)
- **Costos:** Pago por milisegundo ($0.00 en inactividad)
- **Free Tier:** 1,000,000 solicitudes/mes + 3.2M segundos de cómputo

#### C) Docker y Amazon ECS
- Estandarización de microservicios de Workspace MTA en imágenes ligeras
- Zero-Downtime Rolling Updates (despliegues sin interrupción)

> **Palabras clave:** EC2, Graviton2, Auto Scaling Group, Lambda, serverless, ECS, contenedores, Docker, rolling updates.

---

### 🔷 PILAR 3: Estrategia de Almacenamiento Unificado

MTA necesita manejar: assets web públicos + archivos compartidos para practicantes + archivo histórico de contratos y backups.

#### A) Amazon S3 Standard (Object Storage)
- **Uso:** Assets de Workspace MTA, multimedia de Strato Studio, bundles de VIISION
- **Durabilidad:** 99.999999999% (11 nueves)
- **Free Tier:** 5 GB mensual (12 primeros meses)
- **Seguridad:** Cifrado en reposo SSE-S3 / AES-256

#### B) Amazon EFS (Elastic File System - NFSv4)
- **Uso:** Directorio compartido y volumen de código para los 10 practicantes
- **Características:** Sistema POSIX montable en múltiples EC2 y contenedores
- **Disponibilidad:** Multi-AZ nativa — si una zona cae, el acceso persiste

#### C) Amazon S3 Glacier Flexible Retrieval
- **Política automatizada:**
  - Día 0 a 90: Backups en S3 Standard ($0.023/GB/mes)
  - Día 91+: Transferencia automática a Glacier ($0.0036/GB/mes)
- **Ahorro:** **84.3% de reducción** en retención histórica

> **Palabras clave:** S3, EFS, Glacier, durabilidad 11 nueves, ciclo de vida, NFSv4, cifrado AES-256.

---

### 🔷 PILAR 4: Bases de Datos Administradas — Amazon RDS

**Diagnóstico previo:**
MySQL en Hostinger compartido — sin failover, backups manuales, bloqueos de concurrencia, riesgo de pérdida total.

**Solución en AWS:**
- **Motor:** Amazon RDS PostgreSQL 16
  - ¿Por qué PostgreSQL? Óptimo para transaccionalidad ACID y ERP (Workspace MTA). Migración estratégica desde MySQL.
- **Instancia:** db.t3.micro / db.t4g.micro (Free Tier: 750 hrs/mes)
- **Almacenamiento:** 20 GB SSD gp2/gp3

**Despliegue Multi-AZ (Alta Disponibilidad):**

| Componente | Zona | Función |
|-----------|------|---------|
| **Instancia Primaria (Master)** | us-east-1a | Recibe todas las escrituras |
| **Instancia Secundaria (Standby)** | us-east-1b | Réplica síncrona automática |

- **Failover automático:** Si cae us-east-1a, DNS redirige a us-east-1b en **60-120 segundos** sin intervención humana.
- **Métricas de recuperación:**
  - RPO = 0 (cero pérdida de transacciones confirmadas)
  - RTO < 2 minutos
- **Backups:** Snapshots diarios automáticos + retención 7 días + PITR (Point-In-Time Restore) al segundo exacto.

**Evaluación futura:** Amazon Aurora Serverless v2 para picos de matrículas.

> **Palabras clave:** RDS, PostgreSQL, Multi-AZ, failover, RPO, RTO, PITR, snapshots, Aurora Serverless.

---

## 📊 Matriz de Integración con los 10 Practicantes

| Componente | Servicio AWS | Impacto en el Flujo |
|-----------|-------------|-------------------|
| Ambiente Pruebas | EC2 + EBS Staging | Pruebas centralizadas; fin a diferencias de SO |
| Servidor Archivos | Amazon EFS (NFSv4) | Espacio compartido y concurrente P01-P10 |
| Tareas Batch | AWS Lambda | Notas y reportes sin degradar backend |
| Activos Web | Amazon S3 | Repositorio central de assets |
| Backups | S3 Glacier Flexible | Cumplimiento normativo, -84% costo |
| Base de Datos | RDS Multi-AZ | Transacciones blindadas, cero caídas |

---

## 💰 Resumen Financiero

| Recurso | Límite Free Tier |
|---------|-----------------|
| EC2 (t2.micro) | 750 hrs/mes |
| RDS PostgreSQL | 750 hrs/mes |
| EBS gp3 | 30 GB |
| RDS SSD | 20 GB |
| S3 Standard | 5 GB |
| Lambda | 1,000,000 invocaciones/mes |

- **AWS Budgets:** Umbral estricto $10.00 USD/mes
- **Alertas SNS:** Automáticas al 85% ($8.50)
- **CloudWatch:** Alarmas de CPU, IOPS y conexiones BD

---

## 🔑 Glosario de Términos Clave

| Término | Definición |
|---------|-----------|
| **EC2** | Elastic Compute Cloud — servidores virtuales escalables en AWS |
| **EBS** | Elastic Block Store — almacenamiento en bloque persistente para EC2 |
| **gp3** | Tipo de volumen EBS de propósito general (3ra generación) |
| **IOPS** | Input/Output Operations Per Second — operaciones de E/S por segundo |
| **Lambda** | Servicio serverless de AWS — ejecuta código sin gestionar servidores |
| **Serverless** | Modelo donde AWS gestiona la infraestructura; pagas solo por ejecución |
| **S3** | Simple Storage Service — almacenamiento de objetos con 11 nueves de durabilidad |
| **EFS** | Elastic File System — sistema de archivos compartido NFS |
| **NFSv4** | Network File System versión 4 — protocolo para archivos en red |
| **Glacier** | Clase de almacenamiento S3 para archivado a largo plazo |
| **Lifecycle Rule** | Regla automática que mueve datos entre clases de almacenamiento |
| **RDS** | Relational Database Service — BD administrada por AWS |
| **Multi-AZ** | Despliegue en múltiples zonas de disponibilidad para alta disponibilidad |
| **Failover** | Conmutación automática al servidor de respaldo ante fallos |
| **RPO** | Recovery Point Objective — cuántos datos puedes perder (ideal: 0) |
| **RTO** | Recovery Time Objective — cuánto tarda en recuperarse (ideal: <2min) |
| **PITR** | Point-In-Time Restore — restaurar BD a un segundo exacto |
| **ASG** | Auto Scaling Group — grupo de instancias que escala automáticamente |
| **Graviton2** | Procesador ARM diseñado por AWS, 40% más eficiente en precio |
| **Docker** | Plataforma de contenedores para empaquetar aplicaciones |
| **ECS** | Elastic Container Service — orquestación de contenedores en AWS |

---

## 💡 Argumentaciones Clave (Para el Profesor)

### ¿Por qué EC2 Staging y no seguir probando en localhost?
> Porque cada practicante tiene un SO diferente (Windows, Mac, Linux), versiones distintas de Node.js y configuraciones locales únicas. El EC2 Staging unifica todo el equipo en un solo entorno idéntico a producción, eliminando el error "en mi máquina funciona".

### ¿Por qué AWS Lambda y no solo EC2?
> Lambda es ideal para tareas asíncronas que no son constantes (cálculo de notas, reportes PDF). No pagas cuando no se usa ($0.00), a diferencia de EC2 que corre 24/7. Es la combinación óptima: EC2 para lo continuo, Lambda para lo esporádico.

### ¿Por qué PostgreSQL y no MySQL?
> MySQL era lo que se usaba en Hostinger por limitaciones del plan compartido. PostgreSQL ofrece mejor soporte ACID, tipos JSON nativos, extensiones avanzadas y es el estándar para ERPs empresariales modernos. Es una migración estratégica.

### ¿Qué pasa si se acaba el Free Tier?
> AWS Budgets notifica automáticamente al Lead Técnico cuando se alcanza el 85% ($8.50) del presupuesto de $10/mes. CloudWatch monitorea métricas críticas. La empresa nunca recibirá sorpresas en la factura.
