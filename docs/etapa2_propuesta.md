# Proyecto Cloud AWS — MTA Software
## Etapa 2: Aprovisionamiento de Servicios Core, Almacenamiento y Bases de Datos
> **Semana 7** | SENATI — Dirección Zonal Lima Callao | Escuela de Tecnologías de la Información

---

### Insignias de Estado & Gobernanza

![AWS](https://img.shields.io/badge/AWS-Cloud%20Practitioner-232F3E?style=for-the-badge&logo=amazon-aws&logoColor=white)
![Region](https://img.shields.io/badge/Region-us--east--1-FF9900?style=for-the-badge&logo=amazon-aws&logoColor=white)
![Presupuesto](https://img.shields.io/badge/Budget-Alert%20at%20$10.00%20USD-00C853?style=for-the-badge&logo=cashapp&logoColor=white)
![Multi-AZ](https://img.shields.io/badge/High%20Availability-Multi--AZ%20Active%2FStandby-007ACC?style=for-the-badge&logo=shield&logoColor=white)
![Free Tier](https://img.shields.io/badge/Tier-Free%20Tier%20Eligible-blueviolet?style=for-the-badge)

---

## 1. Visión General de la Etapa 2

La **Etapa 2 (Semana 7)** traslada el diagnóstico situacional y los fundamentos perimetrales estructurados en la Etapa 1 hacia el **aprovisionamiento real en consola de AWS**. El objetivo es resolver los cuellos de botella del hosting tradicional compartido de **MTA Software** (Workspace MTA, 14 colaboradores y 10 practicantes remotos P01-P10).

```mermaid
graph TD
    subgraph Staging_Environment ["Entorno de Pruebas Unificado"]
        DEV["10 Practicantes (P01..P10)"] -->|Git Push 'staging'| CI["Pipeline CI / Jest"]
        CI --> EC2_STAGE["Amazon EC2 (t2/t3.micro) + EBS gp3 (30 GB)"]
        EC2_STAGE -->|Validado sin error| PROD["Aprobación a Producción"]
    end

    subgraph Production_Cloud ["Servicios Core en Producción"]
        ALB["Application Load Balancer"] --> EC2_PROD["Amazon EC2 (t4g Graviton2)"]
        EC2_PROD --> S3["Amazon S3 Standard (Assets)"]
        EC2_PROD --> EFS["Amazon EFS (NFSv4 Multi-AZ)"]
        EC2_PROD --> RDS_PRIMARY[("Amazon RDS PostgreSQL 16\n[us-east-1a / Primary]")]
        RDS_PRIMARY -.->|Replicación Síncrona| RDS_STANDBY[("Amazon RDS PostgreSQL 16\n[us-east-1b / Standby]")]
        EC2_PROD -.->|Batch / Tareas Pesadas| LAMBDA["AWS Lambda (Serverless)"]
        S3 -.->|Ciclo de Vida >90 días| GLACIER["Amazon S3 Glacier Flexible\n(-84.3% Costo)"]
    end
```

---

## 2. Los 4 Pilares de Infraestructura

### Pilar 1: Entorno de Staging Unificado (Pre-producción)

> [!IMPORTANT]
> **Problema Resuelto**: Se elimina definitivamente la discrepancia de entornos locales (*"en mi máquina sí funciona"*). Los 10 practicantes ahora prueban contra una réplica exacta de producción en la nube.

- **Servicio Principal**: `Amazon EC2` + `Amazon EBS gp3`
- **Tipo de Instancia**: `t2.micro` / `t3.micro` (Free Tier: 750 horas/mes gratuitas)
- **Especificaciones**: 1–2 vCPUs burstable con créditos de CPU, 1 GiB RAM
- **Almacenamiento**: Volumen de 30 GB EBS gp3 (3,000 IOPS base, 125 MB/s de throughput continuo)
- **Pipeline Operativo**:
  1. `git push origin staging`
  2. Ejecución automatizada de pruebas unitarias (`Jest` + `Supertest`)
  3. Despliegue automático en la instancia Staging de EC2
  4. Revisión y validación por Tech Lead / QA
  5. Merge seguro a `main` (Producción)

---

### Pilar 2: Cómputo Elástico y Serverless

Para balancear cargas continuas y tareas asíncronas con eficiencia de costos:

![EC2](https://img.shields.io/badge/Compute-Amazon%20EC2%20Graviton2-FF9900?style=flat-square&logo=amazonec2&logoColor=white)
![Lambda](https://img.shields.io/badge/Serverless-AWS%20Lambda-ED592B?style=flat-square&logo=awslambda&logoColor=white)
![ECS](https://img.shields.io/badge/Containers-Docker%20%2B%20Amazon%20ECS-2496ED?style=flat-square&logo=docker&logoColor=white)

| Tecnología | Rol en MTA Software | Ventaja Clave | Modelo de Costo |
| :--- | :--- | :--- | :--- |
| **Amazon EC2 (t4g.small)** | Backend Node.js / Express y APIs REST continuas | Procesadores ARM Graviton2 (+40% precio/rendimiento vs x86) | Cubierto por Free Tier / On-Demand |
| **AWS Lambda** | Cálculo de notas masivas, liquidaciones y PDFs batch | Ejecución orientada a eventos con timeout de hasta 15 min | **$0.00 en reposo** (1M peticiones/mes gratis) |
| **Amazon ECS / Docker** | Contenedores modulares de Workspace MTA | Despliegues *zero-downtime* sin romper dependencias | Orquestación nativa en clúster |

---

### Pilar 3: Estrategia de Almacenamiento Unificado y Archivo

![S3](https://img.shields.io/badge/Object%20Storage-Amazon%20S3%20Standard-569A31?style=flat-square&logo=amazons3&logoColor=white)
![EFS](https://img.shields.io/badge/File%20System-Amazon%20EFS%20NFSv4-3F8624?style=flat-square&logo=amazon-aws&logoColor=white)
![Glacier](https://img.shields.io/badge/Archive-S3%20Glacier%20Flexible-005276?style=flat-square&logo=amazon-aws&logoColor=white)

```mermaid
sequenceDiagram
    autonumber
    participant App as Workspace MTA / EC2
    participant S3 as Amazon S3 Standard ($0.023/GB)
    participant EFS as Amazon EFS (NFSv4)
    participant Glacier as S3 Glacier Flexible ($0.0036/GB)

    App->>S3: Carga de fotos, multimedia e informes activos
    App->>EFS: Lectura/Escritura concurrente (10 Practicantes P01-P10)
    Note over S3,Glacier: Regla de Ciclo de Vida Automatizada (Lifecycle Rule)
    S3->>Glacier: Transición automática tras cumplir 90 días
    Note over Glacier: Ahorro del 84.3% en costo de retención
```

- **Amazon S3 Standard**: 11 nueves de durabilidad (99.999999999%) para activos multimedia de Strato Studio, VIISION y Workspace MTA.
- **Amazon EFS (NFSv4)**: Sistema de archivos elástico compartido y montable concurrentemente por los 10 practicantes a través de subredes Multi-AZ.
- **Amazon S3 Glacier Flexible Retrieval**: Política de retención que migra respaldos a los 90 días reduciendo el almacenamiento de **$0.023/GB a solo $0.0036/GB** (**ahorro del 84.3%**).

---

### Pilar 4: Bases de Datos Administradas (Alta Disponibilidad Multi-AZ)

> [!WARNING]
> **Vulnerabilidad Crítica Resuelta**: En el hosting compartido anterior, la caída de un servidor causaba la interrupción total de Workspace MTA y riesgo de pérdida de datos. Con RDS Multi-AZ, el tiempo de inactividad ante fallas de hardware es inferior a 2 minutos sin intervención humana.

![RDS](https://img.shields.io/badge/Database-Amazon%20RDS%20PostgreSQL-336791?style=flat-square&logo=postgresql&logoColor=white)
![Aurora](https://img.shields.io/badge/Next%20Phase-Aurora%20Serverless%20v2-232F3E?style=flat-square&logo=amazon-aws&logoColor=white)

```mermaid
flowchart LR
    CLIENT["API Backend (Workspace MTA)"] -->|Lectura / Escritura| MASTER[("RDS PostgreSQL (Primary)\nZona: us-east-1a")]
    MASTER -.->|Replicación Síncrona a nivel de Bloque| STANDBY[("RDS PostgreSQL (Standby)\nZona: us-east-1b")]

    style MASTER fill:#1e3a5f,stroke:#3b82f6,stroke-width:2px,color:#fff
    style STANDBY fill:#2d3748,stroke:#a0aec0,stroke-width:2px,stroke-dasharray: 5 5,color:#fff
```

#### Parámetros Técnicos de RDS PostgreSQL:
- **Versión de Motor**: PostgreSQL 16
- **Instancia Base**: `db.t3.micro` / `db.t4g.micro` con 20 GB de almacenamiento SSD
- **Esquema de Resiliencia**:
  - Instancia Principal (*Primary*) en Subred Privada A (`us-east-1a`).
  - Réplica en Espera (*Standby*) en Subred Privada B (`us-east-1b`).
- **Métricas de Tolerancia a Fallos**:
  - **RPO (Recovery Point Objective)**: **0** (cero pérdida de transacciones confirmadas gracias a la replicación síncrona).
  - **RTO (Recovery Time Objective)**: **< 60-120 segundos** (failover de DNS totalmente automatizado).
- **Copias de Seguridad**: Snapshots diarios automáticos con retención de 7 días y *Point-In-Time Restore* (PITR) a nivel de segundo.

---

## 3. Matriz de Cobertura con los 10 Practicantes Remotos

| ID Practicante | Módulo Asignado | Servicio AWS Asignado | Beneficio Operativo Inmediato |
| :---: | :--- | :--- | :--- |
| **P01 - P02** | Control de Asistencias & Biometría | Amazon EC2 + Lambda | Cómputo serverless sin saturar el servidor web central. |
| **P03 - P04** | Registro Académico & Cálculo de Notas | AWS Lambda Batch | Procesamiento asíncrono en picos bimestrales a costo $0. |
| **P05 - P06** | Contratos & Documentación Digital | Amazon S3 + Glacier | Custodia segura con cifrado SSE-AES256 y archivado económico. |
| **P07 - P08** | Proyectos Multimedia (Strato Studio) | Amazon EFS + CloudFront | Espacio de disco concurrente y entrega CDN de baja latencia. |
| **P09 - P10** | QA, Pruebas Automatizadas y CI/CD | Amazon EC2 Staging + EBS | Ambiente de pruebas homogéneo y predecible. |

---

## 4. Presupuesto y Gobernanza Financiera

> [!TIP]
> **Estrategia Financiera**: El 100% del prototipo y entorno de Staging opera dentro de la capa gratuita (**AWS Free Tier de 12 meses**), respaldado por alarmas de gobernanza.

- **AWS Free Tier Asignado**:
  - `750 hrs/mes` de Amazon EC2 t2/t3.micro
  - `750 hrs/mes` de Amazon RDS PostgreSQL db.t3.micro
  - `30 GB` de volumen Amazon EBS gp3
  - `20 GB` de almacenamiento de base de datos SSD
  - `5 GB` de almacenamiento estándar en Amazon S3
  - `1,000,000` de llamadas mensuales en AWS Lambda
- **Gobernanza Proactiva**:
  - Alarma en **AWS Budgets** con límite estricto de **$10.00 USD**.
  - Notificación automática por Amazon SNS al alcanzar el 85% ($8.50 USD).
  - Métricas CloudWatch en tiempo real sobre consumo de créditos CPU e IOPS.

---

## 5. Resumen de Slides en la Presentación

```text
Slide 13 ──> Introducción Etapa 2 (Los 3 Pilares)
Slide 14 ──> Entorno de Staging Unificado (EC2 + EBS gp3)
Slide 15 ──> Cómputo Elástico y Serverless (EC2 Graviton2 + Lambda)
Slide 16 ──> Almacenamiento Unificado y Archivo (S3 + EFS + Glacier)
Slide 17 ──> Bases de Datos Administradas (RDS PostgreSQL Multi-AZ)
Slide 18 ──> Cierre Final y Sesión de Preguntas
```

---
*Documentación generada para el equipo técnico y directivo de MTA Software y SENATI.*
