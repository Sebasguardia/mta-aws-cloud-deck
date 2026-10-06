# ❓ Preguntas del Profesor — Etapa 3: Seguridad Avanzada, Monitoreo y Automatización (IaC)

> **Preparación para Q&A** — Respuestas técnicas y argumentadas para defender la selección de servicios de la Etapa 3 ante el docente Huapaya.

---

## ⚡ Bloque 1: Arquitectura Dinámica y Alta Disponibilidad (Multi-AZ, ASG, ALB)

### P1: ¿Por qué eligieron una arquitectura Multi-AZ dentro de una sola región y no Multi-Región (ej. us-east-1 y sa-east-1)?
> **Respuesta:**  
> Por el equilibrio entre **costo, complejidad y necesidad real del negocio**:
> - **Multi-AZ** proporciona tolerancia a fallos a nivel de centro de datos dentro de la misma región con latencias de sub-milisegundo (< 2 ms) y costo de replicación síncrona nulo o muy bajo. Esto nos da un SLA superior al 99.95%, suficiente para el ERP de MTA.
> - **Multi-Región** elevaría drásticamente los costos: duplicaría las bases de datos RDS con replicación transcontinental asíncrona, requeriría AWS Route 53 con enrutamiento por geolocalización y aumentaría la complejidad de resolución de conflictos de escritura en bases de datos. Para la fase actual de MTA, Multi-AZ es la mejor práctica recomendada por el Well-Architected Framework de AWS.

### P2: ¿Cómo funciona el 'Connection Draining' o 'Deregistration Delay' cuando el Auto Scaling retira una instancia?
> **Respuesta:**  
> Cuando el Auto Scaling Group decide terminar una instancia por baja demanda (`scale-in`), el Application Load Balancer no corta abruptamente las conexiones activas.  
> Se activa el **Deregistration Delay** (configurado a 300 segundos por defecto): el ALB deja de enviar nuevas peticiones a esa instancia, pero le permite completar todas las solicitudes HTTP que ya estaban en proceso. Solo cuando se agotan las conexiones activas o expira el temporizador, la instancia se apaga limpiamente, evitando que los usuarios experimenten errores 502 Bad Gateway.

### P3: ¿Por qué configuraron el umbral de Auto Scaling en 70% de CPU y no en 90%?
> **Respuesta:**  
> Porque las instancias EC2 tardan entre **2 y 4 minutos en inicializarse**, descargar el código desde el pipeline y pasar los health checks del balanceador.  
> Si fijáramos el umbral al 90%, una ráfaga súbita de tráfico saturaría el 10% restante antes de que las nuevas instancias estén operativas, provocando timeouts en los clientes. El colchón del 30% restante garantiza que el sistema atienda fluidamente la demanda mientras la nueva capacidad elástica se acopla al cluster.

---

## 🔒 Bloque 2: Seguridad Avanzada de Red (VPC, Security Groups, NACLs, Bastión)

### P4: ¿Por qué necesitan Security Groups Y Network ACLs simultáneamente? ¿No es redundancia innecesaria?
> **Respuesta:**  
> No es redundancia; es **Defensa en Profundidad**:
> - Las **Network ACLs** actúan a nivel de subred como un escudo perimétrico grueso sin estado (*stateless*). Nos permiten implementar reglas de bloqueo explícito (DENY) para rangos CIDR completos de atacantes o scanners de puertos antes de que lleguen a la capa de cómputo.
> - Los **Security Groups** operan a nivel de tarjeta de red (ENI) de la instancia con estado (*stateful*). Permiten aislamiento granular basado en pertenencia a otros grupos (por ejemplo: la base de datos solo escucha al backend, no a la subred entera).
> Si un administrador comete un error al configurar un Security Group abriendo un puerto accidentalmente, la Network ACL de la subred sigue actuando como salvaguarda impidiendo el acceso perimetral.

### P5: ¿Por qué usar un Host Bastión o AWS SSM Session Manager en lugar de abrir el puerto 22 para administración remota?
> **Respuesta:**  
> Abrir el puerto 22 a `0.0.0.0/0` en servidores backend o bases de datos expone la infraestructura a ataques continuos de fuerza bruta, escaneos de vulnerabilidades por bots y filtración de llaves privadas.  
> - El **Host Bastión** concentra todo el tráfico SSH administrativo en un único punto endurecido y auditable, con llaves restringidas y filtrado por IP de origen.
> - Con **AWS Systems Manager (SSM) Session Manager**, vamos un paso más allá: **eliminamos el puerto 22 por completo**. Las sesiones se autentican vía consola de AWS mediante credenciales IAM con MFA, los comandos quedan grabados en CloudWatch y no se requiere ninguna IP pública en los servidores internos.

