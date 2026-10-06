# 🎤 Guión de Exposición — Estilo Ratache Diego Rafael
## Etapa 2: Servicios Core, Almacenamiento y Bases de Datos

> **Slides asignadas:** S14 (Almacenamiento — Visión General) y S14b (Almacenamiento — Servicios en Detalle y Ciclo de Vida)  
> **Rol en la etapa:** 🗄️ **Ecosistema de Almacenamiento Multinivel y Políticas de Ciclo de Vida**  
> **Dificultad:** 🟡 Media  
> **Tiempo estimado:** ~4.5 - 5 minutos  
> **Objetivo:** Explicar los cuatro tipos de almacenamiento de AWS seleccionados para MTA Software (EBS, EFS, S3 y Glacier), diferenciando sus patrones de acceso y justificando el ahorro del 84% mediante Políticas de Ciclo de Vida (S3 Lifecycle Policies).

---

### 🏷️ Etiquetas de Orientación Rápida
- `[CLARIDAD EN PATRONES DE ACCESO]` ➔ Diferenciar con precisión almacenamiento por bloques, archivos y objetos.
- `[SEÑALAR MATRIZ S14]` ➔ Mostrar la tabla comparativa entre EBS, EFS y S3.
- `[DEMOSTRACIÓN DE DURABILIDAD]` ➔ Enfatizar la durabilidad del 99.999999999% (11 nueves) de Amazon S3.
- `[AHORRO CON CICLO DE VIDA]` ➔ Explicar la transición automática de S3 Standard a Glacier para recortar costos.
- `[PASE AL SIGUIENTE EXPOSITOR]` ➔ Ceder la palabra a Alfredo Gonzales para las bases de datos relacionales en Amazon RDS.

---

### 📑 Guión Paso a Paso

#### 1. S14 — Los 3 Patrones de Almacenamiento en la Nube (1.5 minutos)
`[CLARIDAD EN PATRONES DE ACCESO]`  
*"Muchas gracias, Analí. Buenas noches profesor Huapaya, compañeros.  
En el hosting compartido de Hostinger, todos los archivos convivían amontonados en un único disco duro: el sistema operativo, las fotos de los proyectos, las facturas y los respaldos. Si ese disco fallaba o se llenaba, todo el servidor colapsaba.  

En el **Slide 14**, presentamos la solución arquitectónica: el **Almacenamiento Desacoplado Multinivel**. En AWS no existe una única solución de almacenamiento para todo; seleccionamos el servicio adecuado para cada patrón de acceso:

1. **Amazon EBS (Almacenamiento de Bloques):**  
   Es el disco duro virtual conectado directamente a cada instancia EC2 a través de buses de alta velocidad. Se utiliza exclusivamente para el arranque del sistema operativo y binarios que requieren latencias de sub-milisegundo.
2. **Amazon EFS (Almacenamiento de Archivos Compartidos - NFS):**  
   Es un sistema de archivos elástico y totalmente administrado que puede ser montado simultáneamente por decenas de servidores EC2 a lo largo de diferentes Zonas de Disponibilidad. Lo utilizamos para configuraciones compartidas y archivos comunes del ERP.
3. **Amazon S3 (Almacenamiento de Objetos):**  
   `[DEMOSTRACIÓN DE DURABILIDAD]`  
   El estándar mundial de almacenamiento en la nube. Guarda archivos como objetos independientes accesibles vía HTTP/HTTPS con una **durabilidad garantizada del 99.999999999% (11 nueves)**. Aquí residen las imágenes del portafolio de Strato Studio, los documentos PDF y los assets del frontend."*

---

#### 2. S14b — Optimización y Políticas de Ciclo de Vida (S3 Lifecycle) (2.5 minutos)
`[AHORRO CON CICLO DE VIDA]`  
*"Pasamos al **Slide 14b**, donde resolvemos el gran problema del almacenamiento a largo plazo: **¿Cómo evitamos que la acumulación de datos encarezca la factura mes a mes?**  

Implementamos **Políticas de Ciclo de Vida Automatizadas (S3 Lifecycle Policies)** que mueven la información entre diferentes niveles de almacenamiento (Storage Tiers) sin requerir ninguna intervención humana:

- **Día 0 a 30 ➔ S3 Standard:**  
  Los contratos nuevos, cotizaciones recientes y assets en uso activo se guardan en S3 Standard, garantizando acceso instantáneo y alta disponibilidad. Su costo es de **$0.023 USD por GB**.
- **Día 31 a 90 ➔ S3 Standard-Infrequent Access (S3 Standard-IA):**  
  Documentos de clientes cerrados o reportes del mes pasado pasan automáticamente a Infrequent Access. Mantienen la misma velocidad de lectura inmediata, pero el costo de almacenamiento cae a **$0.0125 USD por GB**, logrando un ahorro inmediato del **45%**.
- **A partir del Día 91 ➔ S3 Glacier Flexible Retrieval:**  
  Los backups de base de datos históricos, registros contables auditables y versiones antiguas de código se trasladan automáticamente a la bóveda de Glacier. El costo se desploma a apenas **$0.0036 USD por GB al mes**.  
  `[SEÑALAR MATRIZ S14]`  
  Esto representa un **ahorro colosal del 84%** frente a mantener esos datos fríos en almacenamiento estándar.

Adicionalmente, activamos **S3 Intelligent-Tiering** para aquellos directorios con patrones de acceso impredecibles, permitiendo que el machine learning interno de AWS clasifique los objetos de forma autónoma."*

---

#### 3. Conclusión y Pase a Alfredo Gonzales (0.5 minutos)
`[PASE AL SIGUIENTE EXPOSITOR]`  
*"Con este esquema de almacenamiento, los datos de MTA están blindados contra pérdidas y su costo optimizado al máximo.  
Pero los datos transaccionales críticos del ERP requieren más que archivos: necesitan un motor de base de datos relacional de alta disponibilidad que nunca pierda una sola factura.  
Para explicar el despliegue de Amazon RDS PostgreSQL Multi-AZ, le cedo la palabra a mi compañero **Alfredo Gonzales Ramirez**."*

---

### 🛡️ Respuestas Rápidas para Diego (Preguntas del Profesor)
- **Si el profesor pregunta: ¿Cuál es la diferencia entre EBS y S3?**  
  *Respuesta:* "EBS es almacenamiento de bloques formateable que se adjunta como disco rígido a una instancia EC2 específica para correr el sistema operativo; si la instancia se apaga, no es accesible desde el exterior. S3 es almacenamiento de objetos distribuido accesible globalmente vía API REST/HTTP desde cualquier lugar con control granular de accesos."
- **Si el profesor pregunta: ¿Qué ocurre si un colaborador borra un archivo por error en S3?**  
  *Respuesta:* "Hemos activado **S3 Versioning (Control de Versiones)**. Al eliminar un archivo, AWS únicamente le coloca un 'Delete Marker' (marca de borrado), pero todas las versiones previas permanecen intactas en el bucket y pueden ser restauradas en segundos con un clic."
