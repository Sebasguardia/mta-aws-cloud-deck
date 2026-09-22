// src/data/team.js
export const projectMeta = {
  institution: "SENATI",
  course: "TECNOLOGÍA CLOUD CON AWS",
  stageNumber: "ETAPA 01",
  stageTitle: "Diagnóstico de la Empresa y Fundamentos Cloud",
  
  // Datos del trabajo de investigación y equipo académico de SENATI
  academic: {
    institution: "SENATI",
    course: "TECNOLOGÍA CLOUD CON AWS",
    instructor: "Huapaya Huapaya Arturo Florencio",
    projectType: "Trabajo de Investigación Grupal",
    researchTeam: [
      { id: 1, name: "Jara Vega Analí", role: "Integrante" },
      { id: 2, name: "Estilo Ratache Diego Rafael", role: "Integrante" },
      { id: 3, name: "Suclupe López Jean Pierre", role: "Integrante" },
      { id: 4, name: "Gonzales Ramirez Alfredo Valentino", role: "Integrante" },
      { id: 5, name: "Guardia Ticlla Sebastian Jesús", role: "Integrante" },
    ],
  },

  instructor: {
    name: "Huapaya Huapaya Arturo Florencio",
    role: "Instructor / Cloud Foundations Mentor",
  },

  // Empresa investigada
  company: {
    legalName: "Multiservicios Tecnoindustrial Acosta S.A.C.",
    commercialName: "MTA Software",
    sector: "Híbrido — Metalmecánica y Desarrollo de Software Profesional",
    businessModel: "B2B (Business-to-Business)",
    mission: "Diseño y desarrollo de soluciones digitales a medida (plataformas web, aplicaciones y sistemas empresariales) para clientes que buscan automatizar y escalar sus operaciones.",
    tiTeam: {
      managersCount: 4,
      managersRole: "4 Encargados / Jefes de Área TI",
      internsCount: 10,
      internsRole: "10 Practicantes de Ingeniería (Remoto)",
      totalMembers: 14,
    },
  },

  internsCount: 10,
  managersCount: 4,
  workMode: "100% Remota",

  // 10 practicantes de la empresa investigada para simulación técnica y gobierno IAM
  // (perfiles técnicos genéricos de la empresa investigada)
  teamMembers: [
    { id: 1, name: "Practicante 01", role: "Frontend Dev", tech: "React / Vite", iamRole: "Developer-Frontend", accessLevel: "S3, CloudFront (Read/Write)" },
    { id: 2, name: "Practicante 02", role: "Frontend Dev", tech: "Next.js", iamRole: "Developer-Frontend", accessLevel: "S3, CloudFront (Read/Write)" },
    { id: 3, name: "Practicante 03", role: "Fullstack Dev", tech: "TypeScript", iamRole: "Developer-Fullstack", accessLevel: "VPC, Lambda, API Gateway" },
    { id: 4, name: "Practicante 04", role: "Backend Dev", tech: "Node.js", iamRole: "Developer-Backend", accessLevel: "EC2, ECS, VPC (Staging)" },
    { id: 5, name: "Practicante 05", role: "Backend Dev", tech: "REST APIs", iamRole: "Developer-Backend", accessLevel: "EC2, ECS, VPC (Staging)" },
    { id: 6, name: "Practicante 06", role: "UI/UX Designer", tech: "Figma / Tailwind", iamRole: "Designer-Assets", accessLevel: "S3 Assets Bucket" },
    { id: 7, name: "Practicante 07", role: "QA Engineer", tech: "Testing / Jest", iamRole: "QA-Tester", accessLevel: "CloudWatch, Staging View" },
    { id: 8, name: "Practicante 08", role: "Database Admin", tech: "PostgreSQL", iamRole: "DB-Administrator", accessLevel: "RDS, Security Groups (Isolated)" },
    { id: 9, name: "Practicante 09", role: "DevOps Junior", tech: "Git / CI/CD", iamRole: "DevOps-Junior", accessLevel: "CodePipeline, CloudFormation" },
    { id: 10, name: "Practicante 10", role: "Cloud Support", tech: "Monitoring", iamRole: "Cloud-Operator", accessLevel: "Budgets, CloudWatch Alarms" },
  ],
};
