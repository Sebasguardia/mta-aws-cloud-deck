# 🎤 Guión de Exposición — Suclupe López Jean Pierre
## Etapa 3: Seguridad Avanzada, Monitoreo y Automatización (IaC)

> **Slides asignadas:** S18 (Transición a Etapa 3 y Hoja de Ruta) y S19 (Arquitectura Dinámica, Alta Disponibilidad y Tolerancia a Fallos)  
> **Rol en la etapa:** 🚀 **Apertura de la Etapa 3 y Arquitectura Dinámica Elástica**  
> **Dificultad:** 🔴 Alta  
> **Tiempo estimado:** ~5 minutos  
> **Objetivo:** Iniciar la sustentación del bloque final de madurez Cloud y explicar el funcionamiento técnico y matemático del balanceo de carga (ALB) y el autoescalado dinámico (ASG) distribuidos en múltiples Zonas de Disponibilidad.

---

### 🏷️ Etiquetas de Orientación Rápida
- `[APERTURA ENERGÉTICA Y VISIÓN FINAL]` ➔ Tono de bienvenida a la fase cumbre de modernización de MTA.
- `[SEÑALAR LOS 4 PILARES S18]` ➔ Trazar la hoja de ruta de la Etapa 3 (Elasticidad, Seguridad, Observabilidad e IaC).
- `[EXPLICACIÓN TÉCNICA RIGUROSA S19]` ➔ Apuntar a las dos zonas (`us-east-1a` y `us-east-1b`), al ALB y al ASG.
- `[POLÍTICA DE ESCALADO CLARA]` ➔ Detallar el Target Tracking ante CPU > 70% (2 a 6 instancias `t4g.small`).
- `[PASE AL SIGUIENTE EXPOSITOR]` ➔ Ceder la palabra a Diego Estilo para el blindaje de red y ciberseguridad en capas.

---

### 📑 Guión Paso a Paso

#### 1. S18 — Apertura de la Etapa 3 y los 4 Pilares de Madurez (1.5 minutos)
`[APERTURA ENERGÉTICA Y VISIÓN FINAL]`  
*"Buenas noches, profesor Huapaya, compañeros.  
Bienvenidos a la **Etapa 3: Seguridad Avanzada, Monitoreo y Automatización (IaC)**, la fase cumbre que consolida la transformación tecnológica de MTA Software.  

En las dos etapas anteriores cimentamos la red y aprovisionamos cómputo, almacenamiento y bases de datos. Sin embargo, una arquitectura estática sigue siendo vulnerable: si ocurre un aluvión inesperado de usuarios un fin de mes o si un centro de datos sufre un siniestro, el servicio caería sin capacidad de reacción autónoma.  

`[SEÑALAR LOS 4 PILARES S18]`  
En el **Slide 18**, presentamos los **Cuatro Pilares de Madurez Empresarial** que implementamos:
1. **Arquitectura Dinámica y Elástica:** Capacidad de adaptarse automáticamente a la demanda y resistir fallos físicos de centros de datos.
2. **Seguridad Avanzada de Red:** Defensa perimetral en 5 capas con Security Groups, Network ACLs y Hosts Bastión.
3. **Monitoreo y FinOps:** Visibilidad total con CloudWatch y trazabilidad de costos por Tagging.
4. **Infraestructura como Código (IaC) y CI/CD:** Automatización total con CloudFormation y CodePipeline."*

---

#### 2. S19 — Distribución Multi-AZ y Elastic Load Balancing (1.5 minutos)
`[EXPLICACIÓN TÉCNICA RIGUROSA S19]`  
*"Pasamos al **Slide 19: Arquitectura Dinámica, de Alta Disponibilidad y Tolerante a Fallos**.  
El primer gran componente es la **Distribución Multi-AZ**:
Desplegamos los servidores en dos Zonas de Disponibilidad físicas separadas: `us-east-1a` y `us-east-1b`. Cada zona cuenta con suministro eléctrico independiente, conectividad de red aislada y protección contra desastres naturales.  

