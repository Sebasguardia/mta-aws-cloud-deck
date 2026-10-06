# 🎤 Guión de Exposición — Jara Vega Analí
## Etapa 1: Diagnóstico, Auditoría y Fundamentos de Red y Seguridad

> **Slides asignadas:** S09 (Marco de Adopción Cloud — AWS CAF) y S11 (Seguridad e Identidad — AWS IAM)  
> **Rol en la etapa:** 🔐 **Gobernanza Cloud y Ciberseguridad de Identidades (IAM)**  
> **Dificultad:** 🔴 Alta  
> **Tiempo estimado:** ~4.5 - 5 minutos  
> **Objetivo:** Exponer la metodología de migración bajo el marco AWS CAF y defender el diseño técnico de ciberseguridad perimetral basado en AWS IAM, principio de mínimo privilegio, autenticación multifactor (MFA) y el modelo de responsabilidad compartida.

---

### 🏷️ Etiquetas de Orientación Rápida
- `[POSTURA TÉCNICA Y SEGURA]` ➔ Tono de experta en ciberseguridad y gobernanza en la nube.
- `[SEÑALAR FRAMEWORK CAF]` ➔ Mostrar cómo se transforman tecnología y procesos simultáneamente.
- `[ENFATIZAR RESPONSABILIDAD COMPARTIDA]` ➔ Dejar claro qué le toca a AWS y qué le toca a MTA Software.
- `[DETALLE DE MÍNIMO PRIVILEGIO]` ➔ Explicar cómo cada practicante tiene permisos estrictos según su rol sin acceso a producción.
- `[PASE A REDES]` ➔ Ceder la palabra a Alfredo Gonzales para la topología de red VPC (S12).

---

### 📑 Guión Paso a Paso

#### 1. S09 — Marco de Adopción Cloud: AWS CAF (1.5 minutos)
`[POSTURA TÉCNICA Y SEGURA]`  
*"Muchas gracias, Jean Pierre. Buenas noches, profesor Huapaya y compañeros.  
Frente al desorden de Hostinger, migrar a la nube no podía ser un proceso improvisado de 'levantar y mover' archivos a ciegas.  
En el **Slide 09**, presentamos el **Marco de Adopción Cloud de AWS (Cloud Adoption Framework - CAF)**, una metodología oficial que utilizamos para alinear el negocio con las mejores prácticas de la industria.

`[SEÑALAR FRAMEWORK CAF]`  
El CAF nos permitió estructurar la transformación en dos perspectivas fundamentales:
1. **Perspectiva de Tecnología:**  
   - *Antes:* 10 entornos de desarrollo fragmentados en localhost y un único servidor compartido saturado.  
   - *Con AWS:* Un ecosistema unificado y homogéneo, con infraestructura administrada, cómputo aislado y disponibilidad geográfica redundante.
2. **Perspectiva de Procesos:**  
   - *Antes:* Pases a producción manuales por FTP, sin homologación, sin pruebas de integración y con caídas frecuentes.  
   - *Con AWS:* Estandarización de flujos con un entorno de Staging oficial en la nube, asegurando que el código que aprueba QA sea exactamente el mismo que se despliega ante los usuarios."*

---

#### 2. S11 — Seguridad e Identidad: AWS IAM y Modelo de Responsabilidad (2.5 minutos)
`[POSTURA TÉCNICA Y SEGURA]`  
*"Una vez ordenado el marco metodológico, pasamos al corazón de la ciberseguridad en la nube en el **Slide 11: Seguridad e Identidad con AWS IAM**.

`[ENFATIZAR RESPONSABILIDAD COMPARTIDA]`  
El primer concepto que establecemos es el **Modelo de Responsabilidad Compartida de AWS**:
- **AWS es responsable de la 'Seguridad DE la Nube':** Protege la infraestructura física global, los centros de datos, el hardware de los servidores, las redes físicas y la capa de virtualización.
- **MTA Software es responsable de la 'Seguridad EN la Nube':** Protege la configuración del sistema operativo, el cifrado de datos en reposo y en tránsito, los cortafuegos y, fundamentalmente, la gestión de identidades y accesos de sus colaboradores.

Para erradicar la peligrosa práctica de compartir contraseñas de Hostinger, diseñamos una arquitectura en **AWS IAM (Identity and Access Management)** bajo tres directrices inviolables:

1. **Sellado Absoluto de la Cuenta Root:**  
   La cuenta principal (Root) fue configurada con **Autenticación Multifactor (MFA) por token físico/aplicación**, se eliminaron todas sus llaves de acceso programático (`Access Keys`) y quedó estrictamente prohibida para tareas operativas del día a día.
2. **Principio de Mínimo Privilegio (Least Privilege / Zero Trust):**  
   `[DETALLE DE MÍNIMO PRIVILEGIO]`  
   Aprovisionamos **10 usuarios IAM individuales** (uno para cada practicante con su propio MFA), agrupados en políticas basadas en roles estrictos:
   - Los practicantes de **Frontend** solo tienen permisos sobre buckets de Amazon S3 y distribuciones de CloudFront; **tienen denegado el acceso a bases de datos**.
   - Los practicantes de **Backend** solo pueden desplegar en el servidor de Staging y microservicios; **tienen prohibido tocar producción**.
   - El practicante **DBA** es el único con permisos sobre Amazon RDS, pero únicamente a través de túneles cifrados y credenciales rotativas.
3. **Auditoría Continua con AWS CloudTrail:**  
   Cada comando, clic en la consola o llamada a la API ejecutada por cualquier usuario queda registrada de forma inmutable con su usuario, fecha, hora e IP de origen, permitiendo auditoría forense inmediata ante cualquier eventualidad."*

---

#### 3. Conclusión y Pase a Alfredo Gonzales (0.5 minutos)
`[PASE A REDES]`  
*"Con AWS IAM, blindamos las identidades y los accesos. Pero tener usuarios controlados requiere ahora construir la autopista de comunicaciones: una red privada virtual aislada de Internet.  
Para explicar el diseño de la topología de red en Amazon VPC, le cedo la palabra a mi compañero **Alfredo Gonzales Ramirez**."*

---

### 🛡️ Respuestas Rápidas para Analí (Preguntas del Profesor)
- **Si el profesor pregunta: ¿Por qué es un error usar la cuenta Root para el trabajo diario?**  
  *Respuesta:* "Porque la cuenta Root posee privilegios globales e ilimitados sobre toda la cuenta de AWS, incluyendo la eliminación de recursos críticos y facturación. Si sus credenciales se filtran, la empresa pierde el control total. La buena práctica de AWS exige sellarla con MFA y usar usuarios y roles IAM con permisos restringidos."
- **Si el profesor pregunta: ¿Qué ocurre si un practicante se retira de MTA Software?**  
  *Respuesta:* "Con IAM, la desvinculación es inmediata y limpia: el administrador desactiva el usuario o revoca sus credenciales en segundos sin afectar al resto del equipo y sin necesidad de cambiar contraseñas globales como ocurría en Hostinger."
- **Si el profesor pregunta: ¿Qué es el principio de Mínimo Privilegio?**  
  *Respuesta:* "Es la regla de seguridad que dicta que a una identidad (usuario, rol o aplicación) se le deben otorgar únicamente los permisos mínimos e indispensables que requiere para realizar su trabajo específico, y absolutamente nada más."
