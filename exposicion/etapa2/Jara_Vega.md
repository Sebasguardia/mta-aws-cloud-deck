# 🎤 Guión de Exposición — Jara Vega Analí
## Etapa 2: Servicios Core, Almacenamiento y Bases de Datos

> **Slide asignada:** S13b (Cómputo — Servicios Elásticos de Producción, Graviton y Serverless)  
> **Rol en la etapa:** ⚡ **Cómputo Avanzado, Arquitectura ARM64 y Paradigma Híbrido**  
> **Dificultad:** 🔴 Alta  
> **Tiempo estimado:** ~4.5 - 5 minutos  
> **Objetivo:** Justificar la adopción de procesadores AWS Graviton (`t4g.small`) por su relación precio-rendimiento, y defender el modelo híbrido que combina instancias elásticas de EC2 con computación Serverless (AWS Lambda y AWS Fargate).

---

### 🏷️ Etiquetas de Orientación Rápida
- `[EXCELENCIA TÉCNICA]` ➔ Demostrar dominio en microarquitectura de procesadores y patrones de diseño en la nube.
- `[DEFENSA DE GRAVITON]` ➔ Destacar el ahorro del 40% en relación precio-rendimiento de ARM64 frente a Intel x86.
- `[MODELO HÍBRIDO CLARO]` ➔ Explicar con precisión cuándo usamos EC2, cuándo usamos Lambda y cuándo Fargate.
- `[PATRONES DE USO REALES]` ➔ Mencionar los casos concretos de MTA: ERP continuo, PDFs y notificaciones en Lambda.
- `[PASE AL SIGUIENTE EXPOSITOR]` ➔ Ceder la palabra a Diego Estilo para el ecosistema de almacenamiento (S14).

---

### 📑 Guión Paso a Paso

#### 1. S13b — El Reto del Cómputo de Producción (1 minuto)
`[EXCELENCIA TÉCNICA]`  
*"Muchas gracias, Sebastián. Buenas noches, profesor Huapaya y compañeros.  
Mientras que en Staging la prioridad es la homologación con costo cero, en el entorno de **Producción** del ERP Workspace de MTA el objetivo primordial es la **eficiencia operativa y la capacidad de respuesta elástica**.  

En el **Slide 13b**, presentamos la estrategia de cómputo para producción. No caímos en el error común de alquilar una instancia sobredimensionada tradicional de Intel como una `m5.large` que cuesta más de $70 USD al mes. En su lugar, adoptamos una arquitectura de vanguardia basada en chips **AWS Graviton** y computación **Serverless**."*

---

#### 2. Selección de Procesadores AWS Graviton (Instancias `t4g.small`) (1.5 minutos)
`[DEFENSA DE GRAVITON]`  
*"¿Por qué seleccionamos la familia de instancias **`t4g.small`** para el backend de producción?  
La razón es puramente técnica y financiera:
1. **Arquitectura ARM64:** Los chips Graviton son procesadores de silicio personalizados diseñados por AWS con núcleos de 64 bits Neoverse.  
2. **Relación Precio-Rendimiento (Price-Performance):** Ofrecen hasta un **40% mejor rendimiento por dólar invertido** y consumen un 20% menos de energía frente a sus equivalentes tradicionales x86 de Intel (`t3.small`).
3. **Compatibilidad Nativa con Node.js:** El stack de MTA está construido en Node.js y TypeScript. El motor V8 de Google compila a código de máquina ARM de forma nativa y transparente. No tuvimos que modificar ni una sola línea de lógica de negocio para disfrutar de menor latencia de ejecución.

Una instancia `t4g.small` cuenta con 2 vCPUs y 2 GiB de memoria RAM por una tarifa base de solo **$0.0168 USD por hora**, convirtiéndola en la opción más rentable del mercado cloud."*

---

#### 3. Arquitectura Híbrida: EC2 + Serverless (Lambda y Fargate) (1.5 minutos)
`[MODELO HÍBRIDO CLARO]`  
*"Ahora bien, no todas las cargas de trabajo tienen el mismo patrón de consumo.  
Si ejecutáramos todas las tareas secundarias dentro del mismo servidor EC2, saturaríamos el CPU del backend del ERP.  
Por ello, diseñamos un **Modelo Híbrido Moderno** combinando tres servicios de cómputo:

1. **Amazon EC2 (`t4g.small`) ➔ Cargas de Trabajo Continuas:**  
   Sostiene el backend central del ERP Workspace, escuchando peticiones de API REST y manteniendo conexiones persistentes WebSocket para la colaboración en tiempo real entre colaboradores.
