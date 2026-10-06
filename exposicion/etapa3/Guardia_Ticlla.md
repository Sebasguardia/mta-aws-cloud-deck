# 🎤 Guión de Exposición — Guardia Ticlla Sebastián Jesús
## Etapa 3: Seguridad Avanzada, Monitoreo y Automatización (IaC)

> **Slide asignada:** S21 (Monitoreo, Auditoría y Gestión de Recursos — FinOps)  
> **Rol en la etapa:** 📊 **Observabilidad 24/7, Alarmas Proactivas y Gobernanza FinOps**  
> **Dificultad:** 🟡 Media  
> **Tiempo estimado:** ~4.5 - 5 minutos  
> **Objetivo:** Explicar el ecosistema de observabilidad en tiempo real con Amazon CloudWatch (métricas, alarmas y logs centralizados), la disciplina de gobernanza de costos mediante Cost Allocation Tags y la optimización continua con AWS Trusted Advisor.

---

### 🏷️ Etiquetas de Orientación Rápida
- `[CONTROL OPERATIVO Y VISIBILIDAD]` ➔ Enfatizar que en la nube moderna no puedes mejorar ni proteger lo que no mides.
- `[SEÑALAR LOS 3 COMPONENTES S21]` ➔ Mostrar CloudWatch, la estrategia de Tagging y las recomendaciones de Trusted Advisor.
- `[SIMULAR ALERTA DE INCIDENTE]` ➔ Explicar el flujo de notificación automática ante fallas de infraestructura.
- `[DEFENSA DE FINOPS]` ➔ Demostrar cómo el etiquetado de recursos erradica los costos ocultos en AWS.
- `[PASE AL SIGUIENTE EXPOSITOR]` ➔ Ceder la palabra a Alfredo Gonzales para la automatización con CloudFormation e IaC.

---

### 📑 Guión Paso a Paso

#### 1. S21 — De la Reacción Pasiva a la Observabilidad Proactiva (1 minuto)
`[CONTROL OPERATIVO Y VISIBILIDAD]`  
*"Muchas gracias, Diego. Buenas noches, profesor Huapaya y compañeros.  
En el modelo antiguo de Hostinger, el equipo se enteraba de una caída del servidor porque un cliente llamaba molesto diciendo que la web arrojaba error.  
En una arquitectura de nube empresarial, esa pasividad es inaceptable: debemos tener la capacidad de detectar, diagnosticar y mitigar cualquier anomalía **antes** de que afecte la experiencia del usuario.  

En el **Slide 21**, presentamos el **Pilar 3: Monitoreo, Auditoría y FinOps**, diseñado sobre tres herramientas complementarias: Amazon CloudWatch para observabilidad técnica, Tagging de recursos para trazabilidad financiera y AWS Trusted Advisor para auditoría continua de mejores prácticas."*

---

#### 2. Amazon CloudWatch: Métricas, Alarmas y Logs Centralizados (1.5 minutos)
`[SEÑALAR LOS 3 COMPONENTES S21]`  
*"Comencemos por el núcleo de la observabilidad: **Amazon CloudWatch**.  
Implementamos tres capacidades operativas indispensables:
1. **Métricas en Tiempo Real y CloudWatch Agent:**  
   CloudWatch monitorea de forma nativa métricas del hipervisor como porcentaje de CPU, operaciones de lectura/escritura en discos EBS y volumen de tráfico de red. Además, instalamos el **CloudWatch Unified Agent** dentro del sistema operativo de cada instancia EC2 para supervisar métricas internas que el hipervisor no puede ver por aislamiento: **consumo real de memoria RAM y espacio libre en disco**.
2. **Alarmas Automatizadas con Amazon SNS:**  
   `[SIMULAR ALERTA DE INCIDENTE]`  
   Definimos umbrales de alerta rigurosos: si el uso de CPU de las instancias supera el **80% durante 5 minutos continuos** o si el balanceador registra una tasa de respuestas HTTP 5XX superior al 2%, CloudWatch dispara una alarma que envía de forma instantánea una notificación por correo electrónico y webhook a Slack al Lead Técnico y al equipo de soporte para su intervención inmediata.
