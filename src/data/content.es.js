// src/data/content.es.js
import { projectMeta } from "./team";

export const slidesContent = {
  s00_preloader: {
    logoText: "MTA",
    companyName: "MTA SOFTWARE",
    stage: "AWS CLOUD FOUNDATIONS · ETAPA 01",
    statusMessage: "Inicializando entorno cinemático de diagnóstico...",
    skipNotice: "Presiona ESPACIO o haz click para iniciar de inmediato",
  },

  s01_cover: {
    badge: "TECNOLOGÍA CLOUD CON AWS · ETAPA 01",
    scriptTag: "Trabajo de Investigación",
    title: "DIAGNÓSTICO DE LA EMPRESA Y FUNDAMENTOS CLOUD",
    lead: "Caso de Estudio: Modernización de Infraestructura para MTA Software",
    companyTag: "Multiservicios Tecnoindustrial Acosta S.A.C.",
    academicNotice: "SENATI · Trabajo de Investigación Grupal",
    transitionNote: "Transición cinematográfica Zoom",
  },

  s02_agenda: {
    sectionNum: "00",
    badge: "HOJA DE RUTA",
    scriptTag: "Estructura del Deck",
    title: "AGENDA DE LA PRESENTACIÓN",
    subtitle: "3 bloques temáticos diseñados para diagnosticar el problema y fundamentar la arquitectura cloud",
    blocks: [
      {
        num: "01",
        title: "LA EMPRESA",
        script: "Quiénes somos",
        description: "Modelo de negocio híbrido B2B, área de TI investigada (4 encargados + 10 practicantes) y portafolio de proyectos.",
        targetSlide: 2,
        accent: "var(--olive)",
      },
      {
        num: "02",
        title: "EL DIAGNÓSTICO",
        script: "El estado actual",
        description: "Alojamiento en Hostinger compartido, flujo de trabajo en localhost y los 3 problemas críticos que limitan la operación.",
        targetSlide: 5,
        accent: "var(--risk)",
      },
      {
        num: "03",
        title: "LA PROPUESTA CLOUD",
        script: "La solución",
        description: "Marco CAF, modelo económico Pay-as-you-go, gobierno IAM y arquitectura de red resiliente con VPC, Route 53 y CloudFront.",
        targetSlide: 8,
        accent: "var(--gold)",
      },
    ],
  },

  s03_empresa: {
    sectionNum: "01",
    badge: "BLOQUE 1 · LA EMPRESA",
    scriptTag: "Naturaleza y Sector",
    title: "MULTISERVICIOS TECNOINDUSTRIAL ACOSTA S.A.C.",
    commercialName: "MTA SOFTWARE",
    leadText: "Empresa emergente con un modelo de negocio híbrido de alto valor.",
    body: "Por un lado, abarca el rubro metalmecánico tradicional, y por otro, cuenta con una división tecnológica especializada en software profesional. En su área de TI, opera bajo un modelo B2B (Business-to-Business) desarrollando soluciones digitales a medida como plataformas web, aplicaciones y sistemas empresariales para clientes que buscan automatizar y escalar sus operaciones.",
    highlights: [
      { label: "Modelo", val: "Híbrido (Metalmecánica + Software)" },
      { label: "Enfoque TI", val: "B2B Soluciones a Medida" },
      { label: "Alcance", val: "Webs, Apps y ERPs Empresariales" },
    ],
    modalTitle: "Desglose del Modelo de Negocio B2B",
  },

  s04_equipo: {
    sectionNum: "01",
    badge: "BLOQUE 1 · LA EMPRESA",
    scriptTag: "Estructura del Área TI",
    title: "EL ÁREA DE DESARROLLO DE TI",
    subtitle: "Estructura investigada: 4 Encargados y 10 practicantes remotos",
    lead: "Estructurada por 4 encargados técnicos que coordinan un colectivo ágil de 10 practicantes en modalidad 100% remota.",
    statNumber: 14,
    statLabel: "Colaboradores Técnicos de TI",
    statSubtext: "4 Encargados / Jefes de Área + 10 Practicantes en modalidad remota",
    stackTechnologies: [
      { name: "React", role: "Interfaces dinámicas y Single Page Applications", icon: "react" },
      { name: "Next.js", role: "Server-side rendering y optimización SEO", icon: "next" },
      { name: "TypeScript", role: "Tipado estático y robustez en la lógica de negocio", icon: "ts" },
      { name: "Node.js", role: "Servicios backend y APIs RESTful", icon: "node" },
    ],
  },

  s05_portafolio: {
    sectionNum: "01",
    badge: "BLOQUE 1 · LA EMPRESA",
    scriptTag: "Carga en Producción",
    title: "PORTAFOLIO DE PROYECTOS",
    subtitle: "Dos líneas de desarrollo activas que justifican una infraestructura de alta disponibilidad",
    externalProjects: [
      {
        name: "Strato Studio",
        category: "Software Comercial Externo",
        description: "Agencia de growth y contenido web. Plataforma corporativa y portafolio de alta demanda visual.",
        status: "EN PRODUCCIÓN",
      },
      {
        name: "VIISION",
        category: "Software Comercial Externo",
        description: "Desarrollo de landing pages de conversión y módulo de ERP empresarial básico para clientes.",
        status: "EN PRODUCCIÓN",
      },
    ],
    internalProject: {
      name: "Workspace MTA",
      category: "Desarrollo Interno Propio",
      description: "ERP y ecosistema administrativo centralizado de MTA. Plataforma integral que controla registro de asistencia, notas de los 10 practicantes y estado de proyectos con estadísticas en tiempo real.",
      status: "FASE FINAL DE CONSTRUCCIÓN",
      criticalNote: "Plataforma core para la operativa de la empresa. Su caída paraliza la gestión interna.",
    },
  },

  s06_infraestructura: {
    sectionNum: "02",
    badge: "BLOQUE 2 · EL DIAGNÓSTICO",
    scriptTag: "Estado Actual",
    title: "INFRAESTRUCTURA Y TECNOLOGÍA ACTUAL",
    subtitle: "Alojamiento compartido tradicional con puntos únicos de vulnerabilidad",
    components: [
      {
        title: "Hosting Compartido en Hostinger",
        badge: "Plan Empresarial / Business",
        desc: "Un único servidor compartido donde se despliegan simultáneamente las aplicaciones de clientes externos y el ERP interno Workspace MTA.",
        riskLevel: "CRÍTICO",
      },
      {
        title: "Control de Versiones",
        badge: "Git + Repositorio GitHub",
        desc: "Repositorio centralizado donde los desarrolladores sincronizan ramas sin integración ni despliegue continuo (CI/CD).",
        riskLevel: "MODERADO",
      },
      {
        title: "Testing Fragmentado en 'Localhost'",
        badge: "Laptops Individuales",
        desc: "No existe un servidor de pruebas unificado. Las pruebas de código se realizan exclusivamente en las laptops de cada desarrollador.",
        riskLevel: "ALTO",
      },
    ],
  },

  s07_workflow: {
    sectionNum: "02",
    badge: "BLOQUE 2 · EL DIAGNÓSTICO",
    scriptTag: "Metodología de Trabajo",
    title: "FLUJO DE TRABAJO DEL EQUIPO",
    subtitle: "Dinámica 100% remota sin entornos de Staging ni automatización",
    steps: [
      { step: 1, action: "Clonar Repo", desc: "Cada dev clona el repositorio en su computadora personal." },
      { step: 2, action: "Crear Rama", desc: "Trabajo individual en ramas locales." },
      { step: 3, action: "Testing Local", desc: "Pruebas en localhost con datos simulados." },
      { step: 4, action: "Push a GitHub", desc: "Sube cambios al repositorio central." },
      { step: 5, action: "Despliegue Manual", desc: "Pase manual a Hostinger sin pipeline automatizado." },
    ],
    simulatorNote: "Simula el fallo clásico: 'En mi máquina funciona, en producción colapsa'.",
  },

  s08_limitaciones: {
    sectionNum: "02",
    badge: "BLOQUE 2 · EL DIAGNÓSTICO",
    scriptTag: "Puntos Críticos",
    title: "LOS 3 PROBLEMAS CRÍTICOS",
    subtitle: "Factores que comprometen la escalabilidad, la disponibilidad y la seguridad de MTA Software",
    problems: [
      {
        id: "escalabilidad",
        num: "01",
        title: "Falta de Flexibilidad y Escalabilidad",
        tag: "Recursos Fijos Compartidos",
        desc: "El servidor de Hostinger cuenta con CPU y RAM fijos compartidos con otros clientes del proveedor. Es incapaz de escalar dinámicamente el backend del ERP cuando todos los colaboradores marcan asistencia o consultan métricas concurrentemente.",
        impact: "Saturación del servidor y degradación del tiempo de respuesta.",
      },
      {
        id: "disponibilidad",
        num: "02",
        title: "Ausencia de Tolerancia a Fallos",
        tag: "Único Punto de Fallo (SPOF)",
        desc: "Si el servidor de Hostinger sufre una caída, colapsan simultáneamente el ERP administrativo interno y todas las demostraciones de clientes comerciales, afectando la operatividad y la credibilidad de la empresa.",
        impact: "Parálisis operativa total y pérdida de reputación comercial.",
      },
      {
        id: "seguridad",
        num: "03",
        title: "Brechas de Seguridad y Control",
        tag: "Sin Entorno de Staging",
        desc: "Sin un entorno segmentado en la nube se dificulta la gestión segura de credenciales y llaves de acceso. Los pases a producción desde computadoras locales ('funciona en mi máquina') son propensos a fallos humanos imprevistos.",
        impact: "Riesgo de fuga de datos y despliegues inestables en producción.",
      },
    ],
  },

  s09_caf: {
    sectionNum: "03",
    badge: "BLOQUE 3 · LA PROPUESTA CLOUD",
    scriptTag: "Marco Metodológico",
    title: "FRAMEWORK CAF (CLOUD ADOPTION FRAMEWORK)",
    subtitle: "Justificación de migración fundamentada en las mejores prácticas de AWS",
    concept: "Aplicando el Cloud Adoption Framework de AWS, la migración transforma principalmente las perspectivas de Tecnología y Procesos de MTA Software.",
    perspectiveTech: {
      name: "Perspectiva de Tecnología",
      before: "Localhost fragmentado en 10 laptops y 1 único servidor en Hostinger.",
      after: "Ecosistema centralizado, resiliente y de alta disponibilidad sobre AWS.",
    },
    perspectiveProc: {
      name: "Perspectiva de Procesos",
      before: "Pases manuales a producción sin pruebas en entornos idénticos a producción.",
      after: "Flujo estandarizado con entornos reales de Staging y despliegues ágiles.",
    },
  },

  s10_economia: {
    sectionNum: "03",
    badge: "BLOQUE 3 · LA PROPUESTA CLOUD",
    scriptTag: "Optimización Financiera",
    title: "ESTIMACIÓN ECONÓMICA INICIAL",
    subtitle: "Transición del modelo de costos fijos a Pay-As-You-Go con control presupuestario estricto",
    points: [
      {
        title: "Modelo Pay-As-You-Go",
        desc: "Se reemplaza el costo fijo anual de Hostinger por el pago por uso exacto de AWS. Se reduce el TCO (Total Cost of Ownership) sin incurrir en inversión inicial ni pagar por capacidad ociosa.",
      },
      {
        title: "AWS Free Tier (Capa Gratuita)",
        desc: "Aprovechamiento de los 12 meses de capa gratuita para montar los entornos de desarrollo y pruebas para los 10 practicantes a costo cero.",
      },
      {
        title: "AWS Budgets (Límite $10 USD)",
        desc: "Configuración de alertas automáticas tempranas con límite estricto de $10 USD para notificar a la gerencia antes de que se produzca cualquier exceso presupuestario.",
      },
    ],
  },

  s11_iam: {
    sectionNum: "03",
    badge: "BLOQUE 3 · LA PROPUESTA CLOUD",
    scriptTag: "Gobierno y Ciberseguridad",
    title: "SEGURIDAD Y GOBIERNO CON AWS IAM",
    subtitle: "Modelo de Responsabilidad Compartida y eliminación del cuello de botella por credenciales centralizadas",
    sharedResponsibility: "AWS protege la infraestructura física global (seguridad DE la nube); MTA Software es responsable de la protección de sus datos, identidades y configuraciones (seguridad EN la nube).",
    policies: [
      {
        title: "Eliminación de Cuentas Root Compartidas y Descentralización",
        desc: "En Hostinger, solo los 4 encargados manejaban la cuenta root maestra mientras los 10 practicantes carecían de accesos. En AWS, la cuenta raíz se sella con MFA físico y se reserva únicamente para emergencias.",
      },
      {
        title: "10 Usuarios IAM Individuales para Practicantes",
        desc: "Se crean 10 usuarios específicos (uno por cada practicante) con credenciales individuales, eliminando el cuello de botella de despliegues y logrando trazabilidad total en CloudTrail.",
      },
      {
        title: "Principio de Privilegios Mínimos (Zero Trust)",
        desc: "Segmentación estricta de permisos: los desarrolladores frontend no tienen acceso a bases de datos, y los practicantes backend operan solo sobre recursos autorizados de desarrollo y Staging.",
      },
    ],
  },

  s12_arquitectura: {
    sectionNum: "03",
    badge: "BLOQUE 3 · LA PROPUESTA CLOUD",
    scriptTag: "Arquitectura Conceptual",
    title: "ARQUITECTURA DE RED PROPUESTA",
    subtitle: "Diseño de red perimetral aislado y seguro para Workspace MTA y clientes",
    pillars: [
      {
        service: "Amazon VPC",
        desc: "Entorno de red virtual aislado y privado donde convive la lógica central de la empresa.",
      },
      {
        service: "Security Groups",
        desc: "Firewalls virtuales perimetrales que aíslan la base de datos del ERP bloqueando el acceso público.",
      },
      {
        service: "Amazon Route 53",
        desc: "Enrutamiento DNS escalable con chequeos de salud para el ERP y las plataformas de clientes.",
      },
      {
        service: "Amazon CloudFront",
        desc: "CDN global que almacena en caché frontend y multimedia, entregando respuestas en milisegundos.",
      },
    ],
  },

  s13_roadmap: {
    badge: "CONTINUIDAD DEL PROYECTO",
    scriptTag: "Línea de Tiempo",
    title: "ROADMAP DE ADOPCIÓN CLOUD",
    subtitle: "Plan curricular y evolutivo para la implementación de MTA Software en AWS",
    phases: [
      {
        phase: "ETAPA 01",
        title: "Diagnóstico y Fundamentos Cloud",
        status: "COMPLETADA",
        period: "Semana 6",
        desc: "Análisis situacional de MTA Software, justificación con AWS CAF, estimación de costos (TCO y AWS Budgets), gobierno con IAM (principio de mínimo privilegio y bloqueo root) y arquitectura conceptual de red (VPC, Route 53, CloudFront).",
        deliverables: [
          "Diagnóstico de la empresa y limitaciones de infraestructura actual",
          "Estimación económica inicial (TCO y AWS Budgets)",
          "Modelo de gobierno inicial con IAM y mínimo privilegio",
          "Diseño conceptual de arquitectura de red aislada (Amazon VPC)",
        ],
      },
      {
        phase: "ETAPA 02",
        title: "Servicios Core, Almacenamiento y BD",
        status: "SIGUIENTE HITO",
        period: "Semana 7",
        desc: "Aprovisionamiento de servidores con Amazon EC2 (instancias y volúmenes EBS), evaluación de arquitecturas serverless con AWS Lambda, almacenamiento en Amazon S3 y EFS con archivado en S3 Glacier, e implementación de base de datos administrada con Amazon RDS (PostgreSQL).",
        deliverables: [
          "Diseño de cómputo: instancias Amazon EC2, EBS y AWS Lambda",
          "Estrategia de almacenamiento: Amazon S3, EFS y S3 Glacier",
          "Implementación de base de datos: Amazon RDS PostgreSQL / Aurora",
          "Despliegue de entorno de pruebas y staging en la nube",
        ],
      },
    ],
  },

  s14_cierre: {
    badge: "CONCLUSIÓN · ETAPA 01",
    scriptTag: "Cierre de Investigación",
    title: "GRACIAS POR SU ATENCIÓN",
    subtitle: "Propuesta de arquitectura en la nube escalable, segura y económica para MTA Software",
    teamLead: "Docente: " + projectMeta.instructor.name,
    teamSummary: "5 Integrantes · Equipo de Investigación SENATI",
    institution: "SENATI · " + projectMeta.course,
    callToAction: "Espacio abierto para preguntas del jurado",
  },
};
