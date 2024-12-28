export type Project = {
  id: number;
  name: string;
  description: string;
  source?: string;
  link: string;
  features?: string[];
  tools: string[];
  role: string;
};

export const projectsData: Project[] = [
  {
    id: 1,
    name: "LaBrute",
    description: `Following the shutdown of MotionTwin web games, I joined the Eternal-Twin group's preservation effort.
          As LaBrute's lead developer, I am invested in the design and evolution of this remake. My role involves overseeing the entire development process, from initial planning to final implementation.`,
    tools: [
      "Typescript",
      "React",
      "MUI",
      "NodeJS",
      "Epxress",
      "Prisma",
      "PostgreSQL",
    ],
    role: "Lead Developer",
    link: "https://brute.eternaltwin.org/",
    source: "https://github.com/Zenoo/labrute",
  },
  {
    id: 2,
    name: "ScrapingBot.io",
    description: `This service offers an API allowing you to scrape public data from the majority of websites.
Its daily use by numerous international customers requires rigorous development and constant evolution of the service.`,
    tools: [
      "Javascript",
      "React",
      "MUI",
      "NodeJS",
      "Wordpress",
      "MySQL",
      "MongoDB",
      "Docker",
      "Kubernetes",
    ],
    role: "Lead Developer", 
    link: "https://www.scraping-bot.io/",
  },
  {
    id: 3,
    name: "Somovers",
    description: `Dedicated to moving companies, Soomovers is accessible to all employees and customers directly from the web, without needing to install a custom app.
Developed independently, it allows people to benefit from a completely online or local network tool, total dematerialization of documents, security and permanent data backup.`,
    tools: [
      "Java",
      "Scala",
      "Javascript",
      "PlayFramework",
      "React",
      "PostgreSQL",
    ],
    role: "Full Stack Developer",
    link: "https://www.moverseas.io/login",
  },
  {
    id: 4,
    name: "MUI Address Autocomplete",
    description: `A simple, straight-forward address autocomplete component for MUI.
    This tool didn't exist at the time, and I needed this feature for multiple projects.
    I got tired of copy-pasting the same code over and over, so I decided to make a library out of it and share it with the community.`,
    tools: ["React", "Autocomplete", "Google Maps", "MUI"],
    link: "https://www.npmjs.com/package/mui-address-autocomplete",
    source: "https://github.com/Zenoo/mui-address-autocomplete",
    role: "Lead Developer",
  },
  {
    id: 5,
    name: "Fullstack Typescript Monorepo",
    description: "FullStack Typescript Monorepo, using NPM workspaces. Prisma + NodeJS + React + MUI",
    tools: ["Typescript", "React", "MUI", "NodeJS", "Prisma", "PostgreSQL"],
    link: "https://github.com/Zenoo/fullstack-typescript-monorepo",
    role: "Lead Developer",
  },
] as const;
