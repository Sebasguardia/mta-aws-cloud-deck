# 📘 ETAPA 3 — Seguridad Avanzada, Monitoreo y Automatización (IaC)

> **Curso:** Tecnología Cloud con AWS · SENATI  
> **Docente:** Huapaya Huapaya Arturo Florencio  
> **Semana:** 8  
> **Estado:** ✅ Completada

---

## 🎯 Objetivo General de la Etapa

Completar la arquitectura de MTA Software en AWS con los pilares avanzados: **arquitectura dinámica tolerante a fallos**, **seguridad en capas de red**, **monitoreo y gobernanza de costos**, y **automatización de infraestructura como código (IaC)** con CI/CD.

---

## 📋 Estructura de Slides

| Slide | Tema | Complejidad |
|-------|------|-------------|
| **S18** | Intro Etapa 3 (transición) | 🟢 Baja |
| **S19** | Arquitectura Dinámica — Multi-AZ, Auto Scaling, ELB | 🔴 Alta |
| **S20** | Seguridad Avanzada de Red — VPC, Security Groups, ACLs, Bastión | 🔴 Alta |
| **S21** | Monitoreo y FinOps — CloudWatch, Tagging, Trusted Advisor | 🟡 Media |
| **S22** | Infraestructura como Código — CloudFormation, CI/CD | 🟡 Media |

---

## 📖 Contenido Detallado por Pilar

### 🔷 PILAR 1: Arquitectura Dinámica, de Alta Disponibilidad y Tolerante a Fallos (S19)

**Concepto central:** Diseñar una infraestructura que se adapte automáticamente a la demanda y que siga funcionando incluso si un centro de datos completo cae.

#### Distribución en Múltiples Zonas de Disponibilidad (AZs)
- Una **región de AWS** contiene mínimo 2 Zonas de Disponibilidad (AZs).
- Las AZs son **centros de datos físicamente separados** pero conectados dentro de la misma región.
- Distribuir recursos en múltiples AZs proporciona:
  - ✅ **Alta disponibilidad** — si una zona cae, la otra sigue operando.
  - ✅ **Redundancia** — datos y servicios replicados en ubicaciones independientes.

#### Amazon EC2 — Capacidad de Cómputo Escalable
- EC2 (Elastic Compute Cloud) proporciona **servidores virtuales bajo demanda**.
- Se pueden lanzar y terminar instancias según la necesidad.
- Las instancias soportan el backend de Node.js y las APIs del ERP Workspace MTA.

#### Auto Scaling + Elastic Load Balancing (ELB)
- **Amazon EC2 Auto Scaling:**
  - Ajusta **automáticamente** el número de instancias según la demanda.
  - Si hay pico de tráfico → lanza más instancias.
  - Si hay baja demanda → reduce instancias para ahorrar.
  - Política configurada: escalar cuando CPU > 70%.
- **Elastic Load Balancing (ELB):**
  - Distribuye el tráfico entrante entre las instancias disponibles.
  - Si una instancia falla, ELB deja de enviarle tráfico automáticamente.
  - Trabaja en conjunto con Auto Scaling para una arquitectura **completamente elástica**.

**Resultado:** La arquitectura reacciona y se mantiene en línea de manera **automática** ante picos o fallas, sin intervención humana.

> **Palabras clave:** Multi-AZ, Zonas de Disponibilidad, EC2, Auto Scaling, ELB, elasticidad, alta disponibilidad, tolerancia a fallos.

---

### 🔷 PILAR 2: Seguridad Avanzada de Red (S20)

**Concepto central:** Protección de la infraestructura en **múltiples capas** usando Amazon VPC como base aislada.

#### Configuración de Amazon VPC
- **VPC (Virtual Private Cloud):** Entorno aislado en la nube con red virtual personalizada.
- **Segmentación en subredes:**
  - **Subredes públicas:** Acceso directo a Internet vía Internet Gateway (IGW) — para servidores web y balanceadores.
  - **Subredes privadas:** **Sin acceso directo a Internet** — para bases de datos y recursos críticos. Capa fundamental de seguridad.
- **Tablas de rutas:** Definen cómo se mueve la información dentro de la VPC y hacia/desde Internet.