### P6: ¿Cómo protegen la arquitectura contra ataques de denegación de servicio distribuido (DDoS)?
> **Respuesta:**  
> A través de dos mecanismos:
> 1. **AWS Shield Standard:** Viene habilitado por defecto y sin costo adicional para todos los clientes de AWS, protegiendo en capas 3 (Red) y 4 (Transporte) contra ataques comunes como inundaciones SYN o UDP.
> 2. **Application Load Balancer (ALB):** Actúa como un proxy inverso capa 7. Solo las peticiones HTTP válidas y bien formadas son transmitidas al backend. Si un atacante envía tráfico masivo malformado, el ALB absorbe el impacto y lo descarta en el borde de AWS, protegiendo las instancias EC2 privadas.

---

## 📊 Bloque 3: Monitoreo, FinOps y Gobernanza (CloudWatch, Tagging, Trusted Advisor)

### P7: ¿Qué diferencia existe entre Amazon CloudWatch y AWS CloudTrail?
> **Respuesta:**  
> Su propósito es complementario pero totalmente diferente:
> - **Amazon CloudWatch** es una herramienta de **rendimiento y monitoreo operativo**: mide *qué le está pasando* a los recursos (porcentaje de CPU, consumo de memoria, latencia del balanceador, métricas y alarmas en tiempo real).
> - **AWS CloudTrail** es una herramienta de **auditoría de gobernanza y seguridad**: registra *quién hizo qué llamada a la API de AWS*, desde qué dirección IP, con qué credenciales IAM y en qué fecha/hora exacta. Sirve para análisis forense y cumplimiento legal.

### P8: ¿Cómo evita la estrategia de Tagging que los costos de MTA se descontrolen?
> **Respuesta:**  
> Porque convertimos los costos en variables asignables mediante **Cost Allocation Tags**:
> Al etiquetar con `Environment` (Prod/Staging), `Project` (ERP/Strato-Studio) y `CostCenter` (IT-Ops), podemos utilizar **AWS Cost Anomaly Detection** y **AWS Budgets**. Si el entorno de Staging supera su límite mensual previsto de $25 USD, el sistema dispara automáticamente una alerta vía SNS antes de que se acumule un cobro no deseado al final del ciclo de facturación.

---

## ⚙️ Bloque 4: Infraestructura como Código (IaC) y CI/CD (CloudFormation, Pipelines)

### P9: ¿Por qué prefirieron AWS CloudFormation frente a herramientas como Terraform o Pulumi?
> **Respuesta:**  
> Para una arquitectura alojada 100% en AWS como la de MTA Software, CloudFormation ofrece beneficios estratégicos:
> 1. **Gestión de Estado Nativa y Gratuita:** No requiere configurar y proteger buckets S3 con tablas DynamoDB para el bloqueo de estado (*state locking*), ya que AWS gestiona el estado del stack internamente.
> 2. **Rollback Automático Gestionado:** Si la creación de un recurso falla a mitad del despliegue, CloudFormation destruye ordenadamente lo creado y devuelve todo al último estado funcional sin intervención manual.
> 3. **Detección de Desvíos (Drift Detection):** Identifica inmediatamente si alguien alteró una configuración a espaldas del código en la consola.
> 4. **Integración Directa:** Soporta de forma nativa políticas IAM, Secrets Manager y Systems Manager sin depender de proveedores de terceros.

### P10: ¿Qué estrategia de despliegue utiliza AWS CodeDeploy y por qué no usar un despliegue destructivo tradicional?
> **Respuesta:**  
> Utilizamos **Rolling Deployment (Despliegue Progresivo con mínima capacidad garantizada)** o **Blue/Green**:
> - En un despliegue tradicional destructivo (In-place sin balanceador), se apagan todas las instancias, se reemplaza el código y se reinicia el servicio, provocando de 5 a 15 minutos de inactividad total para los usuarios.
> - Con CodeDeploy integrado al ALB, se actualiza una instancia a la vez. Mientras la primera instancia se actualiza y corre sus pruebas de salud (`/healthz`), las restantes siguen atendiendo a los usuarios. Solo cuando la nueva versión es declarada sana, el ALB le reasigna tráfico y se procede con la siguiente. El resultado es **Zero Downtime (cero tiempo de inactividad)**.

---

## 🏆 Bloque 5: Retorno de Inversión y Conclusión Integral del Proyecto

### P11: En términos de negocio, ¿cuál es el balance final entre costo, seguridad y disponibilidad para MTA Software?
> **Respuesta:**  
> El balance es extraordinariamente positivo:
> - **Antes:** Un servidor local vulnerable en Breña, sin copias de seguridad remotas, sin alta disponibilidad, caídas frecuentes en picos de usuarios y riesgo de robo o corte eléctrico.
> - **Ahora:** Una arquitectura distribuida en dos centros de datos (Multi-AZ), con base de datos transaccional con réplica síncrona en RDS, autoescalado de 2 a 6 servidores según demanda real, blindaje perimetral de red en 5 capas, observabilidad total con CloudWatch y despliegues automáticos con CloudFormation y CI/CD.
> - **Costo:** Todo esto operando por aproximadamente **$110 a $145 USD mensuales**, optimizable con Savings Plans y políticas de ciclo de vida de S3. MTA obtiene una infraestructura de nivel corporativo al alcance de una startup peruana en crecimiento.
