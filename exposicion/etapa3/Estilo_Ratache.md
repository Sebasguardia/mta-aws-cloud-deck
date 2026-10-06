# 🎤 Guión de Exposición — Estilo Ratache Diego Rafael
## Etapa 3: Seguridad Avanzada, Monitoreo y Automatización (IaC)

> **Slide asignada:** S20 (Seguridad Avanzada de Red y Defensa en Capas)  
> **Rol en la etapa:** 🔒 **Ciberseguridad Perimetral, Segmentación de Red y Acceso Administrativo Seguro**  
> **Dificultad:** 🔴 Alta  
> **Tiempo estimado:** ~5 minutos  
> **Objetivo:** Explicar el modelo de ciberseguridad en profundidad dentro de Amazon VPC, demostrando la diferencia técnica entre Security Groups (*stateful*) y Network ACLs (*stateless*), y justificando el acceso administrativo seguro mediante Hosts Bastión y AWS SSM Session Manager.

---

### 🏷️ Etiquetas de Orientación Rápida
- `[RIGOR EN CIBERSEGURIDAD]` ➔ Tono analítico, preciso y con terminología técnica formal de redes.
- `[DEFENSA EN PROFUNDIDAD]` ➔ Enfatizar las 5 capas de filtrado desde Internet hasta la base de datos.
- `[DIFERENCIACIÓN TÉCNICA STATEFUL VS STATELESS]` ➔ Punto clave de evaluación del profesor Huapaya.
- `[ENCADENAMIENTO DE SECURITY GROUPS]` ➔ Demostrar cómo se referencian los grupos entre sí sin IPs fijas.
- `[PASE AL SIGUIENTE EXPOSITOR]` ➔ Ceder la palabra a Sebastián Guardia para Monitoreo y FinOps (S21).

---

### 📑 Guión Paso a Paso

#### 1. S20 — El Principio de Defensa en Profundidad (1 minuto)
`[RIGOR EN CIBERSEGURIDAD]`  
*"Muchas gracias, Jean Pierre. Buenas noches profesor Huapaya, compañeros.  
En ciberseguridad corporativa existe una máxima inviolable: **nunca confíes en una sola línea de defensa**. Si un atacante burla una barrera perimetral, la infraestructura debe contar con capas subsecuentes capaces de contener la amenaza.  

En el **Slide 20**, presentamos el diseño de **Seguridad Avanzada de Red** para MTA Software, estructurado bajo el principio de **Defensa en Profundidad (Defense-in-Depth)** a través de cinco niveles concéntricos de protección:
1. Internet Gateway (control perimetral externo).
2. Network ACLs (cortafuegos de frontera de subred).
3. Security Groups (cortafuegos de tarjeta de red por instancia).
4. Host Bastión / AWS SSM (acceso administrativo endurecido).
5. Subredes Privadas (aislamiento físico lógico de los datos)."*

---

#### 2. Network ACLs vs Security Groups: Diferenciación Técnica Crítica (2 minutos)
`[DIFERENCIACIÓN TÉCNICA STATEFUL VS STATELESS]`  
*"Una de las fortalezas clave de nuestra arquitectura es la combinación simbiótica entre **Network ACLs** y **Security Groups**:

- **Network ACLs (Listas de Control de Acceso a la Red):**  
  - Operan a nivel de **límite de subred**.
  - Son **Stateless (sin estado)**: no recuerdan las conexiones. Si abrimos el puerto 80 de entrada, debemos configurar explícitamente una regla de salida para los puertos efímeros (1024-65535) para permitir el paquete de retorno.
  - Procesan reglas ordenadas numéricamente (100, 200, 300) y admiten tanto reglas de **ALLOW como de DENY**.  
  Las usamos como un filtro grueso para bloquear bloques de IPs maliciosas conocidas antes de que toquen los servidores.