#### Control de Tráfico — Security Groups (Grupos de Seguridad)
- Actúan como **cortafuegos virtuales a nivel de instancia**.
- Control granular del tráfico entrante y saliente.
- Reglas configuradas por: **origen, puertos y protocolos** (TCP, UDP, ICMP).
- Operan **fuera del sistema operativo** de la instancia → refuerzo externo.

#### Seguridad a Nivel de Subred — Network ACLs
- **Listas de Control de Acceso** a nivel de subred (no de instancia).
- Complementan los Security Groups con una **segunda capa de filtrado**.
- Regulan tráfico entrante y saliente de subredes completas.

#### Hosts Bastión — Acceso Seguro
- Punto de entrada **controlado y seguro** desde el exterior hacia subredes privadas.
- Los desarrolladores se conectan al bastión, y desde ahí acceden a los recursos internos.
- **Minimiza la exposición directa** de la infraestructura interna.

**Capas de seguridad (de afuera hacia adentro):**
1. 🌐 Internet Gateway → solo subredes públicas
2. 🔒 Network ACLs → filtrado a nivel de subred
3. 🛡️ Security Groups → filtrado a nivel de instancia
4. 🏰 Host Bastión → acceso controlado a subredes privadas
5. 🗄️ Subredes Privadas → BD y recursos críticos aislados

> **Palabras clave:** VPC, subredes públicas/privadas, Internet Gateway, Security Groups, Network ACLs, Host Bastión, defensa en capas, cortafuegos virtual.

---

### 🔷 PILAR 3: Monitoreo, Auditoría y Gestión de Recursos (S21)

**Concepto central:** Visibilidad total del estado de la infraestructura y control estricto del presupuesto.

#### Amazon CloudWatch — Supervisión y Monitoreo
- **Métricas en tiempo real** de instancias EC2:
  - Utilización de CPU
  - Lecturas/escrituras de disco
  - Tráfico de red
- **Alarmas automatizadas:** Notifican ante anomalías o umbrales superados.
  - Ejemplo: CPU > 80% durante 5 minutos → alerta al Lead Técnico.
- **Centralización de logs:** Todos los registros de servicios y apps en un solo lugar.
  - Facilita auditoría, resolución de problemas y supervisión general.

#### Control de Costos — Etiquetado de Recursos (Tagging)
- **Tags (etiquetas):** Pares clave-valor asignados a cada recurso AWS.
  - Ejemplo: `Entorno: producción`, `Proyecto: Strato-Studio`, `Equipo: frontend`
- **Beneficios:**
  - Filtrado y organización de recursos.
  - **Asignación precisa de costos** por proyecto o equipo.
  - Automatización basada en etiquetas.

#### AWS Trusted Advisor
- Servicio que **evalúa continuamente** la infraestructura.
- Identifica oportunidades de:
  - 💰 Ahorro de costos
  - 🔒 Mejoras de seguridad
  - ⚡ Optimización de rendimiento
  - 🔄 Tolerancia a fallos
- Modelo de **mejora continua** para la gestión del presupuesto.

> **Palabras clave:** CloudWatch, métricas, alarmas, logs, tagging, etiquetado de costos, Trusted Advisor, FinOps, gobernanza.

---

### 🔷 PILAR 4: Automatización e Infraestructura como Código — IaC (S22)

**Concepto central:** Tratar la infraestructura como código fuente — versionable, automatizable y repetible.

#### AWS CloudFormation
- **Herramienta principal de IaC** en AWS.
- Permite crear y gestionar recursos mediante **plantillas de texto** (YAML/JSON).
- Toda la infraestructura (EC2, VPC, ELB, RDS) se define en archivos de código.
- **Beneficios:**
  - Infraestructura versionable en Git como cualquier código.
  - Si algo falla, se puede hacer rollback completo.
  - Elimina configuraciones manuales propensas a errores.

#### Despliegues Automatizados y Repetibles
- Las plantillas CloudFormation permiten:
  - **Replicar ambientes** (dev, staging, producción) de forma idéntica.
  - **Estandarizar** toda la infraestructura de MTA Software.
  - **Cero errores manuales** — el código define exactamente qué se crea.