Para recibir y canalizar el tráfico entrante de los usuarios del ERP Workspace, ubicamos un **Application Load Balancer (ALB)** en las subredes públicas. El balanceador cumple tres funciones vitales:
1. **Terminación SSL/TLS:** Descarga a las instancias del trabajo pesado de cifrado HTTPS.
2. **Health Checks Activos:** Envía solicitudes periódicas (`GET /healthz`) cada 15 segundos a cada nodo backend. Si un servidor se cuelga o satura, el balanceador lo saca de la rotación en menos de 30 segundos y dirige el tráfico solo a instancias sanas.
3. **Distribución Uniforme:** Reparte las conexiones equitativamente entre ambas zonas de disponibilidad."*

---

#### 3. Amazon EC2 Auto Scaling: Elasticidad Real ante la Demanda (1.5 minutos)
`[POLÍTICA DE ESCALADO CLARA]`  
*"Detrás del balanceador, en las subredes privadas, opera el **Auto Scaling Group (ASG)**.  
En lugar de mantener 6 servidores caros encendidos día y noche de forma ociosa, configuramos un grupo elástico con parámetros inteligentes:
- **Capacidad Mínima:** 2 instancias `t4g.small` (1 en cada AZ para garantizar alta disponibilidad permanente).
- **Capacidad Deseada:** 2 instancias en operación habitual.
- **Capacidad Máxima:** 6 instancias durante picos de cierre contable o alta concurrencia.

¿Cómo reacciona el sistema ante la demanda?  
Configuramos una política de **Target Tracking Scaling** fijada al **70% de utilización promedio de CPU**:
- Si la demanda sube y el CPU supera el 70% durante 3 minutos continuos, Auto Scaling aprovisiona automáticamente nuevas instancias `t4g.small` en la AZ con menor carga y las conecta al balanceador.
- Cuando la demanda desciende por debajo del 30%, el sistema retira ordenadamente las instancias excedentes (`scale-in`) aplicando **Connection Draining**, permitiendo que las peticiones en curso terminen limpiamente sin arrojar errores a los usuarios.  
Esto nos garantiza un ahorro del 55% frente a una capacidad estática sobredimensionada."*

---

#### 4. Conclusión y Pase a Diego Estilo (0.5 minutos)
`[PASE AL SIGUIENTE EXPOSITOR]`  
*"Con Auto Scaling y ALB, el ERP de MTA se expande y se contrae de forma completamente autónoma sin intervención humana.  
Pero tener instancias elásticas en múltiples zonas requiere un blindaje de red absoluto para evitar cualquier acceso no autorizado.  
Para explicar el modelo de ciberseguridad avanzada con Security Groups y Network ACLs, le cedo la palabra a mi compañero **Diego Estilo Ratache**."*

---

### 🛡️ Respuestas Rápidas para Jean Pierre (Preguntas del Profesor)
- **Si el profesor pregunta: ¿Por qué fijaron el umbral de Auto Scaling en 70% de CPU y no en 90%?**  
  *Respuesta:* "Porque una nueva instancia EC2 tarda entre 2 y 3 minutos en inicializar, descargar dependencias y superar los health checks del balanceador. Si escaláramos al 90%, una ráfaga súbita saturaría el 10% restante antes de que las nuevas instancias estén listas, degradando el servicio. El margen del 30% absorbe el tráfico mientras la nueva capacidad se incorpora."
- **Si el profesor pregunta: ¿Qué ocurre con la sesión de un usuario si Auto Scaling apaga una instancia?**  
  *Respuesta:* "Nuestra arquitectura es **stateless** (sin estado local en los servidores). Las sesiones y tokens JWT se gestionan de forma centralizada en la base de datos o caché compartida. Además, el ALB aplica **Connection Draining** durante 300 segundos, esperando a que las transacciones activas finalicen antes de apagar la máquina."
