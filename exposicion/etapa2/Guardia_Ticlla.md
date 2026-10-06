# 🎤 Guión de Exposición — Guardia Ticlla Sebastián Jesús
## Etapa 2: Servicios Core, Almacenamiento y Bases de Datos

> **Slides asignadas:** S12b (Transición a Etapa 2) y S13 (Cómputo — Staging Unificado con EC2 y EBS gp3)  
> **Rol en la etapa:** 🚀 **Apertura de la Etapa 2 y Entorno de Staging Unificado**  
> **Dificultad:** 🟡 Media  
> **Tiempo estimado:** ~4.5 minutos  
> **Objetivo:** Iniciar la sustentación de la Etapa 2 conectando con los logros de la Etapa 1 y defender la implementación del entorno de pruebas centralizado (Staging) para erradicar las discrepancias de desarrollo en localhost.

---

### 🏷️ Etiquetas de Orientación Rápida
- `[APERTURA FLUIDA Y CONTINUIDAD]` ➔ Tono seguro, profesional, dando la bienvenida al segundo bloque del proyecto.
- `[CONECTAR CON EL DIAGNÓSTICO]` ➔ Recordar que en la Etapa 1 se detectó el problema de "en mi máquina funciona".
- `[ESPECIFICACIÓN TÉCNICA EC2]` ➔ Mencionar instancia `t3.micro`/`t4g.micro`, almacenamiento EBS gp3 con 3,000 IOPS base sostenidos.
- `[PIPELINE DE HOMOLOGACIÓN]` ➔ Explicar los 5 pasos del flujo de Staging antes de llegar a producción.
- `[PASE AL SIGUIENTE EXPOSITOR]` ➔ Ceder la palabra a Analí Jara para el cómputo elástico de producción y serverless.

---

### 📑 Guión Paso a Paso

#### 1. S12b — Apertura de la Etapa 2 y Visión de Servicios Core (1.5 minutos)
`[APERTURA FLUIDA Y CONTINUIDAD]`  
*"Buenas noches, profesor Huapaya, compañeros.  
Bienvenidos a la **Etapa 2: Aprovisionamiento de Servicios Core, Almacenamiento Multinivel y Bases de Datos Transaccionales**.  

En la Etapa 1 sentamos las bases: levantamos la red privada virtual (Amazon VPC) en dos zonas de disponibilidad y blindamos los accesos con AWS IAM.  
Ahora, en esta segunda etapa, toca equipar esa red con los tres motores que dan vida a MTA Software:
1. **Cómputo:** Un entorno unificado de Staging y un backend de producción elástico.
2. **Almacenamiento:** Un ecosistema desacoplado que combina bloques, archivos compartidos y almacenamiento masivo de objetos con políticas de ciclo de vida.
3. **Bases de Datos:** Un motor relacional con tolerancia a fallos y failover síncrono automático."*

---

#### 2. S13 — Pilar 1: Entorno de Pruebas y Staging Unificado (EC2 + EBS gp3) (2.5 minutos)
`[CONECTAR CON EL DIAGNÓSTICO]`  
*"Iniciamos en el **Slide 13** resolviendo el problema más frustrante que diagnosticamos en la etapa anterior:  
Los 10 practicantes de MTA desarrollaban y probaban en sus laptops personales (localhost en Windows, Linux y Mac). Esto provocaba discrepancias continuas de versiones de Node.js, fallos de dependencias en npm y caídas repentinas al subir a producción.

`[ESPECIFICACIÓN TÉCNICA EC2]`  
Para erradicar esto de raíz, aprovisionamos una **instancia Amazon EC2 dedicada exclusivamente para Staging**:
- **Tipo de instancia:** `t3.micro` o `t4g.micro` con procesador de arquitectura ARM64, cubierta al 100% bajo el AWS Free Tier (750 horas mensuales continuas).
- **Sistema Operativo:** Amazon Linux 2023 LTS, garantizando un entorno idéntico al de producción.
- **Almacenamiento:** Volumen **Amazon EBS gp3 de 30 GB** (también cubierto por la capa gratuita), que nos ofrece **3,000 IOPS base sostenidos y 125 MB/s de rendimiento** sin costo adicional por aprovisionamiento.

`[PIPELINE DE HOMOLOGACIÓN]`  
Sobre este servidor implementamos un pipeline estricto de homologación en 5 pasos:
1. El practicante sube su código a la rama `staging` de GitHub.
2. Se ejecutan automáticamente pruebas unitarias con Jest.
3. El código se construye y despliega en la instancia EC2 de Staging.
4. El Lead Técnico y el practicante de QA validan la funcionalidad en un entorno real con acceso a red y base de datos de prueba.
5. Solo tras la aprobación formal de QA, el pull request es autorizado para merge hacia producción.  

Con esto, el clásico error *'En mi máquina funciona'* desaparece por completo de la cultura de MTA Software."*

---

#### 3. Conclusión y Pase a Analí Jara (0.5 minutos)
`[PASE AL SIGUIENTE EXPOSITOR]`  
*"Tener Staging controlado garantiza calidad en el desarrollo. Pero, ¿cómo manejamos la carga pesada del backend en producción cuando miles de usuarios interactúan con el ERP?  
Para explicar nuestra estrategia de cómputo elástico con procesadores Graviton y arquitectura Serverless, le doy la palabra a mi compañera **Analí Jara Vega**."*

---

### 🛡️ Respuestas Rápidas para Sebastián (Preguntas del Profesor)
- **Si el profesor pregunta: ¿Por qué eligieron volúmenes EBS gp3 en lugar de los tradicionales gp2?**  
  *Respuesta:* "Porque EBS gp3 desacopla el rendimiento del tamaño del disco. En gp2, para obtener 3,000 IOPS debías pagar por un disco de 1 TB. En gp3, AWS te entrega 3,000 IOPS y 125 MB/s de forma base garantizada incluso en un disco pequeño de 30 GB, siendo además un 20% más económico por GB."
- **Si el profesor pregunta: ¿Staging comparte la base de datos de producción?**  
  *Respuesta:* "Bajo ninguna circunstancia, profesor. Staging tiene su propia instancia de base de datos aislada con datos anonimizados de prueba. Mezclar Staging con producción violaría las normas básicas de seguridad y pondría en riesgo la integridad de los datos reales de los clientes de MTA."