#### CI/CD — Integración y Entrega Continua
- **AWS CodeDeploy:** Automatiza la implementación de aplicaciones en EC2.
- **AWS CodePipeline:** Configura el flujo completo de CI/CD:
  1. Desarrollador hace push a GitHub
  2. Pipeline detecta el cambio automáticamente
  3. Ejecuta pruebas (test)
  4. Despliega en staging
  5. Promueve a producción tras aprobación
- **Resultado:** MTA puede lanzar actualizaciones de manera **rápida, confiable y sin intervención manual**.

> **Palabras clave:** IaC, CloudFormation, plantillas YAML, CI/CD, CodeDeploy, CodePipeline, despliegue automatizado, infraestructura versionable.

---

## 🔑 Glosario de Términos Clave

| Término | Definición |
|---------|-----------|
| **Multi-AZ** | Distribución de recursos en múltiples zonas de disponibilidad para tolerancia a fallos |
| **Auto Scaling** | Servicio que ajusta automáticamente el número de instancias según la demanda |
| **ELB** | Elastic Load Balancing — distribuye tráfico entre múltiples instancias |
| **VPC** | Virtual Private Cloud — red privada virtual aislada en AWS |
| **Security Groups** | Cortafuegos virtuales a nivel de instancia (stateful) |
| **Network ACLs** | Listas de Control de Acceso a nivel de subred (stateless) |
| **Host Bastión** | Servidor de salto para acceso seguro a subredes privadas |
| **Internet Gateway** | Componente que conecta una VPC con Internet |
| **CloudWatch** | Servicio de monitoreo y alarmas de AWS |
| **Tagging** | Etiquetado de recursos con pares clave-valor para organización y costos |
| **Trusted Advisor** | Servicio que evalúa la infraestructura y recomienda mejoras |
| **FinOps** | Financial Operations — gestión financiera de la nube |
| **IaC** | Infrastructure as Code — infraestructura definida como código |
| **CloudFormation** | Servicio de IaC de AWS que usa plantillas YAML/JSON |
| **CI/CD** | Integración Continua / Entrega Continua — automatización del ciclo de vida |
| **CodeDeploy** | Servicio AWS para automatizar despliegues de aplicaciones |
| **CodePipeline** | Servicio AWS para orquestar pipelines de CI/CD |
| **YAML** | Yet Another Markup Language — formato de plantillas CloudFormation |
| **Rollback** | Reversión automática a un estado anterior ante fallos |
| **Stateful** | Recuerda el estado de las conexiones (como Security Groups) |
| **Stateless** | No recuerda el estado; evalúa cada paquete individualmente (como ACLs) |

---

## 💡 Argumentaciones Clave (Para el Profesor)

### ¿Por qué Auto Scaling y no simplemente más instancias fijas?
> Instancias fijas significan pagar 24/7 incluso cuando no hay tráfico. Auto Scaling **reacciona a la demanda real**: lanza instancias en picos y las elimina en calma. MTA es una startup — cada dólar cuenta. Pagar por lo que no se usa es inaceptable.

### ¿Por qué necesitan Security Groups Y Network ACLs?
> Son capas complementarias, no redundantes. Security Groups filtran a nivel de instancia (stateful — recuerdan conexiones). ACLs filtran a nivel de subred (stateless — evalúan cada paquete). Es el principio de **defensa en profundidad**: si una capa falla, la otra contiene la amenaza.

### ¿Por qué hosts bastión y no acceso directo?
> Exponer las subredes privadas directamente a Internet anularía todo el diseño de seguridad. El bastión actúa como **puerta de entrada controlada**: los developers se autentican en el bastión, y desde ahí acceden internamente. Si el bastión se compromete, se puede aislar sin afectar los recursos privados.

### ¿Por qué CloudFormation y no configuración manual?
> La configuración manual es **el enemigo de la consistencia**. Si configuras staging manualmente y producción manualmente, habrá diferencias invisibles. CloudFormation garantiza que dev, staging y producción sean **idénticos** porque vienen del mismo código. Además, si algo se rompe, un `rollback` restaura todo en minutos.

### ¿Por qué CI/CD es importante para MTA?
> MTA tiene 10 practicantes remotos haciendo push constantemente. Sin CI/CD, cada despliegue es manual y propenso a errores humanos. Con CodePipeline, el código pasa automáticamente por pruebas → staging → producción. Más velocidad, menos errores, más confiabilidad.
