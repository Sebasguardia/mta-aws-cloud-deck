# 🎤 Guión de Exposición — Gonzales Ramirez Alfredo Valentino
## Etapa 1: Diagnóstico, Auditoría y Fundamentos de Red y Seguridad

> **Slide asignada:** S12 (Arquitectura de Red — Amazon VPC y Flujo Perimetral)  
> **Rol en la etapa:** 🌐 **Diseño de Topología de Redes y Tráfico Cloud**  
> **Dificultad:** 🔴 Alta  
> **Tiempo estimado:** ~5 minutos  
> **Objetivo:** Explicar a profundidad la arquitectura de red definida en Amazon VPC, la segmentación Multi-AZ en subredes públicas y privadas, las reglas de cortafuegos con Security Groups y el recorrido del paquete de datos de extremo a extremo con latencias de ~30ms.

---

### 🏷️ Etiquetas de Orientación Rápida
- `[RIGOR TÉCNICO EN REDES]` ➔ Enfatizar direccionamiento CIDR, puertos, protocolos y zonas de disponibilidad.
- `[SEÑALAR DIAGRAMA DE RED S12]` ➔ Indicar visualmente la región `us-east-1`, las subredes públicas A/B y las subredes privadas A/B.
- `[DEMOSTRACIÓN DE AISLAMIENTO]` ➔ Dejar claro por qué la base de datos es inaccesible desde el Internet público.
- `[TRAZABILIDAD DE LATENCIA END-TO-END]` ➔ Describir el viaje del paquete desde el navegador hasta la respuesta 200 OK.
- `[PASE A FINANZAS Y CIERRE]` ➔ Ceder la palabra a Sebastián Guardia para el TCO y cierre de la Etapa 1.

---

### 📑 Guión Paso a Paso

#### 1. S12 — Concepto Base de Amazon VPC (1 minuto)
`[RIGOR TÉCNICO EN REDES]`  
*"Buenas noches, profesor Huapaya, compañeros.  
Siguiendo con la arquitectura presentada por Analí, en el **Slide 12** abordamos el pilar de conectividad: **Amazon Virtual Private Cloud (Amazon VPC)**.  
Una VPC es un entorno de red virtual lógicamente aislado dentro de la nube de AWS dedicado exclusivamente a la cuenta de MTA Software.  

Definimos una topología de red con un bloque CIDR privado principal de **`10.0.0.0/16`**, lo que nos otorga hasta 65,536 direcciones IP privadas para orquestar servicios de forma holgada y sin colisiones de red."*

---

#### 2. Segmentación Multi-AZ: Subredes Públicas y Privadas (1.5 minutos)
`[SEÑALAR DIAGRAMA DE RED S12]`  
*"Para erradicar el Punto Único de Falla (SPOF) que denunció Jean Pierre en Hostinger, diseñamos una distribución **Multi-AZ** a lo largo de dos Zonas de Disponibilidad en la región de N. Virginia:
- **Zona A (`us-east-1a`)**
- **Zona B (`us-east-1b`)**

Dentro de cada zona, creamos dos tipos de subredes con propósitos estrictamente diferenciados:
1. **Subredes Públicas (Public Subnets):**  
   Cuentan con una tabla de ruteo asociada a un **Internet Gateway (IGW)**. Aquí ubicamos los componentes que requieren atender peticiones directas desde la web, como los balanceadores de carga y servicios perimetrales.
2. **Subredes Privadas (Private Subnets):**  
   `[DEMOSTRACIÓN DE AISLAMIENTO]`  
   **No tienen ruta hacia el Internet Gateway ni poseen IPs públicas**. Aquí residen el backend del ERP y la base de datos transaccional PostgreSQL. Es técnicamente imposible que un atacante desde Internet envíe paquetes directos a estas subredes, protegiendo los datos empresariales de MTA de cualquier intento de intrusión externa."*

---

#### 3. Cortafuegos Stateful: Security Groups (1 minuto)
`[RIGOR TÉCNICO EN REDES]`  
*"Sobre esta topología aplicamos los **Security Groups**, que operan como cortafuegos virtuales a nivel de interfaz de red (Capa 4):
- Son **Stateful (con estado)**: si permitimos una petición de entrada, el paquete de respuesta de salida se autoriza automáticamente.
- Aplicamos la regla del menor privilegio: el Security Group de la base de datos PostgreSQL **solo permite tráfico entrante en el puerto 5432 si proviene exclusivamente del Security Group del backend**. Cualquier otra petición que intente acceder al puerto 5432 es descartada de inmediato en la tarjeta de red de AWS."*

---

#### 4. Recorrido del Tráfico End-to-End en ~30ms (1 minuto)
`[TRAZABILIDAD DE LATENCIA END-TO-END]`  
*"Veamos cómo viaja una petición de un usuario en Lima cuando abre el ERP:
1. **Petición HTTPS (Puerto 443):** El usuario ingresa la URL en su navegador.
2. **Amazon CloudFront (+14ms):** Nuestra CDN con puntos de presencia (Edge Locations) en Sudamérica (incluyendo Lima) entrega el frontend estático en caché con latencia mínima.
3. **Amazon Route 53 (+8ms):** Resuelve el DNS con un SLA del 100% y enrutamiento optimizado por latencia.
4. **Amazon VPC (+3ms):** El tráfico dinámico ingresa por el Internet Gateway y se segmenta en las subredes correspondientes.
5. **Security Groups (+1ms):** Valida la firma del tráfico y los puertos autorizados.
6. **Amazon RDS (+4ms):** La consulta transaccional se ejecuta en la subred privada de forma cifrada.  
**Resultado:** Una respuesta **HTTP 200 OK en aproximadamente 30 milisegundos**, garantizando velocidad, alta disponibilidad y seguridad blindada."*

---

#### 5. Conclusión y Pase a Sebastián Guardia (0.5 minutos)
`[PASE A FINANZAS Y CIERRE]`  
*"Como pueden ver, la arquitectura de red es sólida, redundante y segura.  
Pero ninguna arquitectura tecnológica es viable si no tiene sentido financiero para el negocio.  
Para explicar el modelo económico de costos (TCO), el ahorro alcanzado y el roadmap hacia las siguientes etapas, le cedo la palabra a mi compañero **Sebastián Guardia Ticlla**."*

---

### 🛡️ Respuestas Rápidas para Alfredo (Preguntas del Profesor)
- **Si el profesor pregunta: ¿Por qué eligieron la región us-east-1 en lugar de sa-east-1 (São Paulo)?**  
  *Respuesta:* "São Paulo tiene un sobrecosto de entre 40% y 60% debido a la alta carga impositiva local en Brasil. La región de us-east-1 (N. Virginia) cuenta con las tarifas más bajas a nivel mundial y se conecta a Lima mediante cables submarinos de fibra óptica con ~80ms de latencia, la cual reducimos drásticamente a 15-30ms utilizando CloudFront CDN."
- **Si el profesor pregunta: ¿Cuál es la diferencia entre una subred pública y una subred privada en una VPC?**  
  *Respuesta:* "La diferencia radica exclusivamente en su tabla de ruteo: una subred pública tiene una ruta directa `0.0.0.0/0` apuntando hacia un Internet Gateway (IGW) y asigna IPs públicas a sus recursos; una subred privada no tiene ruta al IGW y sus recursos solo se comunican con IPs privadas internas."