3. **CloudWatch Logs Centralizado:**  
   Los registros de acceso de Nginx, los errores de la aplicación Node.js y los logs del sistema operativo se transmiten a un repositorio centralizado. Configuramos una **política de retención automática de 30 días**, evitando que los logs antiguos se acumulen indefinidamente y generen costos innecesarios."*

---

#### 3. FinOps y Gobernanza: Política Estricta de Tagging (1.5 minutos)
`[DEFENSA DE FINOPS]`  
*"El segundo pilar de este slide es la disciplina de **FinOps (Gestión Financiera de la Nube)**.  
Un problema recurrente en las empresas que adoptan la nube es el descontrol de la factura: recursos huérfanos que se crean para pruebas y quedan encendidos, o la incapacidad de saber qué proyecto está generando qué gasto.  

Para evitar esto, implementamos una **Política de Etiquetado Obligatorio (Cost Allocation Tags)**:  
Cada recurso en AWS (instancia EC2, volumen EBS, bucket S3 o base RDS) debe contar obligatoriamente con cuatro etiquetas estandarizadas en pares clave-valor:
- `Environment:` Define el entorno (`Production`, `Staging`, `Development`).
- `Project:` Identifica el sistema (`MTA-ERP-Workspace`, `Strato-Studio`, `VIISION`).
- `Owner:` Identifica al responsable técnico (`DevOps-Lead`, `Practicante-TeamA`).
- `CostCenter:` Asigna el código contable de la empresa (`IT-Ops-2026`).

Gracias a esto, mediante **AWS Cost Explorer**, la gerencia de MTA puede ver con un solo clic el costo exacto generado por cada proyecto y cada equipo en el mes, garantizando transparencia absoluta y cero sorpresas en la factura."*

---

#### 4. AWS Trusted Advisor y Pase a Alfredo Gonzales (0.5 minutos)
`[SEÑALAR LOS 3 COMPONENTES S21]`  
*"Finalmente, integramos **AWS Trusted Advisor**, que audita continuamente nuestra arquitectura en cinco categorías: optimización de costos, seguridad perimetral, tolerancia a fallos, rendimiento y límites de servicio.  

`[PASE AL SIGUIENTE EXPOSITOR]`  
Con CloudWatch y FinOps tenemos control y visibilidad total.  
Sin embargo, administrar toda esta red, balanceadores y servidores manualmente desde la consola web sería ineficiente y propenso a errores humanos.  
Para explicar cómo automatizamos y versionamos el 100% de la infraestructura mediante Infraestructura como Código y pipelines de CI/CD, le cedo la palabra a mi compañero **Alfredo Gonzales Ramirez**."*

---

### 🛡️ Respuestas Rápidas para Sebastián (Preguntas del Profesor)
- **Si el profesor pregunta: ¿Cuál es la diferencia entre Amazon CloudWatch y AWS CloudTrail?**  
  *Respuesta:* "Tienen propósitos distintos pero complementarios, profesor: CloudWatch monitorea el **rendimiento operativo y la salud de los recursos** (CPU, memoria, tráfico de red, logs de aplicación y alarmas); CloudTrail audita la **actividad de gobierno y llamadas a las APIs de AWS** (registra quién inició sesión, qué usuario ejecutó una acción, a qué hora y desde qué dirección IP)."
- **Si el profesor pregunta: ¿Por qué es necesario el CloudWatch Unified Agent para monitorear memoria RAM?**  
  *Respuesta:* "Porque el hipervisor Nitro de AWS opera por fuera de la máquina virtual por razones estrictas de aislamiento y privacidad. Puede medir el consumo de ciclos de reloj de la CPU física y los paquetes de red, pero la memoria RAM es administrada internamente por el kernel de Linux. El agente actúa como un sensor interno autorizado que envía esa telemetría a CloudWatch."
