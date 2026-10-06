# 🎤 Guión de Exposición — Gonzales Ramirez Alfredo Valentino
## Etapa 3: Seguridad Avanzada, Monitoreo y Automatización (IaC)

> **Slide asignada:** S22 (Infraestructura como Código con CloudFormation y Pipelines de CI/CD)  
> **Rol en la etapa:** ⚙️ **Automatización DevOps, IaC y Despliegues Continuos sin Downtime**  
> **Dificultad:** 🔴 Alta  
> **Tiempo estimado:** ~4.5 - 5 minutos  
> **Objetivo:** Explicar el principio de Infraestructura como Código (IaC) mediante plantillas declarativas en AWS CloudFormation, justificar los mecanismos de Rollback automático y Drift Detection, y describir el flujo continuo de despliegues con AWS CodePipeline y CodeDeploy.

---

### 🏷️ Etiquetas de Orientación Rápida
- `[EXCELENCIA EN DEVOPS]` ➔ Tono técnico, riguroso, enfocado en buenas prácticas de automatización y consistencia.
- `[SEÑALAR EL FLUJO S22]` ➔ Indicar el diagrama: Código YAML ➔ Stack CloudFormation ➔ Recursos en AWS.
- `[MECANISMOS DE RESILIENCIA]` ➔ Explicar el Rollback automático y la detección de desvíos (*Drift Detection*).
- `[CI/CD SIN TIEMPO DE INACTIVIDAD]` ➔ Detallar el despliegue progresivo (*Rolling Deployment*) junto al balanceador.
- `[PASE AL CIERRE MAGISTRAL]` ➔ Ceder la palabra a Analí Jara para la conclusión estratégica final de todo el proyecto.

---

### 📑 Guión Paso a Paso

#### 1. S22 — El Paradigma de Infraestructura como Código (IaC) (1.5 minutos)
`[EXCELENCIA EN DEVOPS]`  
*"Muchas gracias, Sebastián. Buenas noches, profesor Huapaya y compañeros.  
Hasta este momento de la sustentación, hemos visto una arquitectura de alto nivel: redes Multi-AZ, cómputo Graviton, bases de datos PostgreSQL y observabilidad con CloudWatch.  

Pero aquí surge una pregunta fundamental de ingeniería de software:  
*¿Qué ocurre si un desastre destruye un entorno, o si necesitamos clonar toda esta infraestructura para crear un ambiente de desarrollo idéntico para los 10 practicantes de MTA? ¿Tendríamos que pasar semanas haciendo clics en la consola web de AWS?*  

En el **Slide 22**, presentamos la respuesta de vanguardia: **Infraestructura como Código (Infrastructure as Code - IaC)** mediante **AWS CloudFormation**.  
`[SEÑALAR EL FLUJO S22]`  
Con IaC, toda la infraestructura de red, seguridad, servidores y bases de datos se define en **plantillas de texto declarativas en formato YAML**.  
Tratamos a la infraestructura exactamente igual que al software: se versiona en Git, se somete a revisión de código (*Code Review*) y se despliega de manera programática mediante Stacks (Pilas)."*

---

#### 2. Robustez de CloudFormation: Rollback y Drift Detection (1.5 minutos)
`[MECANISMOS DE RESILIENCIA]`  
*"CloudFormation nos entrega dos garantías operativas críticas que erradican el error humano:

1. **Gestión de Grafo de Dependencias y Rollback Automático:**  
   CloudFormation lee la plantilla YAML y calcula el orden matemático estricto de despliegue: primero crea la VPC, luego las subredes, luego los Security Groups y finalmente las instancias.  
   Si durante el aprovisionamiento de un stack ocurre cualquier error inesperado (como una cuota de servicio superada o un parámetro mal escrito), CloudFormation activa un **Automatic Rollback**: destruye ordenadamente lo creado y devuelve la infraestructura al último estado seguro funcional. Nunca deja recursos rotos o a medio configurar a la deriva.
2. **Detección de Desvíos (Drift Detection):**  
   Si algún practicante o administrador modifica manualmente una regla de un Security Group en la consola web sin avisar, CloudFormation detecta el desvío (*drift*) frente a la plantilla original de Git y nos permite forzar la sincronización, garantizando consistencia absoluta entre los entornos de Development, Staging y Production."*

---

#### 3. Flujo Automatizado de CI/CD: De Git a Producción (1.5 minutos)
`[CI/CD SIN TIEMPO DE INACTIVIDAD]`  
*"MTA cuenta con 10 practicantes remotos desarrollando continuamente nuevos módulos para el ERP Workspace. Para eliminar las transferencias manuales por FTP que causaban los errores 500, implementamos un pipeline automatizado de **CI/CD** con **AWS CodePipeline y AWS CodeDeploy**:

1. **Source:** El desarrollador realiza un `git push` a la rama `main` en GitHub.
2. **Build & Test:** CodePipeline detecta el commit mediante webhooks y ejecuta automáticamente las pruebas unitarias y linters en contenedores.
3. **Deploy Automatizado:** **AWS CodeDeploy** toma el paquete validado y lo despliega progresivamente en las instancias EC2 del Auto Scaling Group mediante una estrategia **Rolling Deployment (Despliegue Progresivo)** o **Blue/Green**.
4. **Zero Downtime (Cero Tiempo de Inactividad):** El Application Load Balancer retira temporalmente del tráfico a una instancia mientras se actualiza y corre sus pruebas de salud (`/healthz`). Una vez confirmada sana, le reasigna tráfico y pasa a la siguiente.  
Los clientes de MTA jamás experimentan una pantalla de mantenimiento o caída del servicio durante una actualización."*

---

#### 4. Conclusión y Pase al Cierre de Analí Jara (0.5 minutos)
`[PASE AL CIERRE MAGISTRAL]`  
*"Con CloudFormation y CI/CD, la infraestructura de MTA Software es repetible, auditable y tecnológicamente ágil.  
Habiendo expuesto los cuatro pilares avanzados de esta etapa, corresponde realizar la síntesis integral de todo el proyecto y evaluar el impacto final en el negocio.  
Para brindar el cierre magistral de toda la sustentación, le cedo la palabra a mi compañera **Analí Jara Vega**."*

---

### 🛡️ Respuestas Rápidas para Alfredo (Preguntas del Profesor)
- **Si el profesor pregunta: ¿Por qué eligieron CloudFormation en lugar de Terraform?**  
  *Respuesta:* "Porque CloudFormation es una solución nativa de AWS que no requiere gestionar infraestructura externa para el almacenamiento de archivos de estado (como buckets de S3 con bloqueo en DynamoDB que exige Terraform). Además, ofrece detección de desvíos nativa, soporte de día cero para servicios de AWS y una integración transparente con los roles IAM y políticas de seguridad corporativas."
- **Si el profesor pregunta: ¿Cómo se manejan las contraseñas sensibles en las plantillas de CloudFormation?**  
  *Respuesta:* "Nunca quemamos credenciales en texto plano dentro del código YAML. Utilizamos referencias dinámicas a **AWS Secrets Manager** o **AWS Systems Manager Parameter Store** (ejemplo: `{{resolve:ssm-secure:/mta/db/password}}`). CloudFormation inyecta el valor cifrado en memoria únicamente en el momento del despliegue, manteniéndolo seguro y fuera del control de versiones."
