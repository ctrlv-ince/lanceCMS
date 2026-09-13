export type CmsProject = {
  name: string;
  shortName: string;
  description: string;
  frontend: string;
  backend: string;
  database: string;
  accent: string;
  accentSoft: string;
  mark: string;
  lectureTopics: string[];
  studioUrl?: string;
};

export const projects: CmsProject[] = [
  {
    name: "Directus",
    shortName: "D",
    description: "An open-source headless CMS that connects directly to databases with a user-friendly interface.",
    frontend: "Angular + Tailwind CSS",
    backend: "Feathers Core",
    database: "PostgreSQL",
    accent: "#6644F4",
    accentSoft: "#F0EDFF",
    mark: "D",
    lectureTopics: ["Microprocessor History", "SAP 1", "SAP 2"],
    studioUrl: "http://127.0.0.1:4200",
  },
  {
    name: "Sanity",
    shortName: "S",
    description: "A flexible headless CMS for structured content with real-time APIs.",
    frontend: "React + Vite",
    backend: "FastAPI",
    database: "MongoDB",
    accent: "#F05A31",
    accentSoft: "#FFF0EA",
    mark: "S",
    lectureTopics: ["SAP 3", "Raspberry Pi 1"],
    studioUrl: "http://localhost:3333",
  },
  {
    name: "Decap CMS",
    shortName: "DC",
    description: "A Git-based CMS that stores content directly in a repository.",
    frontend: "SvelteKit",
    backend: "PocketBase",
    database: "SQLite",
    accent: "#13A97A",
    accentSoft: "#E9FAF4",
    mark: "DC",
    lectureTopics: ["Raspberry Pi 2", "Raspberry Pi 3"],
    studioUrl: "http://localhost:5173",
  },
];
