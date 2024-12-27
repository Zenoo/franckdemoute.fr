export type Project = {
  id: number;
  name: string;
  description: string;
  tags?: string[];
  code: string;
  demo: string;
  image?: { src: string; alt: string };
  features?: string[];
  tools: string[];
  role: string;
};

export const projectsData: Project[] = [
    {
        id: 1,
        name: '',
        description: "",
        tools: ['Express', 'MongoDB', 'OpenAI API', 'AWS SES', 'AWS S3', 'Node Mailer', 'Joi', 'Puppeteer', 'EC2', 'PM2', 'Nginx'],
        role: 'Full Stack Developer',
        code: '',
        demo: '',
    },
    {
        id: 2,
        name: '',
        description: '',
        tools: ['NextJS', 'Tailwind CSS', "Google Maps", "NestJS", "TypeScript", "MySQL", "AWS S3", "Sun-Editor", "Gmail Passkey"],
        role: 'Full Stack Developer',
        code: '',
        demo: '',
    },
    {
        id: 3,
        name: '',
        description: '',
        tools: ['React', 'Bootstrap', 'SCSS', 'Stripe', 'Express', 'TypeScript', 'MongoDB', 'Azure Blob', 'OpenAI API', 'Replicate AI', 'Cronjob', 'JWT'],
        code: '',
        role: 'Full Stack Developer',
        demo: '',
    },
    {
        id: 4,
        name: '',
        description: "",
        tools: ['NextJS', 'Material UI', 'Redux', 'Sun Editor', "Calendar"],
        code: '',
        demo: '',
        role: 'Full Stack Developer',
    }
] as const;


// Do not remove any property.
// Leave it blank instead as shown below

// {
//     id: 1,
//     name: '',
//     description: "",
//     tools: [],
//     role: '',
//     code: '',
//     demo: '',
// },