- **Security Groups (Grupos de Seguridad):**  
  - Operan a nivel de **interfaz de red elástica (ENI) de cada instancia**.
  - Son **Stateful (con estado)**: si una petición entrante es autorizada, el tráfico de respuesta saliente se permite automáticamente sin importar las reglas de salida.
  - Siguen el principio de **Default Deny**: todo el tráfico está bloqueado por defecto; solo admiten reglas de permiso (ALLOW).

`[ENCADENAMIENTO DE SECURITY GROUPS]`  
¿Cómo encadenamos estos cortafuegos?  
No utilizamos direcciones IP fijas, sino **referencias cruzadas de Security Groups**:
- El Security Group del balanceador (ALB) acepta HTTPS (443) desde Internet (`0.0.0.0/0`).
- El Security Group de las instancias EC2 del backend **solo acepta tráfico en el puerto 3000 si proviene del Security Group del ALB**.
- El Security Group de la base de datos RDS **solo acepta tráfico en el puerto 5432 si proviene del Security Group del backend**.  
Esto hace matemáticamente imposible que un atacante externo alcance la base de datos de forma directa."*

---

#### 3. Acceso Administrativo Seguro: Host Bastión y AWS SSM (1.5 minutos)
`[RIGOR EN CIBERSEGURIDAD]`  
*"¿Cómo administran los ingenieros de MTA las bases de datos o el backend si están en subredes privadas sin IP pública?  
Implementamos un **Host Bastión (Jump Box)** fortificado en la subred pública:
- Solo acepta conexiones SSH (puerto 22) filtradas exclusivamente por las IPs estáticas de MTA o VPN corporativa.
- Requiere llaves criptográficas asimétricas y autenticación multifactor (MFA).

Además, dimos un paso superior hacia la filosofía **Zero Trust** integrando **AWS Systems Manager (SSM) Session Manager**:
Esto nos permite abrir sesiones seguras en la línea de comandos de las instancias privadas directamente desde la consola web de AWS o AWS CLI mediante el agente de SSM, **sin necesidad de abrir el puerto 22 en ningún Security Group**, eliminando por completo cualquier superficie de ataque de escaneos de fuerza bruta por Internet."*

---

#### 4. Conclusión y Pase a Sebastián Guardia (0.5 minutos)
`[PASE AL SIGUIENTE EXPOSITOR]`  
*"Con este esquema de seguridad en capas, la infraestructura de MTA está completamente protegida contra accesos no autorizados.  
Pero la seguridad y la salud de la red no se pueden dar por sentadas; deben ser monitoreadas y auditadas en tiempo real 24/7.  
Para explicar el ecosistema de observabilidad con CloudWatch y la gobernanza financiera con FinOps, le cedo la palabra a mi compañero **Sebastián Guardia Ticlla**."*

---

### 🛡️ Respuestas Rápidas para Diego (Preguntas del Profesor)
- **Si el profesor pregunta: ¿Por qué tener Network ACLs si los Security Groups ya bloquean todo por defecto?**  
  *Respuesta:* "Porque los Security Groups no admiten reglas de bloqueo explícito (DENY); solo autorizan. Si detectamos un ataque de denegación de servicio o un escaneo masivo desde un rango de direcciones IP específico, la Network ACL nos permite colocar una regla DENY explícita en el número 50 y descartar ese tráfico en el borde de la subred antes de que consuma recursos de CPU en nuestras instancias."
- **Si el profesor pregunta: ¿Qué ocurre si el Host Bastión es vulnerado?**  
  *Respuesta:* "El Host Bastión está en una subred pública aislada con un IAM Role de mínimos privilegios (sin acceso al plano de control de AWS ni a datos en S3) y no guarda llaves privadas dentro de su disco. Si fuera comprometido, el atacante sigue sin tener credenciales para acceder a la base de datos, y su actividad queda inmediatamente registrada en CloudTrail y CloudWatch para aislar la instancia en segundos."
