export type Project = {
  name: string;
  description: string;
  source?: string;
  link: string;
  tools?: string[];
  role?: string;
};

export const projectsData: Project[] = [
  {
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
    name: "Fullstack Typescript Monorepo",
    description: "Using NPM workspaces, Prisma, NodeJS, React and MUI",
    link: "https://github.com/Zenoo/fullstack-typescript-monorepo",
  },
  {
    name: "Somovers",
    description: `Moving companies management software.`,
    link: "https://www.moverseas.io/login",
  },
  {
    name: "react-append-head",
    description: `Append JS & CSS files to the document's head without duplicates`,
    link: "https://github.com/Zenoo/react-append-head",
  },
  {
    name: "VideoInputPreview",
    description: `A Javascript tool that allows you to show a preview for your video inputs before actually uploading the file.`,
    link: "https://github.com/Zenoo/video-input-preview",
  },
  {
    name: "QuizJS",
    description: `A Javascript tool to create quizzes easily`,
    link: "https://github.com/Zenoo/Quiz.js",
  },
  {
    name: "CSS3 Cube",
    description: `A canvas-free, CSS3 cube. I created this to demonstrate the immense capabilities of the CSS3.`,
    link: "https://github.com/Zenoo/CSS3-Cube",
  },
  {
    name: "FormulaJS",
    description: `A Javascript tools that allows the user to input a custom formula, within your limitations.`,
    link: "https://github.com/Zenoo/FormulaJS",
  },
  {
    name: "LightQuery",
    description: `10 times smaller than jQuery (90kB => 9kB). This is a complete rewrite of the well-known jQuery library. Every method has been rewritten or replaced by another method.`,
    link: "https://zenoo.github.io/LightQuery/",
  },
  {
    name: "ImageInputPreview",
    description: `A Javascript tool that allows you to show a preview for your image inputs before actually uploading the file.`,
    link: "https://github.com/Zenoo/image-input-preview",
  },
  {
    name: "ImageResize",
    description: `A Javascript plugin that allows you to resize your Image objects or files from your image inputs directly.`,
    link: "https://github.com/Zenoo/image-resize",
  },
  {
    name: "AjaxSender",
    description: `A Javascript tool that allows you to easily send AJAX requests. Available in Browser & NodeJS.`,
    link: "https://github.com/Zenoo/ajax-sender",
  },
  {
    name: "MovingCostCalculator",
    description: `A Javascript tool that allows your users to calculate an estimate of the cost of their move.`,
    link: "https://github.com/Zenoo/moving-cost-calculator",
  },
  {
    name: "AddressSearch",
    description: `A Javascript tool for address searching with typeaheads and multiple choices. Uses Google Places API.`,
    link: "https://github.com/Zenoo/address-search",
  },
  {
    name: "SlickComplete",
    description: `A Javascript tool for an easy input autocompletion.`,
    link: "https://github.com/Zenoo/slick-complete",
  },
  {
    name: "AjaxTable",
    description: `A Javascript tool that handles your table displays asynchronously.`,
    link: "https://github.com/Zenoo/ajaxTable",
  },
  {
    name: "ExcelExport",
    description: `A Javascript tool to export your HTML tables to an Excel file.`,
    link: "https://github.com/Zenoo/excel-export",
  },
  {
    name: "SlickLoader",
    description: `A loader to use during your AJAX calls or your data processing.`,
    link: "https://github.com/Zenoo/slick-loader",
  },
  {
    name: "QuickModal",
    description: `A Javascript tool that allows you to create modals easily.`,
    link: "https://github.com/Zenoo/quickModal",
  },
  {
    name: "jQuery-csvExport",
    description: `A Javascript tool that allows you to export your HTML tables to .csv files.`,
    link: "https://github.com/Zenoo/JQuery-csvExport",
  },
  {
    name: "jQuery-pageScroller",
    description: `A jQuery plugin that allows you to create one-pages easily.`,
    link: "https://github.com/Zenoo/JQuery-pageScroller",
  },
  {
    name: "OfflineHandler",
    description: `A Javascript tool that allows your websites to be offline-accessible without going through all the trouble of setting it up yourself.`,
    link: "https://github.com/Zenoo/offline-handler",
  },
] as const;
