# ❓ Preguntas del Profesor — Etapa 1

> **Preparación para Q&A** — Respuestas argumentadas para cada posible pregunta.

---

## 🏢 Sobre la Empresa (Bloque 1)

### P1: ¿MTA Software es una empresa real?
> **R:** Sí, Multiservicios Tecnoindustrial Acosta S.A.C. es una empresa real registrada donde realizamos nuestras prácticas pre-profesionales. El área de TI opera bajo el nombre comercial MTA Software.

### P2: ¿Qué ventaja tiene un modelo B2B sobre un B2C?
> **R:** En B2B, los contratos suelen ser más grandes y estables. MTA desarrolla soluciones a medida para empresas que buscan automatizar operaciones, lo que genera ingresos recurrentes y proyectos de largo plazo. B2C tendría más usuarios pero menores márgenes por transacción.

### P3: ¿Por qué el equipo es 100% remoto?
> **R:** Es una decisión estratégica de la empresa. Permite reclutar talento de cualquier ubicación geográfica, reduce costos de oficina y se alinea con la tendencia actual de la industria tech. Además, todos son practicantes de últimos ciclos que combinan estudios con trabajo.

---

## 🔍 Sobre el Diagnóstico (Bloque 2)

### P4: ¿Qué es un SPOF y por qué es tan grave?
> **R:** SPOF = Single Point of Failure. Es cualquier componente que, si falla, hace caer todo el sistema. En MTA, el servidor único de Hostinger es el SPOF: si tiene una caída, se paralizan simultáneamente el ERP, las demos de clientes y toda la operación.

### P5: ¿No podrían simplemente comprar un plan más caro en Hostinger?
> **R:** No. Los problemas son estructurales del modelo de hosting compartido, no del plan. Hostinger no ofrece Multi-AZ, Auto Scaling, IAM granular ni CI/CD. Incluso el plan premium sigue siendo un servidor compartido con un solo centro de datos.

### P6: ¿Qué tan real es el error "en mi máquina funciona"?
> **R:** Es un problema documentado en la industria, conocido como "works on my machine". Ocurre cuando los entornos de desarrollo (localhost) difieren del entorno de producción en versiones de SO, librerías, variables de entorno o configuraciones. Es la razón principal por la que se inventaron Docker y los entornos de staging.

### P7: ¿Por qué los practicantes no tienen acceso al servidor?
> **R:** Por seguridad. Las credenciales root de Hostinger son peligrosas si se comparten con 10 personas sin control. Pero esto genera un cuello de botella: los 4 leads deben hacer cada despliegue manualmente. AWS IAM resuelve esto con accesos granulares individuales.

---

## ☁️ Sobre la Propuesta AWS (Bloque 3)

### P8: ¿Qué es el AWS CAF y por qué lo usan?
> **R:** El Cloud Adoption Framework (CAF) es el marco metodológico oficial de AWS para guiar migraciones. Lo usamos porque da estructura y justificación a nuestra propuesta — no estamos improvisando, estamos siguiendo las mejores prácticas de la industria.

### P9: ¿Por qué `us-east-1` y no `sa-east-1` (São Paulo)?
> **R:** São Paulo es 40-60% más cara por impuestos brasileños (ICMS). La latencia de us-east-1 a Lima (~80ms) se reduce a 15-30ms con CloudFront CDN. El ahorro económico es significativo y la experiencia del usuario no se ve afectada.

### P10: ¿El Free Tier es realmente gratis? ¿Cuál es la trampa?
> **R:** No hay trampa. AWS ofrece Free Tier como estrategia para que las empresas adopten su plataforma. Algunos servicios son gratis los primeros 12 meses (EC2, RDS, S3), otros son gratis permanentemente (IAM, CloudFront 1TB, Budgets). Nosotros configuramos AWS Budgets con alerta a $10 para controlar cualquier gasto.

### P11: ¿Qué pasa después de los 12 meses del Free Tier?
> **R:** Los costos de EC2, RDS y S3 empezarían a cobrar, pero con las instancias pequeñas elegidas (t2.micro), los costos seguirían siendo muy bajos (estimado $15-20/mes vs $35 de Hostinger). Servicios como CloudFront (1TB), IAM y Budgets siguen siendo gratis permanentemente.

### P12: ¿Qué es el Modelo de Responsabilidad Compartida?
> **R:** AWS se encarga de la seguridad DE la nube (hardware, centros de datos, red física). Nosotros nos encargamos de la seguridad EN la nube (datos, accesos, cifrado, configuración de IAM y Security Groups).

### P13: ¿Por qué PostgreSQL en vez de MySQL?
> **R:** MySQL era lo que permitía Hostinger. PostgreSQL es superior para ERPs: mejor soporte ACID, tipos JSON nativos, extensiones avanzadas (PostGIS, hstore) y es el estándar de la industria para sistemas transaccionales complejos. Es una migración estratégica del motor de BD.

### P14: ¿Qué es Multi-AZ y por qué es importante?
> **R:** Multi-AZ = desplegar recursos en múltiples Zonas de Disponibilidad. Las AZs son centros de datos físicamente separados pero interconectados dentro de una región. Si una zona cae (ej: por un terremoto), la otra sigue operando. Es la base de la tolerancia a fallos.

### P15: ¿Cuánto tardaría un failover si cae una zona?
> **R:** Route 53 detecta la caída automáticamente y redirige el tráfico. Para RDS Multi-AZ, el failover toma entre 60 y 120 segundos con RPO = 0 (cero pérdida de datos).

---

## 💡 Consejos Generales para el Q&A

1. **Si no sabes la respuesta:** Di *"Esa es una excelente pregunta. Permítame consultarla con mi equipo"* y pasa la pregunta al compañero que corresponda.
2. **Si la pregunta es sobre un slide que no es tuyo:** Di *"Eso lo cubrió mi compañero [nombre] en la slide [X]. [Nombre], ¿podrías ampliar?"*
3. **Siempre argumenta con datos:** No digas solo "porque es mejor". Di "porque AWS ofrece 99.95% de disponibilidad con Multi-AZ, mientras que Hostinger no tiene SLA equivalente".
4. **Usa los términos técnicos correctos:** SPOF, Multi-AZ, IAM, CAF, TCO — demuestran que dominas el tema.