2. **AWS Lambda ➔ Procesamiento Asíncrono Basado en Eventos (Event-Driven):**  
   `[PATRONES DE USO REALES]`  
   Tareas puntuales y esporádicas no deben consumir CPU del servidor principal. Cuando un practicante sube su fotografía de perfil, un trigger ejecuta una función Lambda que redimensiona la imagen y la optimiza. Del mismo modo, la generación masiva de reportes contables en PDF a fin de mes o el envío de correos transaccionales se procesa en funciones Lambda efímeras que se encienden, ejecutan en segundos y se apagan, facturando al milisegundo exacto.
3. **AWS Fargate (Amazon ECS) ➔ Microservicios en Contenedores:**  
   Para servicios modulares empaquetados en contenedores Docker, Fargate nos permite ejecutar contenedores sin tener que administrar, aprovisionar ni parchar servidores subyacentes.
4. **Fundamento de Adopción y Descarte de Alternativas (Visible en el panel derecho):**  
   *(Señalando la tarjeta 04 en la izquierda y el bloque dorado de justificación en el panel derecho)*:  
   *"Profesor, como pueden observar en el panel derecho, nuestra arquitectura se sustenta en dos afirmaciones directas:  
   Primero, **el fundamento de adopción**: combinamos instancias `t4g.small` de EC2 Graviton para el backend principal por sus conexiones WebSocket persistentes y latencia uniforme menor a 30 ms sin arranques en frío, junto con AWS Lambda para tareas por lotes nocturnas a costo cero en reposo, y AWS Fargate para microservicios en contenedores inmutables.  
   Segundo, **el descarte de alternativas**: descartamos formalmente **AWS Elastic Beanstalk** porque su arquitectura de caja negra oculta la topología de red, limitando el aislamiento de nuestras subredes privadas en la VPC e impidiendo el encadenamiento fino de Security Groups mediante plantillas de CloudFormation (IaC). Asimismo, descartamos basar el 100% en Lambda por su límite de ejecución de 15 minutos y las penalizaciones de latencia en consultas continuas a PostgreSQL. Por ello, el modelo seleccionado y ganador es **Amazon EC2 + ECS/Fargate**."*

---

#### 4. Conclusión y Pase a Diego Estilo (0.5 minutos)
`[PASE AL SIGUIENTE EXPOSITOR]`  
*"Con Graviton, Serverless y contenedores garantizamos un cómputo potente, elástico y con control total.  
Pero este cómputo necesita guardar información: archivos estáticos, configuraciones compartidas y respaldos históricos.  
Para explicar el ecosistema de almacenamiento desacoplado con S3, EFS y Glacier, le cedo la palabra a mi compañero **Diego Estilo Ratache**."*

---

### 🛡️ Respuestas Rápidas para Analí (Preguntas del Profesor)
- **Si el profesor pregunta: ¿Evaluaron AWS Elastic Beanstalk para desplegar el backend?**  
  *Respuesta:* "Sí, profesor, evaluamos Elastic Beanstalk como alternativa de Plataforma como Servicio (PaaS). Sin embargo, lo descartamos porque oculta la arquitectura de red subyacente y restringe la personalización granular de nuestras subredes privadas en la VPC y las políticas de Auto Scaling. Para MTA Software, la combinación de Amazon EC2 con Graviton y ECS/Fargate nos otorga gobierno total, mayor seguridad y total compatibilidad con plantillas de CloudFormation."
- **Si el profesor pregunta: ¿Por qué no migrar el 100% del backend a AWS Lambda y prescindir de EC2?**  
  *Respuesta:* "Porque el ERP Workspace utiliza WebSockets persistentes para comunicación en tiempo real y maneja conexiones transaccionales continuas con PostgreSQL. AWS Lambda tiene límites de ejecución de 15 minutos, padece de latencias de arranque en frío (Cold Starts) y para tráfico continuo 24/7 resulta más costoso que una instancia EC2 reservada."
- **Si el profesor pregunta: ¿Qué ventaja tiene Graviton frente a un procesador AMD EPYC?**  
  *Respuesta:* "Graviton es un procesador con arquitectura RISC pura (Reduced Instruction Set Computer). Al ser diseñado internamente por AWS para su propio hipervisor Nitro, elimina el cuello de botella de traducción de instrucciones x86 complejas, entregando una mayor densidad de procesamiento de hilos de Node.js por vCPU a menor costo térmico y monetario."
